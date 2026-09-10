// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import DashboardLayout from "../Admin/Layout";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
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
//   Download,
//   FileText,
//   Hash,
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

//   const rentalId =
//     id || location.state?.rental_id || location.state?.rental?.rental_id;

//   const [rental, setRental] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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
//           if (response.status === 404) throw new Error("Rental not found.");
//           if (response.status === 401)
//             throw new Error("Session expired. Please login again.");
//           throw new Error("Failed to load rental details.");
//         }

//         const result = await response.json();
//         setRental(result.success ? result.data : result);
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
//         badge: "border-[#E3D9FF] bg-[#F3EFFF] text-[#5d2ed7]",
//         dot: "bg-[#5d2ed7]",
//       };
//     }
//     if (normalized === "INACTIVE") {
//       return {
//         label: "INACTIVE",
//         badge: "border-amber-200 bg-amber-50 text-amber-700",
//         dot: "bg-amber-400",
//       };
//     }
//     if (["CLOSED", "CLOSE", "CANCELLED"].includes(normalized)) {
//       return {
//         label: normalized,
//         badge: "border-slate-200 bg-slate-100 text-slate-600",
//         dot: "bg-slate-400",
//       };
//     }
//     return {
//       label: normalized || "UNKNOWN",
//       badge: "border-[#E3D9FF] bg-[#FAF8FF] text-[#7F6EA6]",
//       dot: "bg-[#9C8AC7]",
//     };
//   };

//   const getAccessoryNames = () => {
//     if (Array.isArray(rental?.accessory_id)) {
//       return rental.accessory_id.map(String).filter(Boolean);
//     }
//     if (typeof rental?.accessory_id === "string") {
//       try {
//         const parsed = JSON.parse(rental.accessory_id);
//         if (Array.isArray(parsed)) return parsed.map(String);
//       } catch {}
//     }
//     if (Array.isArray(rental?.accessories)) {
//       return rental.accessories
//         .map((item) =>
//           typeof item === "string"
//             ? item
//             : item?.accessory_name || item?.name || item?.label
//         )
//         .filter(Boolean);
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

//   // ===============================
//   // PROFESSIONAL PDF GENERATION
//   // ===============================
//   // const generatePDF = () => {
//   //   if (!rental) return;
//   //   setIsGeneratingPdf(true);

//   //   try {
//   //     const doc = new jsPDF("p", "mm", "a4");
//   //     const pageWidth = doc.internal.pageSize.getWidth();
//   //     const margin = 14;
//   //     let y = 16;

//   //     // Header bar - Violet #5d2ed7
//   //     doc.setFillColor(93, 46, 215);
//   //     doc.rect(0, 0, pageWidth, 28, "F");

//   //     doc.setTextColor(255, 255, 255);
//   //     doc.setFontSize(16);
//   //     doc.setFont("helvetica", "bold");
//   //     doc.text("ODCom Equipment Rental", margin, 12);

//   //     doc.setFontSize(9);
//   //     doc.setFont("helvetica", "normal");
//   //     doc.text("Rental Requisition Report", margin, 19);

//   //     doc.setFontSize(10);
//   //     doc.setFont("helvetica", "bold");
//   //     doc.text(`#${rental.rental_id}`, pageWidth - margin, 12, {
//   //       align: "right",
//   //     });

//   //     doc.setFont("helvetica", "normal");
//   //     doc.setFontSize(8);
//   //     doc.text(
//   //       `Generated: ${new Date().toLocaleString("en-GB")}`,
//   //       pageWidth - margin,
//   //       19,
//   //       { align: "right" }
//   //     );

//   //     y = 38;

//   //     // Status badge
//   //     const status = (rental.status || "Active").toUpperCase();
//   //     doc.setFontSize(9);
//   //     doc.setFont("helvetica", "bold");
//   //     doc.setTextColor(93, 46, 215);
//   //     doc.text(`Status: ${status}`, margin, y);
//   //     y += 8;

//   //     // Section helper
//   //     const sectionTitle = (title) => {
//   //       doc.setFillColor(243, 239, 255); // #F3EFFF
//   //       doc.rect(margin, y - 4, pageWidth - margin * 2, 7, "F");
//   //       doc.setTextColor(93, 46, 215);
//   //       doc.setFontSize(9);
//   //       doc.setFont("helvetica", "bold");
//   //       doc.text(title, margin + 2, y + 1);
//   //       y += 10;
//   //     };

//   //     const addRow = (label, value) => {
//   //       doc.setFont("helvetica", "normal");
//   //       doc.setFontSize(8);
//   //       doc.setTextColor(120, 110, 140);
//   //       doc.text(label, margin, y);
//   //       doc.setTextColor(34, 18, 77); // #22124D
//   //       doc.setFont("helvetica", "bold");
//   //       doc.text(String(value || "—"), margin + 48, y);
//   //       y += 5.5;
//   //     };

//   //     // 1. Equipment
//   //     sectionTitle("1. EQUIPMENT & DATES");
//   //     addRow("Device Model", rental.device?.device_name);
//   //     addRow("Serial No.", rental.serial_no);
//   //     addRow("Accessories", getAccessoryNames().join(", ") || "—");
//   //     addRow("Deal Type", rental.deal_type);
//   //     addRow("Unit", rental.unit_type);
//   //     addRow("Mode", rental.mode_type);
//   //     addRow("Record Date", formatDate(rental.record_date));
//   //     addRow("Log In Date", formatDate(rental.login_date));
//   //     addRow("Notify Date", formatDate(rental.notify_date));
//   //     addRow("Log Out Date", formatDate(rental.login_out_date));
//   //     addRow("Recall Date", formatDate(rental.recall_date));
//   //     y += 4;

//   //     // 2. Commercial
//   //     sectionTitle("2. COMMERCIAL DETAILS");
//   //     addRow("Billing Type", rental.billing_type);
//   //     addRow("Rental Charge", `₹ ${formatCurrency(rental.rental_charge)}`);
//   //     addRow("Deposit / Advance", `₹ ${formatCurrency(rental.deposit_advance)}`);
//   //     addRow(
//   //       "Installation Charge",
//   //       `₹ ${formatCurrency(rental.installation_charge)}`
//   //     );
//   //     y += 4;

//   //     // 3. Care Center
//   //     sectionTitle("3. CARE CENTER");
//   //     addRow(
//   //       "Care Center",
//   //       rental.careCenter?.carecenter_name ||
//   //         rental.care_center_name ||
//   //         "Direct / Other"
//   //     );
//   //     addRow("POC Mobile", rental.mob_no);
//   //     addRow("Alt Mobile", rental.alternative_mob_no);
//   //     addRow("Bed No.", rental.care_bed_no);
//   //     addRow("POC / Doctor", rental.care_poc_name);
//   //     addRow("Referral", rental.care_referal);
//   //     addRow("Care Address", rental.care_address);
//   //     y += 4;

//   //     // Check page break
//   //     if (y > 240) {
//   //       doc.addPage();
//   //       y = 20;
//   //     }

//   //     // 4. Patient
//   //     sectionTitle("4. PATIENT & DELIVERY");
//   //     addRow("Patient Name", rental.patient_name);
//   //     addRow("Age", rental.patient_age ? `${rental.patient_age} Yrs` : "—");
//   //     addRow("Mobile", rental.patient_mob_no);
//   //     addRow("Alt Mobile", rental.patient_alternative_mob_no);
//   //     addRow("Attendant", rental.patient_attendant_name);
//   //     addRow("Delivery Address", rental.patient_delivery_address);
//   //     y += 4;

