import { getVehicleByPlate, getAllVehicles } from "./firestore.js";

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

                    <p>
                        <strong>Record ID:</strong>
                        ${vehicleData.id || "N/A"}
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


async function loadVehicles() {
    const table = document.querySelector(".camera-table");

    if (!table) {
        return;
    }

    try {
        const vehicles = await getAllVehicles();

        table.innerHTML = `
            <div class="table-header">
                <span>Vehicle</span>
                <span>Type</span>
                <span>Reason</span>
                <span>Status</span>
            </div>
        `;

        if (vehicles.length === 0) {
            table.innerHTML += `
                <div class="table-row">
                    <span>No vehicles found</span>
                    <span>-</span>
                    <span>-</span>
                    <span>-</span>
                </div>
            `;

            return;
        }

        vehicles.forEach((vehicle) => {
            const row = document.createElement("div");
            row.className = "table-row";

            row.innerHTML = `
                <span>${vehicle.plateNumber || "Unknown"}</span>
                <span>${vehicle.vehicleType || "Unknown"}</span>
                <span>${vehicle.reason || "Not specified"}</span>
                <span class="offline">
                    ${getStatusIcon(vehicle.status)}
                    ${vehicle.status || "UNKNOWN"}
                </span>
            `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error("Vehicle loading error:", error);

        table.innerHTML = `
            <div class="table-row">
                <span>⚠️ Unable to load vehicles</span>
            </div>
        `;
    }
}


function getStatusIcon(status) {
    const normalizedStatus = String(status || "").toUpperCase();

    if (normalizedStatus === "STOLEN") {
        return "🚨";
    }

    if (normalizedStatus === "WANTED") {
        return "⚠️";
    }

    if (normalizedStatus === "BLACKLISTED") {
        return "🚨";
    }

    return "⚠️";
}


window.searchVehicle = searchVehicle;

loadVehicles();