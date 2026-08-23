// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Bell,
//   ChevronDown,
//   LogOut,
//   User,
//   Mail,
//   Shield,
//   X,
//   AlertTriangle,
//   Clock,
//   Package,
//   CheckCircle2,
// } from "lucide-react";

// const API_BASE = import.meta.env.VITE_API_BASE_URL;

// // —— helpers ——
// const decodeToken = (token) => {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       window
//         .atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join(""),
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error("Failed to decode token:", error);
//     return null;
//   }
// };

// const daysBetween = (from, to = new Date()) => {
//   if (!from) return 0;
//   const start = new Date(from);
//   const end = to instanceof Date ? to : new Date(to);
//   return Math.max(
//     0,
//     Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)),
//   );
// };

// const formatRelative = (dateStr) => {
//   if (!dateStr) return "";
//   const d = new Date(dateStr);
//   if (isNaN(d)) return "";
//   const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
//   if (diff === 0) return "Today";
//   if (diff === 1) return "Yesterday";
//   if (diff < 7) return `${diff}d ago`;
//   return d.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//   });
// };

// const Header = ({ title = "Dashboard Console" }) => {
//   const navigate = useNavigate();

//   const [profileOpen, setProfileOpen] = useState(false);
//   const [showProfilePanel, setShowProfilePanel] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [notifLoading, setNotifLoading] = useState(false);
//   const [readIds, setReadIds] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("notif_read_ids") || "[]");
//     } catch {
//       return [];
//     }
//   });

//   const [userData, setUserData] = useState({
//     name: "Admin",
//     email: "admin@system.com",
//     role: "admin",
//   });

//   const dropdownRef = useRef(null);
//   const notifRef = useRef(null);

//   // —— user from token / storage ——
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (token) {
//       const decoded = decodeToken(token);
//       if (storedUser) {
//         try {
//           setUserData(JSON.parse(storedUser));
//         } catch (err) {
//           console.error(err);
//         }
//       } else if (decoded) {
//         setUserData({
//           name: decoded.name || "Admin User",
//           email: decoded.email || "System User",
//           role: decoded.role || "admin",
//         });
//       }
//     }
//   }, []);

//   // —— click outside ——
//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setProfileOpen(false);
//       }
//       if (notifRef.current && !notifRef.current.contains(event.target)) {
//         setNotifOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   // Escape closes profile panel
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") {
//         setShowProfilePanel(false);
//         setNotifOpen(false);
//         setProfileOpen(false);
//       }
//     };
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, []);

//   // —— build notifications from rentals API ——
//   const fetchNotifications = useCallback(async () => {
//     setNotifLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE}/api/rentals`, {
//         headers: {
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       });
//       if (!res.ok) {
//         setNotifications([]);
//         return;
//       }
//       const json = await res.json();
//       const rentals = Array.isArray(json) ? json : json?.data || [];

//       const items = [];

//       rentals.forEach((r) => {
//         const id = r.rental_id;
//         const patient = r.patient_name || "Patient";
//         const device = r.device?.device_name || "Device";
//         const status = (r.status || "Pending").toUpperCase();
//         const days = daysBetween(r.login_date, r.login_out_date || undefined);

//         // 1) Overdue / due (≥ 30 days, still open)
//         if (
//           !r.login_out_date &&
//           days >= 30 &&
//           ["PENDING", "DELIVERED", "RUNNING", "ACTIVE"].includes(status)
//         ) {
//           items.push({
//             id: `due-${id}`,
//             rentalId: id,
//             type: "due",
//             title: "Rental overdue",
//             message: `${patient} · ${device} · ${days} days open`,
//             time: r.login_date,
//             severity: "high",
//           });
//         }
//         // 2) Approaching due (25–29 days)
//         else if (
//           !r.login_out_date &&
//           days >= 25 &&
//           days < 30 &&
//           ["PENDING", "DELIVERED", "RUNNING", "ACTIVE"].includes(status)
//         ) {
//           items.push({
//             id: `warn-${id}`,
//             rentalId: id,
//             type: "warning",
//             title: "Approaching due",
//             message: `${patient} · ${device} · ${days} days`,
//             time: r.login_date,
//             severity: "medium",
//           });
//         }

//         // 3) Pending (not yet delivered)
//         if (status === "PENDING") {
//           items.push({
//             id: `pending-${id}`,
//             rentalId: id,
//             type: "pending",
//             title: "Pending deployment",
//             message: `${patient} · ${device}`,
//             time: r.record_date || r.login_date || r.created_at,
//             severity: "low",
//           });
//         }
//       });

//       // Sort: high severity first, then by days/recency
//       const severityOrder = { high: 0, medium: 1, low: 2 };
//       items.sort((a, b) => {
//         const s = severityOrder[a.severity] - severityOrder[b.severity];
//         if (s !== 0) return s;
//         return (b.rentalId || 0) - (a.rentalId || 0);
//       });

//       setNotifications(items.slice(0, 20));
//     } catch (err) {
//       console.error("Notifications fetch failed:", err);
//       setNotifications([]);
//     } finally {
//       setNotifLoading(false);
//     }
//   }, []);

//   // Load on mount + when opening panel
//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 5 * 60 * 1000); // every 5 min
//     return () => clearInterval(interval);
//   }, [fetchNotifications]);

//   useEffect(() => {
//     if (notifOpen) fetchNotifications();
//   }, [notifOpen, fetchNotifications]);

//   // Persist read ids
//   useEffect(() => {
//     localStorage.setItem("notif_read_ids", JSON.stringify(readIds));
//   }, [readIds]);

//   const unreadCount = notifications.filter(
//     (n) => !readIds.includes(n.id),
//   ).length;

//   const markAllRead = () => {
//     setReadIds((prev) => [
//       ...new Set([...prev, ...notifications.map((n) => n.id)]),
//     ]);
//   };

//   const markRead = (id) => {
//     setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
//   };

//   const handleNotifClick = (n) => {
//     markRead(n.id);
//     setNotifOpen(false);
//     if (n.rentalId) {
//       navigate(`/rental-view/${n.rentalId}`);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (token) {
//         const response = await fetch(`${API_BASE}/api/auth/logout`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Logout failed");
//       }
//     } catch (error) {
//       console.error("Logout Error:", error);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       navigate("/login", { replace: true });
//     }
//   };

//   const getInitials = (name) => {
//     if (!name) return "AD";
//     return name
//       .trim()
//       .split(" ")
//       .slice(0, 2)
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   };

//   const openProfile = () => {
//     setProfileOpen(false);
//     setShowProfilePanel(true);
//   };

//   const roleLabel =
//     (userData.role || "admin").charAt(0).toUpperCase() +
//     (userData.role || "admin").slice(1);

//   const typeIcon = (type) => {
//     switch (type) {
//       case "due":
//         return <AlertTriangle size={14} className="text-rose-600" />;
//       case "warning":
//         return <Clock size={14} className="text-amber-600" />;
//       case "pending":
//         return <Package size={14} className="text-sky-600" />;
//       default:
//         return <Bell size={14} className="text-slate-500" />;
//     }
//   };

