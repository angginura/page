import React from 'react';
import { CompanySettings, Invoice, Payment, Commission, Pilgrim, Package, Agent } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface PrintHeaderProps {
  company: CompanySettings;
  title: string;
}

// Header Standar untuk Invoice & Riwayat (A4)
const StandardHeader: React.FC<PrintHeaderProps> = ({ company, title }) => (
  <div className="border-b-2 border-black pb-4 mb-6 flex items-center justify-between font-sans text-black">
    <div className="flex items-center gap-4">
      {company.logoUrl && <img src={company.logoUrl} alt="Logo" className="h-16 w-auto object-contain" />}
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide leading-none mb-1">{company.name}</h1>
        <p className="text-sm max-w-md leading-snug">{company.address}</p>
        <p className="text-sm mt-1 font-medium">Telp: {company.phone}</p>
      </div>
    </div>
    <div className="text-right">
      <h2 className="text-xl font-bold uppercase">{title}</h2>
    </div>
  </div>
);

// --- INVOICE TEMPLATE (A4 Full) ---
export const InvoiceTemplate = ({ company, invoice, pilgrim, pkg }: { company: CompanySettings, invoice: Invoice, pilgrim: Pilgrim, pkg: Package }) => (
  <div className="bg-white p-8 w-full max-w-[210mm] min-h-[297mm] mx-auto print-area font-sans text-black">
    <style>{`@page { margin: 10mm; }`}</style>
    <StandardHeader company={company} title="INVOICE / TAGIHAN" />
    
    <div className="flex justify-between mb-8">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Ditagihkan Kepada</h3>
        <p className="text-lg font-bold">{pilgrim.name}</p>
        <p className="text-sm max-w-xs">{pilgrim.address}</p>
        <p className="text-sm">{pilgrim.phone}</p>
      </div>
      <div className="text-right">
        <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-wider block">No. Invoice</span>
            <span className="font-mono text-lg font-medium">{invoice.invoiceNo}</span>
        </div>
        <div>
            <span className="text-xs font-bold uppercase tracking-wider block">Tanggal</span>
            <span className="text-sm font-medium">{formatDate(invoice.date)}</span>
        </div>
      </div>
    </div>

    <div className="border border-black rounded-sm overflow-hidden mb-8">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-100 border-b border-black">
            <th className="py-3 px-4 text-left font-bold text-sm">Deskripsi Paket</th>
            <th className="py-3 px-4 text-right font-bold text-sm">Keberangkatan</th>
            <th className="py-3 px-4 text-right font-bold text-sm">Durasi</th>
            <th className="py-3 px-4 text-right font-bold text-sm">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-4 px-4 border-b border-black">
              <p className="font-bold">{pkg.name}</p>
              <p className="text-xs mt-1">Paket Umrah & Wisata Halal</p>
            </td>
            <td className="py-4 px-4 text-right border-b border-black text-sm">{formatDate(pkg.departureDate)}</td>
            <td className="py-4 px-4 text-right border-b border-black text-sm">{pkg.duration} Hari</td>
            <td className="py-4 px-4 text-right border-b border-black font-bold">{formatCurrency(invoice.totalAmount)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="flex justify-end">
        <div className="w-72 bg-slate-50 border border-black rounded-sm p-4 space-y-3">
            <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
                <span>Pembayaran Diterima</span>
                <span>(-) {formatCurrency(invoice.paidAmount)}</span>
            </div>
            <div className="border-t border-black pt-3 flex justify-between items-end">
                <span className="text-sm font-bold">Sisa Tagihan</span>
                <span className="text-xl font-bold">{formatCurrency(invoice.totalAmount - invoice.paidAmount)}</span>
            </div>
        </div>
    </div>

    <div className="mt-16 border-t border-black pt-8 flex justify-between items-end text-black">
        <div className="text-[10px] italic max-w-sm">
            <p className="font-bold uppercase not-italic mb-1">Syarat & Ketentuan:</p>
            <p>1. Pembayaran dianggap sah jika dana sudah masuk ke rekening perusahaan.</p>
            <p>2. Simpan invoice ini sebagai bukti pemesanan paket umrah yang sah.</p>
        </div>
        <div className="text-center px-12">
            <p className="text-sm font-bold mb-20 uppercase">Finance Dept.</p>
            <div className="w-48 border-t border-black pt-1">
                <p className="font-bold uppercase text-sm">{company.name}</p>
            </div>
        </div>
    </div>
  </div>
);

// --- HISTORY TEMPLATE (A4 Full) ---
export const InvoiceHistoryTemplate = ({ company, invoice, pilgrim, payments }: { company: CompanySettings, invoice: Invoice, pilgrim: Pilgrim, payments: Payment[] }) => (
    <div className="bg-white p-8 w-full max-w-[210mm] min-h-[297mm] mx-auto print-area font-sans text-black">
      <style>{`@page { margin: 10mm; }`}</style>
      <StandardHeader company={company} title="RIWAYAT PEMBAYARAN" />
      
      <div className="grid grid-cols-2 gap-8 mb-8 border border-black p-4 rounded-sm">
        <div>
          <h3 className="text-xs font-bold uppercase mb-1">Jemaah</h3>
          <p className="font-bold text-lg">{pilgrim.name}</p>
          <p className="text-sm">{pilgrim.phone}</p>
        </div>
        <div className="text-right">
             <div className="mb-2">
                <span className="text-xs uppercase font-bold">Total Tagihan</span>
                <p className="font-bold text-xl">{formatCurrency(invoice.totalAmount)}</p>
            </div>
             <div>
                <span className="text-xs uppercase font-bold">Sisa Pembayaran</span>
                <p className="font-bold text-xl text-red-600">{formatCurrency(invoice.totalAmount - invoice.paidAmount)}</p>
            </div>
        </div>
      </div>
  
      <table className="w-full text-sm border-collapse border border-black text-black">
        <thead>
          <tr className="bg-slate-100 border-b border-black">
            <th className="py-2 px-3 text-left font-bold border-r border-black">No. Kwitansi</th>
            <th className="py-2 px-3 text-left font-bold border-r border-black">Tanggal</th>
            <th className="py-2 px-3 text-left font-bold border-r border-black">Metode</th>
            <th className="py-2 px-3 text-left font-bold border-r border-black">Keterangan</th>
            <th className="py-2 px-3 text-right font-bold">Jumlah</th>
          </tr>
        </thead>
        <tbody>
            {payments.map((pay) => (
                <tr key={pay.id} className="border-b border-black">
                    <td className="py-3 px-3 border-r border-black font-mono text-xs">{pay.receiptNo}</td>
                    <td className="py-3 px-3 border-r border-black">{formatDate(pay.date)}</td>
                    <td className="py-3 px-3 border-r border-black">{pay.method}</td>
                    <td className="py-3 px-3 border-r border-black italic">{pay.remarks || '-'}</td>
                    <td className="py-3 px-3 text-right font-bold">{formatCurrency(pay.amount)}</td>
                </tr>
            ))}
        </tbody>
        <tfoot>
            <tr className="bg-slate-50 border-t-2 border-black">
                <td colSpan={4} className="py-3 px-3 text-right font-bold border-r border-black uppercase">Total Terbayar</td>
                <td className="py-3 px-3 text-right font-bold text-lg">{formatCurrency(invoice.paidAmount)}</td>
            </tr>
        </tfoot>
      </table>
    </div>
  );

// --- PAYMENT RECEIPT (Responsive Width, 140mm height) ---
export const PaymentReceiptTemplate = ({ company, payment, invoice, pilgrim, pkg }: { company: CompanySettings, payment: Payment, invoice: Invoice, pilgrim: Pilgrim, pkg: Package }) => {
    return (
        <div className="bg-white w-full font-sans text-black relative print-area overflow-hidden mx-auto">
            <style>{`@page { margin: 10mm; }`}</style>
            
            {/* Bagian Informasi (Fixed 140mm height) */}
            <div className="h-[140mm] p-[5mm] flex flex-col">
                
                {/* Header dengan Garis Pemisah Kop Surat Tegas */}
                <div className="flex items-start justify-between border-b-2 border-black pb-4 mb-6">
                    <div className="flex items-center gap-4">
                        {company.logoUrl && <img src={company.logoUrl} alt="Logo" className="h-16 w-auto object-contain" />}
                        <div className="space-y-0.5">
                            <h1 className="text-xl font-bold uppercase tracking-tight leading-none text-black">{company.name}</h1>
                            <p className="text-[10px] text-black max-w-sm leading-tight">{company.address}</p>
                            <p className="text-[10px] text-black font-semibold">Telp : {company.phone}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold uppercase text-black mb-1">KWITANSI PEMBAYARAN</h2>
                        <div className="text-[11px] space-y-0.5 text-black font-semibold">
                            <p className="uppercase">NO. TRANSAKSI : {payment.receiptNo}</p>
                            <p className="uppercase">TANGGAL : {new Date(payment.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Konten Utama */}
                <div className="space-y-5">
                    <div className="flex items-baseline gap-4">
                        <div className="w-40 text-[12px] font-bold uppercase whitespace-nowrap">TELAH TERIMA DARI</div>
                        <div className="flex-1 text-[14px] font-bold uppercase border-b border-black border-dotted">
                            : {pilgrim.name}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-1">
                        <div className="w-40 text-[12px] font-bold uppercase whitespace-nowrap">UANG SEJUMLAH</div>
                        <div className="flex-1">
                            <div className="border border-black px-4 py-1 text-2xl font-bold tracking-tight inline-block min-w-[300px]">
                                Rp {payment.amount.toLocaleString('id-ID')}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <div className="w-40 text-[12px] font-bold uppercase whitespace-nowrap">UNTUK PEMBAYARAN</div>
                        <div className="flex-1 text-[12px] font-medium uppercase border-b border-black border-dotted">
                            : {pkg?.name} ({invoice.invoiceNo})
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <div className="w-40 text-[12px] font-bold uppercase whitespace-nowrap">METODE/KETERANGAN</div>
                        <div className="flex-1 text-[12px] font-medium uppercase border-b border-black border-dotted">
                            : {payment.method} {payment.remarks ? `– ${payment.remarks.toUpperCase()}` : ''}
                        </div>
                    </div>
                </div>

                {/* Footer Signatures */}
                <div className="mt-10 flex justify-between items-start px-12">
                    <div className="text-center">
                        <p className="text-[12px] font-bold mb-20 uppercase">PENYETOR</p>
                        <p className="text-[12px] font-medium leading-none">(............................................................)</p>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-[12px] font-bold mb-20 uppercase">PENERIMA</p>
                        <p className="text-[12px] font-medium leading-none">(............................................................)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMMISSION RECEIPT (Responsive Width, 140mm height) ---
export const CommissionReceiptTemplate = ({ company, commission, agent, pilgrim }: { company: CompanySettings, commission: Commission, agent: Agent, pilgrim: Pilgrim }) => {
    return (
        <div className="bg-white w-full font-sans text-black relative print-area overflow-hidden mx-auto">
             <style>{`@page { margin: 10mm; }`}</style>
             
             {/* Bagian Informasi (Fixed 140mm height) */}
             <div className="h-[140mm] p-[5mm] flex flex-col">
                
                {/* Header dengan Garis Pemisah Kop Surat Tegas */}
                <div className="flex items-start justify-between border-b-2 border-black pb-4 mb-6">
                    <div className="flex items-center gap-4">
                        {company.logoUrl && <img src={company.logoUrl} alt="Logo" className="h-16 w-auto object-contain" />}
                        <div className="space-y-0.5">
                            <h1 className="text-xl font-bold uppercase tracking-tight leading-none text-black">{company.name}</h1>
                            <p className="text-[10px] text-black max-w-sm leading-tight">{company.address}</p>
                            <p className="text-[10px] text-black font-semibold">Telp : {company.phone}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold uppercase text-black mb-1">BUKTI KOMISI AGEN</h2>
                        <div className="text-[11px] space-y-0.5 text-black font-semibold">
                            <p className="uppercase">NO. REFERENSI : {commission.receiptNo}</p>
                            <p className="uppercase">TANGGAL : {new Date(commission.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Konten Utama */}
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {/* Penerima Komisi */}
                        <div>
                            <p className="text-[10px] font-bold uppercase mb-1">PENERIMA KOMISI</p>
                            <div className="border border-black p-2 space-y-0.5 min-h-[80px]">
                                <p className="text-[14px] font-bold uppercase">{agent.name}</p>
                                <p className="text-[12px] font-medium">{agent.code}</p>
                                <div className="border-t border-slate-300 mt-1 pt-1 flex items-center gap-2 text-[11px] font-medium">
                                    <span className="uppercase">LEVEL : {agent.level}</span>
                                    <span className="text-slate-400">|</span>
                                    <span>{agent.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rincian Lainnya */}
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] font-bold uppercase mb-1">REFERENSI JEMAAH</p>
                                <div className="border border-black p-2 font-bold uppercase text-[12px]">
                                    {pilgrim.name}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase mb-1">RINCIAN KOMISI</p>
                                <div className="border border-black px-4 py-1 text-2xl font-bold tracking-tight">
                                    Rp {commission.total.toLocaleString('id-ID')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Baris Status */}
                    <div className="mt-3 border border-black p-1.5 text-center text-[12px] font-bold uppercase bg-slate-50">
                        STATUS : {commission.status}
                    </div>
                </div>

                {/* Footer Signatures */}
                <div className="mt-10 flex justify-between items-start px-12">
                    <div className="text-center">
                        <p className="text-[12px] font-bold mb-20 uppercase">DISERAHKAN OLEH</p>
                        <p className="text-[12px] font-medium leading-none">(............................................................)</p>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-[12px] font-bold mb-20 uppercase whitespace-nowrap">PENERIMA (AGEN/MANAGER/DM)</p>
                        <p className="text-[12px] font-medium leading-none">(............................................................)</p>
                    </div>
                </div>
             </div>
        </div>
    );
};
