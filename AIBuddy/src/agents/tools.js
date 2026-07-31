const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

/*                           Search Doctors Tool                              */

const searchDoctorsTool = tool(
    async ({ query, token }) => {
        try {
            const response = await axios.get(
                `http://localhost:3001/api/doctors?search=${encodeURIComponent(query)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return JSON.stringify(response.data);

        } catch (err) {
            return `Unable to search doctors: ${
                err.response?.data?.message || err.message
            }`;
        }
    },
    {
        name: "search_doctors",
        description:
            "Search doctors by specialization, symptoms, hospital name, city, or doctor name. Returns doctor details including availability, consultation fee, experience, hospital, rating and available slots.",
        schema: z.object({
            query: z.string().describe("Doctor search query"),
        }),
    }
);

/*                           Book Appointment Tool                            */

const bookAppointmentTool = tool(
    async ({ doctorId, date, slot, token }) => {
        try {

            const response = await axios.post(
                "http://localhost:3002/api/appointments",
                {
                    doctorId,
                    date,
                    slot,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return JSON.stringify(response.data);

        } catch (err) {
            return `Unable to book appointment: ${
                err.response?.data?.message || err.message
            }`;
        }
    },
    {
        name: "book_appointment",
        description:
            "Book an appointment with a doctor using doctor ID, appointment date and available time slot.",
        schema: z.object({
            doctorId: z.string().describe("Doctor ID"),
            date: z.string().describe("Appointment date (YYYY-MM-DD)"),
            slot: z.string().describe("Available time slot"),
        }),
    }
);

/*                        View My Appointments Tool                           */

const viewAppointmentsTool = tool(
    async ({ token }) => {
        try {

            const response = await axios.get(
                "http://localhost:3002/api/appointments/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return JSON.stringify(response.data);

        } catch (err) {
            return `Unable to fetch appointments: ${
                err.response?.data?.message || err.message
            }`;
        }
    },
    {
        name: "view_my_appointments",
        description:
            "Retrieve all appointments of the currently logged in patient.",
        schema: z.object({}),
    }
);

module.exports = {
    search_doctors: searchDoctorsTool,
    book_appointment: bookAppointmentTool,
    view_my_appointments: viewAppointmentsTool,
};