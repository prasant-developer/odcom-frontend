
// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import DashboardLayout from "../Admin/Layout";
// import {
//   ArrowLeft,
//   Building2,
//   CalendarDays,
//   Camera,
//   CheckCircle2,
//   CircleDollarSign,
//   ClipboardList,
//   Clock3,
//   CreditCard,
//   FileText,
//   IndianRupee,
//   Layers3,
//   MapPin,
//   Package,
//   Pencil,
//   Phone,
//   ShieldCheck,
//   Stethoscope,
//   UserRound,
//   UsersRound,
//   Wrench,
// } from "lucide-react";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// export default function RentalView() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Support both URL param and location.state
//   const rentalId =
//     id || location.state?.rental_id || location.state?.rental?.rental_id;

//   const [rental, setRental] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ===============================
//   // FETCH RENTAL BY ID (View only)
//   // ===============================
//   useEffect(() => {
//     if (!rentalId) {
//       setError("No rental ID found.");
//       setIsLoading(false);
//       return;
//     }

//     const fetchRentalDetails = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const token = localStorage.getItem("token");

//         const response = await fetch(
//           `${API_BASE_URL}/api/rentals/${rentalId}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               ...(token && { Authorization: `Bearer ${token}` }),
//             },
//           }
//         );

//         if (!response.ok) {
//           if (response.status === 404) {
//             throw new Error("Rental not found.");
//           }
//           if (response.status === 401) {
//             throw new Error("Session expired. Please login again.");
//           }
//           throw new Error("Failed to load rental details.");
//         }

//         const result = await response.json();

//         // Support both { success: true, data: {...} } and direct object
//         if (result.success) {
//           setRental(result.data);
//         } else {
//           setRental(result);
//         }
//       } catch (err) {
//         console.error("Failed to fetch rental:", err);
//         setError(err.message || "Something went wrong while loading rental.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRentalDetails();
//   }, [rentalId]);


//   const formatDate = (value) => {
//     if (!value) return "—";

//     const d = new Date(value);
//     if (Number.isNaN(d.getTime())) return value;

//     return d.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const formatCurrency = (value) =>
//     Number(value || 0).toLocaleString("en-IN", {
//       maximumFractionDigits: 2,
//     });

//   const getStatusStyle = (status) => {
//     const normalized = String(status || "").toUpperCase();

//     if (["ACTIVE", "RUNNING", "DELIVERED"].includes(normalized)) {
//       return {
//         label: normalized,
//         badge:
//           "border-emerald-200 bg-emerald-50 text-emerald-700",
//         dot: "bg-emerald-500",
//       };
//     }

//     if (normalized === "PENDING") {
//       return {
//         label: "PENDING",
//         badge: "border-amber-200 bg-amber-50 text-amber-700",
//         dot: "bg-amber-400",
//       };
//     }

//     if (["INACTIVE", "CLOSED", "CLOSE", "CANCELLED"].includes(normalized)) {
//       return {
//         label: normalized || "INACTIVE",
//         badge: "border-slate-200 bg-slate-100 text-slate-600",
//         dot: "bg-slate-400",
//       };
//     }

//     return {
//       label: normalized || "UNKNOWN",
//       badge: "border-[#DCEAE3] bg-[#F4F9F6] text-[#5F776D]",
//       dot: "bg-[#7C958A]",
//     };
//   };

//   const getAccessoryNames = () => {
//     if (Array.isArray(rental?.accessories) && rental.accessories.length > 0) {
//       return rental.accessories
//         .map((item) =>
//           typeof item === "string"
//             ? item
//             : item?.accessory_name || item?.name || item?.label,
//         )
//         .filter(Boolean);
//     }

//     if (Array.isArray(rental?.accessory)) {
//       return rental.accessory
//         .map((item) =>
//           typeof item === "string"
//             ? item
//             : item?.accessory_name || item?.name || item?.label,
//         )
//         .filter(Boolean);
//     }

//     if (rental?.accessory?.accessory_name) {
//       return [rental.accessory.accessory_name];
//     }

//     if (Array.isArray(rental?.accessory_id)) {
//       return rental.accessory_id.map(String);
//     }

//     if (rental?.accessory_id) {
//       if (typeof rental.accessory_id === "string") {
//         try {
//           const parsed = JSON.parse(rental.accessory_id);
//           if (Array.isArray(parsed)) return parsed.map(String);
//         } catch {
//           // keep original value
//         }
//       }

//       return [String(rental.accessory_id)];
//     }

//     return [];
//   };

//   const getPhotoUrls = () => {
//     if (!Array.isArray(rental?.asset_photos)) return [];

//     return rental.asset_photos
//       .map((photo) => {
//         if (typeof photo === "string") return photo;
//         return photo?.url || photo?.path || photo?.photo_url || "";
//       })
//       .filter(Boolean);
//   };

//   const statusStyle = rental ? getStatusStyle(rental.status) : null;
//   const accessoryNames = rental ? getAccessoryNames() : [];
//   const photoUrls = rental ? getPhotoUrls() : [];

//   const infoRow = (label, value, Icon = null) => (
//     <div className="flex items-start justify-between gap-4 border-b border-[#EDF3F0] py-3 last:border-b-0">
//       <div className="flex min-w-0 items-center gap-2.5">
//         {Icon && (
//           <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F8F5] text-[#087A57]">
//             <Icon size={14} strokeWidth={2} />
//           </span>
//         )}
//         <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#8A9C94]">
//           {label}
//         </span>
//       </div>

//       <div className="max-w-[58%] text-right text-[12px] font-extrabold leading-5 text-[#334F44]">
//         {value ?? "—"}
//       </div>
//     </div>
//   );

//   // ===============================
//   // Loading State
//   // ===============================
//   if (isLoading) {
//     return (
//       <DashboardLayout>
//         <div className="flex min-h-[72vh] items-center justify-center bg-[#F5F9F7] px-4">
//           <div className="w-full max-w-sm rounded-[24px] border border-[#E1ECE7] bg-white p-8 text-center shadow-[0_18px_45px_rgba(24,82,61,0.09)]">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7F0] text-[#087A57]">
//               <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#B9DCCB] border-t-[#087A57]" />
//             </div>

