// import React from "react";
// import { Lock, Cpu } from "lucide-react";

// const Footer = () => {
//   return (
//     <footer className="h-14 bg-white border-t border-slate-100 flex items-center justify-between px-8 text-xs font-medium text-slate-400">
//       <div className="flex items-center gap-2">
//         <Cpu size={14} className="text-slate-300" />
//         <span>Ecosystem Core Pipeline Version v4.8.2 (Stable Node)</span>
//       </div>
//       <div className="flex items-center gap-6">
//         <p>© 2026 Evoquesys . All rights reserved.</p>
        
//       </div>
//     </footer>
//   );
// };

// export default Footer;





import React from "react";
import {
  Cpu,
  ShieldCheck,
  Activity,
  Server,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative h-[58px] bg-white/95 backdrop-blur-md border-t border-[#E4EEE9] flex items-center justify-between px-8 text-xs font-medium text-[#80938A] overflow-hidden">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-10 left-[18%] w-44 h-20 rounded-full bg-[#0A9668]/[0.035] blur-2xl" />
        <div className="absolute -top-12 right-[10%] w-40 h-20 rounded-full bg-[#087A57]/[0.03] blur-2xl" />
      </div>

      {/* =====================================================
          LEFT SIDE - SYSTEM INFORMATION
      ====================================================== */}
      <div className="relative z-10 flex items-center gap-4">
        {/* System icon */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-[#EDF8F3] border border-[#DDEFE7] flex items-center justify-center text-[#087A57]">
            <Cpu size={15} strokeWidth={2} />
          </div>

          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-bold text-[#425C51]">
                ODCom Core Platform
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F7F0] border border-[#D8EEE4] px-2 py-[2px] text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#087A57]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Stable
              </span>
            </div>

            <p className="mt-0.5 text-[9px] font-medium text-[#9AA9A2]">
              Equipment Operations & Support · v4.8.2
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-7 bg-[#E5ECE8]" />

        {/* Platform status */}
        <div className="hidden lg:flex items-center gap-2 text-[9.5px] font-semibold text-[#788C83]">
          <Activity
            size={13}
            strokeWidth={2}
            className="text-emerald-600"
          />

          <span>Operations Online</span>
        </div>

        {/* Server status */}
        <div className="hidden xl:flex items-center gap-2 text-[9.5px] font-semibold text-[#788C83]">
          <Server
            size={13}
            strokeWidth={2}
            className="text-[#0A8760]"
          />

          <span>Core Services Active</span>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}
      <div className="relative z-10 flex items-center gap-5">
        {/* Secure system */}
        <div className="hidden md:flex items-center gap-2 rounded-lg bg-[#F6FAF8] border border-[#E6EEE9] px-2.5 py-1.5">
          <ShieldCheck
            size={13}
            strokeWidth={2}
            className="text-[#087A57]"
          />

          <span className="text-[9px] font-bold uppercase tracking-[0.07em] text-[#6F847B]">
            Secure System
          </span>
        </div>

        {/* Copyright */}
        {/* <div className="text-right">
          <p className="text-[10px] font-semibold text-[#81928A]">
            © 2026{" "}
            <span className="font-bold text-[#405A50]">
              Evoquesys
            </span>
          </p>

          <p className="mt-[1px] text-[8.5px] text-[#ABB7B2]">
            All rights reserved.
          </p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;