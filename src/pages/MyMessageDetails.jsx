import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

import Header from "../components/Header";
import { useNotification } from "../context/NotificationContext";
import {getMyContactMessageById, replyToContactMessage,} from "../services/contactService";

function MyMessageDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loadUnreadReplyCount } = useNotification();

  const [contactMessage, setContactMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessage();
  }, [id]);

  const fetchMessage = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyContactMessageById(id);

      setContactMessage(response.message);

      await loadUnreadReplyCount();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load message.";

      setError(message);

      await Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
      });
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
    return Swal.fire({
      title: "Reply Required",
      text: "Please enter your reply.",
      icon: "warning",
      confirmButtonText: "OK",
    });
  }

  try {
    setSending(true);

    await replyToContactMessage(
      contactMessage._id,
      reply
    );

    setReply("");

    await fetchMessage();

    await Swal.fire({
      title: "Success",
      text: "Reply sent successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (err) {
    await Swal.fire({
      title: "Error",
      text:
        err.response?.data?.message ||
        "Failed to send reply.",
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    setSending(false);
  }
};

  const status =
    contactMessage?.replies?.length > 0 ? "Replied" : "Waiting";

  const statusClass =
    status === "Replied"
      ? "bg-accent/10 text-accent"
      : "bg-amber-100 text-amber-700";

  if (loading) {
    return (
      <>
        <Header showSearch={false} />

        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="rounded border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <svg
                className="h-8 w-8 animate-spin text-accent"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />

                <path
                  fill="currentColor"
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373
                  0 0 5.373 0 12h4zm2
                  5.291A7.962 7.962 0
                  014 12H0c0 3.042
                  1.135 5.824
                  3 7.938l3-2.647z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              Loading Conversation
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header showSearch={false} />

        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="rounded border border-rose-200 bg-rose-50 p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              Unable to load conversation
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {error}
            </p>

            <button
              onClick={() => navigate("/my-messages")}
              className="mt-6 rounded-md bg-accent px-5 py-2 text-white transition hover:opacity-90"
            >
              Back
            </button>
          </div>
        </div>
      </>
    );
  }
    return (
    <>
      <Header showSearch={false} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Customer Support
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Conversation
            </h1>
          </div>

          <button
            onClick={() => navigate("/my-messages")}
            className="rounded-md border border-accent bg-white px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-white"
          >
            Back
          </button>
        </div>

        {/* Original Message */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">
              {contactMessage.subject}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
            >
              {status}
            </span>
          </div>

          <div className="mb-3 text-sm text-slate-500">
            {formatDate(contactMessage.createdAt)}
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="whitespace-pre-wrap text-slate-700">
              {contactMessage.message}
            </p>
          </div>
        </div>

        {/* Replies */}

        {/* Reply Box */}

          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Send Reply
            </h2>

            <textarea
              rows={5}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply..."
              className="w-full rounded-lg border border-slate-300 p-4 outline-none transition focus:border-accent"
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleReply}
                disabled={sending}
                className="rounded-md bg-accent px-6 py-2.5 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Replies
          </h2>

          {contactMessage.replies?.length > 0 ? (
            <div className="space-y-4">
              {contactMessage.replies.map((reply, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-accent/20 bg-accent/5 p-5"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-accent">
                      {reply.sender}
                    </span>

                    <span className="text-xs text-slate-500">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap text-slate-700">
                    {reply.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <h3 className="text-lg font-semibold text-slate-800">
                No replies yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Our support team hasn't replied to your message yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyMessageDetails;