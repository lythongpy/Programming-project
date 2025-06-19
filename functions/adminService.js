const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const deleteUserAndData = async (uid) => {
  try {
    // Delete from Auth
    await admin.auth().deleteUser(uid);

    // Delete from all profile collections
    const paths = [
      "users",
      "user_profiles",
      "client_profiles",
      "public_profiles",
    ];
    for (const path of paths) {
      await db.collection(path).doc(uid).delete();
    }

    // Delete/update related appointments
    const snapshot = await db.collection("appointments").get();
    const batch = db.batch();

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const ref = docSnap.ref;
      const isTarget = data.userId === uid || data.client?.id === uid;

      if (isTarget) {
        if (["Pending", "Confirmed"].includes(data.status)) {
          batch.delete(ref);
        } else {
          batch.update(ref, {
            "bookedBy": "Deleted User",
            "client.name": "Deleted User",
          });
        }
      }
    });

    await batch.commit();
    return {success: true, message: `Deleted user ${uid}`};
  } catch (err) {
    console.error("❌ Error deleting user and data:", err);
    throw err;
  }
};

module.exports = {deleteUserAndData};
