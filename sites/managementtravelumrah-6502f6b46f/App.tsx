import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, UserCheck, CreditCard, FileText, 
  Settings, PieChart, Wallet, Menu, Bell, Download, Printer, 
  Plus, Edit, Trash2, History, X, Upload, LogOut, Lock, User as UserIcon,
  Moon, Sun, Clock, TrendingUp, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, DollarSign, Package as PackageIcon, Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, ComposedChart
} from 'recharts';

import { 
  Button, Input, Card, Badge, Modal, DataTable, Select, ToastContainer, ToastMessage 
} from './components/UI';
import { 
  InvoiceTemplate, PaymentReceiptTemplate, CommissionReceiptTemplate, InvoiceHistoryTemplate
} from './components/PrintTemplates';
import { 
  formatCurrency, formatDate, generateId, cn, exportToCSV 
} from './utils';
import { 
  Agent, Pilgrim, Package, Invoice, Payment, Commission, 
  CompanySettings, ActivityLog, InvoiceStatus, User, UserRole 
} from './types';

// --- MOCK DATA ---
const INITIAL_PACKAGES: Package[] = [
  { id: '1', name: 'Paket Reguler 9 Hari', price: 28500000, duration: 9, departureDate: '2023-11-20', quota: 40, status: 'Selesai' },
  { id: '2', name: 'Paket VIP 12 Hari', price: 35000000, duration: 12, departureDate: '2024-02-10', quota: 25, status: 'Aktif' },
  { id: '3', name: 'Paket Ramadhan Awal', price: 32000000, duration: 9, departureDate: '2024-03-12', quota: 45, status: 'Penuh' },
];

const INITIAL_AGENTS: Agent[] = [
  { id: '1', code: 'ZZG/AGN/0001', name: 'Ahmad Dahlan', gender: 'Laki-Laki', phone: '081234567890', address: 'Jl. Mawar No 1', level: 'Manager' },
  { id: '2', code: 'ZZG/AGN/0002', name: 'Siti Aminah', gender: 'Perempuan', phone: '081987654321', address: 'Jl. Melati No 2', level: 'Agen', uplineId: '1' },
];

const INITIAL_PILGRIMS: Pilgrim[] = [
  { id: '1', name: 'Budi Santoso', gender: 'Laki-Laki', phone: '085512345678', address: 'Jakarta Selatan', agentId: '1', departureStatus: 'Berangkat' },
  { id: '2', name: 'Dewi Sartika', gender: 'Perempuan', phone: '085587654321', address: 'Bandung', agentId: '2', departureStatus: 'Belum Berangkat' },
  { id: '3', name: 'Rahmat Hidayat', gender: 'Laki-Laki', phone: '081234555555', address: 'Depok', agentId: '1', departureStatus: 'Belum Berangkat' },
];

const INITIAL_INVOICES: Invoice[] = [
  { id: '1', invoiceNo: 'INV/ZZG/UMR/00001', date: '2023-10-01', pilgrimId: '1', packageId: '1', totalAmount: 28500000, paidAmount: 28500000, status: 'Lunas' },
  { id: '2', invoiceNo: 'INV/ZZG/UMR/00002', date: '2023-12-01', pilgrimId: '2', packageId: '2', totalAmount: 35000000, paidAmount: 10000000, status: 'Belum Lunas' },
];

const INITIAL_PAYMENTS: Payment[] = [
    { id: '1', receiptNo: 'KW/ZZG/UMR/00001', date: '2023-10-01', invoiceId: '1', amount: 28500000, method: 'Transfer Bank', remarks: 'Pelunasan awal'},
    { id: '2', receiptNo: 'KW/ZZG/UMR/00002', date: '2023-12-05', invoiceId: '2', amount: 10000000, method: 'Tunai', remarks: 'DP 1'},
];

const INITIAL_COMMISSIONS: Commission[] = [
    { id: '1', receiptNo: 'KW/AGN-ZZG/00001', date: '2023-10-05', agentId: '1', pilgrimId: '1', total: 1500000, status: 'Terbayar' }
];

const INITIAL_SETTINGS: CompanySettings = {
    name: 'Zam Zam Group',
    address: 'Menara 165, Lt. 12, Jl. TB Simatupang, Jakarta Selatan',
    phone: '(021) 789-1234',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop',
};

const INITIAL_USERS: User[] = [
    { id: '1', name: 'Super Admin', email: 'admin@gmail.com', password: 'admin123', role: 'Admin' },
    { id: '2', name: 'Staff Keuangan', email: 'keuangan@gmail.com', password: '123', role: 'Keuangan' },
    { id: '3', name: 'Staff Biasa', email: 'staf@gmail.com', password: '123', role: 'Staf' },
];

// --- COMPONENTS ---

const DashboardCard = ({ title, value, icon: Icon, colorClass, iconBgClass }: any) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
      <div>
          <p className="text-sm font-medium text-slate-950 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-950 dark:text-slate-100">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-full", iconBgClass)}>
          <Icon className={cn("w-6 h-6", colorClass)} />
      </div>
  </div>
);

