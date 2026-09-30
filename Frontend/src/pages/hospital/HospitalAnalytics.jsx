import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import {
    getDashboardStats,
    getDashboardBookings,
    getDashboardDoctors,
} from "../../services/api";

function HospitalAnalytics() {
    const [stats, setStats] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const [statsResult, bookingsResult, doctorsResult] =
                await Promise.all([
                    getDashboardStats(),
                    getDashboardBookings(),
                    getDashboardDoctors(),
                ]);

            setStats(statsResult);
            setBookings(bookingsResult.bookings || []);
            setDoctors(doctorsResult.doctors || []);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="page-message">
                <h2>Loading analytics...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="hospital-page">
                <div className="auth-error">
                    {error}
                </div>
            </div>
        );
    }

    const appointmentStatusData = [
        {
            name: "Completed",
            value: stats?.completedBookings || 0,
        },
        {
            name: "Cancelled",
            value: stats?.cancelledBookings || 0,
        },
        {
            name: "Confirmed",
            value:
                Math.max(
                    0,
                    (stats?.totalBookings || 0) -
                    (stats?.completedBookings || 0) -
                    (stats?.cancelledBookings || 0)
                ),
        },
    ];

    const doctorBookingCount = {};

    bookings.forEach((booking) => {
        const name = booking.doctorName || "Unknown Doctor";

        doctorBookingCount[name] =
            (doctorBookingCount[name] || 0) + 1;
    });

    const topDoctors = Object.entries(doctorBookingCount)
        .map(([name, appointments]) => ({
            name,
            appointments,
        }))
        .sort((a, b) => b.appointments - a.appointments)
        .slice(0, 5);

    const totalRevenue = stats?.totalRevenue?.amount || 0;

    return (
        <div className="hospital-page">

            {/* HEADER */}

            <div className="hospital-page-header">
                <div>
                    <h1>Hospital Analytics</h1>
                    <p>
                        Overview of your hospital's activity and performance.
                    </p>
                </div>
            </div>


            {/* KPI CARDS */}

            <div className="analytics-kpi-grid">

                <div className="analytics-kpi-card">
                    <span>Total Doctors</span>
                    <strong>{stats?.totalDoctors || 0}</strong>
                </div>

                <div className="analytics-kpi-card">
                    <span>Today's Appointments</span>
                    <strong>{stats?.todayBookings || 0}</strong>
                </div>

                <div className="analytics-kpi-card">
                    <span>Total Bookings</span>
                    <strong>{stats?.totalBookings || 0}</strong>
                </div>

                <div className="analytics-kpi-card">
                    <span>Total Revenue</span>
                    <strong>
                        ₹{totalRevenue.toLocaleString("en-IN")}
                    </strong>
                </div>

            </div>


            {/* CHARTS */}

            <div className="analytics-chart-grid">

                {/* STATUS */}

                <div className="analytics-card">

                    <div className="analytics-card-header">
                        <h2>Appointment Status</h2>
                        <p>Booking distribution</p>
                    </div>

                    <div className="analytics-chart">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>

                                <Pie
                                    data={appointmentStatusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={95}
                                    label
                                >
                                    {appointmentStatusData.map(
                                        (entry, index) => (
                                            <Cell key={index} />
                                        )
                                    )}
                                </Pie>

                                <Tooltip />
                                <Legend />

                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                </div>


                {/* TOP DOCTORS */}

                <div className="analytics-card">

                    <div className="analytics-card-header">
                        <h2>Top Doctors</h2>
                        <p>Doctors with the most bookings</p>
                    </div>

                    <div className="analytics-chart">

                        {topDoctors.length === 0 ? (
                            <div className="analytics-empty">
                                No booking data available.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topDoctors}>

                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12 }}
                                    />

                                    <YAxis allowDecimals={false} />

                                    <Tooltip />

                                    <Bar
                                        dataKey="appointments"
                                        name="Bookings"
                                        radius={[6, 6, 0, 0]}
                                    />

                                </BarChart>
                            </ResponsiveContainer>
                        )}

                    </div>

                </div>

            </div>


            {/* HOSPITAL SUMMARY */}

            <div className="analytics-card analytics-summary">

                <div className="analytics-card-header">
                    <h2>Hospital Summary</h2>
                    <p>Current operational numbers</p>
                </div>

                <div className="analytics-summary-grid">

                    <div>
                        <span>Completed</span>
                        <strong>
                            {stats?.completedBookings || 0}
                        </strong>
                    </div>

                    <div>
                        <span>Cancelled</span>
                        <strong>
                            {stats?.cancelledBookings || 0}
                        </strong>
                    </div>

                    <div>
                        <span>Active Doctors</span>
                        <strong>
                            {
                                doctors.filter(
                                    (doctor) => doctor.isAvailable
                                ).length
                            }
                        </strong>
                    </div>

                    <div>
                        <span>Registered Doctors</span>
                        <strong>
                            {doctors.length}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default HospitalAnalytics;