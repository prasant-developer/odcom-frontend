// import React, { useState } from "react";
// import { ArrowRight, Loader2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const LoginView = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

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
//     <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0e4a67] font-sans">
//       <div className="w-full max-w-[480px] bg-white rounded-[1.5rem] p-10 shadow-2xl flex flex-col items-center">
        
//         {/* Chikitsha OS Icon Logo */}
//         <div className="inline-flex p-3 rounded-xl bg-[#007a78] text-white mb-6">
//           <svg
//             className="w-8 h-8"
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
//         </div>

//         {/* Branding Headings */}
//         <div className="mb-8 text-center w-full">
//           <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
//             CHIKITSA OS
//           </h2>
//           <p className="text-slate-500 text-sm mt-1">
//             Authorized Access Only
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5 w-full">
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center text-xs font-semibold">
//               {error}
//             </div>
//           )}

//           {/* Identity Field Input */}
//           <div className="space-y-1.5">
//             <label className="block text-xs font-bold text-slate-600">
//               Employee ID / Email
//             </label>
//             <input
//               type="text"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#007a78]/20 focus:border-[#007a78] transition-all"
//               placeholder="admin@chikitsa.com"
//               required
//             />
//           </div>

//           {/* Secure Credential Input */}
//           <div className="space-y-1.5">
//             <label className="block text-xs font-bold text-slate-600">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#007a78]/20 focus:border-[#007a78] transition-all tracking-widest"
//               placeholder="••••••••"
//               required
//             />
//           </div>

//           {/* Secure Submission Button Trigger */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-[#007a78] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#006361] transition-all flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-75"
//           >
//             {isLoading ? (
//               <Loader2 className="w-5 h-5 animate-spin text-white" />
//             ) : (
//               <>
//                 <span>Secure Login</span>
//                 <ArrowRight size={16} strokeWidth={2.5} />
//               </>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginView;





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Check,
//   Eye,
//   EyeOff,
//   Loader2,
//   LockKeyhole,
//   Mail,
// } from "lucide-react";


// const API_BASE = (
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api"
// ).replace(/\/+$/, "");

// const BrandMark = () => (
//   <svg
//     viewBox="0 0 64 64"
//     aria-hidden="true"
//     className="h-[58px] w-[58px] shrink-0"
//   >
//     <defs>
//       <linearGradient id="heartGradient" x1="8" y1="5" x2="54" y2="58">
//         <stop offset="0%" stopColor="#13C8B4" />
//         <stop offset="48%" stopColor="#10B7AE" />
//         <stop offset="100%" stopColor="#1D57C8" />
//       </linearGradient>
//       <clipPath id="heartClip">
//         <path d="M32 58C27.8 53.8 12.3 42 7.1 31.7 1.5 20.8 6.8 9.4 17.9 6.8 24 5.4 29 8.5 32 13.1 35 8.5 40 5.4 46.1 6.8 57.2 9.4 62.5 20.8 56.9 31.7 51.7 42 36.2 53.8 32 58Z" />
//       </clipPath>
//     </defs>

//     <g clipPath="url(#heartClip)">
//       <rect width="64" height="64" fill="url(#heartGradient)" />
//       <rect x="0" y="27" width="64" height="3" fill="#FFFFFF" opacity="0.98" />
//       <path
//         d="M4 29H16L20.3 20.2L27.1 38.7L32.7 25.8L37.5 29H59"
//         fill="none"
//         stroke="#FFFFFF"
//         strokeWidth="3.1"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </g>
//   </svg>
// );