//   const typeBg = (type) => {
//     switch (type) {
//       case "due":
//         return "bg-rose-50 border-rose-100";
//       case "warning":
//         return "bg-amber-50 border-amber-100";
//       case "pending":
//         return "bg-sky-50 border-sky-100";
//       default:
//         return "bg-slate-50 border-slate-100";
//     }
//   };

//   return (
//     <>
//       <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 fixed top-0 right-0 left-72 z-20 flex items-center justify-between px-8 shadow-[0_4px_30px_rgba(0,0,0,0.01)] select-none">
//         <div className="flex items-center gap-6">
//           <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
//             {title}
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           {/* ========== NOTIFICATIONS ========== */}
//           <div className="relative" ref={notifRef}>
//             <button
//               type="button"
//               onClick={() => {
//                 setNotifOpen((v) => !v);
//                 setProfileOpen(false);
//               }}
//               className="p-2.5 text-slate-400 hover:text-[#0e4a67] hover:bg-slate-50 rounded-xl transition-all relative outline-none focus-visible:ring-2 focus-visible:ring-[#0e4a67]/30"
//               aria-label="Notifications"
//             >
//               <Bell size={18} />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#0e4a67] text-white text-[10px] font-black ring-2 ring-white">
//                   {unreadCount > 9 ? "9+" : unreadCount}
//                 </span>
//               )}
//             </button>

//             {notifOpen && (
//               <div className="absolute right-0 mt-2.5 w-[360px] max-w-[calc(100vw-2rem)] bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
//                 {/* Header */}
//                 <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
//                   <div>
//                     <p className="text-sm font-extrabold text-slate-900">
//                       Notifications
//                     </p>
//                     <p className="text-[11px] text-slate-400 font-medium">
//                       {unreadCount > 0
//                         ? `${unreadCount} unread`
//                         : "All caught up"}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {unreadCount > 0 && (
//                       <button
//                         type="button"
//                         onClick={markAllRead}
//                         className="text-[11px] font-bold text-[#0e4a67] hover:underline flex items-center gap-1"
//                       >
//                         <CheckCircle2 size={12} />
//                         Mark all read
//                       </button>
//                     )}
//                     <button
//                       type="button"
//                       onClick={() => fetchNotifications()}
//                       className="text-[11px] font-bold text-slate-400 hover:text-[#0e4a67]"
//                       title="Refresh"
//                     >
//                       ↻
//                     </button>
//                   </div>
//                 </div>

//                 {/* List */}
//                 <div className="max-h-[380px] overflow-y-auto">
//                   {notifLoading && notifications.length === 0 ? (
//                     <div className="py-12 flex flex-col items-center gap-2 text-slate-400">
//                       <div className="w-6 h-6 border-2 border-t-transparent border-[#0e4a67] rounded-full animate-spin" />
//                       <p className="text-xs font-medium">Loading…</p>
//                     </div>
//                   ) : notifications.length === 0 ? (
//                     <div className="py-12 text-center">
//                       <p className="text-2xl mb-2 opacity-40">🔔</p>
//                       <p className="text-sm text-slate-400 font-medium">
//                         No alerts right now
//                       </p>
//                       <p className="text-[11px] text-slate-300 mt-1">
//                         Due & pending rentals will appear here
//                       </p>
//                     </div>
//                   ) : (
//                     <ul className="divide-y divide-slate-50">
//                       {notifications.map((n) => {
//                         const isRead = readIds.includes(n.id);
//                         return (
//                           <li key={n.id}>
//                             <button
//                               type="button"
//                               onClick={() => handleNotifClick(n)}
//                               className={`w-full text-left px-4 py-3.5 flex gap-3 transition hover:bg-slate-50/80 ${
//                                 isRead ? "opacity-70" : "bg-white"
//                               }`}
//                             >
//                               <span
//                                 className={`mt-0.5 w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${typeBg(
//                                   n.type,
//                                 )}`}
//                               >
//                                 {typeIcon(n.type)}
//                               </span>
//                               <div className="min-w-0 flex-1">
//                                 <div className="flex items-start justify-between gap-2">
//                                   <p
//                                     className={`text-xs font-bold leading-snug ${
//                                       isRead
//                                         ? "text-slate-600"
//                                         : "text-slate-900"
//                                     }`}
//                                   >
//                                     {n.title}
//                                   </p>
//                                   {!isRead && (
//                                     <span className="mt-1 w-2 h-2 rounded-full bg-[#0e4a67] shrink-0" />
//                                   )}
//                                 </div>
//                                 <p className="text-[11px] text-slate-500 mt-0.5 truncate">
//                                   {n.message}
//                                 </p>
//                                 <p className="text-[10px] text-slate-400 mt-1 font-medium">
//                                   {formatRelative(n.time)}
//                                 </p>
//                               </div>
//                             </button>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setNotifOpen(false);
//                       navigate("/rental-master");
//                     }}
//                     className="w-full text-center text-xs font-bold text-[#0e4a67] hover:underline py-1"
//                   >
//                     Open Rental Master →
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="w-px h-8 bg-slate-200/60 mx-1" />

//           {/* ========== PROFILE ========== */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               type="button"
//               onClick={() => {
//                 setProfileOpen(!profileOpen);
//                 setNotifOpen(false);
//               }}
//               className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0e4a67]/30"
//             >
//               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0e4a67] to-[#155e82] flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-[#0e4a67]/25 uppercase">
//                 {getInitials(userData.name)}
//               </div>

//               <div className="hidden xl:block">
//                 <p className="text-xs font-black text-slate-800 leading-tight capitalize">
//                   {userData.name}
//                 </p>
//                 <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
//                   {userData.role} Terminal
//                 </p>
//               </div>

//               <ChevronDown
//                 size={14}
//                 className={`text-slate-400 hidden xl:block transition-transform duration-200 ${
//                   profileOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {profileOpen && (
//               <div className="absolute right-0 mt-2.5 w-72 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.1)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
//                 <div className="px-4 pt-4 pb-3 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
//                   <div className="flex items-center gap-3">
//                     <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0e4a67] to-[#155e82] flex items-center justify-center font-black text-white text-sm tracking-wider shadow-md shadow-[#0e4a67]/20 uppercase shrink-0">
//                       {getInitials(userData.name)}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <p className="text-sm font-black text-slate-900 capitalize truncate">
//                         {userData.name}
//                       </p>
//                       <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
//                         {userData.email}
//                       </p>
//                       <span className="inline-flex mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#0e4a67]/10 text-[#0e4a67] border border-[#0e4a67]/15">
//                         {roleLabel}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-2 space-y-1">
//                   <button
//                     type="button"
//                     onClick={openProfile}
//                     className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all group"
//                   >
//                     <span className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0e4a67]/10 flex items-center justify-center text-slate-500 group-hover:text-[#0e4a67] transition">
//                       <User size={15} />
//                     </span>
//                     <span className="flex-1 text-left">View Profile</span>
//                   </button>

