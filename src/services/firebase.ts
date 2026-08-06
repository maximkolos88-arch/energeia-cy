/**
 * Energeia - Firebase Client Configuration & Service Initialization
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Default configuration fallback if config file is not yet provisioned
const defaultFirebaseConfig = {
  apiKey: "demo-energeia-key",
  authDomain: "energeia-cyprus.firebaseapp.com",
  projectId: "energeia-cyprus",
  storageBucket: "energeia-cyprus.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

let app: FirebaseApp;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

try {
  if (!getApps().length) {
    app = initializeApp(defaultFirebaseConfig);
  } else {
    app = getApps()[0];
  }

  dbInstance = getFirestore(app);
  authInstance = getAuth(app);
} catch (e) {
  console.warn("Firebase initialization deferred or running in offline mode:", e);
}

export const db = dbInstance;
export const auth = authInstance;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = authInstance?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };

  console.error('[Firestore Error]', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}