// const GoogleIcon = () => (
//   <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" aria-hidden="true">
//     <path
//       fill="#4285F4"
//       d="M21.6 12.227c0-.709-.064-1.391-.182-2.045H12v3.873h5.382a4.6 4.6 0 0 1-1.996 3.018v2.51h3.232c1.89-1.741 2.982-4.305 2.982-7.356Z"
//     />
//     <path
//       fill="#34A853"
//       d="M12 22c2.7 0 4.964-.895 6.618-2.418l-3.232-2.51c-.895.6-2.041.955-3.386.955-2.605 0-4.809-1.759-5.596-4.123H3.064v2.591A10 10 0 0 0 12 22Z"
//     />
//     <path
//       fill="#FBBC05"
//       d="M6.404 13.904A6.01 6.01 0 0 1 6.091 12c0-.664.114-1.309.313-1.904V7.505h-3.34A10 10 0 0 0 2 12c0 1.614.386 3.145 1.064 4.495l3.34-2.591Z"
//     />
//     <path
//       fill="#EA4335"
//       d="M12 5.973c1.468 0 2.786.505 3.823 1.495l2.868-2.868C16.959 2.986 14.695 2 12 2a10 10 0 0 0-8.936 5.505l3.34 2.591C7.191 7.732 9.395 5.973 12 5.973Z"
//     />
//   </svg>
// );

// const LoginView = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (isLoading) return;

//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanEmail || !password) {
//       setError("Please enter your email and password.");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`${API_BASE}/auth/login`, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: cleanEmail,
//           password,
//         }),
//       });

//       const text = await response.text();
//       let data = {};

//       try {
//         data = text ? JSON.parse(text) : {};
//       } catch {
//         data = {};
//       }

//       if (!response.ok) {
//         throw new Error(
//           data?.message ||
//             data?.error ||
//             "Invalid email address or password."
//         );
//       }

//       if (!data?.token) {
//         throw new Error(
//           "Authentication token was not returned by the server."
//         );
//       }

//       localStorage.setItem("token", data.token);

//       if (data?.user) {
//         localStorage.setItem("user", JSON.stringify(data.user));
//       }

//       localStorage.setItem(
//         "remember_login",
//         rememberMe ? "true" : "false"
//       );

//       navigate("/admin-dashboard", { replace: true });
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Unable to login. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     navigate("/forgot-password");
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = `${API_BASE}/auth/google/redirect`;
//   };

//   return (
//     <main
//       className="
//         relative flex min-h-screen w-full items-center justify-center overflow-hidden
//         bg-[radial-gradient(circle_at_12%_12%,#FFFFFF_0%,#F4F8FC_34%,#E9F2FA_100%)]
//         px-4 py-5 sm:px-6 sm:py-6 lg:px-8
//       "
//       style={{ fontFamily: '"Inter","Segoe UI",Arial,sans-serif' }}
//     >
//       {/* page soft blue glow */}
//       <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#DCEBFA]/45 blur-3xl" />
//       <div className="pointer-events-none absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-[#D4E8FA]/55 blur-3xl" />

//       <section
//         className="
//           relative grid w-full max-w-[1000px] overflow-hidden
//           rounded-[27px] border border-white/90 bg-white
//           shadow-[0_18px_65px_rgba(58,93,130,0.18)]
//           lg:min-h-[840px] lg:grid-cols-[58%_42%]
//         "
//       >
//         {/* LEFT */}
//         <div className="relative z-20 flex min-h-[700px] flex-col bg-white px-7 py-9 sm:px-10 sm:py-11 lg:min-h-0 lg:px-[60px] lg:py-[64px]">
//           <div className="mx-auto w-full max-w-[470px] lg:mx-0">
//             {/* Brand */}
//             <div className="flex items-center gap-[13px]">
//               <BrandMark />

//               <div className="pt-[2px]">
//                 <h1 className="text-[31px] font-[800] leading-none tracking-[-0.8px] text-[#07162F]">
//                   Chikitsa
//                 </h1>
//                 <p className="mt-[8px] text-[12px] font-[500] tracking-[-0.1px] text-[#6A7D94]">
//                   Healthcare Equipment Management
//                 </p>
//               </div>
//             </div>

//             {/* Welcome */}
//             <div className="mt-[55px]">
//               <h2 className="text-[26px] font-[750] leading-[1.15] tracking-[-0.6px] text-[#07162F]">
//                 Welcome back
//               </h2>
//               <p className="mt-[9px] max-w-[300px] text-[14px] font-[450] leading-[1.5] text-[#5E728A]">
//                 Sign in to access your equipment
//                 <br className="hidden sm:block" /> management platform
//               </p>
//             </div>

