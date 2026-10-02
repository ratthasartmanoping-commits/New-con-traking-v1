import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  projectId: "glassy-slate-l8gvj",
  appId: "1:744944325047:web:b0ca8b9ab46f81f18a5832",
  apiKey: "AIzaSyC9kHmSmJRBAT_NSY0kuMOFtsyZ9cViY5s",
  authDomain: "glassy-slate-l8gvj.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-brickminimalistd-e43adca2-9b9f-4dd8-a287-69475ff86072",
  storageBucket: "glassy-slate-l8gvj.firebasestorage.app",
  messagingSenderId: "744944325047"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if provided
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Save user's specific data (events, schedules, activity, settings, booked events) to Firestore
export async function saveUserData(email: string, data: {
  events?: any;
  schedules?: any;
  activityData?: any;
  settings?: any;
  bookedEventIds?: any;
  modes?: any;
}) {
  try {
    const cleanEmail = email.toLowerCase().replace(/[^a-z0-9@.-]/g, '_');
    const userDocRef = doc(db, 'users', cleanEmail || 'default_user');
    await setDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString(),
      email: cleanEmail
    }, { merge: true });
    console.log('Firebase sync: Successfully saved data for user', cleanEmail);
  } catch (error) {
    console.error('Firebase sync error saving data:', error);
  }
}

// Load user's data from Firestore
export async function loadUserData(email: string) {
  try {
    const cleanEmail = email.toLowerCase().replace(/[^a-z0-9@.-]/g, '_');
    const userDocRef = doc(db, 'users', cleanEmail || 'default_user');
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      console.log('Firebase sync: Loaded data for user', cleanEmail);
      return docSnap.data();
    }
  } catch (error) {
    console.error('Firebase sync error loading data:', error);
  }
  return null;
}

