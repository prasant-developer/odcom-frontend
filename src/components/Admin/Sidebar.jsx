// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutGrid,
//   PlusSquare,
//   Box,
//   BarChart3,
//   Bell,
//   LogOut,
// } from "lucide-react";

// // ==========================================
// // NAVIGATION CONFIGURATION DATA ARRAY (EXACT MATCH)
// // ==========================================
// const NAV_ITEMS = [

//   {
//     label: "Dashboard",
//     icon: PlusSquare,
//     path: "/admin-dashboard",
//     group: "WORKSPACE",
//   },
//   {
//     label: "Rental Master",
//     icon: LayoutGrid,
//     path: "/rental-master",
//     group: "WORKSPACE",
//   },
  
//   {
//     label: "Master Info",
//     icon: Box,
//     path: "/inventory",
//     group: "WORKSPACE",
//   },
//   // {
//   //   label: "Reports & Ledger",
//   //   icon: BarChart3,
//   //   path: "/requisitions/new",
//   //   group: "WORKSPACE",
//   // },
//   {
//     label: "Notification Center",
//     icon: Bell,
//     path: "/notifications",
//     group: "ALERTS",
//     badgeCount: 5,
//   },
// ];

// // ==========================================
// // CORE SIDEBAR COMPONENT
// // ==========================================
// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Mocked state value to align with UI design requirements
//   const currentUser = {
//     name: "Rajesh K.",
//     role: "Admin",
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login", { replace: true });
//   };

//   const renderGroupSection = (groupName) => {
//     return (
//       <div key={groupName} className="space-y-1">
//         <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase px-3 mb-2.5">
//           {groupName}
//         </p>

//         {NAV_ITEMS.filter((item) => item.group === groupName).map(
//           (item, index) => {
//             const IconComponent = item.icon;
//             const isActive = location.pathname === item.path;

//             return (
//               <button
//                 key={index}
//                 onClick={() => navigate(item.path)}
//                 className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
//                   isActive
//                     ? "bg-[#007a78] text-white shadow-inner"
//                     : "text-slate-300 hover:bg-white/5 hover:text-white"
//                 }`}
//               >
//                 <div className="flex items-center gap-3.5">
//                   <IconComponent
//                     size={18}
//                     className={isActive ? "text-[#5bf2ca]" : "text-slate-300"}
//                   />
//                   <span>{item.label}</span>
//                 </div>

//                 {item.badgeCount && (
//                   <span className="bg-rose-500 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
//                     {item.badgeCount}
//                   </span>
//                 )}
//               </button>
//             );
//           },
//         )}
//       </div>
//     );
//   };

//   return (
//     <aside className="w-[300px] h-screen bg-[#0b4864] flex flex-col justify-between fixed left-0 top-0 z-30 select-none border-r border-slate-800/10 font-sans">
//       <div>
//         {/* Exact Header Branding Layout */}
//         <div className="bg-[#007a78] px-6 py-5 flex items-center gap-2.5">
//           <svg
//             className="w-7 h-7 text-[#5bf2ca]"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             strokeWidth="2.5"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M4.5 12h1.5m0 0l2-4 3 8 4-11 2.5 7h1.5"
//             />
//           </svg>
//           <span className="text-white font-black text-xl tracking-wider">
//             CHIKITSA
//           </span>
//           <span className="bg-[#1fc29c] text-[#074737] text-[10px] font-bold px-1.5 py-0.5 rounded-md transform -translate-y-0.5">
//             OS
//           </span>
//         </div>

//         {/* Dynamic Categorized Container Blocks */}
//         <div className="px-4 py-6 space-y-7">
//           {renderGroupSection("WORKSPACE")}
//           {renderGroupSection("ALERTS")}
//         </div>
//       </div>

//       {/* Profile Bar Anchor Row Container */}
//       {/* <div className="border-t border-white/5 bg-[#08384f]/60 p-5 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-[#1fc29c] text-[#074737] font-extrabold text-sm flex items-center justify-center shadow-inner">
//             RK
//           </div>
//           <div>
//             <h4 className="text-white text-sm font-bold leading-tight">
//               {currentUser.name}
//             </h4>
//             <p className="text-slate-400 text-xs mt-0.5 font-medium">
//               {currentUser.role}
//             </p>
//           </div>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
//           title="Sign Out Access"
//         >
//           <LogOut size={18} />
//         </button>
//       </div> */}
//     </aside>
//   );
// };

// export default Sidebar;





import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  PlusSquare,
  Box,
  Bell,
  LogOut,
  Activity,
  Wrench,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

// ==========================================
// NAVIGATION CONFIGURATION
// ==========================================
const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: PlusSquare,
    path: "/admin-dashboard",
    group: "WORKSPACE",
  },
  {
    label: "Rental Master",
    icon: LayoutGrid,
    path: "/rental-master",
    group: "WORKSPACE",
  },
  {
    label: "Master Info",
    icon: Box,
    path: "/inventory",
    group: "WORKSPACE",
  },
  // {
  //   label: "Notification Center",
  //   icon: Bell,
  //   path: "/notifications",
  //   group: "ALERTS",
  //   badgeCount: 5,
  // },
];

