import React from 'react';
import { cn } from '../utils';
import { X, CheckCircle, AlertCircle, Info, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

// --- Toast / Notification ---
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={cn(
            "pointer-events-auto flex items-center w-80 p-4 rounded-lg shadow-lg border transition-all animate-in slide-in-from-right duration-300",
            toast.type === 'success' ? "bg-white dark:bg-slate-800 border-emerald-500 text-slate-950 dark:text-slate-100" :
            toast.type === 'error' ? "bg-white dark:bg-slate-800 border-red-500 text-slate-950 dark:text-slate-100" :
            "bg-white dark:bg-slate-800 border-blue-500 text-slate-950 dark:text-slate-100"
          )}
        >
          <div className={cn("mr-3", 
            toast.type === 'success' ? "text-emerald-500" :
            toast.type === 'error' ? "text-red-500" : "text-blue-500"
          )}>
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
          </div>
          <div className="flex-1 text-sm font-medium">{toast.message}</div>
          <button onClick={() => removeToast(toast.id)} className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', size = 'md', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500",
    secondary: "bg-slate-100 text-slate-950 hover:bg-slate-200 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-950 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export const Input: React.FC<InputProps> = ({ label, className, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-950 dark:text-slate-300">{label}</label>}
    <input
      className={cn("flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500", className)}
      {...props}
    />
  </div>
);

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string | number }[];
}
export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-950 dark:text-slate-300">{label}</label>}
    <select
      className={cn("flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100", className)}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className, title }) => (
  <div className={cn("rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50", className)}>
    {title && (
      <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-semibold leading-none tracking-tight text-slate-950 dark:text-white">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'neutral' }> = ({ children, variant = 'neutral' }) => {
  const colors = {
    success: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    neutral: 'bg-slate-200 text-slate-950 dark:bg-slate-700 dark:text-slate-300',
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", colors[variant])}>{children}</span>;
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
      <div className={cn("relative w-full rounded-lg bg-white shadow-lg animate-in zoom-in-95 duration-200 dark:bg-slate-800 dark:border dark:border-slate-700", maxWidth)}>
        <div className="flex items-center justify-between border-b p-4 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-700 dark:text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Table Helper ---
interface DataTableProps<T> {
  data: T[];
  columns: { header: string; accessor: (item: T) => React.ReactNode; className?: string; sortKey?: string }[];
  actions?: (item: T) => React.ReactNode;
  onSearch: (term: string) => void;
  onSort?: (key: string) => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  pagination?: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (num: number) => void;
  };
}

export function DataTable<T extends { id: string }>({ data, columns, actions, onSearch, onSort, sortConfig, pagination }: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {pagination && (
            <select
              className="h-9 rounded-md border border-slate-300 text-sm px-2 text-slate-950 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
              value={pagination.itemsPerPage}
              onChange={(e) => pagination.onItemsPerPageChange(Number(e.target.value))}
            >
              {[10, 30, 50, 100].map(n => <option key={n} value={n}>{n} Entri</option>)}
            </select>
          )}
        </div>
        <div className="relative w-full sm:w-64">
            <Input 
                placeholder="Cari..." 
                className="w-full"
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
      </div>
      
      <div className="rounded-md border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse table-auto font-sans not-italic">
            <thead className="bg-slate-50 text-slate-950 font-bold border-b border-slate-200 dark:bg-slate-700/50 dark:text-slate-100 dark:border-slate-700">
              <tr>
                {columns.map((col, idx) => (
                  <th 
                    key={idx} 
                    className={cn(
                      "px-4 py-3 align-top whitespace-nowrap not-italic", 
                      col.sortKey ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors select-none" : "",
                      col.className
                    )}
                    onClick={() => col.sortKey && onSort && onSort(col.sortKey)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortKey && (
                        <div className="text-slate-950 dark:text-slate-400">
                          {sortConfig?.key === col.sortKey ? (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-emerald-600" /> : <ChevronDown size={14} className="text-emerald-600" />
                          ) : (
                            <ChevronsUpDown size={14} className="opacity-80 text-slate-950" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th className="px-4 py-3 text-right align-top whitespace-nowrap min-w-[100px] not-italic">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:bg-slate-800 dark:divide-slate-700 font-sans not-italic">
              {data.length > 0 ? (
                  data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      {columns.map((col, idx) => (
                      <td key={idx} className={cn("px-4 py-3 text-slate-950 dark:text-slate-100 align-middle whitespace-normal break-words text-sm not-italic font-sans", col.className)}>{col.accessor(item)}</td>
                      ))}
                      {actions && <td className="px-4 py-3 text-right space-x-2 align-middle whitespace-nowrap not-italic">{actions(item)}</td>}
                  </tr>
                  ))
              ) : (
                  <tr>
                      <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-8 text-center text-slate-950 dark:text-slate-400 not-italic font-sans">
                          Data tidak ditemukan
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-950 dark:text-slate-400 font-sans not-italic">
          <div className="text-center sm:text-left">
            Menampilkan {Math.min(pagination.totalItems, (pagination.currentPage - 1) * pagination.itemsPerPage + 1)} sampai {Math.min(pagination.totalItems, pagination.currentPage * pagination.itemsPerPage)} dari {pagination.totalItems} data
          </div>
          <div className="flex gap-1">
            <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.currentPage === 1}
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                className="text-slate-950 border-slate-300"
            >
                Sebelumnya
            </Button>
            <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems}
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                className="text-slate-950 border-slate-300"
            >
                Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
