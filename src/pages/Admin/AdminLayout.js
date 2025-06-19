import React from "react";
import { Outlet } from "react-router-dom";
import AdminMenu from "./AdminMenu";

const AdminLayout = () => {
  return (
    <div>
      {/* Optional: Sticky Menu/Header */}
      <AdminMenu />

      {/* Page Content */}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
