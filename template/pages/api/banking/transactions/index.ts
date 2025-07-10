import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await getTransactions(req, res, session);
      case 'POST':
        return await createTransaction(req, res, session);
      case 'PUT':
        return await updateTransaction(req, res, session);
      case 'DELETE':
        return await cancelTransaction(req, res, session);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Transaction API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getTransactions(req: NextApiRequest, res: NextApiResponse, session: any) {
  const {
    accountId,
    type,
    category,
    status,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    searchTerm,
    include_fraud_alerts,
    include_transfers,
    limit = '20',
    page = '1'
  } = req.query;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const skip = (pageNumber - 1) * limitNumber;

  // Build where clause based on filters
  const where: any = {
    account: {
      OR: [
        { userId: user.id },
        { 
          jointHolders: {
            some: { userId: user.id }
          }
        }
      ]
    }
  };

  if (accountId) where.accountId = accountId;
  if (type) where.type = type;
  if (category) where.category = category;
  if (status) where.status = status;
  
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate as string);
    if (endDate) where.createdAt.lte = new Date(endDate as string);
  }

  if (minAmount || maxAmount) {
    where.amount = {};
    if (minAmount) where.amount.gte = parseFloat(minAmount as string);
    if (maxAmount) where.amount.lte = parseFloat(maxAmount as string);
  }

  if (searchTerm) {
    where.OR = [
      { description: { contains: searchTerm, mode: 'insensitive' } },
      { reference: { contains: searchTerm, mode: 'insensitive' } },
      { merchantName: { contains: searchTerm, mode: 'insensitive' } }
    ];
  }

  const include: any = {
    account: {
      select: {
        id: true,
        accountNumber: true,
        type: true,
        bank: {
          select: {
            name: true,
            code: true
          }
        }
      }
    }
  };

  if (include_fraud_alerts === 'true') {
    include.fraudAlerts = {
      orderBy: { createdAt: 'desc' }
    };
  }

  if (include_transfers === 'true') {
    include.transfer = {
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            bank: { select: { name: true } }
          }
        },
        toAccount: {
          select: {
            accountNumber: true,
            bank: { select: { name: true } }
          }
        }
      }
    };
    include.creditCardTransaction = {
      include: {
        creditCard: {
          select: {
            lastFourDigits: true,
            network: true,
            cardType: true
          }
        }
      }
    };
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNumber,
    }),
    prisma.transaction.count({ where })
  ]);

  // Enhance transactions with calculated fields and insights
  const enhancedTransactions = transactions.map(transaction => {
    const enhanced: any = {
      ...transaction,
      isIncoming: ['DEPOSIT', 'TRANSFER', 'REFUND'].includes(transaction.type),
      isOutgoing: ['WITHDRAWAL', 'PAYMENT', 'FEE', 'CHARGE'].includes(transaction.type),
      dayOfWeek: new Date(transaction.createdAt).toLocaleDateString('en-US', { weekday: 'long' }),
      timeOfDay: categorizeTimeOfDay(new Date(transaction.createdAt)),
      riskLevel: calculateTransactionRisk(transaction)
    };

    // Add location info if available
    if (transaction.location) {
      enhanced.locationInfo = parseLocationData(transaction.location);
    }

    return enhanced;
  });

  // Calculate summary statistics
  const summary = {
    totalTransactions: total,
    totalVolume: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
    averageAmount: total > 0 ? transactions.reduce((sum, t) => sum + Number(t.amount), 0) / total : 0,
    byType: transactions.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byCategory: transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>),
    byStatus: transactions.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return res.status(200).json({
    transactions: enhancedTransactions,
    summary,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber)
    }
  });
}

