import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBu7-6YfGsiTeNL1DD62j-NTfJgH-uNVsY',
  authDomain: 'tamyr-80403.firebaseapp.com',
  projectId: 'tamyr-80403',
  storageBucket: 'tamyr-80403.firebasestorage.app',
  messagingSenderId: '483329110150',
  appId: '1:483329110150:web:5a45f8ddb049f463042107',
  measurementId: 'G-RPR9SBD0BL',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Analytics is optional and may not be supported in every browser/environment.
export const analyticsPromise =
  typeof window !== 'undefined'
    ? isSupported().then((supported) => supported ? getAnalytics(app) : null).catch(() => null)
    : Promise.resolve(null)
