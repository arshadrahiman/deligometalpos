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
      `Date: ${transaction.dateTime}\n` +
      `Customer: ${transaction.customerName}\n` +
      `Type: ${transaction.type}\n` +
      `Weight: ${transaction.weight.toFixed(3)}g | Touch: ${transaction.touch}%\n` +
      `Fine Gold: ${transaction.fineGold.toFixed(3)}g\n` +
      `Final Cash: ₹${transaction.finalCash.toLocaleString('en-IN')}\n` +
      `Remaining Gold: ${transaction.udhariAfter.gold.toFixed(3)}g | Cash: ₹${transaction.udhariAfter.cash.toLocaleString('en-IN')}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="3-INCH THERMAL RECEIPT SLIP" maxWidth="sm">
      <div className="space-y-4">
        {/* Printable Thermal Receipt Container */}
        <div
          ref={receiptRef}
          className="bg-white p-4 font-mono text-[11px] leading-tight text-black border border-slate-300 rounded shadow-xs max-w-[280px] mx-auto select-all"
        >
          <div className="text-center font-bold pb-2 border-b border-dashed border-black">
            <div className="text-sm font-extrabold tracking-wider">LAKSHMI GOLD TESTING</div>
            <div className="text-[10px] font-normal">Sarafa Bazaar, Indore (M.P.)</div>
            <div className="text-[10px] font-normal">Helpline: +91 9645808999</div>
          </div>

          <div className="py-2 border-b border-dashed border-black space-y-1">
            <div className="flex justify-between">
              <span>Slip No: #{transaction.transactionNo}</span>
              <span>{transaction.type}</span>
            </div>
            <div>Date: {transaction.dateTime}</div>
            <div className="font-bold truncate">Cust: {transaction.customerName} (#{transaction.customerNo})</div>
          </div>

          <div className="py-2 border-b border-dashed border-black space-y-1">
            <div className="flex justify-between">
              <span>Gross Wt:</span>
              <span className="font-bold">{transaction.weight.toFixed(3)} gm</span>
            </div>
            <div className="flex justify-between">
              <span>Purity / Touch:</span>
              <span>{transaction.touch.toFixed(2)} %</span>
            </div>
            <div className="flex justify-between">
              <span>Sample Type:</span>
              <span>{transaction.sample}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Fine Gold:</span>
              <span>{transaction.fineGold.toFixed(3)} gm</span>
            </div>
            <div className="flex justify-between">
              <span>Allowance (+G/-G):</span>
              <span>{transaction.extraGold >= 0 ? '+' : ''}{transaction.extraGold.toFixed(3)} gm</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>After Fine:</span>
              <span>{transaction.afterFine.toFixed(3)} gm</span>
            </div>
            <div className="flex justify-between">
              <span>Gold Settled:</span>
              <span>{transaction.settledGold.toFixed(3)} gm</span>
            </div>
            <div className="flex justify-between font-bold border-t border-dotted pt-1">
              <span>Diff Gold:</span>
              <span>{transaction.diffGold >= 0 ? '+' : ''}{transaction.diffGold.toFixed(3)} gm</span>
            </div>
          </div>

          <div className="py-2 border-b border-dashed border-black space-y-1">
            <div className="flex justify-between">
              <span>Rate (₹/10g):</span>
              <span>₹ {transaction.rate.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Diff Amount:</span>
              <span>₹ {transaction.diffAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Charges:</span>
              <span>₹ {transaction.charges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-xs border-t border-dotted pt-1">
              <span>FINAL CASH:</span>
              <span>₹ {transaction.finalCash.toFixed(2)}</span>
            </div>
          </div>

          <div className="py-2 border-b border-dashed border-black space-y-1 text-[10px]">
            <div className="font-bold">UDHARI (RUNNING BALANCE):</div>
            <div className="flex justify-between">
              <span>Previous Gold:</span>
              <span>{transaction.udhariBefore.gold.toFixed(3)} g</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>FINAL GOLD BAL:</span>
              <span>{transaction.udhariAfter.gold.toFixed(3)} g</span>
            </div>
            <div className="flex justify-between">
              <span>Previous Cash:</span>
              <span>₹ {transaction.udhariBefore.cash.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>FINAL CASH BAL:</span>
              <span>₹ {transaction.udhariAfter.cash.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center pt-2 text-[9px]">
            <div>Thank You! Visit Again</div>
            <div>Powered by Deligo Technologies</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 justify-center">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-brand-maroon text-white font-bold text-xs rounded hover:bg-brand-maroon-dark transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print Thermal Slip</span>
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded hover:bg-emerald-700 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share WhatsApp</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

