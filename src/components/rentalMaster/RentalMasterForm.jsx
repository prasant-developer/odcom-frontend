
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import DashboardLayout from "../Admin/Layout";
// import Select from "react-select";
// import {
//   ArrowLeft,
//   Building2,
//   CalendarDays,
//   Camera,
//   CheckCircle2,
//   ChevronRight,
//   CircleDollarSign,
//   ClipboardList,
//   CreditCard,
//   FileText,
//   HeartHandshake,
//   ImagePlus,
//   IndianRupee,
//   Layers3,
//   Loader2,
//   MapPin,
//   Package,
//   Phone,
//   Save,
//   ShieldCheck,
//   Stethoscope,
//   Trash2,
//   UserRound,
//   UsersRound,
//   Wrench,
//   X,
//   Hash,
// } from "lucide-react";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// export default function RentalForm({
//   formData: passedFormData,
//   setFormData: passedSetFormData,
//   onCancel,
//   onSuccess,
// }) {
//   const today = new Date().toISOString().split("T")[0];
//   const navigate = useNavigate();

//   const [localFormData, setLocalFormData] = useState({
//     record_date: today,
//     billing_type: "Monthly",
//     status: "Pending",
//     device_id: "",
//     care_center_id: "", // Tracks relational ID
//   });

//   const formData = passedFormData || localFormData;
//   const setFormData = (nextState) => {
//     if (typeof passedSetFormData === "function") {
//       passedSetFormData(nextState);
//     } else {
//       setLocalFormData(nextState);
//     }
//   };

//   const [deviceModels, setDeviceModels] = useState([]);
//   const [careCenters, setCareCenters] = useState([]); // Care centers list
//   const [references, setReferences] = useState([]); // State for references dropdown
//   const [inventoryList, setInventoryList] = useState([]);
//   const [filteredSerials, setFilteredSerials] = useState([]);
//   const [assetPhotos, setAssetPhotos] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [accessories, setAccessories] = useState([]); // Accessories list

//   // ===============================
//   // 1. FETCH EQUIPMENT MODELS
//   // ===============================
//   useEffect(() => {
//     const fetchDevices = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_BASE_URL}/api/devices`, {
//           headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//         });
//         const result = await res.json();
//         const items = Array.isArray(result) ? result : result.data || [];

//         const activeDevices = items.filter((d) => d.status === "active");
//         setDeviceModels(activeDevices);
//       } catch (err) {
//         console.error("Failed fetching hardware device entities:", err);
//       }
//     };
//     fetchDevices();
//   }, []);

//   // ===============================
//   // 2. FETCH CARE CENTERS FOR DROPDOWN
//   // ===============================
//   useEffect(() => {
//     const fetchCareCenters = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_BASE_URL}/api/carecenters`, {
//           headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//         });
//         const result = await res.json();
//         const items = Array.isArray(result) ? result : result.data || [];

//         // Filter for active centers
//         const activeCenters = items.filter((c) => c.status === "active");
//         setCareCenters(activeCenters);
//       } catch (err) {
//         console.error("Failed fetching care center entities:", err);
//       }
//     };
//     fetchCareCenters();
//   }, []);

//   // ===============================
//   // 2.1 FETCH REFERENCES / DOCTORS FOR DROPDOWNS
//   // ===============================
//   useEffect(() => {
//     const fetchReferences = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_BASE_URL}/api/references`, {
//           headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//         });
//         const result = await res.json();
//         const items = Array.isArray(result) ? result : result.data || [];

//         // Filter active doctor references
//         const activeReferences = items.filter((r) => r.status === "active");
//         setReferences(activeReferences);
//       } catch (err) {
//         console.error("Failed fetching reference doctor entities:", err);
//       }
//     };
//     fetchReferences();
//   }, []);

//   // ===============================
//   // 2.2 FETCH ACCESSORIES FOR DROPDOWN
//   // ===============================
//   useEffect(() => {
//     const fetchAccessories = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_BASE_URL}/api/accessori`, {
//           headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//         });
//         const result = await res.json();
//         const items = Array.isArray(result) ? result : result.data || [];

//         // Filter active accessories
//         const activeAccessories = items.filter((a) => a.status === "active");
//         setAccessories(activeAccessories);
//       } catch (err) {
//         console.error("Failed fetching accessory entities:", err);
//       }
//     };
//     fetchAccessories();
//   }, []);

//   // ===============================
//   // 3. FETCH INVENTORY
//   // ===============================
//   useEffect(() => {
//     const fetchInventory = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_BASE_URL}/api/inventory`, {
//           headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//         });
//         const result = await res.json();
//         if (result.success) {
//           setInventoryList(result.data || []);
//         }
//       } catch (err) {
//         console.error("Failed fetching hardware inventory pools:", err);
//       }
//     };
//     fetchInventory();
//   }, []);

//   // Filter serial numbers dynamically
//   useEffect(() => {
//     if (formData?.device_id) {
//       const chosenDeviceObj = deviceModels.find(
//         (d) => Number(d.device_id) === Number(formData.device_id),
//       );
//       if (chosenDeviceObj) {
//         const serials = inventoryList.filter(
//           (item) => item.device_model === chosenDeviceObj.device_name,
//         );
//         setFilteredSerials(serials);
//       }
//     } else {
//       setFilteredSerials([]);
//     }
//   }, [formData?.device_id, deviceModels, inventoryList]);

//   // Clean up memory leaks from object URLs
//   useEffect(() => {
//     const urls = assetPhotos.map((photo) => photo.previewUrl);
//     return () => {
//       urls.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [assetPhotos]);

//   const handleCareCenterChange = (e) => {
//     const selectedId = e.target.value;

//     // No selection
//     if (!selectedId) {
//       setFormData((prev) => ({
//         ...prev,
//         care_center_id: "",
//         care_center_name: "",
//         mob_no: "",
//         alternative_mob_no: "",
//         care_address: "",
//       }));
//       return;
//     }

//     // Other selected
//     if (selectedId === "other") {
//       setFormData((prev) => ({
//         ...prev,
//         care_center_id: "other",
//         care_center_name: "",
//         mob_no: "",
//         alternative_mob_no: "",
//         care_address: "",
//       }));
//       return;
//     }

//     // Existing care center
//     const selectedCenter = careCenters.find(
//       (center) => Number(center.carecenter_id) === Number(selectedId),
//     );

//     if (selectedCenter) {
//       setFormData((prev) => ({
//         ...prev,
//         care_center_id: selectedId,
//         care_center_name: selectedCenter.carecenter_name,
//         mob_no: selectedCenter.mobile_number || "",
//         alternative_mob_no: selectedCenter.alternative_mobile_number || "",
//         care_address: selectedCenter.address || "",
//       }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const incomingFiles = Array.from(e.target.files || []);

//     const newPhotos = incomingFiles.map((file) => ({
//       file: file,
//       previewUrl: URL.createObjectURL(file),
//       id: `${file.name}-${file.size}-${Date.now()}`,
//     }));

//     setAssetPhotos((prevPhotos) => {
//       const combined = [...prevPhotos, ...newPhotos];
//       if (combined.length > 10) {
//         alert("Maximum upload allowance capped at 10 items.");
//         return combined.slice(0, 10);
//       }
//       return combined;
//     });

