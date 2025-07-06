import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown, FaChevronUp, FaChartBar,
  FaUser, FaSignOutAlt, FaList, FaHistory
} from "react-icons/fa";
import authService from "../services/AuthService";
import "../styles/UserMenu.css";

// Navigation menu items
const menuItems = [
  { icon: FaChartBar, label: "Dashboard", route: "/user/dashboard" },
  { icon: FaList, label: "Book an appointment", route: "/user/booking" },
  { icon: FaHistory, label: "History", route: "/user/history" },
  { icon: FaUser, label: "Profile", route: "/user/profile" },
];

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const [unreadCount] = useState(0); // Replace later with real-time count if needed
  const navigate = useNavigate();

  // Navigate and close menu
  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  // Handle logout action
  const handleLogout = () => {
    authService.logout();         // Clear session & sign out from Firebase
    navigate("/login");                // Navigate to homepage
    setOpen(false);               // Close menu
  };

  return (
    <div className="user-menu-container">
      <div className="user-menu-button" onClick={() => setOpen(!open)}>
        Menu {open ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {open && (
        <div className="dropdown-panel-fixed">
          <ul>
            {menuItems.map(({ icon: Icon, label, route }) => (
              <li key={label} onClick={() => handleNavigate(route)} style={{ position: "relative" }}>
                <Icon style={{ fontSize: "1.4rem" }} /> {label}
                {label === "Notification" && unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: 20,
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </li>
            ))}
            <li onClick={handleLogout}>
              <FaSignOutAlt style={{ fontSize: "1.4rem" }} /> Log out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