//                   <button
//                     type="button"
//                     onClick={handleLogout}
//                     className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition-all group"
//                   >
//                     <span className="w-8 h-8 rounded-lg bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center transition">
//                       <LogOut size={15} />
//                     </span>
//                     <span className="flex-1 text-left">Disconnect Session</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* ========== PROFILE SLIDE-OVER ========== */}
//       {showProfilePanel && (
//         <div className="fixed inset-0 z-[60] flex justify-end">
//           <div
//             className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
//             onClick={() => setShowProfilePanel(false)}
//           />
//           <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
//             <div className="relative bg-gradient-to-br from-[#0e4a67] to-[#155e82] px-6 pt-6 pb-16">
//               <div className="flex items-center justify-between">
//                 <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
//                   Account Profile
//                 </p>
//                 <button
//                   type="button"
//                   onClick={() => setShowProfilePanel(false)}
//                   className="w-8 h-8 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
//                   aria-label="Close"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//             </div>

//             <div className="px-6 -mt-10 relative z-10">
//               <div className="flex items-end gap-4">
//                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0e4a67] to-[#155e82] flex items-center justify-center font-black text-white text-2xl tracking-wider shadow-xl shadow-[#0e4a67]/30 border-4 border-white uppercase">
//                   {getInitials(userData.name)}
//                 </div>
//                 <div className="pb-1 min-w-0 flex-1">
//                   <h2 className="text-lg font-extrabold text-slate-900 capitalize truncate">
//                     {userData.name}
//                   </h2>
//                   <span className="inline-flex mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
//                     Active · {roleLabel}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
//               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
//                 Profile details
//               </p>
//               <div className="space-y-3">
//                 <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
//                   <span className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0e4a67] shrink-0">
//                     <User size={16} />
//                   </span>
//                   <div className="min-w-0">
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                       Full name
//                     </p>
//                     <p className="text-sm font-bold text-slate-800 capitalize mt-0.5 truncate">
//                       {userData.name || "—"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
//                   <span className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0e4a67] shrink-0">
//                     <Mail size={16} />
//                   </span>
//                   <div className="min-w-0">
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                       Email address
//                     </p>
//                     <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">
//                       {userData.email || "—"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
//                   <span className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0e4a67] shrink-0">
//                     <Shield size={16} />
//                   </span>
//                   <div className="min-w-0">
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                       Access role
//                     </p>
//                     <p className="text-sm font-bold text-slate-800 capitalize mt-0.5">
//                       {roleLabel} Terminal
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-2 p-4 rounded-xl border border-dashed border-slate-200 bg-white">
//                 <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
//                   You are signed in with an active admin session. Use disconnect
//                   to end this terminal securely.
//                 </p>
//               </div>
//             </div>

//             <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex gap-3">
//               <button
//                 type="button"
//                 onClick={() => setShowProfilePanel(false)}
//                 className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 transition"
//               >
//                 Close
//               </button>
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-sm shadow-rose-600/25 transition flex items-center justify-center gap-2"
//               >
//                 <LogOut size={15} />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Header;




// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Bell,
//   ChevronDown,
//   LogOut,
//   User,
//   Mail,
//   Shield,
//   X,
//   AlertTriangle,
//   Clock,
//   Package,
//   CheckCircle2,
// } from "lucide-react";

// const API_BASE = import.meta.env.VITE_API_BASE_URL;

// // —— helpers ——
// const decodeToken = (token) => {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       window
//         .atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join(""),
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error("Failed to decode token:", error);
//     return null;
//   }
// };

// const daysBetween = (from, to = new Date()) => {
//   if (!from) return 0;
//   const start = new Date(from);
//   const end = to instanceof Date ? to : new Date(to);
//   return Math.max(
//     0,
//     Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)),
//   );
// };

// const formatRelative = (dateStr) => {
//   if (!dateStr) return "";
//   const d = new Date(dateStr);
//   if (isNaN(d)) return "";
//   const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
//   if (diff === 0) return "Today";
//   if (diff === 1) return "Yesterday";
//   if (diff < 7) return `${diff}d ago`;
//   return d.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//   });
// };

// const Header = ({ title = "Dashboard Console" }) => {
//   const navigate = useNavigate();

//   const [profileOpen, setProfileOpen] = useState(false);
//   const [showProfilePanel, setShowProfilePanel] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [notifLoading, setNotifLoading] = useState(false);
//   const [readIds, setReadIds] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("notif_read_ids") || "[]");
//     } catch {
//       return [];
//     }
//   });

//   const [userData, setUserData] = useState({
//     name: "Admin",
//     email: "admin@system.com",
//     role: "admin",
//   });

//   const dropdownRef = useRef(null);
//   const notifRef = useRef(null);

//   // —— user from token / storage ——
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (token) {
//       const decoded = decodeToken(token);
//       if (storedUser) {
//         try {
//           setUserData(JSON.parse(storedUser));
//         } catch (err) {
//           console.error(err);
//         }
//       } else if (decoded) {
//         setUserData({
//           name: decoded.name || "Admin User",
//           email: decoded.email || "System User",
//           role: decoded.role || "admin",
//         });
//       }
//     }
//   }, []);

//   // —— click outside ——
//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setProfileOpen(false);
//       }
//       if (notifRef.current && !notifRef.current.contains(event.target)) {
//         setNotifOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   // Escape closes profile panel
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") {
//         setShowProfilePanel(false);
//         setNotifOpen(false);
//         setProfileOpen(false);
//       }
//     };
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, []);

//   // —— build notifications from rentals API ——
//   const fetchNotifications = useCallback(async () => {
//     setNotifLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE}/api/rentals`, {
//         headers: {
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       });
//       if (!res.ok) {
//         setNotifications([]);
//         return;
//       }
//       const json = await res.json();
//       const rentals = Array.isArray(json) ? json : json?.data || [];

//       const items = [];

//       rentals.forEach((r) => {
//         const id = r.rental_id;
//         const patient = r.patient_name || "Patient";
//         const device = r.device?.device_name || "Device";
//         const status = (r.status || "Pending").toUpperCase();
//         const days = daysBetween(r.login_date, r.login_out_date || undefined);

//         // 1) Overdue / due (≥ 30 days, still open)
//         if (
//           !r.login_out_date &&
//           days >= 30 &&
//           ["PENDING", "DELIVERED", "RUNNING", "ACTIVE"].includes(status)
//         ) {
//           items.push({
//             id: `due-${id}`,
//             rentalId: id,
//             type: "due",
//             title: "Rental overdue",
//             message: `${patient} · ${device} · ${days} days open`,
//             time: r.login_date,
//             severity: "high",
//           });
//         }
//         // 2) Approaching due (25–29 days)
//         else if (
//           !r.login_out_date &&
//           days >= 25 &&
//           days < 30 &&
//           ["PENDING", "DELIVERED", "RUNNING", "ACTIVE"].includes(status)
//         ) {
//           items.push({
//             id: `warn-${id}`,
//             rentalId: id,
//             type: "warning",
//             title: "Approaching due",
//             message: `${patient} · ${device} · ${days} days`,
//             time: r.login_date,
//             severity: "medium",
//           });
//         }

