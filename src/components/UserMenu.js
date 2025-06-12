import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import {
  FaChevronDown, FaChevronUp, FaChartBar, FaBell,
  FaUser, FaSignOutAlt, FaList, FaHistory
} from "react-icons/fa";
import "../styles/UserMenu.css";

const menuItems = [
  { icon: FaChartBar, label: "Dashboard", route: "/user/dashboard" },
  { icon: FaBell, label: "Notification", route: "/user/notifications" },
  { icon: FaList, label: "Book an appointment", route: "/user/booking" },
  { icon: FaHistory, label: "History", route: "/user/history" },
  { icon: FaUser, label: "Profile", route: "/user/profile" },
];

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false); 
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
            <li onClick={() => handleNavigate("/")}>
              <FaSignOutAlt style={{ fontSize: "1.4rem" }} /> Log out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
