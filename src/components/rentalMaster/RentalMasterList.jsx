// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import DashboardLayout from "../Admin/Layout";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   Activity,
//   AlertTriangle,
//   Building2,
//   Calculator,
//   CalendarDays,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   Clock3,
//   Eye,
//   Filter,
//   Package,
//   Pencil,
//   Plus,
//   RefreshCw,
//   RotateCcw,
//   Search,
//   SlidersHorizontal,
//   Trash2,
//   UserRound,
//   X,
// } from "lucide-react";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// const RENTAL_FILTER_STORAGE_KEY = "odcom_rental_master_filters_v2";

// const loadSavedRentalFilters = () => {
//   try {
//     return JSON.parse(
//       sessionStorage.getItem(RENTAL_FILTER_STORAGE_KEY) || "{}",
//     );
//   } catch {
//     return {};
//   }
// };

// export default function RentalMasterList({ onEdit, onView, onCreateNew }) {
//   const navigate = useNavigate();
//   const [rentals, setRentals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [careCenters, setCareCenters] = useState([]);

//   const savedFilters = useMemo(() => loadSavedRentalFilters(), []);

//   // Filter Panel States
//   const [searchTerm, setSearchTerm] = useState(savedFilters.searchTerm || "");
//   const [debouncedSearch, setDebouncedSearch] = useState(
//     savedFilters.searchTerm || "",
//   );
//   const [careCenterFilter, setCareCenterFilter] = useState(
//     savedFilters.careCenterFilter || "All",
//   );
//   const [dealTypeFilter, setDealTypeFilter] = useState(
//     savedFilters.dealTypeFilter || "All",
//   );
//   const [unitTypeFilter, setUnitTypeFilter] = useState(
//     savedFilters.unitTypeFilter || "All",
//   );
//   const [modeTypeFilter, setModeTypeFilter] = useState(
//     savedFilters.modeTypeFilter || "All",
//   );
//   const [statusFilter, setStatusFilter] = useState(
//     savedFilters.statusFilter || "All",
//   );

//   // Record Date filter: single date OR date range.
//   const [dateFilterMode, setDateFilterMode] = useState(
//     savedFilters.dateFilterMode || "single",
//   );
//   const [recordDateSingle, setRecordDateSingle] = useState(
//     savedFilters.recordDateSingle || "",
//   );
//   const [recordDateFrom, setRecordDateFrom] = useState(
//     savedFilters.recordDateFrom || "",
//   );
//   const [recordDateTo, setRecordDateTo] = useState(
//     savedFilters.recordDateTo || "",
//   );

//   // Pagination is persisted so returning from View/Edit stays on the same page.
//   const [currentPage, setCurrentPage] = useState(
//     Number(savedFilters.currentPage) > 0
//       ? Number(savedFilters.currentPage)
//       : 1,
//   );
//   const recordsPerPage = 10;
//   const hasInitializedFilters = useRef(false);

//   // Standalone rental-days calculator (not tied to a table row).
//   const [calcModalOpen, setCalcModalOpen] = useState(false);
//   const [editLoginDate, setEditLoginDate] = useState("");
//   const [editLogoutDate, setEditLogoutDate] = useState("");

//   // Debounce search (300ms)
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
//     return () => clearTimeout(t);
//   }, [searchTerm]);

//   // Preserve filters/page while navigating to View/Edit/Create and back.
//   useEffect(() => {
//     sessionStorage.setItem(
//       RENTAL_FILTER_STORAGE_KEY,
//       JSON.stringify({
//         searchTerm,
//         careCenterFilter,
//         dealTypeFilter,
//         unitTypeFilter,
//         modeTypeFilter,
//         statusFilter,
//         dateFilterMode,
//         recordDateSingle,
//         recordDateFrom,
//         recordDateTo,
//         currentPage,
//       }),
//     );
//   }, [
//     searchTerm,
//     careCenterFilter,
//     dealTypeFilter,
//     unitTypeFilter,
//     modeTypeFilter,
//     statusFilter,
//     dateFilterMode,
//     recordDateSingle,
//     recordDateFrom,
//     recordDateTo,
//     currentPage,
//   ]);

//   // Fetch rentals with server-side filters
//   const fetchRentals = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const params = new URLSearchParams();

//       if (debouncedSearch) params.set("search", debouncedSearch);
//       if (dealTypeFilter !== "All") params.set("deal_type", dealTypeFilter);
//       if (unitTypeFilter !== "All") params.set("unit_type", unitTypeFilter);
//       if (modeTypeFilter !== "All") params.set("mode_type", modeTypeFilter);
//       if (careCenterFilter !== "All") {
//         params.set("care_center_id", careCenterFilter);
//       }

//       const query = params.toString();
//       const url = `${API_BASE_URL}/api/rentals${query ? `?${query}` : ""}`;

//       const res = await fetch(url, {
//         headers: { ...(token && { Authorization: `Bearer ${token}` }) },
//       });
//       const result = await res.json();
//       if (result.success) {
//         setRentals(result.data || []);
//       } else {
//         setRentals([]);
//       }
//     } catch (err) {
//       console.error("Error pulling master deployment matrix:", err);
//       setRentals([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     debouncedSearch,
//     dealTypeFilter,
//     unitTypeFilter,
//     modeTypeFilter,
//     careCenterFilter,
//   ]);

//   // Fetch Care Centers for dropdown
//   const fetchCareCenters = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/api/carecenters`, {
//         headers: { ...(token && { Authorization: `Bearer ${token}` }) },
//       });
//       const result = await res.json();
//       const items = Array.isArray(result) ? result : result.data || [];
//       const activeCenters = items.filter((c) => c.status === "active");
//       setCareCenters(activeCenters);
//     } catch (err) {
//       console.error("Failed fetching care center entities:", err);
//       setCareCenters([]);
//     }
//   };

//   useEffect(() => {
//     fetchCareCenters();
//   }, []);

//   useEffect(() => {
//     fetchRentals();
//   }, [fetchRentals]);

//   // Delete handler
//   const handleDeleteClick = async (rentalId) => {
//     const confirmDeletion = window.confirm(
//       "Are you absolutely sure you want to purge this asset rental log record? This action cannot be undone.",
//     );
//     if (!confirmDeletion) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}`, {
//         method: "DELETE",
//         headers: {
//           ...(token && { Authorization: `Bearer ${token}` }),
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();
//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "Failed to drop target record entry from database schema.",
//         );
//       }

//       alert("Rental requisition record successfully dropped.");
//       setRentals((prev) => prev.filter((item) => item.rental_id !== rentalId));
//     } catch (error) {
//       console.error("Deletion lifecycle crash:", error);
//       alert(`Error processing request: ${error.message}`);
//     }
//   };

//   // Reset Filters
//   const handleReset = () => {
//     setSearchTerm("");
//     setDebouncedSearch("");
//     setCareCenterFilter("All");
//     setDealTypeFilter("All");
//     setUnitTypeFilter("All");
//     setModeTypeFilter("All");
//     setStatusFilter("All");
//     setDateFilterMode("single");
//     setRecordDateSingle("");
//     setRecordDateFrom("");
//     setRecordDateTo("");
//     setCurrentPage(1);
//     sessionStorage.removeItem(RENTAL_FILTER_STORAGE_KEY);
//   };

//   // ====================== TOTAL DAYS LOGIC ======================
//   // Same month examples:
//   // 05.08.2026 → 20.08.2026 = 15/15
//   // 11.08.2026 → 21.08.2026 = 10/10
//   // 10.08.2026 → 20.08.2026 = 10/10
//   //
//   // Cross month example:
//   // 20.08.2026 → 06.09.2026 = 17/6   (standard day difference)
//   // 10.08.2026 → 06.09.2026 = 27/6
//   //
//   // Rule:
//   // - totalDays = exact calendar day difference
//   // - Same month  → show totalDays / totalDays   (X/X)
//   // - Different month → show totalDays / logout day
//   const calculateTotalDays = (loginDate, logoutDate, status) => {
//     if (!loginDate) return "0";

//     const start = new Date(loginDate);
//     const end = logoutDate ? new Date(logoutDate) : new Date();

//     // Normalize to midnight to avoid time-of-day issues
//     start.setHours(0, 0, 0, 0);
//     end.setHours(0, 0, 0, 0);

//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

//     const isSameMonth =
//       start.getFullYear() === end.getFullYear() &&
//       start.getMonth() === end.getMonth();

//     // Same month → second number = days themselves (X/X)
//     // Cross month → second number = day of logout/today
//     const secondNumber = isSameMonth ? diffDays : end.getDate();

//     if (!logoutDate) {
//       const upperStatus = (status || "").toUpperCase();
//       if (
//         (upperStatus === "ACTIVE" ||
//           upperStatus === "RUNNING" ||
//           upperStatus === "DELIVERED" ||
//           upperStatus === "PENDING") &&
//         diffDays >= 30
//       ) {
//         return (
//           <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">
//             <AlertTriangle size={12} strokeWidth={2.2} />
//             {diffDays}/{secondNumber} · Due
//           </div>
//         );
//       }
//     }

//     return (
//       <span className="inline-flex rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-slate-100">
//         {diffDays}/{secondNumber}
//       </span>
//     );
//   };

