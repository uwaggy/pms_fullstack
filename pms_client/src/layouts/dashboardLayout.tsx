import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/commons/navbar";
import Sidebar from "../components/commons/sidebar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white-400">
      <div className="bg-green-100 w-[15%]">
        <Sidebar />
      </div>

      <div className="w-[85%] flex flex-col bg-green-50">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