const SettingsView = ({ settings, onSave, isAdmin }: { settings: CompanySettings, onSave: (s: CompanySettings) => void, isAdmin: boolean }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
               setLocalSettings(prev => ({...prev, logoUrl: reader.result as string}));
          };
          reader.readAsDataURL(file);
      }
    };

    if (!isAdmin) return <div className="p-8 text-center text-slate-950">Anda tidak memiliki akses ke halaman ini.</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Pengaturan</h2>
            </div>
            <Card title="Data Perusahaan">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-950 dark:text-slate-300 mb-2">Logo Perusahaan</label>
                        <div className="flex items-center gap-4">
                            {localSettings.logoUrl ? (
                                <img src={localSettings.logoUrl} alt="Logo" className="w-20 h-20 rounded-md border object-contain bg-white dark:border-slate-600" />
                            ) : (
                                <div className="w-20 h-20 rounded-md border bg-slate-100 flex items-center justify-center text-xs text-slate-950">No Logo</div>
                            )}
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              className="hidden" 
                              accept="image/*"
                              onChange={handleLogoUpload}
                            />
                            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                              <Upload className="w-4 h-4 mr-2" /> Upload Logo Baru
                            </Button>
                        </div>
                    </div>
                    <Input label="Nama Perusahaan" value={localSettings.name} onChange={e => setLocalSettings({...localSettings, name: e.target.value})} />
                    <Input label="Nomor Handphone" value={localSettings.phone} onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} />
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-950 dark:text-slate-300">Alamat</label>
                        <textarea 
                          className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-950 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                          value={localSettings.address}
                          onChange={e => setLocalSettings({...localSettings, address: e.target.value})}
                        />
                    </div>
                    <div className="pt-4">
                        <Button onClick={() => onSave(localSettings)}>Simpan Perubahan</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const FormRenderer = ({ 
  type, data, onClose, 
  onSaveUser, onSavePackage, onSavePilgrim, onSaveAgent, onCreateInvoice, onSavePayment, onSaveCommission, onPrint,
  packages, agents, pilgrims, invoices, payments 
}: any) => {
  const [formData, setFormData] = useState(data || {});

  useEffect(() => {
    if (data) {
        setFormData(data);
    } else {
        const defaults: any = {};
        if (type === 'paket') {
            defaults.status = 'Aktif';
        } else if (type === 'agen') {
            defaults.level = 'Agen';
            defaults.gender = 'Laki-Laki';
        } else if (type === 'jemaah') {
            defaults.gender = 'Laki-Laki';
            defaults.departureStatus = 'Belum Berangkat';
        } else if (type === 'pembayaran') {
            defaults.method = 'Transfer Bank';
            defaults.date = new Date().toISOString();
        } else if (type === 'komisi') {
            defaults.status = 'Belum Terbayar';
            defaults.date = new Date().toISOString();
        } else if (type === 'invoice') {
            defaults.date = new Date().toISOString();
        }
        setFormData(defaults);
    }
  }, [data, type]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'user') onSaveUser(formData);
    else if (type === 'paket') onSavePackage(formData);
    else if (type === 'jemaah') onSavePilgrim(formData);
    else if (type === 'agen') onSaveAgent(formData);
    else if (type === 'invoice') onCreateInvoice(formData);
    else if (type === 'pembayaran') onSavePayment(formData);
    else if (type === 'komisi') onSaveCommission(formData);
  };

  if (type === 'history') {
     const inv = data as Invoice;
     const invPayments = payments.filter((p: Payment) => p.invoiceId === inv.id);
     return (
         <div className="space-y-4">
             <div className="flex justify-between items-center bg-slate-50 p-3 rounded-md dark:bg-slate-700/50">
                 <div>
                     <p className="text-sm text-slate-950 dark:text-slate-400">Total Tagihan</p>
                     <p className="font-bold text-slate-950 dark:text-slate-100">{formatCurrency(inv.totalAmount)}</p>
                 </div>
                  <div className="text-right">
                     <p className="text-sm text-slate-950 dark:text-slate-400">Sisa Tagihan</p>
                     <p className="font-bold text-red-600">{formatCurrency(inv.totalAmount - inv.paidAmount)}</p>
                 </div>
             </div>
             <table className="w-full text-sm">
                 <thead>
                     <tr className="border-b dark:border-slate-700 text-slate-950 font-bold">
                         <th className="py-2 text-left font-bold">Tgl</th>
                         <th className="py-2 text-left font-bold">Metode</th>
                         <th className="py-2 text-right font-bold">Jumlah</th>
                     </tr>
                 </thead>
                 <tbody className="text-slate-950 dark:text-slate-300">
                     {invPayments.map((p: Payment) => (
                         <tr key={p.id} className="border-b border-slate-50 dark:border-slate-800">
                             <td className="py-2">{formatDate(p.date)}</td>
                             <td className="py-2">{p.method}</td>
                             <td className="py-2 text-right font-medium">{formatCurrency(p.amount)}</td>
                         </tr>
                     ))}
                     {invPayments.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-slate-950">Belum ada pembayaran</td></tr>}
                 </tbody>
             </table>
             <div className="flex justify-end pt-2">
                 <Button onClick={() => onPrint('history', inv.id)}><Printer className="w-4 h-4 mr-2"/> Cetak Riwayat</Button>
             </div>
         </div>
     )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'user' && (
        <>
          <Input label="Nama Lengkap" value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} required />
          <Input label="Email" type="email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} required />
          <Input label="Password" type="password" value={formData.password || ''} onChange={(e) => handleChange('password', e.target.value)} required />
          <Select 
            label="Role" 
            value={formData.role || 'Staf'} 
            onChange={(e) => handleChange('role', e.target.value)}
            options={[{label: 'Admin', value: 'Admin'}, {label: 'Keuangan', value: 'Keuangan'}, {label: 'Staf', value: 'Staf'}]} 
          />
        </>
      )}

      {type === 'paket' && (
        <>
          <Input label="Nama Paket" value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
             <Input label="Harga (IDR)" type="number" value={formData.price || ''} onChange={(e) => handleChange('price', Number(e.target.value))} required />
             <Input label="Durasi (Hari)" type="number" value={formData.duration || ''} onChange={(e) => handleChange('duration', Number(e.target.value))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <Input label="Tanggal Keberangkatan" type="date" value={formData.departureDate ? formData.departureDate.split('T')[0] : ''} onChange={(e) => handleChange('departureDate', e.target.value)} required />
             <Input label="Kuota Seat" type="number" value={formData.quota || ''} onChange={(e) => handleChange('quota', Number(e.target.value))} required />
          </div>
          <Select 
            label="Status Paket" 
            value={formData.status || 'Aktif'} 
            onChange={(e) => handleChange('status', e.target.value)}
            options={[{label: 'Aktif', value: 'Aktif'}, {label: 'Penuh', value: 'Penuh'}, {label: 'Selesai', value: 'Selesai'}]} 
          />
        </>
      )}

      {type === 'jemaah' && (
          <>
             <Input label="Nama Lengkap" value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} required />
             <div className="grid grid-cols-2 gap-4">
                <Select label="Jenis Kelamin" value={formData.gender || 'Laki-Laki'} onChange={(e) => handleChange('gender', e.target.value)} options={[{label: 'Laki-Laki', value: 'Laki-Laki'}, {label: 'Perempuan', value: 'Perempuan'}]} />
                <Input label="Nomor HP" value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} required />
             </div>
             <Input label="Alamat" value={formData.address || ''} onChange={(e) => handleChange('address', e.target.value)} required />
             <Select 
                label="Referensi Agen" 
                value={formData.agentId || ''} 
                onChange={(e) => handleChange('agentId', e.target.value)}
                options={[{label: '- Pilih Agen -', value: ''}, ...agents.map((a: Agent) => ({label: `${a.code} - ${a.name}`, value: a.id}))]} 
             />
             <Select label="Status Keberangkatan" value={formData.departureStatus || 'Belum Berangkat'} onChange={(e) => handleChange('departureStatus', e.target.value)} options={[{label: 'Belum Berangkat', value: 'Belum Berangkat'}, {label: 'Berangkat', value: 'Berangkat'}]} />
          </>
      )}
      
      {type === 'agen' && (
          <>
             <Input label="Nama Lengkap" value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} required />
             <div className="grid grid-cols-2 gap-4">
                <Select label="Jenis Kelamin" value={formData.gender || 'Laki-Laki'} onChange={(e) => handleChange('gender', e.target.value)} options={[{label: 'Laki-Laki', value: 'Laki-Laki'}, {label: 'Perempuan', value: 'Perempuan'}]} />
                <Input label="Nomor HP" value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} required />
             </div>
             <Input label="Alamat" value={formData.address || ''} onChange={(e) => handleChange('address', e.target.value)} required />
             <div className="grid grid-cols-2 gap-4">
                 <Select 
                    label="Level Agen" 
                    value={formData.level || 'Agen'} 
                    onChange={(e) => handleChange('level', e.target.value)} 
                    options={[
                        {label: 'Agen', value: 'Agen'}, 
                        {label: 'Office', value: 'Office'}, 
                        {label: 'Manager', value: 'Manager'}, 
                        {label: 'DM', value: 'DM'}
                    ]} 
                 />
                 <Select 
                    label="Upline (Opsional)" 
                    value={formData.uplineId || ''} 
                    onChange={(e) => handleChange('uplineId', e.target.value)}
                    options={[{label: '- Tidak Ada -', value: ''}, ...agents.filter((a: Agent) => a.id !== formData.id).map((a: Agent) => ({label: a.name, value: a.id}))]} 
                 />
             </div>
          </>
      )}

      {type === 'invoice' && (
          <>
             <Input label="Tanggal Invoice" type="date" value={formData.date ? formData.date.split('T')[0] : new Date().toISOString().split('T')[0]} onChange={(e) => handleChange('date', e.target.value)} required />
             <Select 
                label="Pilih Jemaah" 
                value={formData.pilgrimId || ''} 
                onChange={(e) => handleChange('pilgrimId', e.target.value)}
                options={[{label: '- Pilih Jemaah -', value: ''}, ...pilgrims.map((p: Pilgrim) => ({label: p.name, value: p.id}))]} 
             />
             <Select 
                label="Pilih Paket" 
                value={formData.packageId || ''} 
                onChange={(e) => handleChange('packageId', e.target.value)}
                options={[{label: '- Pilih Paket -', value: ''}, ...packages.filter((p: Package) => p.status === 'Aktif' || p.id === formData.packageId).map((p: Package) => ({label: `${p.name} - ${formatCurrency(p.price)}`, value: p.id}))]} 
             />
          </>
      )}

      {type === 'pembayaran' && (
          <>
             <Input label="Tanggal Pembayaran" type="date" value={formData.date ? formData.date.split('T')[0] : new Date().toISOString().split('T')[0]} onChange={(e) => handleChange('date', e.target.value)} required />
             <Select 
                label="Pilih Tagihan (Invoice)" 
                value={formData.invoiceId || ''} 
                onChange={(e) => {
                    handleChange('invoiceId', e.target.value);
                    if(!formData.id) {
                        const inv = invoices.find((i: Invoice) => i.id === e.target.value);
                        if(inv) handleChange('amount', inv.totalAmount - inv.paidAmount);
                    }
                }}
                options={[{label: '- Pilih Invoice -', value: ''}, ...invoices.filter((i: Invoice) => i.status !== 'Lunas' || i.id === formData.invoiceId).map((i: Invoice) => {
                    const pName = pilgrims.find((p: Pilgrim) => p.id === i.pilgrimId)?.name;
                    return {label: `${i.invoiceNo} - ${pName} (${formatCurrency(i.totalAmount - i.paidAmount)})`, value: i.id};
                })]} 
             />
             <Input label="Jumlah Bayar" type="number" value={formData.amount || ''} onChange={(e) => handleChange('amount', Number(e.target.value))} required />
             <Select label="Metode Pembayaran" value={formData.method || 'Transfer Bank'} onChange={(e) => handleChange('method', e.target.value)} options={[{label: 'Transfer Bank', value: 'Transfer Bank'}, {label: 'Tunai', value: 'Tunai'}]} />
             <Input label="Keterangan" value={formData.remarks || ''} onChange={(e) => handleChange('remarks', e.target.value)} />
          </>
      )}

      {type === 'komisi' && (
          <>
             <Input label="Tanggal" type="date" value={formData.date ? formData.date.split('T')[0] : new Date().toISOString().split('T')[0]} onChange={(e) => handleChange('date', e.target.value)} required />
             <Select 
                label="Agen Penerima" 
                value={formData.agentId || ''} 
                onChange={(e) => handleChange('agentId', e.target.value)}
                options={[{label: '- Pilih Agen -', value: ''}, ...agents.map((a: Agent) => ({label: a.name, value: a.id}))]} 
             />
             <Select 
                label="Sumber Jemaah" 
                value={formData.pilgrimId || ''} 
                onChange={(e) => handleChange('pilgrimId', e.target.value)}
                options={[{label: '- Pilih Jemaah -', value: ''}, ...pilgrims.map((p: Pilgrim) => ({label: p.name, value: p.id}))]} 
             />
             <Input label="Total Komisi" type="number" value={formData.total || ''} onChange={(e) => handleChange('total', Number(e.target.value))} required />
             <Select label="Status" value={formData.status || 'Belum Terbayar'} onChange={(e) => handleChange('status', e.target.value)} options={[{label: 'Belum Terbayar', value: 'Belum Terbayar'}, {label: 'Terbayar', value: 'Terbayar'}]} />
          </>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700 mt-4">
        <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
};

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // App Config State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Data State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>(INITIAL_PILGRIMS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [commissions, setCommissions] = useState<Commission[]>(INITIAL_COMMISSIONS);
  
  // Settings with LocalStorage persistence to prevent reset on refresh
  const [settings, setSettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('companySettings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // View State (Search, Sorting & Pagination)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackageFilter, setSelectedPackageFilter] = useState(''); 
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');   
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal & Print Configuration
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, type: string, data?: any} | null>(null);
  const [printConfig, setPrintConfig] = useState<{isOpen: boolean, type: 'invoice'|'payment'|'commission'|'history', dataId: string} | null>(null);

  // Toggle Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check Session on Mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Reset view state when tab changes
  useEffect(() => {
    setSearchQuery('');
    setSelectedPackageFilter('');
    setSelectedStatusFilter('');
    setSortConfig(null);
    setCurrentPage(1);
  }, [activeTab]);

  // --- ACCESS CONTROL HELPERS ---
  const isAdmin = currentUser?.role === 'Admin';
  const isKeuangan = currentUser?.role === 'Keuangan';
  
  // Can Create: Admin and Keuangan
  const canAdd = isAdmin || isKeuangan;
  // Can Manage (Edit/Delete): Admin ONLY
  const canManage = isAdmin; 

  // Helper functions
  const addLog = (activity: string, detail: string) => {
      const newLog: ActivityLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          activity,
          operator: currentUser?.name || 'System',
          detail
      };
      setLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep last 10
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, type, message }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  // --- SETTINGS HANDLER ---
  const handleSaveSettings = (newSettings: CompanySettings) => {
      setSettings(newSettings);
      localStorage.setItem('companySettings', JSON.stringify(newSettings));
      addLog('Settings', 'Update pengaturan perusahaan');
      showToast('success', 'Pengaturan disimpan');
  };

  // --- AUTH HANDLERS ---
  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
      if (user) {
          setCurrentUser(user);
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          addLog('Login', 'Pengguna berhasil login');
          showToast('success', `Selamat datang, ${user.name}`);
      } else {
          showToast('error', 'Email atau password salah');
      }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      sessionStorage.removeItem('currentUser');
      addLog('Logout', 'Pengguna keluar dari sistem');
  };

  // --- SORTING HANDLER ---
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // --- FILTERING, SORTING & PAGINATION LOGIC ---
  const getCurrentData = () => {
    let data: any[] = [];
    switch (activeTab) {
        case 'paket': data = [...packages]; break;
        case 'jemaah': data = [...pilgrims]; break;
        case 'agen': data = [...agents]; break;
        case 'invoice': data = [...invoices]; break;
        case 'pembayaran': data = [...payments]; break;
        case 'komisi': data = [...commissions]; break;
        case 'users': data = [...users]; break;
        default: return { paginated: [], totalItems: 0, fullData: [] };
    }

    // Apply Filters for Invoice Tab
    if (activeTab === 'invoice') {
        if (selectedPackageFilter) {
            data = data.filter(i => i.packageId === selectedPackageFilter);
        }
        if (selectedStatusFilter) {
            data = data.filter(i => i.status === selectedStatusFilter);
        }
    }

    // Search Filtering
    if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        data = data.filter(item => {
            if (activeTab === 'users') return item.name.toLowerCase().includes(lower) || item.email.toLowerCase().includes(lower);
            if (activeTab === 'jemaah') return item.name.toLowerCase().includes(lower);
            if (activeTab === 'agen') return item.name.toLowerCase().includes(lower);
            if (activeTab === 'invoice') {
                const pName = pilgrims.find(p => p.id === item.pilgrimId)?.name.toLowerCase() || '';
                const pkgName = packages.find(p => p.id === item.packageId)?.name.toLowerCase() || '';
                return item.invoiceNo.toLowerCase().includes(lower) || pName.includes(lower) || pkgName.includes(lower);
            }
            if (activeTab === 'pembayaran') {
                 const inv = invoices.find(i => i.id === item.invoiceId);
                 const pName = pilgrims.find(p => p.id === inv?.pilgrimId)?.name.toLowerCase() || '';
                 return item.receiptNo.toLowerCase().includes(lower) || pName.includes(lower);
            }
            if (activeTab === 'komisi') {
                 const aName = agents.find(a => a.id === item.agentId)?.name.toLowerCase() || '';
                 return item.receiptNo.toLowerCase().includes(lower) || aName.includes(lower);
            }
            return Object.values(item).some(val => String(val).toLowerCase().includes(lower));
        });
    }

    // Sorting
    if (sortConfig) {
        data.sort((a, b) => {
            let valA: any, valB: any;

            // Define values to sort based on keys
            if (sortConfig.key === 'date') {
                valA = new Date(a.date).getTime();
                valB = new Date(b.date).getTime();
            } else if (sortConfig.key === 'name') {
                // Determine which "name" to use based on tab
                if (activeTab === 'invoice') {
                    valA = pilgrims.find(p => p.id === a.pilgrimId)?.name || '';
                    valB = pilgrims.find(p => p.id === b.pilgrimId)?.name || '';
                } else if (activeTab === 'pembayaran') {
                    const invA = invoices.find(i => i.id === a.invoiceId);
                    const invB = invoices.find(i => i.id === b.invoiceId);
                    valA = pilgrims.find(p => p.id === invA?.pilgrimId)?.name || '';
                    valB = pilgrims.find(p => p.id === invB?.pilgrimId)?.name || '';
                } else if (activeTab === 'komisi') {
                    valA = agents.find(ag => ag.id === a.agentId)?.name || '';
                    valB = agents.find(ag => ag.id === b.agentId)?.name || '';
                } else {
                    valA = a.name || '';
                    valB = b.name || '';
                }
            } else {
                valA = a[sortConfig.key];
                valB = b[sortConfig.key];
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const totalItems = data.length;
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = data.slice(start, start + itemsPerPage);

    return { paginated, totalItems, fullData: data };
  };

  // --- EXPORT HANDLER ---
  const handleDownloadExcel = () => {
      const { fullData } = getCurrentData();
      let exportData: any[] = [];

      if (activeTab === 'invoice') {
          exportData = fullData.map((i: Invoice) => ({
              'No Invoice': i.invoiceNo,
              'Tanggal': formatDate(i.date),
              'Jemaah': pilgrims.find(p => p.id === i.pilgrimId)?.name || '-',
              'Paket': packages.find(p => p.id === i.packageId)?.name || '-',
              'Total': i.totalAmount,
              'Dibayar': i.paidAmount,
              'Sisa': i.totalAmount - i.paidAmount,
              'Status': i.status
          }));
      } else if (activeTab === 'agen') {
          exportData = fullData.map((a: Agent) => ({
              'Kode': a.code,
              'Nama': a.name,
              'Gender': a.gender,
              'Level': a.level,
              'HP': a.phone,
              'Alamat': a.address
          }));
      } else if (activeTab === 'pembayaran') {
          exportData = fullData.map((p: Payment) => {
              const inv = invoices.find(i => i.id === p.invoiceId);
              const pil = pilgrims.find(pil => pil.id === inv?.pilgrimId);
              return {
                  'No Kwitansi': p.receiptNo,
                  'Tanggal': formatDate(p.date),
                  'Invoice Ref': inv?.invoiceNo || '-',
                  'Nama Jemaah': pil?.name || '-',
                  'Metode': p.method,
                  'Keterangan': p.remarks || '',
                  'Jumlah': p.amount
              };
          });
      } else if (activeTab === 'komisi') {
          exportData = fullData.map((c: Commission) => {
              const ag = agents.find(a => a.id === c.agentId);
              const pil = pilgrims.find(p => p.id === c.pilgrimId);
              return {
                  'No Kwitansi': c.receiptNo,
                  'Tanggal': formatDate(c.date),
                  'Agen': ag?.name || '-',
                  'Jemaah Ref': pil?.name || '-',
                  'Total': c.total,
                  'Status': c.status
              };
          });
      }
      
      if(exportData.length > 0) {
        exportToCSV(exportData, `${activeTab}_export_${new Date().toISOString().split('T')[0]}`);
        showToast('success', 'File Excel berhasil diunduh');
      } else {
        showToast('info', 'Tidak ada data untuk diunduh');
      }
  }

  // --- RECALCULATE INVOICE HELPER ---
  const recalculateInvoice = (invoiceId: string, currentPayments: Payment[]) => {
      const inv = invoices.find(i => i.id === invoiceId);
      if (!inv) return;

      const totalPaid = currentPayments
          .filter(p => p.invoiceId === invoiceId)
          .reduce((sum, p) => sum + p.amount, 0);
      
      const statusToUse: InvoiceStatus = totalPaid >= inv.totalAmount ? 'Lunas' : 'Belum Lunas';
      setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, paidAmount: totalPaid, status: statusToUse } : i));
  };

  // --- CRUD HANDLERS ---
  const handleSaveUser = (u: User) => {
    if(users.find(x => x.id === u.id)) { setUsers(prev => prev.map(x => x.id === u.id ? u : x)); addLog('Update User', `Update user ${u.name}`); showToast('success', 'Data user berhasil diperbarui'); } 
    else { setUsers(prev => [...prev, { ...u, id: Date.now().toString() }]); addLog('Tambah User', `Tambah user baru ${u.name}`); showToast('success', 'User baru berhasil ditambahkan'); }
    setModalConfig(null);
  };
  const handleDeleteUser = (id: string) => { if(window.confirm('Hapus user ini?')) { setUsers(prev => prev.filter(u => u.id !== id)); addLog('Hapus User', `Menghapus user ID: ${id}`); showToast('success', 'User berhasil dihapus'); }};

  const handleSavePackage = (pkg: Package) => {
      if(packages.find(p => p.id === pkg.id)) { setPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p)); addLog('Update Paket', `Update paket ${pkg.name}`); showToast('success', 'Paket berhasil diperbarui'); } 
      else { setPackages(prev => [...prev, { ...pkg, id: Date.now().toString() }]); addLog('Tambah Paket', `Tambah paket baru ${pkg.name}`); showToast('success', 'Paket baru berhasil ditambahkan'); }
      setModalConfig(null);
  };
  const handleDeletePackage = (id: string) => { if(window.confirm('Hapus?')) { setPackages(prev => prev.filter(p => p.id !== id)); addLog('Hapus Paket', `Menghapus paket ID: ${id}`); showToast('success', 'Paket berhasil dihapus'); }};

  const handleSavePilgrim = (p: Pilgrim) => {
      if(pilgrims.find(x => x.id === p.id)) { setPilgrims(prev => prev.map(x => x.id === p.id ? p : x)); addLog('Update Jemaah', `Update data ${p.name}`); showToast('success', 'Data jemaah berhasil diperbarui'); } 
      else { setPilgrims(prev => [...prev, { ...p, id: Date.now().toString() }]); addLog('Tambah Jemaah', `Register jemaah ${p.name}`); showToast('success', 'Jemaah baru berhasil ditambahkan'); }
      setModalConfig(null);
  };
  const handleDeletePilgrim = (id: string) => { if(window.confirm('Hapus?')) { setPilgrims(prev => prev.filter(p => p.id !== id)); addLog('Hapus Jemaah', `Menghapus jemaah ID: ${id}`); showToast('success', 'Data jemaah berhasil dihapus'); }};
  
  const handleSaveAgent = (a: Agent) => {
      const code = a.code || generateId('ZZG/AGN/', agents.length, 4);
      if(agents.find(x => x.id === a.id)) { setAgents(prev => prev.map(x => x.id === a.id ? a : x)); addLog('Update Agen', `Update agen ${a.name}`); showToast('success', 'Data agen berhasil diperbarui'); } 
      else { setAgents(prev => [...prev, { ...a, id: Date.now().toString(), code }]); addLog('Tambah Agen', `Register agen ${a.name}`); showToast('success', 'Agen baru berhasil ditambahkan'); }
      setModalConfig(null);
  };
  const handleDeleteAgent = (id: string) => { if(window.confirm('Hapus?')) { setAgents(prev => prev.filter(a => a.id !== id)); addLog('Hapus Agen', `Menghapus agen ID: ${id}`); showToast('success', 'Data agen berhasil dihapus'); }};

  const handleSaveInvoice = (inv: Partial<Invoice>) => {
      const pkg = packages.find(p => p.id === inv.packageId); if(!pkg) return;
      
      if(inv.id) {
        setInvoices(prev => prev.map(i => {
           if(i.id === inv.id) {
               const totalAmount = pkg.price;
               const status = i.paidAmount >= totalAmount ? 'Lunas' : i.paidAmount > 0 ? 'Sebagian' : 'Belum Lunas';
               return { ...i, ...inv, totalAmount, status } as Invoice;
           }
           return i;
        }));
        addLog('Update Invoice', `Update invoice ${inv.invoiceNo}`); 
        showToast('success', 'Invoice berhasil diperbarui');
      } else {
        const newInv: Invoice = { 
            id: Date.now().toString(), 
            invoiceNo: generateId('INV/ZZG/UMR/', invoices.length), 
            date: inv.date || new Date().toISOString(), 
            pilgrimId: inv.pilgrimId!, 
            packageId: inv.packageId!, 
            totalAmount: pkg.price, 
            paidAmount: 0, 
            status: 'Belum Lunas' 
        };
        setInvoices(prev => [...prev, newInv]); 
        addLog('Buat Invoice', `Invoice baru ${newInv.invoiceNo}`); 
        showToast('success', 'Invoice berhasil dibuat'); 
      }
      setModalConfig(null);
  };
  const handleDeleteInvoice = (id: string) => { if(window.confirm('Hapus?')) { setInvoices(prev => prev.filter(i => i.id !== id)); addLog('Hapus Invoice', `Menghapus invoice ID: ${id}`); showToast('success', 'Invoice berhasil dihapus'); }};

  const handleSavePayment = (pay: Partial<Payment>) => {
      const inv = invoices.find(i => i.id === pay.invoiceId); if(!inv) return;
      let newPaymentsList = [...payments];
      if (pay.id) { newPaymentsList = newPaymentsList.map(p => p.id === pay.id ? { ...p, ...pay } as Payment : p); addLog('Edit Pembayaran', `Edit pembayaran ${pay.receiptNo}`); showToast('success', 'Pembayaran berhasil diperbarui'); } 
      else { 
          const newPayment: Payment = { 
              id: Date.now().toString(), 
              receiptNo: generateId('KW/ZZG/UMR/', payments.length), 
              date: pay.date || new Date().toISOString(), 
              invoiceId: pay.invoiceId!, 
              amount: Number(pay.amount), 
              method: pay.method as any,
              remarks: pay.remarks || '' 
          }; 
          newPaymentsList.push(newPayment); 
          addLog('Pembayaran', `Terima pembayaran ${formatCurrency(newPayment.amount)}`); 
          showToast('success', 'Pembayaran berhasil disimpan'); 
      }
      setPayments(newPaymentsList); setTimeout(() => recalculateInvoice(pay.invoiceId!, newPaymentsList), 0); setModalConfig(null);
  };

  const handleDeletePayment = (id: string) => {
      const pay = payments.find(p => p.id === id);
      if(pay && window.confirm('Batalkan?')) { const newPaymentsList = payments.filter(p => p.id !== id); setPayments(newPaymentsList); recalculateInvoice(pay.invoiceId, newPaymentsList); addLog('Hapus Pembayaran', `Membatalkan pembayaran ${pay.receiptNo}`); showToast('success', 'Pembayaran berhasil dihapus'); }
  };

  const handleSaveCommission = (comm: Partial<Commission>) => {
      if(comm.id) { setCommissions(prev => prev.map(c => c.id === comm.id ? {...c, ...comm} as Commission : c)); addLog('Edit Komisi', `Edit komisi ${comm.receiptNo}`); showToast('success', 'Data komisi berhasil diperbarui'); } 
      else { const newComm: Commission = { id: Date.now().toString(), receiptNo: generateId('KW/AGN-ZZG/', commissions.length), date: comm.date || new Date().toISOString(), agentId: comm.agentId!, pilgrimId: comm.pilgrimId!, total: Number(comm.total), status: comm.status as any || 'Belum Terbayar' }; setCommissions(prev => [...prev, newComm]); addLog('Komisi', `Input komisi agen ${formatCurrency(newComm.total)}`); showToast('success', 'Komisi baru berhasil ditambahkan'); }
      setModalConfig(null);
  };
  const handleDeleteCommission = (id: string) => { if(window.confirm('Hapus?')) { setCommissions(prev => prev.filter(c => c.id !== id)); addLog('Hapus Komisi', `Menghapus data komisi ID: ${id}`); showToast('success', 'Data komisi berhasil dihapus'); }};

  // --- VIEWS ---
  
  const DashboardView = () => {
      const totalTrans = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
      const totalPaid = invoices.reduce((acc, curr) => acc + curr.paidAmount, 0);
      const remaining = totalTrans - totalPaid;

      const incomeByMonth = payments.reduce((acc, pay) => {
        const date = new Date(pay.date);
        const monthKey = date.toLocaleString('default', { month: 'short'}); 
        const existing = acc.find(a => a.name === monthKey);
        if (existing) existing.amount += pay.amount;
        else acc.push({ name: monthKey, amount: pay.amount, date: date });
        return acc;
      }, [] as {name: string, amount: number, date: Date}[]);
      
      incomeByMonth.sort((a, b) => a.date.getTime() - b.date.getTime());

      const lunasCount = invoices.filter(i => i.status === 'Lunas').length;
      const belumLunasCount = invoices.filter(i => i.status === 'Belum Lunas').length;
      const sebagianCount = invoices.filter(i => i.status === 'Sebagian').length;
      
      const pieData = [
          { name: 'Lunas', value: lunasCount, color: '#10b981' }, 
          { name: 'Belum Lunas', value: belumLunasCount, color: '#ef4444' }, 
          { name: 'Sebagian', value: sebagianCount, color: '#f59e0b' }, 
      ].filter(d => d.value > 0);

      return (
          <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DashboardCard 
                    title="Total Transaksi" 
                    value={formatCurrency(totalTrans)} 
                    icon={CreditCard} 
                    iconBgClass="bg-blue-50 dark:bg-blue-900/30"
                    colorClass="text-blue-600 dark:text-blue-400"
                  />
                  <DashboardCard 
                    title="Total Terbayar" 
                    value={formatCurrency(totalPaid)} 
                    icon={Wallet} 
                    iconBgClass="bg-emerald-50 dark:bg-emerald-900/30"
                    colorClass="text-emerald-600 dark:text-emerald-400"
                  />
                  <DashboardCard 
                    title="Sisa Tagihan" 
                    value={formatCurrency(remaining)} 
                    icon={TrendingUp} 
                    iconBgClass="bg-orange-50 dark:bg-orange-900/30"
                    colorClass="text-orange-600 dark:text-orange-400"
                  />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DashboardCard 
                    title="Total Jemaah" 
                    value={pilgrims.length} 
                    icon={Users} 
                    iconBgClass="bg-indigo-50 dark:bg-indigo-900/30"
                    colorClass="text-indigo-600 dark:text-indigo-400"
                  />
                  <DashboardCard 
                    title="Jumlah Agen" 
                    value={agents.length} 
                    icon={UserCheck} 
                    iconBgClass="bg-purple-50 dark:bg-purple-900/30"
                    colorClass="text-purple-600 dark:text-purple-400"
                  />
                  <DashboardCard 
                    title="Paket Aktif" 
                    value={packages.filter(p => p.status === 'Aktif').length} 
                    icon={LayoutDashboard} 
                    iconBgClass="bg-rose-50 dark:bg-rose-900/30"
                    colorClass="text-rose-600 dark:text-rose-400"
                  />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100 mb-6">Pendapatan per Bulan</h3>
                    <div className="h-64 sm:h-80">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={incomeByMonth}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                                 <XAxis dataKey="name" stroke="#000" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                 <YAxis stroke="#000" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000000}M`} dx={-10} />
                                 <RechartsTooltip 
                                    cursor={{fill: '#f1f5f9', opacity: 0.4}}
                                    formatter={(val: number) => formatCurrency(val)} 
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#1e293b'}} 
                                 />
                                 <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} isAnimationActive={false} />
                             </BarChart>
                         </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100 mb-6">Status Pembayaran Invoice</h3>
                    <div className="h-64 sm:h-80 flex items-center justify-center">
                         <ResponsiveContainer width="100%" height="100%">
                             <RechartsPieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    isAnimationActive={false}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                     contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#1e293b'}} 
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="square" />
                             </RechartsPieChart>
                         </ResponsiveContainer>
                    </div>
                 </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-6">
                      <ActivityLogIcon className="w-5 h-5 text-slate-950" />
                      <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">10 Aktivitas Terbaru</h3>
                  </div>
                  <div className="overflow-x-auto md:overflow-visible">
                      <table className="w-full text-sm text-left font-sans">
                          <thead className="text-slate-950 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-700">
                              <tr>
                                  <th className="py-3 pr-4 font-bold">Waktu</th>
                                  <th className="py-3 px-4 font-bold">Aktivitas</th>
                                  <th className="py-3 px-4 font-bold">Operator</th>
                                  <th className="py-3 pl-4 font-bold">Detail</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-950 dark:text-slate-300">
                              {logs.length > 0 ? logs.map(log => (
                                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                      <td className="py-3 pr-4 text-slate-950 dark:text-slate-500 font-sans text-sm whitespace-nowrap">{new Date(log.timestamp).toLocaleString('id-ID')}</td>
                                      <td className="py-3 px-4 font-semibold font-sans text-sm">{log.activity}</td>
                                      <td className="py-3 px-4">
                                          <Badge variant="neutral">{log.operator}</Badge>
                                      </td>
                                      <td className="py-3 pl-4 text-slate-950 dark:text-slate-400 whitespace-normal font-sans text-sm">{log.detail}</td>
                                  </tr>
                              )) : (
                                <tr><td colSpan={4} className="py-8 text-center text-slate-950">Belum ada aktivitas</td></tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      );
  };
  
  const ActivityLogIcon = (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  );

  const ReportsView = () => {
    // Filter Period States
    const [selectedMonth, setSelectedMonth] = useState<string>(""); // "" means All
    const [selectedYear, setSelectedYear] = useState<string>("");  // "" means All

    const months = [
        { value: "0", label: "Januari" },
        { value: "1", label: "Februari" },
        { value: "2", label: "Maret" },
        { value: "3", label: "April" },
        { value: "4", label: "Mei" },
        { value: "5", label: "Juni" },
        { value: "6", label: "Juli" },
        { value: "7", label: "Agustus" },
        { value: "8", label: "September" },
        { value: "9", label: "Oktober" },
        { value: "10", label: "November" },
        { value: "11", label: "Desember" }
    ];

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        // Generate list from 2020 to current year
        const startYear = 2020;
        const count = currentYear - startYear + 1;
        return Array.from({ length: count }, (_, i) => (currentYear - i).toString());
    }, []);

    // Filtered Subsets
    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const date = new Date(inv.date);
            const matchesMonth = selectedMonth === "" || date.getMonth().toString() === selectedMonth;
            const matchesYear = selectedYear === "" || date.getFullYear().toString() === selectedYear;
            return matchesMonth && matchesYear;
        });
    }, [invoices, selectedMonth, selectedYear]);

    const filteredCommissions = useMemo(() => {
        return commissions.filter(c => {
            const date = new Date(c.date);
            const matchesMonth = selectedMonth === "" || date.getMonth().toString() === selectedMonth;
            const matchesYear = selectedYear === "" || date.getFullYear().toString() === selectedYear;
            return matchesMonth && matchesYear;
        });
    }, [commissions, selectedMonth, selectedYear]);

    // Financial Data Analysis
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalCommissions = filteredCommissions.filter(c => c.status === 'Terbayar').reduce((sum, c) => sum + c.total, 0);
    const pendingCommissions = filteredCommissions.filter(c => c.status === 'Belum Terbayar').reduce((sum, c) => sum + c.total, 0);
    const netRevenue = totalRevenue - totalCommissions;

    // Per Package Analysis
    const packageStats = useMemo(() => {
        return packages.map(pkg => {
            const pkgInvoices = filteredInvoices.filter(i => i.packageId === pkg.id);
            const pilgrimsCount = pkgInvoices.length;
            const revenue = pkgInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
            const potential = pilgrimsCount * pkg.price;
            return { ...pkg, pilgrimsCount, revenue, potential };
        });
    }, [packages, filteredInvoices]);

    // Performance Ranking Data
    const topAgents = useMemo(() => {
        return agents.map(a => {
            const agentCommissions = filteredCommissions.filter(c => c.agentId === a.id);
            const totalComm = agentCommissions.reduce((sum, c) => sum + c.total, 0);
            const paidComm = agentCommissions.filter(c => c.status === 'Terbayar').reduce((sum, c) => sum + c.total, 0);
            const totalPilgrims = pilgrims.filter(p => p.agentId === a.id).length; 
            return { ...a, totalComm, paidComm, totalPilgrims };
        }).sort((a, b) => b.totalComm - a.totalComm).filter(a => a.totalComm > 0 || a.totalPilgrims > 0).slice(0, 10);
    }, [agents, filteredCommissions, pilgrims]);

    return (
        <div className="space-y-6">
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Laporan Keuangan</h2>
                    <p className="text-sm text-slate-950 font-bold uppercase tracking-tight">
                        Periode: {selectedMonth !== "" ? months.find(m => m.value === selectedMonth)?.label : "Semua Bulan"} {selectedYear !== "" ? selectedYear : "Semua Tahun"}
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border-2 border-slate-200 shadow-sm">
                        <Calendar size={18} className="ml-2 text-slate-950" />
                        <select 
                            className="h-9 rounded-md text-sm text-slate-950 font-bold focus:outline-none border-none bg-transparent cursor-pointer"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="">- Semua Bulan -</option>
                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                        <div className="w-px h-6 bg-slate-300"></div>
                        <select 
                            className="h-9 rounded-md text-sm text-slate-950 font-bold focus:outline-none border-none bg-transparent pr-2 cursor-pointer"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="">- Semua Tahun -</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    
                    <Button variant="outline" size="sm" className="text-slate-950 border-slate-300 font-bold h-[46px]" onClick={handleDownloadExcel}>
                        <Download className="w-4 h-4 mr-2" /> Download Laporan
                    </Button>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-t-4 border-t-emerald-600 bg-white">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-emerald-600 mb-1 tracking-widest">Total Kas Masuk</span>
                        <h4 className="text-xl font-bold text-slate-950">{formatCurrency(totalRevenue)}</h4>
                        <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[70%]"></div>
                        </div>
                    </div>
                </Card>
                <Card className="border-t-4 border-t-rose-600 bg-white">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-rose-600 mb-1 tracking-widest">Komisi Terbayar</span>
                        <h4 className="text-xl font-bold text-slate-950">{formatCurrency(totalCommissions)}</h4>
                        <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 w-[40%]"></div>
                        </div>
                    </div>
                </Card>
                <Card className="border-t-4 border-t-amber-500 bg-white">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-amber-600 mb-1 tracking-widest">Komisi Tertunda</span>
                        <h4 className="text-xl font-bold text-slate-950">{formatCurrency(pendingCommissions)}</h4>
                        <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[20%]"></div>
                        </div>
                    </div>
                </Card>
                <Card className="border-t-4 border-t-blue-600 bg-blue-50/10">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-blue-600 mb-1 tracking-widest">Estimasi Laba</span>
                        <h4 className="text-xl font-bold text-slate-950">{formatCurrency(netRevenue)}</h4>
                        <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[60%]"></div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Breakdown Tables */}
            <div className="grid grid-cols-1 gap-6">
                {/* Package Statistics Table */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PackageIcon className="w-5 h-5 text-slate-950" />
                            <h3 className="font-bold text-slate-950 dark:text-white">Rincian Keuangan per Paket</h3>
                        </div>
                        <Badge variant="neutral">{filteredInvoices.length} Invoice</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-slate-950 font-bold uppercase text-[11px] border-b bg-white tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Nama Paket</th>
                                    <th className="px-6 py-4 text-center">Jemaah</th>
                                    <th className="px-6 py-4 text-right">Potensi Tagihan</th>
                                    <th className="px-6 py-4 text-right">Realisasi Bayar</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans text-slate-950 bg-white">
                                {packageStats.map((pkg) => (
                                    <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold uppercase">{pkg.name}</td>
                                        <td className="px-6 py-4 text-center font-black">{pkg.pilgrimsCount}</td>
                                        <td className="px-6 py-4 text-right font-medium">{formatCurrency(pkg.potential)}</td>
                                        <td className="px-6 py-4 text-right font-black text-emerald-600">{formatCurrency(pkg.revenue)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant={pkg.status === 'Aktif' ? 'success' : 'neutral'}>{pkg.status}</Badge>
                                        </td>
                                    </tr>
                                ))}
                                {packageStats.length === 0 && (
                                    <tr><td colSpan={5} className="py-10 text-center font-bold text-slate-400 uppercase tracking-widest">Tidak ada data pada periode ini</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Agent Performance Table */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-slate-950" />
                            <h3 className="font-bold text-slate-950 dark:text-white">Performa & Pencairan Agen</h3>
                        </div>
                        <Badge variant="neutral">{topAgents.length} Agen Aktif</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-slate-950 font-bold uppercase text-[11px] border-b bg-white tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Peringkat</th>
                                    <th className="px-6 py-4">Nama Agen</th>
                                    <th className="px-6 py-4 text-center">Level</th>
                                    <th className="px-6 py-4 text-center">Ref Jemaah</th>
                                    <th className="px-6 py-4 text-right">Akumulasi Komisi</th>
                                    <th className="px-6 py-4 text-right">Sudah Dibayar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans text-slate-950 bg-white">
                                {topAgents.map((ag, idx) => (
                                    <tr key={ag.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-center font-black">#{idx + 1}</td>
                                        <td className="px-6 py-4 font-bold uppercase">{ag.name}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="neutral">{ag.level}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center font-black">{ag.totalPilgrims}</td>
                                        <td className="px-6 py-4 text-right font-bold">{formatCurrency(ag.totalComm)}</td>
                                        <td className="px-6 py-4 text-right font-black text-emerald-600">{formatCurrency(ag.paidComm)}</td>
                                    </tr>
                                ))}
                                {topAgents.length === 0 && (
                                    <tr><td colSpan={6} className="py-10 text-center font-bold text-slate-400 uppercase tracking-widest">Belum ada aktivitas agen</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const UserManagementView = () => {
      const { paginated, totalItems } = getCurrentData();
      return (
          <div>
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Manajemen Pengguna</h2>
                  <Button onClick={() => setModalConfig({isOpen: true, type: 'user'})}><Plus className="w-4 h-4 mr-2"/> Tambah User</Button>
              </div>
              <DataTable<User>
                  data={paginated}
                  onSearch={setSearchQuery}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  columns={[
                      { header: 'Nama', accessor: (u) => <span className="font-medium text-slate-950 dark:text-white font-sans text-sm">{u.name}</span>, sortKey: 'name' },
                      { header: 'Email', accessor: (u) => <span className="text-slate-950 dark:text-white font-sans text-sm">{u.email}</span> },
                      { header: 'Peran', accessor: (u) => (
                          <Badge variant={u.role === 'Admin' ? 'success' : u.role === 'Keuangan' ? 'warning' : 'neutral'}>{u.role}</Badge>
                      )},
                  ]}
                  actions={(item) => (
                      <div className="flex justify-end gap-2">
                           <Button size="sm" variant="outline" onClick={() => setModalConfig({isOpen: true, type: 'user', data: item})}><Edit className="w-3 h-3"/></Button>
                           <Button size="sm" variant="danger" disabled={item.id === currentUser?.id} onClick={() => handleDeleteUser(item.id)}><Trash2 className="w-3 h-3"/></Button>
                      </div>
                  )}
                  pagination={{
                    currentPage,
                    itemsPerPage,
                    totalItems,
                    onPageChange: setCurrentPage,
                    onItemsPerPageChange: setItemsPerPage
                  }}
              />
          </div>
      );
  }

  const renderContent = () => {
    const { paginated, totalItems } = getCurrentData();
    const commonPaginationProps = {
        currentPage,
        itemsPerPage,
        totalItems,
        onPageChange: setCurrentPage,
        onItemsPerPageChange: setItemsPerPage
    };

    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'users': return <UserManagementView />;
      case 'paket': 
        return (
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Data Paket Umrah</h2>
                    {canAdd && <Button onClick={() => setModalConfig({isOpen: true, type: 'paket'})}><Plus className="w-4 h-4 mr-2"/> Tambah Paket</Button>}
                </div>
                <DataTable<Package>
                    data={paginated}
                    onSearch={setSearchQuery}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    columns={[
                        { header: 'Nama Paket', accessor: (p) => <span className="font-medium text-slate-950 dark:text-white font-sans text-sm">{p.name}</span>, className: 'min-w-[180px]', sortKey: 'name' },
                        { header: 'Harga', accessor: (p) => <span className="font-sans font-semibold whitespace-nowrap text-slate-950 dark:text-white text-sm">{formatCurrency(p.price)}</span>, className: 'min-w-[130px]' },
                        { header: 'Durasi', accessor: (p) => <span className="whitespace-nowrap text-slate-950 dark:text-white font-sans text-sm">{p.duration} Hari</span>, className: 'min-w-[80px] text-center' },
                        { header: 'Tgl. Berangkat', accessor: (p) => <span className="font-sans whitespace-nowrap text-slate-950 dark:text-white text-sm">{formatDate(p.departureDate)}</span>, className: 'min-w-[110px]', sortKey: 'departureDate' },
                        { header: 'Kuota', accessor: (p) => <span className="text-slate-950 dark:text-white font-sans text-sm">{p.quota}</span>, className: 'min-w-[70px] text-center' },
                        { header: 'Sisa', accessor: (p) => {
                            const used = invoices.filter(i => i.packageId === p.id).length;
                            const remaining = p.quota - used;
                            return <span className={cn("font-bold font-sans text-sm", remaining < 5 ? "text-red-600" : "text-emerald-600")}>{remaining}</span>;
                        }, className: 'min-w-[70px] text-center' },
                        { header: 'Status', accessor: (p) => (
                            <Badge variant={p.status === 'Aktif' ? 'success' : p.status === 'Penuh' ? 'warning' : 'neutral'}>{p.status}</Badge>
                        ), className: 'min-w-[90px] text-center' },
                    ]}
                    actions={(item) => (
                        <div className="flex justify-end gap-2">
                             {canManage && (
                                <>
                                    <Button size="sm" variant="outline" onClick={() => setModalConfig({isOpen: true, type: 'paket', data: item})}><Edit className="w-3 h-3"/></Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDeletePackage(item.id)}><Trash2 className="w-3 h-3"/></Button>
                                </>
                             )}
                        </div>
                    )}
                    pagination={commonPaginationProps}
                />
            </div>
        );
      case 'jemaah':
        return (
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Data Jemaah</h2>
                    {canAdd && <Button onClick={() => setModalConfig({isOpen: true, type: 'jemaah'})}><Plus className="w-4 h-4 mr-2"/> Tambah Jemaah</Button>}
                </div>
                <DataTable<Pilgrim>
                    data={paginated}
                    onSearch={setSearchQuery}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    columns={[
                        { header: 'Nama Lengkap', accessor: (p) => <span className="font-medium text-slate-950 dark:text-white font-sans text-sm">{p.name}</span>, className: 'min-w-[160px]', sortKey: 'name' },
                        { header: 'JK', accessor: (p) => <span className="text-slate-950 dark:text-white font-sans text-sm">{p.gender === 'Laki-Laki' ? 'L' : 'P'}</span>, className: 'w-12 text-center' },
                        { header: 'Alamat', accessor: (p) => <span className="block text-slate-950 dark:text-slate-100 break-words font-sans text-sm">{p.address}</span>, className: 'min-w-[200px]' },
                        { header: 'No. HP', accessor: (p) => <span className="font-sans whitespace-nowrap text-slate-950 dark:text-white text-sm">{p.phone}</span>, className: 'min-w-[130px]' },
                        { header: 'Agen', accessor: (p) => <span className="block text-slate-950 dark:text-white font-sans text-sm">{agents.find(a => a.id === p.agentId)?.name || '-'}</span>, className: 'min-w-[120px]' },
                        { header: 'Keterangan', accessor: (p) => {
                            const isBerangkat = p.departureStatus === 'Berangkat';
                            return (
                                <Badge variant={isBerangkat ? 'success' : 'neutral'}>
                                    {isBerangkat ? 'Berangkat' : 'Belum'}
                                </Badge>
                            );
                        }, className: 'min-w-[90px] text-center' },
                    ]}
                    actions={(item) => (
                        <div className="flex justify-end gap-2">
                             {canManage && (
                                <>
                                    <Button size="sm" variant="outline" onClick={() => setModalConfig({isOpen: true, type: 'jemaah', data: item})}><Edit className="w-3 h-3"/></Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDeletePilgrim(item.id)}><Trash2 className="w-3 h-3"/></Button>
                                </>
                             )}
                        </div>
                    )}
                    pagination={commonPaginationProps}
                />
            </div>
        );
      case 'invoice':
        return (
            <div>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Invoice</h2>
                        <div className="w-full sm:w-48">
                            <select 
                                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                                value={selectedPackageFilter}
                                onChange={(e) => setSelectedPackageFilter(e.target.value)}
                            >
                                <option value="">- Semua Paket -</option>
                                {packages.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full sm:w-48">
                            <select 
                                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                                value={selectedStatusFilter}
                                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                            >
                                <option value="">- Semua Status -</option>
                                <option value="Lunas">Lunas</option>
                                <option value="Belum Lunas">Belum Lunas</option>
                                <option value="Sebagian">Sebagian</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        {canAdd && (
                            <>
                                <Button variant="outline" className="flex-1 md:flex-none text-slate-950" onClick={handleDownloadExcel}><Download className="w-4 h-4 mr-2"/> Excel</Button>
                                <Button className="flex-1 md:flex-none" onClick={() => setModalConfig({isOpen: true, type: 'invoice'})}><Plus className="w-4 h-4 mr-2"/> Buat Invoice</Button>
                            </>
                        )}
                    </div>
                </div>
                <DataTable<Invoice>
                    data={paginated}
                    onSearch={setSearchQuery}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    columns={[
                        { header: 'Tgl', accessor: (i) => <span className="font-sans whitespace-nowrap text-slate-950 dark:text-white text-sm">{formatDate(i.date)}</span>, className: 'w-24', sortKey: 'date' },
                        { header: 'No. Invoice', accessor: (i) => <span className="font-sans font-medium uppercase whitespace-nowrap text-slate-950 dark:text-white text-sm">{i.invoiceNo}</span>, className: 'min-w-[160px]' },
                        { header: 'Nama Jemaah', accessor: (i) => <span className="font-medium text-slate-950 dark:text-white font-sans text-sm">{pilgrims.find(p => p.id === i.pilgrimId)?.name || 'Unknown'}</span>, className: 'min-w-[150px]', sortKey: 'name' },
                        { header: 'Paket', accessor: (i) => {
                            const pkg = packages.find(p => p.id === i.packageId);
                            return <span className="block text-slate-950 dark:text-white font-sans text-sm" title={pkg?.name}>{pkg ? pkg.name : '-'}</span>;
                        }, className: 'min-w-[150px]' },
                        { header: 'Total', accessor: (i) => <span className="font-sans font-semibold whitespace-nowrap text-slate-950 dark:text-white text-sm">{formatCurrency(i.totalAmount)}</span>, className: 'min-w-[130px] text-right' },
                        { header: 'Dibayar', accessor: (i) => <span className="text-emerald-600 font-bold font-sans whitespace-nowrap text-sm">{formatCurrency(i.paidAmount)}</span>, className: 'min-w-[130px] text-right' },
                        { header: 'Sisa', accessor: (i) => <span className="text-red-600 font-bold font-sans whitespace-nowrap text-sm">{formatCurrency(i.totalAmount - i.paidAmount)}</span>, className: 'min-w-[130px] text-right' },
                        { header: 'Status', accessor: (i) => (
                            <Badge variant={i.status === 'Lunas' ? 'success' : 'danger'}>{i.status}</Badge>
                        ), className: 'w-28 text-center' },
                    ]}
                    actions={(item) => (
                        <div className="flex justify-end gap-1">
                             <Button size="sm" variant="secondary" title="View History" onClick={() => setModalConfig({isOpen: true, type: 'history', data: item})}><History className="w-3.5 h-3.5"/></Button>
                             {canAdd && (
                                <Button size="sm" variant="ghost" title="Print Invoice" onClick={() => setPrintConfig({isOpen: true, type: 'invoice', dataId: item.id})}><Printer className="w-3.5 h-3.5"/></Button>
                             )}
                             {canManage && (
                                <>
                                    <Button size="sm" variant="outline" onClick={() => setModalConfig({isOpen: true, type: 'invoice', data: item})}><Edit className="w-3 h-3"/></Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDeleteInvoice(item.id)}><Trash2 className="w-3 h-3"/></Button>
                                </>
                             )}
                        </div>
                    )}
                    pagination={commonPaginationProps}
                />
            </div>
        );
      case 'pembayaran':
        return (
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Daftar Pembayaran</h2>
                    {canAdd && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleDownloadExcel} className="text-slate-950"><Download className="w-4 h-4 mr-2"/> Excel</Button>
                            <Button onClick={() => setModalConfig({isOpen: true, type: 'pembayaran'})}><Plus className="w-4 h-4 mr-2"/> Input Pembayaran</Button>
                        </div>
                    )}
                </div>
                <DataTable<Payment>
                    data={paginated}
                    onSearch={setSearchQuery}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    columns={[
                        { header: 'Tgl Bayar', accessor: (p) => <span className="font-sans whitespace-nowrap text-slate-950 dark:text-white text-sm">{formatDate(p.date)}</span>, className: 'w-28', sortKey: 'date' },
                        { header: 'No. Kwitansi', accessor: (p) => <span className="font-sans font-medium uppercase whitespace-nowrap text-slate-950 dark:text-white text-sm">{p.receiptNo}</span>, className: 'min-w-[160px]' },
                        { header: 'Inv Ref', accessor: (p) => <span className="font-sans text-slate-950 whitespace-nowrap dark:text-white text-sm">{invoices.find(i => i.id === p.invoiceId)?.invoiceNo || '-'}</span>, className: 'min-w-[140px]' },
                        { header: 'Jemaah', accessor: (p) => {
                            const inv = invoices.find(i => i.id === p.invoiceId);
                            return <span className="font-medium text-slate-950 dark:text-white font-sans text-sm">{pilgrims.find(pil => pil.id === inv?.pilgrimId)?.name || '-'}</span>;
                        }, className: 'min-w-[150px]', sortKey: 'name' },
                        { header: 'Metode', accessor: (p) => <span className="text-slate-950 dark:text-white font-sans text-sm">{p.method}</span>, className: 'w-28 text-center' },
                        { header: 'Keterangan', accessor: (p) => <span className="text-slate-950 break-words dark:text-white font-sans text-sm">{p.remarks || '-'}</span>, className: 'min-w-[120px]' },
                        { header: 'Jumlah', accessor: (p) => <span className="font-bold text-emerald-600 dark:text-emerald-400 font-sans whitespace-nowrap text-sm">{formatCurrency(p.amount)}</span>, className: 'min-w-[130px] text-right' },
                    ]}
                    actions={(item) => (
                        <div className="flex justify-end gap-2">
                             {canAdd && (
                                <Button size="sm" variant="ghost" onClick={() => setPrintConfig({isOpen: true, type: 'payment', dataId: item.id})}><Printer className="w-3.5 h-3.5 text-slate-950 dark:text-slate-300"/></Button>
                             )}
                             {canManage && (
                                <>
                                    <Button size="sm" variant="outline" onClick={() => setModalConfig({isOpen: true, type: 'pembayaran', data: item})}><Edit className="w-3 h-3"/></Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDeletePayment(item.id)}><Trash2 className="w-3 h-3"/></Button>
                                </>
                             )}
                        </div>
                    )}
                    pagination={commonPaginationProps}
                />
            </div>
        );
      case 'agen':
        return (
             <div>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Data Agen</h2>
                    {canAdd && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleDownloadExcel} className="text-slate-950"><Download className="w-4 h-4 mr-2"/> Excel</Button>
                            <Button onClick={() => setModalConfig({isOpen: true, type: 'agen'})}><Plus className="w-4 h-4 mr-2"/> Tambah Agen</Button>
                        </div>
                    )}
                </div>
                <DataTable<Agent>
                    data={paginated}
                    onSearch={setSearchQuery}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    columns={[
                        { header: 'Kode', accessor: (a) => <span className="font-sans font-bold whitespace-nowrap text-slate-950 dark:text-white text-sm">{a.code}</span>, className: 'w-32' },
                        { header: 'Nama Agen', accessor: (a) => <span className="font-medium text-slate-950 dark:text-white font-sans text-sm">{a.name}</span>, className: 'min-w-[150px]', sortKey: 'name' },
                        { header: 'JK', accessor: (a) => <span className="text-slate-950 dark:text-white font-sans text-sm">{a.gender === 'Laki-Laki' ? 'L' : 'P'}</span>, className: 'w-10 text-center' },
                        { header: 'Alamat', accessor: (a) => <span className="block text-slate-950 dark:text-slate-100 break-words font-sans text-sm" title={a.address}>{a.address}</span>, className: 'min-w-[180px]' },
                        { header: 'No. HP', accessor: (a) => <span className="font-sans whitespace-nowrap text-slate-950 dark:text-white text-sm">{a.phone}</span>, className: 'w-32' },
                        { header: 'Jabatan', accessor: (a) => <Badge variant="neutral">{a.level}</Badge>, className: 'w-24 text-center' },
                        { header: 'Upline', accessor: (a) => <span className="block text-slate-950 dark:text-white font-sans text-sm">{agents.find(u => u.id === a.uplineId)?.name || '-'}</span>, className: 'min-w-[120px]' },
                    ]}
                    actions={(item) => (
                        <div className="flex justify-end gap-2">
                            {canManage && (
                                <>
                                    <Button size="sm" variant="outline" onClick={() => setModalConfig({isOpen: true, type: 'agen', data: item})}><Edit className="w-3 h-3"/></Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDeleteAgent(item.id)}><Trash2 className="w-3 h-3"/></Button>
                                </>
                            )}
                        </div>
                    )}
                    pagination={commonPaginationProps}
                />
            </div>
        );
      case 'komisi':
          return (
              <div>
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Komisi Agen</h2>
                      {canAdd && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleDownloadExcel} className="text-slate-950"><Download className="w-4 h-4 mr-2"/> Excel</Button>
                            <Button onClick={() => setModalConfig({isOpen: true, type: 'komisi'})}><Plus className="w-4 h-4 mr-2"/> Input Komisi</Button>
                        </div>
                      )}
                  </div>
                  <DataTable<Commission>
                      data={paginated}
                      onSearch={setSearchQuery}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      columns={[
                          { header: 'Tanggal', accessor: (c) => <span className="font-sans text-slate-950 dark:text-white text-sm">{formatDate(c.date)}</span>, className: 'w-28', sortKey: 'date' },
                          { header: 'No. Kwitansi', accessor: (c) => <span className="font-sans font-medium uppercase text-slate-950 dark:text-white text-sm">{c.receiptNo}</span>, className: 'min-w-[140px]' },
                          { header: 'Agen', accessor: (c) => <span className="font-medium text-slate-950 dark:text-white break-words font-sans text-sm">{agents.find(a => a.id === c.agentId)?.name || 'Unknown'}</span>, className: 'min-w-[180px]', sortKey: 'name' },
                          { header: 'Ref Jemaah', accessor: (c) => <span className="text-slate-950 dark:text-white break-words font-sans text-sm">{pilgrims.find(p => p.id === c.pilgrimId)?.name || '-'}</span>, className: 'min-w-[180px]' },
                          { header: 'Total Komisi', accessor: (c) => <span className="font-bold text-emerald-600 dark:text-emerald-400 font-sans whitespace-nowrap text-sm">{formatCurrency(c.total)}</span>, className: 'min-w-[130px] text-right' },
                          { header: 'Status', accessor: (c) => <Badge variant={c.status === 'Terbayar' ? 'success' : 'warning'}>{c.status}</Badge>, className: 'min-w-[100px] text-center' },
                      ]}
                      actions={(item) => (
                        <div className="flex justify-end gap-2">
                            {canAdd && (
                                <Button size="sm" variant="ghost" onClick={() => setPrintConfig({isOpen: true, type: 'commission', dataId: item.id})}><Printer className="w-3.5 h-3.5 text-slate-950 dark:text-slate-300"/></Button>
                            )}
                            {canManage && (
                                <>
                                    <Button size="sm" variant="outline" onClick={() => setModalConfig({isOpen: true, type: 'komisi', data: item})}><Edit className="w-3 h-3"/></Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDeleteCommission(item.id)}><Trash2 className="w-3 h-3"/></Button>
                                </>
                            )}
                        </div>
                      )}
                      pagination={commonPaginationProps}
                  />
              </div>
          )
      case 'laporan': return <ReportsView />;
      case 'pengaturan': return <SettingsView settings={settings} onSave={handleSaveSettings} isAdmin={isAdmin} />;
      default: return null;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors">
        <div className="w-full max-w-md p-4">
           <Card className="p-8 shadow-xl border-t-4 border-emerald-600 dark:border-emerald-500">
              <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Zam Zam Group</h1>
                  <p className="text-slate-950 dark:text-slate-400 text-sm">Sistem Informasi Manajemen Travel Umrah</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                  <Input 
                    label="Email" 
                    type="email" 
                    value={loginEmail} 
                    onChange={e => setLoginEmail(e.target.value)} 
                    required 
                  />
                  <Input 
                    label="Password" 
                    type="password" 
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)} 
                    required 
                  />
                  <Button type="submit" className="w-full mt-4" size="lg">Masuk Aplikasi</Button>
              </form>
              <div className="mt-6 text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Zam Zam Group
              </div>
          </Card>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'paket', label: 'Data Paket', icon: FileText },
    { id: 'jemaah', label: 'Data Jemaah', icon: Users },
    { id: 'agen', label: 'Data Agen', icon: UserCheck },
    { id: 'invoice', label: 'Invoice', icon: FileText },
    { id: 'pembayaran', label: 'Pembayaran', icon: CreditCard },
    { id: 'komisi', label: 'Komisi Agen', icon: Wallet },
    { id: 'laporan', label: 'Laporan', icon: PieChart },
  ];
  
  if (canManage) {
    navItems.push({ id: 'users', label: 'Pengguna', icon: UserIcon });
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-950 dark:text-slate-100 transition-colors">
      <aside 
        className={cn(
          "bg-emerald-950 text-white transition-all duration-300 flex flex-col fixed md:relative z-20 h-full border-r border-emerald-900 shadow-xl shrink-0", 
          isSidebarOpen ? "w-64" : "w-0 md:w-20 overflow-hidden"
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-emerald-900 bg-emerald-900 shrink-0">
          {isSidebarOpen && (
              <span className="font-bold text-white text-lg tracking-wide whitespace-nowrap">
                ZAM ZAM GROUP
              </span>
          )}
           {!isSidebarOpen && <span className="font-bold text-white">ZZG</span>}
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                  activeTab === item.id 
                    ? "bg-emerald-600 text-white shadow-md" 
                    : "hover:bg-emerald-800 text-white/80 hover:text-white"
                )}
              >
                <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-white/80"} />
                {isSidebarOpen && <span className={activeTab === item.id ? "text-white" : "text-white/80"}>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-emerald-900 shrink-0">
          {isAdmin && (
             <button
                onClick={() => setActiveTab('pengaturan')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium mb-1",
                  activeTab === 'pengaturan' ? "bg-emerald-900 text-white" : "text-white/80 hover:text-white hover:bg-emerald-900"
                )}
              >
                <Settings size={20} className={activeTab === 'pengaturan' ? "text-white" : "text-white/80"} />
                {isSidebarOpen && <span className={activeTab === 'pengaturan' ? "text-white" : "text-white/80"}>Pengaturan</span>}
              </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium text-white/80 hover:bg-red-950/30 hover:text-red-300"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10 transition-colors shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-950 dark:text-slate-300">
              <Menu size={20} />
            </button>
             <div className="hidden sm:flex items-center gap-2 text-sm text-slate-950 dark:text-slate-400">
                <Clock size={16} />
                <span>
                    {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-950 dark:text-slate-300 transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex Boyd items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-950 dark:text-slate-100 leading-tight">{currentUser.name}</p>
                <p className="text-xs text-slate-950 dark:text-slate-400">{currentUser.role}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 no-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
           <div className="max-w-full mx-auto w-full transition-all duration-300">
            {renderContent()}
           </div>
        </div>
      </main>

      <Modal 
        isOpen={!!modalConfig} 
        onClose={() => setModalConfig(null)} 
        title={
          !modalConfig ? '' :
          modalConfig.type === 'user' ? (modalConfig.data ? 'Edit User' : 'Tambah User') :
          modalConfig.type === 'paket' ? (modalConfig.data ? 'Edit Paket' : 'Tambah Paket') :
          modalConfig.type === 'jemaah' ? (modalConfig.data ? 'Edit Jemaah' : 'Tambah Jemaah') :
          modalConfig.type === 'agen' ? (modalConfig.data ? 'Edit Agen' : 'Tambah Agen') :
          modalConfig.type === 'invoice' ? (modalConfig.data ? 'Edit Invoice' : 'Buat Invoice Baru') :
          modalConfig.type === 'pembayaran' ? (modalConfig.data ? 'Edit Pembayaran' : 'Input Pembayaran') :
          modalConfig.type === 'komisi' ? (modalConfig.data ? 'Edit Komisi' : 'Input Komisi') :
          modalConfig.type === 'history' ? 'Riwayat Pembayaran' : ''
        }
      >
        {modalConfig && (
           <FormRenderer 
              type={modalConfig.type} 
              data={modalConfig.data} 
              onClose={() => setModalConfig(null)}
              onSaveUser={handleSaveUser}
              onSavePackage={handleSavePackage}
              onSavePilgrim={handleSavePilgrim}
              onSaveAgent={handleSaveAgent}
              onCreateInvoice={handleSaveInvoice}
              onSavePayment={handleSavePayment}
              onSaveCommission={handleSaveCommission}
              onPrint={(type: any, id: string) => setPrintConfig({isOpen: true, type, dataId: id})}
              packages={packages}
              agents={agents}
              pilgrims={pilgrims}
              invoices={invoices}
              payments={payments}
           />
        )}
      </Modal>

      {printConfig && (
         <div className="fixed inset-0 z-[70] bg-slate-900/90 flex flex-col animate-in fade-in duration-200 overflow-hidden no-scrollbar">
            <div className="h-14 bg-slate-800 flex items-center justify-between px-4 shadow-md shrink-0 no-print">
               <div className="flex items-center gap-3">
                 <Printer className="text-emerald-400" size={20} />
                 <h3 className="text-white font-medium">Pratinjau Cetak {printConfig.type.toUpperCase()}</h3>
               </div>
               <div className="flex gap-2">
                 <Button size="sm" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2"/> Cetak Sekarang</Button>
                 <Button size="sm" variant="danger" onClick={() => setPrintConfig(null)}><X className="w-4 h-4 mr-2"/> Tutup</Button>
               </div>
            </div>
            <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center no-scrollbar">
               <div 
                className={cn(
                  "bg-white shadow-2xl origin-top transform scale-75 md:scale-90 lg:scale-100 transition-transform print-area text-black print:transform-none print:scale-100 print:origin-top-left",
                  (printConfig.type === 'invoice' || printConfig.type === 'history') ? "w-full max-w-[210mm] min-h-[297mm]" : "w-full max-w-[210mm] min-h-[148mm]"
                )}
               >
                  {printConfig.type === 'invoice' && (
                     <InvoiceTemplate 
                        company={settings}
                        invoice={invoices.find(i => i.id === printConfig.dataId)!}
                        pilgrim={pilgrims.find(p => p.id === invoices.find(i => i.id === printConfig.dataId)?.pilgrimId)!}
                        pkg={packages.find(p => p.id === invoices.find(i => i.id === printConfig.dataId)?.packageId)!}
                     />
                  )}
                  {printConfig.type === 'payment' && (
                     <PaymentReceiptTemplate 
                        company={settings}
                        payment={payments.find(p => p.id === printConfig.dataId)!}
                        invoice={invoices.find(i => i.id === payments.find(p => p.id === printConfig.dataId)?.invoiceId)!}
                        pilgrim={pilgrims.find(p => p.id === invoices.find(i => i.id === printConfig.dataId)?.pilgrimId)!}
                        pkg={packages.find(p => p.id === invoices.find(i => i.id === printConfig.dataId)?.packageId)!}
                     />
                  )}
                  {printConfig.type === 'commission' && (
                      <CommissionReceiptTemplate 
                        company={settings}
                        commission={commissions.find(c => c.id === printConfig.dataId)!}
                        agent={agents.find(a => a.id === commissions.find(c => c.id === printConfig.dataId)?.agentId)!}
                        pilgrim={pilgrims.find(p => p.id === commissions.find(c => c.id === printConfig.dataId)?.pilgrimId)!}
                      />
                  )}
                   {printConfig.type === 'history' && (
                      <InvoiceHistoryTemplate 
                        company={settings}
                        invoice={invoices.find(i => i.id === printConfig.dataId)!}
                        pilgrim={pilgrims.find(p => p.id === invoices.find(i => i.id === printConfig.dataId)?.pilgrimId)!}
                        payments={payments.filter(p => p.invoiceId === printConfig.dataId)}
                      />
                  )}
               </div>
            </div>
         </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