//             <form
//               onSubmit={handleSubmit}
//               className="mt-[42px]"
//               noValidate
//             >
//               {error && (
//                 <div
//                   role="alert"
//                   className="mb-5 rounded-[9px] border border-[#F1CACA] bg-[#FFF5F5] px-4 py-3 text-[12px] font-[600] text-[#C24141]"
//                 >
//                   {error}
//                 </div>
//               )}

//               {/* Email */}
//               <div>
//                 <label
//                   htmlFor="login-email"
//                   className="mb-[9px] block text-[12px] font-[700] text-[#0A1830]"
//                 >
//                   Email address
//                 </label>

//                 <div className="group relative">
//                   <Mail
//                     size={17}
//                     strokeWidth={1.9}
//                     className="
//                       pointer-events-none absolute left-[15px] top-1/2
//                       -translate-y-1/2 text-[#8091A7] transition-colors
//                       group-focus-within:text-[#1F6FEB]
//                     "
//                   />

//                   <input
//                     id="login-email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     value={email}
//                     onChange={(e) => {
//                       setEmail(e.target.value);
//                       if (error) setError("");
//                     }}
//                     placeholder="youremail@hospital.org"
//                     required
//                     className="
//                       h-[48px] w-full rounded-[8px] border border-[#D8E0E9] bg-white
//                       pl-[46px] pr-4 text-[13px] font-[500] text-[#1F3147]
//                       outline-none transition
//                       placeholder:font-[450] placeholder:text-[#8A9BB0]
//                       hover:border-[#C3CEDA]
//                       focus:border-[#2A78EE] focus:ring-[3px] focus:ring-[#2A78EE]/10
//                     "
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div className="mt-[26px]">
//                 <label
//                   htmlFor="login-password"
//                   className="mb-[9px] block text-[12px] font-[700] text-[#0A1830]"
//                 >
//                   Password
//                 </label>

//                 <div className="group relative">
//                   <LockKeyhole
//                     size={17}
//                     strokeWidth={1.9}
//                     className="
//                       pointer-events-none absolute left-[15px] top-1/2
//                       -translate-y-1/2 text-[#8091A7] transition-colors
//                       group-focus-within:text-[#1F6FEB]
//                     "
//                   />

//                   <input
//                     id="login-password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="current-password"
//                     value={password}
//                     onChange={(e) => {
//                       setPassword(e.target.value);
//                       if (error) setError("");
//                     }}
//                     placeholder="••••••••••••••••"
//                     required
//                     className="
//                       h-[48px] w-full rounded-[8px] border border-[#D8E0E9] bg-white
//                       pl-[46px] pr-[48px] text-[13px] font-[600] tracking-[1.1px] text-[#536986]
//                       outline-none transition
//                       placeholder:text-[#607795]
//                       hover:border-[#C3CEDA]
//                       focus:border-[#2A78EE] focus:ring-[3px] focus:ring-[#2A78EE]/10
//                     "
//                   />

//                   <button
//                     type="button"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                     onClick={() => setShowPassword((prev) => !prev)}
//                     className="
//                       absolute right-[14px] top-1/2 flex h-8 w-8 -translate-y-1/2
//                       items-center justify-center rounded-full text-[#647A94]
//                       transition hover:bg-[#F3F7FB] hover:text-[#1F6FEB]
//                     "
//                   >
//                     {showPassword ? (
//                       <EyeOff size={17} strokeWidth={2} />
//                     ) : (
//                       <Eye size={17} strokeWidth={2} />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Remember / forgot */}
//               <div className="mt-[21px] flex items-center justify-between gap-4">
//                 <label className="flex cursor-pointer items-center gap-[10px] select-none">
//                   <span className="relative">
//                     <input
//                       type="checkbox"
//                       checked={rememberMe}
//                       onChange={(e) => setRememberMe(e.target.checked)}
//                       className="peer sr-only"
//                     />
//                     <span
//                       className="
//                         flex h-[18px] w-[18px] items-center justify-center
//                         rounded-[4px] border border-[#C8D3DF] bg-white
//                         transition peer-checked:border-[#1E73EA] peer-checked:bg-[#1E73EA]
//                         peer-focus-visible:ring-2 peer-focus-visible:ring-[#1E73EA]/25
//                       "
//                     >
//                       <Check
//                         size={13}
//                         strokeWidth={3}
//                         className="text-white opacity-0 transition peer-checked:opacity-100"
//                       />
//                     </span>
//                   </span>