//   const getDaysNumber = (loginDate, logoutDate) => {
//     if (!loginDate) return 0;
//     const start = new Date(loginDate);
//     const end = logoutDate ? new Date(logoutDate) : new Date();
//     start.setHours(0, 0, 0, 0);
//     end.setHours(0, 0, 0, 0);
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     return Math.round(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const getSecondNumber = (loginDate, logoutDate) => {
//     if (!loginDate) return 0;
//     const start = new Date(loginDate);
//     const end = logoutDate ? new Date(logoutDate) : new Date();
//     start.setHours(0, 0, 0, 0);
//     end.setHours(0, 0, 0, 0);

//     const diffDays = getDaysNumber(loginDate, logoutDate);

//     const isSameMonth =
//       start.getFullYear() === end.getFullYear() &&
//       start.getMonth() === end.getMonth();

//     return isSameMonth ? diffDays : end.getDate();
//   };

//   const formatDisplayDate = (dateString) => {
//     if (!dateString) return "N/A";
//     if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
//       const parts = dateString.split("-");
//       const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
//       if (!isNaN(dateObj)) {
//         return dateObj
//           .toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           })
//           .replace(/ /g, "-");
//       }
//     }
//     return dateString;
//   };

//   const openCalcModal = () => {
//     setEditLoginDate("");
//     setEditLogoutDate("");
//     setCalcModalOpen(true);
//   };

//   const closeCalcModal = () => {
//     setCalcModalOpen(false);
//     setEditLoginDate("");
//     setEditLogoutDate("");
//   };

//   const clearCalculator = () => {
//     setEditLoginDate("");
//     setEditLogoutDate("");
//   };

//   // Unique filter options from current result set
//   const uniqueDealTypes = [
//     ...new Set(rentals.map((r) => r.deal_type).filter(Boolean)),
//   ];
//   const uniqueUnitTypes = [
//     ...new Set(rentals.map((r) => r.unit_type).filter(Boolean)),
//   ];
//   const uniqueModeTypes = [
//     ...new Set(rentals.map((r) => r.mode_type).filter(Boolean)),
//   ];

//   const getDateOnly = (value) => {
//     if (!value) return "";

//     if (/^\d{4}-\d{2}-\d{2}/.test(String(value))) {
//       return String(value).slice(0, 10);
//     }

//     const date = new Date(value);
//     if (Number.isNaN(date.getTime())) return "";

//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   // Status + Record Date filters stay client-side so the existing API contract is unchanged.
//   const filteredRentals = useMemo(() => {
//     return rentals.filter((rental) => {
//       const status = (rental.status || "").toUpperCase();

//       let matchesStatus = true;
//       if (statusFilter === "ACTIVE") {
//         matchesStatus = ["ACTIVE", "RUNNING", "DELIVERED"].includes(status);
//       } else if (statusFilter === "PENDING") {
//         matchesStatus = status === "PENDING";
//       } else if (statusFilter === "INACTIVE") {
//         matchesStatus = status === "INACTIVE";
//       } else if (statusFilter === "CLOSED") {
//         matchesStatus = ["CLOSE", "CLOSED", "COMPLETED"].includes(status);
//       } else if (statusFilter !== "All") {
//         matchesStatus = status === statusFilter;
//       }

//       if (!matchesStatus) return false;

//       const recordDate = getDateOnly(rental.record_date);

//       if (dateFilterMode === "single") {
//         if (!recordDateSingle) return true;
//         return recordDate === recordDateSingle;
//       }

//       if (!recordDateFrom && !recordDateTo) return true;
//       if (!recordDate) return false;
//       if (recordDateFrom && recordDate < recordDateFrom) return false;
//       if (recordDateTo && recordDate > recordDateTo) return false;

//       return true;
//     });
//   }, [
//     rentals,
//     statusFilter,
//     dateFilterMode,
//     recordDateSingle,
//     recordDateFrom,
//     recordDateTo,
//   ]);

//   // Operational summary values
//   const summary = useMemo(() => {
//     let active = 0;
//     let pending = 0;
//     let due = 0;

//     rentals.forEach((rental) => {
//       const status = (rental.status || "").toUpperCase();
//       if (["ACTIVE", "RUNNING", "DELIVERED"].includes(status)) active += 1;
//       if (status === "PENDING") pending += 1;

//       if (
//         !rental.login_out_date &&
//         ["ACTIVE", "RUNNING", "DELIVERED", "PENDING"].includes(status) &&
//         getDaysNumber(rental.login_date, rental.login_out_date) >= 30
//       ) {
//         due += 1;
//       }
//     });

//     return { total: rentals.length, active, pending, due };
//   }, [rentals]);

//   // Pagination
//   const totalPages = Math.ceil(filteredRentals.length / recordsPerPage) || 1;
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredRentals.slice(
//     indexOfFirstRecord,
//     indexOfLastRecord,
//   );

//   useEffect(() => {
//     if (!hasInitializedFilters.current) {
//       hasInitializedFilters.current = true;
//       return;
//     }

//     setCurrentPage(1);
//   }, [
//     debouncedSearch,
//     careCenterFilter,
//     dealTypeFilter,
//     unitTypeFilter,
//     modeTypeFilter,
//     statusFilter,
//     dateFilterMode,
//     recordDateSingle,
//     recordDateFrom,
//     recordDateTo,
//   ]);

//   useEffect(() => {
//     if (!loading && currentPage > totalPages) {
//       setCurrentPage(totalPages);
//     }
//   }, [loading, currentPage, totalPages]);

//   const getStatusBadge = (status = "PENDING") => {
//     const upper = status.toUpperCase();

//     if (upper === "ACTIVE" || upper === "RUNNING" || upper === "DELIVERED") {
//       return (
//         <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-emerald-700">
//           <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//           Active
//         </span>
//       );
//     }

//     if (upper === "PENDING") {
//       return (
//         <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-amber-700">
//           <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
//           Pending
//         </span>
//       );
//     }

//     if (["CLOSE", "CLOSED", "COMPLETED"].includes(upper)) {
//       return (
//         <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-600">
//           <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
//           Closed
//         </span>
//       );
//     }

//     if (upper === "INACTIVE") {
//       return (
//         <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-rose-700">
//           <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
//           Inactive
//         </span>
//       );
//     }

//     return (
//       <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
//         {upper || "Unknown"}
//       </span>
//     );
//   };

//   const modalDays = getDaysNumber(editLoginDate, editLogoutDate);
//   const modalSecond = getSecondNumber(editLoginDate, editLogoutDate);

//   const hasRecordDateFilter =
//     dateFilterMode === "single"
//       ? Boolean(recordDateSingle)
//       : Boolean(recordDateFrom || recordDateTo);

//   const activeFilterCount =
//     [
//       careCenterFilter,
//       dealTypeFilter,
//       unitTypeFilter,
//       modeTypeFilter,
//       statusFilter,
//     ].filter((value) => value !== "All").length +
//     (searchTerm.trim() ? 1 : 0) +
//     (hasRecordDateFilter ? 1 : 0);

//   const selectClass =
//     "h-11 w-full appearance-none rounded-xl border border-[#DCEAE4] bg-white px-3 text-[11px] font-bold text-[#496158] outline-none transition hover:border-[#BBD5CA] focus:border-[#0A8B61] focus:ring-4 focus:ring-[#0A8B61]/[0.07] cursor-pointer";

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-[#F5F8F6] px-4 py-5 sm:px-6 lg:px-7">
//         <div className="mx-auto w-full max-w-[1540px] space-y-5">
//           {/* =====================================================
//               PREMIUM PAGE HEADER
//           ====================================================== */}
//           <section className="relative overflow-hidden rounded-[24px] border border-[#DDEBE5] bg-white shadow-[0_10px_35px_rgba(29,91,68,0.06)]">
//             <div className="pointer-events-none absolute inset-0">
//               <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#0A9668]/[0.055] blur-3xl" />
//               <div className="absolute -bottom-24 left-[32%] h-56 w-56 rounded-full bg-[#087A57]/[0.035] blur-3xl" />
//             </div>

//             <div className="relative z-10 flex flex-col gap-6 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
//               <div className="flex min-w-0 items-start gap-4">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#087A57] to-[#0A9668] text-white shadow-[0_10px_24px_rgba(8,122,87,0.22)]">
//                   <Package size={23} strokeWidth={2.1} />
//                 </div>

//                 <div className="min-w-0">
//                   <div className="mb-1 flex flex-wrap items-center gap-2">
//                     <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#0A8B61]">
//                       Equipment Operations
//                     </span>
//                     <span className="h-1 w-1 rounded-full bg-[#B5C8C0]" />
//                     <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
//                       Rental Control
//                     </span>
//                   </div>

//                   <h1 className="text-[23px] font-extrabold tracking-[-0.035em] text-[#183A2F] sm:text-[26px]">
//                     Rental Master
//                   </h1>
//                   <p className="mt-1 max-w-[620px] text-[12px] font-medium leading-5 text-[#7D9188]">
//                     Track deployed medical equipment, rental duration, status and operational actions from one workspace.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-wrap items-center gap-2.5">
//                 <button
//                   type="button"
//                   onClick={openCalcModal}
//                   className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#D7E9E0] bg-[#F1F9F5] text-[#087A57] shadow-sm transition hover:-translate-y-[1px] hover:border-[#B8D9CA] hover:bg-[#EAF7F0] hover:shadow-md"
//                   title="Rental days calculator"
//                   aria-label="Open rental days calculator"
//                 >
//                   <Calculator size={17} strokeWidth={2.2} />
//                 </button>

//                 <button
//                   type="button"
//                   onClick={fetchRentals}
//                   disabled={loading}
//                   className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#DCE9E4] bg-white px-4 text-[11px] font-bold text-[#61776E] shadow-sm transition hover:border-[#C3DAD0] hover:bg-[#F8FBF9] hover:text-[#087A57] disabled:cursor-not-allowed disabled:opacity-50"
//                   title="Refresh rental records"
//                 >
//                   <RefreshCw
//                     size={15}
//                     className={loading ? "animate-spin" : ""}
//                   />
//                   Refresh
//                 </button>

//                 <button
//                   onClick={() => navigate("/rental-requisition")}
//                   className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087A57] to-[#0A9668] px-5 text-[11px] font-extrabold text-white shadow-[0_9px_22px_rgba(8,122,87,0.22)] transition hover:-translate-y-[1px] hover:shadow-[0_12px_28px_rgba(8,122,87,0.28)] active:translate-y-0"
//                 >
//                   <Plus size={16} strokeWidth={2.5} />
//                   Log New Requisition
//                 </button>
//               </div>
//             </div>

//           </section>

//           {/* =====================================================
//               FILTER CONTROL PANEL
//           ====================================================== */}
//           <section className="rounded-[20px] border border-[#DDE9E4] bg-white p-4 shadow-[0_8px_28px_rgba(29,91,68,0.045)]">
//             <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
//               <div className="flex items-center gap-2.5">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EEF8F3] text-[#087A57]">
//                   <SlidersHorizontal size={15} />
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-extrabold text-[#334E43]">Find rental records</p>
//                   <p className="mt-0.5 text-[9px] font-medium text-slate-400">
//                     Search or narrow the master list using operational filters.
//                   </p>
//                 </div>
//               </div>

//               {activeFilterCount > 0 && (
//                 <div className="flex items-center gap-2">
//                   <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8EEE4] bg-[#EDF8F3] px-2.5 py-1 text-[9px] font-extrabold text-[#087A57]">
//                     <Filter size={11} />
//                     {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={handleReset}
//                     className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[9px] font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
//                   >
//                     <RotateCcw size={12} />
//                     Clear all
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-[minmax(300px,1.8fr)_repeat(5,minmax(130px,1fr))_auto]">
//               {/* Search */}
//               <div className="relative">
//                 <Search
//                   size={16}
//                   className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8EA49B]"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search patient, phone, equipment, care center..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="h-11 w-full rounded-xl border border-[#DCEAE4] bg-[#FBFDFC] pl-10 pr-10 text-[11px] font-semibold text-[#415B50] outline-none transition placeholder:font-medium placeholder:text-[#A4B5AE] hover:border-[#C7DBD2] focus:border-[#0A8B61] focus:bg-white focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
//                 />
//                 {searchTerm && (
//                   <button
//                     type="button"
//                     onClick={() => setSearchTerm("")}
//                     className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
//                     aria-label="Clear search"
//                     title="Clear search"
//                   >
//                     <X size={13} />
//                   </button>
//                 )}
//               </div>

//               {/* Care Center */}
//               <select
//                 value={careCenterFilter}
//                 onChange={(e) => setCareCenterFilter(e.target.value)}
//                 className={selectClass}
//                 title="Filter by care center"
//               >
//                 <option value="All">Care Center · All</option>
//                 {careCenters.map((center) => (
//                   <option
//                     key={center.carecenter_id}
//                     value={String(center.carecenter_id)}
//                   >
//                     {center.carecenter_name}
//                   </option>
//                 ))}
//               </select>

//               {/* Deal Type */}
//               <select
//                 value={dealTypeFilter}
//                 onChange={(e) => setDealTypeFilter(e.target.value)}
//                 className={selectClass}
//                 title="Filter by deal type"
//               >
//                 <option value="All">Deal · All</option>
//                 {uniqueDealTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//                 {!uniqueDealTypes.includes("B2B") && <option value="B2B">B2B</option>}
//                 {!uniqueDealTypes.includes("B2C") && <option value="B2C">B2C</option>}
//               </select>

//               {/* Unit */}
//               <select
//                 value={unitTypeFilter}
//                 onChange={(e) => setUnitTypeFilter(e.target.value)}
//                 className={selectClass}
//                 title="Filter by unit"
//               >
//                 <option value="All">Unit · All</option>
//                 {uniqueUnitTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//                 {!uniqueUnitTypes.includes("CWF") && <option value="CWF">BWF</option>}
//                 {!uniqueUnitTypes.includes("ODCOM") && <option value="ODCOM">ODCOM</option>}
//               </select>

//               {/* Mode */}
//               <select
//                 value={modeTypeFilter}
//                 onChange={(e) => setModeTypeFilter(e.target.value)}
//                 className={selectClass}
//                 title="Filter by payment mode"
//               >
//                 <option value="All">Mode · All</option>
//                 {uniqueModeTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//                 {!uniqueModeTypes.includes("Prepaid") && <option value="Prepaid">Prepaid</option>}
//                 {!uniqueModeTypes.includes("Postpaid") && <option value="Postpaid">Postpaid</option>}
//               </select>

//               {/* Status - client-side only */}
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className={selectClass}
//                 title="Filter by rental status"
//               >
//                 <option value="All">Status · All</option>
//                 <option value="ACTIVE">Active</option>
//                 <option value="PENDING">Pending</option>
//                 <option value="INACTIVE">Inactive</option>
//                 <option value="CLOSED">Closed</option>
//               </select>

//               <button
//                 type="button"
//                 onClick={handleReset}
//                 disabled={activeFilterCount === 0}
//                 className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[#DCE9E4] bg-white px-3 text-[10px] font-bold text-[#70867C] transition hover:bg-[#F7FAF8] hover:text-[#087A57] disabled:cursor-not-allowed disabled:opacity-40"
//                 title="Reset filters"
//               >
//                 <RotateCcw size={13} />
//                 Reset
//               </button>
//             </div>

//             {/* Record Date Search */}
//             <div className="mt-3 border-t border-[#EDF3F0] pt-3">
//               <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//                 <div className="flex items-center gap-2.5">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EEF8F3] text-[#087A57]">
//                     <CalendarDays size={15} />
//                   </div>
//                   <div>
//                     <p className="text-[10.5px] font-extrabold text-[#395448]">
//                       Record Date Search
//                     </p>
//                     <p className="mt-0.5 text-[8.5px] font-medium text-slate-400">
//                       Find rentals recorded on one date or between two dates.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//                   <div className="inline-flex rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] p-1">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setDateFilterMode("single");
//                         setRecordDateFrom("");
//                         setRecordDateTo("");
//                       }}
//                       className={`h-8 rounded-lg px-3 text-[9.5px] font-extrabold transition ${
//                         dateFilterMode === "single"
//                           ? "bg-white text-[#087A57] shadow-sm ring-1 ring-[#D7E8E0]"
//                           : "text-[#7A8D84] hover:text-[#456057]"
//                       }`}
//                     >
//                       Single Date
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setDateFilterMode("range");
//                         setRecordDateSingle("");
//                       }}
//                       className={`h-8 rounded-lg px-3 text-[9.5px] font-extrabold transition ${
//                         dateFilterMode === "range"
//                           ? "bg-white text-[#087A57] shadow-sm ring-1 ring-[#D7E8E0]"
//                           : "text-[#7A8D84] hover:text-[#456057]"
//                       }`}
//                     >
//                       Date Range
//                     </button>
//                   </div>

//                   {dateFilterMode === "single" ? (
//                     <div className="relative min-w-[190px]">
//                       <CalendarDays
//                         size={14}
//                         className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA199]"
//                       />
//                       <input
//                         type="date"
//                         value={recordDateSingle}
//                         onChange={(e) => setRecordDateSingle(e.target.value)}
//                         className="h-10 w-full rounded-xl border border-[#DCE9E4] bg-white pl-9 pr-3 text-[10.5px] font-bold text-[#496158] outline-none transition focus:border-[#0A8B61] focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
//                         title="Search by exact record date"
//                       />
//                     </div>
//                   ) : (
//                     <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//                       <div className="relative min-w-[175px]">
//                         <CalendarDays
//                           size={14}
//                           className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA199]"
//                         />
//                         <input
//                           type="date"
//                           value={recordDateFrom}
//                           max={recordDateTo || undefined}
//                           onChange={(e) => setRecordDateFrom(e.target.value)}
//                           className="h-10 w-full rounded-xl border border-[#DCE9E4] bg-white pl-9 pr-3 text-[10.5px] font-bold text-[#496158] outline-none transition focus:border-[#0A8B61] focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
//                           title="Record date from"
//                         />
//                       </div>

//                       <span className="hidden text-[9px] font-bold text-[#9AABA3] sm:inline">
//                         to
//                       </span>

//                       <div className="relative min-w-[175px]">
//                         <CalendarDays
//                           size={14}
//                           className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA199]"
//                         />
//                         <input
//                           type="date"
//                           value={recordDateTo}
//                           min={recordDateFrom || undefined}
//                           onChange={(e) => setRecordDateTo(e.target.value)}
//                           className="h-10 w-full rounded-xl border border-[#DCE9E4] bg-white pl-9 pr-3 text-[10.5px] font-bold text-[#496158] outline-none transition focus:border-[#0A8B61] focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
//                           title="Record date to"
//                         />
//                       </div>
//                     </div>
//                   )}

//                   {hasRecordDateFilter && (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setRecordDateSingle("");
//                         setRecordDateFrom("");
//                         setRecordDateTo("");
//                       }}
//                       className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#DCE9E4] bg-white px-3 text-[9.5px] font-bold text-[#73877E] transition hover:bg-[#F6FAF8] hover:text-[#087A57]"
//                       title="Clear record date filter"
//                     >
//                       <X size={12} />
//                       Clear Date
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* =====================================================
//               TABLE
//           ====================================================== */}
//           <section className="overflow-hidden rounded-[20px] border border-[#DCE9E4] bg-white shadow-[0_8px_30px_rgba(29,91,68,0.05)]">
//             <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBF2EE] px-5 py-3.5">
//               <div>
//                 <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#60786E]">
//                   Rental register
//                 </p>
//                 <p className="mt-0.5 text-[9px] font-medium text-slate-400">
//                   {filteredRentals.length} {filteredRentals.length === 1 ? "record" : "records"} currently shown
//                 </p>
//               </div>

//               <div className="hidden items-center gap-1.5 text-[9px] font-medium text-slate-400 sm:flex">
//                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                 Live operational data
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-24">
//                 <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF8F3]">
//                   <RefreshCw size={20} className="animate-spin text-[#087A57]" />
//                 </div>
//                 <p className="mt-4 text-[12px] font-bold text-[#60766D]">Loading rental records</p>
//                 <p className="mt-1 text-[10px] font-medium text-slate-400">Syncing current equipment operations…</p>
//               </div>
//             ) : filteredRentals.length === 0 ? (
//               <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E0EDE7] bg-[#F5FAF7] text-[#7A9489]">
//                   <Package size={24} />
//                 </div>
//                 <h3 className="mt-4 text-[14px] font-extrabold text-[#314D42]">No rental records found</h3>
//                 <p className="mt-1 max-w-[380px] text-[10px] font-medium leading-5 text-slate-400">
//                   Try changing the filters or create a new equipment rental requisition.
//                 </p>
//                 <div className="mt-4 flex items-center gap-2">
//                   {activeFilterCount > 0 && (
//                     <button
//                       type="button"
//                       onClick={handleReset}
//                       className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#DDE9E4] bg-white px-3 text-[10px] font-bold text-[#60776D] hover:bg-slate-50"
//                     >
//                       <RotateCcw size={13} />
//                       Clear filters
//                     </button>
//                   )}
//                   <button
//                     type="button"
//                     onClick={() => navigate("/rental-requisition")}
//                     className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#087A57] px-3.5 text-[10px] font-bold text-white hover:bg-[#066B4D]"
//                   >
//                     <Plus size={13} />
//                     New requisition
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <table className="w-full min-w-[1080px] border-collapse text-left">
//                     <thead>
//                       <tr className="border-b border-[#E8F0EC] bg-[#F8FBF9] text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#82968D]">
//                         <th className="px-5 py-3.5">Equipment</th>
//                         <th className="px-5 py-3.5">Patient / Client</th>
//                         <th className="px-5 py-3.5">Login Date</th>
//                         <th className="px-5 py-3.5">Logout Date</th>
//                         <th className="px-5 py-3.5">Rental Days</th>
//                         <th className="px-5 py-3.5">Status</th>
//                         <th className="px-5 py-3.5 text-center">Actions</th>
//                       </tr>
//                     </thead>

//                     <tbody className="divide-y divide-[#EEF3F0]">
//                       {currentRecords.map((rental) => {
//                         const displayDeviceModel =
//                           rental.device?.device_name || "Equipment Asset";
//                         const days = getDaysNumber(
//                           rental.login_date,
//                           rental.login_out_date,
//                         );
//                         const upperStatus = (rental.status || "").toUpperCase();
//                         const isDue =
//                           !rental.login_out_date &&
//                           ["ACTIVE", "RUNNING", "DELIVERED", "PENDING"].includes(
//                             upperStatus,
//                           ) &&
//                           days >= 30;

//                         return (
//                           <tr
//                             key={rental.rental_id}
//                             className={`group transition-colors ${
//                               isDue
//                                 ? "bg-amber-50/[0.28] hover:bg-amber-50/60"
//                                 : "hover:bg-[#F9FBFA]"
//                             }`}
//                           >
//                             {/* Equipment */}
//                             <td className="px-5 py-4 align-middle">
//                               <div className="flex items-center gap-3">
//                                 <div
//                                   className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border ${
//                                     isDue
//                                       ? "border-amber-200 bg-amber-50 text-amber-700"
//                                       : "border-[#DDECE5] bg-[#F1F8F4] text-[#087A57]"
//                                   }`}
//                                 >
//                                   <Package size={17} />
//                                 </div>
//                                 <div className="min-w-0">
//                                   <p className="max-w-[230px] truncate text-[12px] font-extrabold text-[#28473B]">
//                                     {displayDeviceModel}
//                                   </p>
//                                   <div className="mt-1 flex flex-wrap items-center gap-1.5">
//                                     <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[8.5px] font-bold text-slate-500">
//                                       #{rental.rental_id}
//                                     </span>
//                                     {rental.unit_type && (
//                                       <span className="text-[9px] font-semibold text-slate-400">
//                                         {rental.unit_type}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>

//                             {/* Patient */}
//                             <td className="px-5 py-4 align-middle">
//                               <div className="flex items-center gap-2.5">
//                                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#F4F7F5] text-[#80958B]">
//                                   <UserRound size={14} />
//                                 </div>
//                                 <div className="min-w-0">
//                                   <p className="max-w-[180px] truncate text-[11px] font-bold text-[#3B544A]">
//                                     {rental.patient_name || "N/A"}
//                                   </p>
//                                   {(rental.carecenter?.carecenter_name ||
//                                     rental.care_center?.carecenter_name) && (
//                                     <p className="mt-0.5 flex max-w-[180px] items-center gap-1 truncate text-[8.5px] font-medium text-slate-400">
//                                       <Building2 size={9} />
//                                       {rental.carecenter?.carecenter_name ||
//                                         rental.care_center?.carecenter_name}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                             </td>

//                             {/* Login */}
//                             <td className="px-5 py-4 align-middle">
//                               <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold text-[#5D7369]">
//                                 <CalendarDays size={13} className="text-[#91A59C]" />
//                                 {formatDisplayDate(rental.login_date)}
//                               </div>
//                             </td>

//                             {/* Logout */}
//                             <td className="px-5 py-4 align-middle">
//                               <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold text-[#5D7369]">
//                                 <CalendarDays size={13} className="text-[#91A59C]" />
//                                 {formatDisplayDate(rental.login_out_date)}
//                               </div>
//                             </td>

//                             {/* Days */}
//                             <td className="px-5 py-4 align-middle">
//                               {calculateTotalDays(
//                                 rental.login_date,
//                                 rental.login_out_date,
//                                 rental.status,
//                               )}
//                             </td>

//                             {/* Status */}
//                             <td className="px-5 py-4 align-middle">
//                               {getStatusBadge(rental.status)}
//                             </td>

//                             {/* Actions */}
//                             <td className="px-5 py-4 align-middle">
//                               <div className="flex items-center justify-center gap-1.5">

//                                 <Link
//                                   to={`/rental-view/${rental.rental_id}`}
//                                   className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-[1px] hover:border-[#CBDAD3] hover:bg-[#F7FAF8] hover:text-[#087A57] hover:shadow-sm"
//                                   title="View rental"
//                                   aria-label={`View rental ${rental.rental_id}`}
//                                 >
//                                   <Eye size={14} strokeWidth={2} />
//                                 </Link>

//                                 <Link
//                                   to={`/rental-edit/${rental.rental_id}`}
//                                   className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#CFE7DC] bg-[#EEF8F3] text-[#087A57] transition hover:-translate-y-[1px] hover:border-[#ABD5C3] hover:bg-[#E4F4EC] hover:shadow-sm"
//                                   title="Edit rental"
//                                   aria-label={`Edit rental ${rental.rental_id}`}
//                                 >
//                                   <Pencil size={14} strokeWidth={2.1} />
//                                 </Link>

//                                 <button
//                                   type="button"
//                                   onClick={() => handleDeleteClick(rental.rental_id)}
//                                   className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-rose-200 bg-rose-50 text-rose-600 transition hover:-translate-y-[1px] hover:bg-rose-100 hover:text-rose-700 hover:shadow-sm"
//                                   title="Delete rental"
//                                   aria-label={`Delete rental ${rental.rental_id}`}
//                                 >
//                                   <Trash2 size={14} strokeWidth={2.1} />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex flex-col items-center justify-between gap-3 border-t border-[#EAF1ED] bg-[#FBFDFC] px-5 py-3.5 sm:flex-row">
//                   <p className="text-[10px] font-medium text-[#7D9188]">
//                     Showing <span className="font-bold text-[#4F695E]">{indexOfFirstRecord + 1}</span>–
//                     <span className="font-bold text-[#4F695E]">
//                       {Math.min(indexOfLastRecord, filteredRentals.length)}
//                     </span>{" "}
//                     of <span className="font-bold text-[#4F695E]">{filteredRentals.length}</span> records
//                   </p>

//                   <div className="flex items-center gap-1.5">
//                     <button
//                       type="button"
//                       onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCE8E3] bg-white text-[#60786E] transition hover:border-[#C6DBD1] hover:bg-[#F6FAF8] disabled:cursor-not-allowed disabled:opacity-35"
//                       title="Previous page"
//                       aria-label="Previous page"
//                     >
//                       <ChevronLeft size={14} />
//                     </button>

//                     {Array.from({ length: totalPages }, (_, i) => i + 1)
//                       .filter((page) => {
//                         return (
//                           page === 1 ||
//                           page === totalPages ||
//                           Math.abs(page - currentPage) <= 1
//                         );
//                       })
//                       .map((page, idx, arr) => {
//                         const prevPage = arr[idx - 1];
//                         const showEllipsis = prevPage && page - prevPage > 1;
//                         return (
//                           <React.Fragment key={page}>
//                             {showEllipsis && (
//                               <span className="px-1 text-[10px] text-slate-400">…</span>
//                             )}
//                             <button
//                               type="button"
//                               onClick={() => setCurrentPage(page)}
//                               className={`h-8 min-w-[32px] rounded-lg border px-2 text-[10px] font-extrabold transition ${
//                                 currentPage === page
//                                   ? "border-[#087A57] bg-[#087A57] text-white shadow-sm"
//                                   : "border-[#DCE8E3] bg-white text-[#60786E] hover:bg-[#F6FAF8]"
//                               }`}
//                             >
//                               {page}
//                             </button>
//                           </React.Fragment>
//                         );
//                       })}

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                       }
//                       disabled={currentPage === totalPages}
//                       className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCE8E3] bg-white text-[#60786E] transition hover:border-[#C6DBD1] hover:bg-[#F6FAF8] disabled:cursor-not-allowed disabled:opacity-35"
//                       title="Next page"
//                       aria-label="Next page"
//                     >
//                       <ChevronRight size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </section>
//         </div>
//       </div>

//       {/* =====================================================
//           CALCULATE DAYS MODAL
//       ====================================================== */}
//       {calcModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <button
//             type="button"
//             aria-label="Close calculator"
//             className="absolute inset-0 cursor-default bg-[#10251D]/45 backdrop-blur-[3px]"
//             onClick={closeCalcModal}
//           />

//           <div className="relative w-full max-w-[480px] overflow-hidden rounded-[22px] border border-white/30 bg-white shadow-[0_28px_80px_rgba(16,55,41,0.28)]">
//             {/* Modal header */}
//             <div className="relative overflow-hidden bg-gradient-to-r from-[#075F46] to-[#0A8E63] px-5 py-5 text-white">
//               <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full border border-white/[0.08]" />
//               <div className="relative z-10 flex items-start justify-between gap-4">
//                 <div className="flex items-start gap-3">
//                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white/[0.12] ring-1 ring-white/[0.12]">
//                     <Calculator size={18} />
//                   </div>
//                   <div>
//                     <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-emerald-100/65">
//                       Rental duration tool
//                     </p>
//                     <h3 className="mt-1 text-[16px] font-extrabold tracking-tight">
//                       Calculate Total Days
//                     </h3>
//                     <p className="mt-1 max-w-[310px] text-[10px] font-medium text-emerald-50/65">
//                       Calculation purpose only · does not change any rental record
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={closeCalcModal}
//                   className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-white/[0.08] text-white/70 transition hover:bg-white/[0.14] hover:text-white"
//                   aria-label="Close"
//                   title="Close"
//                 >
//                   <X size={15} />
//                 </button>
//               </div>
//             </div>

//             <div className="p-5">
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#71887E]">
//                     Login Date
//                   </label>
//                   <div className="relative">
//                     <CalendarDays
//                       size={14}
//                       className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA199]"
//                     />
//                     <input
//                       type="date"
//                       value={editLoginDate}
//                       onChange={(e) => setEditLoginDate(e.target.value)}
//                       className="h-11 w-full rounded-xl border border-[#DCE9E4] bg-[#FBFDFC] pl-9 pr-3 text-[11px] font-semibold text-[#425B51] outline-none transition focus:border-[#0A8B61] focus:bg-white focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#71887E]">
//                     Logout Date
//                   </label>
//                   <div className="relative">
//                     <CalendarDays
//                       size={14}
//                       className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA199]"
//                     />
//                     <input
//                       type="date"
//                       value={editLogoutDate}
//                       onChange={(e) => setEditLogoutDate(e.target.value)}
//                       className="h-11 w-full rounded-xl border border-[#DCE9E4] bg-[#FBFDFC] pl-9 pr-3 text-[11px] font-semibold text-[#425B51] outline-none transition focus:border-[#0A8B61] focus:bg-white focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <p className="mt-2 text-[9px] font-medium text-slate-400">
//                 Leave logout date empty to calculate duration through today.
//               </p>

//               {/* Result */}
//               <div className={`mt-5 rounded-[18px] border p-5 text-center ${
//                 !editLogoutDate && modalDays >= 30
//                   ? "border-amber-200 bg-amber-50"
//                   : "border-[#DCECE5] bg-[#F4FAF7]"
//               }`}>
//                 <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#087A57] shadow-sm ring-1 ring-black/[0.03]">
//                   <Clock3 size={16} />
//                 </div>
//                 <p className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#7A9187]">
//                   Calculated rental days
//                 </p>
//                 <div className="mt-1.5 flex items-baseline justify-center gap-1.5">
//                   <span className="text-[30px] font-black tracking-[-0.04em] text-[#087A57]">
//                     {modalDays}
//                   </span>
//                   <span className="text-[15px] font-bold text-[#82958D]">/ {modalSecond}</span>
//                 </div>
//                 {!editLogoutDate && modalDays >= 30 && (
//                   <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white/70 px-2.5 py-1 text-[9px] font-extrabold text-amber-700">
//                     <AlertTriangle size={11} />
//                     Due threshold reached
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center justify-between gap-2 border-t border-[#E9F0ED] bg-[#FBFDFC] px-5 py-4">
//               <p className="hidden text-[8.5px] font-medium text-[#98A9A1] sm:block">
//                 Calculator values are temporary and are not saved.
//               </p>

//               <div className="ml-auto flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={clearCalculator}
//                   disabled={!editLoginDate && !editLogoutDate}
//                   className="h-10 rounded-xl border border-[#DCE8E3] bg-white px-4 text-[10px] font-bold text-[#687E74] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   Clear
//                 </button>

//                 <button
//                   type="button"
//                   onClick={closeCalcModal}
//                   className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#087A57] to-[#0A9668] px-4 text-[10px] font-extrabold text-white shadow-[0_8px_18px_rgba(8,122,87,0.2)] transition hover:-translate-y-[1px]"
//                 >
//                   <CheckCircle2 size={13} />
//                   Done
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import DashboardLayout from "../Admin/Layout";
import { useNavigate, Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Building2,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  Hash,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const RENTAL_FILTER_STORAGE_KEY = "odcom_rental_master_filters_v2";

const loadSavedRentalFilters = () => {
  try {
    return JSON.parse(
      sessionStorage.getItem(RENTAL_FILTER_STORAGE_KEY) || "{}",
    );
  } catch {
    return {};
  }
};

export default function RentalMasterList({ onEdit, onView, onCreateNew }) {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [careCenters, setCareCenters] = useState([]);

  const savedFilters = useMemo(() => loadSavedRentalFilters(), []);

  // Filter Panel States
  const [searchTerm, setSearchTerm] = useState(savedFilters.searchTerm || "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    savedFilters.searchTerm || "",
  );
  const [careCenterFilter, setCareCenterFilter] = useState(
    savedFilters.careCenterFilter || "All",
  );
  const [dealTypeFilter, setDealTypeFilter] = useState(
    savedFilters.dealTypeFilter || "All",
  );
  const [unitTypeFilter, setUnitTypeFilter] = useState(
    savedFilters.unitTypeFilter || "All",
  );
  const [modeTypeFilter, setModeTypeFilter] = useState(
    savedFilters.modeTypeFilter || "All",
  );
  const [statusFilter, setStatusFilter] = useState(
    savedFilters.statusFilter || "All",
  );

  // Record Date filter: single date OR date range.
  const [dateFilterMode, setDateFilterMode] = useState(
    savedFilters.dateFilterMode || "single",
  );
  const [recordDateSingle, setRecordDateSingle] = useState(
    savedFilters.recordDateSingle || "",
  );
  const [recordDateFrom, setRecordDateFrom] = useState(
    savedFilters.recordDateFrom || "",
  );
  const [recordDateTo, setRecordDateTo] = useState(
    savedFilters.recordDateTo || "",
  );

  // Pagination is persisted so returning from View/Edit stays on the same page.
  const [currentPage, setCurrentPage] = useState(
    Number(savedFilters.currentPage) > 0 ? Number(savedFilters.currentPage) : 1,
  );
  const recordsPerPage = 10;
  const hasInitializedFilters = useRef(false);

  // Standalone rental-days calculator (not tied to a table row).
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [editLoginDate, setEditLoginDate] = useState("");
  const [editLogoutDate, setEditLogoutDate] = useState("");

  // Debounce search (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Preserve filters/page while navigating to View/Edit/Create and back.
  useEffect(() => {
    sessionStorage.setItem(
      RENTAL_FILTER_STORAGE_KEY,
      JSON.stringify({
        searchTerm,
        careCenterFilter,
        dealTypeFilter,
        unitTypeFilter,
        modeTypeFilter,
        statusFilter,
        dateFilterMode,
        recordDateSingle,
        recordDateFrom,
        recordDateTo,
        currentPage,
      }),
    );
  }, [
    searchTerm,
    careCenterFilter,
    dealTypeFilter,
    unitTypeFilter,
    modeTypeFilter,
    statusFilter,
    dateFilterMode,
    recordDateSingle,
    recordDateFrom,
    recordDateTo,
    currentPage,
  ]);

  // Fetch rentals with server-side filters
  const fetchRentals = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (debouncedSearch) params.set("search", debouncedSearch);
      if (dealTypeFilter !== "All") params.set("deal_type", dealTypeFilter);
      if (unitTypeFilter !== "All") params.set("unit_type", unitTypeFilter);
      if (modeTypeFilter !== "All") params.set("mode_type", modeTypeFilter);
      if (careCenterFilter !== "All") {
        params.set("care_center_id", careCenterFilter);
      }

      const query = params.toString();
      const url = `${API_BASE_URL}/api/rentals${query ? `?${query}` : ""}`;

      const res = await fetch(url, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const result = await res.json();
      if (result.success) {
        setRentals(result.data || []);
      } else {
        setRentals([]);
      }
    } catch (err) {
      console.error("Error pulling master deployment matrix:", err);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    dealTypeFilter,
    unitTypeFilter,
    modeTypeFilter,
    careCenterFilter,
  ]);

  // Fetch Care Centers for dropdown
  const fetchCareCenters = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/carecenters`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      const result = await res.json();
      const items = Array.isArray(result) ? result : result.data || [];
      const activeCenters = items.filter((c) => c.status === "active");
      setCareCenters(activeCenters);
    } catch (err) {
      console.error("Failed fetching care center entities:", err);
      setCareCenters([]);
    }
  };

  useEffect(() => {
    fetchCareCenters();
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  // Delete handler
  const handleDeleteClick = async (rentalId) => {
    const confirmDeletion = window.confirm(
      "Are you absolutely sure you want to purge this asset rental log record? This action cannot be undone.",
    );
    if (!confirmDeletion) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to drop target record entry from database schema.",
        );
      }

      alert("Rental requisition record successfully dropped.");
      setRentals((prev) => prev.filter((item) => item.rental_id !== rentalId));
    } catch (error) {
      console.error("Deletion lifecycle crash:", error);
      alert(`Error processing request: ${error.message}`);
    }
  };

  // Reset Filters
  const handleReset = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setCareCenterFilter("All");
    setDealTypeFilter("All");
    setUnitTypeFilter("All");
    setModeTypeFilter("All");
    setStatusFilter("All");
    setDateFilterMode("single");
    setRecordDateSingle("");
    setRecordDateFrom("");
    setRecordDateTo("");
    setCurrentPage(1);
    sessionStorage.removeItem(RENTAL_FILTER_STORAGE_KEY);
  };

  // ====================== TOTAL DAYS LOGIC ======================
  // Same month examples:
  // 05.08.2026 → 20.08.2026 = 15/15
  // 11.08.2026 → 21.08.2026 = 10/10
  // 10.08.2026 → 20.08.2026 = 10/10
  //
  // Cross month example:
  // 20.08.2026 → 06.09.2026 = 17/6   (standard day difference)
  // 10.08.2026 → 06.09.2026 = 27/6
  //
  // Rule:
  // - totalDays = exact calendar day difference
  // - Same month  → show totalDays / totalDays   (X/X)
  // - Different month → show totalDays / logout day
  const calculateTotalDays = (loginDate, logoutDate, status) => {
    if (!loginDate) return "0";

    const start = new Date(loginDate);
    const end = logoutDate ? new Date(logoutDate) : new Date();

    // Normalize to midnight to avoid time-of-day issues
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const isSameMonth =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth();

    // Same month → second number = days themselves (X/X)
    // Cross month → second number = day of logout/today
    const secondNumber = isSameMonth ? diffDays : end.getDate();

    if (!logoutDate) {
      const upperStatus = (status || "").toUpperCase();
      if (
        (upperStatus === "ACTIVE" ||
          upperStatus === "RUNNING" ||
          upperStatus === "DELIVERED" ||
          upperStatus === "PENDING") &&
        diffDays >= 30
      ) {
        return (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">
            <AlertTriangle size={12} strokeWidth={2.2} />
            {diffDays}/{secondNumber} · Due
          </div>
        );
      }
    }

    return (
      <span className="inline-flex rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-slate-100">
        {diffDays}/{secondNumber}
      </span>
    );
  };

  const getDaysNumber = (loginDate, logoutDate) => {
    if (!loginDate) return 0;
    const start = new Date(loginDate);
    const end = logoutDate ? new Date(logoutDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const getSecondNumber = (loginDate, logoutDate) => {
    if (!loginDate) return 0;
    const start = new Date(loginDate);
    const end = logoutDate ? new Date(logoutDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffDays = getDaysNumber(loginDate, logoutDate);

    const isSameMonth =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth();

    return isSameMonth ? diffDays : end.getDate();
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "N/A";
    if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
      const parts = dateString.split("-");
      const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!isNaN(dateObj)) {
        return dateObj
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-");
      }
    }
    return dateString;
  };

  const openCalcModal = () => {
    setEditLoginDate("");
    setEditLogoutDate("");
    setCalcModalOpen(true);
  };

  const closeCalcModal = () => {
    setCalcModalOpen(false);
    setEditLoginDate("");
    setEditLogoutDate("");
  };

  const clearCalculator = () => {
    setEditLoginDate("");
    setEditLogoutDate("");
  };

  // Unique filter options from current result set
  const uniqueDealTypes = [
    ...new Set(rentals.map((r) => r.deal_type).filter(Boolean)),
  ];
  const uniqueUnitTypes = [
    ...new Set(rentals.map((r) => r.unit_type).filter(Boolean)),
  ];
  const uniqueModeTypes = [
    ...new Set(rentals.map((r) => r.mode_type).filter(Boolean)),
  ];

  const getDateOnly = (value) => {
    if (!value) return "";

    if (/^\d{4}-\d{2}-\d{2}/.test(String(value))) {
      return String(value).slice(0, 10);
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Status + Record Date filters stay client-side so the existing API contract is unchanged.
  const filteredRentals = useMemo(() => {
    return rentals.filter((rental) => {
      const status = (rental.status || "").toUpperCase();

      let matchesStatus = true;
      if (statusFilter === "ACTIVE") {
        matchesStatus = ["ACTIVE", "RUNNING", "DELIVERED"].includes(status);
      } else if (statusFilter === "PENDING") {
        matchesStatus = status === "PENDING";
      } else if (statusFilter === "INACTIVE") {
        matchesStatus = status === "INACTIVE";
      } else if (statusFilter === "CLOSED") {
        matchesStatus = ["CLOSE", "CLOSED", "COMPLETED"].includes(status);
      } else if (statusFilter !== "All") {
        matchesStatus = status === statusFilter;
      }

      if (!matchesStatus) return false;

      const recordDate = getDateOnly(rental.record_date);

      if (dateFilterMode === "single") {
        if (!recordDateSingle) return true;
        return recordDate === recordDateSingle;
      }

      if (!recordDateFrom && !recordDateTo) return true;
      if (!recordDate) return false;
      if (recordDateFrom && recordDate < recordDateFrom) return false;
      if (recordDateTo && recordDate > recordDateTo) return false;

      return true;
    });
  }, [
    rentals,
    statusFilter,
    dateFilterMode,
    recordDateSingle,
    recordDateFrom,
    recordDateTo,
  ]);

  // Operational summary values
  const summary = useMemo(() => {
    let active = 0;
    let pending = 0;
    let due = 0;

    rentals.forEach((rental) => {
      const status = (rental.status || "").toUpperCase();
      if (["ACTIVE", "RUNNING", "DELIVERED"].includes(status)) active += 1;
      if (status === "PENDING") pending += 1;

      if (
        !rental.login_out_date &&
        ["ACTIVE", "RUNNING", "DELIVERED", "PENDING"].includes(status) &&
        getDaysNumber(rental.login_date, rental.login_out_date) >= 30
      ) {
        due += 1;
      }
    });

    return { total: rentals.length, active, pending, due };
  }, [rentals]);

  // Pagination
  const totalPages = Math.ceil(filteredRentals.length / recordsPerPage) || 1;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRentals.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  useEffect(() => {
    if (!hasInitializedFilters.current) {
      hasInitializedFilters.current = true;
      return;
    }

    setCurrentPage(1);
  }, [
    debouncedSearch,
    careCenterFilter,
    dealTypeFilter,
    unitTypeFilter,
    modeTypeFilter,
    statusFilter,
    dateFilterMode,
    recordDateSingle,
    recordDateFrom,
    recordDateTo,
  ]);

  useEffect(() => {
    if (!loading && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [loading, currentPage, totalPages]);

  const getStatusBadge = (status = "PENDING") => {
    const upper = status.toUpperCase();

    if (upper === "ACTIVE" || upper === "RUNNING" || upper === "DELIVERED") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    }

    if (upper === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      );
    }

    if (["CLOSE", "CLOSED", "COMPLETED"].includes(upper)) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Closed
        </span>
      );
    }

    if (upper === "INACTIVE") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-rose-700">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Inactive
        </span>
      );
    }

    return (
      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
        {upper || "Unknown"}
      </span>
    );
  };

  const modalDays = getDaysNumber(editLoginDate, editLogoutDate);
  const modalSecond = getSecondNumber(editLoginDate, editLogoutDate);

  const hasRecordDateFilter =
    dateFilterMode === "single"
      ? Boolean(recordDateSingle)
      : Boolean(recordDateFrom || recordDateTo);

  const activeFilterCount =
    [
      careCenterFilter,
      dealTypeFilter,
      unitTypeFilter,
      modeTypeFilter,
      statusFilter,
    ].filter((value) => value !== "All").length +
    (searchTerm.trim() ? 1 : 0) +
    (hasRecordDateFilter ? 1 : 0);

  const selectClass =
    "h-11 w-full appearance-none rounded-xl border border-[#DCEAE4] bg-white px-3 text-[11px] font-bold text-[#496158] outline-none transition hover:border-[#BBD5CA] focus:border-[#0A8B61] focus:ring-4 focus:ring-[#0A8B61]/[0.07] cursor-pointer";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F8F6] px-4 py-5 sm:px-6 lg:px-7">
        <div className="mx-auto w-full max-w-[1540px] space-y-5">
          {/* =====================================================
    RENTAL MASTER - COMBINED CONTROL CARD
====================================================== */}
          <section className="relative overflow-hidden rounded-[24px] border border-[#DDEBE5] bg-white shadow-[0_10px_35px_rgba(29,91,68,0.06)]">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#0A9668]/[0.055] blur-3xl" />
              <div className="absolute -bottom-24 left-[32%] h-56 w-56 rounded-full bg-[#087A57]/[0.035] blur-3xl" />
            </div>

            <div className="relative z-10">
              {/* =================================================
        HEADER
    ================================================= */}
              <div className="flex flex-col gap-6 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                {/* Left */}
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#087A57] to-[#0A9668] text-white shadow-[0_10px_24px_rgba(8,122,87,0.22)]">
                    <Package size={23} strokeWidth={2.1} />
                  </div>

                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#0A8B61]">
                        Equipment Operations
                      </span>

                      <span className="h-1 w-1 rounded-full bg-[#B5C8C0]" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Rental Control
                      </span>
                    </div>

                    <h1 className="text-[23px] font-extrabold tracking-[-0.035em] text-[#183A2F] sm:text-[26px]">
                      Rental Master
                    </h1>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Calculator */}
                  <button
                    type="button"
                    onClick={openCalcModal}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#D7E9E0] bg-[#F1F9F5] text-[#087A57] shadow-sm transition hover:-translate-y-[1px] hover:border-[#B8D9CA] hover:bg-[#EAF7F0] hover:shadow-md"
                    title="Temporary rental days calculator"
                    aria-label="Open temporary rental days calculator"
                  >
                    <Calculator size={17} strokeWidth={2.2} />
                  </button>

                  {/* Refresh */}
                  <button
                    type="button"
                    onClick={fetchRentals}
                    disabled={loading}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#DCE9E4] bg-white px-4 text-[11px] font-bold text-[#61776E] shadow-sm transition hover:border-[#C3DAD0] hover:bg-[#F8FBF9] hover:text-[#087A57] disabled:cursor-not-allowed disabled:opacity-50"
                    title="Refresh rental records"
                  >
                    <RefreshCw
                      size={15}
                      className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>

                  {/* New requisition */}
                  <button
                    type="button"
                    onClick={() => navigate("/rental-requisition")}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087A57] to-[#0A9668] px-5 text-[11px] font-extrabold text-white shadow-[0_9px_22px_rgba(8,122,87,0.22)] transition hover:-translate-y-[1px] hover:shadow-[0_12px_28px_rgba(8,122,87,0.28)] active:translate-y-0"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    Log New Requisition
                  </button>
                </div>
              </div>

              {/* =================================================
        DIVIDER
    ================================================= */}
              <div className="mx-5 border-t border-[#EDF3F0] lg:mx-6" />

              {/* =================================================
        FILTER HEADER
    ================================================= */}
              <div className="px-5 pt-4 lg:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Active filters */}
                  {activeFilterCount > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8EEE4] bg-[#EDF8F3] px-2.5 py-1 text-[9px] font-extrabold text-[#087A57]">
                        <Filter size={11} />
                        {activeFilterCount} active{" "}
                        {activeFilterCount === 1 ? "filter" : "filters"}
                      </span>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[9px] font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <RotateCcw size={12} />
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* =================================================
        MAIN FILTERS
    ================================================= */}
              <div className="px-5 pb-4 pt-3 lg:px-6">
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-[minmax(300px,1.8fr)_repeat(5,minmax(130px,1fr))_auto]">
                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8EA49B]"
                    />

                    <input
                      type="text"
                      placeholder="Find rental records"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[#DCEAE4] bg-[#FBFDFC] pl-10 pr-10 text-[11px] font-semibold text-[#415B50] outline-none transition placeholder:font-medium placeholder:text-[#A4B5AE] hover:border-[#C7DBD2] focus:border-[#0A8B61] focus:bg-white focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
                    />

                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Clear search"
                        title="Clear search"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Care Center */}
                  <select
                    value={careCenterFilter}
                    onChange={(e) => setCareCenterFilter(e.target.value)}
                    className={selectClass}
                    title="Filter by care center"
                  >
                    <option value="All">Care Center · All</option>

                    {careCenters.map((center) => (
                      <option
                        key={center.carecenter_id}
                        value={String(center.carecenter_id)}
                      >
                        {center.carecenter_name}
                      </option>
                    ))}
                  </select>

                  {/* Deal */}
                  <select
                    value={dealTypeFilter}
                    onChange={(e) => setDealTypeFilter(e.target.value)}
                    className={selectClass}
                    title="Filter by deal type"
                  >
                    <option value="All">Deal · All</option>

                    {uniqueDealTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}

                    {!uniqueDealTypes.includes("B2B") && (
                      <option value="B2B">B2B</option>
                    )}

                    {!uniqueDealTypes.includes("B2C") && (
                      <option value="B2C">B2C</option>
                    )}
                  </select>

                  {/* Unit */}
                  <select
                    value={unitTypeFilter}
                    onChange={(e) => setUnitTypeFilter(e.target.value)}
                    className={selectClass}
                    title="Filter by unit"
                  >
                    <option value="All">Unit · All</option>

                    {uniqueUnitTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}

                    {!uniqueUnitTypes.includes("BWF") && (
                      <option value="BWF">BWF</option>
                    )}

                    {!uniqueUnitTypes.includes("ODCOM") && (
                      <option value="ODCOM">ODCOM</option>
                    )}
                  </select>

                  {/* Mode */}
                  <select
                    value={modeTypeFilter}
                    onChange={(e) => setModeTypeFilter(e.target.value)}
                    className={selectClass}
                    title="Filter by payment mode"
                  >
                    <option value="All">Mode · All</option>

                    {uniqueModeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}

                    {!uniqueModeTypes.includes("Prepaid") && (
                      <option value="Prepaid">Prepaid</option>
                    )}

                    {!uniqueModeTypes.includes("Postpaid") && (
                      <option value="Postpaid">Postpaid</option>
                    )}
                  </select>

                  {/* Status */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={selectClass}
                    title="Filter by rental status"
                  >
                    <option value="All">Status · All</option>
                    <option value="ACTIVE">Active</option>

                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Active/Inactive</option>
                    <option value="CLOSED">Closed</option>
                  </select>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={activeFilterCount === 0}
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[#DCE9E4] bg-white px-3 text-[10px] font-bold text-[#70867C] transition hover:bg-[#F7FAF8] hover:text-[#087A57] disabled:cursor-not-allowed disabled:opacity-40"
                    title="Reset filters"
                  >
                    <RotateCcw size={13} />
                    Reset
                  </button>
                </div>

                {/* =================================================
          RECORD DATE SEARCH
      ================================================= */}
                <div className="mt-3 border-t border-[#EDF3F0] pt-3">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    {/* Date title */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EEF8F3] text-[#087A57]">
                        <CalendarDays size={15} />
                      </div>

                      <div>
                        <p className="text-[10.5px] font-extrabold text-[#395448]">
                          Record Date Search
                        </p>

                        <p className="mt-0.5 text-[8.5px] font-medium text-slate-400">
                          Find rentals recorded on one date or between two
                          dates.
                        </p>
                      </div>
                    </div>

                    {/* Date controls */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      {/* Single / Range */}
                      <div className="inline-flex rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDateFilterMode("single");
                            setRecordDateFrom("");
                            setRecordDateTo("");
                          }}
                          className={`h-8 rounded-lg px-3 text-[9.5px] font-extrabold transition ${
                            dateFilterMode === "single"
                              ? "bg-white text-[#087A57] shadow-sm ring-1 ring-[#D7E8E0]"
                              : "text-[#7A8D84] hover:text-[#456057]"
                          }`}
                        >
                          Single Date
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDateFilterMode("range");
                            setRecordDateSingle("");
                          }}
                          className={`h-8 rounded-lg px-3 text-[9.5px] font-extrabold transition ${
                            dateFilterMode === "range"
                              ? "bg-white text-[#087A57] shadow-sm ring-1 ring-[#D7E8E0]"
                              : "text-[#7A8D84] hover:text-[#456057]"
                          }`}
                        >
                          Date Range
                        </button>
                      </div>

                      {/* Single date */}
                      {dateFilterMode === "single" ? (
                        <div className="relative min-w-[190px]">
                          <CalendarDays
                            size={14}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA199]"
                          />

                          <input
                            type="date"
                            value={recordDateSingle}
                            onChange={(e) =>
                              setRecordDateSingle(e.target.value)
                            }
                            className="h-10 w-full rounded-xl border border-[#DCE9E4] bg-white pl-9 pr-3 text-[10.5px] font-bold text-[#496158] outline-none transition focus:border-[#0A8B61] focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
                            title="Search by exact record date"
                          />
                        </div>
                      ) : (
                        /* Date range */
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <div className="relative min-w-[175px]">
                            <CalendarDays
                              size={14}
                              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA199]"
                            />

                            <input
                              type="date"
                              value={recordDateFrom}
                              max={recordDateTo || undefined}
                              onChange={(e) =>
                                setRecordDateFrom(e.target.value)
                              }
                              className="h-10 w-full rounded-xl border border-[#DCE9E4] bg-white pl-9 pr-3 text-[10.5px] font-bold text-[#496158] outline-none transition focus:border-[#0A8B61] focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
                              title="Record date from"
                            />
                          </div>

                          <span className="hidden text-[9px] font-bold text-[#9AABA3] sm:inline">
                            to
                          </span>

                          <div className="relative min-w-[175px]">
                            <CalendarDays
                              size={14}
                              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA199]"
                            />

                            <input
                              type="date"
                              value={recordDateTo}
                              min={recordDateFrom || undefined}
                              onChange={(e) => setRecordDateTo(e.target.value)}
                              className="h-10 w-full rounded-xl border border-[#DCE9E4] bg-white pl-9 pr-3 text-[10.5px] font-bold text-[#496158] outline-none transition focus:border-[#0A8B61] focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
                              title="Record date to"
                            />
                          </div>
                        </div>
                      )}

                      {/* Clear Date */}
                      {hasRecordDateFilter && (
                        <button
                          type="button"
                          onClick={() => {
                            setRecordDateSingle("");
                            setRecordDateFrom("");
                            setRecordDateTo("");
                          }}
                          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#DCE9E4] bg-white px-3 text-[9.5px] font-bold text-[#73877E] transition hover:bg-[#F6FAF8] hover:text-[#087A57]"
                          title="Clear record date filter"
                        >
                          <X size={12} />
                          Clear Date
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              TABLE
          ====================================================== */}
          <section className="overflow-hidden rounded-[20px] border border-[#DCE9E4] bg-white shadow-[0_8px_30px_rgba(29,91,68,0.05)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBF2EE] px-5 py-3.5">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#60786E]">
                  Rental register
                </p>
                <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                  {filteredRentals.length}{" "}
                  {filteredRentals.length === 1 ? "record" : "records"}{" "}
                  currently shown
                </p>
              </div>

              <div className="hidden items-center gap-1.5 text-[9px] font-medium text-slate-400 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live operational data
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF8F3]">
                  <RefreshCw
                    size={20}
                    className="animate-spin text-[#087A57]"
                  />
                </div>
                <p className="mt-4 text-[12px] font-bold text-[#60766D]">
                  Loading rental records
                </p>
                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  Syncing current equipment operations…
                </p>
              </div>
            ) : filteredRentals.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E0EDE7] bg-[#F5FAF7] text-[#7A9489]">
                  <Package size={24} />
                </div>
                <h3 className="mt-4 text-[14px] font-extrabold text-[#314D42]">
                  No rental records found
                </h3>
                <p className="mt-1 max-w-[380px] text-[10px] font-medium leading-5 text-slate-400">
                  Try changing the filters or create a new equipment rental
                  requisition.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#DDE9E4] bg-white px-3 text-[10px] font-bold text-[#60776D] hover:bg-slate-50"
                    >
                      <RotateCcw size={13} />
                      Clear filters
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate("/rental-requisition")}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#087A57] px-3.5 text-[10px] font-bold text-white hover:bg-[#066B4D]"
                  >
                    <Plus size={13} />
                    New requisition
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1180px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#E8F0EC] bg-[#F8FBF9] text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#82968D]">
                        <th className="px-5 py-3.5">Equipment</th>
                        <th className="px-5 py-3.5">Bed Number</th>
                        <th className="px-5 py-3.5">Patient / Client</th>
                        <th className="px-5 py-3.5">Login Date</th>
                        <th className="px-5 py-3.5">Logout Date</th>
                        <th className="px-5 py-3.5">Rental Days</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#EEF3F0]">
                      {currentRecords.map((rental) => {
                        const displayDeviceModel =
                          rental.device?.device_name || "Equipment Asset";
                        const days = getDaysNumber(
                          rental.login_date,
                          rental.login_out_date,
                        );
                        const upperStatus = (rental.status || "").toUpperCase();
                        const isDue =
                          !rental.login_out_date &&
                          [
                            "ACTIVE",
                            "RUNNING",
                            "DELIVERED",
                            "PENDING",
                          ].includes(upperStatus) &&
                          days >= 30;

                        return (
                          <tr
                            key={rental.rental_id}
                            className={`group transition-colors ${
                              isDue
                                ? "bg-amber-50/[0.28] hover:bg-amber-50/60"
                                : "hover:bg-[#F9FBFA]"
                            }`}
                          >
                            {/* Equipment */}
                            <td className="px-5 py-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border ${
                                    isDue
                                      ? "border-amber-200 bg-amber-50 text-amber-700"
                                      : "border-[#DDECE5] bg-[#F1F8F4] text-[#087A57]"
                                  }`}
                                >
                                  <Package size={17} />
                                </div>
                                <div className="min-w-0">
                                  <p className="max-w-[230px] truncate text-[12px] font-extrabold text-[#28473B]">
                                    {displayDeviceModel}
                                  </p>
                                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[8.5px] font-bold text-slate-500">
                                      #{rental.rental_id}
                                    </span>
                                    {rental.unit_type && (
                                      <span className="text-[9px] font-semibold text-slate-400">
                                        {rental.unit_type}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Bed Number */}
                            <td className="px-5 py-4 align-middle">
                              <span className="inline-flex min-w-[72px] items-center justify-center rounded-[8px] border border-[#DCE9E4] bg-[#F7FAF8] px-2.5 py-1 text-[10.5px] font-bold text-[#4F695E]">
                                {rental.care_bed_no ||
                                  rental.care_bed_no ||
                                  rental.care_bed_no ||
                                  "—"}
                              </span>
                            </td>

                            {/* Patient */}
                            <td className="px-5 py-4 align-middle">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#F4F7F5] text-[#80958B]">
                                  <UserRound size={14} />
                                </div>
                                <div className="min-w-0">
                                  <p className="max-w-[180px] truncate text-[11px] font-bold text-[#3B544A]">
                                    {rental.patient_name || "N/A"}
                                  </p>
                                  {(rental.carecenter?.carecenter_name ||
                                    rental.care_center?.carecenter_name) && (
                                    <p className="mt-0.5 flex max-w-[180px] items-center gap-1 truncate text-[8.5px] font-medium text-slate-400">
                                      <Building2 size={9} />
                                      {rental.carecenter?.carecenter_name ||
                                        rental.care_center?.carecenter_name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Login */}
                            <td className="px-5 py-4 align-middle">
                              <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold text-[#5D7369]">
                                <CalendarDays
                                  size={13}
                                  className="text-[#91A59C]"
                                />
                                {formatDisplayDate(rental.login_date)}
                              </div>
                            </td>

                            {/* Logout */}
                            <td className="px-5 py-4 align-middle">
                              <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold text-[#5D7369]">
                                <CalendarDays
                                  size={13}
                                  className="text-[#91A59C]"
                                />
                                {formatDisplayDate(rental.login_out_date)}
                              </div>
                            </td>

                            {/* Days */}
                            <td className="px-5 py-4 align-middle">
                              {calculateTotalDays(
                                rental.login_date,
                                rental.login_out_date,
                                rental.status,
                              )}
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4 align-middle">
                              {getStatusBadge(rental.status)}
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4 align-middle">
                              <div className="flex items-center justify-center gap-1.5">
                                <Link
                                  to={`/rental-view/${rental.rental_id}`}
                                  className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-[1px] hover:border-[#CBDAD3] hover:bg-[#F7FAF8] hover:text-[#087A57] hover:shadow-sm"
                                  title="View rental"
                                  aria-label={`View rental ${rental.rental_id}`}
                                >
                                  <Eye size={14} strokeWidth={2} />
                                </Link>

                                <Link
                                  to={`/rental-edit/${rental.rental_id}`}
                                  className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#CFE7DC] bg-[#EEF8F3] text-[#087A57] transition hover:-translate-y-[1px] hover:border-[#ABD5C3] hover:bg-[#E4F4EC] hover:shadow-sm"
                                  title="Edit rental"
                                  aria-label={`Edit rental ${rental.rental_id}`}
                                >
                                  <Pencil size={14} strokeWidth={2.1} />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteClick(rental.rental_id)
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-rose-200 bg-rose-50 text-rose-600 transition hover:-translate-y-[1px] hover:bg-rose-100 hover:text-rose-700 hover:shadow-sm"
                                  title="Delete rental"
                                  aria-label={`Delete rental ${rental.rental_id}`}
                                >
                                  <Trash2 size={14} strokeWidth={2.1} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-3 border-t border-[#EAF1ED] bg-[#FBFDFC] px-5 py-3.5 sm:flex-row">
                  <p className="text-[10px] font-medium text-[#7D9188]">
                    Showing{" "}
                    <span className="font-bold text-[#4F695E]">
                      {indexOfFirstRecord + 1}
                    </span>
                    –
                    <span className="font-bold text-[#4F695E]">
                      {Math.min(indexOfLastRecord, filteredRentals.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-[#4F695E]">
                      {filteredRentals.length}
                    </span>{" "}
                    records
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCE8E3] bg-white text-[#60786E] transition hover:border-[#C6DBD1] hover:bg-[#F6FAF8] disabled:cursor-not-allowed disabled:opacity-35"
                      title="Previous page"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={14} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, idx, arr) => {
                        const prevPage = arr[idx - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;
                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="px-1 text-[10px] text-slate-400">
                                …
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              className={`h-8 min-w-[32px] rounded-lg border px-2 text-[10px] font-extrabold transition ${
                                currentPage === page
                                  ? "border-[#087A57] bg-[#087A57] text-white shadow-sm"
                                  : "border-[#DCE8E3] bg-white text-[#60786E] hover:bg-[#F6FAF8]"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCE8E3] bg-white text-[#60786E] transition hover:border-[#C6DBD1] hover:bg-[#F6FAF8] disabled:cursor-not-allowed disabled:opacity-35"
                      title="Next page"
                      aria-label="Next page"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {/* =====================================================
          CALCULATE DAYS MODAL
      ====================================================== */}
      {calcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close calculator"
            className="absolute inset-0 cursor-default bg-[#10251D]/45 backdrop-blur-[3px]"
            onClick={closeCalcModal}
          />

          <div className="relative w-full max-w-[480px] overflow-hidden rounded-[22px] border border-white/30 bg-white shadow-[0_28px_80px_rgba(16,55,41,0.28)]">
            {/* Modal header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#075F46] to-[#0A8E63] px-5 py-5 text-white">
              <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full border border-white/[0.08]" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white/[0.12] ring-1 ring-white/[0.12]">
                    <Calculator size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-emerald-100/65">
                      Rental duration tool
                    </p>
                    <h3 className="mt-1 text-[16px] font-extrabold tracking-tight">
                      Calculate Total Days
                    </h3>
                    <p className="mt-1 max-w-[310px] text-[10px] font-medium text-emerald-50/65">
                      Calculation purpose only · temporary calculation · does
                      not change any rental record
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeCalcModal}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-white/[0.08] text-white/70 transition hover:bg-white/[0.14] hover:text-white"
                  aria-label="Close"
                  title="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#71887E]">
                    Login Date
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA199]"
                    />
                    <input
                      type="date"
                      value={editLoginDate}
                      onChange={(e) => setEditLoginDate(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[#DCE9E4] bg-[#FBFDFC] pl-9 pr-3 text-[11px] font-semibold text-[#425B51] outline-none transition focus:border-[#0A8B61] focus:bg-white focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#71887E]">
                    Logout Date
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA199]"
                    />
                    <input
                      type="date"
                      value={editLogoutDate}
                      onChange={(e) => setEditLogoutDate(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[#DCE9E4] bg-[#FBFDFC] pl-9 pr-3 text-[11px] font-semibold text-[#425B51] outline-none transition focus:border-[#0A8B61] focus:bg-white focus:ring-4 focus:ring-[#0A8B61]/[0.07]"
                    />
                  </div>
                </div>
              </div>

              <p className="mt-2 text-[9px] font-medium text-slate-400">
                Leave logout date empty to calculate duration through today.
              </p>

              {/* Result */}
              <div
                className={`mt-5 rounded-[18px] border p-5 text-center ${
                  !editLogoutDate && modalDays >= 30
                    ? "border-amber-200 bg-amber-50"
                    : "border-[#DCECE5] bg-[#F4FAF7]"
                }`}
              >
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#087A57] shadow-sm ring-1 ring-black/[0.03]">
                  <Clock3 size={16} />
                </div>
                <p className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#7A9187]">
                  Calculated rental days
                </p>
                <div className="mt-1.5 flex items-baseline justify-center gap-1.5">
                  <span className="text-[30px] font-black tracking-[-0.04em] text-[#087A57]">
                    {modalDays}
                  </span>
                  <span className="text-[15px] font-bold text-[#82958D]">
                    / {modalSecond}
                  </span>
                </div>
                {!editLogoutDate && modalDays >= 30 && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white/70 px-2.5 py-1 text-[9px] font-extrabold text-amber-700">
                    <AlertTriangle size={11} />
                    Due threshold reached
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-[#E9F0ED] bg-[#FBFDFC] px-5 py-4">
              <p className="hidden text-[8.5px] font-medium text-[#98A9A1] sm:block">
                Calculator values are temporary and are not saved.
              </p>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearCalculator}
                  disabled={!editLoginDate && !editLogoutDate}
                  className="h-10 rounded-xl border border-[#DCE8E3] bg-white px-4 text-[10px] font-bold text-[#687E74] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={closeCalcModal}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#087A57] to-[#0A9668] px-4 text-[10px] font-extrabold text-white shadow-[0_8px_18px_rgba(8,122,87,0.2)] transition hover:-translate-y-[1px]"
                >
                  <CheckCircle2 size={13} />
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
