
// import React, { useState } from "react";
// import {
//   ArrowRight,
//   Eye,
//   EyeOff,
//   HeartPulse,
//   Loader2,
//   LockKeyhole,
//   Mail,
//   ShieldCheck,
//   Stethoscope,
//   Activity,
//   Plus,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const LoginView = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();

//   /* =========================================================
//      LOGIN FUNCTIONALITY
//      API/FETCH LOGIC UNCHANGED
//   ========================================================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isLoading) return;

//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`${API_BASE}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email.trim().toLowerCase(),
//           password,
//         }),
//       });

//       const text = await response.text();
//       let data = {};

//       try {
//         data = text ? JSON.parse(text) : {};
//       } catch (parseError) {
//         console.error("JSON Parse Error:", parseError);
//       }

//       if (!response.ok) {
//         throw new Error(data.message || "Invalid email or password");
//       }

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       navigate("/admin-dashboard", { replace: true });
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError(err.message || "Unable to login. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden bg-[#F3F8F5] font-sans">
//       {/* =====================================================
//           BACKGROUND DECORATION
//       ====================================================== */}

//       <div className="pointer-events-none absolute inset-0">
//         {/* Top-left soft green */}
//         <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#16A36A]/[0.08] blur-3xl" />

//         {/* Bottom-right dark green */}
//         <div className="absolute -bottom-44 -right-32 h-[540px] w-[540px] rounded-full bg-[#075E45]/[0.08] blur-3xl" />

//         {/* Medical grid */}
//         <div
//           className="absolute inset-0 opacity-[0.025]"
//           style={{
//             backgroundImage:
//               "linear-gradient(#087A55 1px, transparent 1px), linear-gradient(90deg, #087A55 1px, transparent 1px)",
//             backgroundSize: "46px 46px",
//           }}
//         />

//         {/* Cross decoration */}
//         <div className="absolute left-[7%] top-[16%] hidden text-[#15835C]/10 lg:block">
//           <Plus size={52} strokeWidth={1.4} />
//         </div>

//         <div className="absolute bottom-[12%] right-[6%] hidden text-[#15835C]/10 lg:block">
//           <Plus size={66} strokeWidth={1.2} />
//         </div>
//       </div>

//       {/* =====================================================
//           MAIN PAGE
//       ====================================================== */}

//       <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
//         <div className="grid w-full max-w-[1160px] overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_32px_90px_rgba(20,84,61,0.15)] lg:min-h-[690px] lg:grid-cols-[1.05fr_0.95fr]">
//           {/* =================================================
//               LEFT MEDICAL BRAND PANEL
//           ================================================== */}

//           <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#075F46] via-[#087252] to-[#0B8A61] p-12 text-white lg:flex lg:flex-col lg:justify-between">
//             {/* Decorative circles */}

//             <div className="absolute -right-24 -top-24 h-[330px] w-[330px] rounded-full border border-white/[0.08]" />

//             <div className="absolute -right-4 top-2 h-[235px] w-[235px] rounded-full border border-white/[0.07]" />

//             <div className="absolute right-[50px] top-[65px] h-[130px] w-[130px] rounded-full border border-white/[0.06]" />

//             {/* Bottom glow */}

//             <div className="absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full bg-[#2BC48A]/20 blur-3xl" />

//             {/* ECG decoration */}

//             <svg
//               className="absolute bottom-[105px] left-0 w-full opacity-[0.065]"
//               viewBox="0 0 700 150"
//               fill="none"
//             >
//               <path
//                 d="M0 75H145L168 75L190 31L225 117L260 58L282 75H350L371 75L394 28L432 120L468 58L490 75H700"
//                 stroke="white"
//                 strokeWidth="4"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>

//             {/* Logo */}

//             <div className="relative z-10 flex items-center gap-3.5">
//               <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[17px] border border-white/15 bg-white/[0.13] shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
//                 <HeartPulse size={27} strokeWidth={2.2} />
//               </div>

//               <div>
//                 <h2 className="text-[22px] font-extrabold tracking-[0.08em]">
//                   ODCOM
//                 </h2>

//                 <p className="mt-0.5 text-[10px] font-semibold tracking-[0.18em] text-emerald-100/70">
//                   HEALTHCARE MANAGEMENT
//                 </p>
//               </div>
//             </div>

//             {/* Main information */}

//             <div className="relative z-10 max-w-[455px]">
//               <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.09] px-3.5 py-2 text-[11px] font-semibold text-emerald-50 backdrop-blur-md">
//                 <span className="relative flex h-2 w-2">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8BF0C3] opacity-60" />
//                   <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8BF0C3]" />
//                 </span>

//                 Secure Medical Management System
//               </div>

//               <h1 className="text-[43px] font-bold leading-[1.13] tracking-[-0.04em]">
//                 Better healthcare
//                 <br />
//                 starts with
//                 <br />
//                 <span className="text-[#A0F2CE]">better management.</span>
//               </h1>

//               <p className="mt-6 max-w-[420px] text-[14px] leading-7 text-emerald-50/70">
//                 Manage healthcare operations, medical staff, patient services,
//                 facilities and administrative workflows securely from one
//                 connected platform.
//               </p>

//               {/* Feature cards */}

//               <div className="mt-10 grid grid-cols-2 gap-3.5">
//                 <div className="rounded-[18px] border border-white/[0.1] bg-white/[0.075] p-4.5 backdrop-blur-md">
//                   <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[13px] bg-white/[0.11] text-[#A0F2CE]">
//                     <ShieldCheck size={20} />
//                   </div>

//                   <p className="text-[13px] font-bold text-white">
//                     Secure System
//                   </p>

//                   <p className="mt-1.5 text-[10.5px] leading-[18px] text-white/50">
//                     Protected healthcare administration
//                   </p>
//                 </div>

//                 <div className="rounded-[18px] border border-white/[0.1] bg-white/[0.075] p-4.5 backdrop-blur-md">
//                   <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[13px] bg-white/[0.11] text-[#A0F2CE]">
//                     <Stethoscope size={20} />
//                   </div>

//                   <p className="text-[13px] font-bold text-white">
//                     Medical Operations
//                   </p>

//                   <p className="mt-1.5 text-[10.5px] leading-[18px] text-white/50">
//                     Connected medical workflows
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}

