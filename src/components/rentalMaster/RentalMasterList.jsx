// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";
// import DashboardLayout from "../Admin/Layout";
// import { useNavigate, Link } from "react-router-dom";
// import {
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

//   // Record Date filter: single date OR date range
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

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(
//     Number(savedFilters.currentPage) > 0 ? Number(savedFilters.currentPage) : 1,
//   );
//   const recordsPerPage = 10;
//   const hasInitializedFilters = useRef(false);

//   // Standalone rental-days calculator
//   const [calcModalOpen, setCalcModalOpen] = useState(false);
//   const [editLoginDate, setEditLoginDate] = useState("");
//   const [editLogoutDate, setEditLogoutDate] = useState("");

//   // Debounce search (300ms)
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
//     return () => clearTimeout(t);
//   }, [searchTerm]);

//   // Preserve filters/page
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
//   const handleDeleteClick = async (e, rentalId) => {
//     e.stopPropagation();
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

//   const calculateTotalDays = (loginDate, logoutDate, status) => {
//     if (!loginDate) return "0";

//     const start = new Date(loginDate);
//     const end = logoutDate ? new Date(logoutDate) : new Date();

//     start.setHours(0, 0, 0, 0);
//     end.setHours(0, 0, 0, 0);

//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

//     const isSameMonth =
//       start.getFullYear() === end.getFullYear() &&
//       start.getMonth() === end.getMonth();

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
//           <div className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10.5px] font-extrabold text-amber-700">
//             <AlertTriangle size={11} strokeWidth={2.2} />
//             {diffDays}/{secondNumber} · Due
//           </div>
//         );
//       }
//     }

//     return (
//       <span className="inline-flex rounded-md border border-[#E3D9FF] bg-[#FAF8FF] px-2 py-0.5 text-[10.5px] font-bold text-[#553E82]">
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
//     if (!dateString) return "—";
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
//         <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3D9FF] bg-[#F3EFFF] px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.06em] text-[#5d2ed7]">
//           <span className="relative flex h-1.5 w-1.5">
//             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D3C4FC] opacity-75" />
//             <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#5d2ed7]" />
//           </span>
//           Active
//         </span>
//       );
//     }

//     if (upper === "PENDING") {
//       return (
//         <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.06em] text-amber-700">
//           <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
//           Pending
//         </span>
//       );
//     }

//     if (["CLOSE", "CLOSED", "COMPLETED"].includes(upper)) {
//       return (
//         <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.06em] text-slate-600">
//           <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
//           Closed
//         </span>
//       );
//     }

//     if (upper === "INACTIVE") {
//       return (
//         <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.06em] text-rose-700">
//           <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
//           Inactive
//         </span>
//       );
//     }

//     return (
//       <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.06em] text-slate-500">
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
//     "h-9 w-full appearance-none rounded-lg border border-[#E3D9FF] bg-white px-2.5 text-[10.5px] font-bold text-[#553E82] outline-none transition hover:border-[#D3C4FC] focus:border-[#5d2ed7] focus:ring-2 focus:ring-[#5d2ed7]/[0.08] cursor-pointer";

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-[#FAF8FF] px-3 py-4 sm:px-5 lg:px-6">
//         <div className="mx-auto w-full max-w-[1540px] space-y-4">
//           {/* CONTROL CARD */}
//           <section className="relative overflow-hidden rounded-[18px] border border-[#E3D9FF] bg-white shadow-[0_8px_25px_rgba(93,46,215,0.05)]">
//             <div className="pointer-events-none absolute inset-0 overflow-hidden">
//               <div className="absolute -right-24 -top-28 h-64 w-64 rounded-full bg-[#5d2ed7]/[0.045] blur-3xl" />
//               <div className="absolute -bottom-24 left-[32%] h-48 w-48 rounded-full bg-[#421E9F]/[0.03] blur-3xl" />
//             </div>

//             <div className="relative z-10">
//               {/* HEADER */}
//               <div className="flex flex-col gap-3 px-4 py-3.5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
//                 <div className="flex min-w-0 items-center gap-3">
//                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#421E9F] to-[#5d2ed7] text-white shadow-[0_8px_20px_rgba(93,46,215,0.2)]">
//                     <Package size={20} strokeWidth={2.1} />
//                   </div>

//                   <div className="min-w-0">
//                     <div className="flex items-center gap-1.5">
//                       <span className="text-[8.5px] font-extrabold uppercase tracking-[0.14em] text-[#5d2ed7]">
//                         Equipment Operations
//                       </span>
//                       <span className="h-1 w-1 rounded-full bg-[#D3C4FC]" />
                      
//                     </div>
//                     <h1 className="text-[19px] font-extrabold tracking-[-0.03em] text-[#22124D] sm:text-[21px]">
//                       Rental Master
//                     </h1>
//                   </div>
//                 </div>

//                 {/* RECORD DATE ROW */}
// <div className="mt-2.5 flex flex-col gap-2 border-t border-[#F3EFFF] pt-2 sm:flex-row sm:items-center sm:justify-between">
//   <div className="flex items-center gap-1.5">
//     <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#7F6EA6]">
//       Record Date:
//     </span>
//   </div>

//   <div className="flex flex-wrap items-center gap-1.5">
//     <div className="flex items-center gap-1.5">
//       {/* From Date */}
//       <div className="relative min-w-[130px]">
//         <CalendarDays
//           size={12}
//           className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9C8AC7]"
//         />
//         <input
//           type="date"
//           value={recordDateFrom}
//           max={recordDateTo || undefined}
//           onChange={(e) => setRecordDateFrom(e.target.value)}
//           className="h-8 w-full rounded-lg border border-[#E3D9FF] bg-white pl-7 pr-2 text-[9.5px] font-bold text-[#553E82] outline-none transition focus:border-[#5d2ed7]"
//         />
//       </div>

//       <span className="text-[8.5px] font-bold text-[#7F6EA6]">
//         to
//       </span>

//       {/* To Date */}
//       <div className="relative min-w-[130px]">
//         <CalendarDays
//           size={12}
//           className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9C8AC7]"
//         />
//         <input
//           type="date"
//           value={recordDateTo}
//           min={recordDateFrom || undefined}
//           onChange={(e) => setRecordDateTo(e.target.value)}
//           className="h-8 w-full rounded-lg border border-[#E3D9FF] bg-white pl-7 pr-2 text-[9.5px] font-bold text-[#553E82] outline-none transition focus:border-[#5d2ed7]"
//         />
//       </div>
//     </div>

//     {/* Clear Date Button */}
//     {(recordDateFrom || recordDateTo) && (
//       <button
//         type="button"
//         onClick={() => {
//           setRecordDateFrom("");
//           setRecordDateTo("");
//         }}
//         className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E3D9FF] bg-white px-2 text-[8.5px] font-bold text-[#7F6EA6] hover:text-[#5d2ed7]"
//       >
//         <X size={11} /> Clear
//       </button>
//     )}
//   </div>
// </div>

//                 {/* Right actions */}
//                 <div className="flex flex-wrap items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={openCalcModal}
//                     className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E3D9FF] bg-[#F3EFFF] text-[#5d2ed7] shadow-sm transition hover:border-[#D3C4FC] hover:bg-[#EAE2FF]"
//                     title="Rental days calculator"
//                     aria-label="Open rental days calculator"
//                   >
//                     <Calculator size={15} strokeWidth={2.2} />
//                   </button>

//                   <button
//                     type="button"
//                     onClick={fetchRentals}
//                     disabled={loading}
//                     className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#E3D9FF] bg-white px-3 text-[10px] font-bold text-[#553E82] shadow-sm transition hover:border-[#D3C4FC] hover:bg-[#FAF8FF] hover:text-[#5d2ed7] disabled:opacity-50"
//                     title="Refresh rental records"
//                   >
//                     <RefreshCw
//                       size={13}
//                       className={loading ? "animate-spin" : ""}
//                     />
//                     Refresh
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => navigate("/rental-requisition")}
//                     className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#421E9F] to-[#5d2ed7] px-4 text-[10px] font-extrabold text-white shadow-[0_6px_18px_rgba(93,46,215,0.2)] transition hover:brightness-105 active:scale-95"
//                   >
//                     <Plus size={14} strokeWidth={2.5} />
                    
//                   </button>
//                 </div>
//               </div>

//               {/* DIVIDER */}
//               <div className="mx-4 border-t border-[#F3EFFF] sm:mx-5" />

//               {/* MAIN FILTERS */}
//               <div className="px-4 py-3 sm:px-5">
//                 <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[minmax(220px,1.5fr)_repeat(5,minmax(110px,1fr))_auto]">
//                   {/* Search */}
//                   <div className="relative">
//                     <Search
//                       size={14}
//                       className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9C8AC7]"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Find rental records"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="h-9 w-full rounded-lg border border-[#E3D9FF] bg-[#FAF8FF] pl-8 pr-8 text-[10.5px] font-semibold text-[#22124D] outline-none transition placeholder:text-[#A697C7] hover:border-[#D3C4FC] focus:border-[#5d2ed7] focus:bg-white focus:ring-2 focus:ring-[#5d2ed7]/[0.08]"
//                     />
//                     {searchTerm && (
//                       <button
//                         type="button"
//                         onClick={() => setSearchTerm("")}
//                         className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-[#7F6EA6] hover:bg-[#F3EFFF] hover:text-[#5d2ed7]"
//                         aria-label="Clear search"
//                       >
//                         <X size={11} />
//                       </button>
//                     )}
//                   </div>

//                   {/* Care Center */}
//                   <select
//                     value={careCenterFilter}
//                     onChange={(e) => setCareCenterFilter(e.target.value)}
//                     className={selectClass}
//                   >
//                     <option value="All">Care Center · All</option>
//                     {careCenters.map((center) => (
//                       <option
//                         key={center.carecenter_id}
//                         value={String(center.carecenter_id)}
//                       >
//                         {center.carecenter_name}
//                       </option>
//                     ))}
//                   </select>

//                   {/* Deal */}
//                   <select
//                     value={dealTypeFilter}
//                     onChange={(e) => setDealTypeFilter(e.target.value)}
//                     className={selectClass}
//                   >
//                     <option value="All">Deal · All</option>
//                     {uniqueDealTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                     {!uniqueDealTypes.includes("B2B") && (
//                       <option value="B2B">B2B</option>
//                     )}
//                     {!uniqueDealTypes.includes("B2C") && (
//                       <option value="B2C">B2C</option>
//                     )}
//                   </select>

//                   {/* Unit */}
//                   <select
//                     value={unitTypeFilter}
//                     onChange={(e) => setUnitTypeFilter(e.target.value)}
//                     className={selectClass}
//                   >
//                     <option value="All">Unit · All</option>
//                     {uniqueUnitTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                     {!uniqueUnitTypes.includes("BWF") && (
//                       <option value="BWF">BWF</option>
//                     )}
//                     {!uniqueUnitTypes.includes("ODCOM") && (
//                       <option value="ODCOM">ODCOM</option>
//                     )}
//                   </select>

//                   {/* Mode */}
//                   <select
//                     value={modeTypeFilter}
//                     onChange={(e) => setModeTypeFilter(e.target.value)}
//                     className={selectClass}
//                   >
//                     <option value="All">Mode · All</option>
//                     {uniqueModeTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                     {!uniqueModeTypes.includes("Prepaid") && (
//                       <option value="Prepaid">Prepaid</option>
//                     )}
//                     {!uniqueModeTypes.includes("Postpaid") && (
//                       <option value="Postpaid">Postpaid</option>
//                     )}
//                   </select>

//                   {/* Status */}
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className={selectClass}
//                   >
//                     <option value="All">Status · All</option>
//                     <option value="ACTIVE">Active</option>
//                     <option value="INACTIVE">Inactive</option>
//                     <option value="PENDING">Pending</option>
//                     <option value="CLOSED">Closed</option>
//                   </select>

//                   {/* Reset */}
//                   <button
//                     type="button"
//                     onClick={handleReset}
//                     disabled={activeFilterCount === 0}
//                     className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#E3D9FF] bg-white px-2.5 text-[9.5px] font-bold text-[#7F6EA6] transition hover:bg-[#FAF8FF] hover:text-[#5d2ed7] disabled:opacity-40"
//                     title="Reset filters"
//                   >
//                     <RotateCcw size={12} />
//                     Reset
//                   </button>
//                 </div>

               
//               </div>
//             </div>
//           </section>

//           {/* TABLE SECTION */}
//           <section className="overflow-hidden rounded-[16px] border border-[#E3D9FF] bg-white shadow-[0_6px_22px_rgba(93,46,215,0.04)]">
//             <div className="flex items-center justify-between border-b border-[#F3EFFF] px-4 py-2.5">
//               <div className="flex items-center gap-2">
//                 <p className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#553E82]">
//                   Rental Register
//                 </p>
//                 <span className="rounded-full bg-[#FAF8FF] px-2 py-0.5 text-[8.5px] font-bold text-[#7F6EA6] ring-1 ring-[#E3D9FF]">
//                   {filteredRentals.length}{" "}
//                   {filteredRentals.length === 1 ? "record" : "records"}
//                 </span>
//               </div>

//               <div className="hidden items-center gap-1.5 text-[8.5px] font-medium text-[#7F6EA6] sm:flex">
//                 <span className="relative flex h-1.5 w-1.5">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D3C4FC] opacity-75" />
//                   <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#5d2ed7]" />
//                 </span>
//                 Click any row to open view page
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-20">
//                 <RefreshCw size={18} className="animate-spin text-[#5d2ed7]" />
//                 <p className="mt-3 text-[11px] font-bold text-[#22124D]">
//                   Loading rental records…
//                 </p>
//               </div>
//             ) : filteredRentals.length === 0 ? (
//               <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E3D9FF] bg-[#FAF8FF] text-[#9C8AC7]">
//                   <Package size={18} />
//                 </div>
//                 <h3 className="mt-3 text-[13px] font-extrabold text-[#22124D]">
//                   No rental records found
//                 </h3>
//                 <p className="mt-1 max-w-sm text-[9.5px] text-[#7F6EA6]">
//                   Try modifying filter criteria or register a new requisition.
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <table className="w-full min-w-[1050px] border-collapse text-left">
//                     <thead>
//                       <tr className="border-b border-[#F3EFFF] bg-[#FAF8FF] text-[8.5px] font-extrabold uppercase tracking-wider text-[#7F6EA6]">
//                         <th className="px-4 py-2.5">Equipment</th>
//                         <th className="px-3 py-2.5">Bed No.</th>
//                         <th className="px-4 py-2.5">Patient / Client</th>
//                         <th className="px-3 py-2.5">Login Date</th>
//                         <th className="px-3 py-2.5">Logout Date</th>
//                         <th className="px-3 py-2.5">Rental Days</th>
//                         <th className="px-3 py-2.5">Status</th>
//                         <th className="px-3 py-2.5 text-center">Actions</th>
//                       </tr>
//                     </thead>

//                     <tbody className="divide-y divide-[#F3EFFF]">
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
//                           [
//                             "ACTIVE",
//                             "RUNNING",
//                             "DELIVERED",
//                             "PENDING",
//                           ].includes(upperStatus) &&
//                           days >= 30;

//                         return (
//                           <tr
//                             key={rental.rental_id}
//                             onClick={() =>
//                               navigate(`/rental-view/${rental.rental_id}`)
//                             }
//                             className={`group cursor-pointer transition-colors ${
//                               isDue
//                                 ? "bg-amber-50/[0.22] hover:bg-amber-50/50"
//                                 : "hover:bg-[#FAF8FF]"
//                             }`}
//                           >
//                             {/* Equipment */}
//                             <td className="px-4 py-2.5 align-middle">
//                               <div className="flex items-center gap-2.5">
//                                 <div
//                                   className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
//                                     isDue
//                                       ? "border-amber-200 bg-amber-50 text-amber-700"
//                                       : "border-[#E8DEFF] bg-[#F3EFFF] text-[#5d2ed7]"
//                                   }`}
//                                 >
//                                   <Package size={14} />
//                                 </div>
//                                 <div className="min-w-0">
//                                   <p className="max-w-[200px] truncate text-[11px] font-extrabold text-[#22124D]">
//                                     {displayDeviceModel}
//                                   </p>
                                  
//                                 </div>
//                               </div>
//                             </td>

//                             {/* Bed Number */}
//                             <td className="px-3 py-2.5 align-middle">
//                               <span className="inline-flex min-w-[50px] items-center justify-center rounded-md border border-[#E3D9FF] bg-[#FAF8FF] px-2 py-0.5 text-[9.5px] font-bold text-[#553E82]">
//                                 {rental.care_bed_no || "—"}
//                               </span>
//                             </td>

//                             {/* Patient */}
//                             <td className="px-4 py-2.5 align-middle">
//                               <div className="flex items-center gap-2">
//                                 <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F3EFFF] text-[#5d2ed7]">
//                                   <UserRound size={12} />
//                                 </div>
//                                 <div className="min-w-0">
//                                   <p className="max-w-[160px] truncate text-[10.5px] font-bold text-[#22124D]">
//                                     {rental.patient_name || "N/A"}
//                                   </p>
//                                   {(rental.carecenter?.carecenter_name ||
//                                     rental.care_center?.carecenter_name) && (
//                                     <p className="flex max-w-[160px] items-center gap-1 truncate text-[8px] font-medium text-[#7F6EA6]">
//                                       <Building2 size={8} />
//                                       {rental.carecenter?.carecenter_name ||
//                                         rental.care_center?.carecenter_name}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                             </td>

//                             {/* Login */}
//                             <td className="px-3 py-2.5 align-middle">
//                               <span className="text-[9.5px] font-semibold text-[#553E82]">
//                                 {formatDisplayDate(rental.login_date)}
//                               </span>
//                             </td>

//                             {/* Logout */}
//                             <td className="px-3 py-2.5 align-middle">
//                               <span className="text-[9.5px] font-semibold text-[#553E82]">
//                                 {formatDisplayDate(rental.login_out_date)}
//                               </span>
//                             </td>

//                             {/* Days */}
//                             <td className="px-3 py-2.5 align-middle">
//                               {calculateTotalDays(
//                                 rental.login_date,
//                                 rental.login_out_date,
//                                 rental.status,
//                               )}
//                             </td>

//                             {/* Status */}
//                             <td className="px-3 py-2.5 align-middle">
//                               {getStatusBadge(rental.status)}
//                             </td>

//                             {/* Actions */}
//                             <td className="px-3 py-2.5 align-middle">
//                               <div
//                                 className="flex items-center justify-center gap-1"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 {/* <Link
//                                   to={`/rental-view/${rental.rental_id}`}
//                                   className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E3D9FF] bg-white text-[#553E82] transition hover:border-[#D3C4FC] hover:bg-[#FAF8FF] hover:text-[#5d2ed7]"
//                                   title="View rental"
//                                 >
//                                   <Eye size={12} strokeWidth={2} />
//                                 </Link> */}

//                                 <Link
//                                   to={`/rental-edit/${rental.rental_id}`}
//                                   className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E8DEFF] bg-[#F3EFFF] text-[#5d2ed7] transition hover:border-[#D3C4FC] hover:bg-[#EAE2FF]"
//                                   title="Edit rental"
//                                 >
//                                   <Pencil size={12} strokeWidth={2.1} />
//                                 </Link>

//                                 <button
//                                   type="button"
//                                   onClick={(e) =>
//                                     handleDeleteClick(e, rental.rental_id)
//                                   }
//                                   className="flex h-7 w-7 items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
//                                   title="Delete rental"
//                                 >
//                                   <Trash2 size={12} strokeWidth={2.1} />
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
//                 <div className="flex flex-col items-center justify-between gap-2.5 border-t border-[#F3EFFF] bg-[#FAF8FF] px-4 py-2.5 sm:flex-row">
//                   <p className="text-[9px] font-medium text-[#7F6EA6]">
//                     Showing{" "}
//                     <span className="font-bold text-[#22124D]">
//                       {indexOfFirstRecord + 1}
//                     </span>{" "}
//                     –{" "}
//                     <span className="font-bold text-[#22124D]">
//                       {Math.min(indexOfLastRecord, filteredRentals.length)}
//                     </span>{" "}
//                     of{" "}
//                     <span className="font-bold text-[#22124D]">
//                       {filteredRentals.length}
//                     </span>{" "}
//                     records
//                   </p>

//                   <div className="flex items-center gap-1">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setCurrentPage((prev) => Math.max(prev - 1, 1))
//                       }
//                       disabled={currentPage === 1}
//                       className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E3D9FF] bg-white text-[#553E82] transition hover:border-[#D3C4FC] hover:bg-[#FAF8FF] disabled:opacity-35"
//                       title="Previous page"
//                     >
//                       <ChevronLeft size={13} />
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
//                               <span className="px-0.5 text-[9px] text-[#A697C7]">
//                                 …
//                               </span>
//                             )}
//                             <button
//                               type="button"
//                               onClick={() => setCurrentPage(page)}
//                               className={`h-7 min-w-[28px] rounded-md border px-1.5 text-[9px] font-extrabold transition ${
//                                 currentPage === page
//                                   ? "border-[#5d2ed7] bg-[#5d2ed7] text-white shadow-sm"
//                                   : "border-[#E3D9FF] bg-white text-[#553E82] hover:bg-[#FAF8FF]"
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
//                       className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E3D9FF] bg-white text-[#553E82] transition hover:border-[#D3C4FC] hover:bg-[#FAF8FF] disabled:opacity-35"
//                       title="Next page"
//                     >
//                       <ChevronRight size={13} />
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </section>
//         </div>
//       </div>

//       {/* CALCULATE DAYS MODAL */}
//       {calcModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
//           <button
//             type="button"
//             aria-label="Close calculator"
//             className="absolute inset-0 cursor-default bg-[#22124D]/55 backdrop-blur-[2px]"
//             onClick={closeCalcModal}
//           />

//           <div className="relative w-full max-w-[420px] overflow-hidden rounded-[18px] border border-white/30 bg-white shadow-[0_20px_60px_rgba(37,15,97,0.25)] animate-in fade-in zoom-in-95 duration-150">
//             <div className="relative overflow-hidden bg-gradient-to-r from-[#250F61] via-[#421E9F] to-[#5d2ed7] px-4 py-3.5 text-white">
//               <div className="relative z-10 flex items-start justify-between gap-3">
//                 <div className="flex items-center gap-2.5">
//                   <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.15]">
//                     <Calculator size={15} />
//                   </div>
//                   <div>
//                     <h3 className="text-[14px] font-extrabold tracking-tight">
//                       Calculate Total Days
//                     </h3>
//                     <p className="text-[9px] text-purple-200/80">
//                       Temporary calculator · does not alter records
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={closeCalcModal}
//                   className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.1] text-white/80 hover:bg-white/[0.2]"
//                 >
//                   <X size={13} />
//                 </button>
//               </div>
//             </div>

//             <div className="p-4">
//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1 block text-[8.5px] font-extrabold uppercase tracking-wider text-[#7F6EA6]">
//                     Login Date
//                   </label>
//                   <input
//                     type="date"
//                     value={editLoginDate}
//                     onChange={(e) => setEditLoginDate(e.target.value)}
//                     className="h-9 w-full rounded-lg border border-[#E3D9FF] bg-[#FAF8FF] px-2.5 text-[10px] font-semibold text-[#22124D] outline-none focus:border-[#5d2ed7] focus:bg-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-[8.5px] font-extrabold uppercase tracking-wider text-[#7F6EA6]">
//                     Logout Date
//                   </label>
//                   <input
//                     type="date"
//                     value={editLogoutDate}
//                     onChange={(e) => setEditLogoutDate(e.target.value)}
//                     className="h-9 w-full rounded-lg border border-[#E3D9FF] bg-[#FAF8FF] px-2.5 text-[10px] font-semibold text-[#22124D] outline-none focus:border-[#5d2ed7] focus:bg-white"
//                   />
//                 </div>
//               </div>

//               <div
//                 className={`mt-4 rounded-xl border p-3.5 text-center ${
//                   !editLogoutDate && modalDays >= 30
//                     ? "border-amber-200 bg-amber-50"
//                     : "border-[#E3D9FF] bg-[#FAF8FF]"
//                 }`}
//               >
//                 <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#5d2ed7] shadow-sm">
//                   <Clock3 size={13} />
//                 </div>
//                 <p className="mt-2 text-[8.5px] font-extrabold uppercase tracking-wider text-[#7F6EA6]">
//                   Calculated Rental Days
//                 </p>
//                 <div className="mt-1 flex items-baseline justify-center gap-1">
//                   <span className="text-[24px] font-black tracking-tight text-[#5d2ed7]">
//                     {modalDays}
//                   </span>
//                   <span className="text-[13px] font-bold text-[#8B7BB5]">
//                     / {modalSecond}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-end gap-2 border-t border-[#F3EFFF] bg-[#FAF8FF] px-4 py-3">
//               <button
//                 type="button"
//                 onClick={clearCalculator}
//                 disabled={!editLoginDate && !editLogoutDate}
//                 className="h-8 rounded-lg border border-[#E3D9FF] bg-white px-3 text-[9.5px] font-bold text-[#553E82] hover:bg-[#FAF8FF] disabled:opacity-40"
//               >
//                 Clear
//               </button>
//               <button
//                 type="button"
//                 onClick={closeCalcModal}
//                 className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#421E9F] to-[#5d2ed7] px-3.5 text-[9.5px] font-extrabold text-white"
//               >
//                 <CheckCircle2 size={12} />
//                 Done
//               </button>
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
  AlertTriangle,
  Building2,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
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

  // Date Field Selection & Filters
  const [selectedDateField, setSelectedDateField] = useState(
    savedFilters.selectedDateField || "record_date",
  );
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(
    Number(savedFilters.currentPage) > 0 ? Number(savedFilters.currentPage) : 1,
  );
  const recordsPerPage = 10;
  const hasInitializedFilters = useRef(false);

  // Standalone rental-days calculator
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [editLoginDate, setEditLoginDate] = useState("");
  const [editLogoutDate, setEditLogoutDate] = useState("");

  // Debounce search (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Preserve filters/page
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
        selectedDateField,
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
    selectedDateField,
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
  const handleDeleteClick = async (e, rentalId) => {
    e.stopPropagation();
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
    setSelectedDateField("record_date");
    setDateFilterMode("single");
    setRecordDateSingle("");
    setRecordDateFrom("");
    setRecordDateTo("");
    setCurrentPage(1);
    sessionStorage.removeItem(RENTAL_FILTER_STORAGE_KEY);
  };

  const calculateTotalDays = (loginDate, logoutDate, status) => {
    if (!loginDate) return "0";

    const start = new Date(loginDate);
    const end = logoutDate ? new Date(logoutDate) : new Date();

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const isSameMonth =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth();

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
          <div className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10.5px] font-extrabold text-amber-700">
            <AlertTriangle size={11} strokeWidth={2.2} />
            {diffDays}/{secondNumber} · Due
          </div>
        );
      }
    }

    return (
      <span className="inline-flex rounded-md border border-[#E3D9FF] bg-[#FAF8FF] px-2 py-0.5 text-[10.5px] font-bold text-[#553E82]">
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
    if (!dateString) return "—";
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

      // Dynamic date field inspection
      let rawDateValue = "";
      if (selectedDateField === "logout_date") {
        rawDateValue = rental.login_out_date || rental.logout_date;
      } else if (selectedDateField === "recall_date") {
        rawDateValue = rental.recall_date;
      } else if (selectedDateField === "login_date") {
        rawDateValue = rental.login_date;
      } else if (selectedDateField === "system_date") {
        rawDateValue = rental.created_at || rental.system_date;
      } else {
        rawDateValue = rental.record_date;
      }

      const dateToCompare = getDateOnly(rawDateValue);

      if (dateFilterMode === "single") {
        if (!recordDateSingle) return true;
        return dateToCompare === recordDateSingle;
      }

      if (!recordDateFrom && !recordDateTo) return true;
      if (!dateToCompare) return false;
      if (recordDateFrom && dateToCompare < recordDateFrom) return false;
      if (recordDateTo && dateToCompare > recordDateTo) return false;

      return true;
    });
  }, [
    rentals,
    statusFilter,
    selectedDateField,
    dateFilterMode,
    recordDateSingle,
    recordDateFrom,
    recordDateTo,
  ]);

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
    selectedDateField,
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

  // Color logic for the icon in the equipment column
  const getEquipmentIconColor = (status = "PENDING") => {
    const upper = status.toUpperCase();

    if (["ACTIVE", "RUNNING", "DELIVERED"].includes(upper)) {
      return {
        boxClass: "border-[#E8DEFF] bg-[#F3EFFF] text-[#5d2ed7]",
        dotPing: true,
      };
    }
    if (upper === "INACTIVE") {
      return {
        boxClass: "border-rose-200 bg-rose-50 text-rose-600",
        dotPing: false,
      };
    }
    if (["CLOSE", "CLOSED", "COMPLETED"].includes(upper)) {
      return {
        boxClass: "border-slate-800 bg-slate-900 text-white",
        dotPing: false,
      };
    }
    // Pending or Default
    return {
      boxClass: "border-amber-200 bg-amber-50 text-amber-700",
      dotPing: false,
    };
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
    "h-9 w-full appearance-none rounded-lg border border-[#E3D9FF] bg-white px-2.5 text-[10.5px] font-bold text-[#553E82] outline-none transition hover:border-[#D3C4FC] focus:border-[#5d2ed7] focus:ring-2 focus:ring-[#5d2ed7]/[0.08] cursor-pointer";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#FAF8FF] px-3 py-4 sm:px-5 lg:px-6">
        <div className="mx-auto w-full max-w-[1540px] space-y-4">
          {/* CONTROL CARD */}
          <section className="relative overflow-hidden rounded-[18px] border border-[#E3D9FF] bg-white shadow-[0_8px_25px_rgba(93,46,215,0.05)]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-24 -top-28 h-64 w-64 rounded-full bg-[#5d2ed7]/[0.045] blur-3xl" />
              <div className="absolute -bottom-24 left-[32%] h-48 w-48 rounded-full bg-[#421E9F]/[0.03] blur-3xl" />
            </div>

            <div className="relative z-10">
              {/* HEADER */}
              <div className="flex flex-col gap-3 px-4 py-3.5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#421E9F] to-[#5d2ed7] text-white shadow-[0_8px_20px_rgba(93,46,215,0.2)]">
                    <Package size={20} strokeWidth={2.1} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8.5px] font-extrabold uppercase tracking-[0.14em] text-[#5d2ed7]">
                        Equipment Operations
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#D3C4FC]" />
                      
                    </div>
                    <h1 className="text-[19px] font-extrabold tracking-[-0.03em] text-[#22124D] sm:text-[21px]">
                      Rental Master
                    </h1>
                  </div>
                </div>


{/* DATE SEARCH ROW WITH DYNAMIC DATE SELECTION */}
<div className="mt-2.5 flex flex-col gap-2 border-t border-[#F3EFFF] pt-2 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex flex-wrap items-center gap-2">
    {/* Dropdown to pick date type */}
    

    {/* Dropdown to pick date type */}
<select
  value={selectedDateField}
  onChange={(e) => setSelectedDateField(e.target.value)}
  className="h-8 rounded-lg border border-[#E3D9FF] bg-[#FAF8FF] px-2 text-[9px] font-extrabold uppercase tracking-wider text-[#553E82] outline-none transition hover:border-[#D3C4FC] focus:border-[#5d2ed7]"
>
  {/* Default placeholder option */}
  <option value="" disabled>
    Select Date Type
  </option>

  <option value="record_date">Record Date</option>
  <option value="login_date">Login Date</option>
  <option value="logout_date">Logout Date</option>
  <option value="recall_date">Recall Date</option>
  <option value="system_date">System Date</option>
</select>
  </div>

  <div className="flex flex-wrap items-center gap-1.5">
    {/* Start Date */}
    <div className="relative min-w-[130px]">
      <CalendarDays
        size={12}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9C8AC7]"
      />
      <input
        type="date"
        value={recordDateFrom}
        max={recordDateTo || undefined}
        onChange={(e) => setRecordDateFrom(e.target.value)}
        className="h-8 w-full rounded-lg border border-[#E3D9FF] bg-white pl-7 pr-2 text-[9.5px] font-bold text-[#553E82] outline-none transition focus:border-[#5d2ed7]"
      />
    </div>

    <span className="text-[8.5px] font-bold text-[#7F6EA6]">to</span>

    {/* End Date */}
    <div className="relative min-w-[130px]">
      <CalendarDays
        size={12}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9C8AC7]"
      />
      <input
        type="date"
        value={recordDateTo}
        min={recordDateFrom || undefined}
        onChange={(e) => setRecordDateTo(e.target.value)}
        className="h-8 w-full rounded-lg border border-[#E3D9FF] bg-white pl-7 pr-2 text-[9.5px] font-bold text-[#553E82] outline-none transition focus:border-[#5d2ed7]"
      />
    </div>

    {/* Clear Button */}
    {hasRecordDateFilter && (
      <button
        type="button"
        onClick={() => {
          setRecordDateFrom("");
          setRecordDateTo("");
        }}
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E3D9FF] bg-white px-2 text-[8.5px] font-bold text-[#7F6EA6] hover:text-[#5d2ed7]"
      >
        <X size={11} /> Clear
      </button>
    )}
  </div>
