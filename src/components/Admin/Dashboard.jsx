// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import DashboardLayout from "../Admin/Layout";
// import {
//   Activity,
//   AlertTriangle,
//   ArrowRight,
//   Box,
//   Building2,
//   CalendarDays,
//   CheckCircle2,
//   ClipboardList,
//   Clock3,
//   CreditCard,
//   FileText,
//   HeartPulse,
//   Layers3,
//   Package,
//   Plus,
//   RefreshCw,
//   ShieldCheck,
//   Truck,
//   UserRound,
//   UsersRound,
//   Wrench,
// } from "lucide-react";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// const getToken = () => localStorage.getItem("token");

// const headers = () => ({
//   "Content-Type": "application/json",
//   ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
// });

// async function safeFetch(url) {
//   try {
//     const res = await fetch(url, { headers: headers() });
//     if (!res.ok) return [];
//     const json = await res.json();
//     return Array.isArray(json) ? json : json?.data || [];
//   } catch {
//     return [];
//   }
// }

// function daysBetween(from, to = new Date()) {
//   if (!from) return 0;
//   const start = new Date(from);
//   const end = to instanceof Date ? to : new Date(to);
//   return Math.max(
//     0,
//     Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)),
//   );
// }

// function formatDate(d) {
//   if (!d) return "—";
//   const parts = String(d).slice(0, 10).split("-");
//   if (parts[0]?.length === 4) {
//     const date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
//     if (!isNaN(date)) {
//       return date
//         .toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         })
//         .replace(/ /g, "-");
//     }
//   }
//   return d;
// }

// const STATUS_MAP = {
//   Pending: {
//     bg: "bg-amber-50",
//     text: "text-amber-700",
//     border: "border-amber-200",
//     dot: "bg-amber-500",
//   },
//   Delivered: {
//     bg: "bg-sky-50",
//     text: "text-sky-700",
//     border: "border-sky-200",
//     dot: "bg-sky-500",
//   },
//   Running: {
//     bg: "bg-emerald-50",
//     text: "text-emerald-700",
//     border: "border-emerald-200",
//     dot: "bg-emerald-500",
//   },
//   Returned: {
//     bg: "bg-slate-50",
//     text: "text-slate-600",
//     border: "border-slate-200",
//     dot: "bg-slate-400",
//   },
//   Closed: {
//     bg: "bg-slate-100",
//     text: "text-slate-500",
//     border: "border-slate-200",
//     dot: "bg-slate-400",
//   },
// };

// function StatusPill({ status }) {
//   const s = STATUS_MAP[status] || STATUS_MAP.Pending;
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border ${s.bg} ${s.text} ${s.border}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
//       {status || "Pending"}
//     </span>
//   );
// }

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [rentals, setRentals] = useState([]);
//   const [devices, setDevices] = useState([]);
//   const [accessories, setAccessories] = useState([]);
//   const [careCenters, setCareCenters] = useState([]);
//   const [references, setReferences] = useState([]);
//   const [deliveryExecs, setDeliveryExecs] = useState([]);

//   const loadAll = useCallback(async () => {
//     setLoading(true);
//     const [r, d, a, c, ref, del] = await Promise.all([
//       safeFetch(`${API_BASE_URL}/api/rentals`),
//       safeFetch(`${API_BASE_URL}/api/devices`),
//       safeFetch(`${API_BASE_URL}/api/accessori`),
//       safeFetch(`${API_BASE_URL}/api/carecenters`),
//       safeFetch(`${API_BASE_URL}/api/references`),
//       safeFetch(`${API_BASE_URL}/api/delivery-executives`),
//     ]);
//     setRentals(r);
//     setDevices(d);
//     setAccessories(a);
//     setCareCenters(c);
//     setReferences(ref);
//     setDeliveryExecs(del);
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     loadAll();
//   }, [loadAll]);

//   // ——— KPI calculations ———
//   const totalRentals = rentals.length;
//   const pending = rentals.filter((r) => r.status === "Pending").length;
//   const running = rentals.filter(
//     (r) => r.status === "Running" || r.status === "Delivered",
//   ).length;
//   const returned = rentals.filter(
//     (r) => r.status === "Returned" || r.status === "Closed",
//   ).length;
//   const dueSoon = rentals.filter((r) => {
//     if (r.login_out_date) return false;
//     const days = daysBetween(r.login_date);
//     return (
//       days >= 25 &&
//       ["Pending", "Delivered", "Running"].includes(r.status || "Pending")
//     );
//   }).length;

//   const activeDevices = devices.filter((d) => d.status === "active").length;
//   const activeAccessories = accessories.filter(
//     (a) => a.status === "active",
//   ).length;
//   const activeCenters = careCenters.filter((c) => c.status === "active").length;
//   const activeRefs = references.filter((r) => r.status === "active").length;
//   const activeDelivery = deliveryExecs.filter(
//     (d) => d.status === "active",
//   ).length;

//   const recentRentals = [...rentals]
//     .sort((a, b) => (b.rental_id || 0) - (a.rental_id || 0))
//     .slice(0, 8);

//   const dueList = rentals
//     .filter((r) => {
//       if (r.login_out_date) return false;
//       const days = daysBetween(r.login_date);
//       return (
//         days >= 25 &&
//         ["Pending", "Delivered", "Running"].includes(r.status || "Pending")
//       );
//     })
//     .sort((a, b) => daysBetween(b.login_date) - daysBetween(a.login_date))
//     .slice(0, 5);

//   const dealBreakdown = {
//     B2B: rentals.filter((r) => r.deal_type === "B2B").length,
//     B2C: rentals.filter((r) => r.deal_type === "B2C").length,
//   };
//   const modeBreakdown = {
//     Prepaid: rentals.filter((r) => r.mode_type === "Prepaid").length,
//     Postpaid: rentals.filter((r) => r.mode_type === "Postpaid").length,
//   };


//   const totalMasterRecords =
//     devices.length +
//     accessories.length +
//     careCenters.length +
//     references.length +
//     deliveryExecs.length;

//   const totalActiveMasterRecords =
//     activeDevices +
//     activeAccessories +
//     activeCenters +
//     activeRefs +
//     activeDelivery;

//   const masterAvailability =
//     totalMasterRecords > 0
//       ? Math.round((totalActiveMasterRecords / totalMasterRecords) * 100)
//       : 0;

//   const safePercent = (value, total) =>
//     total > 0 ? Math.round((value / total) * 100) : 0;

//   const dealCards = [
//     {
//       label: "B2B",
//       value: dealBreakdown.B2B,
//       percent: safePercent(dealBreakdown.B2B, totalRentals),
//     },
//     {
//       label: "B2C",
//       value: dealBreakdown.B2C,
//       percent: safePercent(dealBreakdown.B2C, totalRentals),
//     },
//   ];

//   const modeCards = [
//     {
//       label: "Prepaid",
//       value: modeBreakdown.Prepaid,
//       percent: safePercent(modeBreakdown.Prepaid, totalRentals),
//     },
//     {
//       label: "Postpaid",
//       value: modeBreakdown.Postpaid,
//       percent: safePercent(modeBreakdown.Postpaid, totalRentals),
//     },
//   ];

