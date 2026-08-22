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
    doc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);


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