//   //     // 5. Notes
//   //     if (rental.notes || rental.internal_notes) {
//   //       if (y > 230) {
//   //         doc.addPage();
//   //         y = 20;
//   //       }
//   //       sectionTitle("5. NOTES");

//   //       if (rental.notes) {
//   //         doc.setFont("helvetica", "bold");
//   //         doc.setFontSize(8);
//   //         doc.setTextColor(93, 75, 125);
//   //         doc.text("Transaction Notes:", margin, y);
//   //         y += 4;
//   //         doc.setFont("helvetica", "normal");
//   //         doc.setTextColor(34, 18, 77);
//   //         const splitNotes = doc.splitTextToSize(
//   //           rental.notes,
//   //           pageWidth - margin * 2
//   //         );
//   //         doc.text(splitNotes, margin, y);
//   //         y += splitNotes.length * 4 + 3;
//   //       }

//   //       if (rental.internal_notes) {
//   //         doc.setFont("helvetica", "bold");
//   //         doc.setFontSize(8);
//   //         doc.setTextColor(93, 75, 125);
//   //         doc.text("Internal Notes:", margin, y);
//   //         y += 4;
//   //         doc.setFont("helvetica", "normal");
//   //         doc.setTextColor(34, 18, 77);
//   //         const splitInternal = doc.splitTextToSize(
//   //           rental.internal_notes,
//   //           pageWidth - margin * 2
//   //         );
//   //         doc.text(splitInternal, margin, y);
//   //         y += splitInternal.length * 4 + 3;
//   //       }
//   //     }

//   //     // Footer
//   //     const pageCount = doc.internal.getNumberOfPages();
//   //     for (let i = 1; i <= pageCount; i++) {
//   //       doc.setPage(i);
//   //       doc.setFontSize(7);
//   //       doc.setTextColor(140, 130, 160);
//   //       doc.text(
//   //         `Page ${i} of ${pageCount}  |  ODCom Rental System  |  Confidential`,
//   //         pageWidth / 2,
//   //         287,
//   //         { align: "center" }
//   //       );
//   //     }

//   //     doc.save(`Rental_${rental.rental_id}_${rental.patient_name || "Report"}.pdf`);
//   //   } catch (err) {
//   //     console.error("PDF generation failed:", err);
//   //     alert("Failed to generate PDF. Please try again.");
//   //   } finally {
//   //     setIsGeneratingPdf(false);
//   //   }
//   // };

//   // ===============================
//   // PROFESSIONAL PREMIUM PDF GENERATION
//   // ===============================
//   const generatePDF = () => {
//     if (!rental) return;
//     setIsGeneratingPdf(true);

//     try {
//       const doc = new jsPDF("p", "mm", "a4");
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const pageHeight = doc.internal.pageSize.getHeight();
//       const margin = 14;
//       const contentWidth = pageWidth - margin * 2;
//       let y = 14;

//       // Color Palette (Brand Purple/Slate Theme)
//       const PRIMARY = [93, 46, 215];      // #5D2ED7
//       const PRIMARY_DARK = [66, 30, 159]; // #421E9F
//       const TEXT_MAIN = [34, 18, 77];     // #22124D
//       const TEXT_MUTED = [127, 110, 166]; // #7F6EA6
//       const BG_LIGHT = [250, 248, 255];   // #FAF8FF
//       const BORDER_COLOR = [227, 217, 255];// #E3D9FF

//       // Page boundary checker helper
//       const ensureSpace = (neededHeight = 25) => {
//         if (y + neededHeight > pageHeight - 22) {
//           doc.addPage();
//           y = 16;
//         }
//       };

//       // ----------------------------------------------------
//       // HEADER BAR
//       // ----------------------------------------------------
//       doc.setFillColor(...PRIMARY_DARK);
//       doc.roundedRect(margin, y, contentWidth, 26, 3, 3, "F");

//       // Header Brand Text
//       doc.setTextColor(255, 255, 255);
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(14);
//       doc.text("ODCom Equipment Rental", margin + 7, y + 10);

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(8.5);
//       doc.setTextColor(216, 206, 249);
//       doc.text("OFFICIAL RENTAL REQUISITION REPORT", margin + 7, y + 18);

//       // Header Right (Requisition ID & Timestamp)
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(12);
//       doc.setTextColor(255, 255, 255);
//       doc.text(`REQ #${rental.rental_id}`, pageWidth - margin - 7, y + 10, { align: "right" });

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(7.5);
//       doc.setTextColor(216, 206, 249);
//       doc.text(
//         `Generated: ${new Date().toLocaleString("en-GB", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         })}`,
//         pageWidth - margin - 7,
//         y + 18,
//         { align: "right" }
//       );

//       y += 31;

//       // ----------------------------------------------------
//       // STATUS & METRICS SUMMARY BANNER
//       // ----------------------------------------------------
//       doc.setFillColor(...BG_LIGHT);
//       doc.setDrawColor(...BORDER_COLOR);
//       doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "FD");

//       const rawStatus = (rental.status || "ACTIVE").toUpperCase();
//       doc.setFontSize(8);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(...PRIMARY);
//       doc.text(`STATUS: ${rawStatus}`, margin + 5, y + 9);

//       doc.setFontSize(8);
//       doc.setFont("helvetica", "normal");
//       doc.setTextColor(...TEXT_MUTED);
//       doc.text(
//         `Deal: ${rental.deal_type || "—"}  |  Mode: ${rental.mode_type || "—"}  |  Billing: ${rental.billing_type || "—"}`,
//         pageWidth - margin - 5,
//         y + 9,
//         { align: "right" }
//       );

//       y += 18;

//       // ----------------------------------------------------
//       // 2-COLUMN SECTION DRAWER HELPER
//       // ----------------------------------------------------
//       const drawInfoCard = (x, currentY, width, title, fields) => {
//         const cardHeight = 12 + fields.length * 5.6;
        
//         // Background card
//         doc.setFillColor(255, 255, 255);
//         doc.setDrawColor(...BORDER_COLOR);
//         doc.roundedRect(x, currentY, width, cardHeight, 2, 2, "FD");

//         // Section header line
//         doc.setFillColor(...BG_LIGHT);
//         doc.roundedRect(x, currentY, width, 7.5, 2, 2, "F");
//         doc.setDrawColor(...BORDER_COLOR);
//         doc.line(x, currentY + 7.5, x + width, currentY + 7.5);

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(8);
//         doc.setTextColor(...PRIMARY);
//         doc.text(title, x + 4, currentY + 5.2);

//         // Render Key-Value Rows
//         let rowY = currentY + 13;
//         fields.forEach(([label, value]) => {
//           doc.setFont("helvetica", "bold");
//           doc.setFontSize(7.5);
//           doc.setTextColor(...TEXT_MUTED);
//           doc.text(label, x + 4, rowY);

//           doc.setFont("helvetica", "bold");
//           doc.setTextColor(...TEXT_MAIN);
//           const safeVal = String(value || "—");
//           const truncated = doc.splitTextToSize(safeVal, width - 38)[0];
//           doc.text(truncated, x + width - 4, rowY, { align: "right" });
//           rowY += 5.6;
//         });

//         return cardHeight;
//       };

//       const colWidth = (contentWidth - 5) / 2;