//   const kpis = [
//     {
//       label: "Total Rentals",
//       value: totalRentals,
//       helper: "All requisitions",
//       Icon: ClipboardList,
//       tone: "emerald",
//     },
//     {
//       label: "Active / Running",
//       value: running,
//       helper: "Currently in field",
//       Icon: Activity,
//       tone: "green",
//     },
//     {
//       label: "Pending",
//       value: pending,
//       helper: "Awaiting deployment",
//       Icon: Clock3,
//       tone: "amber",
//     },
//     {
//       label: "Due Alert",
//       value: dueSoon,
//       helper: "25+ days open",
//       Icon: AlertTriangle,
//       tone: "rose",
//     },
//   ];

//   const modules = [
//     {
//       title: "Devices",
//       count: activeDevices,
//       total: devices.length,
//       path: "/inventory",
//       Icon: Wrench,
//       description: "Equipment models",
//     },
//     {
//       title: "Accessories",
//       count: activeAccessories,
//       total: accessories.length,
//       path: "/inventory",
//       Icon: Package,
//       description: "Rental accessories",
//     },
//     {
//       title: "Care Centers",
//       count: activeCenters,
//       total: careCenters.length,
//       path: "/inventory",
//       Icon: Building2,
//       description: "Service locations",
//     },
//     {
//       title: "References",
//       count: activeRefs,
//       total: references.length,
//       path: "/inventory",
//       Icon: UsersRound,
//       description: "Doctor references",
//     },
//     {
//       title: "Delivery Execs",
//       count: activeDelivery,
//       total: deliveryExecs.length,
//       path: "/inventory",
//       Icon: Truck,
//       description: "Delivery team",
//     },
//   ];

//   const getKpiClasses = (tone) => {
//     switch (tone) {
//       case "amber":
//         return {
//           icon: "bg-amber-50 text-amber-700 border-amber-100",
//           dot: "bg-amber-400",
//           accent: "from-amber-400/10 to-transparent",
//         };
//       case "rose":
//         return {
//           icon: "bg-rose-50 text-rose-600 border-rose-100",
//           dot: "bg-rose-500",
//           accent: "from-rose-400/10 to-transparent",
//         };
//       case "green":
//         return {
//           icon: "bg-[#EAF7F0] text-[#087A57] border-[#D6ECE2]",
//           dot: "bg-emerald-500",
//           accent: "from-[#0A9668]/10 to-transparent",
//         };
//       default:
//         return {
//           icon: "bg-[#EDF8F3] text-[#087A57] border-[#D8EEE4]",
//           dot: "bg-[#0A9668]",
//           accent: "from-[#087A57]/10 to-transparent",
//         };
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex min-h-[72vh] items-center justify-center bg-[#F5F9F7] px-4">
//           <div className="w-full max-w-sm rounded-[24px] border border-[#E1ECE7] bg-white p-8 text-center shadow-[0_18px_45px_rgba(24,82,61,0.09)]">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7F0] text-[#087A57]">
//               <RefreshCw size={23} className="animate-spin" />
//             </div>
//             <h3 className="mt-4 text-[15px] font-extrabold text-[#28463A]">
//               Loading Operations Dashboard
//             </h3>
//             <p className="mt-1.5 text-[10.5px] font-medium leading-5 text-[#8B9C94]">
//               Synchronizing rentals, equipment, care centers and operational master data.
//             </p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-[#F5F9F7]">
//         <div className="mx-auto w-full max-w-[1540px] space-y-4 px-3 py-4 sm:px-5 lg:px-6">
//           {/* =====================================================
//               PREMIUM OPERATIONS HEADER
//           ====================================================== */}
//           <section className="relative overflow-hidden rounded-[26px] border border-[#DCEAE4] bg-gradient-to-br from-[#075F46] via-[#087252] to-[#086B4E] text-white shadow-[0_18px_46px_rgba(7,95,70,0.16)]">
//             <div className="pointer-events-none absolute inset-0">
//               <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/[0.07]" />
//               <div className="absolute right-10 top-4 h-52 w-52 rounded-full border border-white/[0.05]" />
//               <div className="absolute -bottom-36 left-[24%] h-72 w-72 rounded-full bg-[#66E2AC]/10 blur-3xl" />
//               <div
//                 className="absolute inset-0 opacity-[0.025]"
//                 style={{
//                   backgroundImage:
//                     "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
//                   backgroundSize: "42px 42px",
//                 }}
//               />
//             </div>

//             <div className="relative z-10 flex flex-col gap-6 px-5 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-7 lg:py-7">
//               <div className="flex min-w-0 items-start gap-4">
//                 <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-[17px] border border-white/[0.10] bg-white/[0.10] text-[#A7F1D0] shadow-inner backdrop-blur sm:flex">
//                   <HeartPulse size={27} strokeWidth={2.05} />
//                 </div>

//                 <div className="min-w-0">
//                   <div className="mb-2 flex flex-wrap items-center gap-2">
//                     <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.08] px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-[0.13em] text-emerald-50/80">
//                       <ShieldCheck size={10} />
//                       ODCom Operations
//                     </span>

//                     <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/10 bg-[#8BF0C3]/10 px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-[0.1em] text-[#A5F1D0]">
//                       <span className="relative flex h-1.5 w-1.5">
//                         <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-40" />
//                         <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
//                       </span>
//                       Live System
//                     </span>
//                   </div>

//                   <h1 className="text-[24px] font-black tracking-[-0.035em] text-white sm:text-[30px]">
//                     Operations Dashboard
//                   </h1>

//                   <p className="mt-1.5 max-w-[680px] text-[11.5px] font-medium leading-5 text-emerald-50/60">
//                     Medical equipment rental, inventory and logistics overview for daily ODCom operations.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-wrap items-center gap-2.5">
//                 <button
//                   type="button"
//                   onClick={loadAll}
//                   className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.08] text-emerald-50/75 transition hover:bg-white/[0.14] hover:text-white"
//                   title="Refresh dashboard data"
//                   aria-label="Refresh dashboard data"
//                 >
//                   <RefreshCw size={16} />
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => navigate("/rental-master")}
//                   className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.08] px-4 text-[10.5px] font-extrabold text-white transition hover:bg-white/[0.14]"
//                 >
//                   <Layers3 size={15} />
//                   Rental Master
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => navigate("/rental-requisition")}
//                   className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#8BF0C3] px-4.5 text-[10.5px] font-black text-[#07543E] shadow-[0_9px_24px_rgba(41,209,141,0.20)] transition hover:-translate-y-[1px] hover:bg-[#A0F2CE] active:translate-y-0"
//                 >
//                   <Plus size={15} strokeWidth={2.5} />
//                   New Requisition
//                 </button>
//               </div>
//             </div>

