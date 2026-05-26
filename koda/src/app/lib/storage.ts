import { Customer, Reward, PointsRule, StatusRule } from './types';
import { mockCustomers, mockRewards, defaultPointsRules, defaultStatusRules } from './mockData';

const STORAGE_KEYS = {
  CUSTOMERS: 'maestro_customers',
  REWARDS: 'maestro_rewards',
  POINTS_RULES: 'maestro_points_rules',
  STATUS_RULES: 'maestro_status_rules',
  CURRENT_USER: 'maestro_current_user',
  IS_ADMIN: 'maestro_is_admin'
};

export const storage = {
  // Initialize with mock data if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(mockCustomers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REWARDS)) {
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(mockRewards));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POINTS_RULES)) {
      localStorage.setItem(STORAGE_KEYS.POINTS_RULES, JSON.stringify(defaultPointsRules));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STATUS_RULES)) {
      localStorage.setItem(STORAGE_KEYS.STATUS_RULES, JSON.stringify(defaultStatusRules));
    }
  },

  // Auth
  setCurrentUser(email: string, isAdmin: boolean) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN, isAdmin.toString());
  },

  getCurrentUser(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  },

  isAdmin(): boolean {
    return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
  },

  // Customers
  getCustomers(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },

  getCustomerByEmail(email: string): Customer | null {
    const customers = this.getCustomers();
    return customers.find(c => c.email === email) || null;
  },

  addCustomer(customer: Customer) {
    const customers = this.getCustomers();
    customers.push(customer);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  updateCustomer(customer: Customer) {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      customers[index] = customer;
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    }
  },

  // Rewards
  getRewards(): Reward[] {
    const data = localStorage.getItem(STORAGE_KEYS.REWARDS);
    return data ? JSON.parse(data) : [];
  },

  updateRewards(rewards: Reward[]) {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  },

  // Rules
  getPointsRules(): PointsRule[] {
    const data = localStorage.getItem(STORAGE_KEYS.POINTS_RULES);
    return data ? JSON.parse(data) : [];
  },

  updatePointsRules(rules: PointsRule[]) {
    localStorage.setItem(STORAGE_KEYS.POINTS_RULES, JSON.stringify(rules));
  },

  getStatusRules(): StatusRule {
    const data = localStorage.getItem(STORAGE_KEYS.STATUS_RULES);
    return data ? JSON.parse(data) : defaultStatusRules;
  },

  updateStatusRules(rules: StatusRule) {
    localStorage.setItem(STORAGE_KEYS.STATUS_RULES, JSON.stringify(rules));
  }
};

// Initialize on load
storage.init();