//             <div className="relative z-10 flex items-center justify-between border-t border-white/[0.09] pt-6">
//               <p className="text-[10px] font-medium text-white/40">
//                 © 2026 ODCom Healthcare
//               </p>

//               <div className="flex items-center gap-2 text-[10px] font-semibold text-white/50">
//                 <ShieldCheck size={13} />
//                 Authorized Access
//               </div>
//             </div>
//           </div>

//           {/* =================================================
//               RIGHT LOGIN SECTION
//           ================================================== */}

//           <div className="flex items-center justify-center bg-white px-6 py-10 sm:px-12 lg:px-14">
//             <div className="w-full max-w-[405px]">
//               {/* Mobile logo */}

//               <div className="mb-9 flex items-center gap-3 lg:hidden">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#087554] to-[#0A9366] text-white shadow-[0_10px_28px_rgba(8,117,84,0.25)]">
//                   <HeartPulse size={24} />
//                 </div>

//                 <div>
//                   <p className="text-[19px] font-extrabold tracking-[0.08em] text-[#153E30]">
//                     ODCOM
//                   </p>

//                   <p className="text-[9px] font-bold tracking-[0.15em] text-[#789489]">
//                     HEALTHCARE MANAGEMENT
//                   </p>
//                 </div>
//               </div>

//               {/* Desktop icon */}

//               <div className="mb-7 hidden lg:block">
//                 <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[17px] border border-[#D7EEE4] bg-[#ECF8F2] text-[#078257]">
//                   <Activity size={24} strokeWidth={2.1} />
//                 </div>
//               </div>

//               {/* Login heading */}

//               <div className="mb-9">
//                 <div className="mb-2 flex items-center gap-2">
//                   <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0A8A60]">
//                     Secure Portal
//                   </span>

//                   <span className="h-1 w-1 rounded-full bg-[#A5BDB4]" />

//                   <span className="text-[10px] font-semibold text-slate-400">
//                     ODCom
//                   </span>
//                 </div>

//                 <h2 className="text-[31px] font-bold tracking-[-0.035em] text-[#183A2F]">
//                   Welcome back
//                 </h2>

//                 <p className="mt-2.5 max-w-[370px] text-[13.5px] leading-6 text-[#74847E]">
//                   Sign in with your authorized credentials to continue to your
//                   healthcare administration dashboard.
//                 </p>
//               </div>

//               {/* Error */}

//               {error && (
//                 <div className="mb-5 flex items-start gap-3 rounded-[14px] border border-red-100 bg-red-50 px-4 py-3.5">
//                   <div className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-red-500" />

//                   <p className="text-[12px] font-semibold leading-5 text-red-600">
//                     {error}
//                   </p>
//                 </div>
//               )}

//               {/* =================================================
//                   LOGIN FORM
//               ================================================== */}

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Email */}

//                 <div>
//                   <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.04em] text-[#536A61]">
//                     Employee ID / Email
//                   </label>

//                   <div className="group relative">
//                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#94A59E] transition-colors duration-200 group-focus-within:text-[#078257]">
//                       <Mail size={18} strokeWidth={1.9} />
//                     </div>

//                     <input
//                       type="text"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="
//                         h-[55px]
//                         w-full
//                         rounded-[14px]
//                         border
//                         border-[#DDE9E4]
//                         bg-[#FAFCFB]
//                         pl-11
//                         pr-4
//                         text-[13.5px]
//                         font-medium
//                         text-[#203D33]
//                         outline-none
//                         transition-all
//                         duration-200
//                         placeholder:font-normal
//                         placeholder:text-[#B4C2BC]
//                         hover:border-[#BED8CD]
//                         focus:border-[#0A9466]
//                         focus:bg-white
//                         focus:ring-4
//                         focus:ring-[#0A9466]/[0.08]
//                       "
//                       placeholder="Enter employee email"
//                       autoComplete="email"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Password */}

//                 <div>
//                   <div className="mb-2 flex items-center justify-between">
//                     <label className="block text-[11px] font-bold uppercase tracking-[0.04em] text-[#536A61]">
//                       Password
//                     </label>

//                     <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#99A9A2]">
//                       <LockKeyhole size={11} />
//                       Secure
//                     </div>
//                   </div>

//                   <div className="group relative">
//                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#94A59E] transition-colors duration-200 group-focus-within:text-[#078257]">
//                       <LockKeyhole size={18} strokeWidth={1.9} />
//                     </div>

//                     <input
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="
//                         h-[55px]
//                         w-full
//                         rounded-[14px]
//                         border
//                         border-[#DDE9E4]
//                         bg-[#FAFCFB]
//                         pl-11
//                         pr-12
//                         text-[13.5px]
//                         font-medium
//                         text-[#203D33]
//                         outline-none
//                         transition-all
//                         duration-200
//                         placeholder:font-normal
//                         placeholder:text-[#B4C2BC]
//                         hover:border-[#BED8CD]
//                         focus:border-[#0A9466]
//                         focus:bg-white
//                         focus:ring-4
//                         focus:ring-[#0A9466]/[0.08]
//                       "
//                       placeholder="Enter your password"
//                       autoComplete="current-password"
//                       required
//                     />

//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                       className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#98A8A1] transition-colors hover:text-[#087D59]"
//                       aria-label={
//                         showPassword ? "Hide password" : "Show password"
//                       }
//                     >
//                       {showPassword ? (
//                         <EyeOff size={18} strokeWidth={1.9} />
//                       ) : (
//                         <Eye size={18} strokeWidth={1.9} />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Login button */}

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="
//                     group
//                     mt-1
//                     flex
//                     h-[55px]
//                     w-full
//                     items-center
//                     justify-center
//                     gap-2.5
//                     rounded-[14px]
//                     bg-gradient-to-r
//                     from-[#087A57]
//                     to-[#0A9668]
//                     text-[13.5px]
//                     font-bold
//                     text-white
//                     shadow-[0_11px_28px_rgba(8,122,87,0.24)]
//                     transition-all
//                     duration-200
//                     hover:-translate-y-[1px]
//                     hover:shadow-[0_15px_34px_rgba(8,122,87,0.29)]
//                     active:translate-y-0
//                     disabled:pointer-events-none
//                     disabled:opacity-70
//                   "
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="h-[19px] w-[19px] animate-spin" />

//                       <span>Authenticating...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Login to ODCom</span>

//                       <ArrowRight
//                         size={17}
//                         strokeWidth={2.4}
//                         className="transition-transform duration-200 group-hover:translate-x-1"
//                       />
//                     </>
//                   )}
//                 </button>
//               </form>

//               {/* =================================================
//                   SECURITY CARD
//               ================================================== */}

//               <div className="mt-7 flex items-start gap-3.5 rounded-[16px] border border-[#E3EFEA] bg-[#F5FAF7] px-4 py-3.5">
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#E4F5ED] text-[#078257]">
//                   <ShieldCheck size={17} strokeWidth={2} />
//                 </div>

//                 <div>
//                   <p className="text-[11px] font-bold text-[#415A50]">
//                     Authorized healthcare personnel only
//                   </p>

//                   <p className="mt-1 text-[10px] leading-[17px] text-[#879A92]">
//                     Access is restricted to approved users. Login activity may
//                     be monitored for security and compliance.
//                   </p>
//                 </div>
//               </div>

//               {/* =================================================
//                   STATUS
//               ================================================== */}

//               <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-semibold text-[#92A39C]">
//                 <span className="relative flex h-2 w-2">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
//                   <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
//                 </span>

//                 ODCom system operational

//                 <span className="text-[#D0DAD6]">•</span>

//                 Secure connection
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginView;




