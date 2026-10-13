import React from 'react';
import { TESTIMONIALS } from '../data/mockData';

export const Testimonials: React.FC = () => {
  return (
    <section className="w-full bg-[#fff0ef] py-12 sm:py-16 border-y border-[#dac0c4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] font-bold text-[#904858] uppercase tracking-widest block mb-1">
            Words from Recipients
          </span>
          <h2 className="font-editorial text-[30px] sm:text-[36px] text-[#5e0b29] font-normal mb-2">
            Little moments. Big feelings.
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#544245]">
            Over 10,000+ celebrations made memorable across Sri Lanka and abroad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-7 rounded-2xl bg-[#fff8f7] shadow-xs flex flex-col justify-between border border-[#dac0c4]/30"
            >
              <div>
                <div className="flex items-center gap-1 text-[#904858] mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-editorial text-[15px] sm:text-[16px] text-[#5e0b29] italic leading-relaxed mb-6">
                  {item.quote}
                </p>
              </div>

              <div className="pt-4 border-t border-[#fbeae8] flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold text-[#5e0b29]">{item.author}</p>
                  <p className="text-[12px] text-[#544245]">{item.location}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#f3dde0] text-[#5e0b29] text-[10.5px] font-bold uppercase tracking-wider">
                  {item.giftTag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
