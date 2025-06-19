import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown, FaChevronUp,
  FaUserTie, FaUserCheck, FaUserPlus,
  FaChartLine, FaSignOutAlt, FaUser
} from "react-icons/fa";
import authService from "../../services/AuthService"; // ✅ make sure this path is correct
import "../../styles/AdminMenu.css";




const adminMenuItems = [
  { icon: FaChartLine, label: "Dashboard", route: "/admin/dashboard" },
  { icon: FaUserCheck, label: "Accounts", route: "/admin/accounts" },
  { icon: FaUserTie, label: "Appointments", route: "/admin/appointments" },
  { icon: FaUserPlus, label: "Add Account", route: "/admin/add-client" },
  { icon: FaUser, label: "Profile", route: "/admin/profile" },
];



const AdminMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Navigate and close menu
  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  // Handle logout action
  const handleLogout = () => {
    authService.logout();  // ✅ clear Firebase auth session
    navigate("/login");         // ✅ redirect to homepage
    setOpen(false);        // ✅ close menu
  };

  return (
    <div className="user-menu-container">
      <div className="user-menu-button" onClick={() => setOpen(!open)}>
        Menu {open ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {open && (
        <div className="dropdown-panel-fixed slide-down">
          <ul>
            {adminMenuItems.map(({ icon: Icon, label, route }) => (
              <li key={label} onClick={() => handleNavigate(route)}>
                <Icon style={{ fontSize: "1.2rem" }} /> {label}
              </li>
            ))}
            <li onClick={handleLogout}>
              <FaSignOutAlt style={{ fontSize: "1.2rem" }} /> Log Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
