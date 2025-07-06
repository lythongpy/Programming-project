import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown, FaChevronUp, FaChartBar,
  FaUser, FaSignOutAlt, FaList, FaCog
} from "react-icons/fa";
import "../styles/UserMenu.css";
import authService from "../services/AuthService";


const menuItems = [
  { icon: FaChartBar, label: "Dashboard", route: "/client/dashboard" },
  { icon: FaCog, label: "Appointment", route: "/client/appointment" },
  { icon: FaList, label: "List of users", route: "/client/users" },
  { icon: FaUser, label: "Profile", route: "/client/profile" },
];

const ClientMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false); // close menu after clicking
  };

  const handleLogout = () => {
    authService.logout();    // ✅ signs out from Firebase
    navigate("/login");           // ✅ redirects to homepage
    setOpen(false);          // ✅ closes dropdown
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
              <li key={label} onClick={() => handleNavigate(route)}>
                <Icon style={{ fontSize: "1.4rem" }} /> {label}
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

export default ClientMenu;
