
import admin from 'firebase-admin';
import { promises as fs } from 'fs';
import path from 'path';

async function initializeFirebaseAdmin() {
  // If the app is already initialized, do nothing.
  if (admin.apps.length > 0) {
    return;
  }

  try {
    // VERCEL DEPLOYMENT LOGIC:
    // In a production environment (like Vercel), the service account key will be
    // stored in a secure environment variable.
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized using environment variable.');
      return;
    }

    // LOCAL DEVELOPMENT LOGIC:
    // For local development, we fall back to reading the serviceAccountKey.json file.
    // This file should NEVER be committed to Git.
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    const serviceAccountString = await fs.readFile(serviceAccountPath, 'utf-8');
    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully using local file.');

  } catch (error: any) {
    console.error(
      'CRITICAL: Firebase Admin SDK initialization failed. For local dev, ensure serviceAccountKey.json is present. For production, ensure FIREBASE_SERVICE_ACCOUNT_JSON environment variable is set.',
      error
    );
  }
}

/**
 * Returns an initialized Firestore Admin instance.
 * Throws an error if the admin SDK was not successfully initialized.
 */
export async function getFirestoreAdmin() {
  await initializeFirebaseAdmin();
  if (!admin.apps.length) {
    throw new Error('Firebase Admin not initialized. Cannot access Firestore. Check server logs for the root cause.');
  }
  return admin.firestore();
}

/**
 * Returns the initialized Firebase Admin app instance.
 * Throws an error if the admin SDK was not successfully initialized.
 */
export async function getFirebaseAdminApp() {
    await initializeFirebaseAdmin();
    if (!admin.apps.length) {
      throw new Error('Firebase Admin not initialized. Cannot access Admin App. Check server logs for the root cause.');
    }
    return admin;
}

/**
 * Returns an initialized Storage Admin instance.
 * Throws an error if the admin SDK was not successfully initialized.
 */
export async function getStorageAdmin() {
  await initializeFirebaseAdmin();
   if (!admin.apps.length) {
      throw new Error('Firebase Admin not initialized. Cannot access Storage. Check server logs for the root cause.');
    }
  return admin.storage();
}

export default getFirebaseAdminApp;
