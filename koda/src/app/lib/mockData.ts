import { Customer, Reward, PointsRule, StatusRule } from './types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    email: 'ana.kovac@example.com',
    name: 'Ana Kovač',
    cardNumber: 'MLS-0001-2345',
    status: 'gold',
    points: 450,
    totalPurchases: 15420,
    registrationDate: '2025-01-15',
    statusHistory: [
      {
        date: '2025-01-15',
        fromStatus: 'basic',
        toStatus: 'basic',
        reason: 'Začetna registracija'
      },
      {
        date: '2025-02-01',
        fromStatus: 'basic',
        toStatus: 'silver',
        reason: 'Nakup nad 499 EUR'
      },
      {
        date: '2025-04-01',
        fromStatus: 'silver',
        toStatus: 'gold',
        reason: 'Tretji nakup nad 500 EUR'
      }
    ],
    purchaseHistory: [
      { id: 'p1', date: '2026-03-28', amount: 1250, store: 'Maestro Ljubljana' },
      { id: 'p2', date: '2026-03-15', amount: 340, store: 'Maestro Maribor' },
      { id: 'p3', date: '2026-03-05', amount: 580, store: 'Maestro Ljubljana' },
      { id: 'p4', date: '2026-02-20', amount: 920, store: 'Maestro Celje' },
      { id: 'p5', date: '2026-02-10', amount: 450, store: 'Maestro Ljubljana' },
    ],
    pointsHistory: [
      { id: 'pt1', date: '2026-03-01', type: 'earned', points: 40, description: 'Mesečne točke - Februar 2026' },
      { id: 'pt2', date: '2026-02-01', type: 'earned', points: 40, description: 'Mesečne točke - Januar 2026' },
      { id: 'pt3', date: '2026-01-15', type: 'redeemed', points: -150, description: 'Unovčeno: 20% popust bon' },
    ]
  },
  {
    id: '2',
    email: 'demo@example.com',
    name: 'Demo Uporabnik',
    cardNumber: 'MLS-0002-6789',
    status: 'silver',
    points: 180,
    totalPurchases: 5240,
    registrationDate: '2025-06-01',
    statusHistory: [
      {
        date: '2025-06-01',
        fromStatus: 'basic',
        toStatus: 'basic',
        reason: 'Začetna registracija'
      },
      {
        date: '2025-08-01',
        fromStatus: 'basic',
        toStatus: 'silver',
        reason: 'Nakup nad 499 EUR'
      }
    ],
    purchaseHistory: [
      { id: 'p6', date: '2026-03-25', amount: 680, store: 'Maestro Koper' },
      { id: 'p7', date: '2026-02-18', amount: 320, store: 'Maestro Koper' },
      { id: 'p8', date: '2026-01-12', amount: 540, store: 'Maestro Ljubljana' },
    ],
    pointsHistory: [
      { id: 'pt4', date: '2026-03-01', type: 'earned', points: 20, description: 'Mesečne točke - Februar 2026' },
      { id: 'pt5', date: '2026-02-01', type: 'earned', points: 15, description: 'Mesečne točke - Januar 2026' },
    ]
  }
];

export const mockRewards: Reward[] = [
  {
    id: 'r1',
    name: '10% popust bon',
    description: 'Popust 10% na naslednji nakup',
    pointsCost: 50,
    category: 'Popusti',
    available: true
  },
  {
    id: 'r2',
    name: '20% popust bon',
    description: 'Popust 20% na naslednji nakup',
    pointsCost: 150,
    category: 'Popusti',
    available: true
  },
  {
    id: 'r3',
    name: 'Brezplačna dostava',
    description: 'Brezplačna dostava na dom za en nakup',
    pointsCost: 80,
    category: 'Storitve',
    available: true
  },
  {
    id: 'r4',
    name: 'Darilni bon 10 EUR',
    description: 'Darilni bon v vrednosti 10 EUR',
    pointsCost: 200,
    category: 'Boni',
    available: true
  },
  {
    id: 'r5',
    name: 'Darilni bon 25 EUR',
    description: 'Darilni bon v vrednosti 25 EUR',
    pointsCost: 500,
    category: 'Boni',
    available: true
  },
  {
    id: 'r6',
    name: 'VIP dostop do akcij',
    description: 'Prednostni dostop do novih akcij za 1 mesec',
    pointsCost: 120,
    category: 'Premium',
    available: true
  }
];

export const defaultPointsRules: PointsRule[] = [
  {
    purchaseRange: { min: 0, max: 200 },
    points: { basic: 5, silver: 7.5, gold: 10, bronze: 0 }
  },
  {
    purchaseRange: { min: 200, max: 1000 },
    points: { basic: 10, silver: 15, gold: 20, bronze: 5 }
  },
  {
    purchaseRange: { min: 1000, max: null },
    points: { basic: 20, silver: 30, gold: 40, bronze: 10 }
  }
];

export const defaultStatusRules: StatusRule = {
  statusTransitions: {
    toSilver: { minPurchase: 499, timesRequired: 1 },
    toGold: { minPurchase: 500, timesRequired: 3 },
    maintainSilver: { minMonthlyPurchase: 200 },
    maintainGold: { minMonthlyPurchase: 500 },
    toBronze: { maxMonthlyPurchase: 200, consecutiveMonths: 2 },
    fromBronzeToSilver: { minMonthlyPurchase: 200, consecutiveMonths: 2 },
    fromBronzeToBasic: { maxPurchase: 50 }
  }
};

// Demo user credentials
export const demoCredentials = {
  customer: { email: 'demo@example.com', password: 'demo123' },
  admin: { email: 'admin@maestro.si', password: 'admin123' }
};