//             <h3 className="mt-4 text-[15px] font-extrabold text-[#28463A]">
//               Loading Rental Record
//             </h3>

//             <p className="mt-1.5 text-[10.5px] font-medium leading-5 text-[#8B9C94]">
//               Retrieving equipment, commercial, care-center and delivery information.
//             </p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   // ===============================
//   // Error State
//   // ===============================
//   if (error || !rental) {
//     return (
//       <DashboardLayout>
//         <div className="flex min-h-[72vh] items-center justify-center bg-[#F5F9F7] px-4">
//           <div className="w-full max-w-md rounded-[24px] border border-rose-100 bg-white p-7 text-center shadow-[0_18px_45px_rgba(24,82,61,0.08)]">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
//               <ShieldCheck size={23} />
//             </div>

//             <h3 className="mt-4 text-[16px] font-extrabold text-[#2E443A]">
//               Unable to load rental
//             </h3>

//             <p className="mt-2 text-[11px] font-medium leading-5 text-rose-600">
//               {error || "Rental data could not be loaded."}
//             </p>

//             <button
//               type="button"
//               onClick={() => navigate("/rental-master")}
//               className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#DCE7E2] bg-white px-4 text-[11px] font-bold text-[#687B72] transition hover:bg-[#F5F9F7]"
//             >
//               <ArrowLeft size={14} />
//               Back to Rental Master
//             </button>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   // ===============================
//   // MAIN VIEW UI
//   // ===============================
//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-[#F5F9F7]">
//         <div className="mx-auto w-full max-w-[1480px] space-y-4 px-3 py-4 sm:px-5 lg:px-6">
//           {/* =====================================================
//               PREMIUM HEADER
//           ====================================================== */}
//           <section className="relative overflow-hidden rounded-[24px] border border-[#DDEBE4] bg-white shadow-[0_12px_35px_rgba(8,93,67,0.06)]">
//             <div className="pointer-events-none absolute inset-0">
//               <div className="absolute -right-24 -top-28 h-64 w-64 rounded-full bg-[#0A9668]/[0.07] blur-3xl" />
//               <div className="absolute right-16 top-0 h-36 w-36 rounded-full border border-[#0A9668]/[0.06]" />
//             </div>

//             <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
//               <div className="flex items-start gap-4">
//                 <button
//                   type="button"
//                   onClick={() => navigate("/rental-master")}
//                   className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFEAE5] bg-white text-[#6C8077] transition hover:border-[#BFD7CC] hover:bg-[#F4FAF7] hover:text-[#087A57]"
//                   title="Back to Rental Master"
//                   aria-label="Back to Rental Master"
//                 >
//                   <ArrowLeft size={18} />
//                 </button>

//                 <div className="flex min-w-0 gap-3">
//                   <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#087A57] to-[#0A9668] text-white shadow-[0_9px_24px_rgba(8,122,87,0.22)] sm:flex">
//                     <ClipboardList size={22} />
//                   </div>

//                   <div className="min-w-0">
//                     <div className="mb-1.5 flex flex-wrap items-center gap-2">
//                       <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8EEE4] bg-[#ECF8F2] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#087A57]">
//                         <ShieldCheck size={11} />
//                         Equipment Operations
//                       </span>

//                       <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3ECE8] bg-[#F8FBF9] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7F9189]">
//                         View Only
//                       </span>
//                     </div>

//                     <h1 className="text-[22px] font-extrabold tracking-[-0.035em] text-[#183A2F] sm:text-[27px]">
//                       Rental Requisition #{rental.rental_id}
//                     </h1>

//                     <p className="mt-1 max-w-2xl text-[11.5px] font-medium leading-5 text-[#7B8E85]">
//                       Complete equipment deployment, commercial, care-center and patient record.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-wrap items-center gap-2.5">
//                 <span
//                   className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-[10px] font-extrabold uppercase tracking-[0.07em] ${statusStyle.badge}`}
//                 >
//                   <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
//                   {statusStyle.label}
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() => navigate(`/rental-edit/${rental.rental_id}`)}
//                   className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#087A57] to-[#0A9668] px-4 text-[10.5px] font-extrabold text-white shadow-[0_8px_22px_rgba(8,122,87,0.22)] transition hover:-translate-y-[1px] hover:shadow-[0_11px_28px_rgba(8,122,87,0.27)] active:translate-y-0"
//                 >
//                   <Pencil size={14} />
//                   Edit Requisition
//                 </button>
//               </div>
//             </div>
//           </section>

//           <div className="flex flex-wrap items-center gap-2 rounded-[15px] border border-[#E2ECE7] bg-white px-3.5 py-2.5 shadow-[0_5px_16px_rgba(8,93,67,0.03)]">
//             <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#93A29B]">
//               Record Overview
//             </span>
//             <span className="h-3 w-px bg-[#E2EAE6]" />
//             <span className="text-[9.5px] font-bold text-[#5C7469]">
//               Deal Type: <span className="text-[#2F4C40]">{rental.deal_type || "—"}</span>
//             </span>
//             <span className="hidden h-3 w-px bg-[#E2EAE6] sm:block" />
//             <span className="text-[9.5px] font-bold text-[#5C7469]">
//               Unit: <span className="text-[#2F4C40]">{rental.unit_type || "—"}</span>
//             </span>
//             <span className="hidden h-3 w-px bg-[#E2EAE6] sm:block" />
//             <span className="text-[9.5px] font-bold text-[#5C7469]">
//               Mode: <span className="text-[#2F4C40]">{rental.mode_type || "—"}</span>
//             </span>
//             <span className="hidden h-3 w-px bg-[#E2EAE6] md:block" />
//             <span className="text-[9.5px] font-bold text-[#5C7469]">
//               Billing Type: <span className="text-[#2F4C40]">{rental.billing_type || "—"}</span>
//             </span>
//           </div>

