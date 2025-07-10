import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏦 Seeding Banking & Fintech data...');

  // Create banks
  const banks = await Promise.all([
    prisma.bank.create({
      data: {
        name: 'Global Trust Bank',
        code: 'GTB001',
        country: 'United States',
        address: '123 Financial District, New York, NY 10004',
        phone: '+1-800-GLOBAL1',
        email: 'info@globaltrustbank.com',
        website: 'https://globaltrustbank.com',
        license: 'FDIC-12345',
        regulator: 'Federal Reserve',
        establishedYear: 1995
      }
    }),
    prisma.bank.create({
      data: {
        name: 'Digital First Bank',
        code: 'DFB002',
        country: 'United States',
        address: '456 Tech Plaza, San Francisco, CA 94105',
        phone: '+1-800-DIGITAL2',
        email: 'support@digitalfirstbank.com',
        website: 'https://digitalfirstbank.com',
        license: 'FDIC-67890',
        regulator: 'Federal Reserve',
        establishedYear: 2010
      }
    })
  ]);

  // Create bank branches
  const branches = await Promise.all([
    prisma.bankBranch.create({
      data: {
        bankId: banks[0].id,
        name: 'Manhattan Main Branch',
        code: 'GTB-MN001',
        address: '789 Wall Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10005',
        country: 'United States',
        phone: '+1-212-555-0100',
        manager: 'Sarah Johnson',
        services: ['ACCOUNT_SERVICES', 'LOAN_SERVICES', 'INVESTMENT_SERVICES'],
        openingHours: {
          monday: '9:00-17:00',
          tuesday: '9:00-17:00',
          wednesday: '9:00-17:00',
          thursday: '9:00-17:00',
          friday: '9:00-17:00',
          saturday: '9:00-15:00',
          sunday: 'Closed'
        }
      }
    }),
    prisma.bankBranch.create({
      data: {
        bankId: banks[1].id,
        name: 'Silicon Valley Branch',
        code: 'DFB-SV001',
        address: '321 Innovation Drive',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94107',
        country: 'United States',
        phone: '+1-415-555-0200',
        manager: 'Michael Chen',
        services: ['ACCOUNT_SERVICES', 'INVESTMENT_SERVICES', 'CURRENCY_EXCHANGE'],
        openingHours: {
          monday: '8:00-18:00',
          tuesday: '8:00-18:00',
          wednesday: '8:00-18:00',
          thursday: '8:00-18:00',
          friday: '8:00-18:00',
          saturday: '10:00-16:00',
          sunday: 'Closed'
        }
      }
    })
  ]);

  // Create users for banking
  const bankingUsers = await Promise.all([
    // Personal banking customers
    prisma.user.create({
      data: {
        name: 'Alice Walker',
        email: 'alice.walker@banking.com',
        password: 'banking123',
        role: 'user'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Robert Martinez',
        email: 'robert.martinez@banking.com',
        password: 'banking123',
        role: 'user'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Emily Chen',
        email: 'emily.chen@banking.com',
        password: 'banking123',
        role: 'user'
      }
    }),
    // Business banking customers
    prisma.user.create({
      data: {
        name: 'David Thompson',
        email: 'david.thompson@business.com',
        password: 'banking123',
        role: 'user'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Kim',
        email: 'sarah.kim@fintech.com',
        password: 'banking123',
        role: 'user'
      }
    }),
    // Investment customers
    prisma.user.create({
      data: {
        name: 'Michael Rodriguez',
        email: 'michael.rodriguez@investor.com',
        password: 'banking123',
        role: 'user'
      }
    })
  ]);

  // Create bank accounts with different types
  const accounts = await Promise.all([
    // Alice's accounts
    prisma.bankAccount.create({
      data: {
        accountNumber: 'ACC1701234567890',
        userId: bankingUsers[0].id,
        bankId: banks[0].id,
        branchId: branches[0].id,
        type: 'CHECKING',
        status: 'ACTIVE',
        currency: 'USD',
        balance: 5250.75,
        availableBalance: 5250.75,
        dailyLimit: 2000,
        monthlyLimit: 10000,
        interestRate: 0.0025
      }
    }),
    prisma.bankAccount.create({
      data: {
        accountNumber: 'ACC1701234567891',
        userId: bankingUsers[0].id,
        bankId: banks[0].id,
        type: 'SAVINGS',
        status: 'ACTIVE',
        currency: 'USD',
        balance: 15000.00,
        availableBalance: 15000.00,
        interestRate: 0.025,
        minimumBalance: 500
      }
    }),
    // Robert's business account
    prisma.bankAccount.create({
      data: {
        accountNumber: 'ACC1701234567892',
        userId: bankingUsers[1].id,
        bankId: banks[1].id,
        branchId: branches[1].id,
        type: 'BUSINESS',
        status: 'ACTIVE',
        currency: 'USD',
        balance: 45000.00,
        availableBalance: 42000.00,
        dailyLimit: 10000,
        monthlyLimit: 50000,
        overdraftLimit: 5000
      }
    }),
    // Emily's investment account
    prisma.bankAccount.create({
      data: {
        accountNumber: 'ACC1701234567893',
        userId: bankingUsers[2].id,
        bankId: banks[1].id,
        type: 'INVESTMENT',
        status: 'ACTIVE',
        currency: 'USD',
        balance: 75000.00,
        availableBalance: 75000.00,
        interestRate: 0.035
      }
    }),
    // David's checking
    prisma.bankAccount.create({
      data: {
        accountNumber: 'ACC1701234567894',
        userId: bankingUsers[3].id,
        bankId: banks[0].id,
        type: 'CHECKING',
        status: 'ACTIVE',
        currency: 'USD',
        balance: 8750.25,
        availableBalance: 8750.25,
        dailyLimit: 3000
      }
    }),
    // Michael's retirement account
    prisma.bankAccount.create({
      data: {
        accountNumber: 'ACC1701234567895',
        userId: bankingUsers[5].id,
        bankId: banks[1].id,
        type: 'RETIREMENT',
        status: 'ACTIVE',
        currency: 'USD',
        balance: 125000.00,
        availableBalance: 125000.00,
        interestRate: 0.045
      }
    })
  ]);

  // Create transactions
  const transactions = await Promise.all([
    // Alice's transactions
    prisma.transaction.create({
      data: {
        transactionId: 'TXN1701234567890001',
        accountId: accounts[0].id,
        type: 'DEPOSIT',
        category: 'INCOME',
        amount: 3200.00,
        currency: 'USD',
        description: 'Salary deposit - Tech Corp',
        status: 'COMPLETED',
        processingDate: new Date('2024-01-15'),
        settledDate: new Date('2024-01-15')
      }
    }),
    prisma.transaction.create({
      data: {
        transactionId: 'TXN1701234567890002',
        accountId: accounts[0].id,
        type: 'WITHDRAWAL',
        category: 'FOOD_DINING',
        amount: 45.50,
        currency: 'USD',
        description: 'Whole Foods Market',
        merchantName: 'Whole Foods Market',
        merchantCategory: 'Grocery',
        status: 'COMPLETED',
        processingDate: new Date('2024-01-16'),
        settledDate: new Date('2024-01-16')
      }
    }),
    prisma.transaction.create({
      data: {
        transactionId: 'TXN1701234567890003',
        accountId: accounts[0].id,
        type: 'PAYMENT',
        category: 'TRANSPORTATION',
        amount: 12.75,
        currency: 'USD',
        description: 'Uber ride',
        merchantName: 'Uber Technologies',
        status: 'COMPLETED',
        processingDate: new Date('2024-01-17'),
        settledDate: new Date('2024-01-17')
      }
    }),
    // Robert's business transactions
    prisma.transaction.create({
      data: {
        transactionId: 'TXN1701234567890004',
        accountId: accounts[2].id,
        type: 'DEPOSIT',
        category: 'BUSINESS',
        amount: 15000.00,
        currency: 'USD',
        description: 'Client payment - Project Alpha',
        status: 'COMPLETED',
        processingDate: new Date('2024-01-18'),
        settledDate: new Date('2024-01-18')
      }
    }),
    prisma.transaction.create({
      data: {
        transactionId: 'TXN1701234567890005',
        accountId: accounts[2].id,
        type: 'PAYMENT',
        category: 'BUSINESS',
        amount: 2500.00,
        currency: 'USD',
        description: 'Office rent payment',
        merchantName: 'Downtown Properties LLC',
        status: 'COMPLETED',
        processingDate: new Date('2024-01-19'),
        settledDate: new Date('2024-01-19')
      }
    })
  ]);

  // Create credit cards
  const creditCards = await Promise.all([
    prisma.creditCard.create({
      data: {
        cardNumber: 'encrypted_4532123456789012',
        userId: bankingUsers[0].id,
        bankId: banks[0].id,
        accountId: accounts[0].id,
        cardType: 'STANDARD',
        network: 'VISA',
        lastFourDigits: '9012',
        holderName: 'Alice Walker',
        creditLimit: 10000.00,
        availableCredit: 8500.00,
        currentBalance: 1500.00,
        interestRate: 0.1899,
        minimumPayment: 45.00,
        expiryDate: new Date('2027-12-31'),
        status: 'ACTIVE',
        activatedAt: new Date('2023-01-15')
      }
    }),
    prisma.creditCard.create({
      data: {
        cardNumber: 'encrypted_5555444433332222',
        userId: bankingUsers[1].id,
        bankId: banks[1].id,
        cardType: 'BUSINESS',
        network: 'MASTERCARD',
        lastFourDigits: '2222',
        holderName: 'Robert Martinez',
        creditLimit: 25000.00,
        availableCredit: 22500.00,
        currentBalance: 2500.00,
        interestRate: 0.1649,
        minimumPayment: 75.00,
        expiryDate: new Date('2026-11-30'),
        status: 'ACTIVE',
        activatedAt: new Date('2023-03-20')
      }
    })
  ]);

  // Create investments and portfolios
  const portfolios = await Promise.all([
    prisma.portfolio.create({
      data: {
        userId: bankingUsers[2].id,
        name: 'Growth Portfolio',
        description: 'Long-term growth focused investments',
        totalValue: 45000.00,
        totalGain: 5000.00,
        totalGainPercent: 12.5
      }
    }),
    prisma.portfolio.create({
      data: {
        userId: bankingUsers[5].id,
        name: 'Retirement Fund',
        description: 'Conservative retirement savings',
        totalValue: 125000.00,
        totalGain: 15000.00,
        totalGainPercent: 8.5
      }
    })
  ]);

  // Create stocks
  const stocks = await Promise.all([
    prisma.stock.create({
      data: {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'NASDAQ',
        sector: 'Technology',
        industry: 'Consumer Electronics',
        currentPrice: 195.25,
        marketCap: 3100000000000
      }
    }),
    prisma.stock.create({
      data: {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        exchange: 'NASDAQ',
        sector: 'Technology',
        industry: 'Internet Services',
        currentPrice: 140.75,
        marketCap: 1800000000000
      }
    }),
    prisma.stock.create({
      data: {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        exchange: 'NASDAQ',
        sector: 'Technology',
        industry: 'Software',
        currentPrice: 375.50,
        marketCap: 2800000000000
      }
    })
  ]);

  // Create investments
  const investments = await Promise.all([
    prisma.investment.create({
      data: {
        userId: bankingUsers[2].id,
        portfolioId: portfolios[0].id,
        symbol: 'AAPL',
        assetType: 'STOCK',
        name: 'Apple Inc.',
        quantity: 100,
        purchasePrice: 180.00,
        currentPrice: 195.25,
        unrealizedGain: 1525.00
      }
    }),
    prisma.investment.create({
      data: {
        userId: bankingUsers[2].id,
        portfolioId: portfolios[0].id,
        symbol: 'GOOGL',
        assetType: 'STOCK',
        name: 'Alphabet Inc.',
        quantity: 50,
        purchasePrice: 130.00,
        currentPrice: 140.75,
        unrealizedGain: 537.50
      }
    }),
    prisma.investment.create({
      data: {
        userId: bankingUsers[5].id,
        portfolioId: portfolios[1].id,
        symbol: 'MSFT',
        assetType: 'STOCK',
        name: 'Microsoft Corporation',
        quantity: 200,
        purchasePrice: 350.00,
        currentPrice: 375.50,
        unrealizedGain: 5100.00
      }
    })
  ]);

  // Create cryptocurrencies
  const cryptocurrencies = await Promise.all([
    prisma.cryptoCurrency.create({
      data: {
        symbol: 'BTC',
        name: 'Bitcoin',
        currentPrice: 45000.00,
        marketCap: 880000000000,
        volume24h: 25000000000,
        change24h: 2.5
      }
    }),
    prisma.cryptoCurrency.create({
      data: {
        symbol: 'ETH',
        name: 'Ethereum',
        currentPrice: 2800.00,
        marketCap: 340000000000,
        volume24h: 15000000000,
        change24h: 1.8
      }
    })
  ]);

  // Create crypto wallets
  const cryptoWallets = await Promise.all([
    prisma.cryptoWallet.create({
      data: {
        userId: bankingUsers[2].id,
        cryptoId: cryptocurrencies[0].id,
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        balance: 0.5
      }
    }),
    prisma.cryptoWallet.create({
      data: {
        userId: bankingUsers[2].id,
        cryptoId: cryptocurrencies[1].id,
        address: '0x742d35Cc6634C0532925a3b8D4C09d8a6479C4f4',
        balance: 5.25
      }
    })
  ]);

  // Create KYC verifications
  const kycVerifications = await Promise.all([
    prisma.kYCVerification.create({
      data: {
        userId: bankingUsers[0].id,
        accountId: accounts[0].id,
        documentType: 'DRIVER_LICENSE',
        documentNumber: 'NY123456789',
        firstName: 'Alice',
        lastName: 'Walker',
        dateOfBirth: new Date('1990-05-15'),
        nationality: 'US',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'United States'
        },
        status: 'APPROVED',
        reviewedAt: new Date('2023-01-20')
      }
    }),
    prisma.kYCVerification.create({
      data: {
        userId: bankingUsers[1].id,
        documentType: 'PASSPORT',
        documentNumber: 'P123456789',
        firstName: 'Robert',
        lastName: 'Martinez',
        dateOfBirth: new Date('1985-08-22'),
        nationality: 'US',
        address: {
          street: '456 Business Ave',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          country: 'United States'
        },
        status: 'APPROVED',
        reviewedAt: new Date('2023-03-25')
      }
    })
  ]);

  // Create spending categories
  const spendingCategories = await Promise.all([
    prisma.spendingCategory.create({
      data: {
        name: 'Food & Dining',
        icon: '🍽️',
        color: '#FF6B6B'
      }
    }),
    prisma.spendingCategory.create({
      data: {
        name: 'Transportation',
        icon: '🚗',
        color: '#4ECDC4'
      }
    }),
    prisma.spendingCategory.create({
      data: {
        name: 'Shopping',
        icon: '🛍️',
        color: '#45B7D1'
      }
    }),
    prisma.spendingCategory.create({
      data: {
        name: 'Entertainment',
        icon: '🎬',
        color: '#96CEB4'
      }
    }),
    prisma.spendingCategory.create({
      data: {
        name: 'Bills & Utilities',
        icon: '💡',
        color: '#FECA57'
      }
    })
  ]);

  // Create budget goals
  const budgetGoals = await Promise.all([
    prisma.budgetGoal.create({
      data: {
        userId: bankingUsers[0].id,
        categoryId: spendingCategories[0].id,
        name: 'Monthly Food Budget',
        targetAmount: 800.00,
        spentAmount: 345.50,
        remainingAmount: 454.50,
        period: 'MONTHLY',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        status: 'ACTIVE'
      }
    }),
    prisma.budgetGoal.create({
      data: {
        userId: bankingUsers[0].id,
        categoryId: spendingCategories[1].id,
        name: 'Transportation Budget',
        targetAmount: 300.00,
        spentAmount: 125.75,
        remainingAmount: 174.25,
        period: 'MONTHLY',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        status: 'ACTIVE'
      }
    })
  ]);

  // Create account analytics for the last 7 days
  const analyticsData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    analyticsData.push(
      prisma.accountAnalytics.create({
        data: {
          accountId: accounts[0].id,
          period: 'DAILY',
          date,
          openingBalance: 5000 + (Math.random() * 500),
          closingBalance: 5250 + (Math.random() * 500),
          totalDeposits: Math.random() * 1000,
          totalWithdrawals: Math.random() * 500,
          transactionCount: Math.floor(Math.random() * 10) + 1,
          averageTransaction: 50 + (Math.random() * 200),
          spendingByCategory: {
            'FOOD_DINING': Math.random() * 100,
            'TRANSPORTATION': Math.random() * 50,
            'SHOPPING': Math.random() * 200,
            'ENTERTAINMENT': Math.random() * 75
          }
        }
      })
    );
  }

  await Promise.all(analyticsData);

  console.log('✅ Banking & Fintech data seeded successfully!');
  console.log('\n🏦 BANKING SYSTEM CREDENTIALS:');
  console.log('=================================');
  console.log('👤 Personal Banking:');
  console.log('• Alice Walker: alice.walker@banking.com:banking123 (Checking + Savings)');
  console.log('• Emily Chen: emily.chen@banking.com:banking123 (Investment Account)');
  console.log('• David Thompson: david.thompson@business.com:banking123 (Checking)');
  console.log('\n💼 Business Banking:');
  console.log('• Robert Martinez: robert.martinez@banking.com:banking123 (Business Account)');
  console.log('\n📈 Investment Banking:');
  console.log('• Michael Rodriguez: michael.rodriguez@investor.com:banking123 (Retirement)');
  console.log('\n🏛️ Banks Available:');
  console.log('• Global Trust Bank (Traditional Banking)');
  console.log('• Digital First Bank (Modern Fintech)');
  console.log('\n💳 Features Implemented:');
  console.log('• Multiple account types (Checking, Savings, Business, Investment, Retirement)');
  console.log('• Credit cards with different networks (Visa, Mastercard)');
  console.log('• Stock investments (AAPL, GOOGL, MSFT)');
  console.log('• Cryptocurrency wallets (Bitcoin, Ethereum)');
  console.log('• KYC verification system');
  console.log('• Transaction categorization & analytics');
  console.log('• Budget goals & spending tracking');
  console.log('• Fraud detection capabilities');
  console.log('• Real-time balance updates');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });