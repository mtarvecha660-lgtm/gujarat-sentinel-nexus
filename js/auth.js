import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function getAuthInstance() {
    return auth;
}

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        return {
            success: true,
            user: userCredential.user
        };
    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
}

export async function logoutUser() {
    try {
        await signOut(auth);

        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
}