//           {/* =====================================================
//               SUMMARY STRIP
//           ====================================================== */}
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
//             <div className="rounded-[17px] border border-[#E1ECE7] bg-white px-4 py-3 shadow-[0_7px_20px_rgba(8,93,67,0.035)]">
//               <div className="flex items-center gap-3">
//                 <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57]">
//                   <Wrench size={18} />
//                 </span>

//                 <div className="min-w-0">
//                   <p className="text-[8.5px] font-extrabold uppercase tracking-[0.08em] text-[#9AA9A2]">
//                     Equipment
//                   </p>
//                   <p className="mt-0.5 truncate text-[11.5px] font-extrabold text-[#415A50]">
//                     {rental.device?.device_name || "Equipment Asset"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-[17px] border border-[#E1ECE7] bg-white px-4 py-3 shadow-[0_7px_20px_rgba(8,93,67,0.035)]">
//               <div className="flex items-center gap-3">
//                 <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF8F4] text-[#087A57]">
//                   <UserRound size={18} />
//                 </span>

//                 <div className="min-w-0">
//                   <p className="text-[8.5px] font-extrabold uppercase tracking-[0.08em] text-[#9AA9A2]">
//                     Patient Name
//                   </p>
//                   <p className="mt-0.5 truncate text-[11.5px] font-extrabold text-[#415A50]">
//                     {rental.patient_name || "—"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-[17px] border border-[#E1ECE7] bg-white px-4 py-3 shadow-[0_7px_20px_rgba(8,93,67,0.035)]">
//               <div className="flex items-center gap-3">
//                 <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF8F4] text-[#087A57]">
//                   <Building2 size={18} />
//                 </span>

//                 <div className="min-w-0">
//                   <p className="text-[8.5px] font-extrabold uppercase tracking-[0.08em] text-[#9AA9A2]">
//                     Care Center
//                   </p>
//                   <p className="mt-0.5 truncate text-[11.5px] font-extrabold text-[#415A50]">
//                     {rental.careCenter?.carecenter_name ||
//                       rental.care_center_name ||
//                       "Direct / Other"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-[17px] border border-[#E1ECE7] bg-white px-4 py-3 shadow-[0_7px_20px_rgba(8,93,67,0.035)]">
//               <div className="flex items-center gap-3">
//                 <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF6E5] text-amber-600">
//                   <CalendarDays size={18} />
//                 </span>

//                 <div className="min-w-0">
//                   <p className="text-[8.5px] font-extrabold uppercase tracking-[0.08em] text-[#9AA9A2]">
//                     Login Date
//                   </p>
//                   <p className="mt-0.5 truncate text-[11.5px] font-extrabold text-[#415A50]">
//                     {formatDate(rental.login_date)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* =====================================================
//               MAIN INFORMATION GRID
//           ====================================================== */}
//           <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
//             {/* Equipment + timeline */}
//             <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-[0_8px_24px_rgba(8,93,67,0.04)]">
//               <div className="flex items-center gap-3 border-b border-[#ECF2EF] bg-[#FBFDFC] px-5 py-4">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57]">
//                   <Package size={17} />
//                 </span>

//                 <div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-[9px] font-black text-[#0A8A60]">01</span>
//                     <h2 className="text-[13px] font-extrabold text-[#29463B]">
//                       Logistics & Device Matrix
//                     </h2>
//                   </div>

//                   <p className="mt-0.5 text-[9.5px] font-medium text-[#91A098]">
//                     Assigned device, accessory, rental type and operational dates.
//                   </p>
//                 </div>
//               </div>

//               <div className="p-5">
//                 <div className="rounded-[16px] border border-[#E3EEE8] bg-[#F9FCFA] px-4 py-3.5">
//                   <div className="flex items-start gap-3">
//                     <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7F5EE] text-[#087A57]">
//                       <Wrench size={18} />
//                     </span>

//                     <div className="min-w-0">
//                       <p className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#899B93]">
//                         Assigned Model
//                       </p>

//                       <p className="mt-1 text-[14px] font-extrabold text-[#2F4D41]">
//                         {rental.device?.device_name || "N/A"}
//                       </p>

//                       {accessoryNames.length > 0 && (
//                         <div className="mt-2 flex flex-wrap gap-1.5">
//                           {accessoryNames.map((name, index) => (
//                             <span
//                               key={`${name}-${index}`}
//                               className="rounded-lg border border-[#D9EDE3] bg-[#ECF8F2] px-2 py-1 text-[8.5px] font-bold text-[#087A57]"
//                             >
//                               {name}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-3 grid grid-cols-1 gap-x-5 sm:grid-cols-2">
//                   {infoRow("Deal Type", rental.deal_type || "—", Layers3)}
//                   {infoRow("Unit", rental.unit_type || "—", Package)}
//                   {infoRow("Mode", rental.mode_type || "—", CreditCard)}
//                   {infoRow("Record Date", formatDate(rental.record_date), CalendarDays)}
//                   {infoRow("Log In Date", formatDate(rental.login_date), CalendarDays)}
//                   {infoRow("Notify Date", formatDate(rental.notify_date), Clock3)}
//                   {infoRow("Log Out Date", formatDate(rental.login_out_date), CalendarDays)}
//                   {infoRow("Recall Date", formatDate(rental.recall_date), Clock3)}
//                 </div>
//               </div>
//             </section>

//             {/* Commercials */}
//             <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-[0_8px_24px_rgba(8,93,67,0.04)]">
//               <div className="flex items-center gap-3 border-b border-[#ECF2EF] bg-[#FBFDFC] px-5 py-4">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57]">
//                   <CircleDollarSign size={17} />
//                 </span>

//                 <div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-[9px] font-black text-[#0A8A60]">02</span>
//                     <h2 className="text-[13px] font-extrabold text-[#29463B]">
//                       Commercial Parameters
//                     </h2>
//                   </div>

//                   <p className="mt-0.5 text-[9.5px] font-medium text-[#91A098]">
//                     Billing type, rental charge, deposit and installation charge.
//                   </p>
//                 </div>
//               </div>

