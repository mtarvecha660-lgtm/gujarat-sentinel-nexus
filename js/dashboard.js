import { createAlert } from "./firestore.js";

async function createTestAlert() {
    const title = document.getElementById("alertTitle");
    const message = document.getElementById("alertMessage");
    const box = document.getElementById("alertBox");

    // Show loading state
    title.innerText = "⏳ CREATING ALERT...";
    message.innerHTML = "Saving alert to Firebase...";
    box.style.background = "#fff8e1";

    try {
        // Create real alert in Firestore
        await createAlert({
            vehiclePlate: "GJ05AB1234",
            cameraId: "CAM-017",
            location: "Ahmedabad",
            type: "WATCHLIST_MATCH",
            severity: "HIGH",
            status: "OPEN",
            message: "Stolen vehicle detected"
        });

        // Update dashboard
        title.innerText = "🚨 WATCHLIST MATCH DETECTED";

        message.innerHTML =
            "<strong>Vehicle:</strong> GJ05AB1234<br>" +
            "<strong>Camera:</strong> CAM-017<br>" +
            "<strong>Location:</strong> Ahmedabad<br>" +
            "<strong>Status:</strong> STOLEN VEHICLE";

        box.style.background = "#fff1f1";

    } catch (error) {
        console.error("Alert creation error:", error);

        title.innerText = "⚠️ ALERT CREATION FAILED";

        message.innerHTML =
            "Unable to save the alert. Please try again.";

        box.style.background = "#fde7e7";
    }
}

window.createTestAlert = createTestAlert;