//         // 3) Pending (not yet delivered)
//         if (status === "PENDING") {
//           items.push({
//             id: `pending-${id}`,
//             rentalId: id,
//             type: "pending",
//             title: "Pending deployment",
//             message: `${patient} · ${device}`,
//             time: r.record_date || r.login_date || r.created_at,
//             severity: "low",
//           });
//         }
//       });

//       // Sort: high severity first, then by days/recency
//       const severityOrder = { high: 0, medium: 1, low: 2 };
//       items.sort((a, b) => {
//         const s = severityOrder[a.severity] - severityOrder[b.severity];
//         if (s !== 0) return s;
//         return (b.rentalId || 0) - (a.rentalId || 0);
//       });

//       setNotifications(items.slice(0, 20));
//     } catch (err) {
//       console.error("Notifications fetch failed:", err);
//       setNotifications([]);
//     } finally {
//       setNotifLoading(false);
//     }
//   }, []);

//   // Load on mount + when opening panel
//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 5 * 60 * 1000); // every 5 min
//     return () => clearInterval(interval);
//   }, [fetchNotifications]);

//   useEffect(() => {
//     if (notifOpen) fetchNotifications();
//   }, [notifOpen, fetchNotifications]);

//   // Persist read ids
//   useEffect(() => {
//     localStorage.setItem("notif_read_ids", JSON.stringify(readIds));
//   }, [readIds]);

//   const unreadCount = notifications.filter(
//     (n) => !readIds.includes(n.id),
//   ).length;

//   const markAllRead = () => {
//     setReadIds((prev) => [
//       ...new Set([...prev, ...notifications.map((n) => n.id)]),
//     ]);
//   };

//   const markRead = (id) => {
//     setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
//   };

//   const handleNotifClick = (n) => {
//     markRead(n.id);
//     setNotifOpen(false);
//     if (n.rentalId) {
//       navigate(`/rental-view/${n.rentalId}`);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (token) {
//         const response = await fetch(`${API_BASE}/api/auth/logout`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Logout failed");
//       }
//     } catch (error) {
//       console.error("Logout Error:", error);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       navigate("/login", { replace: true });
//     }
//   };

//   const getInitials = (name) => {
//     if (!name) return "AD";
//     return name
//       .trim()
//       .split(" ")
//       .slice(0, 2)
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   };

//   const openProfile = () => {
//     setProfileOpen(false);
//     setShowProfilePanel(true);
//   };

//   const roleLabel =
//     (userData.role || "admin").charAt(0).toUpperCase() +
//     (userData.role || "admin").slice(1);

//   const typeIcon = (type) => {
//     switch (type) {
//       case "due":
//         return <AlertTriangle size={14} className="text-rose-600" />;
//       case "warning":
//         return <Clock size={14} className="text-amber-600" />;
//       case "pending":
//         return <Package size={14} className="text-sky-600" />;
//       default:
//         return <Bell size={14} className="text-slate-500" />;
//     }
//   };

//   const typeBg = (type) => {
//     switch (type) {
//       case "due":
//         return "bg-rose-50 border-rose-100";
//       case "warning":
//         return "bg-amber-50 border-amber-100";
//       case "pending":
//         return "bg-sky-50 border-sky-100";
//       default:
//         return "bg-[#F5FAF7] border-emerald-100/70";
//     }
//   };

//   return (
//     <>
//       <header className="fixed top-0 right-0 left-[292px] z-20 flex h-20 select-none items-center justify-between border-b border-emerald-100/70 bg-white/90 px-8 shadow-[0_10px_35px_rgba(20,84,61,0.06)] backdrop-blur-xl">
//         <div className="flex items-center gap-4">
//           <div>
//             <div className="flex items-center gap-2.5">
//               <h1 className="text-[17px] font-black tracking-tight text-[#183A2F] uppercase">
//                 {title}
//               </h1>
//               <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-[#F0FAF5] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#087A57]">
//                 <span className="relative flex h-1.5 w-1.5">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
//                   <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                 </span>
//                 ODCom Operations
//               </span>
//             </div>
//             <p className="mt-1 hidden md:block text-[10px] font-semibold tracking-[0.05em] text-slate-400">
//               Medical Equipment Operations & Support
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           {/* ========== NOTIFICATIONS ========== */}
//           <div className="relative" ref={notifRef}>
//             <button
//               type="button"
//               onClick={() => {
//                 setNotifOpen((v) => !v);
//                 setProfileOpen(false);
//               }}
//               className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-all hover:border-emerald-100 hover:bg-[#F2FAF6] hover:text-[#087A57] outline-none focus-visible:ring-2 focus-visible:ring-[#087A57]/20"
//               aria-label="Notifications"
//             >
//               <Bell size={18} />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#087A57] text-white text-[10px] font-black ring-2 ring-white">
//                   {unreadCount > 9 ? "9+" : unreadCount}
//                 </span>
//               )}
//             </button>

//             {notifOpen && (
//               <div className="absolute right-0 mt-3 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[20px] border border-emerald-100/80 bg-white shadow-[0_24px_70px_rgba(20,84,61,0.16)] z-50 animate-in fade-in zoom-in-95 duration-150">
//                 {/* Header */}
//                 <div className="px-4 py-3 border-b border-emerald-100/70 flex items-center justify-between bg-[#F5FAF7]">
//                   <div>
//                     <p className="text-sm font-extrabold text-slate-900">
//                       Notifications
//                     </p>
//                     <p className="text-[11px] text-slate-400 font-medium">
//                       {unreadCount > 0
//                         ? `${unreadCount} unread`
//                         : "All caught up"}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {unreadCount > 0 && (
//                       <button
//                         type="button"
//                         onClick={markAllRead}
//                         className="text-[11px] font-bold text-[#087A57] hover:underline flex items-center gap-1"
//                       >
//                         <CheckCircle2 size={12} />
//                         Mark all read
//                       </button>
//                     )}
//                     <button
//                       type="button"
//                       onClick={() => fetchNotifications()}
//                       className="text-[11px] font-bold text-slate-400 hover:text-[#087A57]"
//                       title="Refresh"
//                     >
//                       ↻
//                     </button>
//                   </div>
//                 </div>

