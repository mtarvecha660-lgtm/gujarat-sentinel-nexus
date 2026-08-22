import {
    createAlert,
    getRecentAlerts
} from "./firestore.js";


// Create a test alert
async function createTestAlert() {

    const title = document.getElementById("alertTitle");
    const message = document.getElementById("alertMessage");
    const box = document.getElementById("alertBox");

    title.innerText = "⏳ CREATING ALERT...";
    message.innerHTML = "Saving alert to Firebase...";
    box.style.background = "#fff8e1";

    try {

        await createAlert({
            vehiclePlate: "GJ05AB1234",
            cameraId: "CAM-017",
            location: "Ahmedabad",
            type: "WATCHLIST_MATCH",
            severity: "HIGH",
            status: "OPEN",
            message: "Stolen vehicle detected"
        });

        title.innerText = "🚨 WATCHLIST MATCH DETECTED";

        message.innerHTML =
            "<strong>Vehicle:</strong> GJ05AB1234<br>" +
            "<strong>Camera:</strong> CAM-017<br>" +
            "<strong>Location:</strong> Ahmedabad<br>" +
            "<strong>Status:</strong> STOLEN VEHICLE";

        box.style.background = "#fff1f1";

        // Reload alerts after creating one
        await loadAlerts();

    } catch (error) {

        console.error("Alert creation error:", error);

        title.innerText = "⚠️ ALERT CREATION FAILED";

        message.innerHTML =
            "Unable to save the alert. Please try again.";

        box.style.background = "#fde7e7";
    }
}


// Load alerts from Firestore
async function loadAlerts() {

    try {

        const alerts = await getRecentAlerts(10);

        const alertCount = document.querySelector(".alert-count");

if (alertCount) {
    alertCount.innerText = alerts.length;
}

        const alertBox = document.getElementById("alertBox");

        if (!alertBox) {
            return;
        }

        // No alerts
        if (alerts.length === 0) {

            alertBox.innerHTML = `
                <div class="empty-alerts">

                    <div class="empty-icon">
                        ✓
                    </div>

                    <p>No alerts</p>

                </div>
            `;

            return;
        }


        // Display alerts
        alertBox.innerHTML = "";

        alerts.forEach((alert) => {

            const alertElement = document.createElement("div");

            alertElement.className = "alert-item";

            let timestamp = "Unknown time";

            if (alert.createdAt && alert.createdAt.toDate) {
                timestamp =
                    alert.createdAt.toDate().toLocaleString();
            }

            alertElement.innerHTML = `

                <div class="alert-header">

                    <strong>
                        🚨 ${alert.type || "ALERT"}
                    </strong>

                    <span>
                        ${alert.severity || "HIGH"}
                    </span>

                </div>

                <p>
                    <strong>Vehicle:</strong>
                    ${alert.vehiclePlate || "Unknown"}
                </p>

                <p>
                    <strong>Camera:</strong>
                    ${alert.cameraId || "Unknown"}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${alert.location || "Unknown"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${alert.status || "OPEN"}
                </p>

                <small>
                    ${timestamp}
                </small>

            `;

            alertBox.appendChild(alertElement);

        });

    } catch (error) {

    console.error("Error loading alerts:", error);

    const alertBox = document.getElementById("alertBox");

    if (alertBox) {
        alertBox.innerHTML = `
            <div class="panel" style="background:#fde7e7;">
                <h3>⚠️ Unable to Load Alerts</h3>
                <p>Firestore error: ${error.message}</p>
            </div>
        `;
    }

}


// Make test button accessible from HTML
window.createTestAlert = createTestAlert;


// Load alerts when dashboard opens
loadAlerts();