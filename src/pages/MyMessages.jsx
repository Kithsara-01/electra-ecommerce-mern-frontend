import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { FaCircleExclamation, FaEnvelope, FaRotateRight } from "react-icons/fa6";

import Header from "../components/Header";
import { useNotification } from "../context/NotificationContext";
import { getMyContactMessages } from "../services/contactService";

function MyMessages() {
  const navigate = useNavigate();
  const { loadUnreadReplyCount } = useNotification();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyContactMessages();

      setMessages(response.messages || []);
      await loadUnreadReplyCount();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load your messages.";

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

    return new Date(value).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatus = (message) => {
    return message.replies?.length > 0 ? "Replied" : "Waiting";
  };

  const statusStyles = {
    Waiting: "bg-amber-100 text-amber-700",
    Replied: "bg-accent/10 text-accent",
  };

  // ---- Loading state ----
  if (loading) {
    return (
      <>
        <Header showSearch={false} />

        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-accent"></div>

            <p className="text-sm text-slate-600">
              Loading messages...
            </p>
          </div>
        </div>
      </>
    );
  }

  // ---- Error state ----
  if (error) {
    return (
      <>
        <Header showSearch={false} />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded border border-rose-200 bg-rose-50 p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <FaCircleExclamation className="h-7 w-7 text-rose-600" />
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              Unable to load messages
            </h2>

            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <button
              onClick={fetchMessages}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-md border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100"
            >
              <FaRotateRight size={13} />
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  // ---- Empty state ----
  if (messages.length === 0) {
    return (
      <>
        <Header showSearch={false} />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <svg
                className="h-8 w-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h8M8 14h5m7
                  5H4a2 2 0 01-2-2V7a2 2
                  0 012-2h16a2 2 0 012
                  2v10a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              No messages yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Messages you send from the Contact page will appear here.
            </p>

            <button
              onClick={() => navigate("/contact")}
              className="mt-5 cursor-pointer rounded-md border border-accent bg-white px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
            >
              Go to Contact Page
            </button>
          </div>
        </div>
      </>
    );
  }

  // ---- Messages list ----
  return (
    <>
      <Header showSearch={false} />

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              My Messages
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Customer Support
            </h1>
          </div>

          <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
            {messages.length} {messages.length === 1 ? "Message" : "Messages"}
          </div>
        </div>

        <div className="space-y-4">
          {messages.map((item) => {
            const status = getStatus(item);
            const statusClass =
              statusStyles[status] || "bg-slate-100 text-slate-700";

            return (
              <div
                key={item._id}
                className="rounded border border-slate-200 bg-white p-5 transition-colors hover:border-accent"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent sm:flex">
                      <FaEnvelope size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h2 className="truncate text-lg font-semibold text-slate-900">
                          {item.subject}
                        </h2>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                          >
                            {status}
                          </span>

                          {item.hasUnreadAdminReply && (
                            <span className="inline-flex rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">
                              New Reply
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                        {item.message}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-500">
                        <span>
                          <strong className="text-slate-700">Date :</strong>{" "}
                          {formatDate(item.createdAt)}
                        </span>

                        <span>
                          <strong className="text-slate-700">Replies :</strong>{" "}
                          {item.replies?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center lg:pl-4">
                    <button
                      onClick={() => navigate(`/my-messages/${item._id}`)}
                      className="w-full cursor-pointer rounded-md border border-accent bg-white px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white lg:w-auto"
                    >
                      View Conversation
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </>
  );
}

export default MyMessages;