//       // ----------------------------------------------------
//       // SECTION 1: EQUIPMENT & CARE CENTER
//       // ----------------------------------------------------
//       ensureSpace(45);
//       const eqFields = [
//         ["Model", rental.device?.device_name || "—"],
//         ["Serial No.", rental.serial_no || "—"],
//         ["Unit Type", rental.unit_type || "—"],
//         ["Login Date", formatDate(rental.login_date)],
//         ["Log Out Date", formatDate(rental.login_out_date)],
//       ];

//       const careFields = [
//         ["Care Center", rental.careCenter?.carecenter_name || rental.care_center_name || "Direct / Other"],
//         ["Bed No.", rental.care_bed_no || "—"],
//         ["POC Mobile", rental.mob_no || "—"],
//         ["Doctor / POC", rental.care_poc_name || "—"],
//         ["Referral", rental.care_referal || "—"],
//       ];

//       const h1 = drawInfoCard(margin, y, colWidth, "EQUIPMENT & DATES", eqFields);
//       const h2 = drawInfoCard(margin + colWidth + 5, y, colWidth, "CARE CENTER", careFields);
//       y += Math.max(h1, h2) + 5;

//       // ----------------------------------------------------
//       // SECTION 2: PATIENT & SCHEDULE DETAILS
//       // ----------------------------------------------------
//       ensureSpace(45);
//       const patFields = [
//         ["Patient Name", rental.patient_name || "—"],
//         ["Age", rental.patient_age ? `${rental.patient_age} Yrs` : "—"],
//         ["Contact", rental.patient_mob_no || "—"],
//         ["Attendant", rental.patient_attendant_name || "—"],
//         ["Delivery", rental.patient_delivery_address || "—"],
//       ];

//       const scheduleFields = [
//         ["Record Date", formatDate(rental.record_date)],
//         ["Notify Date", formatDate(rental.notify_date)],
//         ["Recall Date", formatDate(rental.recall_date)],
//         ["Accessories", getAccessoryNames().join(", ") || "None"],
//         ["Alt Contact", rental.patient_alternative_mob_no || "—"],
//       ];

//       const h3 = drawInfoCard(margin, y, colWidth, "PATIENT & DELIVERY", patFields);
//       const h4 = drawInfoCard(margin + colWidth + 5, y, colWidth, "SCHEDULE & ACCESSORIES", scheduleFields);
//       y += Math.max(h3, h4) + 6;

//       // ----------------------------------------------------
//       // SECTION 3: COMMERCIAL & FINANCIAL BREAKDOWN (TABLE LOOK)
//       // ----------------------------------------------------
//       ensureSpace(32);
//       doc.setFillColor(...BG_LIGHT);
//       doc.setDrawColor(...BORDER_COLOR);
//       doc.roundedRect(margin, y, contentWidth, 25, 2, 2, "FD");

//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(8);
//       doc.setTextColor(...PRIMARY);
//       doc.text("COMMERCIAL SUMMARY", margin + 5, y + 6);

//       const cellW = contentWidth / 3;
//       const chargeItems = [
//         { label: "Rental Charge", val: `INR ${formatCurrency(rental.rental_charge)}` },
//         { label: "Deposit / Advance", val: `INR ${formatCurrency(rental.deposit_advance)}` },
//         { label: "Installation Charge", val: `INR ${formatCurrency(rental.installation_charge)}` },
//       ];

//       chargeItems.forEach((item, index) => {
//         const itemX = margin + index * cellW;
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(7.5);
//         doc.setTextColor(...TEXT_MUTED);
//         doc.text(item.label.toUpperCase(), itemX + 6, y + 13);

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(11);
//         doc.setTextColor(...TEXT_MAIN);
//         doc.text(item.val, itemX + 6, y + 20);

//         if (index < 2) {
//           doc.setDrawColor(...BORDER_COLOR);
//           doc.line(itemX + cellW, y + 9, itemX + cellW, y + 22);
//         }
//       });

//       y += 30;

//       // ----------------------------------------------------
//       // SECTION 4: NOTES & REMARKS
//       // ----------------------------------------------------
//       if (rental.notes || rental.internal_notes) {
//         ensureSpace(28);
//         doc.setDrawColor(...BORDER_COLOR);
//         doc.setFillColor(255, 255, 255);
        
//         const noteSections = [];
//         if (rental.notes) noteSections.push({ title: "Transaction Notes", text: rental.notes });
//         if (rental.internal_notes) noteSections.push({ title: "Internal Notes", text: rental.internal_notes });

//         noteSections.forEach((n) => {
//           ensureSpace(22);
//           doc.roundedRect(margin, y, contentWidth, 18, 2, 2, "FD");

//           doc.setFont("helvetica", "bold");
//           doc.setFontSize(7.5);
//           doc.setTextColor(...PRIMARY);
//           doc.text(n.title.toUpperCase(), margin + 5, y + 5.5);

//           doc.setFont("helvetica", "normal");
//           doc.setFontSize(7.5);
//           doc.setTextColor(...TEXT_MAIN);
//           const wrapped = doc.splitTextToSize(n.text, contentWidth - 10);
//           doc.text(wrapped.slice(0, 2), margin + 5, y + 11);

//           y += 21;
//         });
//       }

//       // ----------------------------------------------------
//       // AUTHORIZATION & SIGNATURE BLOCK
//       // ----------------------------------------------------
//       ensureSpace(28);
//       const signY = y + 12;
//       const signBoxW = 55;

//       // Customer / Attendant Signature
//       doc.setDrawColor(180, 170, 205);
//       // doc.line(margin + 5, signY, margin + signBoxW, signY);
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(7);
//       doc.setTextColor(...TEXT_MUTED);
//       // doc.text("Received By (Patient/Attendant)", margin + 5, signY + 4);

//       // Authorized Dispatcher Signature
//       const rightSignX = pageWidth - margin - signBoxW;
//       // doc.line(rightSignX, signY, rightSignX + signBoxW - 5, signY);
//       // doc.text("Authorized Signatory (ODCom)", rightSignX, signY + 4);

//       // ----------------------------------------------------
//       // NUMBERED FOOTER (ALL PAGES)
//       // ----------------------------------------------------
//       const pageCount = doc.internal.getNumberOfPages();
//       for (let i = 1; i <= pageCount; i++) {
//         doc.setPage(i);

//         doc.setDrawColor(...BORDER_COLOR);
//         doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

//         doc.setFontSize(7);
//         doc.setFont("helvetica", "normal");
//         doc.setTextColor(145, 135, 170);
//         doc.text("ODCom Equipment Rental System — Official Documentation", margin, pageHeight - 8);
//         doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" });
//       }

//       doc.save(`Rental_${rental.rental_id}_${rental.patient_name || "Requisition"}.pdf`);
//     } catch (err) {
//       console.error("PDF generation failed:", err);
//       alert("Failed to generate PDF. Please try again.");
//     } finally {
//       setIsGeneratingPdf(false);
//     }
//   };

//   const statusStyle = rental ? getStatusStyle(rental.status) : null;
//   const accessoryNames = rental ? getAccessoryNames() : [];
//   const photoUrls = rental ? getPhotoUrls() : [];

//   const infoRow = (label, value, Icon = null) => (
//     <div className="flex items-start justify-between gap-4 border-b border-[#F3EFFF] py-3 last:border-b-0">
//       <div className="flex min-w-0 items-center gap-2.5">
//         {Icon && (
//           <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3EFFF] text-[#5d2ed7]">
//             <Icon size={14} strokeWidth={2} />
//           </span>
//         )}
//         <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#8B7BB5]">
//           {label}
//         </span>
//       </div>
//       <div className="max-w-[58%] text-right text-[12px] font-extrabold leading-5 text-[#22124D]">
//         {value ?? "—"}
//       </div>
//     </div>
//   );

