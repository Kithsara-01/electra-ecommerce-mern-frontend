import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

import AdminLayout from "../components/AdminLayout";

import {
  getContactMessageById,
  markMessageAsRead,
  replyToContactMessage,
  deleteContactMessage,
} from "../services/contactService";

function CustomerCareDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessage();
  }, [id]);

  const fetchMessage = async () => {
    try {
      await markMessageAsRead(id);

      const response = await getContactMessageById(id);

      setContact(response.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load message.");
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) {
      return toast.error("Please enter a reply.");
    }

    try {
      setSending(true);

      await replyToContactMessage(id, reply);

      toast.success("Reply sent successfully.");

      setReply("");

      await fetchMessage();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Delete Message?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            focusCancel: true,
        });

        if (!result.isConfirmed) return;

        try {
            await deleteContactMessage(id);

            await Swal.fire({
            title: "Deleted!",
            text: "The message has been deleted successfully.",
            icon: "success",
            confirmButtonColor: "#2FA084",
            });

            navigate("/admin/customer-care");
        } catch (error) {
            console.error(error);

            Swal.fire({
            title: "Error",
            text: "Failed to delete message.",
            icon: "error",
            confirmButtonColor: "#dc2626",
            });
        }
        };

  if (!contact) {
    return (
      <AdminLayout title="Customer Care">
        <div className="py-10 text-center">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Customer Care">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-6 text-2xl font-bold">{contact.subject}</h2>

        <div className="space-y-2">
          <p>
            <strong>Name :</strong> {contact.fullName}
          </p>

          <p>
            <strong>Email :</strong> {contact.email}
          </p>

          <p>
            <strong>Message :</strong>
          </p>

          <div className="rounded bg-gray-100 p-4">
            {contact.message}
          </div>
        </div>

        <hr className="my-8" />

        <h3 className="mb-4 text-xl font-semibold">
          Conversation
        </h3>

        <div className="space-y-4">
          {contact.replies?.length === 0 ? (
            <p className="text-gray-500">
              No replies yet.
            </p>
          ) : (
            contact.replies?.map((reply, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 ${
                  reply.sender === "Admin"
                    ? "bg-accent text-white"
                    : "bg-gray-100"
                }`}
              >
                <p className="font-semibold">
                  {reply.sender}
                </p>

                <p>{reply.message}</p>
              </div>
            ))
          )}
        </div>

        <hr className="my-8" />

        <textarea
          rows="5"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply..."
          className="w-full rounded-lg border p-4 outline-none focus:border-accent"
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleReply}
            disabled={sending}
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Reply"}
          </button>

          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Delete Message
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default CustomerCareDetails;