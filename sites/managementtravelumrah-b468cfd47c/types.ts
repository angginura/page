
export type Gender = 'Laki-Laki' | 'Perempuan';
export type PackageStatus = 'Aktif' | 'Penuh' | 'Selesai';
export type InvoiceStatus = 'Lunas' | 'Belum Lunas' | 'Sebagian';
export type PaymentMethod = 'Tunai' | 'Transfer Bank';
export type AgentLevel = 'Agen' | 'Manager' | 'DM' | 'Office';
export type CommissionStatus = 'Terbayar' | 'Belum Terbayar';
export type UserRole = 'Admin' | 'Keuangan' | 'Staf';

export interface CompanySettings {
  name: string;
  phone: string;
  address: string;
  logoUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In real app, this should be hashed
  role: UserRole;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  duration: number; // days
  departureDate: string;
  quota: number;
  status: PackageStatus;
}

export interface Agent {
  id: string;
  code: string; // ZZG/AGN/0001
  name: string;
  gender: Gender;
  address: string;
  phone: string;
  level: AgentLevel;
  uplineId?: string; // Reference to another Agent ID
}

export interface Pilgrim {
  id: string;
  name: string;
  gender: Gender;
  address: string;
  phone: string;
  agentId?: string; // Reference to Agent
  departureStatus?: 'Berangkat' | 'Belum Berangkat';
}

export interface Invoice {
  id: string;
  invoiceNo: string; // INV/ZZG/UMR/00001
  date: string;
  pilgrimId: string;
  packageId: string;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
}

export interface Payment {
  id: string;
  receiptNo: string; // KW/ZZG/UMR/00001
  date: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  remarks?: string;
}

export interface Commission {
  id: string;
  receiptNo: string; // KW/AGN-ZZG/00001
  date: string;
  agentId: string;
  pilgrimId: string; // Source of commission
  total: number;
  status: CommissionStatus;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  activity: string;
  operator: string;
  detail: string;
}