//   if (isLoading) {
//     return (
//       <DashboardLayout>
//         <div className="flex min-h-[72vh] items-center justify-center bg-[#FAF8FF] px-4">
//           <div className="w-full max-w-sm rounded-[24px] border border-[#E3D9FF] bg-white p-8 text-center shadow-lg">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EFFF] text-[#5d2ed7]">
//               <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#D3C4FC] border-t-[#5d2ed7]" />
//             </div>
//             <h3 className="mt-4 text-[15px] font-extrabold text-[#22124D]">
//               Loading Rental Record
//             </h3>
//             <p className="mt-1.5 text-[10.5px] font-medium text-[#8B7BB5]">
//               Retrieving complete rental details...
//             </p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error || !rental) {
//     return (
//       <DashboardLayout>
//         <div className="flex min-h-[72vh] items-center justify-center bg-[#FAF8FF] px-4">
//           <div className="w-full max-w-md rounded-[24px] border border-rose-100 bg-white p-7 text-center shadow-lg">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
//               <ShieldCheck size={23} />
//             </div>
//             <h3 className="mt-4 text-[16px] font-extrabold text-[#22124D]">
//               Unable to load rental
//             </h3>
//             <p className="mt-2 text-[11px] font-medium text-rose-600">
//               {error || "Rental data could not be loaded."}
//             </p>
//             <button
//               type="button"
//               onClick={() => navigate("/rental-master")}
//               className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-[#E3D9FF] bg-white px-4 text-[11px] font-bold text-[#553E82] hover:bg-[#FAF8FF]"
//             >
//               <ArrowLeft size={14} />
//               Back to Rental Master
//             </button>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-[#FAF8FF]">
//         <div className="mx-auto w-full max-w-[1480px] space-y-4 px-3 py-4 sm:px-5 lg:px-6">
//           {/* HEADER */}
//           <section className="relative overflow-hidden rounded-[24px] border border-[#E3D9FF] bg-white shadow-sm">
//             <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
//               <div className="flex items-start gap-4">
//                 <button
//                   type="button"
//                   onClick={() => navigate("/rental-master")}
//                   className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E3D9FF] bg-white text-[#7F6EA6] hover:bg-[#F3EFFF] hover:text-[#5d2ed7]"
//                 >
//                   <ArrowLeft size={18} />
//                 </button>

//                 <div className="min-w-0">
//                   <div className="mb-1.5 flex flex-wrap items-center gap-2"></div>

//                   <h1 className="text-[22px] font-extrabold tracking-tight text-[#22124D] sm:text-[26px]">
//                     Rental Requisition #{rental.rental_id}
//                   </h1>
//                 </div>
//               </div>

//               <div className="flex flex-wrap items-center gap-2.5">
//                 <span
//                   className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-[10px] font-extrabold uppercase tracking-wider ${statusStyle.badge}`}
//                 >
//                   <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
//                   {statusStyle.label}
//                 </span>

//                 <button
//                   type="button"
//                   onClick={generatePDF}
//                   disabled={isGeneratingPdf}
//                   className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E3D9FF] bg-[#F3EFFF] px-4 text-[10.5px] font-extrabold text-[#5d2ed7] transition hover:bg-[#EAE2FF] disabled:opacity-60"
//                 >
//                   {isGeneratingPdf ? (
//                     <>
//                       <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#5d2ed7]/30 border-t-[#5d2ed7]" />
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <Download size={14} />
//                       Download PDF
//                     </>
//                   )}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => navigate(`/rental-edit/${rental.rental_id}`)}
//                   className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#421E9F] to-[#5d2ed7] px-4 text-[10.5px] font-extrabold text-white shadow-md transition hover:-translate-y-[1px]"
//                 >
//                   <Pencil size={14} />
//                   Edit Requisition
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* SUMMARY CARDS */}
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
//             {[
//               {
//                 icon: Wrench,
//                 label: "Equipment",
//                 value: rental.device?.device_name || "—",
//               },
//               {
//                 icon: Hash,
//                 label: "Serial No.",
//                 value: rental.serial_no || "—",
//               },
//               {
//                 icon: UserRound,
//                 label: "Patient",
//                 value: rental.patient_name || "—",
//               },
//               {
//                 icon: CalendarDays,
//                 label: "Login Date",
//                 value: formatDate(rental.login_date),
//               },
//             ].map((card) => (
//               <div
//                 key={card.label}
//                 className="rounded-[17px] border border-[#E3D9FF] bg-white px-4 py-3 shadow-sm"
//               >
//                 <div className="flex items-center gap-3">
//                   <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EFFF] text-[#5d2ed7]">
//                     <card.icon size={18} />
//                   </span>
//                   <div className="min-w-0">
//                     <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
//                       {card.label}
//                     </p>
//                     <p className="mt-0.5 truncate text-[12px] font-extrabold text-[#22124D]">
//                       {card.value}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* MAIN GRID */}
//           <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
//             {/* Equipment */}
//             <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
//               <div className="p-5">
//                 <div className="rounded-[16px] border border-[#E8DEFF] bg-[#FAF8FF] px-4 py-3.5">
//                   <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
//                     Assigned Model
//                   </p>
//                   <p className="mt-1 text-[14px] font-extrabold text-[#22124D]">
//                     {rental.device?.device_name || "N/A"}
//                   </p>
//                   {rental.serial_no && (
//                     <p className="mt-1 text-[11px] font-bold text-[#553E82]">
//                       Serial: {rental.serial_no}
//                     </p>
//                   )}
//                   {accessoryNames.length > 0 && (
//                     <div className="mt-2 flex flex-wrap gap-1.5">
//                       {accessoryNames.map((name, i) => (
//                         <span
//                           key={i}
//                           className="rounded-lg border border-[#E3D9FF] bg-[#F3EFFF] px-2 py-1 text-[8.5px] font-bold text-[#5d2ed7]"
//                         >
//                           {name}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-3 grid grid-cols-1 gap-x-5 sm:grid-cols-2">
//                   {infoRow("Deal Type", rental.deal_type, Layers3)}
//                   {infoRow("Unit", rental.unit_type, Package)}
//                   {infoRow("Mode", rental.mode_type, CreditCard)}
//                   {infoRow("Record Date", formatDate(rental.record_date), CalendarDays)}
//                   {infoRow("Log In Date", formatDate(rental.login_date), CalendarDays)}
//                   {infoRow("Notify Date", formatDate(rental.notify_date), Clock3)}
//                   {infoRow("Log Out Date", formatDate(rental.login_out_date), CalendarDays)}
//                   {infoRow("Recall Date", formatDate(rental.recall_date), Clock3)}
//                 </div>
//               </div>
//             </section>

//             {/* Commercial */}
//             <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
//               <div className="p-5">
//                 <div className="mb-4 rounded-[16px] border border-[#E3D9FF] bg-gradient-to-r from-[#FAF8FF] to-white px-4 py-4">
//                   <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
//                     Billing Type
//                   </p>
//                   <p className="mt-1 text-[15px] font-extrabold text-[#5d2ed7]">
//                     {rental.billing_type || "—"}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//                   {[
//                     ["Rental Charge", rental.rental_charge],
//                     ["Deposit / Advance", rental.deposit_advance],
//                     ["Installation", rental.installation_charge],
//                   ].map(([label, value]) => (
//                     <div
//                       key={label}
//                       className="rounded-[15px] border border-[#E8DEFF] bg-[#FAF8FF] px-4 py-3.5"
//                     >
//                       <div className="flex items-center gap-1.5 text-[#5d2ed7]">
//                         <IndianRupee size={13} />
//                         <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
//                           {label}
//                         </span>
//                       </div>
//                       <p className="mt-2 text-[16px] font-extrabold text-[#22124D]">
//                         ₹{formatCurrency(value)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </section>