async function createTransaction(req: NextApiRequest, res: NextApiResponse, session: any) {
  const {
    accountId,
    type,
    category,
    amount,
    currency = 'USD',
    description,
    reference,
    toAccountId, // For transfers
    merchantName,
    merchantCategory,
    location,
    scheduledDate, // For scheduled transactions
    metadata
  } = req.body;

  if (!accountId || !type || !amount || !description) {
    return res.status(400).json({ 
      error: 'Account ID, type, amount, and description are required' 
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Verify user has access to the account
  const account = await prisma.bankAccount.findFirst({
    where: {
      id: accountId,
      OR: [
        { userId: user.id },
        { 
          jointHolders: {
            some: { 
              userId: user.id,
              permissions: { has: 'MAKE_TRANSACTIONS' }
            }
          }
        }
      ]
    }
  });

  if (!account) {
    return res.status(404).json({ error: 'Account not found or insufficient permissions' });
  }

  // Check account status
  if (account.status !== 'ACTIVE') {
    return res.status(400).json({ error: 'Account is not active' });
  }

  // Validate transaction limits
  const limitCheck = await checkTransactionLimits(user.id, account.id, amount, type);
  if (!limitCheck.allowed) {
    return res.status(400).json({ error: limitCheck.reason });
  }

  // Check sufficient funds for outgoing transactions
  if (['WITHDRAWAL', 'PAYMENT', 'TRANSFER'].includes(type)) {
    const availableBalance = Number(account.availableBalance);
    const overdraftLimit = Number(account.overdraftLimit) || 0;
    const maxWithdrawable = availableBalance + overdraftLimit;

    if (amount > maxWithdrawable) {
      return res.status(400).json({ 
        error: 'Insufficient funds',
        availableBalance,
        overdraftLimit,
        requestedAmount: amount
      });
    }
  }

  // Generate transaction ID
  const transactionId = generateTransactionId();

  // Auto-categorize if not provided
  const finalCategory = category || await categorizeTransaction(description, merchantName, type);

  // Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      transactionId,
      accountId,
      type,
      category: finalCategory,
      amount,
      currency,
      description,
      reference,
      merchantName,
      merchantCategory,
      location: location ? JSON.stringify(location) : null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      status: scheduledDate ? 'PENDING' : 'PROCESSING',
      processingDate: scheduledDate ? new Date(scheduledDate) : new Date()
    },
    include: {
      account: {
        select: {
          accountNumber: true,
          bank: { select: { name: true } }
        }
      }
    }
  });

  // Handle transfers
  if (type === 'TRANSFER' && toAccountId) {
    await createTransfer(transaction.id, accountId, toAccountId, amount, currency, description);
  }

  // Update account balance immediately for non-scheduled transactions
  if (!scheduledDate) {
    await updateAccountBalance(accountId, type, amount);
  }

  // Fraud detection
  const fraudCheck = await performFraudDetection(transaction, user.id);
  if (fraudCheck.flagged) {
    await prisma.fraudAlert.create({
      data: {
        transactionId: transaction.id,
        alertType: fraudCheck.alertType,
        riskLevel: fraudCheck.riskLevel,
        riskScore: fraudCheck.riskScore,
        description: fraudCheck.description,
        rulesTriggered: fraudCheck.rulesTriggered
      }
    });

    // Suspend transaction if high risk
    if (fraudCheck.riskLevel === 'HIGH' || fraudCheck.riskLevel === 'CRITICAL') {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED' }
      });

      return res.status(200).json({
        transaction,
        fraudAlert: fraudCheck,
        message: 'Transaction flagged for review due to fraud risk'
      });
    }
  }

  // Process transaction if not scheduled
  if (!scheduledDate) {
    setTimeout(() => processTransaction(transaction.id), 2000); // Simulate processing delay
  }

  return res.status(201).json({
    transaction,
    fraudCheck: fraudCheck.flagged ? fraudCheck : null,
    message: 'Transaction created successfully'
  });
}

async function updateTransaction(req: NextApiRequest, res: NextApiResponse, session: any) {
  const { transactionId } = req.query;
  const { status, description, category, metadata } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Verify user has access to this transaction
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId as string,
      account: {
        OR: [
          { userId: user.id },
          { 
            jointHolders: {
              some: { userId: user.id }
            }
          }
        ]
      }
    }
  });

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  // Only allow updates to certain fields and statuses
  if (transaction.status === 'COMPLETED') {
    // Only allow category and description updates for completed transactions
    const updateData: any = {};
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (metadata) updateData.metadata = JSON.stringify(metadata);

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId as string },
      data: updateData
    });

    return res.status(200).json({
      transaction: updatedTransaction,
      message: 'Transaction updated successfully'
    });
  }

  // For pending/processing transactions, allow status changes
  const updateData: any = {};
  if (status) updateData.status = status;
  if (category) updateData.category = category;
  if (description) updateData.description = description;
  if (metadata) updateData.metadata = JSON.stringify(metadata);

  const updatedTransaction = await prisma.transaction.update({
    where: { id: transactionId as string },
    data: updateData
  });

  return res.status(200).json({
    transaction: updatedTransaction,
    message: 'Transaction updated successfully'
  });
}

async function cancelTransaction(req: NextApiRequest, res: NextApiResponse, session: any) {
  const { transactionId } = req.query;
  const { reason } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId as string,
      account: {
        OR: [
          { userId: user.id },
          { 
            jointHolders: {
              some: { userId: user.id }
            }
          }
        ]
      }
    }
  });

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  // Only allow cancellation of pending transactions
  if (transaction.status !== 'PENDING') {
    return res.status(400).json({ 
      error: 'Only pending transactions can be cancelled' 
    });
  }

  const cancelledTransaction = await prisma.transaction.update({
    where: { id: transactionId as string },
    data: { 
      status: 'CANCELLED',
      metadata: JSON.stringify({ 
        ...JSON.parse(transaction.metadata || '{}'),
        cancellationReason: reason 
      })
    }
  });

  return res.status(200).json({
    transaction: cancelledTransaction,
    message: 'Transaction cancelled successfully'
  });
}