// ==========================================
// CORE SIDEBAR COMPONENT
// ==========================================
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = {
    name: "Rajesh K.",
    role: "Admin",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const renderGroupSection = (groupName) => {
    return (
      <div key={groupName} className="space-y-2">
        <div className="flex items-center gap-2 px-3 mb-2.5">
          <span className="h-[1px] w-3 bg-emerald-400/40" />

          <p className="text-[9px] font-extrabold text-emerald-100/40 tracking-[0.2em] uppercase">
            {groupName}
          </p>
        </div>

        {NAV_ITEMS.filter((item) => item.group === groupName).map(
          (item, index) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`
                  group
                  relative
                  w-full
                  flex
                  items-center
                  justify-between
                  px-3.5
                  py-3
                  rounded-[14px]
                  text-left
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-white/[0.11] text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-white/[0.08]"
                      : "text-emerald-50/60 hover:bg-white/[0.06] hover:text-white"
                  }
                `}
              >
                {/* Active left indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[#66E2AC]" />
                )}

                <div className="flex items-center gap-3.5">
                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-[11px]
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? "bg-[#76E4B3]/15 text-[#8BF0C3]"
                          : "bg-white/[0.045] text-emerald-50/55 group-hover:bg-white/[0.08] group-hover:text-emerald-100"
                      }
                    `}
                  >
                    <IconComponent size={18} strokeWidth={2} />
                  </div>

                  <span className="text-[13px] font-semibold">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badgeCount && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[9px] font-extrabold text-white shadow-[0_3px_8px_rgba(244,63,94,0.25)]">
                      {item.badgeCount}
                    </span>
                  )}

                  <ChevronRight
                    size={14}
                    className={`
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "translate-x-0 text-emerald-100/60 opacity-100"
                          : "-translate-x-1 text-emerald-100/30 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }
                    `}
                  />
                </div>
              </button>
            );
          },
        )}
      </div>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[292px] select-none flex-col justify-between overflow-hidden border-r border-[#0A664A] bg-gradient-to-b from-[#075F46] via-[#086B4E] to-[#064D3A] font-sans shadow-[12px_0_35px_rgba(20,84,61,0.08)]">
      {/* =====================================================
          BACKGROUND EFFECTS
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-[230px] w-[230px] rounded-full border border-white/[0.05]" />

        <div className="absolute right-0 top-10 h-[160px] w-[160px] rounded-full border border-white/[0.04]" />

        <div className="absolute -bottom-24 -left-20 h-[280px] w-[280px] rounded-full bg-[#2BC48A]/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />
      </div>

      {/* =====================================================
          TOP CONTENT
      ====================================================== */}

      <div className="relative z-10">
        {/* ===============================================
            BRAND AREA
        ================================================ */}

        <div className="px-5 pt-5">
          <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.07] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#37C88B] to-[#21A873] text-white shadow-[0_8px_20px_rgba(35,180,121,0.24)]">
                <Activity size={24} strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[19px] font-black tracking-[0.1em] text-white">
                    ODCOM
                  </span>

                  <span className="rounded-md border border-emerald-200/10 bg-[#8BF0C3]/15 px-1.5 py-[2px] text-[8px] font-black uppercase tracking-wider text-[#A2F3CF]">
                    Ops
                  </span>
                </div>

                <p className="mt-0.5 truncate text-[8.5px] font-semibold uppercase tracking-[0.13em] text-emerald-100/45">
                  Equipment Operations & Support
                </p>
              </div>
            </div>

            {/* Small status strip */}
            <div className="mt-4 flex items-center justify-between rounded-[11px] border border-white/[0.05] bg-black/[0.06] px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                </span>

                <span className="text-[9px] font-semibold text-emerald-50/60">
                  System Operational
                </span>
              </div>

              <ShieldCheck size={13} className="text-emerald-200/50" />
            </div>
          </div>
        </div>

        {/* ===============================================
            NAVIGATION
        ================================================ */}

        <div className="px-4 py-7 space-y-8">
          {renderGroupSection("WORKSPACE")}
          {/* {renderGroupSection("ALERTS")} */}
        </div>
      </div>

      {/* =====================================================
          BOTTOM SUPPORT AREA
      ====================================================== */}

      <div className="relative z-10 px-4 pb-5">
        {/* Support card */}
        <div className="mb-3 rounded-[17px] border border-white/[0.07] bg-white/[0.05] p-3.5 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#77E2B4]/10 text-[#8BF0C3]">
              <Wrench size={17} />
            </div>

            <div>
              <p className="text-[10.5px] font-bold text-white">
                Equipment Support
              </p>

              <p className="mt-1 text-[9px] leading-[15px] text-emerald-50/40">
                Medical equipment operations, rental and support management.
              </p>
            </div>
          </div>
        </div>

        {/* User / Logout */}
        {/* <div className="flex items-center justify-between rounded-[16px] border border-white/[0.06] bg-[#053F31]/40 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#76E4B3] text-[11px] font-black text-[#07543E] shadow-inner">
              RK
            </div>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-white">
                {currentUser.name}
              </p>

              <p className="mt-0.5 text-[9px] font-medium text-emerald-100/40">
                {currentUser.role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-emerald-100/40 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
            title="Sign Out Access"
          >
            <LogOut size={16} />
          </button>
        </div> */}
      </div>
    </aside>
  );
};

export default Sidebar;