//             {/* Care Center */}
//             <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
//               <div className="p-5">
//                 <div className="mb-3 rounded-[16px] border border-[#E8DEFF] bg-[#FAF8FF] px-4 py-3.5">
//                   <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
//                     Care Center
//                   </p>
//                   <p className="mt-1 text-[13px] font-extrabold text-[#22124D]">
//                     {rental.careCenter?.carecenter_name ||
//                       rental.care_center_name ||
//                       "Direct / Other"}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
//                   {infoRow("POC Mobile", rental.mob_no, Phone)}
//                   {infoRow("Alt Mobile", rental.alternative_mob_no, Phone)}
//                   {infoRow("Bed No", rental.care_bed_no, Building2)}
//                   {infoRow("POC / Doctor", rental.care_poc_name, Stethoscope)}
//                   {infoRow("Referral", rental.care_referal, UsersRound)}
//                 </div>

//                 <div className="mt-3 rounded-[15px] border border-[#E8DEFF] bg-[#FAF8FF] p-4">
//                   <div className="mb-2 flex items-center gap-2">
//                     <MapPin size={14} className="text-[#5d2ed7]" />
//                     <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
//                       Care Address
//                     </span>
//                   </div>
//                   <p className="text-[11.5px] font-semibold leading-5 text-[#553E82]">
//                     {rental.care_address || "—"}
//                   </p>
//                 </div>
//               </div>
//             </section>

//             {/* Patient */}
//             <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
//               <div className="p-5">
//                 <div className="mb-3 rounded-[16px] border border-[#E8DEFF] bg-[#FAF8FF] px-4 py-3.5">
//                   <div className="flex items-center gap-3">
//                     <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EFFF] text-[#5d2ed7]">
//                       <UserRound size={18} />
//                     </span>
//                     <div>
//                       <div className="flex flex-wrap items-center gap-2">
//                         <p className="text-[13px] font-extrabold text-[#22124D]">
//                           {rental.patient_name || "—"}
//                         </p>
//                         {rental.patient_age && (
//                           <span className="rounded-full border border-[#E3D9FF] bg-white px-2 py-0.5 text-[8.5px] font-bold text-[#7F6EA6]">
//                             Age: {rental.patient_age} Yrs
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
//                   {infoRow("Mobile", rental.patient_mob_no, Phone)}
//                   {infoRow("Alt Mobile", rental.patient_alternative_mob_no, Phone)}
//                   {infoRow("Attendant", rental.patient_attendant_name, UsersRound)}
//                 </div>

//                 <div className="mt-3 rounded-[15px] border border-[#E8DEFF] bg-[#FAF8FF] p-4">
//                   <div className="mb-2 flex items-center gap-2">
//                     <MapPin size={14} className="text-[#5d2ed7]" />
//                     <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
//                       Delivery Address
//                     </span>
//                   </div>
//                   <p className="text-[11.5px] font-semibold leading-5 text-[#553E82]">
//                     {rental.patient_delivery_address || "—"}
//                   </p>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* NOTES */}
//           {(rental.notes || rental.internal_notes) && (
//             <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
//               <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2">
//                 {rental.notes && (
//                   <div className="rounded-[15px] border border-[#E8DEFF] bg-[#FAF8FF] p-4">
//                     <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
//                       Transaction Notes
//                     </p>
//                     <p className="whitespace-pre-wrap text-[11.5px] font-medium leading-6 text-[#553E82]">
//                       {rental.notes}
//                     </p>
//                   </div>
//                 )}
//                 {rental.internal_notes && (
//                   <div className="rounded-[15px] border border-[#E8DEFF] bg-[#FAF8FF] p-4">
//                     <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
//                       Internal Notes
//                     </p>
//                     <p className="whitespace-pre-wrap text-[11.5px] font-medium leading-6 text-[#553E82]">
//                       {rental.internal_notes}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </section>
//           )}

//           {/* PHOTOS */}
//           {photoUrls.length > 0 && (
//             <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
//               <div className="flex items-center justify-between border-b border-[#F3EFFF] bg-[#FAF8FF] px-5 py-4">
//                 <div className="flex items-center gap-3">
//                   <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EFFF] text-[#5d2ed7]">
//                     <Camera size={17} />
//                   </span>
//                   <div>
//                     <h2 className="text-[13px] font-extrabold text-[#22124D]">
//                       06 · Asset Handover Photos
//                     </h2>
//                   </div>
//                 </div>
//                 <span className="rounded-full border border-[#E3D9FF] bg-[#F3EFFF] px-2.5 py-1 text-[9px] font-extrabold text-[#5d2ed7]">
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
//                       key={index}
//                       href={source}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="group relative overflow-hidden rounded-[14px] border border-[#E3D9FF] bg-[#FAF8FF]"
//                     >
//                       <img
//                         src={source}
//                         alt={`Photo ${index + 1}`}
//                         className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.03]"
//                       />
//                     </a>
//                   );
//                 })}
//               </div>
//             </section>
//           )}

//           {/* FOOTER */}
//           <div className="flex flex-col gap-3 rounded-[18px] border border-[#E3D9FF] bg-white px-4 py-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
//             <div className="flex items-center gap-3">
//               <span className="hidden h-9 w-9 items-center justify-center rounded-xl bg-[#F3EFFF] text-[#5d2ed7] sm:flex">
//                 <CheckCircle2 size={17} />
//               </span>
//               <div>
//                 <p className="text-[10.5px] font-extrabold text-[#22124D]">
//                   Rental record loaded successfully
//                 </p>
//                 <p className="mt-0.5 text-[9px] text-[#8B7BB5]">
//                   This screen is read-only. Use Edit or Download PDF.
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2.5">
//               <button
//                 type="button"
//                 onClick={() => navigate("/rental-master")}
//                 className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#E3D9FF] bg-white px-4 text-[11px] font-bold text-[#553E82] hover:bg-[#FAF8FF] sm:flex-none"
//               >
//                 <ArrowLeft size={14} />
//                 Rental Master
//               </button>

//               <button
//                 type="button"
//                 onClick={generatePDF}
//                 disabled={isGeneratingPdf}
//                 className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E3D9FF] bg-[#F3EFFF] px-4 text-[11px] font-extrabold text-[#5d2ed7] hover:bg-[#EAE2FF] disabled:opacity-60"
//               >
//                 <Download size={14} />
//                 PDF
//               </button>