//             <div className="relative z-10 grid grid-cols-2 border-t border-white/[0.08] bg-black/[0.05] sm:grid-cols-4">
//               <div className="border-r border-white/[0.07] px-5 py-3.5">
//                 <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-emerald-50/40">
//                   Active Master Data
//                 </p>
//                 <p className="mt-1 text-[13px] font-extrabold text-white">
//                   {totalActiveMasterRecords}
//                   <span className="ml-1 text-[9px] font-semibold text-emerald-50/40">
//                     / {totalMasterRecords}
//                   </span>
//                 </p>
//               </div>

//               <div className="border-r border-white/[0.07] px-5 py-3.5">
//                 <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-emerald-50/40">
//                   Master Availability
//                 </p>
//                 <p className="mt-1 text-[13px] font-extrabold text-[#A5F1D0]">
//                   {masterAvailability}%
//                 </p>
//               </div>

//               <div className="border-r border-white/[0.07] px-5 py-3.5">
//                 <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-emerald-50/40">
//                   Returned / Closed
//                 </p>
//                 <p className="mt-1 text-[13px] font-extrabold text-white">
//                   {returned}
//                 </p>
//               </div>

//               <div className="px-5 py-3.5">
//                 <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-emerald-50/40">
//                   Needs Attention
//                 </p>
//                 <p className={`mt-1 text-[13px] font-extrabold ${dueSoon > 0 ? "text-amber-200" : "text-[#A5F1D0]"}`}>
//                   {dueSoon}
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* =====================================================
//               KPI CARDS
//           ====================================================== */}
//           <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
//             {kpis.map((item) => {
//               const Icon = item.Icon;
//               const tone = getKpiClasses(item.tone);

//               return (
//                 <button
//                   type="button"
//                   key={item.label}
//                   onClick={() => navigate("/rental-master")}
//                   className="group relative overflow-hidden rounded-[20px] border border-[#DDE9E4] bg-white p-4 text-left shadow-[0_7px_24px_rgba(29,91,68,0.04)] transition hover:-translate-y-[1px] hover:border-[#C8DED4] hover:shadow-[0_12px_30px_rgba(29,91,68,0.08)] sm:p-5"
//                 >
//                   <div className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${tone.accent}`} />

//                   <div className="relative flex items-start justify-between gap-3">
//                     <span className={`flex h-10 w-10 items-center justify-center rounded-[12px] border ${tone.icon}`}>
//                       <Icon size={18} strokeWidth={2.1} />
//                     </span>

//                     <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4ECE8] bg-[#F8FAF9] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#85978F]">
//                       <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
//                       {item.helper}
//                     </span>
//                   </div>

//                   <div className="relative mt-5">
//                     <p className="text-[28px] font-black tracking-[-0.045em] text-[#1F3D32] sm:text-[32px]">
//                       {item.value}
//                     </p>
//                     <div className="mt-1 flex items-center justify-between gap-2">
//                       <p className="text-[10.5px] font-extrabold text-[#536D62]">
//                         {item.label}
//                       </p>
//                       <ArrowRight
//                         size={13}
//                         className="translate-x-[-3px] text-[#9AABA3] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
//                       />
//                     </div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* =====================================================
//               MASTER DATA + COMMERCIAL MIX
//           ====================================================== */}
//           <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.65fr_1fr]">
//             {/* Master data modules */}
//             <section className="overflow-hidden rounded-[21px] border border-[#DDE9E4] bg-white shadow-[0_8px_28px_rgba(29,91,68,0.045)]">
//               <div className="flex items-center justify-between gap-4 border-b border-[#EBF2EE] px-5 py-4">
//                 <div className="flex items-center gap-3">
//                   <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF8F3] text-[#087A57]">
//                     <Box size={17} />
//                   </span>

//                   <div>
//                     <h2 className="text-[12.5px] font-extrabold text-[#304E42]">
//                       Master Information
//                     </h2>
//                     <p className="mt-0.5 text-[9px] font-medium text-[#98A79F]">
//                       Active equipment and operational reference records.
//                     </p>
//                   </div>
//                 </div>

//                 <Link
//                   to="/inventory"
//                   className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[9.5px] font-extrabold text-[#087A57] transition hover:bg-[#EFF8F4]"
//                 >
//                   Manage
//                   <ArrowRight size={12} />
//                 </Link>
//               </div>

//               <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 xl:grid-cols-5">
//                 {modules.map((module) => {
//                   const Icon = module.Icon;
//                   const percentage =
//                     module.total > 0
//                       ? Math.round((module.count / module.total) * 100)
//                       : 0;

//                   return (
//                     <button
//                       type="button"
//                       key={module.title}
//                       onClick={() => navigate(module.path)}
//                       className="group rounded-[16px] border border-[#E3ECE8] bg-[#FBFDFC] p-3.5 text-left transition hover:-translate-y-[1px] hover:border-[#CDE1D8] hover:bg-white hover:shadow-[0_8px_20px_rgba(29,91,68,0.07)]"
//                     >
//                       <div className="flex items-start justify-between gap-2">
//                         <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCEDE5] bg-[#EEF8F3] text-[#087A57] transition group-hover:bg-[#E7F5EE]">
//                           <Icon size={16} strokeWidth={2.05} />
//                         </span>

//                         <span className="text-[8px] font-extrabold text-[#95A59E]">
//                           {percentage}%
//                         </span>
//                       </div>

//                       <p className="mt-3 text-[11px] font-extrabold text-[#405D52]">
//                         {module.title}
//                       </p>
//                       <p className="mt-0.5 truncate text-[8.5px] font-medium text-[#99A8A1]">
//                         {module.description}
//                       </p>

//                       <div className="mt-3 flex items-end justify-between">
//                         <p className="text-[19px] font-black tracking-[-0.03em] text-[#28483B]">
//                           {module.count}
//                         </p>
//                         <p className="text-[8.5px] font-bold text-[#9AA9A2]">
//                           of {module.total}
//                         </p>
//                       </div>

//                       <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EAF0ED]">
//                         <div
//                           className="h-full rounded-full bg-gradient-to-r from-[#087A57] to-[#31B77E]"
//                           style={{ width: `${percentage}%` }}
//                         />
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </section>

//             {/* Deal / payment mix */}
//             <section className="overflow-hidden rounded-[21px] border border-[#DDE9E4] bg-white shadow-[0_8px_28px_rgba(29,91,68,0.045)]">
//               <div className="flex items-center gap-3 border-b border-[#EBF2EE] px-5 py-4">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF8F3] text-[#087A57]">
//                   <CreditCard size={17} />
//                 </span>

//                 <div>
//                   <h2 className="text-[12.5px] font-extrabold text-[#304E42]">
//                     Deal & Mode Mix
//                   </h2>
//                   <p className="mt-0.5 text-[9px] font-medium text-[#98A79F]">
//                     Current rental mix across business and payment modes.
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-1">
//                 <div>
//                   <div className="mb-2.5 flex items-center justify-between">
//                     <p className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#82968D]">
//                       Deal Type
//                     </p>
//                     <span className="text-[8px] font-bold text-[#A0AEA8]">
//                       {totalRentals} total
//                     </span>
//                   </div>