//                 {/* List */}
//                 <div className="max-h-[380px] overflow-y-auto">
//                   {notifLoading && notifications.length === 0 ? (
//                     <div className="py-12 flex flex-col items-center gap-2 text-slate-400">
//                       <div className="w-6 h-6 border-2 border-t-transparent border-[#087A57] rounded-full animate-spin" />
//                       <p className="text-xs font-medium">Loading…</p>
//                     </div>
//                   ) : notifications.length === 0 ? (
//                     <div className="py-12 text-center">
//                       <p className="text-2xl mb-2 opacity-40">🔔</p>
//                       <p className="text-sm text-slate-400 font-medium">
//                         No alerts right now
//                       </p>
//                       <p className="text-[11px] text-slate-300 mt-1">
//                         Due & pending rentals will appear here
//                       </p>
//                     </div>
//                   ) : (
//                     <ul className="divide-y divide-slate-50">
//                       {notifications.map((n) => {
//                         const isRead = readIds.includes(n.id);
//                         return (
//                           <li key={n.id}>
//                             <button
//                               type="button"
//                               onClick={() => handleNotifClick(n)}
//                               className={`w-full text-left px-4 py-3.5 flex gap-3 transition hover:bg-emerald-50/80 ${
//                                 isRead ? "opacity-70" : "bg-white"
//                               }`}
//                             >
//                               <span
//                                 className={`mt-0.5 w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${typeBg(
//                                   n.type,
//                                 )}`}
//                               >
//                                 {typeIcon(n.type)}
//                               </span>
//                               <div className="min-w-0 flex-1">
//                                 <div className="flex items-start justify-between gap-2">
//                                   <p
//                                     className={`text-xs font-bold leading-snug ${
//                                       isRead
//                                         ? "text-slate-600"
//                                         : "text-slate-900"
//                                     }`}
//                                   >
//                                     {n.title}
//                                   </p>
//                                   {!isRead && (
//                                     <span className="mt-1 w-2 h-2 rounded-full bg-[#087A57] shrink-0" />
//                                   )}
//                                 </div>
//                                 <p className="text-[11px] text-slate-500 mt-0.5 truncate">
//                                   {n.message}
//                                 </p>
//                                 <p className="text-[10px] text-slate-400 mt-1 font-medium">
//                                   {formatRelative(n.time)}
//                                 </p>
//                               </div>
//                             </button>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <div className="px-4 py-2.5 border-t border-emerald-100/70 bg-[#F7FBF9]">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setNotifOpen(false);
//                       navigate("/rental-master");
//                     }}
//                     className="w-full text-center text-xs font-bold text-[#087A57] hover:underline py-1"
//                   >
//                     Open Rental Master →
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="w-px h-8 bg-slate-200/60 mx-1" />

//           {/* ========== PROFILE ========== */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               type="button"
//               onClick={() => {
//                 setProfileOpen(!profileOpen);
//                 setNotifOpen(false);
//               }}
//               className="flex items-center gap-3 rounded-[14px] border border-transparent p-1.5 pr-2.5 text-left transition-all hover:border-emerald-100 hover:bg-[#F5FAF7] outline-none focus-visible:ring-2 focus-visible:ring-[#087A57]/20"
//             >
//               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#087A57] to-[#0A9668] flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-[#087A57]/25 uppercase">
//                 {getInitials(userData.name)}
//               </div>

//               <div className="hidden xl:block">
//                 <p className="text-xs font-black text-slate-800 leading-tight capitalize">
//                   {userData.name}
//                 </p>
//                 <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
//                   {userData.role} Terminal
//                 </p>
//               </div>

//               <ChevronDown
//                 size={14}
//                 className={`text-slate-400 hidden xl:block transition-transform duration-200 ${
//                   profileOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {profileOpen && (
//               <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-[20px] border border-emerald-100/80 bg-white shadow-[0_24px_65px_rgba(20,84,61,0.14)] z-50 animate-in fade-in zoom-in-95 duration-150">
//                 <div className="px-4 pt-4 pb-3 bg-gradient-to-br from-[#F4FAF7] to-white border-b border-emerald-100/70">
//                   <div className="flex items-center gap-3">
//                     <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#087A57] to-[#0A9668] flex items-center justify-center font-black text-white text-sm tracking-wider shadow-md shadow-[#087A57]/20 uppercase shrink-0">
//                       {getInitials(userData.name)}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <p className="text-sm font-black text-slate-900 capitalize truncate">
//                         {userData.name}
//                       </p>
//                       <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
//                         {userData.email}
//                       </p>
//                       <span className="inline-flex mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#087A57]/10 text-[#087A57] border border-[#087A57]/15">
//                         {roleLabel}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-2 space-y-1">
//                   <button
//                     type="button"
//                     onClick={openProfile}
//                     className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50/70 font-bold text-xs transition-all group"
//                   >
//                     <span className="w-8 h-8 rounded-lg bg-[#ECF6F1] group-hover:bg-[#087A57]/10 flex items-center justify-center text-slate-500 group-hover:text-[#087A57] transition">
//                       <User size={15} />
//                     </span>
//                     <span className="flex-1 text-left">View Profile</span>
//                   </button>

//                   <button
//                     type="button"
//                     onClick={handleLogout}
//                     className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition-all group"
//                   >
//                     <span className="w-8 h-8 rounded-lg bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center transition">
//                       <LogOut size={15} />
//                     </span>
//                     <span className="flex-1 text-left">Disconnect Session</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* ========== PROFILE SLIDE-OVER ========== */}
//       {showProfilePanel && (
//         <div className="fixed inset-0 z-[60] flex justify-end">
//           <div
//             className="absolute inset-0 bg-[#102E25]/45 backdrop-blur-[2px]"
//             onClick={() => setShowProfilePanel(false)}
//           />
//           <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-emerald-100/80 flex flex-col animate-in slide-in-from-right duration-200">
//             <div className="relative bg-gradient-to-br from-[#087A57] to-[#0A9668] px-6 pt-6 pb-16">
//               <div className="flex items-center justify-between">
//                 <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
//                   Account Profile
//                 </p>
//                 <button
//                   type="button"
//                   onClick={() => setShowProfilePanel(false)}
//                   className="w-8 h-8 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
//                   aria-label="Close"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//             </div>

//             <div className="px-6 -mt-10 relative z-10">
//               <div className="flex items-end gap-4">
//                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#087A57] to-[#0A9668] flex items-center justify-center font-black text-white text-2xl tracking-wider shadow-xl shadow-[#087A57]/30 border-4 border-white uppercase">
//                   {getInitials(userData.name)}
//                 </div>
//                 <div className="pb-1 min-w-0 flex-1">
//                   <h2 className="text-lg font-extrabold text-slate-900 capitalize truncate">
//                     {userData.name}
//                   </h2>
//                   <span className="inline-flex mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
//                     Active · {roleLabel}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
//               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
//                 Profile details
//               </p>
//               <div className="space-y-3">
//                 <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F5FAF7] border border-emerald-100/70">
//                   <span className="w-9 h-9 rounded-lg bg-white border border-emerald-100 flex items-center justify-center text-[#087A57] shrink-0">
//                     <User size={16} />
//                   </span>
//                   <div className="min-w-0">
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                       Full name
//                     </p>
//                     <p className="text-sm font-bold text-slate-800 capitalize mt-0.5 truncate">
//                       {userData.name || "—"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F5FAF7] border border-emerald-100/70">
//                   <span className="w-9 h-9 rounded-lg bg-white border border-emerald-100 flex items-center justify-center text-[#087A57] shrink-0">
//                     <Mail size={16} />
//                   </span>
//                   <div className="min-w-0">
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                       Email address
//                     </p>
//                     <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">
//                       {userData.email || "—"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F5FAF7] border border-emerald-100/70">
//                   <span className="w-9 h-9 rounded-lg bg-white border border-emerald-100 flex items-center justify-center text-[#087A57] shrink-0">
//                     <Shield size={16} />
//                   </span>
//                   <div className="min-w-0">
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                       Access role
//                     </p>
//                     <p className="text-sm font-bold text-slate-800 capitalize mt-0.5">
//                       {roleLabel} Terminal
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-2 p-4 rounded-xl border border-dashed border-emerald-100 bg-white">
//                 <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
//                   You are signed in with an active admin session. Use disconnect
//                   to end this terminal securely.
//                 </p>
//               </div>
//             </div>

