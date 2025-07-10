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
        return await getAccounts(req, res, session);
      case 'POST':
        return await createAccount(req, res, session);
      case 'PUT':
        return await updateAccount(req, res, session);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Banking API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAccounts(req: NextApiRequest, res: NextApiResponse, session: any) {
  const { 
    type, 
    status, 
    bank, 
    include_analytics, 
    include_transactions,
    include_kyc,
    limit = '10',
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

  const where: any = {
    OR: [
      { userId: user.id },
      { 
        jointHolders: {
          some: { userId: user.id }
        }
      }
    ]
  };

  if (type) where.type = type;
  if (status) where.status = status;
  if (bank) where.bankId = bank;

  const include: any = {
    bank: true,
    branch: true,
    jointHolders: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    }
  };

  if (include_analytics === 'true') {
    include.analytics = {
      orderBy: { date: 'desc' },
      take: 30 // Last 30 days
    };
  }

  if (include_transactions === 'true') {
    include.transactions = {
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        transfer: true,
        creditCardTransaction: {
          include: { creditCard: true }
        }
      }
    };
  }

  if (include_kyc === 'true') {
    include.kycVerifications = {
      orderBy: { createdAt: 'desc' },
      take: 1
    };
  }

  const [accounts, total] = await Promise.all([
    prisma.bankAccount.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNumber,
    }),
    prisma.bankAccount.count({ where })
  ]);

  // Calculate account summaries
  const accountsWithSummary = await Promise.all(
    accounts.map(async (account) => {
      const [transactionStats, recentActivity] = await Promise.all([
        prisma.transaction.aggregate({
          where: { accountId: account.id },
          _sum: {
            amount: true
          },
          _count: {
            id: true
          }
        }),
        prisma.transaction.findMany({
          where: { accountId: account.id },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            type: true,
            amount: true,
            description: true,
            createdAt: true,
            status: true
          }
        })
      ]);

      return {
        ...account,
        summary: {
          totalTransactions: transactionStats._count.id || 0,
          totalVolume: transactionStats._sum.amount || 0,
          recentActivity
        }
      };
    })
  );

  return res.status(200).json({
    accounts: accountsWithSummary,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber)
    }
  });
}

