import { getVehicleByPlate } from "./firestore.js";

async function searchVehicle() {
    const input = document.getElementById("vehicleSearch");
    const result = document.getElementById("searchResult");

    const vehicle = input.value.trim().toUpperCase();

    if (vehicle === "") {
        result.innerHTML = "<p>Please enter a vehicle number.</p>";
        return;
    }

    result.innerHTML = `
        <div class="panel" style="margin-top:20px;">
            <p>🔍 Searching watchlist...</p>
        </div>
    `;

    try {
        const vehicleData = await getVehicleByPlate(vehicle);

        if (vehicleData) {
            result.innerHTML = `
                <div class="panel"
                    style="margin-top:20px;background:#fff1f1;">

                    <h3>🚨 WATCHLIST MATCH</h3>

                    <br>

                    <p>
                        <strong>Vehicle:</strong>
                        ${vehicleData.plateNumber || vehicle}
                    </p>

                    <p>
                        <strong>Type:</strong>
                        ${vehicleData.vehicleType || "Unknown"}
                    </p>

                    <p>
                        <strong>Reason:</strong>
                        ${vehicleData.reason || "Not specified"}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${vehicleData.status || "UNKNOWN"}
                    </p>

                    <p>
                        <strong>Priority:</strong>
                        ${vehicleData.priority || "MEDIUM"}
                    </p>

                </div>
            `;
        } else {
            result.innerHTML = `
                <div class="panel"
                    style="margin-top:20px;background:#eaf7ef;">

                    <h3>✓ No Watchlist Match</h3>

                    <br>

                    <p>
                        Vehicle
                        <strong>${vehicle}</strong>
                        was not found on the current watchlist.
                    </p>

                </div>
            `;
        }

    } catch (error) {
        console.error("Vehicle search error:", error);

        result.innerHTML = `
            <div class="panel"
                style="margin-top:20px;background:#fde7e7;">

                <h3>⚠️ Search Error</h3>

                <br>

                <p>
                    Unable to access the vehicle watchlist.
                    Please try again.
                </p>

            </div>
        `;
    }
}

// Make the function available to the existing HTML button.
window.searchVehicle = searchVehicle;