//             <div className="px-6 py-4 border-t border-emerald-100/70 bg-[#F5FAF7] flex gap-3">
//               <button
//                 type="button"
//                 onClick={() => setShowProfilePanel(false)}
//                 className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-100 bg-white text-slate-700 text-sm font-bold hover:bg-emerald-50/70 transition"
//               >
//                 Close
//               </button>
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-sm shadow-rose-600/25 transition flex items-center justify-center gap-2"
//               >
//                 <LogOut size={15} />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Header;







import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Mail,
  Shield,
  X,
  AlertTriangle,
  Clock,
  Package,
  CheckCircle2,
  BadgeCheck,
  KeyRound,
  MonitorCog,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// —— helpers ——
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const daysBetween = (from, to = new Date()) => {
  if (!from) return 0;
  const start = new Date(from);
  const end = to instanceof Date ? to : new Date(to);
  return Math.max(
    0,
    Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)),
  );
};

const formatRelative = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

const Header = ({ title = "Dashboard Console" }) => {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notif_read_ids") || "[]");
    } catch {
      return [];
    }
  });

  const [userData, setUserData] = useState({
    name: "Admin",
    email: "admin@system.com",
    role: "admin",
  });

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // —— user from token / storage ——
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token) {
      const decoded = decodeToken(token);
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser));
        } catch (err) {
          console.error(err);
        }
      } else if (decoded) {
        setUserData({
          name: decoded.name || "Admin User",
          email: decoded.email || "System User",
          role: decoded.role || "admin",
        });
      }
    }
  }, []);

  // —— click outside ——
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Escape closes profile panel
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowProfilePanel(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // —— build notifications from rentals API ——
  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/rentals`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) {
        setNotifications([]);
        return;
      }
      const json = await res.json();
      const rentals = Array.isArray(json) ? json : json?.data || [];

      const items = [];

      rentals.forEach((r) => {
        const id = r.rental_id;
        const patient = r.patient_name || "Patient";
        const device = r.device?.device_name || "Device";
        const status = (r.status || "Pending").toUpperCase();
        const days = daysBetween(r.login_date, r.login_out_date || undefined);

        // 1) Overdue / due (≥ 30 days, still open)
        if (
          !r.login_out_date &&
          days >= 30 &&
          ["PENDING", "DELIVERED", "RUNNING", "ACTIVE"].includes(status)
        ) {
          items.push({
            id: `due-${id}`,
            rentalId: id,
            type: "due",
            title: "Rental overdue",
            message: `${patient} · ${device} · ${days} days open`,
            time: r.login_date,
            severity: "high",
          });
        }
        // 2) Approaching due (25–29 days)
        else if (
          !r.login_out_date &&
          days >= 25 &&
          days < 30 &&
          ["PENDING", "DELIVERED", "RUNNING", "ACTIVE"].includes(status)
        ) {
          items.push({
            id: `warn-${id}`,
            rentalId: id,
            type: "warning",
            title: "Approaching due",
            message: `${patient} · ${device} · ${days} days`,
            time: r.login_date,
            severity: "medium",
          });
        }

        // 3) Pending (not yet delivered)
        if (status === "PENDING") {
          items.push({
            id: `pending-${id}`,
            rentalId: id,
            type: "pending",
            title: "Pending deployment",
            message: `${patient} · ${device}`,
            time: r.record_date || r.login_date || r.created_at,
            severity: "low",
          });
        }
      });

      // Sort: high severity first, then by days/recency
      const severityOrder = { high: 0, medium: 1, low: 2 };
      items.sort((a, b) => {
        const s = severityOrder[a.severity] - severityOrder[b.severity];
        if (s !== 0) return s;
        return (b.rentalId || 0) - (a.rentalId || 0);
      });

      setNotifications(items.slice(0, 20));
    } catch (err) {
      console.error("Notifications fetch failed:", err);
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  }, []);

  // Load on mount + when opening panel
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (notifOpen) fetchNotifications();
  }, [notifOpen, fetchNotifications]);

  // Persist read ids
  useEffect(() => {
    localStorage.setItem("notif_read_ids", JSON.stringify(readIds));
  }, [readIds]);

  const unreadCount = notifications.filter(
    (n) => !readIds.includes(n.id),
  ).length;

  const markAllRead = () => {
    setReadIds((prev) => [
      ...new Set([...prev, ...notifications.map((n) => n.id)]),
    ]);
  };

  const markRead = (id) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleNotifClick = (n) => {
    markRead(n.id);
    setNotifOpen(false);
    if (n.rentalId) {
      navigate(`/rental-view/${n.rentalId}`);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(`${API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const openProfile = () => {
    setProfileOpen(false);
    setShowProfilePanel(true);
  };

  const roleLabel =
    (userData.role || "admin").charAt(0).toUpperCase() +
    (userData.role || "admin").slice(1);

  const typeIcon = (type) => {
    switch (type) {
      case "due":
        return <AlertTriangle size={14} className="text-rose-600" />;
      case "warning":
        return <Clock size={14} className="text-amber-600" />;
      case "pending":
        return <Package size={14} className="text-sky-600" />;
      default:
        return <Bell size={14} className="text-slate-500" />;
    }
  };

  const typeBg = (type) => {
    switch (type) {
      case "due":
        return "bg-rose-50 border-rose-100";
      case "warning":
        return "bg-amber-50 border-amber-100";
      case "pending":
        return "bg-sky-50 border-sky-100";
      default:
        return "bg-[#F5FAF7] border-emerald-100/70";
    }
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-[292px] z-20 flex h-20 select-none items-center justify-between border-b border-emerald-100/70 bg-white/90 px-8 shadow-[0_10px_35px_rgba(20,84,61,0.06)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[17px] font-black tracking-tight text-[#183A2F] uppercase">
                {title}
              </h1>
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-[#F0FAF5] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#087A57]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                ODCom Operations
              </span>
            </div>
            <p className="mt-1 hidden md:block text-[10px] font-semibold tracking-[0.05em] text-slate-400">
              Medical Equipment Operations & Support
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* ========== NOTIFICATIONS ========== */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-all hover:border-emerald-100 hover:bg-[#F2FAF6] hover:text-[#087A57] outline-none focus-visible:ring-2 focus-visible:ring-[#087A57]/20"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#087A57] text-white text-[10px] font-black ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[20px] border border-emerald-100/80 bg-white shadow-[0_24px_70px_rgba(20,84,61,0.16)] z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="px-4 py-3 border-b border-emerald-100/70 flex items-center justify-between bg-[#F5FAF7]">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">
                      Notifications
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {unreadCount > 0
                        ? `${unreadCount} unread`
                        : "All caught up"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[11px] font-bold text-[#087A57] hover:underline flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        Mark all read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => fetchNotifications()}
                      className="text-[11px] font-bold text-slate-400 hover:text-[#087A57]"
                      title="Refresh"
                    >
                      ↻
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-[380px] overflow-y-auto">
                  {notifLoading && notifications.length === 0 ? (
                    <div className="py-12 flex flex-col items-center gap-2 text-slate-400">
                      <div className="w-6 h-6 border-2 border-t-transparent border-[#087A57] rounded-full animate-spin" />
                      <p className="text-xs font-medium">Loading…</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-2xl mb-2 opacity-40">🔔</p>
                      <p className="text-sm text-slate-400 font-medium">
                        No alerts right now
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Due & pending rentals will appear here
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-50">
                      {notifications.map((n) => {
                        const isRead = readIds.includes(n.id);
                        return (
                          <li key={n.id}>
                            <button
                              type="button"
                              onClick={() => handleNotifClick(n)}
                              className={`w-full text-left px-4 py-3.5 flex gap-3 transition hover:bg-emerald-50/80 ${
                                isRead ? "opacity-70" : "bg-white"
                              }`}
                            >
                              <span
                                className={`mt-0.5 w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${typeBg(
                                  n.type,
                                )}`}
                              >
                                {typeIcon(n.type)}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p
                                    className={`text-xs font-bold leading-snug ${
                                      isRead
                                        ? "text-slate-600"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {n.title}
                                  </p>
                                  {!isRead && (
                                    <span className="mt-1 w-2 h-2 rounded-full bg-[#087A57] shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                  {formatRelative(n.time)}
                                </p>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-emerald-100/70 bg-[#F7FBF9]">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      navigate("/rental-master");
                    }}
                    className="w-full text-center text-xs font-bold text-[#087A57] hover:underline py-1"
                  >
                    Open Rental Master →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-slate-200/60 mx-1" />

          {/* ========== PROFILE ========== */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className={`group flex items-center gap-3 rounded-[15px] border px-2 py-1.5 pr-2.5 text-left outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#087A57]/20 ${
                profileOpen
                  ? "border-[#CDE4DA] bg-[#F1F9F5] shadow-[0_8px_22px_rgba(8,122,87,0.08)]"
                  : "border-transparent hover:border-emerald-100 hover:bg-[#F5FAF7]"
              }`}
              aria-expanded={profileOpen}
              aria-label="Open account menu"
            >
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#087A57] to-[#0A9668] text-xs font-black uppercase tracking-wider text-white shadow-[0_7px_18px_rgba(8,122,87,0.24)]">
                  {getInitials(userData.name)}
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                  <span className="h-1 w-1 rounded-full bg-white" />
                </span>
              </div>

              <div className="hidden min-w-0 xl:block">
                <div className="flex items-center gap-1.5">
                  <p className="max-w-[150px] truncate text-[11.5px] font-extrabold capitalize leading-tight text-[#29463B]">
                    {userData.name}
                  </p>
                  <BadgeCheck
                    size={12}
                    className="shrink-0 text-[#087A57]"
                    strokeWidth={2.2}
                  />
                </div>

                <p className="mt-1 text-[8.5px] font-extrabold uppercase tracking-[0.09em] text-[#91A29A]">
                  {roleLabel} · Active Session
                </p>
              </div>

              <ChevronDown
                size={14}
                className={`hidden shrink-0 text-[#8DA099] transition-transform duration-200 xl:block ${
                  profileOpen ? "rotate-180 text-[#087A57]" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 z-50 mt-3 w-[310px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-[22px] border border-[#DCEAE4] bg-white shadow-[0_26px_75px_rgba(20,84,61,0.17)] animate-in fade-in zoom-in-95 duration-150">
                {/* Premium identity header */}
                <div className="relative overflow-hidden border-b border-[#E3EEE8] bg-gradient-to-br from-[#F2FAF6] via-white to-[#F7FBF9] px-4 pb-4 pt-4">
                  <div className="pointer-events-none absolute -right-10 -top-14 h-32 w-32 rounded-full bg-[#0A9668]/[0.07] blur-2xl" />

                  <div className="relative flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#087A57] to-[#0A9668] text-sm font-black uppercase tracking-wider text-white shadow-[0_8px_20px_rgba(8,122,87,0.22)]">
                        {getInitials(userData.name)}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[13px] font-black capitalize text-[#223F34]">
                          {userData.name}
                        </p>
                        <BadgeCheck
                          size={13}
                          className="shrink-0 text-[#087A57]"
                        />
                      </div>

                      <p className="mt-0.5 truncate text-[10px] font-medium text-[#8A9B93]">
                        {userData.email}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#D7ECE2] bg-[#EAF7F0] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#087A57]">
                          <ShieldCheck size={9} />
                          {roleLabel}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-white px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.07em] text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session overview */}
                <div className="grid grid-cols-2 gap-2 border-b border-[#ECF2EF] px-3.5 py-3">
                  <div className="rounded-[12px] border border-[#E5EEE9] bg-[#FAFCFB] px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[#087A57]">
                      <KeyRound size={11} />
                      <p className="text-[7.5px] font-extrabold uppercase tracking-[0.09em] text-[#91A19A]">
                        Access
                      </p>
                    </div>
                    <p className="mt-1 text-[9.5px] font-extrabold capitalize text-[#405B50]">
                      {roleLabel}
                    </p>
                  </div>

                  <div className="rounded-[12px] border border-[#E5EEE9] bg-[#FAFCFB] px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[#087A57]">
                      <MonitorCog size={11} />
                      <p className="text-[7.5px] font-extrabold uppercase tracking-[0.09em] text-[#91A19A]">
                        Session
                      </p>
                    </div>
                    <p className="mt-1 text-[9.5px] font-extrabold text-[#405B50]">
                      Active
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-1.5 p-2.5">
                  <button
                    type="button"
                    onClick={openProfile}
                    className="group flex w-full items-center gap-3 rounded-[13px] px-3 py-2.5 text-[#526A60] transition hover:bg-[#EEF8F3] hover:text-[#087A57]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2EDE7] bg-[#F8FBF9] text-[#748A80] transition group-hover:border-[#D4E8DE] group-hover:bg-white group-hover:text-[#087A57]">
                      <User size={14} />
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-[10.5px] font-extrabold">
                        View Profile
                      </p>
                      <p className="mt-0.5 text-[8.5px] font-medium text-[#9AA9A2]">
                        Account details & access
                      </p>
                    </div>
                    <ChevronDown
                      size={12}
                      className="-rotate-90 text-[#B0BDB7]"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 rounded-[13px] px-3 py-2.5 text-rose-600 transition hover:bg-rose-50"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-rose-100 bg-rose-50 text-rose-500 transition group-hover:bg-white">
                      <LogOut size={14} />
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-[10.5px] font-extrabold">
                        Disconnect Session
                      </p>
                      <p className="mt-0.5 text-[8.5px] font-medium text-rose-300">
                        Sign out from this terminal
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========== PROFILE SLIDE-OVER ========== */}
      {showProfilePanel && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <button
            type="button"
            aria-label="Close profile panel"
            className="absolute inset-0 cursor-default bg-[#102E25]/45 backdrop-blur-[3px]"
            onClick={() => setShowProfilePanel(false)}
          />

          <aside className="relative flex h-full w-full max-w-[470px] flex-col border-l border-[#D8E8E0] bg-[#F7FAF8] shadow-[0_0_70px_rgba(15,62,46,0.22)] animate-in slide-in-from-right duration-200">
            {/* =================================================
                PROFILE HERO
            ================================================== */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#075F46] via-[#087252] to-[#0A8A61] px-6 pb-16 pt-6 text-white">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full border border-white/[0.07]" />
                <div className="absolute right-3 top-6 h-32 w-32 rounded-full border border-white/[0.05]" />
                <div className="absolute -bottom-20 left-16 h-40 w-40 rounded-full bg-[#83F0C1]/10 blur-3xl" />
              </div>

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.10] bg-white/[0.08]">
                      <User size={13} />
                    </span>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-emerald-50/65">
                      Account Profile
                    </p>
                  </div>

                  <h2 className="mt-3 text-[20px] font-black tracking-[-0.025em]">
                    ODCom Operator Account
                  </h2>

                  <p className="mt-1 max-w-[310px] text-[10px] font-medium leading-5 text-emerald-50/55">
                    Review your identity, account access and current secure session.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProfilePanel(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-white/[0.08] bg-white/[0.07] text-white/70 transition hover:bg-white/[0.13] hover:text-white"
                  aria-label="Close"
                  title="Close"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* =================================================
                IDENTITY CARD
            ================================================== */}
            <div className="relative z-10 -mt-10 px-5 sm:px-6">
              <div className="rounded-[20px] border border-[#DDEAE4] bg-white p-4 shadow-[0_14px_34px_rgba(20,84,61,0.10)]">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#087A57] to-[#0A9668] text-[21px] font-black uppercase tracking-wider text-white shadow-[0_10px_25px_rgba(8,122,87,0.25)]">
                      {getInitials(userData.name)}
                    </div>

                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500 text-white">
                      <CheckCircle2 size={11} strokeWidth={2.5} />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-[17px] font-black capitalize tracking-[-0.02em] text-[#223F34]">
                        {userData.name}
                      </h3>
                      <BadgeCheck
                        size={15}
                        className="shrink-0 text-[#087A57]"
                      />
                    </div>

                    <p className="mt-1 truncate text-[10.5px] font-medium text-[#8A9C94]">
                      {userData.email}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5EADF] bg-[#EAF7F0] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#087A57]">
                        <ShieldCheck size={10} />
                        {roleLabel}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-[#F4FBF7] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                PROFILE CONTENT
            ================================================== */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {/* Secure session strip */}
              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="rounded-[15px] border border-[#DDEAE4] bg-white px-3.5 py-3 shadow-[0_5px_16px_rgba(20,84,61,0.035)]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EDF8F3] text-[#087A57]">
                      <KeyRound size={14} />
                    </span>
                    <div>
                      <p className="text-[7.5px] font-extrabold uppercase tracking-[0.09em] text-[#98A79F]">
                        Access Level
                      </p>
                      <p className="mt-0.5 text-[10px] font-extrabold capitalize text-[#405B50]">
                        {roleLabel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[15px] border border-[#DDEAE4] bg-white px-3.5 py-3 shadow-[0_5px_16px_rgba(20,84,61,0.035)]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EDF8F3] text-[#087A57]">
                      <MonitorCog size={14} />
                    </span>
                    <div>
                      <p className="text-[7.5px] font-extrabold uppercase tracking-[0.09em] text-[#98A79F]">
                        Session
                      </p>
                      <p className="mt-0.5 text-[10px] font-extrabold text-[#405B50]">
                        Secure · Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#7C9188]">
                    Profile Details
                  </p>
                  <p className="mt-0.5 text-[8.5px] font-medium text-[#A0AEA7]">
                    Identity and authorization information
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DCEBE4] bg-white px-2.5 py-1 text-[8px] font-bold text-[#7A9086]">
                  <Sparkles size={9} className="text-[#087A57]" />
                  Verified Session
                </span>
              </div>

              <div className="space-y-3">
                {/* Full name */}
                <div className="group rounded-[16px] border border-[#E0ECE6] bg-white p-4 shadow-[0_5px_16px_rgba(20,84,61,0.03)] transition hover:border-[#CDE1D8]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-[#DCECE4] bg-[#F2F9F5] text-[#087A57]">
                      <User size={15} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#98A79F]">
                        Full Name
                      </p>
                      <p className="mt-1 truncate text-[12px] font-extrabold capitalize text-[#385449]">
                        {userData.name || "—"}
                      </p>
                    </div>

                    <CheckCircle2
                      size={13}
                      className="mt-1 shrink-0 text-emerald-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="group rounded-[16px] border border-[#E0ECE6] bg-white p-4 shadow-[0_5px_16px_rgba(20,84,61,0.03)] transition hover:border-[#CDE1D8]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-[#DCECE4] bg-[#F2F9F5] text-[#087A57]">
                      <Mail size={15} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#98A79F]">
                        Email Address
                      </p>
                      <p className="mt-1 truncate text-[12px] font-extrabold text-[#385449]">
                        {userData.email || "—"}
                      </p>
                    </div>

                    <CheckCircle2
                      size={13}
                      className="mt-1 shrink-0 text-emerald-500"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="group rounded-[16px] border border-[#E0ECE6] bg-white p-4 shadow-[0_5px_16px_rgba(20,84,61,0.03)] transition hover:border-[#CDE1D8]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-[#DCECE4] bg-[#F2F9F5] text-[#087A57]">
                      <Shield size={15} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#98A79F]">
                        Access Role
                      </p>
                      <p className="mt-1 text-[12px] font-extrabold capitalize text-[#385449]">
                        {roleLabel} Terminal
                      </p>
                    </div>

                    <BadgeCheck
                      size={13}
                      className="mt-1 shrink-0 text-[#087A57]"
                    />
                  </div>
                </div>
              </div>

              {/* Security message */}
              <div className="mt-4 rounded-[16px] border border-[#DDEBE4] bg-gradient-to-r from-[#F0F9F5] to-[#F8FCFA] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white text-[#087A57] shadow-sm ring-1 ring-[#DFEAE5]">
                    <ShieldCheck size={15} />
                  </span>

                  <div>
                    <p className="text-[10px] font-extrabold text-[#3F5B50]">
                      Secure ODCom Session
                    </p>
                    <p className="mt-1 text-[9px] font-medium leading-5 text-[#8A9C94]">
                      This terminal is currently authenticated. Use Disconnect Session
                      when leaving the workstation or handing it to another operator.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                BOTTOM ACTIONS
            ================================================== */}
            <div className="border-t border-[#DFEAE5] bg-white px-5 py-4 sm:px-6">
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowProfilePanel(false)}
                  className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[#DCE8E3] bg-white px-4 text-[10.5px] font-extrabold text-[#687E74] transition hover:bg-[#F5F9F7]"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-11 flex-[1.15] items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-[10.5px] font-extrabold text-white shadow-[0_8px_20px_rgba(225,29,72,0.20)] transition hover:-translate-y-[1px] hover:bg-rose-700 active:translate-y-0"
                >
                  <LogOut size={14} />
                  Disconnect Session
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Header;