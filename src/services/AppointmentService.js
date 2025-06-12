import { db } from '../firebase/firebase';
import {
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  query,
  where,
  updateDoc
} from 'firebase/firestore';

class AppointmentService {
  async addAppointment(appointmentData, userId) {
    try {
      let dateOnly = appointmentData.date;
      if (dateOnly instanceof Date) {
        dateOnly = `${dateOnly.getFullYear()}-${(dateOnly.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${dateOnly.getDate().toString().padStart(2, "0")}`;
      }
      const now = new Date();
      const createdAtDay = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

      await addDoc(collection(db, "appointments"), {
        ...appointmentData,
        date: dateOnly,
        status: "Pending",
        createdAt: createdAtDay,
        userId
      });
      return true;
    } catch (error) {
      console.error("Error adding appointment:", error);
      return false;
    }
  }

  // Get appointments where the current user is the client (being booked)
  async getAppointmentsForClient(uid) {
    const q = query(collection(db, "appointments"), where("client.id", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get appointments where the current user is the booker
  async getUserAppointments(uid) {
    const q = query(collection(db, "appointments"), where("userId", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateAppointmentStatus(appointmentId, newStatus) {
    try {
      const apptRef = doc(db, "appointments", appointmentId);
      await updateDoc(apptRef, { status: newStatus });
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    }
  }


  async deleteAppointment(appointmentId) {
    await deleteDoc(doc(db, "appointments", appointmentId));
  }
}

const appointmentService = new AppointmentService();
export default appointmentService;
