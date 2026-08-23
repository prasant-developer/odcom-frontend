import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Mail,
  ArrowLeft,
  ShieldAlert,
  ArrowRight,
  Key,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: OTP + password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to send verification code.");

      toast.success("If account exists, recovery OTP sent! Check your inbox.", {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
      });
      setStep(2);
    } catch (error) {
      toast.error(error.message || "Server connection error.", {
        position: "top-right",
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-right", theme: "colored" });
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
            confirmPassword,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Reset failed.");

      toast.success("Credentials updated successfully! Syncing radar...", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });

      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Reset failed. Verify security OTP token.", {
        position: "top-right",
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative bg-gradient-to-tr from-slate-900 via-[#006d77] to-slate-800 overflow-hidden font-sans selection:bg-[#006d77]/20">
      <ToastContainer />

      {/* Decorative Background Blur Nodes */}
      <div className="absolute top-12 right-12 w-96 h-96 bg-[#006d77]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-12 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Form Wrapper Panel */}
      <div className="w-full max-w-[560px] flex flex-col items-center justify-center relative z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-[0_30px_70px_-10px_rgba(15,23,42,0.3)] backdrop-blur-sm flex flex-col items-center"
        >
          {/* Form Header Context */}
          <div className="mb-8 text-center w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006d77]/5 text-[#006d77] text-[10px] font-black mb-4 tracking-[0.15em] uppercase border border-[#006d77]/10">
              <ShieldAlert size={12} /> Security Verification
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              {step === 1 ? "Credential Recovery" : "Authorize Reset"}
            </h2>
            <p className="text-slate-400 font-medium text-sm max-w-sm mx-auto">
              {step === 1
                ? "Verify your registered dispatch email terminal."
                : `Input secure token dispatched to ${email}`}
            </p>
          </div>

          {step === 1 ? (
            /* STEP 1: Dispatch Terminal Email Form */
            <form className="space-y-6 w-full" onSubmit={handleEmailSubmit}>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1 text-left">
                  Account Dispatch Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#006d77] transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="admin@chikitsha.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                    className="w-full bg-slate-50 border-2 border-slate-100/70 rounded-2xl py-4 pl-11 pr-4 focus:bg-white focus:border-[#006d77] focus:ring-4 focus:ring-[#006d77]/5 outline-none transition-all text-slate-900 text-sm font-semibold placeholder:text-slate-300 shadow-inner text-left"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#006d77] hover:bg-[#005a63] text-white py-4.5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-[#006d77]/20 transition-all flex items-center justify-center gap-2.5 mt-2 disabled:opacity-75 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Token</span>
                    <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Transit OTP Token & Access Credentials Updates */
            <form className="space-y-5 w-full" onSubmit={handleOtpSubmit}>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1 text-left">
                  6-Digit Gateway OTP
                </label>
                <div className="relative group">
                  <Key
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#006d77] transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="••••••"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-slate-50 border-2 border-slate-100/70 rounded-2xl py-4 pl-11 pr-4 focus:bg-white focus:border-[#006d77] focus:ring-4 focus:ring-[#006d77]/5 outline-none transition-all text-slate-900 text-sm font-bold placeholder:text-slate-300 tracking-widest shadow-inner text-left"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1 text-left">
                  New Terminal Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#006d77] transition-colors"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 safety units"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100/70 rounded-2xl py-4 pl-11 pr-11 focus:bg-white focus:border-[#006d77] focus:ring-4 focus:ring-[#006d77]/5 outline-none transition-all text-slate-900 text-sm font-semibold placeholder:text-slate-300 shadow-inner text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#006d77] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-1 text-left">
                  Confirm Terminal Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#006d77] transition-colors"
                    size={18}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password configuration"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100/70 rounded-2xl py-4 pl-11 pr-11 focus:bg-white focus:border-[#006d77] focus:ring-4 focus:ring-[#006d77]/5 outline-none transition-all text-slate-900 text-sm font-semibold placeholder:text-slate-300 shadow-inner text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#006d77] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#006d77] hover:bg-[#005a63] text-white py-4.5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-[#006d77]/20 transition-all flex items-center justify-center gap-2.5 mt-2 disabled:opacity-75 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Commit Security Update</span>
                    <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Core Modular Control Zone Actions */}
          <div className="mt-8 pt-6 border-t border-slate-100/80 text-center flex flex-col items-center w-full">
            <button
              type="button"
              onClick={() => {
                if (step === 2) {
                  setStep(1);
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                } else {
                  navigate("/login");
                }
              }}
              className="flex items-center gap-2 text-slate-400 font-bold hover:text-[#006d77] transition-all group text-xs tracking-wider uppercase"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>{step === 1 ? "Abort to Login Grid" : "Modify Gateway Email"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;