//               <button
//                 type="button"
//                 onClick={() => navigate(`/rental-edit/${rental.rental_id}`)}
//                 className="flex h-10 flex-[1.3] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#421E9F] to-[#5d2ed7] px-5 text-[11px] font-extrabold text-white shadow-md sm:flex-none"
//               >
//                 <Pencil size={14} />
//                 Edit
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
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getStatusStyle = (status) => {
    const normalized = String(status || "").toUpperCase();
    if (["ACTIVE", "RUNNING", "DELIVERED"].includes(normalized)) {
      return {
        label: normalized,
        badge: "border-[#E3D9FF] bg-[#F3EFFF] text-[#5d2ed7]",
        dot: "bg-[#5d2ed7]",
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
      badge: "border-[#E3D9FF] bg-[#FAF8FF] text-[#7F6EA6]",
      dot: "bg-[#9C8AC7]",
    };
  };

  const getAccessoryList = () => {
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
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = 14;

      const PRIMARY = [93, 46, 215];
      const PRIMARY_DARK = [66, 30, 159];
      const TEXT_MAIN = [34, 18, 77];
      const TEXT_MUTED = [127, 110, 166];
      const BG_LIGHT = [250, 248, 255];
      const BORDER_COLOR = [227, 217, 255];

      const ensureSpace = (neededHeight = 25) => {
        if (y + neededHeight > pageHeight - 20) {
          doc.addPage();
          y = 16;
        }
      };

      // Header Bar
      doc.setFillColor(...PRIMARY_DARK);
      doc.roundedRect(margin, y, contentWidth, 26, 3, 3, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("ODCom Equipment Rental", margin + 7, y + 10);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(216, 206, 249);
      doc.text("OFFICIAL RENTAL REQUISITION REPORT", margin + 7, y + 18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(`REQ #${rental.rental_id}`, pageWidth - margin - 7, y + 10, {
        align: "right",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(216, 206, 249);
      doc.text(
        `Generated: ${new Date().toLocaleString("en-GB")}`,
        pageWidth - margin - 7,
        y + 18,
        { align: "right" }
      );

      y += 31;

      // Status Bar
      doc.setFillColor(...BG_LIGHT);
      doc.setDrawColor(...BORDER_COLOR);
      doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "FD");

      const rawStatus = (rental.status || "ACTIVE").toUpperCase();
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...PRIMARY);
      doc.text(`STATUS: ${rawStatus}`, margin + 5, y + 9);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...TEXT_MUTED);
      doc.text(
        `Deal: ${rental.deal_type || "—"}  |  Mode: ${rental.mode_type || "—"}  |  Billing: ${rental.billing_type || "—"}`,
        pageWidth - margin - 5,
        y + 9,
        { align: "right" }
      );

      y += 18;

      const drawCard = (x, curY, width, title, rows) => {
        const cardH = 11 + rows.length * 5.4;
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(...BORDER_COLOR);
        doc.roundedRect(x, curY, width, cardH, 2, 2, "FD");

        doc.setFillColor(...BG_LIGHT);
        doc.roundedRect(x, curY, width, 7, 2, 2, "F");
        doc.line(x, curY + 7, x + width, curY + 7);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...PRIMARY);
        doc.text(title, x + 4, curY + 5);

        let rowY = curY + 12;
        rows.forEach(([lbl, val]) => {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7);
          doc.setTextColor(...TEXT_MUTED);
          doc.text(lbl, x + 4, rowY);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(...TEXT_MAIN);
          const safeVal = String(val || "—");
          const truncated = doc.splitTextToSize(safeVal, width - 40)[0];
          doc.text(truncated, x + width - 4, rowY, { align: "right" });
          rowY += 5.4;
        });

        return cardH;
      };

      const colW = (contentWidth - 5) / 2;

      // Section 1: Equipment & Care Center
      ensureSpace(50);
      const h1 = drawCard(margin, y, colW, "EQUIPMENT DETAILS", [
        ["Device ID", rental.device_id || "—"],
        ["Device Name", rental.device?.device_name || "—"],
        ["Serial No.", rental.serial_no || "—"],
        ["Deal Type", rental.deal_type || "—"],
        ["Unit Type", rental.unit_type || "—"],
        ["Mode Type", rental.mode_type || "—"],
      ]);

      const h2 = drawCard(margin + colW + 5, y, colW, "CARE CENTER DETAILS", [
        ["Care Center ID", rental.care_center_id || "—"],
        ["Care Center", rental.careCenter?.carecenter_name || rental.care_center_name || "Direct / Other"],
        ["Bed No.", rental.care_bed_no || "—"],
        ["Doctor / POC", rental.care_poc_name || "—"],
        ["POC Mobile", rental.mob_no || "—"],
        ["Alt Mobile", rental.alternative_mob_no || "—"],
        ["Referral", rental.care_referal || "—"],
      ]);
      y += Math.max(h1, h2) + 5;

      // Section 2: Patient & Dates
      ensureSpace(50);
      const h3 = drawCard(margin, y, colW, "PATIENT DETAILS", [
        ["Patient Name", rental.patient_name || "—"],
        ["Age", rental.patient_age ? `${rental.patient_age} Yrs` : "—"],
        ["Mobile", rental.patient_mob_no || "—"],
        ["Alt Mobile", rental.patient_alternative_mob_no || "—"],
        ["Attendant", rental.patient_attendant_name || "—"],
      ]);

      const h4 = drawCard(margin + colW + 5, y, colW, "CRITICAL DATES & ACCESSORIES", [
        ["Record Date", formatDate(rental.record_date)],
        ["Log In Date", formatDate(rental.login_date)],
        ["Notify Date", formatDate(rental.notify_date)],
        ["Log Out Date", formatDate(rental.login_out_date)],
        ["Recall Date", formatDate(rental.recall_date)],
        ["Accessories", getAccessoryList().join(", ") || "None"],
      ]);
      y += Math.max(h3, h4) + 6;

      // Commercial Summary
      ensureSpace(28);
      doc.setFillColor(...BG_LIGHT);
      doc.setDrawColor(...BORDER_COLOR);
      doc.roundedRect(margin, y, contentWidth, 23, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...PRIMARY);
      doc.text("COMMERCIAL SUMMARY", margin + 5, y + 6);

      const cellW = contentWidth / 3;
      const chargeItems = [
        { label: "Rental Charge", val: `INR ${formatCurrency(rental.rental_charge)}` },
        { label: "Deposit / Advance", val: `INR ${formatCurrency(rental.deposit_advance)}` },
        { label: "Installation Charge", val: `INR ${formatCurrency(rental.installation_charge)}` },
      ];

      chargeItems.forEach((item, index) => {
        const itemX = margin + index * cellW;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...TEXT_MUTED);
        doc.text(item.label.toUpperCase(), itemX + 6, y + 12);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...TEXT_MAIN);
        doc.text(item.val, itemX + 6, y + 19);

        if (index < 2) {
          doc.setDrawColor(...BORDER_COLOR);
          doc.line(itemX + cellW, y + 8, itemX + cellW, y + 21);
        }
      });
      y += 28;

      // Notes & Addresses
      const textBlocks = [
        rental.care_address && { title: "Care Center Address", text: rental.care_address },
        rental.patient_delivery_address && { title: "Patient Delivery Address", text: rental.patient_delivery_address },
        rental.notes && { title: "Transaction Notes", text: rental.notes },
        rental.internal_notes && { title: "Internal Notes", text: rental.internal_notes },
      ].filter(Boolean);

      textBlocks.forEach((block) => {
        ensureSpace(18);
        doc.setDrawColor(...BORDER_COLOR);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, y, contentWidth, 15, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(...PRIMARY);
        doc.text(block.title.toUpperCase(), margin + 5, y + 5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...TEXT_MAIN);
        const splitText = doc.splitTextToSize(block.text, contentWidth - 10);
        doc.text(splitText.slice(0, 2), margin + 5, y + 10.5);

        y += 18;
      });

      // Footers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(...BORDER_COLOR);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(145, 135, 170);
        doc.text("ODCom Equipment Rental System — Official Record", margin, pageHeight - 8);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, {
          align: "right",
        });
      }

      doc.save(`Rental_${rental.rental_id}_${rental.patient_name || "Requisition"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const statusStyle = rental ? getStatusStyle(rental.status) : null;
  const accessoryList = rental ? getAccessoryList() : [];
  const photoUrls = rental ? getPhotoUrls() : [];

  const infoRow = (label, value, Icon = null) => (
    <div className="flex items-start justify-between gap-4 border-b border-[#F3EFFF] py-2.5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-2">
        {Icon && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F3EFFF] text-[#5d2ed7]">
            <Icon size={13} strokeWidth={2} />
          </span>
        )}
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B7BB5]">
          {label}
        </span>
      </div>
      <div className="max-w-[58%] text-right text-[11.5px] font-extrabold leading-5 text-[#22124D] break-words">
        {value ?? "—"}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[72vh] items-center justify-center bg-[#FAF8FF] px-4">
          <div className="w-full max-w-sm rounded-[24px] border border-[#E3D9FF] bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EFFF] text-[#5d2ed7]">
              <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#D3C4FC] border-t-[#5d2ed7]" />
            </div>
            <h3 className="mt-4 text-[15px] font-extrabold text-[#22124D]">
              Loading Rental Record
            </h3>
            <p className="mt-1.5 text-[10.5px] font-medium text-[#8B7BB5]">
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
        <div className="flex min-h-[72vh] items-center justify-center bg-[#FAF8FF] px-4">
          <div className="w-full max-w-md rounded-[24px] border border-rose-100 bg-white p-7 text-center shadow-lg">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <ShieldCheck size={23} />
            </div>
            <h3 className="mt-4 text-[16px] font-extrabold text-[#22124D]">
              Unable to load rental
            </h3>
            <p className="mt-2 text-[11px] font-medium text-rose-600">
              {error || "Rental data could not be loaded."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/rental-master")}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-[#E3D9FF] bg-white px-4 text-[11px] font-bold text-[#553E82] hover:bg-[#FAF8FF]"
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
      <div className="min-h-screen bg-[#FAF8FF]">
        <div className="mx-auto w-full max-w-[1480px] space-y-4 px-3 py-4 sm:px-5 lg:px-6">
          {/* HEADER */}
          <section className="relative overflow-hidden rounded-[24px] border border-[#E3D9FF] bg-white shadow-sm">
            <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/rental-master")}
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E3D9FF] bg-white text-[#7F6EA6] hover:bg-[#F3EFFF] hover:text-[#5d2ed7]"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#8B7BB5]">
                    <span>Rental Master ID #{rental.rental_id}</span>
                    <span>•</span>
                    <span>Created: {formatDateTime(rental.createdAt || rental.created_at)}</span>
                  </div>

                  <h1 className="text-[22px] font-extrabold tracking-tight text-[#22124D] sm:text-[26px]">
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
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E3D9FF] bg-[#F3EFFF] px-4 text-[10.5px] font-extrabold text-[#5d2ed7] transition hover:bg-[#EAE2FF] disabled:opacity-60"
                >
                  {isGeneratingPdf ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#5d2ed7]/30 border-t-[#5d2ed7]" />
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
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#421E9F] to-[#5d2ed7] px-4 text-[10.5px] font-extrabold text-white shadow-md transition hover:-translate-y-[1px]"
                >
                  <Pencil size={14} />
                  Edit Requisition
                </button>
              </div>
            </div>
          </section>

          {/* TOP QUICK METRICS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Wrench,
                label: "Equipment Model",
                value: rental.device?.device_name || `Device ID #${rental.device_id}`,
              },
              {
                icon: Hash,
                label: "Serial Number",
                value: rental.serial_no || "Not Assigned",
              },
              {
                icon: UserRound,
                label: "Patient Name",
                value: rental.patient_name || "—",
              },
              {
                icon: CalendarDays,
                label: "Log In Date",
                value: formatDate(rental.login_date),
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-[17px] border border-[#E3D9FF] bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EFFF] text-[#5d2ed7]">
                    <card.icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
                      {card.label}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] font-extrabold text-[#22124D]">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PRIMARY DATA GRID */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {/* 1. EQUIPMENT & CONFIG */}
            <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
              <div className="border-b border-[#F3EFFF] bg-[#FAF8FF] px-5 py-3.5 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5d2ed7]">
                  Equipment & Deal Configuration
                </span>
                <span className="text-[9.5px] font-bold text-[#8B7BB5]">
                  Device ID: {rental.device_id || "—"}
                </span>
              </div>
              <div className="p-5">
                <div className="rounded-[16px] border border-[#E8DEFF] bg-[#FAF8FF] px-4 py-3">
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
                    Hardware Assigned
                  </p>
                  <p className="mt-0.5 text-[14px] font-extrabold text-[#22124D]">
                    {rental.device?.device_name || "Device Model"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2 text-[10.5px] font-semibold text-[#553E82]">
                    <span>Serial: <strong>{rental.serial_no || "—"}</strong></span>
                    <span>•</span>
                    <span>Device ID: <strong>{rental.device_id}</strong></span>
                  </div>

                  {accessoryList.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {accessoryList.map((item, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-[#E3D9FF] bg-[#F3EFFF] px-2 py-0.5 text-[8.5px] font-bold text-[#5d2ed7]"
                        >
                          Accessory: {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                  {infoRow("Deal Type", rental.deal_type, Layers3)}
                  {infoRow("Unit Type", rental.unit_type, Package)}
                  {infoRow("Mode Type", rental.mode_type, CreditCard)}
                  {infoRow("Status", rental.status, CheckCircle2)}
                  {infoRow("Record Date", formatDate(rental.record_date), CalendarDays)}
                  {infoRow("Login Date", formatDate(rental.login_date), CalendarDays)}
                  {infoRow("Notify Date", formatDate(rental.notify_date), Clock3)}
                  {infoRow("Logout Date", formatDate(rental.login_out_date), CalendarDays)}
                  {infoRow("Recall Date", formatDate(rental.recall_date), Clock3)}
                </div>
              </div>
            </section>

            {/* 2. COMMERCIAL & FINANCIALS */}
            <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
              <div className="border-b border-[#F3EFFF] bg-[#FAF8FF] px-5 py-3.5 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5d2ed7]">
                  Commercial Breakdown
                </span>
                <span className="text-[9.5px] font-bold text-[#8B7BB5]">
                  Billing Mode: {rental.billing_type || "—"}
                </span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    ["Rental Charge", rental.rental_charge],
                    ["Deposit / Advance", rental.deposit_advance],
                    ["Installation", rental.installation_charge],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-[15px] border border-[#E8DEFF] bg-[#FAF8FF] px-4 py-3.5"
                    >
                      <div className="flex items-center gap-1.5 text-[#5d2ed7]">
                        <IndianRupee size={13} />
                        <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
                          {label}
                        </span>
                      </div>
                      <p className="mt-2 text-[16px] font-extrabold text-[#22124D]">
                        ₹{formatCurrency(value)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[15px] border border-[#E3D9FF] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
                        Gross Initial Outflow / Booking Total
                      </p>
                      <p className="text-[11px] font-medium text-[#7F6EA6]">
                        Rental Charge + Deposit + Installation
                      </p>
                    </div>
                    <div className="text-right text-[17px] font-black text-[#5d2ed7]">
                      ₹{formatCurrency(
                        Number(rental.rental_charge || 0) +
                        Number(rental.deposit_advance || 0) +
                        Number(rental.installation_charge || 0)
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  {infoRow("Billing Cycle Type", rental.billing_type, CreditCard)}
                  {infoRow("Payment Mode", rental.mode_type, Layers3)}
                  {infoRow("Created At", formatDateTime(rental.createdAt || rental.created_at), Clock3)}
                  {infoRow("Last Updated", formatDateTime(rental.updatedAt || rental.updated_at), Clock3)}
                </div>
              </div>
            </section>

            {/* 3. CARE CENTER DETAILS */}
            <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
              <div className="border-b border-[#F3EFFF] bg-[#FAF8FF] px-5 py-3.5 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5d2ed7]">
                  Care Center & Clinical Info
                </span>
                <span className="text-[9.5px] font-bold text-[#8B7BB5]">
                  Center ID: {rental.care_center_id || "Direct"}
                </span>
              </div>
              <div className="p-5">
                <div className="mb-3 rounded-[16px] border border-[#E8DEFF] bg-[#FAF8FF] px-4 py-3">
                  <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
                    Hospital / Healthcare Center
                  </p>
                  <p className="mt-0.5 text-[13.5px] font-extrabold text-[#22124D]">
                    {rental.careCenter?.carecenter_name ||
                      rental.care_center_name ||
                      "Direct / Independent Requisition"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                  {infoRow("Care Center ID", rental.care_center_id, Building2)}
                  {infoRow("Bed No.", rental.care_bed_no, Building2)}
                  {infoRow("Primary Contact", rental.mob_no, Phone)}
                  {infoRow("Alternative Contact", rental.alternative_mob_no, Phone)}
                  {infoRow("Doctor / POC", rental.care_poc_name, Stethoscope)}
                  {infoRow("Referral Source", rental.care_referal, UsersRound)}
                </div>

                <div className="mt-3 rounded-[15px] border border-[#E8DEFF] bg-[#FAF8FF] p-4">
                  <div className="mb-1.5 flex items-center gap-2">
                    <MapPin size={13} className="text-[#5d2ed7]" />
                    <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
                      Care Center Full Address
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold leading-5 text-[#553E82]">
                    {rental.care_address || "No clinical address recorded."}
                  </p>
                </div>
              </div>
            </section>

            {/* 4. PATIENT & DELIVERY */}
            <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
              <div className="border-b border-[#F3EFFF] bg-[#FAF8FF] px-5 py-3.5 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5d2ed7]">
                  Patient & Delivery Information
                </span>
                <span className="text-[9.5px] font-bold text-[#8B7BB5]">
                  {rental.patient_age ? `${rental.patient_age} Years Old` : "Age N/A"}
                </span>
              </div>
              <div className="p-5">
                <div className="mb-3 rounded-[16px] border border-[#E8DEFF] bg-[#FAF8FF] px-4 py-3">
                  <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
                    Patient Full Name
                  </p>
                  <div className="mt-0.5 flex items-center justify-between">
                    <p className="text-[14px] font-extrabold text-[#22124D]">
                      {rental.patient_name || "—"}
                    </p>
                    {rental.patient_age && (
                      <span className="rounded-md border border-[#E3D9FF] bg-white px-2 py-0.5 text-[9px] font-bold text-[#7F6EA6]">
                        {rental.patient_age} Years
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                  {infoRow("Patient Contact", rental.patient_mob_no, Phone)}
                  {infoRow("Alt Patient Contact", rental.patient_alternative_mob_no, Phone)}
                  {infoRow("Attendant Name", rental.patient_attendant_name, UsersRound)}
                  {infoRow("Attendant Details", rental.patient_attendant_name ? "Recorded" : "—", ShieldCheck)}
                </div>

                <div className="mt-3 rounded-[15px] border border-[#E8DEFF] bg-[#FAF8FF] p-4">
                  <div className="mb-1.5 flex items-center gap-2">
                    <MapPin size={13} className="text-[#5d2ed7]" />
                    <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
                      Delivery Destination Address
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold leading-5 text-[#553E82]">
                    {rental.patient_delivery_address || "No delivery address recorded."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* NOTES & REMARKS */}
          {(rental.notes || rental.internal_notes) && (
            <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
              <div className="border-b border-[#F3EFFF] bg-[#FAF8FF] px-5 py-3.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5d2ed7]">
                  Requisition Remarks & Internal Notes
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2">
                {rental.notes && (
                  <div className="rounded-[15px] border border-[#E8DEFF] bg-[#FAF8FF] p-4">
                    <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
                      Transaction Notes (Customer Facing)
                    </p>
                    <p className="whitespace-pre-wrap text-[11px] font-medium leading-6 text-[#553E82]">
                      {rental.notes}
                    </p>
                  </div>
                )}
                {rental.internal_notes && (
                  <div className="rounded-[15px] border border-[#E8DEFF] bg-[#FAF8FF] p-4">
                    <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#8B7BB5]">
                      Internal Operations Notes (System Only)
                    </p>
                    <p className="whitespace-pre-wrap text-[11px] font-medium leading-6 text-[#553E82]">
                      {rental.internal_notes}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ASSET PHOTOS */}
          {photoUrls.length > 0 && (
            <section className="overflow-hidden rounded-[20px] border border-[#E3D9FF] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#F3EFFF] bg-[#FAF8FF] px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3EFFF] text-[#5d2ed7]">
                    <Camera size={15} />
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5d2ed7]">
                    Asset Handover & Physical Evidence Photos
                  </span>
                </div>
                <span className="rounded-full border border-[#E3D9FF] bg-[#F3EFFF] px-2.5 py-1 text-[9px] font-extrabold text-[#5d2ed7]">
                  {photoUrls.length} File{photoUrls.length !== 1 ? "s" : ""}
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
                      className="group relative overflow-hidden rounded-[14px] border border-[#E3D9FF] bg-[#FAF8FF]"
                    >
                      <img
                        src={source}
                        alt={`Asset Document ${index + 1}`}
                        className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.03]"
                      />
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* BOTTOM ACTIONS BAR */}
          <div className="flex flex-col gap-3 rounded-[18px] border border-[#E3D9FF] bg-white px-4 py-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-3">
              <span className="hidden h-9 w-9 items-center justify-center rounded-xl bg-[#F3EFFF] text-[#5d2ed7] sm:flex">
                <CheckCircle2 size={17} />
              </span>
              <div>
                <p className="text-[10.5px] font-extrabold text-[#22124D]">
                  All rental model attributes are loaded and up-to-date
                </p>
                <p className="mt-0.5 text-[9px] text-[#8B7BB5]">
                  Sequelize model: rental_master • Primary key ID #{rental.rental_id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/rental-master")}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#E3D9FF] bg-white px-4 text-[11px] font-bold text-[#553E82] hover:bg-[#FAF8FF] sm:flex-none"
              >
                <ArrowLeft size={14} />
                Back to Master
              </button>

              <button
                type="button"
                onClick={generatePDF}
                disabled={isGeneratingPdf}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E3D9FF] bg-[#F3EFFF] px-4 text-[11px] font-extrabold text-[#5d2ed7] hover:bg-[#EAE2FF] disabled:opacity-60"
              >
                <Download size={14} />
                Download PDF
              </button>

              <button
                type="button"
                onClick={() => navigate(`/rental-edit/${rental.rental_id}`)}
                className="flex h-10 flex-[1.3] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#421E9F] to-[#5d2ed7] px-5 text-[11px] font-extrabold text-white shadow-md sm:flex-none"
              >
                <Pencil size={14} />
                Edit Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}