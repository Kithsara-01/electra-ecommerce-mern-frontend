import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

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

  if (loading) {
    return (
      <>
        <Header showSearch={false} />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <svg
                className="h-8 w-8 animate-spin text-accent"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0
                  12h4zm2 5.291A7.962 7.962 0
                  014 12H0c0 3.042 1.135
                  5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              Loading your messages
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we fetch your messages.
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

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded border border-rose-200 bg-rose-50 p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              Unable to load messages
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>
          </div>
        </div>
      </>
    );
  }

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
          </div>
        </div>
      </>
    );
  }
    return (
    <>
      <Header showSearch={false} />

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

          <div className="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
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
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                          <span className="inline-flex rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
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

                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        navigate(`/my-messages/${item._id}`)
                      }
                      className="cursor-pointer rounded-md border border-accent bg-white px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
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
    </>
  );
}

export default MyMessages;