function searchVehicle() {

    const input =
        document.getElementById("vehicleSearch");

    const result =
        document.getElementById("searchResult");

    const vehicle =
        input.value.trim().toUpperCase();


    if (vehicle === "") {

        result.innerHTML =
            "<p>Please enter a vehicle number.</p>";

        return;

    }


    if (vehicle === "GJ05AB1234") {

        result.innerHTML = `

            <div class="panel"
                 style="margin-top:20px;background:#fff1f1;">

                <h3>
                    🚨 WATCHLIST MATCH
                </h3>

                <br>

                <p>
                    <strong>Vehicle:</strong>
                    GJ05AB1234
                </p>

                <p>
                    <strong>Type:</strong>
                    Car
                </p>

                <p>
                    <strong>Status:</strong>
                    STOLEN
                </p>

                <p>
                    <strong>Priority:</strong>
                    HIGH
                </p>

            </div>

        `;

    }

    else {

        result.innerHTML = `

            <div class="panel"
                 style="margin-top:20px;background:#eaf7ef;">

                <h3>
                    ✓ No Watchlist Match
                </h3>

                <br>

                <p>
                    Vehicle
                    <strong>${vehicle}</strong>
                    was not found on the current watchlist.
                </p>

            </div>

        `;

    }

}
