import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const ClientAnalyticsContext = createContext();

// Custom hook
export const useClientAnalytics = () => useContext(ClientAnalyticsContext);

// Provider Component
export const ClientAnalyticsProvider = ({ children }) => {
  const [stats, setStats] = useState({
    weeklyBookings: [],
    statusCounts: { confirmed: 0, pending: 0, cancelled: 0 }
  });

  // Simulated backend fetch
  useEffect(() => {
    const fetchData = async () => {
      // Replace this with a real API call later
      const bookings = [
        { day: "Mon", count: 4 },
        { day: "Tue", count: 6 },
        { day: "Wed", count: 5 },
        { day: "Thu", count: 9 },
        { day: "Fri", count: 7 },
        { day: "Sat", count: 3 },
        { day: "Sun", count: 2 }
      ];

      const statuses = {
        confirmed: 18,
        pending: 6,
        cancelled: 4
      };

      setStats({
        weeklyBookings: bookings,
        statusCounts: statuses
      });
    };

    fetchData();
  }, []);

  return (
    <ClientAnalyticsContext.Provider value={stats}>
      {children}
    </ClientAnalyticsContext.Provider>
  );
};