async function createAccount(req: NextApiRequest, res: NextApiResponse, session: any) {
  const {
    bankId,
    branchId,
    type,
    currency = 'USD',
    overdraftLimit,
    dailyLimit,
    monthlyLimit,
    interestRate,
    minimumBalance,
    initialDeposit = 0
  } = req.body;

  if (!bankId || !type) {
    return res.status(400).json({ error: 'Bank ID and account type are required' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if bank exists
  const bank = await prisma.bank.findUnique({
    where: { id: bankId }
  });

  if (!bank) {
    return res.status(404).json({ error: 'Bank not found' });
  }

  // Generate unique account number
  const accountNumber = generateAccountNumber();

  const account = await prisma.bankAccount.create({
    data: {
      accountNumber,
      userId: user.id,
      bankId,
      branchId,
      type,
      currency,
      balance: initialDeposit,
      availableBalance: initialDeposit,
      overdraftLimit,
      dailyLimit,
      monthlyLimit,
      interestRate,
      minimumBalance
    },
    include: {
      bank: true,
      branch: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  // Create initial transaction if there's a deposit
  if (initialDeposit > 0) {
    await prisma.transaction.create({
      data: {
        transactionId: generateTransactionId(),
        accountId: account.id,
        type: 'DEPOSIT',
        category: 'INCOME',
        amount: initialDeposit,
        currency,
        description: 'Initial deposit - Account opening',
        status: 'COMPLETED',
        processingDate: new Date(),
        settledDate: new Date()
      }
    });
  }

  // Initiate KYC verification if required
  const kycRequired = ['BUSINESS', 'INVESTMENT'].includes(type);
  if (kycRequired) {
    await prisma.kYCVerification.create({
      data: {
        userId: user.id,
        accountId: account.id,
        documentType: 'NATIONAL_ID', // Default, user will need to upload
        documentNumber: '', // To be filled by user
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        dateOfBirth: new Date(), // Placeholder
        nationality: '',
        address: {}
      }
    });
  }

  return res.status(201).json({
    account,
    kycRequired,
    message: kycRequired ? 'Account created. KYC verification required.' : 'Account created successfully'
  });
}

async function updateAccount(req: NextApiRequest, res: NextApiResponse, session: any) {
  const { accountId } = req.query;
  const {
    status,
    overdraftLimit,
    dailyLimit,
    monthlyLimit,
    interestRate,
    minimumBalance,
    action // 'freeze', 'unfreeze', 'close', 'add_holder'
  } = req.body;

  if (!accountId) {
    return res.status(400).json({ error: 'Account ID is required' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if user has access to this account
  const account = await prisma.bankAccount.findFirst({
    where: {
      id: accountId as string,
      OR: [
        { userId: user.id },
        { 
          jointHolders: {
            some: { 
              userId: user.id,
              permissions: { has: 'MANAGE_ACCOUNT' }
            }
          }
        }
      ]
    },
    include: { jointHolders: true }
  });

  if (!account) {
    return res.status(404).json({ error: 'Account not found or insufficient permissions' });
  }

  let updateData: any = {};

  // Handle specific actions
  switch (action) {
    case 'freeze':
      updateData.status = 'FROZEN';
      break;
    case 'unfreeze':
      updateData.status = 'ACTIVE';
      break;
    case 'close':
      if (account.balance > 0) {
        return res.status(400).json({ 
          error: 'Cannot close account with positive balance. Please transfer funds first.' 
        });
      }
      updateData.status = 'CLOSED';
      break;
    default:
      // Regular update
      if (status) updateData.status = status;
      if (overdraftLimit !== undefined) updateData.overdraftLimit = overdraftLimit;
      if (dailyLimit !== undefined) updateData.dailyLimit = dailyLimit;
      if (monthlyLimit !== undefined) updateData.monthlyLimit = monthlyLimit;
      if (interestRate !== undefined) updateData.interestRate = interestRate;
      if (minimumBalance !== undefined) updateData.minimumBalance = minimumBalance;
  }

  const updatedAccount = await prisma.bankAccount.update({
    where: { id: accountId as string },
    data: updateData,
    include: {
      bank: true,
      branch: true,
      jointHolders: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  // Log activity
  await logAccountActivity(accountId as string, user.id, action || 'update', updateData);

  return res.status(200).json({
    account: updatedAccount,
    message: 'Account updated successfully'
  });
}

// Utility functions
function generateAccountNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ACC${timestamp}${random}`;
}

function generateTransactionId(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN${timestamp}${random}`;
}

async function logAccountActivity(accountId: string, userId: string, action: string, details: any) {
  // This could be expanded to create audit logs
  console.log(`Account ${accountId} - User ${userId} performed ${action}:`, details);
}

// Account analytics endpoint
export async function getAccountAnalytics(accountId: string, period: string = 'MONTHLY') {
  const analytics = await prisma.accountAnalytics.findMany({
    where: {
      accountId,
      period: period as any
    },
    orderBy: { date: 'desc' },
    take: 12 // Last 12 periods
  });

  const transactions = await prisma.transaction.findMany({
    where: { accountId },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  // Calculate spending by category
  const spendingByCategory = transactions
    .filter(t => t.type === 'WITHDRAWAL' || t.type === 'PAYMENT')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + Number(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  return {
    analytics,
    spendingByCategory,
    totalTransactions: transactions.length,
    balance: {
      deposits: transactions
        .filter(t => t.type === 'DEPOSIT')
        .reduce((sum, t) => sum + Number(t.amount), 0),
      withdrawals: transactions
        .filter(t => t.type === 'WITHDRAWAL')
        .reduce((sum, t) => sum + Number(t.amount), 0)
    }
  };
}