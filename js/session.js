import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
    getAuthInstance,
    logoutUser
} from "./auth.js";

const auth = getAuthInstance();

export function requireAuth() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = "pages/login.html";
                return;
            }

            resolve(user);
        });
    });
}

export function getCurrentUser() {
    return auth.currentUser;
}

export function setupLogoutButton() {
    let logoutButton = document.getElementById("logoutBtn");

    if (!logoutButton) {
        logoutButton = document.createElement("button");
        logoutButton.id = "logoutBtn";
        logoutButton.textContent = "Logout";

        logoutButton.style.cssText = `
            padding: 8px 14px;
            border: none;
            border-radius: 6px;
            background: #d84343;
            color: white;
            cursor: pointer;
            font-weight: bold;
            margin-left: 10px;
        `;

        document.body.appendChild(logoutButton);
    }

    logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        logoutButton.textContent = "Logging out...";

        const result = await logoutUser();

        if (result.success) {
            window.location.href = "pages/login.html";
        } else {
            logoutButton.disabled = false;
            logoutButton.textContent = "Logout";
            alert("Logout failed. Please try again.");
        }
    });
}

// Protect the current page.
requireAuth().then(() => {
    setupLogoutButton();
});