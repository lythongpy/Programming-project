const functions = require("firebase-functions");
const {deleteUserAndData} = require("./adminService");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}


exports.adminDeleteUser = functions.https.onCall(
    async (data, context) => {
      const {uid} = data;

      // Check authentication
      if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated", "Must be signed in.",
        );
      }

      // Check admin role
      const userDoc = await admin
          .firestore()
          .collection("users")
          .doc(context.auth.uid)
          .get();

      const role = userDoc.data()?.role;

      if (role !== "admin") {
        throw new functions.https.HttpsError(
            "permission-denied", "Admin only.",
        );
      }

      // Delete user data
      return await deleteUserAndData(uid);
    });
