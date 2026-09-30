const DOCTORS_API_URL = import.meta.env.VITE_DOCTORS_API_URL;
const AUTH_API_URL = "http://localhost:3000/api/auth";
const APPOINTMENTS_API_URL = "http://localhost:3002/api/appointments";

/* =========================
   AUTH
========================= */

export async function registerUser(data) {
    const response = await fetch(
        `${AUTH_API_URL}/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Registration failed"
        );
    }

    return result;
}


export async function loginUser(data) {
    const response = await fetch(
        `${AUTH_API_URL}/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Login failed"
        );
    }

    window.dispatchEvent(new Event("auth-change"));

    return result;
}


export async function getCurrentUser() {
    const response = await fetch(
        `${AUTH_API_URL}/me`,
        {
            credentials: "include",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Not authenticated"
        );
    }

    return result;
}


export async function logoutUser() {
    const response = await fetch(
        `${AUTH_API_URL}/logout`,
        {
            credentials: "include",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Logout failed"
        );
    }

    window.dispatchEvent(new Event("auth-change"));

    return result;
}


/* =========================
   DOCTORS
========================= */

export async function getDoctors(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
            query.append(key, value);
        }
    });

    const response = await fetch(
        `${DOCTORS_API_URL}?${query.toString()}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch doctors");
    }

    return response.json();
}


export async function getDoctorById(id) {
    const response = await fetch(
        `${DOCTORS_API_URL}/${id}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch doctor");
    }

    return response.json();
}


/* =========================
   APPOINTMENTS
========================= */

export async function createAppointment(data) {
    const response = await fetch(
        APPOINTMENTS_API_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "Failed to create appointment"
        );
    }

    return result;
}


export async function getMyAppointments() {
    console.log("➡️ Calling GET /api/appointments/my");

    const response = await fetch(
        "http://localhost:3002/api/appointments/my",
        {
            method: "GET",
            credentials: "include",
        }
    );

    console.log("⬅️ Appointment response status:", response.status);

    const text = await response.text();

    console.log("⬅️ Appointment raw response:", text);

    let result;

    try {
        result = JSON.parse(text);
    } catch {
        throw new Error("Backend returned invalid JSON");
    }

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to fetch appointments"
        );
    }

    return result;
}


export async function getAppointmentById(id) {
    const response = await fetch(
        `${APPOINTMENTS_API_URL}/${id}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "Failed to fetch appointment"
        );
    }

    return result;
}


export async function updateAppointment(id, data) {
    const response = await fetch(
        `${APPOINTMENTS_API_URL}/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "Failed to update appointment"
        );
    }

    return result;
}


export async function deleteAppointment(id) {
    const response = await fetch(
        `${APPOINTMENTS_API_URL}/${id}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "Failed to cancel appointment"
        );
    }

    return result;
}

/* =========================
   PAYMENT
========================= */


const PAYMENT_API_URL = "http://localhost:3004/api/payments";

export async function initiatePayment(appointmentId) {
    const response = await fetch(
        `${PAYMENT_API_URL}/create/${appointmentId}`,
        {
            method: "POST",
            credentials: "include",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "Payment initiation failed"
        );
    }

    return result;
}

export async function verifyPayment(data) {
    const response = await fetch(
        `${PAYMENT_API_URL}/verify`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Payment verification failed"
        );
    }

    return result;
}
/* =========================
   BOOKING
========================= */

const BOOKING_API_URL = "http://localhost:3003/api/bookings";

export async function getMyBookings() {
    const response = await fetch(
        `${BOOKING_API_URL}/my`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to fetch bookings"
        );
    }

    return result;
}


export async function getBookingById(id) {
    const response = await fetch(
        `${BOOKING_API_URL}/${id}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to fetch booking"
        );
    }

    return result;
}

/* ====================
HOSPITAL DOCTORS 
======================*/

export async function createDoctor(data) {
    const response = await fetch(DOCTORS_API_URL, {
        method: "POST",
        credentials: "include",
        body: data,
    });

    const result = await response.json();

    if (!response.ok) {
        const validationMessage = result.errors?.[0]?.msg;

        throw new Error(
            result.message ||
            result.error ||
            validationMessage ||
            "Failed to create doctor"
        );
    }

    return result;
}

export async function getHospitalDoctors() {
    const response = await fetch(`${DOCTORS_API_URL}/hospital`, {
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || result.error || "Failed to fetch doctors");
    }

    return result;
}

export async function updateDoctor(id, data) {
    const response = await fetch(`${DOCTORS_API_URL}/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: data,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || result.error || "Failed to update doctor");
    }

    return result;
}

export async function deleteDoctor(id) {
    const response = await fetch(`${DOCTORS_API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || result.error || "Failed to delete doctor");
    }

    return result;
}

/* HOSPITAL APPOINTMENTS */

export async function getHospitalAppointments() {
    const response = await fetch(
        `${APPOINTMENTS_API_URL}/hospital/all`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "Failed to fetch hospital appointments"
        );
    }

    return result;
}


/* HOSPITAL BOOKINGS */

export async function getHospitalBookings() {
    const response = await fetch(
        `${BOOKING_API_URL}/hospital/all`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "Failed to fetch hospital bookings"
        );
    }

    return result;
}

/* HOSPITAL DASHBOARD */

const DASHBOARD_API_URL = "http://localhost:3007/api/dashboard";

export async function getDashboardStats() {
    const response = await fetch(`${DASHBOARD_API_URL}/stats`, {
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "Failed to fetch dashboard statistics"
        );
    }

    return result;
}

export async function getDashboardBookings() {
    const response = await fetch(`${DASHBOARD_API_URL}/bookings`, {
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "Failed to fetch dashboard bookings"
        );
    }

    return result;
}

export async function getDashboardDoctors() {
    const response = await fetch(`${DASHBOARD_API_URL}/doctors`, {
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "Failed to fetch dashboard doctors"
        );
    }

    return result;
}

export async function getDashboardRevenue() {
    const response = await fetch(`${DASHBOARD_API_URL}/revenue`, {
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "Failed to fetch revenue"
        );
    }

    return result;
}