//                   <div className="space-y-2.5">
//                     {dealCards.map((item) => (
//                       <div
//                         key={item.label}
//                         className="rounded-[13px] border border-[#E6EEE9] bg-[#FBFDFC] px-3.5 py-3"
//                       >
//                         <div className="flex items-center justify-between gap-3">
//                           <div>
//                             <p className="text-[10px] font-extrabold text-[#435F54]">
//                               {item.label}
//                             </p>
//                             <p className="mt-0.5 text-[8px] font-medium text-[#9BA9A3]">
//                               {item.value} rentals
//                             </p>
//                           </div>

//                           <span className="text-[12px] font-black text-[#087A57]">
//                             {item.percent}%
//                           </span>
//                         </div>

//                         <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#EAF0ED]">
//                           <div
//                             className="h-full rounded-full bg-gradient-to-r from-[#087A57] to-[#31B77E]"
//                             style={{ width: `${item.percent}%` }}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="border-t border-[#EDF2EF] pt-4 sm:border-l sm:border-t-0 sm:pl-4 xl:border-l-0 xl:border-t xl:pl-0">
//                   <div className="mb-2.5 flex items-center justify-between">
//                     <p className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#82968D]">
//                       Billing Mode
//                     </p>
//                     <span className="text-[8px] font-bold text-[#A0AEA8]">
//                       Prepaid / Postpaid
//                     </span>
//                   </div>

//                   <div className="space-y-2.5">
//                     {modeCards.map((item) => (
//                       <div
//                         key={item.label}
//                         className="rounded-[13px] border border-[#E6EEE9] bg-[#FBFDFC] px-3.5 py-3"
//                       >
//                         <div className="flex items-center justify-between gap-3">
//                           <div>
//                             <p className="text-[10px] font-extrabold text-[#435F54]">
//                               {item.label}
//                             </p>
//                             <p className="mt-0.5 text-[8px] font-medium text-[#9BA9A3]">
//                               {item.value} rentals
//                             </p>
//                           </div>

//                           <span
//                             className={`text-[12px] font-black ${
//                               item.label === "Prepaid"
//                                 ? "text-amber-600"
//                                 : "text-[#087A57]"
//                             }`}
//                           >
//                             {item.percent}%
//                           </span>
//                         </div>

//                         <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#EAF0ED]">
//                           <div
//                             className={`h-full rounded-full ${
//                               item.label === "Prepaid"
//                                 ? "bg-gradient-to-r from-amber-400 to-amber-500"
//                                 : "bg-gradient-to-r from-[#087A57] to-[#31B77E]"
//                             }`}
//                             style={{ width: `${item.percent}%` }}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* =====================================================
//               RECENT REQUISITIONS + NEEDS ATTENTION
//           ====================================================== */}
//           <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_0.85fr]">
//             {/* Recent */}
//             <section className="overflow-hidden rounded-[21px] border border-[#DDE9E4] bg-white shadow-[0_8px_28px_rgba(29,91,68,0.045)]">
//               <div className="flex items-center justify-between gap-4 border-b border-[#EBF2EE] px-5 py-4">
//                 <div className="flex items-center gap-3">
//                   <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF8F3] text-[#087A57]">
//                     <FileText size={17} />
//                   </span>

//                   <div>
//                     <h2 className="text-[12.5px] font-extrabold text-[#304E42]">
//                       Recent Requisitions
//                     </h2>
//                     <p className="mt-0.5 text-[9px] font-medium text-[#98A79F]">
//                       Latest rental records across equipment operations.
//                     </p>
//                   </div>
//                 </div>

//                 <Link
//                   to="/rental-master"
//                   className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[9.5px] font-extrabold text-[#087A57] transition hover:bg-[#EFF8F4]"
//                 >
//                   View all
//                   <ArrowRight size={12} />
//                 </Link>
//               </div>

//               {recentRentals.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
//                   <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F8F5] text-[#8CA096]">
//                     <ClipboardList size={20} />
//                   </span>
//                   <p className="mt-3 text-[11px] font-extrabold text-[#526A60]">
//                     No rentals yet
//                   </p>
//                   <p className="mt-1 text-[9px] font-medium text-[#A0AEA7]">
//                     New requisitions will appear here.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full min-w-[760px] border-collapse text-left">
//                     <thead>
//                       <tr className="border-b border-[#EBF2EE] bg-[#F9FBFA] text-[8.5px] font-extrabold uppercase tracking-[0.11em] text-[#879A91]">
//                         <th className="px-5 py-3">Patient</th>
//                         <th className="px-5 py-3">Device</th>
//                         <th className="px-5 py-3">Login Date</th>
//                         <th className="px-5 py-3">Status</th>
//                         <th className="px-5 py-3 text-right">Days</th>
//                       </tr>
//                     </thead>

//                     <tbody className="divide-y divide-[#EEF3F0]">
//                       {recentRentals.map((rental) => {
//                         const days = daysBetween(
//                           rental.login_date,
//                           rental.login_out_date,
//                         );
//                         const isDue =
//                           !rental.login_out_date &&
//                           days >= 30;

//                         return (
//                           <tr
//                             key={rental.rental_id}
//                             onClick={() =>
//                               navigate(`/rental-view/${rental.rental_id}`)
//                             }
//                             className={`group cursor-pointer transition ${
//                               isDue
//                                 ? "bg-amber-50/[0.20] hover:bg-amber-50/55"
//                                 : "hover:bg-[#F9FBFA]"
//                             }`}
//                           >
//                             <td className="px-5 py-3.5">
//                               <div className="flex items-center gap-2.5">
//                                 <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#F1F6F3] text-[#7C9288]">
//                                   <UserRound size={14} />
//                                 </span>

//                                 <div className="min-w-0">
//                                   <p className="max-w-[170px] truncate text-[10.5px] font-extrabold text-[#3A554A]">
//                                     {rental.patient_name || "—"}
//                                   </p>
//                                   <p className="mt-0.5 text-[8px] font-medium text-[#9BA9A3]">
//                                     #{rental.rental_id} · {rental.deal_type || "—"} ·{" "}
//                                     {rental.mode_type || "—"}
//                                   </p>
//                                 </div>
//                               </div>
//                             </td>

//                             <td className="px-5 py-3.5">
//                               <div className="flex max-w-[220px] items-center gap-2 text-[10px] font-bold text-[#087A57]">
//                                 <Wrench size={12} className="shrink-0" />
//                                 <span className="truncate">
//                                   {rental.device?.device_name || "—"}
//                                 </span>
//                               </div>
//                             </td>

//                             <td className="px-5 py-3.5">
//                               <div className="inline-flex items-center gap-1.5 whitespace-nowrap text-[9.5px] font-semibold text-[#687E74]">
//                                 <CalendarDays size={12} className="text-[#94A69E]" />
//                                 {formatDate(rental.login_date)}
//                               </div>
//                             </td>

//                             <td className="px-5 py-3.5">
//                               <StatusPill status={rental.status} />
//                             </td>

