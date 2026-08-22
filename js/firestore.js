import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { firebaseConfig } from "./config.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);


// ================================
// VEHICLE FUNCTIONS
// ================================

// Get all vehicles
export async function getAllVehicles() {
    const vehiclesRef = collection(db, "vehicles");

    const snapshot = await getDocs(vehiclesRef);

    const vehicles = [];

    snapshot.forEach((document) => {
        vehicles.push({
            id: document.id,
            ...document.data()
        });
    });

    return vehicles;
}


// Find vehicle by exact plate number
export async function getVehicleByPlate(plateNumber) {
    const vehiclesRef = collection(db, "vehicles");

    const vehicleQuery = query(
        vehiclesRef,
        where("plateNumber", "==", plateNumber.toUpperCase())
    );

    const snapshot = await getDocs(vehicleQuery);

    if (snapshot.empty) {
        return null;
    }

    const document = snapshot.docs[0];

    return {
        id: document.id,
        ...document.data()
    };
}


// Add a vehicle
export async function addVehicle(vehicleData) {
    const vehiclesRef = collection(db, "vehicles");

    const data = {
        ...vehicleData,
        plateNumber: vehicleData.plateNumber.toUpperCase(),
        isActive: vehicleData.isActive ?? true
    };

    const document = await addDoc(vehiclesRef, data);

    return {
        id: document.id,
        ...data
    };
}


// Update a vehicle
export async function updateVehicle(vehicleId, vehicleData) {
    const vehicleRef = doc(db, "vehicles", vehicleId);

    await updateDoc(vehicleRef, vehicleData);

    return true;
}


// Delete a vehicle
export async function deleteVehicle(vehicleId) {
    const vehicleRef = doc(db, "vehicles", vehicleId);

    await deleteDoc(vehicleRef);

    return true;
}


// ================================
// ALERT FUNCTIONS
// ================================

// Create a new alert
export async function createAlert(alertData) {
    const alertsRef = collection(db, "alerts");

    const data = {
        vehiclePlate: alertData.vehiclePlate || "",
        cameraId: alertData.cameraId || "CAM-001",
        location: alertData.location || "Unknown",
        type: alertData.type || "WATCHLIST_MATCH",
        severity: alertData.severity || "HIGH",
        status: alertData.status || "OPEN",
        message: alertData.message || "Watchlist vehicle detected",
        createdAt: serverTimestamp()
    };

    const document = await addDoc(alertsRef, data);

    return {
        id: document.id,
        ...data
    };
}


// Get recent alerts
export async function getRecentAlerts(maxResults = 10) {
    const alertsRef = collection(db, "alerts");

    const alertsQuery = query(
        alertsRef,
        orderBy("createdAt", "desc"),
        limit(maxResults)
    );

    const snapshot = await getDocs(alertsQuery);

    const alerts = [];

    snapshot.forEach((document) => {
        alerts.push({
            id: document.id,
            ...document.data()
        });
    });

    return alerts;
}


// Acknowledge an alert
export async function acknowledgeAlert(alertId) {
    const alertRef = doc(db, "alerts", alertId);

    await updateDoc(alertRef, {
        status: "ACKNOWLEDGED"
    });

    return true;
}