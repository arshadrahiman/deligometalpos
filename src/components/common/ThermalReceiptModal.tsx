import React, { useRef } from 'react';
import { Modal } from './Modal';
import { Printer, Share2 } from 'lucide-react';
import { ExchangeTransaction } from '../../types';

interface ThermalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: ExchangeTransaction | null;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `*LAKSHMI GOLD TESTING*\n` +
      `Receipt No: ${transaction.transactionNo}\n` +
      `Customer: ${transaction.customerName} (${transaction.customerNo})\n` +
      `Weight: ${transaction.weight.toFixed(3)} gm | Touch: ${transaction.touch.toFixed(2)}%\n` +
      `Fine Gold: ${transaction.fineGold.toFixed(3)} gm\n` +
      `Gold Diya: ${transaction.settledGold.toFixed(3)} gm\n` +
      `Difference: ${transaction.diffGold.toFixed(3)} gm\n` +
      `Rate: ₹${transaction.rate.toLocaleString('en-IN')}\n` +
      `Cash: ₹${transaction.diffAmount.toLocaleString('en-IN')}\n` +
      `Charge: -₹${transaction.charges.toLocaleString('en-IN')}\n` +
      `Final Cash: ₹${transaction.finalCash.toLocaleString('en-IN')}\n` +
      `Given Cash: ₹${(transaction.settlement?.physicalCash || transaction.finalCash).toLocaleString('en-IN')}\n` +
      `Powered by Deligo Technologies`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const formatReceiptDateTime = (dateStr: string): string => {
    if (!dateStr) return '10-11-2026   07 : 37 : PM';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');
      return `${day}-${month}-${year}   ${formattedHours} : ${minutes} : ${ampm}`;
    } catch {
      return dateStr;
    }
  };

  const formatChargeValue = (charges: number): string => {
    if (charges > 0) {
      return `{-${charges.toLocaleString('en-IN')} Rs}`;
    }
    return `${charges.toLocaleString('en-IN')} Rs`;
  };

  const formatWeight = (wt: number): string => {
    if (wt < 0) {
      return `{-${Math.abs(wt).toFixed(3)} gm}`;
    }
    return `${wt.toFixed(3)} gm`;
  };

  const formatCash = (amount: number): string => {
    if (amount < 0) {
      return `{-${Math.abs(amount).toLocaleString('en-IN')} Rs}`;
    }
    return `${amount.toLocaleString('en-IN')} Rs`;
  };

  const givenCash =
    transaction.settlement && transaction.settlement.physicalCash > 0
      ? transaction.settlement.physicalCash
      : transaction.finalCash;

  const totalSettled = transaction.settlement
    ? (transaction.settlement.physicalCash || 0) +
      (transaction.settlement.onlineRtgs || 0) +
      (transaction.settlement.selfBank2 || 0)
    : 0;

  const totalGivenCash = totalSettled > 0 ? totalSettled : transaction.finalCash;

  const oldGold = transaction.udhariBefore?.gold ?? 0.0;
  const oldCash = transaction.udhariBefore?.cash ?? 23530;
  const oldSilver = transaction.udhariBefore?.silver ?? -413.043;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="3-INCH THERMAL RECEIPT SLIP" maxWidth="sm">
      <div className="space-y-4">
        {/* Printable Thermal Receipt Container */}
        <div
          id="thermal-receipt-slip"
          ref={receiptRef}
          className="bg-white p-4 font-mono text-[11px] leading-tight text-black border border-slate-400 rounded shadow-xs max-w-[320px] mx-auto select-all"
        >
          {/* Top Inscription & Exchange Type */}
          <div className="relative text-center pb-1">
            <div className="text-[11px] font-bold tracking-wider">
              || Shri Ganeshay Namah ||
            </div>
            <div className="text-right text-[10px] font-bold">
              (Exchange {transaction.type === 'BUY' ? 'B' : 'S'})
            </div>
          </div>

          <div className="border-b border-dashed border-black my-1" />

          {/* Shop Header */}
          <div className="text-center py-0.5 space-y-0.5">
            <div className="text-sm font-extrabold tracking-wide">
              Lakshmi Gold Testing
            </div>
            <div className="text-[10px] text-black">
              mp nagar zone - 1, bhopal, madhya pradesh
            </div>
            <div className="text-[10px] text-black tracking-wider">
              1234567890, 9645808999
            </div>
          </div>

          <div className="border-b border-dashed border-black my-1" />

          {/* Customer Name/No & Date Time */}
          <div className="text-center py-0.5 text-[10px] space-y-0.5">
            <div className="font-semibold">
              Customer Name/No - {transaction.customerName}/{transaction.customerNo}
            </div>
            <div className="tracking-wide">
              {formatReceiptDateTime(transaction.dateTime)}
            </div>
          </div>

          <div className="border-b border-dashed border-black my-1" />

          {/* 3-Column Header: Weight | Tounch | Fine */}
          <div className="grid grid-cols-3 text-center text-[10px] font-bold py-0.5">
            <div className="text-left">Weight (gm)</div>
            <div className="text-center">Tounch</div>
            <div className="text-right">Fine (gm)</div>
          </div>

          <div className="border-b border-dashed border-black my-0.5" />

          {/* 3-Column Values */}
          <div className="grid grid-cols-3 text-center text-[10px] py-0.5 font-medium">
            <div className="text-left">{transaction.weight.toFixed(3)} gm</div>
            <div className="text-center">{transaction.touch.toFixed(2)} %</div>
            <div className="text-right">{transaction.fineGold.toFixed(3)} gm</div>
          </div>

          <div className="border-b border-dashed border-black my-1" />

          {/* Settlement Details */}
          <div className="space-y-1 text-[10px] py-0.5">
            <div className="flex justify-between">
              <span>Gold Paid / Diya -</span>
              <span>{transaction.settledGold.toFixed(3)} gm</span>
            </div>
            <div className="flex justify-between">
              <span>Difference -</span>
              <span>{transaction.diffGold.toFixed(3)} gm</span>
            </div>
            <div className="flex justify-between">
              <span>
                {transaction.type === 'BUY'
                  ? 'Pur. Rate / Bhav -  (10gm)'
                  : 'Sale Rate / Bhav -  (10gm)'}
              </span>
              <span>{transaction.rate.toLocaleString('en-IN')} Rs</span>
            </div>
            <div className="flex justify-between">
              <span>Cash -</span>
              <span>{transaction.diffAmount.toLocaleString('en-IN')} Rs</span>
            </div>
            <div className="flex justify-between">
              <span>Charge -</span>
              <span>{formatChargeValue(transaction.charges)}</span>
            </div>
          </div>

          <div className="border-b border-dashed border-black my-1" />

          {/* Final Cash */}
          <div className="flex justify-between font-black text-xs py-0.5">
            <span>Final Cash       -</span>
            <span>{transaction.finalCash.toLocaleString('en-IN')} Rs</span>
          </div>

          <div className="border-b border-dashed border-black my-1" />

          {/* Given Cash */}
          <div className="flex justify-between text-[10px] py-0.5">
            <span>Given Cash       -</span>
            <span>{givenCash.toLocaleString('en-IN')} Rs</span>
          </div>

          <div className="border-b border-dashed border-black my-1" />

          {/* Total Given Cash */}
          <div className="flex justify-between items-start text-[10px] py-0.5">
            <div className="leading-tight">
              <div>Total Given      -</div>
              <div>Cash</div>
            </div>
            <div className="font-bold text-xs">
              {totalGivenCash.toLocaleString('en-IN')} Rs
            </div>
          </div>

          <div className="border-b border-dashed border-black my-1" />

          {/* Advance Jama / Pending Udhari Section */}
          <div className="py-1 text-[10px]">
            <div className="text-center font-bold mb-1">
              Advance Jama / Pending Udhari Section
            </div>

            {/* Gold & Cash Header & Row */}
            <div className="grid grid-cols-3 text-right font-medium text-[9px] text-slate-700">
              <div></div>
              <div>Gold</div>
              <div>Cash</div>
            </div>
            <div className="grid grid-cols-3 text-right text-[10px] py-0.5">
              <div className="text-left font-medium">(Old)</div>
              <div>{formatWeight(oldGold)}</div>
              <div>{formatCash(oldCash)}</div>
            </div>

            <div className="border-b border-dashed border-black my-1" />

            {/* Silver & Cash Header & Row */}
            <div className="grid grid-cols-3 text-right font-medium text-[9px] text-slate-700">
              <div></div>
              <div>Silver</div>
              <div>Cash</div>
            </div>
            <div className="grid grid-cols-3 text-right text-[10px] py-0.5">
              <div className="text-left font-medium">(Old)</div>
              <div>{formatWeight(oldSilver)}</div>
              <div>0 Rs</div>
            </div>
          </div>

          <div className="border-b border-dashed border-black my-1" />

          {/* Footer Inscription */}
          <div className="text-center pt-2 pb-1 text-[10px] space-y-2">
            <div className="font-serif italic text-xs tracking-wider">
              Thank You &nbsp;&nbsp;&nbsp;&nbsp; Visit Again
            </div>
            <div className="text-[9px] text-slate-700 leading-tight">
              <div>Software by :-</div>
              <div className="font-bold text-[10px] tracking-wide text-black">
                Deligo Technologies ®
              </div>
            </div>
          </div>

          <div className="border-b border-dashed border-black mt-1" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 justify-center print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-brand-maroon text-white font-bold text-xs rounded hover:bg-brand-maroon-dark transition-colors shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>Print Thermal Slip</span>
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Share2 className="h-4 w-4" />
            <span>Share WhatsApp</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
