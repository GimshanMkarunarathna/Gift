import React, { useState } from 'react';

interface NewsletterProps {
  onShowToast: (msg: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onShowToast }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      onShowToast('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    onShowToast('Welcome to the Giftora Circle. Look out for our welcome note.');
    setEmail('');
  };

  return (
    <section className="w-full bg-[#fbeae8] py-14 sm:py-20 border-t border-[#dac0c4]/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <span className="text-[11px] font-bold text-[#904858] uppercase tracking-widest block mb-2">
          The Giftora Journal
        </span>
        <h2 className="font-editorial text-[30px] sm:text-[38px] text-[#5e0b29] font-normal mb-3">
          A thoughtful note, now and then.
        </h2>
        <p className="text-[14px] sm:text-[15px] text-[#544245] max-w-lg mx-auto mb-8 leading-relaxed">
          Discover new curated arrivals, thoughtful gifting reminders for anniversaries
          and birthdays, and private festive collections.
        </p>

        {isSubscribed ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fff8f7] text-[#5e0b29] text-[14px] font-semibold shadow-xs border border-[#dac0c4]/40">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>You're subscribed to the Giftora Circle</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="w-full sm:flex-1 h-12 px-4 rounded-full bg-[#fff8f7] text-[#221a19] text-[14px] border border-[#dac0c4]/60 focus:outline-none focus:ring-2 focus:ring-[#5e0b29]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto h-12 px-7 rounded-full bg-[#7c243f] text-white text-[13.5px] font-semibold hover:bg-[#5e0b29] shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              Join the Circle
            </button>
          </form>
        )}

        <p className="text-[12px] text-[#877275] mt-2">
          No spam, ever. Unsubscribe with one click anytime.
        </p>
      </div>
    </section>
  );
};
