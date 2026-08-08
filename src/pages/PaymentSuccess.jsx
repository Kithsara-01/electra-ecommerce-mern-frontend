import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

import { completePaymentOrder } from "../services/paymentService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Prevent duplicate API calls
  const processed = useRef(false);

  useEffect(() => {
    const completeOrder = async () => {
      if (processed.current) return;
      processed.current = true;

      try {
        const pendingOrder = JSON.parse(
          localStorage.getItem("pendingOrder")
        );

        if (!pendingOrder) {
          throw new Error("Pending order not found.");
        }

        await completePaymentOrder({
          ...pendingOrder,

          paymentMethod: "PayHere",
          paymentStatus: "Paid",

          transactionId:
            searchParams.get("payment_id") ||
            searchParams.get("payhere_payment_id") ||
            "",

          paidAt: new Date(),
        });

        localStorage.removeItem("pendingOrder");

        await Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: "Your order has been placed successfully.",
          confirmButtonColor: "#2FA084",
        });

        navigate("/my-orders");
      } catch (error) {
        console.error(error);

        await Swal.fire({
          icon: "error",
          title: "Payment Error",
          text:
            error.response?.data?.message ||
            error.message ||
            "Failed to complete your order.",
          confirmButtonColor: "#2FA084",
        });

        navigate("/checkout");
      }
    };

    completeOrder();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-2xl font-semibold">
        Completing your payment...
      </h2>
    </div>
  );
};

export default PaymentSuccess;