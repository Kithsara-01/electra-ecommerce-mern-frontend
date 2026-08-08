import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      icon: "warning",
      title: "Payment Cancelled",
      text: "You cancelled the payment.",
      confirmButtonColor: "#2FA084",
    }).then(() => {
      navigate("/checkout");
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-2xl font-bold text-yellow-500">
        Payment Cancelled...
      </h2>
    </div>
  );
};

export default PaymentCancel;