export type CustomerStatus = 'basic' | 'silver' | 'gold' | 'bronze';

export interface Customer {
  id: string;
  email: string;
  name: string;
  cardNumber: string;
  status: CustomerStatus;
  points: number;
  totalPurchases: number;
  registrationDate: string;
  statusHistory: StatusChange[];
  purchaseHistory: Purchase[];
  pointsHistory: PointsTransaction[];
}

export interface StatusChange {
  date: string;
  fromStatus: CustomerStatus;
  toStatus: CustomerStatus;
  reason: string;
}

export interface Purchase {
  id: string;
  date: string;
  amount: number;
  store: string;
}

export interface PointsTransaction {
  id: string;
  date: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  available: boolean;
}

export interface PointsRule {
  purchaseRange: { min: number; max: number | null };
  points: {
    basic: number;
    silver: number;
    gold: number;
    bronze: number;
  };
}

export interface StatusRule {
  statusTransitions: {
    toSilver: { minPurchase: number; timesRequired: number };
    toGold: { minPurchase: number; timesRequired: number };
    maintainSilver: { minMonthlyPurchase: number };
    maintainGold: { minMonthlyPurchase: number };
    toBronze: { maxMonthlyPurchase: number; consecutiveMonths: number };
    fromBronzeToSilver: { minMonthlyPurchase: number; consecutiveMonths: number };
    fromBronzeToBasic: { maxPurchase: number };
  };
}