//               <div className="p-5">
//                 <div className="mb-4 rounded-[16px] border border-[#DDECE5] bg-gradient-to-r from-[#F4FBF7] to-[#FAFCFB] px-4 py-4">
//                   <div className="flex items-center justify-between gap-4">
//                     <div>
//                       <p className="text-[8.5px] font-extrabold uppercase tracking-[0.08em] text-[#899B93]">
//                         Billing Type
//                       </p>
//                       <p className="mt-1 text-[15px] font-extrabold text-[#087A57]">
//                         {rental.billing_type || "—"}
//                       </p>
//                     </div>

//                     <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#087A57] shadow-sm">
//                       <CreditCard size={19} />
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//                   {[
//                     ["Rental Charge", rental.rental_charge],
//                     ["Deposit / Advance", rental.deposit_advance],
//                     ["Installation Charge", rental.installation_charge],
//                   ].map(([label, value]) => (
//                     <div
//                       key={label}
//                       className="rounded-[15px] border border-[#E4EDE9] bg-[#FBFDFC] px-4 py-3.5"
//                     >
//                       <div className="flex items-center gap-1.5 text-[#087A57]">
//                         <IndianRupee size={13} />
//                         <span className="text-[8.5px] font-extrabold uppercase tracking-[0.07em] text-[#8A9C94]">
//                           {label}
//                         </span>
//                       </div>

//                       <p className="mt-2 text-[16px] font-extrabold tracking-[-0.02em] text-[#304E42]">
//                         ₹{formatCurrency(value)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </section>

//             {/* Care center */}
//             <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-[0_8px_24px_rgba(8,93,67,0.04)]">
//               <div className="flex items-center gap-3 border-b border-[#ECF2EF] bg-[#FBFDFC] px-5 py-4">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57]">
//                   <Building2 size={17} />
//                 </span>

//                 <div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-[9px] font-black text-[#0A8A60]">03</span>
//                     <h2 className="text-[13px] font-extrabold text-[#29463B]">
//                       Care Center Context
//                     </h2>
//                   </div>

//                   <p className="mt-0.5 text-[9.5px] font-medium text-[#91A098]">
//                     Care center, POC, referral and deployment context.
//                   </p>
//                 </div>
//               </div>

//               <div className="p-5">
//                 <div className="mb-3 rounded-[16px] border border-[#E3EEE8] bg-[#F9FCFA] px-4 py-3.5">
//                   <p className="text-[8.5px] font-extrabold uppercase tracking-[0.08em] text-[#899B93]">
//                     Care Center
//                   </p>
//                   <p className="mt-1 text-[13px] font-extrabold text-[#304E42]">
//                     {rental.careCenter?.carecenter_name ||
//                       rental.care_center_name ||
//                       "Direct / Other"}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
//                   {infoRow("POC Mobile", rental.mob_no || "—", Phone)}
//                   {infoRow("Alt Mobile", rental.alternative_mob_no || "—", Phone)}
//                   {infoRow("Bed No", rental.care_bed_no || "—", Building2)}
//                   {infoRow("POC / Doctor", rental.care_poc_name || "—", Stethoscope)}
//                   {infoRow("Referral", rental.care_referal || "—", UsersRound)}
//                 </div>

//                 <div className="mt-3 rounded-[15px] border border-[#E4EDE9] bg-[#FBFDFC] p-4">
//                   <div className="mb-2 flex items-center gap-2">
//                     <MapPin size={14} className="text-[#087A57]" />
//                     <span className="text-[8.5px] font-extrabold uppercase tracking-[0.07em] text-[#8A9C94]">
//                       Care Address
//                     </span>
//                   </div>

//                   <p className="text-[11.5px] font-semibold leading-5 text-[#465F55]">
//                     {rental.care_address || "—"}
//                   </p>
//                 </div>
//               </div>
//             </section>

//             {/* Patient */}
//             <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-[0_8px_24px_rgba(8,93,67,0.04)]">
//               <div className="flex items-center gap-3 border-b border-[#ECF2EF] bg-[#FBFDFC] px-5 py-4">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57]">
//                   <UserRound size={17} />
//                 </span>

//                 <div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-[9px] font-black text-[#0A8A60]">04</span>
//                     <h2 className="text-[13px] font-extrabold text-[#29463B]">
//                       Patient & Delivery Details
//                     </h2>
//                   </div>

//                   <p className="mt-0.5 text-[9.5px] font-medium text-[#91A098]">
//                     Patient identity, attendant contact and delivery destination.
//                   </p>
//                 </div>
//               </div>

//               <div className="p-5">
//                 <div className="mb-3 rounded-[16px] border border-[#E3EEE8] bg-[#F9FCFA] px-4 py-3.5">
//                   <div className="flex items-center gap-3">
//                     <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F5EE] text-[#087A57]">
//                       <UserRound size={18} />
//                     </span>

//                     <div>
//                       <div className="flex flex-wrap items-center gap-2">
//                         <p className="text-[13px] font-extrabold text-[#304E42]">
//                           {rental.patient_name || "—"}
//                         </p>
//                         {rental.patient_age && (
//                           <span className="rounded-full border border-[#DDECE5] bg-white px-2 py-0.5 text-[8.5px] font-bold text-[#6C8177]">
//                             Age: {rental.patient_age} Yrs
//                           </span>
//                         )}
//                       </div>
//                       <p className="mt-0.5 text-[9.5px] font-medium text-[#8C9C95]">
//                         Patient Name
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
//                   {infoRow("Mobile", rental.patient_mob_no || "—", Phone)}
//                   {infoRow(
//                     "Alt Mobile",
//                     rental.patient_alternative_mob_no || "—",
//                     Phone,
//                   )}
//                   {infoRow(
//                     "Attendant",
//                     rental.patient_attendant_name || "—",
//                     UsersRound,
//                   )}
//                 </div>

//                 <div className="mt-3 rounded-[15px] border border-[#E4EDE9] bg-[#FBFDFC] p-4">
//                   <div className="mb-2 flex items-center gap-2">
//                     <MapPin size={14} className="text-[#087A57]" />
//                     <span className="text-[8.5px] font-extrabold uppercase tracking-[0.07em] text-[#8A9C94]">
//                       Delivery Address
//                     </span>
//                   </div>