//                             <td className="px-5 py-3.5 text-right">
//                               <span
//                                 className={`inline-flex min-w-[40px] items-center justify-center rounded-lg px-2 py-1 text-[9.5px] font-extrabold ${
//                                   isDue
//                                     ? "border border-amber-200 bg-amber-50 text-amber-700"
//                                     : "bg-[#F3F7F5] text-[#61766D]"
//                                 }`}
//                               >
//                                 {days}d
//                               </span>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>

//             {/* Needs attention */}
//             <section className="overflow-hidden rounded-[21px] border border-[#E6E2D5] bg-white shadow-[0_8px_28px_rgba(29,91,68,0.045)]">
//               <div className="flex items-center justify-between gap-4 border-b border-amber-100 bg-gradient-to-r from-amber-50/75 to-white px-5 py-4">
//                 <div className="flex items-center gap-3">
//                   <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600">
//                     <AlertTriangle size={17} />
//                   </span>

//                   <div>
//                     <h2 className="text-[12.5px] font-extrabold text-[#4E4A3D]">
//                       Needs Attention
//                     </h2>
//                     <p className="mt-0.5 text-[9px] font-medium text-[#A09677]">
//                       Rentals open for 25 days or more.
//                     </p>
//                   </div>
//                 </div>

//                 <span
//                   className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full px-2 text-[9px] font-black ${
//                     dueList.length > 0
//                       ? "border border-amber-200 bg-amber-100 text-amber-700"
//                       : "border border-emerald-100 bg-emerald-50 text-emerald-700"
//                   }`}
//                 >
//                   {dueList.length}
//                 </span>
//               </div>

//               {dueList.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
//                   <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
//                     <CheckCircle2 size={21} />
//                   </span>
//                   <p className="mt-3 text-[11px] font-extrabold text-[#526A60]">
//                     Nothing overdue
//                   </p>
//                   <p className="mt-1 text-[9px] font-medium text-[#A0AEA7]">
//                     No current rental requires duration attention.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-[#F1EFE8]">
//                   {dueList.map((rental) => {
//                     const days = daysBetween(rental.login_date);
//                     const critical = days >= 30;

//                     return (
//                       <button
//                         type="button"
//                         key={rental.rental_id}
//                         onClick={() =>
//                           navigate(`/rental-view/${rental.rental_id}`)
//                         }
//                         className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-amber-50/[0.45]"
//                       >
//                         <span
//                           className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[10px] font-black ${
//                             critical
//                               ? "border border-rose-100 bg-rose-50 text-rose-600"
//                               : "border border-amber-100 bg-amber-50 text-amber-700"
//                           }`}
//                         >
//                           {days}d
//                         </span>

//                         <div className="min-w-0 flex-1">
//                           <div className="flex items-center gap-2">
//                             <p className="truncate text-[10.5px] font-extrabold text-[#4C554E]">
//                               {rental.patient_name || "Patient"}
//                             </p>
//                             {critical && (
//                               <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wide text-rose-600">
//                                 Due
//                               </span>
//                             )}
//                           </div>

//                           <p className="mt-0.5 truncate text-[8.5px] font-medium text-[#9B9A8B]">
//                             {rental.device?.device_name || "Device"} · since{" "}
//                             {formatDate(rental.login_date)}
//                           </p>
//                         </div>

//                         <ArrowRight
//                           size={13}
//                           className="shrink-0 translate-x-[-3px] text-[#B8B39D] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
//                         />
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}

//               <div className="border-t border-[#EFEDE6] bg-[#FCFCFA] px-5 py-3">
//                 <Link
//                   to="/rental-master"
//                   className="inline-flex items-center gap-1.5 text-[9.5px] font-extrabold text-[#806F39] transition hover:text-amber-700"
//                 >
//                   Open Rental Master
//                   <ArrowRight size={12} />
//                 </Link>
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }







import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../Admin/Layout";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Box,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  CreditCard,
  FileText,
  HeartPulse,
  Layers3,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Truck,
  UserRound,
  UsersRound,
  Wrench,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

async function safeFetch(url) {
  try {
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : json?.data || [];
  } catch {
    return [];
  }
}

function daysBetween(from, to = new Date()) {
  if (!from) return 0;
  const start = new Date(from);
  const end = to instanceof Date ? to : new Date(to);
  return Math.max(
    0,
    Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)),
  );
}

function formatDate(d) {
  if (!d) return "—";
  const parts = String(d).slice(0, 10).split("-");
  if (parts[0]?.length === 4) {
    const date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    if (!isNaN(date)) {
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    }
  }
  return d;
}

