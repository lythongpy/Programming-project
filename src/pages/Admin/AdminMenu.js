import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown,
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
  const [open, setOpen] = useState(() => {
    return localStorage.getItem("adminMenuOpen") === "true";
  });
  const navigate = useNavigate();

  // Navigate and close menu
  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
    localStorage.setItem("adminMenuOpen", "false");
  };

  const toggleMenu = () => {
    const next = !open;
    setOpen(next);
    localStorage.setItem("adminMenuOpen", next.toString());
  };

  // Handle logout action
  const handleLogout = () => {
    authService.logout();  // ✅ clear Firebase auth session
    navigate("/login");         // ✅ redirect to homepage
    setOpen(false);        // ✅ close menu
  };

  useEffect(() => {
    const header = document.querySelector(".user-menu-container");
    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="user-menu-container">
      <div className="user-menu-button" onClick={toggleMenu}>
        Menu <FaChevronDown style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} />
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