import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
  Activity,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const text = await response.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
      }

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Unable to login. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F7F5FC] font-sans">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#673de6]/[0.08] blur-3xl" />
        <div className="absolute -bottom-44 -right-32 h-[540px] w-[540px] rounded-full bg-[#4A1FB8]/[0.08] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#673de6 1px, transparent 1px), linear-gradient(90deg, #673de6 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />

        <div className="absolute left-[7%] top-[16%] hidden text-[#673de6]/10 lg:block">
          <Plus size={52} strokeWidth={1.4} />
        </div>

        <div className="absolute bottom-[12%] right-[6%] hidden text-[#673de6]/10 lg:block">
          <Plus size={66} strokeWidth={1.2} />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="grid w-full max-w-[1160px] overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_32px_90px_rgba(103,61,230,0.12)] lg:min-h-[690px] lg:grid-cols-[1.05fr_0.95fr]">
          
          {/* LEFT PANEL */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#4A1FB8] via-[#5B2BD4] to-[#673de6] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-24 -top-24 h-[330px] w-[330px] rounded-full border border-white/[0.08]" />
            <div className="absolute -right-4 top-2 h-[235px] w-[235px] rounded-full border border-white/[0.07]" />
            <div className="absolute right-[50px] top-[65px] h-[130px] w-[130px] rounded-full border border-white/[0.06]" />
            <div className="absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full bg-[#9B7BFF]/20 blur-3xl" />

            <svg
              className="absolute bottom-[105px] left-0 w-full opacity-[0.065]"
              viewBox="0 0 700 150"
              fill="none"
            >
              <path
                d="M0 75H145L168 75L190 31L225 117L260 58L282 75H350L371 75L394 28L432 120L468 58L490 75H700"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="relative z-10 flex items-center gap-3.5">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[17px] border border-white/15 bg-white/[0.13] shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
                <HeartPulse size={27} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-[22px] font-extrabold tracking-[0.08em]">
                  ODCOM
                </h2>
                <p className="mt-0.5 text-[10px] font-semibold tracking-[0.18em] text-purple-100/70">
                  HEALTHCARE MANAGEMENT
                </p>
              </div>
            </div>

            <div className="relative z-10 max-w-[455px]">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.09] px-3.5 py-2 text-[11px] font-semibold text-purple-50 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C4B5FD] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C4B5FD]" />
                </span>
                Secure Medical Management System
              </div>

              <h1 className="text-[43px] font-bold leading-[1.13] tracking-[-0.04em]">
                Better healthcare
                <br />
                starts with
                <br />
                <span className="text-[#D8CFFF]">better management.</span>
              </h1>

              <p className="mt-6 max-w-[420px] text-[14px] leading-7 text-purple-50/70">
                Manage healthcare operations, medical staff, patient services,
                facilities and administrative workflows securely from one
                connected platform.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-3.5">
                <div className="rounded-[18px] border border-white/[0.1] bg-white/[0.075] p-4.5 backdrop-blur-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[13px] bg-white/[0.11] text-[#D8CFFF]">
                    <ShieldCheck size={20} />
                  </div>
                  <p className="text-[13px] font-bold text-white">Secure System</p>
                  <p className="mt-1.5 text-[10.5px] leading-[18px] text-white/50">
                    Protected healthcare administration
                  </p>
                </div>

                <div className="rounded-[18px] border border-white/[0.1] bg-white/[0.075] p-4.5 backdrop-blur-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[13px] bg-white/[0.11] text-[#D8CFFF]">
                    <Stethoscope size={20} />
                  </div>
                  <p className="text-[13px] font-bold text-white">Medical Operations</p>
                  <p className="mt-1.5 text-[10.5px] leading-[18px] text-white/50">
                    Connected medical workflows
                  </p>
                </div>
              </div>
            </div>

           
          </div>

          {/* RIGHT LOGIN SECTION */}
          <div className="flex items-center justify-center bg-white px-6 py-10 sm:px-12 lg:px-14">
            <div className="w-full max-w-[405px]">
              {/* Mobile logo */}
              <div className="mb-9 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#5B2BD4] to-[#673de6] text-white shadow-[0_10px_28px_rgba(103,61,230,0.25)]">
                  <HeartPulse size={24} />
                </div>
                <div>
                  <p className="text-[19px] font-extrabold tracking-[0.08em] text-[#2E1A5E]">
                    ODCOM
                  </p>
                  <p className="text-[9px] font-bold tracking-[0.15em] text-[#8B7BB5]">
                    HEALTHCARE MANAGEMENT
                  </p>
                </div>
              </div>

              <div className="mb-7 hidden lg:block">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[17px] border border-[#E9E2FF] bg-[#F3EEFF] text-[#673de6]">
                  <Activity size={24} strokeWidth={2.1} />
                </div>
              </div>

              <div className="mb-9">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#673de6]">
                    Secure Portal
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#C4B5FD]" />
                  <span className="text-[10px] font-semibold text-slate-400">
                    ODCom
                  </span>
                </div>

                <h2 className="text-[31px] font-bold tracking-[-0.035em] text-[#2E1A5E]">
                  Welcome back
                </h2>

                
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-[14px] border border-red-100 bg-red-50 px-4 py-3.5">
                  <div className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p className="text-[12px] font-semibold leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.04em] text-[#5C4B7A]">
                    Employee ID / Email
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#A78BFA] transition-colors duration-200 group-focus-within:text-[#673de6]">
                      <Mail size={18} strokeWidth={1.9} />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-[55px] w-full rounded-[14px] border border-[#E4DCFF] bg-[#FCFAFF] pl-11 pr-4 text-[13.5px] font-medium text-[#2E1A5E] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#B8A9D9] hover:border-[#C4B5FD] focus:border-[#673de6] focus:bg-white focus:ring-4 focus:ring-[#673de6]/[0.12]"
                      placeholder="Enter employee email"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.04em] text-[#5C4B7A]">
                      Password
                    </label>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#A78BFA]">
                      <LockKeyhole size={11} />
                      Secure
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#A78BFA] transition-colors duration-200 group-focus-within:text-[#673de6]">
                      <LockKeyhole size={18} strokeWidth={1.9} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-[55px] w-full rounded-[14px] border border-[#E4DCFF] bg-[#FCFAFF] pl-11 pr-12 text-[13.5px] font-medium text-[#2E1A5E] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#B8A9D9] hover:border-[#C4B5FD] focus:border-[#673de6] focus:bg-white focus:ring-4 focus:ring-[#673de6]/[0.12]"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#A78BFA] transition-colors hover:text-[#673de6]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={1.9} />
                      ) : (
                        <Eye size={18} strokeWidth={1.9} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group mt-1 flex h-[55px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-gradient-to-r from-[#5B2BD4] to-[#673de6] text-[13.5px] font-bold text-white shadow-[0_11px_28px_rgba(103,61,230,0.28)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_15px_34px_rgba(103,61,230,0.35)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-[19px] w-[19px] animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Login to ODCom</span>
                      <ArrowRight
                        size={17}
                        strokeWidth={2.4}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              

             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;