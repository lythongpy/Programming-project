import {
  Timestamp,
  getDoc,
  doc,
  addDoc,
  getDocs,
  collection,
  deleteDoc,
  query,
  where,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const appointmentService = {
  /**
   * ✅ Utility: delete a doc if it exists
   */
  deleteDocIfExists: async (collectionName, docId) => {
    try {
      const ref = doc(db, collectionName, docId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await deleteDoc(ref);
        console.log(`✅ Deleted ${collectionName}/${docId}`);
      } else {
        console.log(`ℹ️ No doc to delete in ${collectionName}/${docId}`);
      }
    } catch (err) {
      console.warn(`⚠️ Could not delete from ${collectionName}:`, err.message);
    }
  },

  /**
   * ✅ Add a new appointment
   */
  
  addAppointment: async (appointment, userId) => {
    const {
      date,
      client,
      time,
      note,
      bookedBy = "",
    } = appointment;

    const timestampDate =
      date instanceof Timestamp ? date : Timestamp.fromDate(new Date(date));

    const dateStr = new Date(date).toISOString().split('T')[0];
    
    return await addDoc(collection(db, 'appointments'), {
      userId,
      client: {
        ...client,
        avatar: typeof client.avatar === "string" ? client.avatar : "/image/default.png",
      },
      date: timestampDate,
      dateStr,
      time: appointment.time,
      note: note || "",
      bookedBy,
      status: "Pending",
      createdAt: serverTimestamp(),
    });
  },

  /**
   * ✅ Real-time subscription to user’s appointments
   */
  subscribeToUserAppointments: (userId, callback) => {
    const q = query(
      collection(db, "appointments"),
      where("userId", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
      const appts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(appts);
    });
  },

  /**
   * ✅ Fetch user appointments once
   */
  getUserAppointments: async (userId) => {
    const q = query(collection(db, "appointments"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * ✅ Get appointments for a client by clientId
   */
  getAppointmentsForClient: async (clientId) => {
    const q = query(collection(db, "appointments"), where("client.id", "==", clientId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * ✅ Real-time listener for client appointments
   */
  subscribeToAppointmentsForClient: (clientId, callback) => {
    const q = query(collection(db, 'appointments'), where('client.id', '==', clientId));
    return onSnapshot(q, (snapshot) => {
      const appointments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(appointments);
    });
  },

  /**
   * ✅ Update an appointment with arbitrary fields
   */
  updateAppointment: async (id, updates) => {
    const ref = doc(db, 'appointments', id);
    return await updateDoc(ref, updates);
  },

  /**
   * ✅ Update appointment status only
   */
  updateAppointmentStatus: async (id, status) => {
    const ref = doc(db, 'appointments', id);
    return await updateDoc(ref, { status });
  },

  /**
   * ✅ Delete an appointment by ID
   */
  deleteAppointment: async (id) => {
    const ref = doc(db, 'appointments', id);
    return await deleteDoc(ref);
  },

  /**
 * ✅ Check for conflicting appointments
 */
  getConfirmedAppointments: async ({ date, time, clientId }) => {
    const dateStr = new Date(date).toISOString().split('T')[0];
    const q = query(
      collection(db, 'appointments'),
      where('client.id', '==', clientId),
      where('dateStr', '==', dateStr),
      where('time', '==', time),
      where('status', '==', 'Confirmed')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // ✅ 2. For use in ClientConfirm logic to deny others
  getAllActiveAppointments: async ({ date, time, clientId }) => {
    const dateStr = new Date(date).toISOString().split('T')[0];
    const q = query(
      collection(db, 'appointments'),
      where('client.id', '==', clientId),
      where('dateStr', '==', dateStr),
      where('time', '==', time),
      where('status', 'in', ['Pending', 'Confirmed'])
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  subscribeToAllAppointments: (callback) => {
    const q = collection(db, 'appointments');
    return onSnapshot(q, (snapshot) => {
      const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(appointments);
    });
  },

  /**
   * ✅ Get appointment by ID
   */
  getAppointmentById: async (id) => {
    const ref = doc(db, 'appointments', id);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },
};

export default appointmentService;