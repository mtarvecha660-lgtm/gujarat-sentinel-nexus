import {
    createAlert,
    getRecentAlerts,
    getVehicleByPlate
} from "./firestore.js";


// ============================================
// CREATE CCTV DETECTION
// ============================================

async function createTestAlert() {

    const title = document.getElementById("alertTitle");
    const message = document.getElementById("alertMessage");
    const box = document.getElementById("alertBox");

    // Simulated CCTV detection
    const detectedPlate = "GJ05AB1234";
    const detectedCamera = "CAM-017";
    const detectedLocation = "Ahmedabad";


    // ============================================
    // DETECTION STARTED
    // ============================================

    title.innerText = "📹 VEHICLE DETECTED";

    message.innerHTML =
        `Checking watchlist for <strong>${detectedPlate}</strong>...`;

    box.style.background = "#fff8e1";


    try {

        // ============================================
        // CHECK FIRESTORE WATCHLIST
        // ============================================

        const vehicle =
            await getVehicleByPlate(detectedPlate);


        // ============================================
        // NO WATCHLIST MATCH
        // ============================================

        if (!vehicle) {

            title.innerText =
                "✓ NO WATCHLIST MATCH";

            message.innerHTML =
                `Vehicle <strong>${detectedPlate}</strong>
                 was detected, but it is not on the watchlist.`;

            box.style.background =
                "#eaf7ef";

            return;
        }


        // ============================================
        // CHECK FOR RECENT DUPLICATE
        // ============================================

        const recentAlerts =
            await getRecentAlerts(10);

        const now = Date.now();


        const duplicate =
            recentAlerts.some((alert) => {

                if (
                    alert.vehiclePlate !== detectedPlate ||
                    alert.cameraId !== detectedCamera ||
                    !alert.createdAt ||
                    !alert.createdAt.toMillis
                ) {
                    return false;
                }


                const alertTime =
                    alert.createdAt.toMillis();


                // Prevent duplicate alerts
                // within 60 seconds

                return (
                    now - alertTime < 60000
                );

            });


        // ============================================
        // DUPLICATE FOUND
        // ============================================

        if (duplicate) {

            title.innerText =
                "⚠️ ALERT ALREADY EXISTS";

            message.innerHTML =
                `<strong>${detectedPlate}</strong>
                 was recently detected by
                 <strong>${detectedCamera}</strong>.`;

            box.style.background =
                "#fff8e1";

            return;
        }


        // ============================================
        // WATCHLIST MATCH
        // ============================================

        title.innerText =
            "🚨 WATCHLIST MATCH DETECTED";


        message.innerHTML =

            `<strong>Vehicle:</strong>
             ${vehicle.plateNumber || detectedPlate}<br>` +

            `<strong>Type:</strong>
             ${vehicle.vehicleType || "Unknown"}<br>` +

            `<strong>Reason:</strong>
             ${vehicle.reason || "Unknown"}<br>` +

            `<strong>Status:</strong>
             ${vehicle.status || "UNKNOWN"}`;


        box.style.background =
            "#fff1f1";


        // ============================================
        // CREATE FIRESTORE ALERT
        // ============================================

        await createAlert({

            vehiclePlate:
                vehicle.plateNumber ||
                detectedPlate,

            cameraId:
                detectedCamera,

            location:
                detectedLocation,

            type:
                "WATCHLIST_MATCH",

            severity:
                vehicle.priority === "CRITICAL"
                    ? "CRITICAL"
                    : "HIGH",

            status:
                "OPEN",

            message:
                `Watchlist vehicle detected by ${detectedCamera}`

        });


        // ============================================
        // REFRESH ALERT LIST
        // ============================================

        await loadAlerts();


    } catch (error) {

        console.error(
            "Vehicle detection error:",
            error
        );


        title.innerText =
            "⚠️ DETECTION FAILED";


        message.innerHTML =
            `Unable to process vehicle detection.<br>
             ${error.message}`;


        box.style.background =
            "#fde7e7";

    }

}



// ============================================
// LOAD ALERTS FROM FIRESTORE
// ============================================

async function loadAlerts() {

    try {

        const alerts =
            await getRecentAlerts(10);


        // ============================================
        // UPDATE ALERT COUNT
        // ============================================

        const alertCount =
            document.querySelector(".alert-count");


        if (alertCount) {

            alertCount.innerText =
                alerts.length;

        }


        // ============================================
        // GET ALERT BOX
        // ============================================

        const alertBox =
            document.getElementById("alertBox");


        if (!alertBox) {

            return;

        }


        // ============================================
        // NO ALERTS
        // ============================================

        if (alerts.length === 0) {

            alertBox.className =
                "empty-alerts";


            alertBox.innerHTML = `

                <div class="empty-icon">
                    ✓
                </div>

                <h3 id="alertTitle">
    No alerts
</h3>

<p id="alertMessage">
    The system has not detected
    any watchlist matches.
</p>

                <button
                    onclick="createTestAlert()"
                    class="test-button">

                    📹 Simulate CCTV Detection

                </button>

            `;

            return;

        }


        // ============================================
        // DISPLAY ALERTS
        // ============================================

        alertBox.className =
            "alert-list";


        alertBox.innerHTML =
            "";


        alerts.forEach((alert) => {

            const alertElement =
                document.createElement("div");


            alertElement.className =
                "alert-item";


            // ========================================
            // FORMAT TIMESTAMP
            // ========================================

            let timestamp =
                "Unknown time";


            if (
                alert.createdAt &&
                alert.createdAt.toDate
            ) {

                timestamp =
                    alert.createdAt
                        .toDate()
                        .toLocaleString();

            }


            // ========================================
            // ALERT HTML
            // ========================================

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

                    <strong>
                        Vehicle:
                    </strong>

                    ${alert.vehiclePlate || "Unknown"}

                </p>


                <p>

                    <strong>
                        Camera:
                    </strong>

                    ${alert.cameraId || "Unknown"}

                </p>


                <p>

                    <strong>
                        Location:
                    </strong>

                    ${alert.location || "Unknown"}

                </p>


                <p>

                    <strong>
                        Status:
                    </strong>

                    ${alert.status || "OPEN"}

                </p>


                <small>

                    ${timestamp}

                </small>

            `;


            alertBox.appendChild(
                alertElement
            );

        });

    }


    // ============================================
    // ERROR HANDLING
    // ============================================

    catch (error) {

        console.error(
            "Error loading alerts:",
            error
        );


        const alertBox =
            document.getElementById("alertBox");


        if (alertBox) {

            alertBox.innerHTML = `

                <div
                    class="panel"
                    style="background:#fde7e7;">

                    <h3>
                        ⚠️ Unable to Load Alerts
                    </h3>

                    <p>
                        Firestore error:
                        ${error.message}
                    </p>

                </div>

            `;

        }

    }

}



// ============================================
// MAKE FUNCTION AVAILABLE TO HTML
// ============================================

window.createTestAlert =
    createTestAlert;



// ============================================
// LOAD ALERTS WHEN DASHBOARD OPENS
// ============================================

loadAlerts();