const STATUS_MAP = {
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  Delivered: {
    bg: "bg-[#F3EFFF]",
    text: "text-[#5d2ed7]",
    border: "border-[#E8DEFF]",
    dot: "bg-[#5d2ed7]",
  },
  Running: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  Returned: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  Closed: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

function StatusPill({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status || "Pending"}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState([]);
  const [devices, setDevices] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [careCenters, setCareCenters] = useState([]);
  const [references, setReferences] = useState([]);
  const [deliveryExecs, setDeliveryExecs] = useState([]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [r, d, a, c, ref, del] = await Promise.all([
      safeFetch(`${API_BASE_URL}/api/rentals`),
      safeFetch(`${API_BASE_URL}/api/devices`),
      safeFetch(`${API_BASE_URL}/api/accessori`),
      safeFetch(`${API_BASE_URL}/api/carecenters`),
      safeFetch(`${API_BASE_URL}/api/references`),
      safeFetch(`${API_BASE_URL}/api/delivery-executives`),
    ]);
    setRentals(r);
    setDevices(d);
    setAccessories(a);
    setCareCenters(c);
    setReferences(ref);
    setDeliveryExecs(del);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ——— KPI calculations ———
  const totalRentals = rentals.length;
  const pending = rentals.filter((r) => r.status === "Pending").length;
  const running = rentals.filter(
    (r) => r.status === "Running" || r.status === "Delivered",
  ).length;
  const returned = rentals.filter(
    (r) => r.status === "Returned" || r.status === "Closed",
  ).length;
  const dueSoon = rentals.filter((r) => {
    if (r.login_out_date) return false;
    const days = daysBetween(r.login_date);
    return (
      days >= 25 &&
      ["Pending", "Delivered", "Running"].includes(r.status || "Pending")
    );
  }).length;

  const activeDevices = devices.filter((d) => d.status === "active").length;
  const activeAccessories = accessories.filter(
    (a) => a.status === "active",
  ).length;
  const activeCenters = careCenters.filter((c) => c.status === "active").length;
  const activeRefs = references.filter((r) => r.status === "active").length;
  const activeDelivery = deliveryExecs.filter(
    (d) => d.status === "active",
  ).length;

  const recentRentals = [...rentals]
    .sort((a, b) => (b.rental_id || 0) - (a.rental_id || 0))
    .slice(0, 8);

  const dueList = rentals
    .filter((r) => {
      if (r.login_out_date) return false;
      const days = daysBetween(r.login_date);
      return (
        days >= 25 &&
        ["Pending", "Delivered", "Running"].includes(r.status || "Pending")
      );
    })
    .sort((a, b) => daysBetween(b.login_date) - daysBetween(a.login_date))
    .slice(0, 5);

  const dealBreakdown = {
    B2B: rentals.filter((r) => r.deal_type === "B2B").length,
    B2C: rentals.filter((r) => r.deal_type === "B2C").length,
  };
  const modeBreakdown = {
    Prepaid: rentals.filter((r) => r.mode_type === "Prepaid").length,
    Postpaid: rentals.filter((r) => r.mode_type === "Postpaid").length,
  };

  const totalMasterRecords =
    devices.length +
    accessories.length +
    careCenters.length +
    references.length +
    deliveryExecs.length;

  const totalActiveMasterRecords =
    activeDevices +
    activeAccessories +
    activeCenters +
    activeRefs +
    activeDelivery;

  const masterAvailability =
    totalMasterRecords > 0
      ? Math.round((totalActiveMasterRecords / totalMasterRecords) * 100)
      : 0;

  const safePercent = (value, total) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const dealCards = [
    {
      label: "B2B",
      value: dealBreakdown.B2B,
      percent: safePercent(dealBreakdown.B2B, totalRentals),
    },
    {
      label: "B2C",
      value: dealBreakdown.B2C,
      percent: safePercent(dealBreakdown.B2C, totalRentals),
    },
  ];

  const modeCards = [
    {
      label: "Prepaid",
      value: modeBreakdown.Prepaid,
      percent: safePercent(modeBreakdown.Prepaid, totalRentals),
    },
    {
      label: "Postpaid",
      value: modeBreakdown.Postpaid,
      percent: safePercent(modeBreakdown.Postpaid, totalRentals),
    },
  ];

  const kpis = [
    {
      label: "Total Rentals",
      value: totalRentals,
      helper: "All requisitions",
      Icon: ClipboardList,
      tone: "purple",
    },
    {
      label: "Active / Running",
      value: running,
      helper: "Currently in field",
      Icon: Activity,
      tone: "violet",
    },
    {
      label: "Pending",
      value: pending,
      helper: "Awaiting deployment",
      Icon: Clock3,
      tone: "amber",
    },
    {
      label: "Due Alert",
      value: dueSoon,
      helper: "25+ days open",
      Icon: AlertTriangle,
      tone: "rose",
    },
  ];

  const modules = [
    {
      title: "Devices",
      count: activeDevices,
      total: devices.length,
      path: "/inventory",
      Icon: Wrench,
      description: "Equipment models",
    },
    {
      title: "Accessories",
      count: activeAccessories,
      total: accessories.length,
      path: "/inventory",
      Icon: Package,
      description: "Rental accessories",
    },
    {
      title: "Care Centers",
      count: activeCenters,
      total: careCenters.length,
      path: "/inventory",
      Icon: Building2,
      description: "Service locations",
    },
    {
      title: "References",
      count: activeRefs,
      total: references.length,
      path: "/inventory",
      Icon: UsersRound,
      description: "Doctor references",
    },
    {
      title: "Delivery Execs",
      count: activeDelivery,
      total: deliveryExecs.length,
      path: "/inventory",
      Icon: Truck,
      description: "Delivery team",
    },
  ];

  const getKpiClasses = (tone) => {
    switch (tone) {
      case "amber":
        return {
          icon: "bg-amber-50 text-amber-700 border-amber-100",
          dot: "bg-amber-400",
          accent: "from-amber-400/10 to-transparent",
        };
      case "rose":
        return {
          icon: "bg-rose-50 text-rose-600 border-rose-100",
          dot: "bg-rose-500",
          accent: "from-rose-400/10 to-transparent",
        };
      case "violet":
        return {
          icon: "bg-[#F3EFFF] text-[#5d2ed7] border-[#E8DEFF]",
          dot: "bg-[#5d2ed7]",
          accent: "from-[#5d2ed7]/10 to-transparent",
        };
      default:
        return {
          icon: "bg-[#FAF8FF] text-[#421E9F] border-[#E3D9FF]",
          dot: "bg-[#421E9F]",
          accent: "from-[#421E9F]/10 to-transparent",
        };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[72vh] items-center justify-center bg-[#FAF8FF] px-4">
          <div className="w-full max-w-sm rounded-[24px] border border-[#E3D9FF] bg-white p-8 text-center shadow-[0_18px_45px_rgba(93,46,215,0.08)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EFFF] text-[#5d2ed7]">
              <RefreshCw size={23} className="animate-spin" />
            </div>
            <h3 className="mt-4 text-[15px] font-extrabold text-[#22124D]">
              Loading Operations Dashboard
            </h3>
            <p className="mt-1.5 text-[10.5px] font-medium leading-5 text-[#7F6EA6]">
              Synchronizing rentals, equipment, care centers and operational master data.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#FAF8FF]">
        <div className="mx-auto w-full max-w-[1540px] space-y-4 px-3 py-4 sm:px-5 lg:px-6">
          {/* =====================================================
              PREMIUM OPERATIONS HEADER
          ====================================================== */}
          <section className="relative overflow-hidden rounded-[26px] border border-[#421E9F]/70 bg-gradient-to-br from-[#421E9F] via-[#5d2ed7] to-[#250F61] text-white shadow-[0_18px_46px_rgba(37,15,97,0.22)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/[0.07]" />
              <div className="absolute right-10 top-4 h-52 w-52 rounded-full border border-white/[0.05]" />
              <div className="absolute -bottom-36 left-[24%] h-72 w-72 rounded-full bg-[#916BF5]/20 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage:
                    "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                  backgroundSize: "42px 42px",
                }}
              />
            </div>

            <div className="relative z-10 flex flex-col gap-6 px-5 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-7 lg:py-7">
              <div className="flex min-w-0 items-start gap-4">
                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-[17px] border border-white/[0.12] bg-white/[0.10] text-[#D8CEF9] shadow-inner backdrop-blur sm:flex">
                  <HeartPulse size={27} strokeWidth={2.05} />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.08] px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-[0.13em] text-purple-100/80">
                      <ShieldCheck size={10} />
                      ODCom Operations
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D3C4FC]/30 bg-[#D3C4FC]/15 px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-[0.1em] text-[#D8CEF9]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D3C4FC] opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D3C4FC]" />
                      </span>
                      Live System
                    </span>
                  </div>

                  <h1 className="text-[24px] font-black tracking-[-0.035em] text-white sm:text-[30px]">
                    Operations Dashboard
                  </h1>

                  <p className="mt-1.5 max-w-[680px] text-[11.5px] font-medium leading-5 text-purple-100/70">
                    Medical equipment rental, inventory and logistics overview for daily ODCom operations.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={loadAll}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.08] text-purple-100/80 transition hover:bg-white/[0.16] hover:text-white"
                  title="Refresh dashboard data"
                  aria-label="Refresh dashboard data"
                >
                  <RefreshCw size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/rental-master")}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.08] px-4 text-[10.5px] font-extrabold text-white transition hover:bg-white/[0.16]"
                >
                  <Layers3 size={15} />
                  Rental Master
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/rental-requisition")}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4.5 text-[10.5px] font-black text-[#421E9F] shadow-[0_9px_24px_rgba(0,0,0,0.18)] transition hover:-translate-y-[1px] hover:bg-[#F3EFFF] active:translate-y-0"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  New Requisition
                </button>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 border-t border-white/[0.08] bg-black/[0.12] sm:grid-cols-4">
              <div className="border-r border-white/[0.07] px-5 py-3.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-purple-200/50">
                  Active Master Data
                </p>
                <p className="mt-1 text-[13px] font-extrabold text-white">
                  {totalActiveMasterRecords}
                  <span className="ml-1 text-[9px] font-semibold text-purple-200/50">
                    / {totalMasterRecords}
                  </span>
                </p>
              </div>

              <div className="border-r border-white/[0.07] px-5 py-3.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-purple-200/50">
                  Master Availability
                </p>
                <p className="mt-1 text-[13px] font-extrabold text-[#D8CEF9]">
                  {masterAvailability}%
                </p>
              </div>

              <div className="border-r border-white/[0.07] px-5 py-3.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-purple-200/50">
                  Returned / Closed
                </p>
                <p className="mt-1 text-[13px] font-extrabold text-white">
                  {returned}
                </p>
              </div>

              <div className="px-5 py-3.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-purple-200/50">
                  Needs Attention
                </p>
                <p className={`mt-1 text-[13px] font-extrabold ${dueSoon > 0 ? "text-amber-300" : "text-[#D8CEF9]"}`}>
                  {dueSoon}
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              KPI CARDS
          ====================================================== */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {kpis.map((item) => {
              const Icon = item.Icon;
              const tone = getKpiClasses(item.tone);

              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => navigate("/rental-master")}
                  className="group relative overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white p-4 text-left shadow-[0_7px_24px_rgba(93,46,215,0.04)] transition hover:-translate-y-[1px] hover:border-[#D3C4FC] hover:shadow-[0_12px_30px_rgba(93,46,215,0.08)] sm:p-5"
                >
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${tone.accent}`} />

                  <div className="relative flex items-start justify-between gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-[12px] border ${tone.icon}`}>
                      <Icon size={18} strokeWidth={2.1} />
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3D9FF] bg-[#FAF8FF] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7F6EA6]">
                      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                      {item.helper}
                    </span>
                  </div>

                  <div className="relative mt-5">
                    <p className="text-[28px] font-black tracking-[-0.045em] text-[#22124D] sm:text-[32px]">
                      {item.value}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="text-[10.5px] font-extrabold text-[#553E82]">
                        {item.label}
                      </p>
                      <ArrowRight
                        size={13}
                        className="translate-x-[-3px] text-[#9C8AC7] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* =====================================================
              MASTER DATA + COMMERCIAL MIX
          ====================================================== */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.65fr_1fr]">
            {/* Master data modules */}
            <section className="overflow-hidden rounded-[21px] border border-[#E3D9FF] bg-white shadow-[0_8px_28px_rgba(93,46,215,0.045)]">
              <div className="flex items-center justify-between gap-4 border-b border-[#F3EFFF] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EFFF] text-[#5d2ed7]">
                    <Box size={17} />
                  </span>

                  <div>
                    <h2 className="text-[12.5px] font-extrabold text-[#22124D]">
                      Master Information
                    </h2>
                    <p className="mt-0.5 text-[9px] font-medium text-[#7F6EA6]">
                      Active equipment and operational reference records.
                    </p>
                  </div>
                </div>

                <Link
                  to="/inventory"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[9.5px] font-extrabold text-[#5d2ed7] transition hover:bg-[#F3EFFF]"
                >
                  Manage
                  <ArrowRight size={12} />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 xl:grid-cols-5">
                {modules.map((module) => {
                  const Icon = module.Icon;
                  const percentage =
                    module.total > 0
                      ? Math.round((module.count / module.total) * 100)
                      : 0;

                  return (
                    <button
                      type="button"
                      key={module.title}
                      onClick={() => navigate(module.path)}
                      className="group rounded-[16px] border border-[#E3D9FF] bg-[#FAF8FF] p-3.5 text-left transition hover:-translate-y-[1px] hover:border-[#D3C4FC] hover:bg-white hover:shadow-[0_8px_20px_rgba(93,46,215,0.08)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8DEFF] bg-[#F3EFFF] text-[#5d2ed7] transition group-hover:bg-[#EAE2FF]">
                          <Icon size={16} strokeWidth={2.05} />
                        </span>

                        <span className="text-[8px] font-extrabold text-[#7F6EA6]">
                          {percentage}%
                        </span>
                      </div>

                      <p className="mt-3 text-[11px] font-extrabold text-[#22124D]">
                        {module.title}
                      </p>
                      <p className="mt-0.5 truncate text-[8.5px] font-medium text-[#7F6EA6]">
                        {module.description}
                      </p>

                      <div className="mt-3 flex items-end justify-between">
                        <p className="text-[19px] font-black tracking-[-0.03em] text-[#22124D]">
                          {module.count}
                        </p>
                        <p className="text-[8.5px] font-bold text-[#A697C7]">
                          of {module.total}
                        </p>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EAE2FF]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#421E9F] to-[#5d2ed7]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Deal / payment mix */}
            <section className="overflow-hidden rounded-[21px] border border-[#E3D9FF] bg-white shadow-[0_8px_28px_rgba(93,46,215,0.045)]">
              <div className="flex items-center gap-3 border-b border-[#F3EFFF] px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EFFF] text-[#5d2ed7]">
                  <CreditCard size={17} />
                </span>

                <div>
                  <h2 className="text-[12.5px] font-extrabold text-[#22124D]">
                    Deal & Mode Mix
                  </h2>
                  <p className="mt-0.5 text-[9px] font-medium text-[#7F6EA6]">
                    Current rental mix across business and payment modes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-1">
                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7F6EA6]">
                      Deal Type
                    </p>
                    <span className="text-[8px] font-bold text-[#A697C7]">
                      {totalRentals} total
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {dealCards.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[13px] border border-[#E8DEFF] bg-[#FAF8FF] px-3.5 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-extrabold text-[#22124D]">
                              {item.label}
                            </p>
                            <p className="mt-0.5 text-[8px] font-medium text-[#7F6EA6]">
                              {item.value} rentals
                            </p>
                          </div>

                          <span className="text-[12px] font-black text-[#5d2ed7]">
                            {item.percent}%
                          </span>
                        </div>

                        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#EAE2FF]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#421E9F] to-[#5d2ed7]"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#F3EFFF] pt-4 sm:border-l sm:border-t-0 sm:pl-4 xl:border-l-0 xl:border-t xl:pl-0">
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7F6EA6]">
                      Billing Mode
                    </p>
                    <span className="text-[8px] font-bold text-[#A697C7]">
                      Prepaid / Postpaid
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {modeCards.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[13px] border border-[#E8DEFF] bg-[#FAF8FF] px-3.5 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-extrabold text-[#22124D]">
                              {item.label}
                            </p>
                            <p className="mt-0.5 text-[8px] font-medium text-[#7F6EA6]">
                              {item.value} rentals
                            </p>
                          </div>

                          <span
                            className={`text-[12px] font-black ${
                              item.label === "Prepaid"
                                ? "text-amber-600"
                                : "text-[#5d2ed7]"
                            }`}
                          >
                            {item.percent}%
                          </span>
                        </div>

                        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#EAE2FF]">
                          <div
                            className={`h-full rounded-full ${
                              item.label === "Prepaid"
                                ? "bg-gradient-to-r from-amber-400 to-amber-500"
                                : "bg-gradient-to-r from-[#421E9F] to-[#5d2ed7]"
                            }`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* =====================================================
              RECENT REQUISITIONS + NEEDS ATTENTION
          ====================================================== */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_0.85fr]">
            {/* Recent */}
            <section className="overflow-hidden rounded-[21px] border border-[#E3D9FF] bg-white shadow-[0_8px_28px_rgba(93,46,215,0.045)]">
              <div className="flex items-center justify-between gap-4 border-b border-[#F3EFFF] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EFFF] text-[#5d2ed7]">
                    <FileText size={17} />
                  </span>

                  <div>
                    <h2 className="text-[12.5px] font-extrabold text-[#22124D]">
                      Recent Requisitions
                    </h2>
                    <p className="mt-0.5 text-[9px] font-medium text-[#7F6EA6]">
                      Latest rental records across equipment operations.
                    </p>
                  </div>
                </div>

                <Link
                  to="/rental-master"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[9.5px] font-extrabold text-[#5d2ed7] transition hover:bg-[#F3EFFF]"
                >
                  View all
                  <ArrowRight size={12} />
                </Link>
              </div>

              {recentRentals.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EFFF] text-[#7F6EA6]">
                    <ClipboardList size={20} />
                  </span>
                  <p className="mt-3 text-[11px] font-extrabold text-[#22124D]">
                    No rentals yet
                  </p>
                  <p className="mt-1 text-[9px] font-medium text-[#A697C7]">
                    New requisitions will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#F3EFFF] bg-[#FAF8FF] text-[8.5px] font-extrabold uppercase tracking-[0.11em] text-[#7F6EA6]">
                        <th className="px-5 py-3">Patient</th>
                        <th className="px-5 py-3">Device</th>
                        <th className="px-5 py-3">Login Date</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Days</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#F3EFFF]">
                      {recentRentals.map((rental) => {
                        const days = daysBetween(
                          rental.login_date,
                          rental.login_out_date,
                        );
                        const isDue =
                          !rental.login_out_date &&
                          days >= 30;

                        return (
                          <tr
                            key={rental.rental_id}
                            onClick={() =>
                              navigate(`/rental-view/${rental.rental_id}`)
                            }
                            className={`group cursor-pointer transition ${
                              isDue
                                ? "bg-amber-50/[0.30] hover:bg-amber-50/60"
                                : "hover:bg-[#FAF8FF]"
                            }`}
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#F3EFFF] text-[#5d2ed7]">
                                  <UserRound size={14} />
                                </span>

                                <div className="min-w-0">
                                  <p className="max-w-[170px] truncate text-[10.5px] font-extrabold text-[#22124D]">
                                    {rental.patient_name || "—"}
                                  </p>
                                  <p className="mt-0.5 text-[8px] font-medium text-[#7F6EA6]">
                                    #{rental.rental_id} · {rental.deal_type || "—"} ·{" "}
                                    {rental.mode_type || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              <div className="flex max-w-[220px] items-center gap-2 text-[10px] font-bold text-[#5d2ed7]">
                                <Wrench size={12} className="shrink-0" />
                                <span className="truncate">
                                  {rental.device?.device_name || "—"}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              <div className="inline-flex items-center gap-1.5 whitespace-nowrap text-[9.5px] font-semibold text-[#553E82]">
                                <CalendarDays size={12} className="text-[#9C8AC7]" />
                                {formatDate(rental.login_date)}
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              <StatusPill status={rental.status} />
                            </td>

                            <td className="px-5 py-3.5 text-right">
                              <span
                                className={`inline-flex min-w-[40px] items-center justify-center rounded-lg px-2 py-1 text-[9.5px] font-extrabold ${
                                  isDue
                                    ? "border border-amber-200 bg-amber-50 text-amber-700"
                                    : "bg-[#F3EFFF] text-[#553E82]"
                                }`}
                              >
                                {days}d
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Needs attention */}
            <section className="overflow-hidden rounded-[21px] border border-amber-200 bg-white shadow-[0_8px_28px_rgba(93,46,215,0.045)]">
              <div className="flex items-center justify-between gap-4 border-b border-amber-100 bg-gradient-to-r from-amber-50/75 to-white px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600">
                    <AlertTriangle size={17} />
                  </span>

                  <div>
                    <h2 className="text-[12.5px] font-extrabold text-[#4E4A3D]">
                      Needs Attention
                    </h2>
                    <p className="mt-0.5 text-[9px] font-medium text-[#A09677]">
                      Rentals open for 25 days or more.
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full px-2 text-[9px] font-black ${
                    dueList.length > 0
                      ? "border border-amber-200 bg-amber-100 text-amber-700"
                      : "border border-[#E3D9FF] bg-[#F3EFFF] text-[#5d2ed7]"
                  }`}
                >
                  {dueList.length}
                </span>
              </div>

              {dueList.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EFFF] text-[#5d2ed7]">
                    <CheckCircle2 size={21} />
                  </span>
                  <p className="mt-3 text-[11px] font-extrabold text-[#22124D]">
                    Nothing overdue
                  </p>
                  <p className="mt-1 text-[9px] font-medium text-[#7F6EA6]">
                    No current rental requires duration attention.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#F1EFE8]">
                  {dueList.map((rental) => {
                    const days = daysBetween(rental.login_date);
                    const critical = days >= 30;

                    return (
                      <button
                        type="button"
                        key={rental.rental_id}
                        onClick={() =>
                          navigate(`/rental-view/${rental.rental_id}`)
                        }
                        className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-amber-50/[0.45]"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[10px] font-black ${
                            critical
                              ? "border border-rose-100 bg-rose-50 text-rose-600"
                              : "border border-amber-100 bg-amber-50 text-amber-700"
                          }`}
                        >
                          {days}d
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-[10.5px] font-extrabold text-[#22124D]">
                              {rental.patient_name || "Patient"}
                            </p>
                            {critical && (
                              <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wide text-rose-600">
                                Due
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 truncate text-[8.5px] font-medium text-[#7F6EA6]">
                            {rental.device?.device_name || "Device"} · since{" "}
                            {formatDate(rental.login_date)}
                          </p>
                        </div>

                        <ArrowRight
                          size={13}
                          className="shrink-0 translate-x-[-3px] text-[#9C8AC7] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-[#F3EFFF] bg-[#FAF8FF] px-5 py-3">
                <Link
                  to="/rental-master"
                  className="inline-flex items-center gap-1.5 text-[9.5px] font-extrabold text-[#5d2ed7] transition hover:underline"
                >
                  Open Rental Master
                  <ArrowRight size={12} />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}