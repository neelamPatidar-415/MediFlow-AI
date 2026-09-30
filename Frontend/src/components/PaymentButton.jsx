import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    initiatePayment,
    verifyPayment,
} from "../services/api";

function PaymentButton({ appointment }) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handlePayment() {
        try {
            setLoading(true);
            setError("");

            // 1. Backend creates Razorpay order
            const result = await initiatePayment(
                appointment._id
            );

            const order = result.razorpayOrder;

            if (!order) {
                throw new Error(
                    "Razorpay order was not created"
                );
            }

            // 2. Open Razorpay Checkout
            if (!window.Razorpay) {
                throw new Error(
                    "Razorpay Checkout is not loaded."
                );
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,

                amount: order.amount,
                currency: order.currency,

                name: "PulsePilot",
                description: "Doctor Appointment",

                order_id: order.id,

                handler: async function (response) {
                    try {
                        setLoading(true);

                        // 3. Backend verifies Razorpay payment
                        const verification =
                            await verifyPayment({
                                razorpayOrderId:
                                    response.razorpay_order_id,

                                paymentId:
                                    response.razorpay_payment_id,

                                signature:
                                    response.razorpay_signature,
                            });

                        console.log(
                            "PAYMENT VERIFIED:",
                            verification
                        );

                        // Backend has created booking
                        // and handled appointment accordingly.
                        navigate("/bookings");

                    } catch (err) {
                        console.error(
                            "PAYMENT VERIFICATION ERROR:",
                            err
                        );

                        setError(
                            err.message ||
                            "Payment verification failed."
                        );

                        setLoading(false);
                    }
                },

                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    },
                },

                theme: {
                    color: "#0f766e",
                },
            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.on(
                "payment.failed",
                function () {
                    setError(
                        "Payment failed. Please try again."
                    );

                    setLoading(false);
                }
            );

            razorpay.open();

        } catch (err) {
            console.error("PAYMENT ERROR:", err);

            setError(
                err.message ||
                "Payment could not be started."
            );

            setLoading(false);
        }
    }

    return (
        <div className="payment-action">

            {error && (
                <p className="payment-error">
                    {error}
                </p>
            )}

            <button
                className="payment-button"
                onClick={handlePayment}
                disabled={loading}
            >
                {loading
                    ? "Processing..."
                    : `Pay ₹${appointment.price?.amount || ""}`}
            </button>

        </div>
    );
}

export default PaymentButton;