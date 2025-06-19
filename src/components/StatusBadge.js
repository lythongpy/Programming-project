import React from "react";

const StatusBadge = ({ status }) => {
  const color = {
    confirm: "#4CAF50",
    pending: "#ccc",
    denied: "#e74c3c",
    complete: "#007bff"
  }[status?.toLowerCase()] || "#888";

  return (
    <span
      style={{
        backgroundColor: color,
        color: "#fff",
        padding: "6px 16px",
        borderRadius: "12px",
        fontWeight: "bold",
        textTransform: "capitalize",
        fontFamily: "monospace"
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