//                   <span className="text-[12px] font-[650] text-[#21344D]">
//                     Remember me
//                   </span>
//                 </label>

//                 <button
//                   type="button"
//                   onClick={handleForgotPassword}
//                   className="text-[12px] font-[550] text-[#1E73EA] transition hover:text-[#155EC5] hover:underline"
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               {/* Sign in */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="
//                   mt-[29px] flex h-[48px] w-full items-center justify-center gap-2
//                   rounded-[7px] bg-[linear-gradient(90deg,#1971E8_0%,#0D6EF0_50%,#166CE3_100%)]
//                   px-4 text-[13px] font-[700] text-white
//                   shadow-[0_8px_18px_rgba(31,111,235,0.18)]
//                   transition duration-200
//                   hover:-translate-y-[1px] hover:shadow-[0_10px_22px_rgba(31,111,235,0.24)]
//                   active:translate-y-0
//                   disabled:cursor-not-allowed disabled:opacity-70
//                 "
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 size={17} className="animate-spin" />
//                     <span>Signing in...</span>
//                   </>
//                 ) : (
//                   <span>Sign in</span>
//                 )}
//               </button>

//               {/* divider */}
//               <div className="my-[29px] flex items-center gap-[16px]">
//                 <div className="h-px flex-1 bg-[#DDE5ED]" />
//                 <span className="whitespace-nowrap text-[11px] font-[500] text-[#75879B]">
//                   or continue with
//                 </span>
//                 <div className="h-px flex-1 bg-[#DDE5ED]" />
//               </div>

              
//             </form>
//           </div>

          
//         </div>

//         {/* RIGHT MEDICAL VISUAL */}
//         <div
//           className="
//             relative hidden overflow-hidden lg:block
//             bg-[linear-gradient(135deg,#F4F9FE_0%,#EAF4FD_48%,#DDEDFB_100%)]
//           "
//         >


//           {/* Exact visual cropped from the supplied reference */}
//           <img
//             src="https://cdn.corenexis.com/f/hRSV1WYH4wN.png"
//             alt="Hospital equipment"
//             draggable="false"
//             className="
//               absolute inset-0 h-200 w-105 object-cover object-center
//               mix-blend-normal
//             "
//           />

//           {/* edge light */}
//           <div className="pointer-events-none absolute inset-y-0 left-0 w-[84px] bg-gradient-to-r from-white/90 via-white/35 to-transparent" />
//         </div>
//       </section>
//     </main>
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

  /* =========================================================
     LOGIN FUNCTIONALITY
     API/FETCH LOGIC UNCHANGED
  ========================================================= */
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F3F8F5] font-sans">
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Top-left soft green */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#16A36A]/[0.08] blur-3xl" />

        {/* Bottom-right dark green */}
        <div className="absolute -bottom-44 -right-32 h-[540px] w-[540px] rounded-full bg-[#075E45]/[0.08] blur-3xl" />

        {/* Medical grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#087A55 1px, transparent 1px), linear-gradient(90deg, #087A55 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />

        {/* Cross decoration */}
        <div className="absolute left-[7%] top-[16%] hidden text-[#15835C]/10 lg:block">
          <Plus size={52} strokeWidth={1.4} />
        </div>

        <div className="absolute bottom-[12%] right-[6%] hidden text-[#15835C]/10 lg:block">
          <Plus size={66} strokeWidth={1.2} />
        </div>
      </div>

      {/* =====================================================
          MAIN PAGE
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="grid w-full max-w-[1160px] overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_32px_90px_rgba(20,84,61,0.15)] lg:min-h-[690px] lg:grid-cols-[1.05fr_0.95fr]">
          {/* =================================================
              LEFT MEDICAL BRAND PANEL
          ================================================== */}

          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#075F46] via-[#087252] to-[#0B8A61] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            {/* Decorative circles */}

            <div className="absolute -right-24 -top-24 h-[330px] w-[330px] rounded-full border border-white/[0.08]" />

            <div className="absolute -right-4 top-2 h-[235px] w-[235px] rounded-full border border-white/[0.07]" />

            <div className="absolute right-[50px] top-[65px] h-[130px] w-[130px] rounded-full border border-white/[0.06]" />

            {/* Bottom glow */}

            <div className="absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full bg-[#2BC48A]/20 blur-3xl" />

            {/* ECG decoration */}

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

            {/* Logo */}

            <div className="relative z-10 flex items-center gap-3.5">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[17px] border border-white/15 bg-white/[0.13] shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
                <HeartPulse size={27} strokeWidth={2.2} />
              </div>

              <div>
                <h2 className="text-[22px] font-extrabold tracking-[0.08em]">
                  ODCOM
                </h2>

                <p className="mt-0.5 text-[10px] font-semibold tracking-[0.18em] text-emerald-100/70">
                  HEALTHCARE MANAGEMENT
                </p>
              </div>
            </div>

            {/* Main information */}

            <div className="relative z-10 max-w-[455px]">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.09] px-3.5 py-2 text-[11px] font-semibold text-emerald-50 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8BF0C3] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8BF0C3]" />
                </span>

                Secure Medical Management System
              </div>

              <h1 className="text-[43px] font-bold leading-[1.13] tracking-[-0.04em]">
                Better healthcare
                <br />
                starts with
                <br />
                <span className="text-[#A0F2CE]">better management.</span>
              </h1>

              <p className="mt-6 max-w-[420px] text-[14px] leading-7 text-emerald-50/70">
                Manage healthcare operations, medical staff, patient services,
                facilities and administrative workflows securely from one
                connected platform.
              </p>

              {/* Feature cards */}

              <div className="mt-10 grid grid-cols-2 gap-3.5">
                <div className="rounded-[18px] border border-white/[0.1] bg-white/[0.075] p-4.5 backdrop-blur-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[13px] bg-white/[0.11] text-[#A0F2CE]">
                    <ShieldCheck size={20} />
                  </div>

                  <p className="text-[13px] font-bold text-white">
                    Secure System
                  </p>

                  <p className="mt-1.5 text-[10.5px] leading-[18px] text-white/50">
                    Protected healthcare administration
                  </p>
                </div>

                <div className="rounded-[18px] border border-white/[0.1] bg-white/[0.075] p-4.5 backdrop-blur-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[13px] bg-white/[0.11] text-[#A0F2CE]">
                    <Stethoscope size={20} />
                  </div>

                  <p className="text-[13px] font-bold text-white">
                    Medical Operations
                  </p>

                  <p className="mt-1.5 text-[10.5px] leading-[18px] text-white/50">
                    Connected medical workflows
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="relative z-10 flex items-center justify-between border-t border-white/[0.09] pt-6">
              <p className="text-[10px] font-medium text-white/40">
                © 2026 ODCom Healthcare
              </p>

              <div className="flex items-center gap-2 text-[10px] font-semibold text-white/50">
                <ShieldCheck size={13} />
                Authorized Access
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT LOGIN SECTION
          ================================================== */}

          <div className="flex items-center justify-center bg-white px-6 py-10 sm:px-12 lg:px-14">
            <div className="w-full max-w-[405px]">
              {/* Mobile logo */}

              <div className="mb-9 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#087554] to-[#0A9366] text-white shadow-[0_10px_28px_rgba(8,117,84,0.25)]">
                  <HeartPulse size={24} />
                </div>

                <div>
                  <p className="text-[19px] font-extrabold tracking-[0.08em] text-[#153E30]">
                    ODCOM
                  </p>

                  <p className="text-[9px] font-bold tracking-[0.15em] text-[#789489]">
                    HEALTHCARE MANAGEMENT
                  </p>
                </div>
              </div>

              {/* Desktop icon */}

              <div className="mb-7 hidden lg:block">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[17px] border border-[#D7EEE4] bg-[#ECF8F2] text-[#078257]">
                  <Activity size={24} strokeWidth={2.1} />
                </div>
              </div>

              {/* Login heading */}

              <div className="mb-9">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0A8A60]">
                    Secure Portal
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[#A5BDB4]" />

                  <span className="text-[10px] font-semibold text-slate-400">
                    ODCom
                  </span>
                </div>

                <h2 className="text-[31px] font-bold tracking-[-0.035em] text-[#183A2F]">
                  Welcome back
                </h2>

                <p className="mt-2.5 max-w-[370px] text-[13.5px] leading-6 text-[#74847E]">
                  Sign in with your authorized credentials to continue to your
                  healthcare administration dashboard.
                </p>
              </div>

              {/* Error */}

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-[14px] border border-red-100 bg-red-50 px-4 py-3.5">
                  <div className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-red-500" />

                  <p className="text-[12px] font-semibold leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* =================================================
                  LOGIN FORM
              ================================================== */}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.04em] text-[#536A61]">
                    Employee ID / Email
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#94A59E] transition-colors duration-200 group-focus-within:text-[#078257]">
                      <Mail size={18} strokeWidth={1.9} />
                    </div>

                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="
                        h-[55px]
                        w-full
                        rounded-[14px]
                        border
                        border-[#DDE9E4]
                        bg-[#FAFCFB]
                        pl-11
                        pr-4
                        text-[13.5px]
                        font-medium
                        text-[#203D33]
                        outline-none
                        transition-all
                        duration-200
                        placeholder:font-normal
                        placeholder:text-[#B4C2BC]
                        hover:border-[#BED8CD]
                        focus:border-[#0A9466]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#0A9466]/[0.08]
                      "
                      placeholder="Enter employee email"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Password */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.04em] text-[#536A61]">
                      Password
                    </label>

                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#99A9A2]">
                      <LockKeyhole size={11} />
                      Secure
                    </div>
                  </div>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#94A59E] transition-colors duration-200 group-focus-within:text-[#078257]">
                      <LockKeyhole size={18} strokeWidth={1.9} />
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="
                        h-[55px]
                        w-full
                        rounded-[14px]
                        border
                        border-[#DDE9E4]
                        bg-[#FAFCFB]
                        pl-11
                        pr-12
                        text-[13.5px]
                        font-medium
                        text-[#203D33]
                        outline-none
                        transition-all
                        duration-200
                        placeholder:font-normal
                        placeholder:text-[#B4C2BC]
                        hover:border-[#BED8CD]
                        focus:border-[#0A9466]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#0A9466]/[0.08]
                      "
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#98A8A1] transition-colors hover:text-[#087D59]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={1.9} />
                      ) : (
                        <Eye size={18} strokeWidth={1.9} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login button */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    group
                    mt-1
                    flex
                    h-[55px]
                    w-full
                    items-center
                    justify-center
                    gap-2.5
                    rounded-[14px]
                    bg-gradient-to-r
                    from-[#087A57]
                    to-[#0A9668]
                    text-[13.5px]
                    font-bold
                    text-white
                    shadow-[0_11px_28px_rgba(8,122,87,0.24)]
                    transition-all
                    duration-200
                    hover:-translate-y-[1px]
                    hover:shadow-[0_15px_34px_rgba(8,122,87,0.29)]
                    active:translate-y-0
                    disabled:pointer-events-none
                    disabled:opacity-70
                  "
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

              {/* =================================================
                  SECURITY CARD
              ================================================== */}

              <div className="mt-7 flex items-start gap-3.5 rounded-[16px] border border-[#E3EFEA] bg-[#F5FAF7] px-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#E4F5ED] text-[#078257]">
                  <ShieldCheck size={17} strokeWidth={2} />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-[#415A50]">
                    Authorized healthcare personnel only
                  </p>

                  <p className="mt-1 text-[10px] leading-[17px] text-[#879A92]">
                    Access is restricted to approved users. Login activity may
                    be monitored for security and compliance.
                  </p>
                </div>
              </div>

              {/* =================================================
                  STATUS
              ================================================== */}

              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-semibold text-[#92A39C]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>

                ODCom system operational

                <span className="text-[#D0DAD6]">•</span>

                Secure connection
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;