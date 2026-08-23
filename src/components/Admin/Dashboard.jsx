// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import DashboardLayout from "../Admin/Layout";

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

//   const kpis = [
//     {
//       label: "Total Rentals",
//       value: totalRentals,
//       sub: "All time",
//       icon: "📋",
//       color: "from-[#0e4a67] to-[#155e82]",
//       shadow: "shadow-[#0e4a67]/20",
//     },
//     {
//       label: "Active / Running",
//       value: running,
//       sub: "In field",
//       icon: "🟢",
//       color: "from-emerald-600 to-emerald-500",
//       shadow: "shadow-emerald-500/20",
//     },
//     {
//       label: "Pending",
//       value: pending,
//       sub: "Awaiting deploy",
//       icon: "⏳",
//       color: "from-amber-500 to-amber-400",
//       shadow: "shadow-amber-500/20",
//     },
//     {
//       label: "Due Alert",
//       value: dueSoon,
//       sub: "≥ 25 days open",
//       icon: "⚠️",
//       color: "from-rose-500 to-rose-400",
//       shadow: "shadow-rose-500/20",
//     },
//   ];

//   const modules = [
//     {
//       title: "Devices",
//       count: activeDevices,
//       total: devices.length,
//       path: "/inventory", // adjust to your route
//       icon: "🖥️",
//       tint: "bg-sky-50 text-sky-700 border-sky-100",
//     },
//     {
//       title: "Accessories",
//       count: activeAccessories,
//       total: accessories.length,
//       path: "/inventory",
//       icon: "📦",
//       tint: "bg-violet-50 text-violet-700 border-violet-100",
//     },
//     {
//       title: "Care Centers",
//       count: activeCenters,
//       total: careCenters.length,
//       path: "/inventory",
//       icon: "🏥",
//       tint: "bg-teal-50 text-teal-700 border-teal-100",
//     },
//     {
//       title: "References",
//       count: activeRefs,
//       total: references.length,
//       path: "/inventory",
//       icon: "👨‍⚕️",
//       tint: "bg-indigo-50 text-indigo-700 border-indigo-100",
//     },
//     {
//       title: "Delivery Execs",
//       count: activeDelivery,
//       total: deliveryExecs.length,
//       path: "/inventory",
//       icon: "🚴",
//       tint: "bg-orange-50 text-orange-700 border-orange-100",
//     },
//   ];

//   const quickActions = [
//     {
//       label: "New Requisition",
//       path: "/rental-requisition",
//       icon: "➕",
//       primary: true,
//     },
//     {
//       label: "Rental Master",
//       path: "/rental-master",
//       icon: "📑",
//     },
//     {
//       label: "Inventory Ledger",
//       path: "/inventory",
//       icon: "📋",
//     },
//   ];

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//           <div className="w-10 h-10 border-[3px] border-t-transparent border-[#0e4a67] rounded-full animate-spin"></div>
//           <p className="text-sm font-medium text-slate-400">
//             Loading dashboard…
//           </p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-8">
//         {/* ========== HEADER ========== */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
//               Operations Dashboard
//             </h1>
//             <p className="text-slate-400 text-sm mt-0.5 font-medium">
//               Live overview of rentals, assets & logistics
//             </p>
//           </div>
//           <div className="flex flex-wrap items-center gap-2">
//             {quickActions.map((a) => (
//               <button
//                 key={a.path}
//                 onClick={() => navigate(a.path)}
//                 className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition active:scale-[0.98] ${
//                   a.primary
//                     ? "bg-[#0e4a67] hover:bg-[#125c80] text-white shadow-md shadow-[#0e4a67]/25"
//                     : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
//                 }`}
//               >
//                 <span>{a.icon}</span>
//                 {a.label}
//               </button>
//             ))}
//             <button
//               onClick={loadAll}
//               className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#0e4a67] hover:bg-slate-50 transition shadow-sm"
//               title="Refresh"
//             >
//               ↻
//             </button>
//           </div>
//         </div>

