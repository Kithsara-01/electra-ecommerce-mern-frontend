import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaTrash,
  FaHeadset,
  FaUser,
  FaPaperPlane,
  FaEnvelope,
} from "react-icons/fa6";

import AdminLayout from "../components/AdminLayout";
import { useAdminNotification } from "../context/AdminNotificationContext";

import {
  getContactMessageById,
  markMessageAsRead,
  replyToContactMessage,
  deleteContactMessage,
} from "../services/contactService";

// Which side of the chat a reply renders on. This app's data uses a plain
// "Admin" sender label for staff replies — adjust here if that changes.
const isAdminReply = (reply) => reply.sender === "Admin";

function CustomerCareDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshNotifications } = useAdminNotification();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const threadEndRef = useRef(null);

  useEffect(() => {
    fetchMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [contact]);

  const fetchMessage = async () => {
    try {
      setLoading(true);

      await markMessageAsRead(id);

      const response = await getContactMessageById(id);

      setContact(response.message);

      // Marking as read changes the sidebar's unread count — refresh it
      // immediately instead of waiting for the background poll.
      refreshNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to load message.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const handleReplyKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sending) handleReply();
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
      setDeleting(true);

      await deleteContactMessage(id);

      refreshNotifications();

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
    } finally {
      setDeleting(false);
    }
  };

  // ---- Loading skeleton ----
  if (loading || !contact) {
    return (
      <AdminLayout title="Customer Care">
        <div className="space-y-6">
          <div className="h-9 w-24 animate-pulse rounded-md bg-slate-200" />
          <div className="h-20 animate-pulse rounded border border-slate-400 bg-slate-100" />
          <div className="h-80 animate-pulse rounded border border-slate-400 bg-slate-100" />
        </div>
      </AdminLayout>
    );
  }

  const status = contact.replies?.length > 0 ? "Replied" : "Waiting";
  const statusClass =
    status === "Replied"
      ? "bg-accent/10 text-accent"
      : "bg-amber-100 text-amber-700";

  const thread = [
    {
      key: "original",
      message: contact.message,
      createdAt: contact.createdAt,
      isAdmin: false,
    },
    ...(contact.replies || []).map((r, index) => ({
      key: `reply-${index}`,
      message: r.message,
      createdAt: r.createdAt,
      isAdmin: isAdminReply(r),
    })),
  ];

  return (
    <AdminLayout title="Customer Care">
      <div className="space-y-4">
        {/* Back + Delete */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-accent hover:text-accent"
          >
            <FaArrowLeft size={12} />
            Back
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaTrash size={12} />
            {deleting ? "Deleting..." : "Delete Message"}
          </button>
        </div>

        {/* Subject + customer info */}
        <div className="rounded border border-slate-400 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              {contact.subject}
            </h2>

            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
              {status}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <FaUser size={12} className="text-slate-400" />
              <span className="font-medium text-slate-900">{contact.fullName}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <FaEnvelope size={12} className="text-slate-400" />
              {contact.email}
            </div>

            <span className="text-slate-500">{formatDate(contact.createdAt)}</span>
          </div>
        </div>

        {/* Chat thread */}
        <div className="rounded border border-slate-400 bg-white">
          <div className="max-h-[55vh] space-y-4 overflow-y-auto px-5 py-6">
            {thread.map((item) => (
              <div
                key={item.key}
                className={`flex items-end gap-2 ${
                  item.isAdmin ? "justify-end" : "justify-start"
                }`}
              >
                {!item.isAdmin && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <FaUser size={13} />
                  </div>
                )}

                <div
                  className={`max-w-[75%] ${
                    item.isAdmin ? "text-right" : "text-left"
                  }`}
                >
                  {/* Sender name + role */}
                  <p
                    className={`mb-1 text-xs font-semibold ${
                      item.isAdmin ? "text-accent" : "text-slate-600"
                    }`}
                  >
                    {item.isAdmin ? "Admin — Support" : `${contact.fullName} — Customer`}
                  </p>

                  <div
                    className={`rounded-md border px-4 py-3 ${
                      item.isAdmin
                        ? "rounded-br-none border-accent bg-accent text-white"
                        : "rounded-bl-none border-slate-400 bg-slate-50 text-slate-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {item.message}
                    </p>

                    <p
                      className={`mt-1.5 text-right text-[11px] ${
                        item.isAdmin ? "text-white/70" : "text-slate-400"
                      }`}
                    >
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>

                {item.isAdmin && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <FaHeadset size={14} />
                  </div>
                )}
              </div>
            ))}

            <div ref={threadEndRef} />
          </div>

          {/* Reply composer */}
          <div className="border-t border-slate-400 p-4">
            <div className="flex items-end gap-3">
              <textarea
                rows={2}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={handleReplyKeyDown}
                placeholder="Type your reply... (Enter to send, Shift+Enter for a new line)"
                className="w-full flex-1 resize-none rounded-md border border-slate-400 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
              />

              <button
                onClick={handleReply}
                disabled={sending}
                className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaPaperPlane size={13} />
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default CustomerCareDetails;