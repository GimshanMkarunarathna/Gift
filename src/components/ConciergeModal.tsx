import React, { useState } from 'react';

interface ConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ConciergeModal: React.FC<ConciergeModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'concierge' | 'faq'>('concierge');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [corpName, setCorpName] = useState('');
  const [corpEmail, setCorpEmail] = useState('');
  const [corpCount, setCorpCount] = useState('25-50 gifts');
  const [corpSubmitted, setCorpSubmitted] = useState(false);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How fast is delivery across Sri Lanka?',
      a: 'We offer same-day express delivery within Colombo 01-15 for orders placed before 2:00 PM. For other districts across Sri Lanka (Kandy, Galle, Negombo, Jaffna, etc.), delivery is handled via insured express courier within 2 to 3 business days.',
    },
    {
      q: 'Is the calligraphy card really handwritten?',
      a: 'Yes, absolutely. Every complimentary note card is individually penned by our in-house Colombo calligraphers on 300gsm cotton deckle-edge paper, then hand-stamped with molten wax in your choice of shade.',
    },
    {
      q: 'Can I send gifts anonymously or from abroad?',
      a: 'Yes! Many of our clients live in Dubai, the UK, Australia, and Canada and send gifts to loved ones in Sri Lanka. We accept all international cards and never include pricing invoices inside the gift package.',
    },
    {
      q: 'Do you offer installment payment options?',
      a: 'Yes, we accept Koko and Mintpay for interest-free 3-month split payments, as well as Visa, Mastercard, and American Express.',
    },
  ];

  const handleCorpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCorpSubmitted(true);
    onShowToast('Corporate inquiry received. Our concierge will contact you within 2 hours.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#382e2d]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#fff8f7] max-w-xl w-full rounded-2xl p-6 sm:p-7 shadow-2xl relative border border-[#dac0c4]/50 my-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#fbeae8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5e0b29] text-[24px]">
              support_agent
            </span>
            <h3 className="font-editorial text-[22px] text-[#5e0b29] font-semibold">
              Bespoke Gifting Concierge
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#fbeae8] text-[#544245] flex items-center justify-center hover:bg-[#f0dfdd] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-[#fff0ef] p-1 mb-5">
          <button
            onClick={() => setActiveTab('concierge')}
            className={`flex-1 py-2 text-[13px] font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'concierge'
                ? 'bg-white text-[#5e0b29] shadow-xs'
                : 'text-[#544245] hover:text-[#5e0b29]'
            }`}
          >
            Direct Assistance
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 text-[13px] font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-white text-[#5e0b29] shadow-xs'
                : 'text-[#544245] hover:text-[#5e0b29]'
            }`}
          >
            Frequently Asked Questions
          </button>
        </div>

        {activeTab === 'concierge' ? (
          <div className="space-y-5">
            {/* WhatsApp direct card */}
            <div className="p-4 rounded-xl bg-[#fff0ef] border border-[#dac0c4]/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#904858] uppercase tracking-wider block">
                  Instant Support 7 Days a Week
                </span>
                <h4 className="text-[15px] font-bold text-[#5e0b29]">
                  Chat with a Gifting Stylist on WhatsApp
                </h4>
                <p className="text-[12px] text-[#544245]">
                  Custom budgets, bulk favors, or same-day delivery rush.
                </p>
              </div>
              <button
                onClick={() => onShowToast('Connecting with Gifting Stylist on WhatsApp (+94 77 123 4567)...')}
                className="px-4 py-2 rounded-full bg-[#5e0b29] text-white text-[12px] font-bold hover:bg-[#7c243f] cursor-pointer shrink-0 ml-3"
              >
                Open Chat
              </button>
            </div>

            {/* Corporate gifting form */}
            <div className="p-4 rounded-xl bg-white border border-[#dac0c4]/40">
              <h4 className="font-editorial text-[17px] text-[#5e0b29] font-semibold mb-1">
                Corporate &amp; Event Gifting Inquiries
              </h4>
              <p className="text-[12.5px] text-[#544245] mb-4">
                Bespoke branding, client holiday hampers, and bulk wax-sealed curations.
              </p>

              {corpSubmitted ? (
                <div className="text-center py-6 text-[#5e0b29] font-medium text-[13.5px]">
                  ✓ Thank you! A dedicated corporate consultant will send a bespoke catalog to your email shortly.
                </div>
              ) : (
                <form onSubmit={handleCorpSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Company / Contact Name"
                      required
                      value={corpName}
                      onChange={(e) => setCorpName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#fff8f7] border border-[#dac0c4]/60 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Business Email"
                      required
                      value={corpEmail}
                      onChange={(e) => setCorpEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#fff8f7] border border-[#dac0c4]/60 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={corpCount}
                      onChange={(e) => setCorpCount(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#fff8f7] border border-[#dac0c4]/60 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#5e0b29]"
                    >
                      <option>10 - 25 Gifts</option>
                      <option>25 - 50 Gifts</option>
                      <option>50 - 150 Gifts</option>
                      <option>150+ Custom Corporate Boxes</option>
                    </select>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#7c243f] text-white text-[13px] font-bold hover:bg-[#5e0b29] cursor-pointer"
                    >
                      Request Catalog
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#dac0c4]/40 rounded-xl overflow-hidden bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left text-[14px] font-bold text-[#5e0b29] hover:bg-[#fff0ef] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-[18px]">
                    {openFaq === idx ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-3 pt-1 text-[13px] text-[#544245] leading-relaxed border-t border-[#fbeae8]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