//         {/* ========== KPI CARDS ========== */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {kpis.map((k) => (
//             <div
//               key={k.label}
//               className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 group hover:shadow-md transition"
//             >
//               <div
//                 className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${k.color} opacity-[0.07] rounded-bl-[80px]`}
//               ></div>
//               <div className="flex items-start justify-between mb-3">
//                 <span className="text-2xl">{k.icon}</span>
//                 <span
//                   className={`text-[10px] font-bold uppercase tracking-wider text-slate-400`}
//                 >
//                   {k.sub}
//                 </span>
//               </div>
//               <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
//                 {k.value}
//               </p>
//               <p className="text-sm font-semibold text-slate-500 mt-1">
//                 {k.label}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* ========== MIDDLE ROW: Modules + Breakdown ========== */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//           {/* Inventory modules */}
//           <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
//             <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
//               <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
//                 Inventory Modules
//               </h2>
//               <Link
//                 to="/inventory"
//                 className="text-xs font-bold text-[#0e4a67] hover:underline"
//               >
//                 Manage →
//               </Link>
//             </div>
//             <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
//               {modules.map((m) => (
//                 <button
//                   key={m.title}
//                   onClick={() => navigate(m.path)}
//                   className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${m.tint} hover:scale-[1.02] active:scale-[0.98] transition text-center`}
//                 >
//                   <span className="text-2xl">{m.icon}</span>
//                   <span className="text-xs font-bold leading-tight">
//                     {m.title}
//                   </span>
//                   <span className="text-lg font-extrabold">{m.count}</span>
//                   <span className="text-[10px] opacity-70">
//                     of {m.total} total
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Deal / Mode breakdown */}
//           <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
//             <div className="px-5 py-4 border-b border-slate-100">
//               <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
//                 Deal & Mode Mix
//               </h2>
//             </div>
//             <div className="p-5 space-y-5">
//               {/* Deal */}
//               <div>
//                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
//                   Deal Type
//                 </p>
//                 <div className="space-y-2">
//                   {["B2B", "B2C"].map((key) => {
//                     const val = dealBreakdown[key] || 0;
//                     const pct =
//                       totalRentals > 0
//                         ? Math.round((val / totalRentals) * 100)
//                         : 0;
//                     return (
//                       <div key={key}>
//                         <div className="flex justify-between text-xs font-semibold mb-1">
//                           <span className="text-slate-600">{key}</span>
//                           <span className="text-slate-800">
//                             {val} · {pct}%
//                           </span>
//                         </div>
//                         <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
//                           <div
//                             className="h-full rounded-full bg-[#0e4a67] transition-all"
//                             style={{ width: `${pct}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//               {/* Mode */}
//               <div>
//                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
//                   Billing Mode
//                 </p>
//                 <div className="space-y-2">
//                   {["Prepaid", "Postpaid"].map((key) => {
//                     const val = modeBreakdown[key] || 0;
//                     const pct =
//                       totalRentals > 0
//                         ? Math.round((val / totalRentals) * 100)
//                         : 0;
//                     return (
//                       <div key={key}>
//                         <div className="flex justify-between text-xs font-semibold mb-1">
//                           <span className="text-slate-600">{key}</span>
//                           <span className="text-slate-800">
//                             {val} · {pct}%
//                           </span>
//                         </div>
//                         <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
//                           <div
//                             className={`h-full rounded-full transition-all ${
//                               key === "Prepaid"
//                                 ? "bg-amber-500"
//                                 : "bg-emerald-500"
//                             }`}
//                             style={{ width: `${pct}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//               {/* Returned */}
//               <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
//                 <span className="text-xs font-semibold text-slate-500">
//                   Returned / Closed
//                 </span>
//                 <span className="text-sm font-extrabold text-slate-800">
//                   {returned}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ========== BOTTOM ROW: Recent + Due ========== */}
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
//           {/* Recent rentals */}
//           <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
//             <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
//               <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
//                 Recent Requisitions
//               </h2>
//               <Link
//                 to="/rental-master"
//                 className="text-xs font-bold text-[#0e4a67] hover:underline"
//               >
//                 View all →
//               </Link>
//             </div>
//             {recentRentals.length === 0 ? (
//               <div className="py-16 text-center text-slate-400 text-sm">
//                 No rentals yet
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-50">
//                       <th className="px-5 py-3">Patient</th>
//                       <th className="px-5 py-3">Device</th>
//                       <th className="px-5 py-3">Login</th>
//                       <th className="px-5 py-3">Status</th>
//                       <th className="px-5 py-3 text-right">Days</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {recentRentals.map((r) => {
//                       const days = daysBetween(r.login_date, r.login_out_date);
//                       return (
//                         <tr
//                           key={r.rental_id}
//                           className="hover:bg-slate-50/70 transition cursor-pointer"
//                           onClick={() =>
//                             navigate(`/rental-view/${r.rental_id}`)
//                           }
//                         >
//                           <td className="px-5 py-3.5">
//                             <p className="text-sm font-bold text-slate-800 truncate max-w-[140px]">
//                               {r.patient_name || "—"}
//                             </p>
//                             <p className="text-[11px] text-slate-400 font-medium">
//                               {r.deal_type || "—"} · {r.mode_type || "—"}
//                             </p>
//                           </td>
//                           <td className="px-5 py-3.5 text-sm font-semibold text-[#0e4a67]">
//                             {r.device?.device_name || "—"}
//                           </td>
//                           <td className="px-5 py-3.5 text-xs font-medium text-slate-500 whitespace-nowrap">
//                             {formatDate(r.login_date)}
//                           </td>
//                           <td className="px-5 py-3.5">
//                             <StatusPill status={r.status} />
//                           </td>
//                           <td className="px-5 py-3.5 text-right">
//                             <span
//                               className={`text-sm font-bold ${
//                                 !r.login_out_date && days >= 30
//                                   ? "text-amber-600"
//                                   : "text-slate-700"
//                               }`}
//                             >
//                               {days}
//                               {!r.login_out_date && days >= 30 ? " ⚠" : ""}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Due / Attention list */}
//           <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
//             <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 to-white">
//               <div className="flex items-center gap-2">
//                 <span className="text-base">⚠️</span>
//                 <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
//                   Needs Attention
//                 </h2>
//               </div>
//               {dueList.length > 0 && (
//                 <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
//                   {dueList.length}
//                 </span>
//               )}
//             </div>
//             {dueList.length === 0 ? (
//               <div className="py-14 text-center">
//                 <p className="text-2xl mb-2 opacity-50">✅</p>
//                 <p className="text-sm text-slate-400 font-medium">
//                   Nothing overdue
//                 </p>
//               </div>
//             ) : (
//               <ul className="divide-y divide-slate-50">
//                 {dueList.map((r) => {
//                   const days = daysBetween(r.login_date);
//                   return (
//                     <li
//                       key={r.rental_id}
//                       onClick={() => navigate(`/rental-view/${r.rental_id}`)}
//                       className="px-5 py-3.5 hover:bg-amber-50/40 cursor-pointer transition flex items-center gap-3"
//                     >
//                       <div
//                         className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold ${
//                           days >= 30
//                             ? "bg-rose-100 text-rose-700"
//                             : "bg-amber-100 text-amber-700"
//                         }`}
//                       >
//                         {days}d
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <p className="text-sm font-bold text-slate-800 truncate">
//                           {r.patient_name || "Patient"}
//                         </p>
//                         <p className="text-[11px] text-slate-400 truncate">
//                           {r.device?.device_name || "Device"} · since{" "}
//                           {formatDate(r.login_date)}
//                         </p>
//                       </div>
//                       <StatusPill status={r.status} />
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//             <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
//               <Link
//                 to="/rental-master"
//                 className="text-xs font-bold text-[#0e4a67] hover:underline"
//               >
//                 Open Rental Master →
//               </Link>
//             </div>
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
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
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
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
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
      tone: "emerald",
    },
    {
      label: "Active / Running",
      value: running,
      helper: "Currently in field",
      Icon: Activity,
      tone: "green",
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
      case "green":
        return {
          icon: "bg-[#EAF7F0] text-[#087A57] border-[#D6ECE2]",
          dot: "bg-emerald-500",
          accent: "from-[#0A9668]/10 to-transparent",
        };
      default:
        return {
          icon: "bg-[#EDF8F3] text-[#087A57] border-[#D8EEE4]",
          dot: "bg-[#0A9668]",
          accent: "from-[#087A57]/10 to-transparent",
        };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[72vh] items-center justify-center bg-[#F5F9F7] px-4">
          <div className="w-full max-w-sm rounded-[24px] border border-[#E1ECE7] bg-white p-8 text-center shadow-[0_18px_45px_rgba(24,82,61,0.09)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7F0] text-[#087A57]">
              <RefreshCw size={23} className="animate-spin" />
            </div>
            <h3 className="mt-4 text-[15px] font-extrabold text-[#28463A]">
              Loading Operations Dashboard
            </h3>
            <p className="mt-1.5 text-[10.5px] font-medium leading-5 text-[#8B9C94]">
              Synchronizing rentals, equipment, care centers and operational master data.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F9F7]">
        <div className="mx-auto w-full max-w-[1540px] space-y-4 px-3 py-4 sm:px-5 lg:px-6">
          {/* =====================================================
              PREMIUM OPERATIONS HEADER
          ====================================================== */}
          <section className="relative overflow-hidden rounded-[26px] border border-[#DCEAE4] bg-gradient-to-br from-[#075F46] via-[#087252] to-[#086B4E] text-white shadow-[0_18px_46px_rgba(7,95,70,0.16)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/[0.07]" />
              <div className="absolute right-10 top-4 h-52 w-52 rounded-full border border-white/[0.05]" />
              <div className="absolute -bottom-36 left-[24%] h-72 w-72 rounded-full bg-[#66E2AC]/10 blur-3xl" />
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
                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-[17px] border border-white/[0.10] bg-white/[0.10] text-[#A7F1D0] shadow-inner backdrop-blur sm:flex">
                  <HeartPulse size={27} strokeWidth={2.05} />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.08] px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-[0.13em] text-emerald-50/80">
                      <ShieldCheck size={10} />
                      ODCom Operations
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/10 bg-[#8BF0C3]/10 px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-[0.1em] text-[#A5F1D0]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-40" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      </span>
                      Live System
                    </span>
                  </div>

                  <h1 className="text-[24px] font-black tracking-[-0.035em] text-white sm:text-[30px]">
                    Operations Dashboard
                  </h1>

                  <p className="mt-1.5 max-w-[680px] text-[11.5px] font-medium leading-5 text-emerald-50/60">
                    Medical equipment rental, inventory and logistics overview for daily ODCom operations.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={loadAll}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.08] text-emerald-50/75 transition hover:bg-white/[0.14] hover:text-white"
                  title="Refresh dashboard data"
                  aria-label="Refresh dashboard data"
                >
                  <RefreshCw size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/rental-master")}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.08] px-4 text-[10.5px] font-extrabold text-white transition hover:bg-white/[0.14]"
                >
                  <Layers3 size={15} />
                  Rental Master
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/rental-requisition")}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#8BF0C3] px-4.5 text-[10.5px] font-black text-[#07543E] shadow-[0_9px_24px_rgba(41,209,141,0.20)] transition hover:-translate-y-[1px] hover:bg-[#A0F2CE] active:translate-y-0"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  New Requisition
                </button>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 border-t border-white/[0.08] bg-black/[0.05] sm:grid-cols-4">
              <div className="border-r border-white/[0.07] px-5 py-3.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-emerald-50/40">
                  Active Master Data
                </p>
                <p className="mt-1 text-[13px] font-extrabold text-white">
                  {totalActiveMasterRecords}
                  <span className="ml-1 text-[9px] font-semibold text-emerald-50/40">
                    / {totalMasterRecords}
                  </span>
                </p>
              </div>

              <div className="border-r border-white/[0.07] px-5 py-3.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-emerald-50/40">
                  Master Availability
                </p>
                <p className="mt-1 text-[13px] font-extrabold text-[#A5F1D0]">
                  {masterAvailability}%
                </p>
              </div>

              <div className="border-r border-white/[0.07] px-5 py-3.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-emerald-50/40">
                  Returned / Closed
                </p>
                <p className="mt-1 text-[13px] font-extrabold text-white">
                  {returned}
                </p>
              </div>

              <div className="px-5 py-3.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.11em] text-emerald-50/40">
                  Needs Attention
                </p>
                <p className={`mt-1 text-[13px] font-extrabold ${dueSoon > 0 ? "text-amber-200" : "text-[#A5F1D0]"}`}>
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
                  className="group relative overflow-hidden rounded-[20px] border border-[#DDE9E4] bg-white p-4 text-left shadow-[0_7px_24px_rgba(29,91,68,0.04)] transition hover:-translate-y-[1px] hover:border-[#C8DED4] hover:shadow-[0_12px_30px_rgba(29,91,68,0.08)] sm:p-5"
                >
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${tone.accent}`} />

                  <div className="relative flex items-start justify-between gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-[12px] border ${tone.icon}`}>
                      <Icon size={18} strokeWidth={2.1} />
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4ECE8] bg-[#F8FAF9] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#85978F]">
                      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                      {item.helper}
                    </span>
                  </div>

                  <div className="relative mt-5">
                    <p className="text-[28px] font-black tracking-[-0.045em] text-[#1F3D32] sm:text-[32px]">
                      {item.value}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="text-[10.5px] font-extrabold text-[#536D62]">
                        {item.label}
                      </p>
                      <ArrowRight
                        size={13}
                        className="translate-x-[-3px] text-[#9AABA3] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
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
            <section className="overflow-hidden rounded-[21px] border border-[#DDE9E4] bg-white shadow-[0_8px_28px_rgba(29,91,68,0.045)]">
              <div className="flex items-center justify-between gap-4 border-b border-[#EBF2EE] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF8F3] text-[#087A57]">
                    <Box size={17} />
                  </span>

                  <div>
                    <h2 className="text-[12.5px] font-extrabold text-[#304E42]">
                      Master Information
                    </h2>
                    <p className="mt-0.5 text-[9px] font-medium text-[#98A79F]">
                      Active equipment and operational reference records.
                    </p>
                  </div>
                </div>

                <Link
                  to="/inventory"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[9.5px] font-extrabold text-[#087A57] transition hover:bg-[#EFF8F4]"
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
                      className="group rounded-[16px] border border-[#E3ECE8] bg-[#FBFDFC] p-3.5 text-left transition hover:-translate-y-[1px] hover:border-[#CDE1D8] hover:bg-white hover:shadow-[0_8px_20px_rgba(29,91,68,0.07)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCEDE5] bg-[#EEF8F3] text-[#087A57] transition group-hover:bg-[#E7F5EE]">
                          <Icon size={16} strokeWidth={2.05} />
                        </span>

                        <span className="text-[8px] font-extrabold text-[#95A59E]">
                          {percentage}%
                        </span>
                      </div>

                      <p className="mt-3 text-[11px] font-extrabold text-[#405D52]">
                        {module.title}
                      </p>
                      <p className="mt-0.5 truncate text-[8.5px] font-medium text-[#99A8A1]">
                        {module.description}
                      </p>

                      <div className="mt-3 flex items-end justify-between">
                        <p className="text-[19px] font-black tracking-[-0.03em] text-[#28483B]">
                          {module.count}
                        </p>
                        <p className="text-[8.5px] font-bold text-[#9AA9A2]">
                          of {module.total}
                        </p>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EAF0ED]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#087A57] to-[#31B77E]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Deal / payment mix */}
            <section className="overflow-hidden rounded-[21px] border border-[#DDE9E4] bg-white shadow-[0_8px_28px_rgba(29,91,68,0.045)]">
              <div className="flex items-center gap-3 border-b border-[#EBF2EE] px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF8F3] text-[#087A57]">
                  <CreditCard size={17} />
                </span>

                <div>
                  <h2 className="text-[12.5px] font-extrabold text-[#304E42]">
                    Deal & Mode Mix
                  </h2>
                  <p className="mt-0.5 text-[9px] font-medium text-[#98A79F]">
                    Current rental mix across business and payment modes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-1">
                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#82968D]">
                      Deal Type
                    </p>
                    <span className="text-[8px] font-bold text-[#A0AEA8]">
                      {totalRentals} total
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {dealCards.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[13px] border border-[#E6EEE9] bg-[#FBFDFC] px-3.5 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-extrabold text-[#435F54]">
                              {item.label}
                            </p>
                            <p className="mt-0.5 text-[8px] font-medium text-[#9BA9A3]">
                              {item.value} rentals
                            </p>
                          </div>

                          <span className="text-[12px] font-black text-[#087A57]">
                            {item.percent}%
                          </span>
                        </div>

                        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#EAF0ED]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#087A57] to-[#31B77E]"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#EDF2EF] pt-4 sm:border-l sm:border-t-0 sm:pl-4 xl:border-l-0 xl:border-t xl:pl-0">
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#82968D]">
                      Billing Mode
                    </p>
                    <span className="text-[8px] font-bold text-[#A0AEA8]">
                      Prepaid / Postpaid
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {modeCards.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[13px] border border-[#E6EEE9] bg-[#FBFDFC] px-3.5 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-extrabold text-[#435F54]">
                              {item.label}
                            </p>
                            <p className="mt-0.5 text-[8px] font-medium text-[#9BA9A3]">
                              {item.value} rentals
                            </p>
                          </div>

                          <span
                            className={`text-[12px] font-black ${
                              item.label === "Prepaid"
                                ? "text-amber-600"
                                : "text-[#087A57]"
                            }`}
                          >
                            {item.percent}%
                          </span>
                        </div>

                        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#EAF0ED]">
                          <div
                            className={`h-full rounded-full ${
                              item.label === "Prepaid"
                                ? "bg-gradient-to-r from-amber-400 to-amber-500"
                                : "bg-gradient-to-r from-[#087A57] to-[#31B77E]"
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
            <section className="overflow-hidden rounded-[21px] border border-[#DDE9E4] bg-white shadow-[0_8px_28px_rgba(29,91,68,0.045)]">
              <div className="flex items-center justify-between gap-4 border-b border-[#EBF2EE] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF8F3] text-[#087A57]">
                    <FileText size={17} />
                  </span>

                  <div>
                    <h2 className="text-[12.5px] font-extrabold text-[#304E42]">
                      Recent Requisitions
                    </h2>
                    <p className="mt-0.5 text-[9px] font-medium text-[#98A79F]">
                      Latest rental records across equipment operations.
                    </p>
                  </div>
                </div>

                <Link
                  to="/rental-master"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[9.5px] font-extrabold text-[#087A57] transition hover:bg-[#EFF8F4]"
                >
                  View all
                  <ArrowRight size={12} />
                </Link>
              </div>

              {recentRentals.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F8F5] text-[#8CA096]">
                    <ClipboardList size={20} />
                  </span>
                  <p className="mt-3 text-[11px] font-extrabold text-[#526A60]">
                    No rentals yet
                  </p>
                  <p className="mt-1 text-[9px] font-medium text-[#A0AEA7]">
                    New requisitions will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#EBF2EE] bg-[#F9FBFA] text-[8.5px] font-extrabold uppercase tracking-[0.11em] text-[#879A91]">
                        <th className="px-5 py-3">Patient</th>
                        <th className="px-5 py-3">Device</th>
                        <th className="px-5 py-3">Login Date</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Days</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#EEF3F0]">
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
                                ? "bg-amber-50/[0.20] hover:bg-amber-50/55"
                                : "hover:bg-[#F9FBFA]"
                            }`}
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#F1F6F3] text-[#7C9288]">
                                  <UserRound size={14} />
                                </span>

                                <div className="min-w-0">
                                  <p className="max-w-[170px] truncate text-[10.5px] font-extrabold text-[#3A554A]">
                                    {rental.patient_name || "—"}
                                  </p>
                                  <p className="mt-0.5 text-[8px] font-medium text-[#9BA9A3]">
                                    #{rental.rental_id} · {rental.deal_type || "—"} ·{" "}
                                    {rental.mode_type || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              <div className="flex max-w-[220px] items-center gap-2 text-[10px] font-bold text-[#087A57]">
                                <Wrench size={12} className="shrink-0" />
                                <span className="truncate">
                                  {rental.device?.device_name || "—"}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              <div className="inline-flex items-center gap-1.5 whitespace-nowrap text-[9.5px] font-semibold text-[#687E74]">
                                <CalendarDays size={12} className="text-[#94A69E]" />
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
                                    : "bg-[#F3F7F5] text-[#61766D]"
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
            <section className="overflow-hidden rounded-[21px] border border-[#E6E2D5] bg-white shadow-[0_8px_28px_rgba(29,91,68,0.045)]">
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
                      : "border border-emerald-100 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {dueList.length}
                </span>
              </div>

              {dueList.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={21} />
                  </span>
                  <p className="mt-3 text-[11px] font-extrabold text-[#526A60]">
                    Nothing overdue
                  </p>
                  <p className="mt-1 text-[9px] font-medium text-[#A0AEA7]">
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
                            <p className="truncate text-[10.5px] font-extrabold text-[#4C554E]">
                              {rental.patient_name || "Patient"}
                            </p>
                            {critical && (
                              <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wide text-rose-600">
                                Due
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 truncate text-[8.5px] font-medium text-[#9B9A8B]">
                            {rental.device?.device_name || "Device"} · since{" "}
                            {formatDate(rental.login_date)}
                          </p>
                        </div>

                        <ArrowRight
                          size={13}
                          className="shrink-0 translate-x-[-3px] text-[#B8B39D] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-[#EFEDE6] bg-[#FCFCFA] px-5 py-3">
                <Link
                  to="/rental-master"
                  className="inline-flex items-center gap-1.5 text-[9.5px] font-extrabold text-[#806F39] transition hover:text-amber-700"
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