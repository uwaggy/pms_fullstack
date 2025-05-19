import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import logo from "../../assets/logo.png";
import { Menu, X } from "lucide-react";
import DeleteConfirmModal from "../modals/common/DeleteConfirmModal";

const Sidebar: React.FC = () => {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = localStorage.getItem("user");
  const userRole = user ? JSON.parse(user).role : null;

  const navItems = [
    { name: "Overview", path: "/dashboard/overview", roles: ["ADMIN"] },
    { name: "Vehicles", path: "/dashboard/vehicles", roles: ["USER"] },
    { name: "Slots", path: "/dashboard/slots", roles: ["ADMIN"] },
    { name: "Requests", path: "/dashboard/requests", roles: ["ADMIN", "USER"] },
    { name: "Users", path: "/dashboard/users", roles: ["ADMIN"] },
  ];

  const confirmLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  return (
    <>
      <div className="lg:hidden flex justify-between items-center p-4 bg-gree-200">
        <img src={logo} alt="Logo" className="h-10" />
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <aside
        className={`
          lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } 
          lg:relative lg:flex lg:flex-col rounded-2xl
        `}
      >
        <div className="mb-8 text-center">
          {/* <img src={logo} alt="Logo" className="h-20 mx-auto" /> */}
          <h1 className="font-bold text-xl text-green-600">ParkSphere</h1>
        </div>

        <nav className="flex flex-col space-y-4 text-green-600">
          {navItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-green-600 text-white font-semibold" : ""
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
        </nav>

        <div className="mt-auto mb-6">
          <Button
            variant="outline"
            onClick={confirmLogout}
            className="w-full px-5 py-6 rounded-md border-2 text-green-600"
          >
            Logout
          </Button>
        </div>

        <DeleteConfirmModal
          isOpen={isLogoutConfirmOpen}
          onOpenChange={setIsLogoutConfirmOpen}
          onConfirm={handleLogout}
          title="Confirm Logout"
          description="Are you sure you want to logout? This action cannot be undone."
          confirmText="Logout"
          loadingText="Logging out ..."
        />
      </aside>
    </>
  );
};

export default Sidebar;