//     e.target.value = "";
//   };

//   const handleRemovePhoto = (idToRemove) => {
//     setAssetPhotos((prevPhotos) =>
//       prevPhotos.filter((p) => p.id !== idToRemove),
//     );
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const isEditMode = !!formData?.rental_id;
//     const url = isEditMode
//       ? `${API_BASE_URL}/api/rentals/${formData.rental_id}`
//       : `${API_BASE_URL}/api/rentals`;

//     const method = isEditMode ? "PUT" : "POST";

//     try {
//       const token = localStorage.getItem("token");
//       let headers = {
//         ...(token && { Authorization: `Bearer ${token}` }),
//       };

//       const body = new FormData();

//       Object.keys(formData).forEach((key) => {
//         if (key === "device" || key === "careCenter" || key === "asset_photos")
//           return;

//         if (formData[key] !== null && formData[key] !== undefined) {
//           body.append(key, formData[key]);
//         }
//       });

//       assetPhotos.forEach((photoWrapper) => {
//         body.append("asset_photos", photoWrapper.file);
//       });

//       const response = await fetch(url, { method, headers, body });

//       if (!response.ok) {
//         if (response.status === 401) {
//           alert("Authentication session expired. Please log in again.");
//           return;
//         }
//         throw new Error("Server rejected registration submission.");
//       }

//       const result = await response.json();
//       if (!result.success)
//         throw new Error(result.message || "Operation failed.");

//       alert(
//         isEditMode
//           ? "Rental parameters modified successfully."
//           : "New rental transaction deployed successfully!",
//       );

//       if (onSuccess) onSuccess();
//       navigate("/rental-master");
//     } catch (err) {
//       alert(`Transaction aborted: ${err.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const sectionTitle = (number, Icon, title, description) => (
//     <div className="flex items-start gap-3.5">
//       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F6EF] text-[#087A57] ring-1 ring-[#D7EEE4]">
//         <Icon size={19} strokeWidth={2.1} />
//       </div>
//       <div className="min-w-0">
//         <div className="flex items-center gap-2">
//           <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#0A8A60]">
//             Step {number}
//           </span>
//           <span className="h-1 w-1 rounded-full bg-[#C9D8D1]" />
//           <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
//             ODCom Rental
//           </span>
//         </div>
//         <h2 className="mt-1 text-[15px] font-extrabold tracking-[-0.015em] text-[#183A2F]">
//           {title}
//         </h2>
//         <p className="mt-0.5 text-[11px] leading-5 text-[#8A9B94]">
//           {description}
//         </p>
//       </div>
//     </div>
//   );

//   const labelClass =
//     "mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.055em] text-[#526A60]";
//   const inputClass =
//     "h-[46px] w-full rounded-xl border border-[#DDE9E4] bg-[#FBFDFC] px-3.5 text-[13px] font-semibold text-[#203D33] outline-none transition-all placeholder:font-normal placeholder:text-[#A9B8B1] hover:border-[#BED8CD] focus:border-[#0A9466] focus:bg-white focus:ring-4 focus:ring-[#0A9466]/[0.08]";
//   const textareaClass =
//     "w-full rounded-xl border border-[#DDE9E4] bg-[#FBFDFC] px-3.5 py-3 text-[13px] font-medium text-[#203D33] outline-none transition-all placeholder:text-[#A9B8B1] hover:border-[#BED8CD] focus:border-[#0A9466] focus:bg-white focus:ring-4 focus:ring-[#0A9466]/[0.08] resize-none";
//   const selectClass = `${inputClass} cursor-pointer`;
//   const cardClass =
//     "overflow-hidden rounded-[20px] border border-[#E1ECE7] bg-white shadow-[0_8px_28px_rgba(25,92,67,0.055)]";