</div>


                {/* Right actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={openCalcModal}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E3D9FF] bg-[#F3EFFF] text-[#5d2ed7] shadow-sm transition hover:border-[#D3C4FC] hover:bg-[#EAE2FF]"
                    title="Rental days calculator"
                    aria-label="Open rental days calculator"
                  >
                    <Calculator size={15} strokeWidth={2.2} />
                  </button>

                  <button
                    type="button"
                    onClick={fetchRentals}
                    disabled={loading}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#E3D9FF] bg-white px-3 text-[10px] font-bold text-[#553E82] shadow-sm transition hover:border-[#D3C4FC] hover:bg-[#FAF8FF] hover:text-[#5d2ed7] disabled:opacity-50"
                    title="Refresh rental records"
                  >
                    <RefreshCw
                      size={13}
                      className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/rental-requisition")}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#421E9F] to-[#5d2ed7] px-4 text-[10px] font-extrabold text-white shadow-[0_6px_18px_rgba(93,46,215,0.2)] transition hover:brightness-105 active:scale-95"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    Log New Requisition
                  </button>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="mx-4 border-t border-[#F3EFFF] sm:mx-5" />

              {/* MAIN FILTERS */}
              <div className="px-4 py-3 sm:px-5">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[minmax(220px,1.5fr)_repeat(5,minmax(110px,1fr))_auto]">
                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9C8AC7]"
                    />
                    <input
                      type="text"
                      placeholder="Find rental records"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9 w-full rounded-lg border border-[#E3D9FF] bg-[#FAF8FF] pl-8 pr-8 text-[10.5px] font-semibold text-[#22124D] outline-none transition placeholder:text-[#A697C7] hover:border-[#D3C4FC] focus:border-[#5d2ed7] focus:bg-white focus:ring-2 focus:ring-[#5d2ed7]/[0.08]"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-[#7F6EA6] hover:bg-[#F3EFFF] hover:text-[#5d2ed7]"
                        aria-label="Clear search"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>

                  {/* Care Center */}
                  <select
                    value={careCenterFilter}
                    onChange={(e) => setCareCenterFilter(e.target.value)}
                    className={selectClass}
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
                  >
                    <option value="All">Status · All</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                    <option value="CLOSED">Closed</option>
                  </select>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={activeFilterCount === 0}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#E3D9FF] bg-white px-2.5 text-[9.5px] font-bold text-[#7F6EA6] transition hover:bg-[#FAF8FF] hover:text-[#5d2ed7] disabled:opacity-40"
                    title="Reset filters"
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                </div>

               
              </div>
            </div>
          </section>

          {/* TABLE SECTION */}
          <section className="overflow-hidden rounded-[16px] border border-[#E3D9FF] bg-white shadow-[0_6px_22px_rgba(93,46,215,0.04)]">
            <div className="flex items-center justify-between border-b border-[#F3EFFF] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <p className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#553E82]">
                  Rental Register
                </p>
                <span className="rounded-full bg-[#FAF8FF] px-2 py-0.5 text-[8.5px] font-bold text-[#7F6EA6] ring-1 ring-[#E3D9FF]">
                  {filteredRentals.length}{" "}
                  {filteredRentals.length === 1 ? "record" : "records"}
                </span>
              </div>

              <div className="hidden items-center gap-1.5 text-[8.5px] font-medium text-[#7F6EA6] sm:flex">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D3C4FC] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#5d2ed7]" />
                </span>
                Click any row to open view page
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw size={18} className="animate-spin text-[#5d2ed7]" />
                <p className="mt-3 text-[11px] font-bold text-[#22124D]">
                  Loading rental records…
                </p>
              </div>
            ) : filteredRentals.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E3D9FF] bg-[#FAF8FF] text-[#9C8AC7]">
                  <Package size={18} />
                </div>
                <h3 className="mt-3 text-[13px] font-extrabold text-[#22124D]">
                  No rental records found
                </h3>
                <p className="mt-1 max-w-sm text-[9.5px] text-[#7F6EA6]">
                  Try modifying filter criteria or register a new requisition.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#F3EFFF] bg-[#FAF8FF] text-[8.5px] font-extrabold uppercase tracking-wider text-[#7F6EA6]">
                        <th className="px-4 py-2.5">Equipment</th>
                        <th className="px-3 py-2.5">Bed No.</th>
                        <th className="px-4 py-2.5">Patient / Client</th>
                        <th className="px-3 py-2.5">Login Date</th>
                        <th className="px-3 py-2.5">Logout Date</th>
                        <th className="px-3 py-2.5">Rental Days</th>
                        <th className="px-3 py-2.5 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#F3EFFF]">
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

                        const iconTheme = getEquipmentIconColor(rental.status);

                        return (
                          <tr
                            key={rental.rental_id}
                            onClick={() =>
                              navigate(`/rental-view/${rental.rental_id}`)
                            }
                            className={`group cursor-pointer transition-colors ${
                              isDue
                                ? "bg-amber-50/[0.22] hover:bg-amber-50/50"
                                : "hover:bg-[#FAF8FF]"
                            }`}
                          >
                            {/* Equipment with Dynamic Status Color Icon */}
                            <td className="px-4 py-2.5 align-middle">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${iconTheme.boxClass}`}
                                >
                                  <Package size={14} />
                                  {iconTheme.dotPing && (
                                    <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D3C4FC] opacity-75" />
                                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5d2ed7]" />
                                    </span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="max-w-[200px] truncate text-[11px] font-extrabold text-[#22124D]">
                                    {displayDeviceModel}
                                  </p>
                                  
                                </div>
                              </div>
                            </td>

                            {/* Bed Number */}
                            <td className="px-3 py-2.5 align-middle">
                              <span className="inline-flex min-w-[50px] items-center justify-center rounded-md border border-[#E3D9FF] bg-[#FAF8FF] px-2 py-0.5 text-[9.5px] font-bold text-[#553E82]">
                                {rental.care_bed_no || "—"}
                              </span>
                            </td>

                            {/* Patient */}
                            <td className="px-4 py-2.5 align-middle">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F3EFFF] text-[#5d2ed7]">
                                  <UserRound size={12} />
                                </div>
                                <div className="min-w-0">
                                  <p className="max-w-[160px] truncate text-[10.5px] font-bold text-[#22124D]">
                                    {rental.patient_name || "N/A"}
                                  </p>
                                  {(rental.carecenter?.carecenter_name ||
                                    rental.care_center?.carecenter_name) && (
                                    <p className="flex max-w-[160px] items-center gap-1 truncate text-[8px] font-medium text-[#7F6EA6]">
                                      <Building2 size={8} />
                                      {rental.carecenter?.carecenter_name ||
                                        rental.care_center?.carecenter_name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Login */}
                            <td className="px-3 py-2.5 align-middle">
                              <span className="text-[9.5px] font-semibold text-[#553E82]">
                                {formatDisplayDate(rental.login_date)}
                              </span>
                            </td>

                            {/* Logout */}
                            <td className="px-3 py-2.5 align-middle">
                              <span className="text-[9.5px] font-semibold text-[#553E82]">
                                {formatDisplayDate(rental.login_out_date)}
                              </span>
                            </td>

                            {/* Days */}
                            <td className="px-3 py-2.5 align-middle">
                              {calculateTotalDays(
                                rental.login_date,
                                rental.login_out_date,
                                rental.status,
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-3 py-2.5 align-middle">
                              <div
                                className="flex items-center justify-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Link
                                  to={`/rental-edit/${rental.rental_id}`}
                                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E8DEFF] bg-[#F3EFFF] text-[#5d2ed7] transition hover:border-[#D3C4FC] hover:bg-[#EAE2FF]"
                                  title="Edit rental"
                                >
                                  <Pencil size={12} strokeWidth={2.1} />
                                </Link>

                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handleDeleteClick(e, rental.rental_id)
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
                                  title="Delete rental"
                                >
                                  <Trash2 size={12} strokeWidth={2.1} />
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
                <div className="flex flex-col items-center justify-between gap-2.5 border-t border-[#F3EFFF] bg-[#FAF8FF] px-4 py-2.5 sm:flex-row">
                  <p className="text-[9px] font-medium text-[#7F6EA6]">
                    Showing{" "}
                    <span className="font-bold text-[#22124D]">
                      {indexOfFirstRecord + 1}
                    </span>{" "}
                    –{" "}
                    <span className="font-bold text-[#22124D]">
                      {Math.min(indexOfLastRecord, filteredRentals.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-[#22124D]">
                      {filteredRentals.length}
                    </span>{" "}
                    records
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E3D9FF] bg-white text-[#553E82] transition hover:border-[#D3C4FC] hover:bg-[#FAF8FF] disabled:opacity-35"
                      title="Previous page"
                    >
                      <ChevronLeft size={13} />
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
                              <span className="px-0.5 text-[9px] text-[#A697C7]">
                                …
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              className={`h-7 min-w-[28px] rounded-md border px-1.5 text-[9px] font-extrabold transition ${
                                currentPage === page
                                  ? "border-[#5d2ed7] bg-[#5d2ed7] text-white shadow-sm"
                                  : "border-[#E3D9FF] bg-white text-[#553E82] hover:bg-[#FAF8FF]"
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
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E3D9FF] bg-white text-[#553E82] transition hover:border-[#D3C4FC] hover:bg-[#FAF8FF] disabled:opacity-35"
                      title="Next page"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {/* CALCULATE DAYS MODAL */}
      {calcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
          <button
            type="button"
            aria-label="Close calculator"
            className="absolute inset-0 cursor-default bg-[#22124D]/55 backdrop-blur-[2px]"
            onClick={closeCalcModal}
          />

          <div className="relative w-full max-w-[420px] overflow-hidden rounded-[18px] border border-white/30 bg-white shadow-[0_20px_60px_rgba(37,15,97,0.25)] animate-in fade-in zoom-in-95 duration-150">
            <div className="relative overflow-hidden bg-gradient-to-r from-[#250F61] via-[#421E9F] to-[#5d2ed7] px-4 py-3.5 text-white">
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.15]">
                    <Calculator size={15} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-extrabold tracking-tight">
                      Calculate Total Days
                    </h3>
                    <p className="text-[9px] text-purple-200/80">
                      Temporary calculator · does not alter records
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeCalcModal}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.1] text-white/80 hover:bg-white/[0.2]"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[8.5px] font-extrabold uppercase tracking-wider text-[#7F6EA6]">
                    Login Date
                  </label>
                  <input
                    type="date"
                    value={editLoginDate}
                    onChange={(e) => setEditLoginDate(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#E3D9FF] bg-[#FAF8FF] px-2.5 text-[10px] font-semibold text-[#22124D] outline-none focus:border-[#5d2ed7] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[8.5px] font-extrabold uppercase tracking-wider text-[#7F6EA6]">
                    Logout Date
                  </label>
                  <input
                    type="date"
                    value={editLogoutDate}
                    onChange={(e) => setEditLogoutDate(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#E3D9FF] bg-[#FAF8FF] px-2.5 text-[10px] font-semibold text-[#22124D] outline-none focus:border-[#5d2ed7] focus:bg-white"
                  />
                </div>
              </div>

              <div
                className={`mt-4 rounded-xl border p-3.5 text-center ${
                  !editLogoutDate && modalDays >= 30
                    ? "border-amber-200 bg-amber-50"
                    : "border-[#E3D9FF] bg-[#FAF8FF]"
                }`}
              >
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#5d2ed7] shadow-sm">
                  <Clock3 size={13} />
                </div>
                <p className="mt-2 text-[8.5px] font-extrabold uppercase tracking-wider text-[#7F6EA6]">
                  Calculated Rental Days
                </p>
                <div className="mt-1 flex items-baseline justify-center gap-1">
                  <span className="text-[24px] font-black tracking-tight text-[#5d2ed7]">
                    {modalDays}
                  </span>
                  <span className="text-[13px] font-bold text-[#8B7BB5]">
                    / {modalSecond}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#F3EFFF] bg-[#FAF8FF] px-4 py-3">
              <button
                type="button"
                onClick={clearCalculator}
                disabled={!editLoginDate && !editLogoutDate}
                className="h-8 rounded-lg border border-[#E3D9FF] bg-white px-3 text-[9.5px] font-bold text-[#553E82] hover:bg-[#FAF8FF] disabled:opacity-40"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={closeCalcModal}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#421E9F] to-[#5d2ed7] px-3.5 text-[9.5px] font-extrabold text-white"
              >
                <CheckCircle2 size={12} />
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}