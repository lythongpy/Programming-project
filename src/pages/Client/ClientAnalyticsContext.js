import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import authService from "../../services/AuthService";

const ClientAnalyticsContext = createContext();

export const useClientAnalytics = () => useContext(ClientAnalyticsContext);

export const ClientAnalyticsProvider = ({ children }) => {
  const [statusByMonth, setStatusByMonth] = useState([]);
  const [statusByWeek, setStatusByWeek] = useState([]);

  useEffect(() => {
    const uid = authService.getCurrentUserId();
    if (!uid) return;

    const q = query(
      collection(db, "appointments"),
      where("client.id", "==", uid),
      where("status", "in", ["Completed", "Denied"])
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const appointments = snapshot.docs.map((doc) => doc.data());

      const monthlyStats = {};
      const weeklyStats = {};

      appointments.forEach((a) => {
        let d;
        if (a.date?.toDate) {
          d = a.date.toDate();
        } else if (typeof a.date === "string") {
          const [y, m, day] = a.date.split("-");
          d = new Date(parseInt(y), parseInt(m) - 1, parseInt(day));
        } else {
          d = new Date(a.date);
        }

        const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
        const weekKey = `${d.getFullYear()}-W${getWeekNumber(d)}`;

        if (!monthlyStats[monthKey]) monthlyStats[monthKey] = { completed: 0, denied: 0 };
        if (!weeklyStats[weekKey]) weeklyStats[weekKey] = { completed: 0, denied: 0 };

        const status = a.status.toLowerCase();
        if (status === "completed") {
          monthlyStats[monthKey].completed++;
          weeklyStats[weekKey].completed++;
        } else if (status === "denied") {
          monthlyStats[monthKey].denied++;
          weeklyStats[weekKey].denied++;
        }
      });

      const sortedMonths = Object.entries(monthlyStats)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([label, counts]) => ({ label, ...counts }));

      const sortedWeeks = Object.entries(weeklyStats)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([label, counts]) => ({ label, ...counts }));

      setStatusByMonth(sortedMonths);
      setStatusByWeek(sortedWeeks);
    });

    return () => unsub();
  }, []);

  return (
    <ClientAnalyticsContext.Provider value={{ statusByMonth, statusByWeek }}>
      {children}
    </ClientAnalyticsContext.Provider>
  );
};

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
