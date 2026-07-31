const sendEmail = require("../email");
const { subscribeToQueue } = require("./broker");

module.exports = function () {

    /*                           USER REGISTRATION                                */

    subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data) => {

        const emailHTMLTemplate = `
            <h2>Welcome to MediFlow AI!</h2>

            <p>Dear <b>${data.fullName}</b>,</p>

            <p>Thank you for registering with <b>MediFlow AI</b>.</p>

            <p>You can now search doctors, book appointments, and manage your healthcare seamlessly.</p>

            <br/>

            <p>Stay Healthy,<br/>
            <b>Team MediFlow AI</b></p>
        `;

        await sendEmail(
            data.email,
            "Welcome to MediFlow AI",
            "Thank you for registering with MediFlow AI.",
            emailHTMLTemplate
        );

    });


    /*                          APPOINTMENT BOOKED                                */

    subscribeToQueue("APPOINTMENT_NOTIFICATION.APPOINTMENT_BOOKED", async (data) => {

        const emailHTMLTemplate = `
            <h2>Appointment Confirmed</h2>

            <p>Dear <b>${data.patientName}</b>,</p>

            <p>Your appointment has been successfully booked.</p>

            <ul>
                <li><b>Doctor:</b> ${data.doctorName}</li>
                <li><b>Specialization:</b> ${data.specialization}</li>
                <li><b>Date:</b> ${data.date}</li>
                <li><b>Time:</b> ${data.slot}</li>
                <li><b>Hospital:</b> ${data.hospitalName}</li>
            </ul>

            <p>Thank you for choosing MediFlow AI.</p>

            <br/>

            <p><b>Team MediFlow AI</b></p>
        `;

        await sendEmail(
            data.email,
            "Appointment Confirmed",
            "Your appointment has been booked successfully.",
            emailHTMLTemplate
        );

    });


    /*                           PAYMENT SUCCESS                                  */

    subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETED", async (data) => {

        const emailHTMLTemplate = `
            <h2>Payment Successful</h2>

            <p>Dear <b>${data.patientName}</b>,</p>

            <p>Your payment has been received successfully.</p>

            <ul>
                <li><b>Amount:</b> ₹${data.amount}</li>
                <li><b>Payment ID:</b> ${data.paymentId}</li>
            </ul>

            <p>Your appointment is now confirmed.</p>

            <br/>

            <p>Thank you for using <b>MediFlow AI</b>.</p>
        `;

        await sendEmail(
            data.email,
            "Payment Successful",
            "Your payment has been completed successfully.",
            emailHTMLTemplate
        );

    });


    /*                            PAYMENT FAILED                                  */

    subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_FAILED", async (data) => {

        const emailHTMLTemplate = `
            <h2>Payment Failed</h2>

            <p>Dear <b>${data.patientName}</b>,</p>

            <p>Unfortunately, we could not process your payment.</p>

            <ul>
                <li><b>Payment ID:</b> ${data.paymentId}</li>
                <li><b>Amount:</b> ₹${data.amount}</li>
            </ul>

            <p>Please try again later or choose another payment method.</p>

            <br/>

            <p><b>Team MediFlow AI</b></p>
        `;

        await sendEmail(
            data.email,
            "Payment Failed",
            "Your payment could not be processed.",
            emailHTMLTemplate
        );

    });

};