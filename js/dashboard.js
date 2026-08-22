function createTestAlert() {

    const title = document.getElementById("alertTitle");
    const message = document.getElementById("alertMessage");
    const box = document.getElementById("alertBox");

    title.innerText = "🚨 WATCHLIST MATCH DETECTED";

    message.innerHTML =
        "<strong>Vehicle:</strong> GJ05AB1234<br>" +
        "<strong>Camera:</strong> CAM-017<br>" +
        "<strong>Location:</strong> Ahmedabad<br>" +
        "<strong>Status:</strong> STOLEN VEHICLE";

    box.style.background = "#fff1f1";
}
