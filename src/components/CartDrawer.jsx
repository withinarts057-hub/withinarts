import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  PackageCheck,
  Sparkles,
  CheckCircle2,
  Loader2,
  Mail,
  PenLine,
  Printer,
  Clock,
  MapPin,
  Phone,
  User,
  FileText,
  AlertCircle,
  Truck,
  CreditCard,
  Building2,
  ArrowRight,
  Check
} from 'lucide-react';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';
import confetti from 'canvas-confetti';
import { saveOrderToSupabase } from '@/lib/supabase';
import { resolveAssetUrl } from '@/lib/utils';

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  whatsappNumber,
  studioInfo
}) {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [cityType, setCityType] = useState('faisalabad'); // 'faisalabad' | 'outside'
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'advance'
  const [customNameRequiredAlert, setCustomNameRequiredAlert] = useState(false);

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Faisalabad',
    outsideCityName: '',
    address: '',
    customName: '',
    notes: 'Please pack carefully in signature jute wrap with wax seal.'
  });

  if (!isOpen) return null;

  // Check if cart contains any customizable paintings
  const hasCustomizable = cartItems.some(
    (it) => it.isCustomizable || it.id === 'wood-slice-3' || it.id === 'wood-slice-5'
  );

  // Delivery and pricing calculations
  const isFaisalabad = cityType === 'faisalabad';
  const effectiveCity = isFaisalabad ? 'Faisalabad' : (customer.outsideCityName.trim() || 'Outside Faisalabad');

  // Faisalabad: Free delivery for both COD and Advance (Rs. 0)
  // Outside: Free delivery on Advance; COD adds Rs. 250
  const shippingFee = isFaisalabad ? 0 : (paymentMethod === 'advance' ? 0 : 250);
  const deliveryTime = isFaisalabad ? '48 Hours (48 Ghantay)' : '4 to 7 Business Days (4–7 Din)';

  const subtotalPKR = cartItems.reduce((acc, item) => acc + (item.pricePKR * item.qty), 0);
  const grandTotalPKR = subtotalPKR + shippingFee;
  const grandTotalUSD = Math.round(grandTotalPKR / 278);

  // 50% advance requirement for customizable paintings
  const advanceRequiredPKR = hasCustomizable
    ? Math.round(grandTotalPKR * 0.5)
    : (paymentMethod === 'advance' ? grandTotalPKR : 0);
  const balanceDuePKR = grandTotalPKR - advanceRequiredPKR;

  // Trigger checkout view with validation on custom name if customizable item exists
  const handleProceedToCheckout = () => {
    if (hasCustomizable && !customer.customName.trim()) {
      setCustomNameRequiredAlert(true);
      setShowCheckoutForm(true);
      return;
    }
    setCustomNameRequiredAlert(false);
    setShowCheckoutForm(true);
  };

  // WhatsApp order initiator
  const handleWhatsAppOrder = (finalReceipt = null) => {
    if (cartItems.length === 0 && !finalReceipt) return;

    const items = finalReceipt ? finalReceipt.items : cartItems;
    const cust = finalReceipt ? finalReceipt.customer : customer;
    const sFee = finalReceipt ? finalReceipt.shippingFee : shippingFee;
    const gTotal = finalReceipt ? finalReceipt.grandTotalPKR : grandTotalPKR;
    const isFsd = finalReceipt ? finalReceipt.isFaisalabad : isFaisalabad;
    const dTime = finalReceipt ? finalReceipt.deliveryTime : deliveryTime;
    const hasCust = finalReceipt ? finalReceipt.hasCustomizable : hasCustomizable;
    const adv = finalReceipt ? finalReceipt.advanceRequiredPKR : advanceRequiredPKR;
    const bal = finalReceipt ? finalReceipt.balanceDuePKR : balanceDuePKR;
    const customTxt = (finalReceipt ? finalReceipt.customName : customer.customName).trim();
    const cityDisplay = finalReceipt ? finalReceipt.customer.city : effectiveCity;
    const pMethod = finalReceipt ? finalReceipt.paymentMethod : paymentMethod;

    const itemsText = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.title}* (${it.dimensions})\n   Medium: Acrylic on Wood Slice\n   Qty: ${it.qty} × Rs. ${it.pricePKR.toLocaleString()} = Rs. ${(it.pricePKR * it.qty).toLocaleString()}${
            it.isCustomizable || it.id === 'wood-slice-3' || it.id === 'wood-slice-5'
              ? `\n   ✍️ *Customized Name/Text:* ${customTxt || 'To be specified'}`
              : ''
          }`
      )
      .join('\n\n');

    let msg = `🎨 *WITHINARTS ATELIER - OFFICIAL ARTWORK ORDER*\n` +
      `--------------------------------\n` +
      (finalReceipt ? `*Receipt No:* ${finalReceipt.receiptNumber}\n` : '') +
      `*Customer:* ${cust.name || 'Art Collector'}\n` +
      `*Phone:* ${cust.phone || 'N/A'}\n` +
      `*City:* ${cityDisplay} (${isFsd ? 'Faisalabad' : 'Outside Faisalabad'})\n` +
      `*Address:* ${cust.address || 'Address provided on WhatsApp'}\n` +
      `*Payment Method:* ${pMethod === 'advance' ? 'Full Advance Payment' : 'Cash on Delivery (COD)'}\n\n` +
      `*Selected Acrylic Paintings:*\n${itemsText}\n\n` +
      `--------------------------------\n` +
      `*Subtotal:* Rs. ${subtotalPKR.toLocaleString()} PKR\n` +
      `*Delivery Area:* ${isFsd ? 'Faisalabad (Local Delivery)' : `Outside Faisalabad (${cityDisplay})`}\n` +
      `*Delivery Charges:* ${sFee === 0 ? 'FREE (Rs. 0)' : `Rs. ${sFee} PKR`}\n` +
      `*Delivery Timeframe:* ${dTime}\n` +
      `*Total Amount:* Rs. ${gTotal.toLocaleString()} PKR (~$${grandTotalUSD} USD)\n`;

    if (hasCust) {
      msg += `\n⚠️ *Customizable Painting Deposit (50% Advance):*\n` +
        `• 50% Advance Required: Rs. ${adv.toLocaleString()} PKR\n` +
        `• Remaining Balance on Delivery: Rs. ${bal.toLocaleString()} PKR\n` +
        `• Payment details (JazzCash/EasyPaisa/Bank) to be sent to ${cust.phone || 'my number'}.\n`;
    }

    msg += `\n*Packaging:* Signature Eco-Friendly Jute Burlap with Wax Seal & Stand`;

    // Auto-record order to Supabase
    saveOrderToSupabase({
      name: cust.name || 'WhatsApp Visitor',
      phone: cust.phone || '',
      city: cityDisplay,
      address: cust.address || '',
      customName: customTxt,
      items: items.map(it => ({
        id: it.id,
        title: it.title,
        dimensions: it.dimensions,
        woodFrame: it.woodFrame,
        pricePKR: it.pricePKR,
        qty: it.qty,
        wallImage: it.wallImage,
        isCustomizable: it.isCustomizable
      })),
      totalPKR: gTotal,
      totalUSD: grandTotalUSD,
      orderType: 'whatsapp',
      status: 'Pending',
      notes: `WhatsApp order click. Delivery: ${dTime}. Shipping: Rs. ${sFee}. Advance req: Rs. ${adv}.`
    }).catch(err => console.warn('Supabase WhatsApp order auto-save:', err));

    window.open(`https://wa.me/${whatsappNumber || '923264784663'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Direct checkout form submission
  const handleDirectSubmit = async (e) => {
    e.preventDefault();

    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      alert("Please provide your name, phone, and complete delivery address.");
      return;
    }

    if (!isFaisalabad && !customer.outsideCityName.trim()) {
      alert("Please enter your delivery city name.");
      return;
    }

    if (hasCustomizable && !customer.customName.trim()) {
      setCustomNameRequiredAlert(true);
      alert("Please enter the Custom Name / Text to write on your customized painting.");
      return;
    }

    setIsSubmitting(true);

    const generatedReceiptNo = `WA-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalCity = effectiveCity;

    const receipt = {
      receiptNumber: generatedReceiptNo,
      date: new Date().toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        city: finalCity,
        address: customer.address.trim()
      },
      customName: customer.customName.trim(),
      items: [...cartItems],
      subtotalPKR,
      shippingFee,
      grandTotalPKR,
      grandTotalUSD,
      isFaisalabad,
      deliveryTime,
      paymentMethod,
      hasCustomizable,
      advanceRequiredPKR,
      balanceDuePKR
    };

    const itemsSummary = cartItems
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.title} (${it.dimensions}) | Qty: ${it.qty} × Rs. ${it.pricePKR.toLocaleString()} = Rs. ${(it.pricePKR * it.qty).toLocaleString()}${
            it.isCustomizable || it.id === 'wood-slice-3' || it.id === 'wood-slice-5'
              ? ` [Custom Text: ${customer.customName.trim() || 'None'}]`
              : ''
          }`
      )
      .join('\n');

    const recipientEmail = studioInfo?.email || 'withinarts057@gmail.com';

    try {
      // 1. Save directly into Supabase orders database
      await saveOrderToSupabase({
        orderNumber: generatedReceiptNo,
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim(),
        city: finalCity,
        address: customer.address.trim(),
        customName: customer.customName.trim(),
        items: cartItems.map(it => ({
          id: it.id,
          title: it.title,
          dimensions: it.dimensions,
          woodFrame: it.woodFrame,
          pricePKR: it.pricePKR,
          qty: it.qty,
          wallImage: it.wallImage,
          isCustomizable: it.isCustomizable
        })),
        totalPKR: grandTotalPKR,
        totalUSD: grandTotalUSD,
        orderType: 'website',
        status: 'Pending',
        notes: `Receipt #${generatedReceiptNo}. Delivery: ${deliveryTime}. City: ${finalCity}. Shipping: Rs. ${shippingFee}. Payment: ${paymentMethod}. Advance 50%: Rs. ${advanceRequiredPKR}. Balance: Rs. ${balanceDuePKR}.`
      });

      // 2. Send order email to studio inbox via FormSubmit AJAX API
      await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🎨 Order Receipt ${generatedReceiptNo} - ${customer.name} (Rs. ${grandTotalPKR.toLocaleString()} PKR)`,
          _template: 'table',
          _captcha: 'false',
          'Receipt Number': generatedReceiptNo,
          'Customer Name': customer.name,
          'Phone / WhatsApp': customer.phone,
          'Customer Email': customer.email || 'Not Provided',
          'Delivery City': finalCity,
          'Delivery Address': customer.address,
          'Delivery Area': isFaisalabad ? 'Faisalabad Local (48 Hours Delivery)' : `Outside Faisalabad (${finalCity} - 4 to 7 Days)`,
          'Shipping Fee': shippingFee === 0 ? 'FREE (Rs. 0)' : `Rs. ${shippingFee} PKR`,
          'Payment Method': paymentMethod === 'advance' ? 'Full Advance' : 'Cash on Delivery',
          '✍️ Custom Name/Text for Painting': customer.customName.trim() || 'N/A (Standard Piece)',
          '50% Advance Required': hasCustomizable ? `Rs. ${advanceRequiredPKR.toLocaleString()} PKR (Send details to ${customer.phone})` : 'N/A',
          'Remaining Balance on Delivery': `Rs. ${balanceDuePKR.toLocaleString()} PKR`,
          'Ordered Paintings': itemsSummary,
          'Subtotal': `Rs. ${subtotalPKR.toLocaleString()} PKR`,
          'Grand Total': `Rs. ${grandTotalPKR.toLocaleString()} PKR`,
          'Packaging Requirement': 'Signature Eco Jute Burlap with Wax Seal & Stand',
          'Order Submission Time': new Date().toLocaleString()
        })
      });
    } catch (err) {
      console.warn('Order dispatch notice:', err);
    } finally {
      setIsSubmitting(false);

      // Trigger celebration confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Show the Receipt Screen
      setReceiptData(receipt);
    }
  };

  const handleFinishAndClose = () => {
    onClearCart();
    setReceiptData(null);
    setShowCheckoutForm(false);
    onClose();
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
              {receiptData ? <FileText className="w-5 h-5 text-emerald-600" /> : <ShoppingBag className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-base sm:text-lg text-slate-900">
                {receiptData ? 'Order Receipt Slip' : 'Your Art Bag'}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {receiptData
                  ? `Receipt #${receiptData.receiptNumber}`
                  : `${cartItems.length} ${cartItems.length === 1 ? 'acrylic painting' : 'acrylic paintings'} selected`}
              </span>
            </div>
          </div>

          <button
            onClick={receiptData ? handleFinishAndClose : onClose}
            className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* ============================================================ */}
          {/* 1. RECEIPT VIEW (Shown immediately after order form submission) */}
          {/* ============================================================ */}
          {receiptData ? (
            <div className="space-y-4 print:p-0">
              {/* Receipt Header Badge */}
              <div className="text-center p-4 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-200/80 shadow-sm relative overflow-hidden">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-2">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px] tracking-wide mb-1">
                  ORDER CONFIRMED & SLIP GENERATED
                </span>
                <h4 className="font-cinzel font-bold text-xl text-slate-900">
                  Withinarts Studio Receipt
                </h4>
                <p className="text-xs text-slate-600">
                  Receipt No: <strong>{receiptData.receiptNumber}</strong> • {receiptData.date}
                </p>
              </div>

              {/* Customer & Delivery Summary Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-600" />
                    Customer & Destination
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-sky-100 text-sky-800">
                    {receiptData.isFaisalabad ? 'Faisalabad (Local)' : 'Outside Faisalabad'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Collector Name</span>
                    <strong className="text-slate-800">{receiptData.customer.name}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Contact Phone</span>
                    <strong className="text-slate-800">{receiptData.customer.phone}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[11px] text-slate-400 block">Delivery Address</span>
                    <span className="text-slate-700 font-medium">
                      {receiptData.customer.address}, {receiptData.customer.city}
                    </span>
                  </div>
                </div>

                {/* Delivery Time Box */}
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="text-[10px] text-sky-700 font-bold uppercase block">Delivery Timeframe</span>
                      <strong className="text-sky-950 font-bold">{receiptData.deliveryTime}</strong>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-sky-200 text-sky-800 font-bold text-[11px]">
                    {receiptData.shippingFee === 0 ? 'FREE DELIVERY' : `Rs. ${receiptData.shippingFee}`}
                  </span>
                </div>
              </div>

              {/* Ordered Items Table */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-sky-600" />
                  Ordered Acrylic Artworks
                </span>

                <div className="divide-y divide-slate-100">
                  {receiptData.items.map((it) => (
                    <div key={it.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <strong className="text-slate-900 block truncate">{it.title}</strong>
                        <span className="text-[11px] text-slate-500 block">
                          {it.dimensions} • Natural Wood Slice & Clear Stand
                        </span>
                        {(it.isCustomizable || it.id === 'wood-slice-3' || it.id === 'wood-slice-5') && (
                          <div className="mt-1 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-[11px] text-purple-900 font-semibold inline-flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-purple-600" />
                            <span>
                              Custom Hand-Painted Text: <strong>"{receiptData.customName || 'Specified on WhatsApp'}"</strong>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-slate-500 block">Qty: {it.qty}</span>
                        <strong className="text-slate-900 text-xs font-heading">
                          Rs. {(it.pricePKR * it.qty).toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800">Rs. {receiptData.subtotalPKR.toLocaleString()} PKR</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges ({receiptData.isFaisalabad ? 'Faisalabad' : receiptData.customer.city}):</span>
                  <span className="font-semibold text-slate-800">
                    {receiptData.shippingFee === 0 ? 'Rs. 0 (FREE)' : `Rs. ${receiptData.shippingFee} PKR`}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                  <span className="font-cinzel font-bold text-sm text-slate-900">Grand Total:</span>
                  <span className="text-lg font-bold font-heading text-slate-900">
                    Rs. {receiptData.grandTotalPKR.toLocaleString()} PKR
                  </span>
                </div>

                {/* 50% Advance Requirement Notice for Customizable Paintings */}
                {receiptData.hasCustomizable && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 text-amber-950 space-y-2">
                    <div className="flex items-center justify-between font-bold text-xs border-b border-amber-200/80 pb-1.5">
                      <span className="flex items-center gap-1.5 text-amber-900">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        50% Advance Deposit Required:
                      </span>
                      <span className="text-sm font-bold text-amber-950">
                        Rs. {receiptData.advanceRequiredPKR.toLocaleString()} PKR
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-amber-900">
                      <span>Remaining Balance (Due on Delivery):</span>
                      <span className="font-bold">Rs. {receiptData.balanceDuePKR.toLocaleString()} PKR</span>
                    </div>

                    <div className="pt-1 text-[11px] leading-relaxed bg-white/80 p-2.5 rounded-xl border border-amber-200">
                      <p className="font-semibold text-amber-950 flex items-start gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>
                          Customized painting order ke liye <strong>50% advance deposit</strong> lazmi hai. Payment details (JazzCash / EasyPaisa / Bank Account) aapke number <strong>{receiptData.customer.phone}</strong> par message / WhatsApp ke zariye send ki ja rahi hain.
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for Receipt */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleWhatsAppOrder(receiptData)}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Send / Copy Receipt to Studio WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishAndClose}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 text-sky-400" />
                    <span>Done / Back to Gallery</span>
                  </button>
                </div>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            /* ============================================================ */
            /* 2. EMPTY BAG VIEW                                            */
            /* ============================================================ */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-cinzel font-bold text-lg text-slate-900">Your bag is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Browse our collection of hand-painted acrylic paintings from Faisalabad and add your favorite piece.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 cursor-pointer"
              >
                Explore Paintings
              </button>
            </div>
          ) : showCheckoutForm ? (
            /* ============================================================ */
            /* 3. CHECKOUT FORM VIEW                                        */
            /* ============================================================ */
            <form onSubmit={handleDirectSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-sm font-bold text-sky-900">Delivery Information & City</h4>
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold underline cursor-pointer"
                >
                  Back to Bag
                </button>
              </div>

              {/* CUSTOM NAME REQUIRED PROMPT IF CUSTOMIZABLE PAINTING SELECTED */}
              {hasCustomizable && (
                <div
                  className={`p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-2 transition-all ${
                    customNameRequiredAlert && !customer.customName.trim()
                      ? 'border-rose-500 ring-2 ring-rose-300'
                      : 'border-purple-300 shadow-sm'
                  }`}
                >
                  <label className="flex items-center gap-1.5 text-xs text-purple-950 font-bold mb-1">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Name / Text to Write on Painting *</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                      Mandatory for Custom Order
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.customName}
                    onChange={(e) => {
                      setCustomer({ ...customer, customName: e.target.value });
                      if (e.target.value.trim()) setCustomNameRequiredAlert(false);
                    }}
                    placeholder="e.g. Malik Family, Hamara Ghar, Ahmad & Ayesha • 2024"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-purple-300 text-slate-900 text-xs outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 font-semibold"
                    maxLength={120}
                  />
                  <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-purple-900 font-medium">
                    <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span>
                      50% advance deposit required for custom piece. Payment details will be sent to your phone number.
                    </span>
                  </div>
                </div>
              )}

              {/* Customer Personal Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-700 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="e.g. Tariq Jamil"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-700 font-medium mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="0300-1234567"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-700 font-medium mb-1">
                      Email <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="customer@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* CITY SELECTION (Faisalabad vs Outside) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Select Delivery Destination City *
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCityType('faisalabad');
                        setCustomer({ ...customer, city: 'Faisalabad' });
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-start gap-1 transition-all cursor-pointer ${
                        isFaisalabad
                          ? 'bg-sky-500 text-white border-sky-600 shadow-md shadow-sky-500/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Faisalabad</span>
                      </div>
                      <span className={`text-[10px] font-normal ${isFaisalabad ? 'text-sky-100' : 'text-emerald-600 font-semibold'}`}>
                        Free Delivery (COD & Adv) • 48 Hours
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCityType('outside');
                        setCustomer({ ...customer, city: customer.outsideCityName || 'Outside Faisalabad' });
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-start gap-1 transition-all cursor-pointer ${
                        !isFaisalabad
                          ? 'bg-sky-500 text-white border-sky-600 shadow-md shadow-sky-500/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Outside Faisalabad</span>
                      </div>
                      <span className={`text-[10px] font-normal ${!isFaisalabad ? 'text-sky-100' : 'text-slate-500'}`}>
                        Rest of Pakistan • 4–7 Days
                      </span>
                    </button>
                  </div>

                  {!isFaisalabad && (
                    <div className="pt-1">
                      <label className="block text-[11px] text-slate-600 font-medium mb-1">
                        Enter Your City Name (Lahore, Karachi, Islamabad, etc.) *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.outsideCityName}
                        onChange={(e) => {
                          setCustomer({
                            ...customer,
                            outsideCityName: e.target.value,
                            city: e.target.value
                          });
                        }}
                        placeholder="e.g. Lahore, Islamabad, Karachi, Rawalpindi, Peshawar..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs outline-none focus:border-sky-500"
                      />
                    </div>
                  )}
                </div>

                {/* Complete Address */}
                <div>
                  <label className="block text-xs text-slate-700 font-medium mb-1">Complete Delivery Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="House / Street #, Sector / Colony, City"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                  />
                </div>

                {/* PAYMENT METHOD SELECTOR */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Payment Option
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-start gap-0.5 transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span>Cash on Delivery (COD)</span>
                      <span className={`text-[10px] font-normal ${paymentMethod === 'cod' ? 'text-slate-300' : 'text-slate-500'}`}>
                        {isFaisalabad ? 'Free Delivery' : '+Rs. 250 Delivery Fee'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('advance')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-start gap-0.5 transition-all cursor-pointer ${
                        paymentMethod === 'advance'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span>Advance Payment</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-white text-[9px] font-bold">FREE</span>
                      </div>
                      <span className={`text-[10px] font-normal ${paymentMethod === 'advance' ? 'text-emerald-300' : 'text-emerald-600'}`}>
                        Free Delivery Everywhere
                      </span>
                    </button>
                  </div>

                  {/* Summary of shipping fee & timeline */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Delivery Timeframe:</span>
                      <strong className="text-slate-900">{deliveryTime}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <strong className={shippingFee === 0 ? 'text-emerald-600' : 'text-slate-900'}>
                        {shippingFee === 0 ? 'FREE (Rs. 0)' : `Rs. ${shippingFee} PKR`}
                      </strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1 font-bold text-xs text-slate-900">
                      <span>Total Amount:</span>
                      <span>Rs. {grandTotalPKR.toLocaleString()} PKR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Generating Official Receipt Slip...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-white" />
                    <span>Generate Receipt Slip (Rs. {grandTotalPKR.toLocaleString()} PKR)</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ============================================================ */
            /* 4. ITEMS LIST VIEW (With Pre-checkout Custom Name Prompt)    */
            /* ============================================================ */
            <div className="space-y-3">
              {/* Customizable painting alert & pre-checkout name prompt */}
              {hasCustomizable && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-2 border-purple-200/90 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-purple-950 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Customizable Painting in Cart!</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px]">
                      50% Advance
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-900 leading-relaxed">
                    Aapne customize painting select ki hai. Barah-e-karam checkout se pehle apna <strong>Name, Family Name ya Date</strong> darj farmayein:
                  </p>
                  <input
                    type="text"
                    value={customer.customName}
                    onChange={(e) => setCustomer({ ...customer, customName: e.target.value })}
                    placeholder="e.g. The Malik Family, Hamara Ghar, Ahmad & Ayesha • 2024"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-purple-300 text-slate-900 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-300 placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <div className="text-[10px] text-purple-700 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Custom order banwane ke liye 50% advance deposit lazmi hoga.</span>
                  </div>
                </div>
              )}

              {/* Items Card Loop */}
              {cartItems.map((item) => {
                const itemIsCustomizable = Boolean(
                  item.isCustomizable || item.id === 'wood-slice-3' || item.id === 'wood-slice-5'
                );

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3"
                  >
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img src={resolveAssetUrl(item.wallImage)} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-cinzel font-bold text-xs text-slate-900 truncate">
                          {item.title}
                        </h5>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {item.dimensions} • Acrylic on Wood Slice
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-sky-700 font-heading">
                          Rs. {(item.pricePKR * item.qty).toLocaleString()} PKR
                        </span>
                        {itemIsCustomizable ? (
                          <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[9px] font-bold">
                            Customizable
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[9px] font-medium">
                            Original Piece
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                        <button
                          onClick={() => onUpdateQty(item.id, item.qty - 1)}
                          className="text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-semibold text-slate-800 px-1">{item.qty}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.qty + 1)}
                          className="text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer (Only on items list screen) */}
        {cartItems.length > 0 && !showCheckoutForm && !receiptData && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Delivery Terms Summary */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center justify-between font-semibold text-emerald-800">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Faisalabad: Free Delivery (COD & Adv) • 48 Hours</span>
                </span>
              </div>
              <div className="text-[10px] text-slate-500 pl-4.5">
                Outside Faisalabad: Free on Advance (COD Rs. 250) • 4–7 Days
              </div>
            </div>

            {/* Total Row */}
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-xs text-slate-600 font-bold block">Artworks Subtotal</span>
                <span className="text-[11px] text-slate-400">Acrylic Fine Art on Wood Slice</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-heading text-slate-900 block">
                  Rs. {subtotalPKR.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">
                  (~${grandTotalUSD} USD)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleProceedToCheckout}
                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-end">
                <LiquidMetalButton
                  label="WhatsApp Order"
                  icon={<MessageCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  onClick={() => handleWhatsAppOrder()}
                  width={155}
                  height={42}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