//   const isEditing = !!formData?.rental_id;

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-[#F5F9F7]">
//         {/* =====================================================
//             PAGE HEADER
//         ====================================================== */}
//         <div className="border-b border-[#E4EEE9] bg-white/95 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
//           <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex items-start gap-4">
//               <button
//                 type="button"
//                 onClick={() =>
//                   onCancel ? onCancel() : navigate("/rental-master")
//                 }
//                 className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCE9E3] bg-white text-[#6F837A] transition hover:border-[#BFD8CC] hover:bg-[#F3F9F6] hover:text-[#087A57]"
//                 title="Back to Rental Master"
//                 aria-label="Back to Rental Master"
//               >
//                 <ArrowLeft size={18} />
//               </button>

//               <div>
//                 <h1 className="text-[24px] font-extrabold tracking-[-0.035em] text-[#183A2F] sm:text-[28px]">
//                   {isEditing
//                     ? "Edit Rental Requisition"
//                     : "Create Rental Requisition"}
//                 </h1>
//               </div>
//             </div>

//             <div className="flex items-center gap-2.5">
//               <button
//                 type="button"
//                 onClick={() =>
//                   onCancel ? onCancel() : navigate("/rental-master")
//                 }
//                 disabled={isSubmitting}
//                 className="hidden h-10 items-center gap-2 rounded-xl border border-[#DDE8E3] bg-white px-4 text-[11px] font-bold text-[#64776F] transition hover:bg-[#F5F9F7] disabled:opacity-50 sm:flex"
//               >
//                 <ArrowLeft size={14} />
//                 Rental Master
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* =====================================================
//             FORM BODY
//         ====================================================== */}
//         <form onSubmit={handleFormSubmit}>
//           <div className="mx-auto w-full max-w-[1450px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
//             {/* =================================================
//                 STEP 1 - RENTAL TYPE
//             ================================================== */}
//             <section className={cardClass}>
//               <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
//                 <div>
//                   <label className={labelClass}>
//                     Deal Type <span className="text-rose-500">*</span>
//                   </label>
//                   <select
//                     required
//                     value={formData?.deal_type || "Monthly"}
//                     onChange={(e) =>
//                       setFormData({ ...formData, deal_type: e.target.value })
//                     }
//                     className={selectClass}
//                   >
//                     <option value="select">Select deal type</option>
//                     <option value="B2B">B2B</option>
//                     <option value="B2C">B2C</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className={labelClass}>
//                     Unit <span className="text-rose-500">*</span>
//                   </label>
//                   <select
//                     required
//                     value={formData?.unit_type || "Monthly"}
//                     onChange={(e) =>
//                       setFormData({ ...formData, unit_type: e.target.value })
//                     }
//                     className={selectClass}
//                   >
//                     <option value="Monthly">Select unit</option>
//                     <option value="CWF">BWF</option>
//                     <option value="ODCOM">ODCOM</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className={labelClass}>
//                     Mode <span className="text-rose-500">*</span>
//                   </label>
//                   <select
//                     required
//                     value={formData?.mode_type || "Monthly"}
//                     onChange={(e) =>
//                       setFormData({ ...formData, mode_type: e.target.value })
//                     }
//                     className={selectClass}
//                   >
//                     <option value="Monthly">Select mode</option>
//                     <option value="Prepaid">Prepaid</option>
//                     <option value="Postpaid">Postpaid</option>
//                   </select>
//                 </div>
//               </div>
//             </section>

//             {/* =================================================
//                 STEP 2 - EQUIPMENT & DATES
//             ================================================== */}
//             <section className={cardClass}>
//               <div className="p-5 sm:p-6">
//                 <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
//                   {/* Device */}
//                   <div className="rounded-[16px] border border-[#DCEBE4] bg-[#F8FCFA] p-4">
//                     <label className={labelClass}>
//                       Device Model <span className="text-rose-500">*</span>
//                     </label>
//                     <select
//                       required
//                       value={formData?.device_id || ""}
//                       onChange={(e) => {
//                         setFormData({
//                           ...formData,
//                           device_id: e.target.value,
//                         });
//                       }}
//                       className={selectClass}
//                     >
//                       <option value="">Choose equipment model</option>
//                       {deviceModels.map((dev) => (
//                         <option key={dev.device_id} value={dev.device_id}>
//                           {dev.device_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Serial No. */}
//                   <div className="rounded-[16px] border border-[#DCEBE4] bg-[#F8FCFA] p-4">
//                     <div className="mb-3 flex items-center gap-2"></div>

//                     <label className={labelClass}>
//                       Serial No. <span className="text-rose-500">*</span>
//                     </label>

//                     <input
//                       type="text"
//                       required
//                       value={formData?.serial_no || ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           serial_no: e.target.value,
//                         })
//                       }
//                       className={inputClass}
//                       placeholder="Enter serial number"
//                     />
//                   </div>

//                   {/* Accessories */}
//                   <div className="rounded-[16px] border border-[#DCEBE4] bg-[#F8FCFA] p-4">
//                     <div className="mb-3 flex items-center gap-2"></div>

//                     <label className={labelClass}>Select Accessories</label>
//                     <Select
//                       isMulti
//                       options={accessories.map((acc) => ({
//                         value: acc.accessory_id,
//                         label: acc.accessory_name,
//                       }))}
//                       value={accessories
//                         .filter((acc) =>
//                           formData.accessory_id?.includes(acc.accessory_id),
//                         )
//                         .map((acc) => ({
//                           value: acc.accessory_id,
//                           label: acc.accessory_name,
//                         }))}
//                       onChange={(selected) =>
//                         setFormData({
//                           ...formData,
//                           accessory_id: selected
//                             ? selected.map((item) => item.value)
//                             : [],
//                         })
//                       }
//                       className="w-full text-[12px]"
//                       classNamePrefix="odcom-select"
//                       placeholder="Choose accessories..."
//                       noOptionsMessage={() => "No accessories available"}
//                       styles={{
//                         control: (provided, state) => ({
//                           ...provided,
//                           minHeight: "46px",
//                           borderRadius: "12px",
//                           borderColor: state.isFocused ? "#0A9466" : "#DDE9E4",
//                           backgroundColor: state.isFocused
//                             ? "#FFFFFF"
//                             : "#FBFDFC",
//                           boxShadow: state.isFocused
//                             ? "0 0 0 4px rgba(10,148,102,0.08)"
//                             : "none",
//                           fontSize: "13px",
//                           fontWeight: 600,
//                           "&:hover": {
//                             borderColor: "#BED8CD",
//                           },
//                         }),
//                         valueContainer: (provided) => ({
//                           ...provided,
//                           padding: "3px 10px",
//                         }),
//                         multiValue: (provided) => ({
//                           ...provided,
//                           backgroundColor: "#E8F6EF",
//                           borderRadius: "8px",
//                           border: "1px solid #D7EEE4",
//                         }),
//                         multiValueLabel: (provided) => ({
//                           ...provided,
//                           color: "#087A57",
//                           fontWeight: 700,
//                           fontSize: "11px",
//                         }),
//                         multiValueRemove: (provided) => ({
//                           ...provided,
//                           color: "#087A57",
//                           borderRadius: "0 8px 8px 0",
//                           ":hover": {
//                             backgroundColor: "#087A57",
//                             color: "white",
//                           },
//                         }),
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 50,
//                           borderRadius: "12px",
//                           overflow: "hidden",
//                           border: "1px solid #E1ECE7",
//                           boxShadow: "0 15px 40px rgba(15,72,53,0.12)",
//                         }),
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-5 border-t border-[#EDF3F0] pt-5">
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
//                     <div>
//                       <label className={labelClass}>Record Date</label>
//                       <input
//                         type="date"
//                         value={formData?.record_date || ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             record_date: e.target.value,
//                           })
//                         }
//                         className={inputClass}
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>
//                         Log In Date <span className="text-rose-500">*</span>
//                       </label>
//                       <input
//                         type="date"
//                         required
//                         value={formData?.login_date || ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             login_date: e.target.value,
//                           })
//                         }
//                         className={inputClass}
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>
//                         Notify Date{" "}
//                         {formData?.mode_type === "Prepaid" && (
//                           <span className="text-rose-500">*</span>
//                         )}
//                       </label>
//                       <input
//                         type="date"
//                         required={formData?.mode_type === "Prepaid"}
//                         value={formData?.notify_date || ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             notify_date: e.target.value,
//                           })
//                         }
//                         className={inputClass}
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>Log Out Date</label>
//                       <input
//                         type="date"
//                         value={formData?.login_out_date || ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             login_out_date: e.target.value,
//                           })
//                         }
//                         className={inputClass}
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>Recall Date</label>
//                       <input
//                         type="date"
//                         value={formData?.recall_date || ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             recall_date: e.target.value,
//                           })
//                         }
//                         className={inputClass}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* =================================================
//                 STEP 3 - COMMERCIALS
//             ================================================== */}
//             <section className={cardClass}>
//               <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
//                 <div>
//                   <label className={labelClass}>
//                     Billing Type <span className="text-rose-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <CreditCard
//                       size={15}
//                       className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
//                     />
//                     <select
//                       required
//                       value={formData?.billing_type || "Monthly"}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           billing_type: e.target.value,
//                         })
//                       }
//                       className={`${selectClass} pl-10`}
//                     >
//                       <option value="Monthly">Monthly</option>
//                       <option value="Fort Night">Fort Night</option>
//                       <option value="Daily">Daily</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Rental Charge</label>
//                   <div className="relative">
//                     <IndianRupee
//                       size={15}
//                       className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
//                     />
//                     <input
//                       type="number"
//                       value={formData?.rental_charge ?? ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           rental_charge:
//                             e.target.value === "" ? 0 : Number(e.target.value),
//                         })
//                       }
//                       className={`${inputClass} pl-10`}
//                       placeholder="0"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Deposit / Advance</label>
//                   <div className="relative">
//                     <IndianRupee
//                       size={15}
//                       className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
//                     />
//                     <input
//                       type="number"
//                       value={formData?.deposit_advance ?? ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           deposit_advance:
//                             e.target.value === "" ? 0 : Number(e.target.value),
//                         })
//                       }
//                       className={`${inputClass} pl-10`}
//                       placeholder="0"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Installation Charge</label>
//                   <div className="relative">
//                     <IndianRupee
//                       size={15}
//                       className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
//                     />
//                     <input
//                       type="number"
//                       value={formData?.installation_charge ?? ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           installation_charge:
//                             e.target.value === "" ? 0 : Number(e.target.value),
//                         })
//                       }
//                       className={`${inputClass} pl-10`}
//                       placeholder="0"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* =================================================
//                 STEP 4 & 5 - CARE CENTER + PATIENT
//             ================================================== */}
//             <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
//               {/* Care Center */}
//               <section className={cardClass}>
//                 <div className="space-y-4 p-5 sm:p-6">
//                   <div>
//                     <label className={labelClass}>Care Center Name</label>
//                     <select
//                       value={formData?.care_center_id || ""}
//                       onChange={handleCareCenterChange}
//                       className={selectClass}
//                     >
//                       <option value="">Select care center</option>
//                       {careCenters.map((center) => (
//                         <option
//                           key={center.carecenter_id}
//                           value={center.carecenter_id}
//                         >
//                           {center.carecenter_name}
//                         </option>
//                       ))}
//                       <option value="other">Other / Manual Entry</option>
//                     </select>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     <div>
//                       <label className={labelClass}>POC Mobile</label>
//                       <div className="relative">
//                         <Phone
//                           size={15}
//                           className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
//                         />
//                         <input
//                           type="text"
//                           value={formData?.mob_no || ""}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               mob_no: e.target.value,
//                             })
//                           }
//                           className={`${inputClass} pl-10`}
//                           placeholder="Primary contact"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className={labelClass}>Alternative Mobile</label>
//                       <div className="relative">
//                         <Phone
//                           size={15}
//                           className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
//                         />
//                         <input
//                           type="text"
//                           value={formData?.alternative_mob_no || ""}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               alternative_mob_no: e.target.value,
//                             })
//                           }
//                           className={`${inputClass} pl-10`}
//                           placeholder="Optional contact"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label className={labelClass}>Care Address</label>
//                     <div className="relative">
//                       <MapPin
//                         size={15}
//                         className="pointer-events-none absolute left-3.5 top-3.5 text-[#89A097]"
//                       />
//                       <textarea
//                         rows={3}
//                         value={formData?.care_address || ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             care_address: e.target.value,
//                           })
//                         }
//                         className={`${textareaClass} pl-10`}
//                         placeholder="Facility / deployment address"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     <div>
//                       <label className={labelClass}>Bed No.</label>
//                       <input
//                         type="text"
//                         value={formData?.care_bed_no || ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             care_bed_no: e.target.value,
//                           })
//                         }
//                         className={inputClass}
//                         placeholder="Bed / room"
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>POC Name / Doctor</label>
//                       <div className="relative">
//                         <Stethoscope
//                           size={15}
//                           className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
//                         />
//                         <input
//                           type="text"
//                           value={formData?.care_poc_name || ""}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               care_poc_name: e.target.value,
//                             })
//                           }
//                           className={`${inputClass} pl-10`}
//                           placeholder="Contact person"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label className={labelClass}>Referral</label>
//                     <select
//                       value={formData?.care_referal || ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           care_referal: e.target.value,
//                         })
//                       }
//                       className={selectClass}
//                     >
//                       <option value="">Select referral</option>
//                       {references.map((ref) => (
//                         <option key={ref.reference_id} value={ref.doctor_name}>
//                           {ref.doctor_name} - {ref.hospital_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </section>

//               {/* Patient */}
//               <section className={cardClass}>
//                 <div className="space-y-4 p-5 sm:p-6">
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
//                     <div>
//                       <label className={labelClass}>
//                         Patient Name <span className="text-rose-500">*</span>
//                       </label>
//                       <div className="relative">
//                         <UserRound
//                           size={15}
//                           className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
//                         />
//                         <input
//                           type="text"
//                           required
//                           value={formData?.patient_name || ""}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               patient_name: e.target.value,
//                             })
//                           }
//                           className={`${inputClass} pl-10`}
//                           placeholder="Full name"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className={labelClass}>Age</label>
//                       <input
//                         type="number"
//                         value={formData?.patient_age ?? ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             patient_age:
//                               e.target.value === ""
//                                 ? ""
//                                 : Number(e.target.value),
//                           })
//                         }
//                         className={inputClass}
//                         placeholder="Age"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className={labelClass}>Attendant Name</label>
//                     <div className="relative">
//                       <UsersRound
//                         size={15}
//                         className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
//                       />
//                       <input
//                         type="text"
//                         value={formData?.patient_attendant_name || ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             patient_attendant_name: e.target.value,
//                           })
//                         }
//                         className={`${inputClass} pl-10`}
//                         placeholder="Attendant / family contact"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     <div>
//                       <label className={labelClass}>Mobile Number</label>
//                       <div className="relative">
//                         <Phone
//                           size={15}
//                           className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
//                         />
//                         <input
//                           type="text"
//                           value={formData?.patient_mob_no || ""}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               patient_mob_no: e.target.value,
//                             })
//                           }
//                           className={`${inputClass} pl-10`}
//                           placeholder="Primary mobile"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className={labelClass}>Alternative Mobile</label>
//                       <div className="relative">
//                         <Phone
//                           size={15}
//                           className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
//                         />
//                         <input
//                           type="text"
//                           value={formData?.patient_alternative_mob_no || ""}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               patient_alternative_mob_no: e.target.value,
//                             })
//                           }
//                           className={`${inputClass} pl-10`}
//                           placeholder="Optional mobile"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label className={labelClass}>Delivery Address</label>
//                     <div className="relative">
//                       <MapPin
//                         size={15}
//                         className="pointer-events-none absolute left-3.5 top-3.5 text-[#89A097]"
//                       />
//                       <textarea
//                         rows={4}
//                         value={formData?.patient_delivery_address || ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             patient_delivery_address: e.target.value,
//                           })
//                         }
//                         className={`${textareaClass} pl-10`}
//                         placeholder="Complete delivery / installation address"
//                       />
//                     </div>
//                   </div>

//                   <div className="rounded-xl border border-[#E2EEE8] bg-[#F7FBF9] px-4 py-3">
//                     <div className="flex items-start gap-2.5">
//                       <HeartHandshake
//                         size={16}
//                         className="mt-0.5 shrink-0 text-[#087A57]"
//                       />
//                       <p className="text-[10.5px] leading-5 text-[#758980]">
//                         Verify recipient contact and delivery location before
//                         deploying the equipment to reduce service and pickup
//                         errors.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </section>
//             </div>

//             {/* =================================================
//                 STEP 6 - NOTES + PHOTOS
//             ================================================== */}
//             <section className={cardClass}>
//               <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
//                 {/* Notes */}
                

//                 <div className="space-y-5">
//                   {/* Transactions Notes */}
//                   <div>
//                     <label className={labelClass}>Transactions Notes</label>

//                     <div className="relative">
//                       <FileText
//                         size={15}
//                         className="pointer-events-none absolute left-3.5 top-3.5 text-[#89A097]"
//                       />

//                       <textarea
//                         rows={5}
//                         value={formData?.notes || ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             notes: e.target.value,
//                           })
//                         }
//                         className={`${textareaClass} min-h-[130px] pl-10`}
//                         placeholder="Installation notes, equipment condition, service requirements, pickup instructions..."
//                       />
//                     </div>

                    
//                   </div>

//                   {/* Internal Notes */}
//                   <div>
//                     <label className={labelClass}>Internal Notes</label>

//                     <div className="relative">
//                       <FileText
//                         size={15}
//                         className="pointer-events-none absolute left-3.5 top-3.5 text-[#89A097]"
//                       />

//                       <textarea
//                         rows={5}
//                         value={formData?.internal_notes || ""}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             internal_notes: e.target.value,
//                           })
//                         }
//                         className={`${textareaClass} min-h-[130px] pl-10`}
//                         placeholder="Internal remarks, team instructions, follow-up details, billing notes..."
//                       />
//                     </div>

                    
//                   </div>
//                 </div>

//                 {/* Upload */}
//                 <div className="rounded-[16px] border border-dashed border-[#CFE2D9] bg-[#F8FCFA] p-4">
//                   <div className="mb-4 flex items-center justify-between gap-3">
//                     {assetPhotos.length > 0 && (
//                       <span className="inline-flex items-center gap-1 rounded-full border border-[#D7EEE4] bg-[#EAF7F0] px-2 py-1 text-[9px] font-bold text-[#087A57]">
//                         <CheckCircle2 size={11} />
//                         {assetPhotos.length} Ready
//                       </span>
//                     )}
//                   </div>

//                   <label className="group flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-[#DCEAE3] bg-white px-4 py-6 text-center transition hover:border-[#AFCFC0] hover:bg-[#FBFDFC]">
//                     <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57] transition group-hover:scale-105">
//                       <ImagePlus size={20} />
//                     </div>

//                     <p className="mt-3 text-[11px] font-extrabold text-[#496158]">
//                       Add handover photographs
//                     </p>

//                     <p className="mt-1 text-[9.5px] text-[#98A8A1]">
//                       Select one or multiple equipment images
//                     </p>

//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       onChange={handleFileChange}
//                       className="hidden"
//                     />
//                   </label>

//                   {assetPhotos.length > 0 && (
//                     <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
//                       {assetPhotos.map((photo, index) => (
//                         <div
//                           key={photo.id}
//                           className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#DDE9E4] bg-white shadow-sm"
//                         >
//                           <img
//                             src={photo.previewUrl}
//                             alt={`Asset preview ${index + 1}`}
//                             className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
//                           />

//                           <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-2 pb-1.5 pt-5">
//                             <span className="text-[8px] font-bold text-white/90">
//                               Photo {index + 1}
//                             </span>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() => handleRemovePhoto(photo.id)}
//                             className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-rose-600 opacity-90 shadow-md transition hover:bg-rose-600 hover:text-white"
//                             title="Remove photo"
//                             aria-label={`Remove photo ${index + 1}`}
//                           >
//                             <Trash2 size={13} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </section>

//             {/* =================================================
//                 FINAL ACTION / SUMMARY
//             ================================================== */}
//             <div className="sticky bottom-3 z-20">
//               <div className="flex flex-col gap-3 rounded-[18px] border border-[#DDE9E4] bg-white/95 px-4 py-3.5 shadow-[0_18px_45px_rgba(24,82,61,0.14)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
//                 <div className="flex items-center gap-3">
//                   <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57] sm:flex">
//                     <ShieldCheck size={17} />
//                   </div>
//                   <div>
//                     <p className="text-[10.5px] font-extrabold text-[#405B50]">
//                       {isEditing
//                         ? "Ready to update this rental record?"
//                         : "Ready to create this rental requisition?"}
//                     </p>
//                     <p className="mt-0.5 text-[9px] text-[#98A8A1]">
//                       Required fields are marked with an asterisk.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2.5">
//                   <button
//                     type="button"
//                     onClick={() =>
//                       onCancel ? onCancel() : navigate("/rental-master")
//                     }
//                     disabled={isSubmitting}
//                     className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#DCE7E2] bg-white px-4 text-[11px] font-bold text-[#687B72] transition hover:bg-[#F5F9F7] disabled:opacity-50 sm:flex-none"
//                   >
//                     <X size={14} />
//                     Discard
//                   </button>

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="flex h-10 flex-[1.5] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087A57] to-[#0A9668] px-5 text-[11px] font-extrabold text-white shadow-[0_9px_22px_rgba(8,122,87,0.22)] transition hover:-translate-y-[1px] hover:shadow-[0_12px_28px_rgba(8,122,87,0.27)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-65 sm:flex-none"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 size={15} className="animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         <Save size={15} />
//                         {isEditing ? "Update Requisition" : "Save & Deploy"}
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </DashboardLayout>
//   );
// }





import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../Admin/Layout";
import Select from "react-select";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileText,
  HeartHandshake,
  ImagePlus,
  IndianRupee,
  Layers3,
  Loader2,
  MapPin,
  Package,
  Phone,
  Save,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserRound,
  UsersRound,
  Wrench,
  X,
  Hash,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function RentalForm({
  formData: passedFormData,
  setFormData: passedSetFormData,
  onCancel,
  onSuccess,
}) {
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const [localFormData, setLocalFormData] = useState({
    record_date: today,
    billing_type: "Monthly",
    status: "Active",
    device_id: "",
    care_center_id: "",
    accessory_id: [], // array of selected accessory names (strings)
  });

  const formData = passedFormData || localFormData;
  const setFormData = (nextState) => {
    if (typeof passedSetFormData === "function") {
      passedSetFormData(nextState);
    } else {
      setLocalFormData(nextState);
    }
  };

  const [deviceModels, setDeviceModels] = useState([]);
  const [careCenters, setCareCenters] = useState([]);
  const [references, setReferences] = useState([]);
  const [assetPhotos, setAssetPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Accessories options derived from the selected device
  const [deviceAccessories, setDeviceAccessories] = useState([]);

  // ===============================
  // 1. FETCH EQUIPMENT MODELS
  // ===============================
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/devices`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const result = await res.json();
        const items = Array.isArray(result) ? result : result.data || [];

        const activeDevices = items.filter((d) => d.status === "active");
        setDeviceModels(activeDevices);
      } catch (err) {
        console.error("Failed fetching hardware device entities:", err);
      }
    };
    fetchDevices();
  }, []);

  // ===============================
  // 2. FETCH CARE CENTERS
  // ===============================
  useEffect(() => {
    const fetchCareCenters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/carecenters`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const result = await res.json();
        const items = Array.isArray(result) ? result : result.data || [];
        const activeCenters = items.filter((c) => c.status === "active");
        setCareCenters(activeCenters);
      } catch (err) {
        console.error("Failed fetching care center entities:", err);
      }
    };
    fetchCareCenters();
  }, []);

  // ===============================
  // 2.1 FETCH REFERENCES / DOCTORS
  // ===============================
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/references`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const result = await res.json();
        const items = Array.isArray(result) ? result : result.data || [];
        const activeReferences = items.filter((r) => r.status === "active");
        setReferences(activeReferences);
      } catch (err) {
        console.error("Failed fetching reference doctor entities:", err);
      }
    };
    fetchReferences();
  }, []);

  // ===============================
  // WHEN DEVICE CHANGES → load its accessories
  // ===============================
  useEffect(() => {
    if (!formData?.device_id) {
      setDeviceAccessories([]);
      // clear previously selected accessories when device is cleared
      setFormData((prev) => ({
        ...prev,
        accessory_id: [],
      }));
      return;
    }

    const selectedDevice = deviceModels.find(
      (d) => Number(d.device_id) === Number(formData.device_id)
    );

    if (selectedDevice && Array.isArray(selectedDevice.accessories)) {
      setDeviceAccessories(selectedDevice.accessories);
    } else {
      setDeviceAccessories([]);
    }
  }, [formData?.device_id, deviceModels]);

  // Clean up object URLs
  useEffect(() => {
    const urls = assetPhotos.map((photo) => photo.previewUrl);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [assetPhotos]);

  const handleCareCenterChange = (e) => {
    const selectedId = e.target.value;

    if (!selectedId) {
      setFormData((prev) => ({
        ...prev,
        care_center_id: "",
        care_center_name: "",
        mob_no: "",
        alternative_mob_no: "",
        care_address: "",
      }));
      return;
    }

    if (selectedId === "other") {
      setFormData((prev) => ({
        ...prev,
        care_center_id: "other",
        care_center_name: "",
        mob_no: "",
        alternative_mob_no: "",
        care_address: "",
      }));
      return;
    }

    const selectedCenter = careCenters.find(
      (center) => Number(center.carecenter_id) === Number(selectedId)
    );

    if (selectedCenter) {
      setFormData((prev) => ({
        ...prev,
        care_center_id: selectedId,
        care_center_name: selectedCenter.carecenter_name,
        mob_no: selectedCenter.mobile_number || "",
        alternative_mob_no: selectedCenter.alternative_mobile_number || "",
        care_address: selectedCenter.address || "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const incomingFiles = Array.from(e.target.files || []);

    const newPhotos = incomingFiles.map((file) => ({
      file: file,
      previewUrl: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${Date.now()}`,
    }));

    setAssetPhotos((prevPhotos) => {
      const combined = [...prevPhotos, ...newPhotos];
      if (combined.length > 10) {
        alert("Maximum upload allowance capped at 10 items.");
        return combined.slice(0, 10);
      }
      return combined;
    });

    e.target.value = "";
  };

  const handleRemovePhoto = (idToRemove) => {
    setAssetPhotos((prevPhotos) =>
      prevPhotos.filter((p) => p.id !== idToRemove)
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEditMode = !!formData?.rental_id;
    const url = isEditMode
      ? `${API_BASE_URL}/api/rentals/${formData.rental_id}`
      : `${API_BASE_URL}/api/rentals`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const token = localStorage.getItem("token");
      let headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const body = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "device" || key === "careCenter" || key === "asset_photos")
          return;

        if (formData[key] !== null && formData[key] !== undefined) {
          // Handle array fields (accessory_id)
          if (Array.isArray(formData[key])) {
            body.append(key, JSON.stringify(formData[key]));
          } else {
            body.append(key, formData[key]);
          }
        }
      });

      assetPhotos.forEach((photoWrapper) => {
        body.append("asset_photos", photoWrapper.file);
      });

      const response = await fetch(url, { method, headers, body });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Authentication session expired. Please log in again.");
          return;
        }
        throw new Error("Server rejected registration submission.");
      }

      const result = await response.json();
      if (!result.success)
        throw new Error(result.message || "Operation failed.");

      alert(
        isEditMode
          ? "Rental parameters modified successfully."
          : "New rental transaction deployed successfully!"
      );

      if (onSuccess) onSuccess();
      navigate("/rental-master");
    } catch (err) {
      alert(`Transaction aborted: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionTitle = (number, Icon, title, description) => (
    <div className="flex items-start gap-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F6EF] text-[#087A57] ring-1 ring-[#D7EEE4]">
        <Icon size={19} strokeWidth={2.1} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#0A8A60]">
            Step {number}
          </span>
          <span className="h-1 w-1 rounded-full bg-[#C9D8D1]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
            ODCom Rental
          </span>
        </div>
        <h2 className="mt-1 text-[15px] font-extrabold tracking-[-0.015em] text-[#183A2F]">
          {title}
        </h2>
        <p className="mt-0.5 text-[11px] leading-5 text-[#8A9B94]">
          {description}
        </p>
      </div>
    </div>
  );

  const labelClass =
    "mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.055em] text-[#526A60]";
  const inputClass =
    "h-[46px] w-full rounded-xl border border-[#DDE9E4] bg-[#FBFDFC] px-3.5 text-[13px] font-semibold text-[#203D33] outline-none transition-all placeholder:font-normal placeholder:text-[#A9B8B1] hover:border-[#BED8CD] focus:border-[#0A9466] focus:bg-white focus:ring-4 focus:ring-[#0A9466]/[0.08]";
  const textareaClass =
    "w-full rounded-xl border border-[#DDE9E4] bg-[#FBFDFC] px-3.5 py-3 text-[13px] font-medium text-[#203D33] outline-none transition-all placeholder:text-[#A9B8B1] hover:border-[#BED8CD] focus:border-[#0A9466] focus:bg-white focus:ring-4 focus:ring-[#0A9466]/[0.08] resize-none";
  const selectClass = `${inputClass} cursor-pointer`;
  const cardClass =
    "overflow-hidden rounded-[20px] border border-[#E1ECE7] bg-white shadow-[0_8px_28px_rgba(25,92,67,0.055)]";

  const isEditing = !!formData?.rental_id;

  // Build options for react-select from the selected device's accessories
  const accessoryOptions = deviceAccessories.map((acc) => ({
    value: acc,
    label: acc,
  }));

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F9F7]">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="border-b border-[#E4EEE9] bg-white/95 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() =>
                  onCancel ? onCancel() : navigate("/rental-master")
                }
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCE9E3] bg-white text-[#6F837A] transition hover:border-[#BFD8CC] hover:bg-[#F3F9F6] hover:text-[#087A57]"
                title="Back to Rental Master"
                aria-label="Back to Rental Master"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <h1 className="text-[24px] font-extrabold tracking-[-0.035em] text-[#183A2F] sm:text-[28px]">
                  {isEditing
                    ? "Edit Rental Requisition"
                    : "Create Rental Requisition"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() =>
                  onCancel ? onCancel() : navigate("/rental-master")
                }
                disabled={isSubmitting}
                className="hidden h-10 items-center gap-2 rounded-xl border border-[#DDE8E3] bg-white px-4 text-[11px] font-bold text-[#64776F] transition hover:bg-[#F5F9F7] disabled:opacity-50 sm:flex"
              >
                <ArrowLeft size={14} />
                Rental Master
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            FORM BODY
        ====================================================== */}
        <form onSubmit={handleFormSubmit}>
          <div className="mx-auto w-full max-w-[1450px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
            {/* =================================================
                STEP 1 - RENTAL TYPE
            ================================================== */}
            <section className={cardClass}>
              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
                <div>
                  <label className={labelClass}>
                    Deal Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData?.deal_type || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, deal_type: e.target.value })
                    }
                    className={selectClass}
                  >
                    <option value="">Select deal type</option>
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Unit <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData?.unit_type || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_type: e.target.value })
                    }
                    className={selectClass}
                  >
                    <option value="">Select unit</option>
                    <option value="CWF">BWF</option>
                    <option value="ODCOM">ODCOM</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Mode <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData?.mode_type || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, mode_type: e.target.value })
                    }
                    className={selectClass}
                  >
                    <option value="">Select mode</option>
                    <option value="Prepaid">Prepaid</option>
                    <option value="Postpaid">Postpaid</option>
                  </select>
                </div>
              </div>
            </section>

            {/* =================================================
                STEP 2 - EQUIPMENT & DATES
            ================================================== */}
            <section className={cardClass}>
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {/* Device */}
                  <div className="rounded-[16px] border border-[#DCEBE4] bg-[#F8FCFA] p-4">
                    <label className={labelClass}>
                      Device Model <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={formData?.device_id || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          device_id: e.target.value,
                          accessory_id: [], // clear previous accessories
                        });
                      }}
                      className={selectClass}
                    >
                      <option value="">Choose equipment model</option>
                      {deviceModels.map((dev) => (
                        <option key={dev.device_id} value={dev.device_id}>
                          {dev.device_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Serial No. */}
                  <div className="rounded-[16px] border border-[#DCEBE4] bg-[#F8FCFA] p-4">
                    <label className={labelClass}>
                      Serial No. <span className="text-rose-500"></span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData?.serial_no || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serial_no: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="Enter serial number"
                    />
                  </div>

                  {/* Accessories – now driven by selected device */}
                  <div className="rounded-[16px] border border-[#DCEBE4] bg-[#F8FCFA] p-4">
                    <label className={labelClass}>Select Accessories</label>
                    <Select
                      isMulti
                      isDisabled={!formData?.device_id}
                      options={accessoryOptions}
                      value={accessoryOptions.filter((opt) =>
                        (formData.accessory_id || []).includes(opt.value)
                      )}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          accessory_id: selected
                            ? selected.map((item) => item.value)
                            : [],
                        })
                      }
                      className="w-full text-[12px]"
                      classNamePrefix="odcom-select"
                      placeholder={
                        formData?.device_id
                          ? "Choose accessories..."
                          : "Select a device first"
                      }
                      noOptionsMessage={() =>
                        formData?.device_id
                          ? "No accessories for this device"
                          : "Select a device first"
                      }
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          minHeight: "46px",
                          borderRadius: "12px",
                          borderColor: state.isFocused ? "#0A9466" : "#DDE9E4",
                          backgroundColor: state.isFocused
                            ? "#FFFFFF"
                            : "#FBFDFC",
                          boxShadow: state.isFocused
                            ? "0 0 0 4px rgba(10,148,102,0.08)"
                            : "none",
                          fontSize: "13px",
                          fontWeight: 600,
                          "&:hover": {
                            borderColor: "#BED8CD",
                          },
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          padding: "3px 10px",
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: "#E8F6EF",
                          borderRadius: "8px",
                          border: "1px solid #D7EEE4",
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: "#087A57",
                          fontWeight: 700,
                          fontSize: "11px",
                        }),
                        multiValueRemove: (provided) => ({
                          ...provided,
                          color: "#087A57",
                          borderRadius: "0 8px 8px 0",
                          ":hover": {
                            backgroundColor: "#087A57",
                            color: "white",
                          },
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 50,
                          borderRadius: "12px",
                          overflow: "hidden",
                          border: "1px solid #E1ECE7",
                          boxShadow: "0 15px 40px rgba(15,72,53,0.12)",
                        }),
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 border-t border-[#EDF3F0] pt-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <div>
                      <label className={labelClass}>Record Date</label>
                      <input
                        type="date"
                        value={formData?.record_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            record_date: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Log In Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData?.login_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            login_date: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Notify Date{" "}
                        {formData?.mode_type === "Prepaid" && (
                          <span className="text-rose-500">*</span>
                        )}
                      </label>
                      <input
                        type="date"
                        required={formData?.mode_type === "Prepaid"}
                        value={formData?.notify_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            notify_date: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Log Out Date</label>
                      <input
                        type="date"
                        value={formData?.login_out_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            login_out_date: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Recall Date</label>
                      <input
                        type="date"
                        value={formData?.recall_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recall_date: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                STEP 3 - COMMERCIALS
            ================================================== */}
            <section className={cardClass}>
              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
                <div>
                  <label className={labelClass}>
                    Billing Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
                    />
                    <select
                      required
                      value={formData?.billing_type || "Monthly"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing_type: e.target.value,
                        })
                      }
                      className={`${selectClass} pl-10`}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Fort Night">Fort Night</option>
                      <option value="Daily">Daily</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Rental Charge</label>
                  <div className="relative">
                    <IndianRupee
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
                    />
                    <input
                      type="number"
                      value={formData?.rental_charge ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rental_charge:
                            e.target.value === "" ? 0 : Number(e.target.value),
                        })
                      }
                      className={`${inputClass} pl-10`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Deposit / Advance</label>
                  <div className="relative">
                    <IndianRupee
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
                    />
                    <input
                      type="number"
                      value={formData?.deposit_advance ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deposit_advance:
                            e.target.value === "" ? 0 : Number(e.target.value),
                        })
                      }
                      className={`${inputClass} pl-10`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Installation Charge</label>
                  <div className="relative">
                    <IndianRupee
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
                    />
                    <input
                      type="number"
                      value={formData?.installation_charge ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          installation_charge:
                            e.target.value === "" ? 0 : Number(e.target.value),
                        })
                      }
                      className={`${inputClass} pl-10`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                STEP 4 & 5 - CARE CENTER + PATIENT
            ================================================== */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {/* Care Center */}
              <section className={cardClass}>
                <div className="space-y-4 p-5 sm:p-6">
                  <div>
                    <label className={labelClass}>Care Center Name</label>
                    <select
                      value={formData?.care_center_id || ""}
                      onChange={handleCareCenterChange}
                      className={selectClass}
                    >
                      <option value="">Select care center</option>
                      {careCenters.map((center) => (
                        <option
                          key={center.carecenter_id}
                          value={center.carecenter_id}
                        >
                          {center.carecenter_name}
                        </option>
                      ))}
                      <option value="other">Other / Manual Entry</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>POC Mobile</label>
                      <div className="relative">
                        <Phone
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
                        />
                        <input
                          type="text"
                          value={formData?.mob_no || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mob_no: e.target.value,
                            })
                          }
                          className={`${inputClass} pl-10`}
                          placeholder="Primary contact"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Alternative Mobile</label>
                      <div className="relative">
                        <Phone
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
                        />
                        <input
                          type="text"
                          value={formData?.alternative_mob_no || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              alternative_mob_no: e.target.value,
                            })
                          }
                          className={`${inputClass} pl-10`}
                          placeholder="Optional contact"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Care Address</label>
                    <div className="relative">
                      <MapPin
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-3.5 text-[#89A097]"
                      />
                      <textarea
                        rows={3}
                        value={formData?.care_address || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            care_address: e.target.value,
                          })
                        }
                        className={`${textareaClass} pl-10`}
                        placeholder="Facility / deployment address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Bed No.</label>
                      <input
                        type="text"
                        value={formData?.care_bed_no || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            care_bed_no: e.target.value,
                          })
                        }
                        className={inputClass}
                        placeholder="Bed / room"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>POC Name / Doctor</label>
                      <div className="relative">
                        <Stethoscope
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
                        />
                        <input
                          type="text"
                          value={formData?.care_poc_name || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              care_poc_name: e.target.value,
                            })
                          }
                          className={`${inputClass} pl-10`}
                          placeholder="Contact person"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Referral</label>
                    <select
                      value={formData?.care_referal || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          care_referal: e.target.value,
                        })
                      }
                      className={selectClass}
                    >
                      <option value="">Select referral</option>
                      {references.map((ref) => (
                        <option key={ref.reference_id} value={ref.doctor_name}>
                          {ref.doctor_name} - {ref.hospital_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Patient */}
              <section className={cardClass}>
                <div className="space-y-4 p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
                    <div>
                      <label className={labelClass}>
                        Patient Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <UserRound
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
                        />
                        <input
                          type="text"
                          required
                          value={formData?.patient_name || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              patient_name: e.target.value,
                            })
                          }
                          className={`${inputClass} pl-10`}
                          placeholder="Full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Age</label>
                      <input
                        type="number"
                        value={formData?.patient_age ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            patient_age:
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                          })
                        }
                        className={inputClass}
                        placeholder="Age"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Attendant Name</label>
                    <div className="relative">
                      <UsersRound
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
                      />
                      <input
                        type="text"
                        value={formData?.patient_attendant_name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            patient_attendant_name: e.target.value,
                          })
                        }
                        className={`${inputClass} pl-10`}
                        placeholder="Attendant / family contact"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Mobile Number</label>
                      <div className="relative">
                        <Phone
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
                        />
                        <input
                          type="text"
                          value={formData?.patient_mob_no || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              patient_mob_no: e.target.value,
                            })
                          }
                          className={`${inputClass} pl-10`}
                          placeholder="Primary mobile"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Alternative Mobile</label>
                      <div className="relative">
                        <Phone
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89A097]"
                        />
                        <input
                          type="text"
                          value={formData?.patient_alternative_mob_no || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              patient_alternative_mob_no: e.target.value,
                            })
                          }
                          className={`${inputClass} pl-10`}
                          placeholder="Optional mobile"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Delivery Address</label>
                    <div className="relative">
                      <MapPin
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-3.5 text-[#89A097]"
                      />
                      <textarea
                        rows={4}
                        value={formData?.patient_delivery_address || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            patient_delivery_address: e.target.value,
                          })
                        }
                        className={`${textareaClass} pl-10`}
                        placeholder="Complete delivery / installation address"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#E2EEE8] bg-[#F7FBF9] px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <HeartHandshake
                        size={16}
                        className="mt-0.5 shrink-0 text-[#087A57]"
                      />
                      <p className="text-[10.5px] leading-5 text-[#758980]">
                        Verify recipient contact and delivery location before
                        deploying the equipment to reduce service and pickup
                        errors.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* =================================================
                STEP 6 - NOTES + PHOTOS
            ================================================== */}
            <section className={cardClass}>
              <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-5">
                  {/* Transactions Notes */}
                  <div>
                    <label className={labelClass}>Transactions Notes</label>
                    <div className="relative">
                      <FileText
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-3.5 text-[#89A097]"
                      />
                      <textarea
                        rows={5}
                        value={formData?.notes || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            notes: e.target.value,
                          })
                        }
                        className={`${textareaClass} min-h-[130px] pl-10`}
                        placeholder="Installation notes, equipment condition, service requirements, pickup instructions..."
                      />
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div>
                    <label className={labelClass}>Internal Notes</label>
                    <div className="relative">
                      <FileText
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-3.5 text-[#89A097]"
                      />
                      <textarea
                        rows={5}
                        value={formData?.internal_notes || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            internal_notes: e.target.value,
                          })
                        }
                        className={`${textareaClass} min-h-[130px] pl-10`}
                        placeholder="Internal remarks, team instructions, follow-up details, billing notes..."
                      />
                    </div>
                  </div>
                </div>

                {/* Upload */}
                <div className="rounded-[16px] border border-dashed border-[#CFE2D9] bg-[#F8FCFA] p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    {assetPhotos.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#D7EEE4] bg-[#EAF7F0] px-2 py-1 text-[9px] font-bold text-[#087A57]">
                        <CheckCircle2 size={11} />
                        {assetPhotos.length} Ready
                      </span>
                    )}
                  </div>

                  <label className="group flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-[#DCEAE3] bg-white px-4 py-6 text-center transition hover:border-[#AFCFC0] hover:bg-[#FBFDFC]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57] transition group-hover:scale-105">
                      <ImagePlus size={20} />
                    </div>

                    <p className="mt-3 text-[11px] font-extrabold text-[#496158]">
                      Add handover photographs
                    </p>

                    <p className="mt-1 text-[9.5px] text-[#98A8A1]">
                      Select one or multiple equipment images
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {assetPhotos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                      {assetPhotos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#DDE9E4] bg-white shadow-sm"
                        >
                          <img
                            src={photo.previewUrl}
                            alt={`Asset preview ${index + 1}`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                          />

                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-2 pb-1.5 pt-5">
                            <span className="text-[8px] font-bold text-white/90">
                              Photo {index + 1}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-rose-600 opacity-90 shadow-md transition hover:bg-rose-600 hover:text-white"
                            title="Remove photo"
                            aria-label={`Remove photo ${index + 1}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* =================================================
                FINAL ACTION / SUMMARY
            ================================================== */}
            <div className="sticky bottom-3 z-20">
              <div className="flex flex-col gap-3 rounded-[18px] border border-[#DDE9E4] bg-white/95 px-4 py-3.5 shadow-[0_18px_45px_rgba(24,82,61,0.14)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-[#EAF7F0] text-[#087A57] sm:flex">
                    <ShieldCheck size={17} />
                  </div>
                  <div>
                    <p className="text-[10.5px] font-extrabold text-[#405B50]">
                      {isEditing
                        ? "Ready to update this rental record?"
                        : "Ready to create this rental requisition?"}
                    </p>
                    <p className="mt-0.5 text-[9px] text-[#98A8A1]">
                      Required fields are marked with an asterisk.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      onCancel ? onCancel() : navigate("/rental-master")
                    }
                    disabled={isSubmitting}
                    className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#DCE7E2] bg-white px-4 text-[11px] font-bold text-[#687B72] transition hover:bg-[#F5F9F7] disabled:opacity-50 sm:flex-none"
                  >
                    <X size={14} />
                    Discard
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-10 flex-[1.5] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087A57] to-[#0A9668] px-5 text-[11px] font-extrabold text-white shadow-[0_9px_22px_rgba(8,122,87,0.22)] transition hover:-translate-y-[1px] hover:shadow-[0_12px_28px_rgba(8,122,87,0.27)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-65 sm:flex-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        {isEditing ? "Update Requisition" : "Save & Deploy"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}