//                   <p className="text-[11.5px] font-semibold leading-5 text-[#465F55]">
//                     {rental.patient_delivery_address || "—"}
//                   </p>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* =====================================================
//               NOTES
//           ====================================================== */}
//           {rental.notes && (
//             <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-[0_8px_24px_rgba(8,93,67,0.04)]">
//               <div className="flex items-center gap-3 border-b border-[#ECF2EF] bg-[#FBFDFC] px-5 py-4">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57]">
//                   <FileText size={17} />
//                 </span>

//                 <div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-[9px] font-black text-[#0A8A60]">05</span>
//                     <h2 className="text-[13px] font-extrabold text-[#29463B]">
//                       Operations Notes
//                     </h2>
//                   </div>

//                   <p className="mt-0.5 text-[9.5px] font-medium text-[#91A098]">
//                     Internal deployment, service or support information.
//                   </p>
//                 </div>
//               </div>

//               <div className="p-5">
//                 <div className="rounded-[15px] border border-[#E4EDE9] bg-[#FBFDFC] p-4">
//                   <p className="whitespace-pre-wrap text-[11.5px] font-medium leading-6 text-[#465F55]">
//                     {rental.notes}
//                   </p>
//                 </div>
//               </div>
//             </section>
//           )}

//           {/* =====================================================
//               PHOTO VERIFICATION
//           ====================================================== */}
//           {photoUrls.length > 0 && (
//             <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-[0_8px_24px_rgba(8,93,67,0.04)]">
//               <div className="flex flex-col gap-2 border-b border-[#ECF2EF] bg-[#FBFDFC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="flex items-center gap-3">
//                   <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57]">
//                     <Camera size={17} />
//                   </span>

//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-[9px] font-black text-[#0A8A60]">06</span>
//                       <h2 className="text-[13px] font-extrabold text-[#29463B]">
//                         Asset Handover Verification
//                       </h2>
//                     </div>

//                     <p className="mt-0.5 text-[9.5px] font-medium text-[#91A098]">
//                       Equipment photographs attached to this rental record.
//                     </p>
//                   </div>
//                 </div>

//                 <span className="w-fit rounded-full border border-[#D7EEE4] bg-[#EAF7F0] px-2.5 py-1 text-[9px] font-extrabold text-[#087A57]">
//                   {photoUrls.length} Photo{photoUrls.length !== 1 ? "s" : ""}
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
//                 {photoUrls.map((photo, index) => {
//                   const source = photo.startsWith("http")
//                     ? photo
//                     : `${API_BASE_URL}${photo}`;

//                   return (
//                     <a
//                       key={`${photo}-${index}`}
//                       href={source}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="group relative overflow-hidden rounded-[14px] border border-[#DFEAE5] bg-[#F7FAF8] shadow-sm"
//                       title="Open full image"
//                     >
//                       <img
//                         src={source}
//                         alt={`Handover verification ${index + 1}`}
//                         className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.035]"
//                       />

//                       <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2.5 pb-2 pt-7">
//                         <span className="text-[8px] font-bold text-white/90">
//                           Verification #{index + 1}
//                         </span>
//                       </div>
//                     </a>
//                   );
//                 })}
//               </div>
//             </section>
//           )}

//           {/* =====================================================
//               FOOTER ACTION
//           ====================================================== */}
//           <div className="flex flex-col gap-3 rounded-[18px] border border-[#DDE9E4] bg-white px-4 py-3.5 shadow-[0_10px_28px_rgba(24,82,61,0.06)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
//             <div className="flex items-center gap-3">
//               <span className="hidden h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57] sm:flex">
//                 <CheckCircle2 size={17} />
//               </span>

//               <div>
//                 <p className="text-[10.5px] font-extrabold text-[#405B50]">
//                   Rental record loaded successfully
//                 </p>
//                 <p className="mt-0.5 text-[9px] text-[#98A8A1]">
//                   This screen is read-only. Use Edit Requisition to make changes.
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2.5">
//               <button
//                 type="button"
//                 onClick={() => navigate("/rental-master")}
//                 className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#DCE7E2] bg-white px-4 text-[11px] font-bold text-[#687B72] transition hover:bg-[#F5F9F7] sm:flex-none"
//               >
//                 <ArrowLeft size={14} />
//                 Rental Master
//               </button>

//               <button
//                 type="button"
//                 onClick={() => navigate(`/rental-edit/${rental.rental_id}`)}
//                 className="flex h-10 flex-[1.3] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087A57] to-[#0A9668] px-5 text-[11px] font-extrabold text-white shadow-[0_9px_22px_rgba(8,122,87,0.22)] transition hover:-translate-y-[1px] hover:shadow-[0_12px_28px_rgba(8,122,87,0.27)] active:translate-y-0 sm:flex-none"
//               >
//                 <Pencil size={14} />
//                 Edit Requisition
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }





import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../Admin/Layout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  CreditCard,
  Download,
  FileText,
  Hash,
  IndianRupee,
  Layers3,
  MapPin,
  Package,
  Pencil,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
  UsersRound,
  Wrench,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function RentalView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const rentalId =
    id || location.state?.rental_id || location.state?.rental?.rental_id;

  const [rental, setRental] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!rentalId) {
      setError("No rental ID found.");
      setIsLoading(false);
      return;
    }

    const fetchRentalDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/api/rentals/${rentalId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) throw new Error("Rental not found.");
          if (response.status === 401)
            throw new Error("Session expired. Please login again.");
          throw new Error("Failed to load rental details.");
        }

        const result = await response.json();
        setRental(result.success ? result.data : result);
      } catch (err) {
        console.error("Failed to fetch rental:", err);
        setError(err.message || "Something went wrong while loading rental.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentalDetails();
  }, [rentalId]);

  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const getStatusStyle = (status) => {
    const normalized = String(status || "").toUpperCase();

    if (["ACTIVE", "RUNNING", "DELIVERED"].includes(normalized)) {
      return {
        label: normalized,
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
      };
    }
    if (normalized === "INACTIVE") {
      return {
        label: "INACTIVE",
        badge: "border-amber-200 bg-amber-50 text-amber-700",
        dot: "bg-amber-400",
      };
    }
    if (["CLOSED", "CLOSE", "CANCELLED"].includes(normalized)) {
      return {
        label: normalized,
        badge: "border-slate-200 bg-slate-100 text-slate-600",
        dot: "bg-slate-400",
      };
    }
    return {
      label: normalized || "UNKNOWN",
      badge: "border-[#DCEAE3] bg-[#F4F9F6] text-[#5F776D]",
      dot: "bg-[#7C958A]",
    };
  };

  const getAccessoryNames = () => {
    if (Array.isArray(rental?.accessory_id)) {
      return rental.accessory_id.map(String).filter(Boolean);
    }
    if (typeof rental?.accessory_id === "string") {
      try {
        const parsed = JSON.parse(rental.accessory_id);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {}
    }
    if (Array.isArray(rental?.accessories)) {
      return rental.accessories
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.accessory_name || item?.name || item?.label
        )
        .filter(Boolean);
    }
    return [];
  };

  const getPhotoUrls = () => {
    if (!Array.isArray(rental?.asset_photos)) return [];
    return rental.asset_photos
      .map((photo) => {
        if (typeof photo === "string") return photo;
        return photo?.url || photo?.path || photo?.photo_url || "";
      })
      .filter(Boolean);
  };

  // ===============================
  // PROFESSIONAL PDF GENERATION
  // ===============================
  const generatePDF = () => {
    if (!rental) return;
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      let y = 16;

      // Header bar
      doc.setFillColor(8, 122, 87);
      doc.rect(0, 0, pageWidth, 28, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("ODCom Equipment Rental", margin, 12);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Rental Requisition Report", margin, 19);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`#${rental.rental_id}`, pageWidth - margin, 12, {
        align: "right",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        `Generated: ${new Date().toLocaleString("en-GB")}`,
        pageWidth - margin,
        19,
        { align: "right" }
      );

      y = 38;

      // Status badge
      const status = (rental.status || "Active").toUpperCase();
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(8, 122, 87);
      doc.text(`Status: ${status}`, margin, y);
      y += 8;

      // Section helper
      const sectionTitle = (title) => {
        doc.setFillColor(236, 248, 242);
        doc.rect(margin, y - 4, pageWidth - margin * 2, 7, "F");
        doc.setTextColor(8, 122, 87);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin + 2, y + 1);
        y += 10;
      };

      const addRow = (label, value) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(label, margin, y);
        doc.setTextColor(30, 30, 30);
        doc.setFont("helvetica", "bold");
        doc.text(String(value || "—"), margin + 48, y);
        y += 5.5;
      };

      // 1. Equipment
      sectionTitle("1. EQUIPMENT & DATES");
      addRow("Device Model", rental.device?.device_name);
      addRow("Serial No.", rental.serial_no);
      addRow("Accessories", getAccessoryNames().join(", ") || "—");
      addRow("Deal Type", rental.deal_type);
      addRow("Unit", rental.unit_type);
      addRow("Mode", rental.mode_type);
      addRow("Record Date", formatDate(rental.record_date));
      addRow("Log In Date", formatDate(rental.login_date));
      addRow("Notify Date", formatDate(rental.notify_date));
      addRow("Log Out Date", formatDate(rental.login_out_date));
      addRow("Recall Date", formatDate(rental.recall_date));
      y += 4;

      // 2. Commercial
      sectionTitle("2. COMMERCIAL DETAILS");
      addRow("Billing Type", rental.billing_type);
      addRow("Rental Charge", `₹ ${formatCurrency(rental.rental_charge)}`);
      addRow("Deposit / Advance", `₹ ${formatCurrency(rental.deposit_advance)}`);
      addRow(
        "Installation Charge",
        `₹ ${formatCurrency(rental.installation_charge)}`
      );
      y += 4;

      // 3. Care Center
      sectionTitle("3. CARE CENTER");
      addRow(
        "Care Center",
        rental.careCenter?.carecenter_name ||
          rental.care_center_name ||
          "Direct / Other"
      );
      addRow("POC Mobile", rental.mob_no);
      addRow("Alt Mobile", rental.alternative_mob_no);
      addRow("Bed No.", rental.care_bed_no);
      addRow("POC / Doctor", rental.care_poc_name);
      addRow("Referral", rental.care_referal);
      addRow("Care Address", rental.care_address);
      y += 4;

      // Check page break
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      // 4. Patient
      sectionTitle("4. PATIENT & DELIVERY");
      addRow("Patient Name", rental.patient_name);
      addRow("Age", rental.patient_age ? `${rental.patient_age} Yrs` : "—");
      addRow("Mobile", rental.patient_mob_no);
      addRow("Alt Mobile", rental.patient_alternative_mob_no);
      addRow("Attendant", rental.patient_attendant_name);
      addRow("Delivery Address", rental.patient_delivery_address);
      y += 4;

      // 5. Notes
      if (rental.notes || rental.internal_notes) {
        if (y > 230) {
          doc.addPage();
          y = 20;
        }
        sectionTitle("5. NOTES");

        if (rental.notes) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(80, 80, 80);
          doc.text("Transaction Notes:", margin, y);
          y += 4;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(40, 40, 40);
          const splitNotes = doc.splitTextToSize(
            rental.notes,
            pageWidth - margin * 2
          );
          doc.text(splitNotes, margin, y);
          y += splitNotes.length * 4 + 3;
        }

        if (rental.internal_notes) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(80, 80, 80);
          doc.text("Internal Notes:", margin, y);
          y += 4;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(40, 40, 40);
          const splitInternal = doc.splitTextToSize(
            rental.internal_notes,
            pageWidth - margin * 2
          );
          doc.text(splitInternal, margin, y);
          y += splitInternal.length * 4 + 3;
        }
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(140, 140, 140);
        doc.text(
          `Page ${i} of ${pageCount}  |  ODCom Rental System  |  Confidential`,
          pageWidth / 2,
          287,
          { align: "center" }
        );
      }

      doc.save(`Rental_${rental.rental_id}_${rental.patient_name || "Report"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const statusStyle = rental ? getStatusStyle(rental.status) : null;
  const accessoryNames = rental ? getAccessoryNames() : [];
  const photoUrls = rental ? getPhotoUrls() : [];

  const infoRow = (label, value, Icon = null) => (
    <div className="flex items-start justify-between gap-4 border-b border-[#EDF3F0] py-3 last:border-b-0">
      <div className="flex min-w-0 items-center gap-2.5">
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F8F5] text-[#087A57]">
            <Icon size={14} strokeWidth={2} />
          </span>
        )}
        <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#8A9C94]">
          {label}
        </span>
      </div>
      <div className="max-w-[58%] text-right text-[12px] font-extrabold leading-5 text-[#334F44]">
        {value ?? "—"}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[72vh] items-center justify-center bg-[#F5F9F7] px-4">
          <div className="w-full max-w-sm rounded-[24px] border border-[#E1ECE7] bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7F0] text-[#087A57]">
              <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#B9DCCB] border-t-[#087A57]" />
            </div>
            <h3 className="mt-4 text-[15px] font-extrabold text-[#28463A]">
              Loading Rental Record
            </h3>
            <p className="mt-1.5 text-[10.5px] font-medium text-[#8B9C94]">
              Retrieving complete rental details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !rental) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[72vh] items-center justify-center bg-[#F5F9F7] px-4">
          <div className="w-full max-w-md rounded-[24px] border border-rose-100 bg-white p-7 text-center shadow-lg">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <ShieldCheck size={23} />
            </div>
            <h3 className="mt-4 text-[16px] font-extrabold text-[#2E443A]">
              Unable to load rental
            </h3>
            <p className="mt-2 text-[11px] font-medium text-rose-600">
              {error || "Rental data could not be loaded."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/rental-master")}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-[#DCE7E2] bg-white px-4 text-[11px] font-bold text-[#687B72] hover:bg-[#F5F9F7]"
            >
              <ArrowLeft size={14} />
              Back to Rental Master
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F9F7]">
        <div className="mx-auto w-full max-w-[1480px] space-y-4 px-3 py-4 sm:px-5 lg:px-6">
          {/* HEADER */}
          <section className="relative overflow-hidden rounded-[24px] border border-[#DDEBE4] bg-white shadow-sm">
            <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/rental-master")}
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFEAE5] bg-white text-[#6C8077] hover:bg-[#F4FAF7] hover:text-[#087A57]"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    
                    
                  </div>

                  <h1 className="text-[22px] font-extrabold tracking-tight text-[#183A2F] sm:text-[26px]">
                    Rental Requisition #{rental.rental_id}
                  </h1>
                  
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-[10px] font-extrabold uppercase tracking-wider ${statusStyle.badge}`}
                >
                  <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
                  {statusStyle.label}
                </span>

                <button
                  type="button"
                  onClick={generatePDF}
                  disabled={isGeneratingPdf}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D7EEE4] bg-[#EAF7F0] px-4 text-[10.5px] font-extrabold text-[#087A57] transition hover:bg-[#DDF3E8] disabled:opacity-60"
                >
                  {isGeneratingPdf ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#087A57]/30 border-t-[#087A57]" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Download PDF
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/rental-edit/${rental.rental_id}`)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#087A57] to-[#0A9668] px-4 text-[10.5px] font-extrabold text-white shadow-md transition hover:-translate-y-[1px]"
                >
                  <Pencil size={14} />
                  Edit Requisition
                </button>
              </div>
            </div>
          </section>

         

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Wrench,
                label: "Equipment",
                value: rental.device?.device_name || "—",
              },
              {
                icon: Hash,
                label: "Serial No.",
                value: rental.serial_no || "—",
              },
              {
                icon: UserRound,
                label: "Patient",
                value: rental.patient_name || "—",
              },
              {
                icon: CalendarDays,
                label: "Login Date",
                value: formatDate(rental.login_date),
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-[17px] border border-[#E1ECE7] bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57]">
                    <card.icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#9AA9A2]">
                      {card.label}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] font-extrabold text-[#415A50]">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {/* Equipment */}
            <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-sm">
             

              <div className="p-5">
                <div className="rounded-[16px] border border-[#E3EEE8] bg-[#F9FCFA] px-4 py-3.5">
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#899B93]">
                    Assigned Model
                  </p>
                  <p className="mt-1 text-[14px] font-extrabold text-[#2F4D41]">
                    {rental.device?.device_name || "N/A"}
                  </p>
                  {rental.serial_no && (
                    <p className="mt-1 text-[11px] font-bold text-[#5C7469]">
                      Serial: {rental.serial_no}
                    </p>
                  )}
                  {accessoryNames.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {accessoryNames.map((name, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-[#D9EDE3] bg-[#ECF8F2] px-2 py-1 text-[8.5px] font-bold text-[#087A57]"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                  {infoRow("Deal Type", rental.deal_type, Layers3)}
                  {infoRow("Unit", rental.unit_type, Package)}
                  {infoRow("Mode", rental.mode_type, CreditCard)}
                  {infoRow("Record Date", formatDate(rental.record_date), CalendarDays)}
                  {infoRow("Log In Date", formatDate(rental.login_date), CalendarDays)}
                  {infoRow("Notify Date", formatDate(rental.notify_date), Clock3)}
                  {infoRow("Log Out Date", formatDate(rental.login_out_date), CalendarDays)}
                  {infoRow("Recall Date", formatDate(rental.recall_date), Clock3)}
                </div>
              </div>
            </section>

            {/* Commercial */}
            <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-sm">
             

              <div className="p-5">
                <div className="mb-4 rounded-[16px] border border-[#DDECE5] bg-gradient-to-r from-[#F4FBF7] to-white px-4 py-4">
                  <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#899B93]">
                    Billing Type
                  </p>
                  <p className="mt-1 text-[15px] font-extrabold text-[#087A57]">
                    {rental.billing_type || "—"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    ["Rental Charge", rental.rental_charge],
                    ["Deposit / Advance", rental.deposit_advance],
                    ["Installation", rental.installation_charge],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-[15px] border border-[#E4EDE9] bg-[#FBFDFC] px-4 py-3.5"
                    >
                      <div className="flex items-center gap-1.5 text-[#087A57]">
                        <IndianRupee size={13} />
                        <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8A9C94]">
                          {label}
                        </span>
                      </div>
                      <p className="mt-2 text-[16px] font-extrabold text-[#304E42]">
                        ₹{formatCurrency(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Care Center */}
            <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-sm">
             

              <div className="p-5">
                <div className="mb-3 rounded-[16px] border border-[#E3EEE8] bg-[#F9FCFA] px-4 py-3.5">
                  <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#899B93]">
                    Care Center
                  </p>
                  <p className="mt-1 text-[13px] font-extrabold text-[#304E42]">
                    {rental.careCenter?.carecenter_name ||
                      rental.care_center_name ||
                      "Direct / Other"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                  {infoRow("POC Mobile", rental.mob_no, Phone)}
                  {infoRow("Alt Mobile", rental.alternative_mob_no, Phone)}
                  {infoRow("Bed No", rental.care_bed_no, Building2)}
                  {infoRow("POC / Doctor", rental.care_poc_name, Stethoscope)}
                  {infoRow("Referral", rental.care_referal, UsersRound)}
                </div>

                <div className="mt-3 rounded-[15px] border border-[#E4EDE9] bg-[#FBFDFC] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-[#087A57]" />
                    <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8A9C94]">
                      Care Address
                    </span>
                  </div>
                  <p className="text-[11.5px] font-semibold leading-5 text-[#465F55]">
                    {rental.care_address || "—"}
                  </p>
                </div>
              </div>
            </section>

            {/* Patient */}
            <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-sm">
              

              <div className="p-5">
                <div className="mb-3 rounded-[16px] border border-[#E3EEE8] bg-[#F9FCFA] px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F5EE] text-[#087A57]">
                      <UserRound size={18} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13px] font-extrabold text-[#304E42]">
                          {rental.patient_name || "—"}
                        </p>
                        {rental.patient_age && (
                          <span className="rounded-full border border-[#DDECE5] bg-white px-2 py-0.5 text-[8.5px] font-bold text-[#6C8177]">
                            Age: {rental.patient_age} Yrs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                  {infoRow("Mobile", rental.patient_mob_no, Phone)}
                  {infoRow("Alt Mobile", rental.patient_alternative_mob_no, Phone)}
                  {infoRow("Attendant", rental.patient_attendant_name, UsersRound)}
                </div>

                <div className="mt-3 rounded-[15px] border border-[#E4EDE9] bg-[#FBFDFC] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-[#087A57]" />
                    <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8A9C94]">
                      Delivery Address
                    </span>
                  </div>
                  <p className="text-[11.5px] font-semibold leading-5 text-[#465F55]">
                    {rental.patient_delivery_address || "—"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* NOTES */}
          {(rental.notes || rental.internal_notes) && (
            <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-sm">
              

              <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2">
                {rental.notes && (
                  <div className="rounded-[15px] border border-[#E4EDE9] bg-[#FBFDFC] p-4">
                    <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#8A9C94]">
                      Transaction Notes
                    </p>
                    <p className="whitespace-pre-wrap text-[11.5px] font-medium leading-6 text-[#465F55]">
                      {rental.notes}
                    </p>
                  </div>
                )}
                {rental.internal_notes && (
                  <div className="rounded-[15px] border border-[#E4EDE9] bg-[#FBFDFC] p-4">
                    <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#8A9C94]">
                      Internal Notes
                    </p>
                    <p className="whitespace-pre-wrap text-[11.5px] font-medium leading-6 text-[#465F55]">
                      {rental.internal_notes}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* PHOTOS */}
          {photoUrls.length > 0 && (
            <section className="overflow-hidden rounded-[20px] border border-[#E0ECE6] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#ECF2EF] bg-[#FBFDFC] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57]">
                    <Camera size={17} />
                  </span>
                  <div>
                    <h2 className="text-[13px] font-extrabold text-[#29463B]">
                      06 · Asset Handover Photos
                    </h2>
                  </div>
                </div>
                <span className="rounded-full border border-[#D7EEE4] bg-[#EAF7F0] px-2.5 py-1 text-[9px] font-extrabold text-[#087A57]">
                  {photoUrls.length} Photo{photoUrls.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                {photoUrls.map((photo, index) => {
                  const source = photo.startsWith("http")
                    ? photo
                    : `${API_BASE_URL}${photo}`;
                  return (
                    <a
                      key={index}
                      href={source}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative overflow-hidden rounded-[14px] border border-[#DFEAE5] bg-[#F7FAF8]"
                    >
                      <img
                        src={source}
                        alt={`Photo ${index + 1}`}
                        className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.03]"
                      />
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* FOOTER */}
          <div className="flex flex-col gap-3 rounded-[18px] border border-[#DDE9E4] bg-white px-4 py-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-3">
              <span className="hidden h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57] sm:flex">
                <CheckCircle2 size={17} />
              </span>
              <div>
                <p className="text-[10.5px] font-extrabold text-[#405B50]">
                  Rental record loaded successfully
                </p>
                <p className="mt-0.5 text-[9px] text-[#98A8A1]">
                  This screen is read-only. Use Edit or Download PDF.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/rental-master")}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#DCE7E2] bg-white px-4 text-[11px] font-bold text-[#687B72] hover:bg-[#F5F9F7] sm:flex-none"
              >
                <ArrowLeft size={14} />
                Rental Master
              </button>

              <button
                type="button"
                onClick={generatePDF}
                disabled={isGeneratingPdf}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D7EEE4] bg-[#EAF7F0] px-4 text-[11px] font-extrabold text-[#087A57] hover:bg-[#DDF3E8] disabled:opacity-60"
              >
                <Download size={14} />
                PDF
              </button>

              <button
                type="button"
                onClick={() => navigate(`/rental-edit/${rental.rental_id}`)}
                className="flex h-10 flex-[1.3] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087A57] to-[#0A9668] px-5 text-[11px] font-extrabold text-white shadow-md sm:flex-none"
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}