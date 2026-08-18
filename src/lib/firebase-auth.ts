import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in using Firebase Email & Password
 */
export async function signInWithFirebaseEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    return { success: true, user: userCredential.user, idToken };
  } catch (error: any) {
    console.error("Firebase email sign-in error:", error);
    return { success: false, error: error.message, code: error.code };
  }
}

/**
 * Register a new user with Firebase Email & Password
 */
export async function signUpWithFirebaseEmail(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    return { success: true, user: userCredential.user, idToken };
  } catch (error: any) {
    console.error("Firebase sign-up error:", error);
    return { success: false, error: error.message, code: error.code };
  }
}

/**
 * Sign in using Firebase Google OAuth Popup
 */
export async function signInWithFirebaseGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return { success: true, user: result.user, idToken };
  } catch (error: any) {
    console.error("Firebase Google sign-in error:", error);
    return { success: false, error: error.message, code: error.code };
  }
}

/**
 * Sign out from Firebase Auth
 */
export async function signOutFirebase() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error("Firebase sign-out error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Subscribe to Firebase auth state changes
 */
export function onFirebaseAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