// Utility functions
function generateTransactionId(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN${timestamp}${random}`;
}

function categorizeTimeOfDay(date: Date): string {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

function calculateTransactionRisk(transaction: any): string {
  let score = 0;
  
  // Amount-based risk
  if (Number(transaction.amount) > 10000) score += 30;
  else if (Number(transaction.amount) > 5000) score += 20;
  else if (Number(transaction.amount) > 1000) score += 10;

  // Time-based risk
  const hour = new Date(transaction.createdAt).getHours();
  if (hour < 6 || hour > 22) score += 15;

  // Location-based risk (if available)
  if (transaction.location) {
    // Add logic for unusual locations
    score += 10;
  }

  if (score >= 50) return 'HIGH';
  if (score >= 30) return 'MEDIUM';
  return 'LOW';
}

function parseLocationData(location: any): any {
  try {
    const parsed = typeof location === 'string' ? JSON.parse(location) : location;
    return {
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      city: parsed.city,
      country: parsed.country
    };
  } catch {
    return null;
  }
}

async function categorizeTransaction(description: string, merchantName?: string, type?: string): Promise<string> {
  const text = `${description} ${merchantName || ''}`.toLowerCase();

  // Simple categorization logic
  if (text.includes('grocery') || text.includes('supermarket')) return 'FOOD_DINING';
  if (text.includes('gas') || text.includes('fuel') || text.includes('uber') || text.includes('taxi')) return 'TRANSPORTATION';
  if (text.includes('amazon') || text.includes('shop') || text.includes('store')) return 'SHOPPING';
  if (text.includes('netflix') || text.includes('spotify') || text.includes('movie')) return 'ENTERTAINMENT';
  if (text.includes('electric') || text.includes('water') || text.includes('phone')) return 'BILLS_UTILITIES';
  if (text.includes('hospital') || text.includes('pharmacy') || text.includes('doctor')) return 'HEALTHCARE';
  if (text.includes('school') || text.includes('university') || text.includes('course')) return 'EDUCATION';
  if (text.includes('hotel') || text.includes('flight') || text.includes('travel')) return 'TRAVEL';
  
  if (type === 'DEPOSIT') return 'INCOME';
  if (type === 'TRANSFER') return 'TRANSFER';
  
  return 'OTHER';
}

async function checkTransactionLimits(userId: string, accountId: string, amount: number, type: string): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await prisma.transactionLimit.findMany({
    where: { userId }
  });

  for (const limit of limits) {
    if (Number(limit.remainingAmount) < amount) {
      return {
        allowed: false,
        reason: `${limit.limitType} limit exceeded. Remaining: $${limit.remainingAmount}`
      };
    }
  }

  return { allowed: true };
}

async function updateAccountBalance(accountId: string, type: string, amount: number) {
  const isIncoming = ['DEPOSIT', 'TRANSFER', 'REFUND'].includes(type);
  const balanceChange = isIncoming ? amount : -amount;

  await prisma.bankAccount.update({
    where: { id: accountId },
    data: {
      balance: { increment: balanceChange },
      availableBalance: { increment: balanceChange }
    }
  });
}

async function createTransfer(transactionId: string, fromAccountId: string, toAccountId: string, amount: number, currency: string, description: string) {
  const transferId = `TXF${Date.now()}${Math.floor(Math.random() * 1000)}`;

  return await prisma.transfer.create({
    data: {
      transferId,
      fromAccountId,
      toAccountId,
      amount,
      currency,
      description,
      transaction: { connect: { id: transactionId } }
    }
  });
}

async function performFraudDetection(transaction: any, userId: string): Promise<any> {
  const riskFactors = [];
  let riskScore = 0;

  // Amount-based detection
  if (Number(transaction.amount) > 10000) {
    riskFactors.push('Large amount transaction');
    riskScore += 40;
  }

  // Time-based detection
  const hour = new Date(transaction.processingDate).getHours();
  if (hour < 6 || hour > 22) {
    riskFactors.push('Off-hours transaction');
    riskScore += 20;
  }

  // Velocity check - multiple transactions in short time
  const recentTransactions = await prisma.transaction.findMany({
    where: {
      account: {
        userId: userId
      },
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
      }
    }
  });

  if (recentTransactions.length > 5) {
    riskFactors.push('High transaction velocity');
    riskScore += 30;
  }

  const flagged = riskScore >= 30;
  
  return {
    flagged,
    riskScore,
    riskLevel: riskScore >= 70 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 30 ? 'MEDIUM' : 'LOW',
    alertType: riskScore >= 50 ? 'UNUSUAL_SPENDING' : 'VELOCITY_CHECK',
    description: `Risk factors: ${riskFactors.join(', ')}`,
    rulesTriggered: riskFactors
  };
}

async function processTransaction(transactionId: string) {
  // Simulate transaction processing
  await new Promise(resolve => setTimeout(resolve, 1000));

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { 
      status: 'COMPLETED',
      settledDate: new Date()
    }
  });
}