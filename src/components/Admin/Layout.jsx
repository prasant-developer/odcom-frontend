import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-50/60 font-sans flex text-slate-800 antialiased selection:bg-[#1976d2]/10">
      {/* Structural Sidebar Fixed Stack */}
      <Sidebar />

      {/* Workspace Display Grid Panel */}
      <div className="flex-1 pl-72 flex flex-col min-h-screen">
        {/* Universal Sticky Header Frame */}
        <Header title={title} />

        {/* Dynamic Page Target Canvas */}
        <main className="flex-1 pt-28 p-8 max-w-[1600px] w-full mx-auto space-y-8">
          {children}
        </main>

        {/* Universal Footer Strip */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;