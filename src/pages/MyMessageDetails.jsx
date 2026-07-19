import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { FaHeadset, FaUser, FaPaperPlane, FaCircleExclamation, FaRotateRight } from "react-icons/fa6";

import Header from "../components/Header";
import { useNotification } from "../context/NotificationContext";
import { getMyContactMessageById, replyToContactMessage } from "../services/contactService";

// Heuristic for telling a support reply apart from the customer's own
// follow-up in the same thread. Checks the common field names a backend
// might use (isAdmin / role / senderRole) and falls back to matching the
// sender label. If your API uses a different field, this is the only
// place that needs to change.
const isAdminReply = (reply) =>
  reply.isAdmin === true ||
  reply.role === "admin" ||
  reply.senderRole === "admin" ||
  /admin|support|team/i.test(reply.sender || "");

function MyMessageDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loadUnreadReplyCount } = useNotification();

  const [contactMessage, setContactMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const threadEndRef = useRef(null);

  useEffect(() => {
    fetchMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // Auto-scroll to the latest message, like a chat app.
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [contactMessage]);

  const fetchMessage = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyContactMessageById(id);

      setContactMessage(response.message);

      await loadUnreadReplyCount();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load message.";

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

      await replyToContactMessage(contactMessage._id, reply);

      setReply("");

      await fetchMessage();
    } catch (err) {
      await Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to send reply.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSending(false);
    }
  };

  const handleReplyKeyDown = (e) => {
    // Enter sends, Shift+Enter makes a new line — standard chat-app behavior.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sending) handleReply();
    }
  };

  const status = contactMessage?.replies?.length > 0 ? "Replied" : "Waiting";

  const statusClass =
    status === "Replied"
      ? "bg-accent/10 text-accent"
      : "bg-amber-100 text-amber-700";

  const hasUnread = Boolean(contactMessage?.hasUnreadAdminReply);

  // ---- Loading state ----
  if (loading) {
    return (
      <>
        <Header showSearch={false} />

        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="rounded border border-slate-300 bg-white p-10 text-center">
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

            <p className="mt-2 text-sm text-slate-500">Please wait...</p>
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

        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="rounded border border-rose-300 bg-rose-50 p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <FaCircleExclamation className="h-7 w-7 text-rose-600" />
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              Unable to load conversation
            </h2>

            <p className="mt-2 text-sm text-slate-600">{error}</p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={fetchMessage}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100"
              >
                <FaRotateRight size={13} />
                Try Again
              </button>

              <button
                onClick={() => navigate("/my-messages")}
                className="cursor-pointer rounded-md border border-accent bg-white px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Build one chronological chat thread: the original message first,
  // then every reply, each tagged with who sent it so it can render as a
  // WhatsApp-style bubble on the correct side.
  const thread = [
    {
      key: "original",
      message: contactMessage.message,
      createdAt: contactMessage.createdAt,
      isAdmin: false,
    },
    ...(contactMessage.replies || []).map((r, index) => ({
      key: `reply-${index}`,
      message: r.message,
      createdAt: r.createdAt,
      sender: r.sender,
      isAdmin: isAdminReply(r),
    })),
  ];

  return (
    <>
      <Header showSearch={false} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Customer Support
            </p>

            <div className="mt-1 flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-900">Conversation</h1>

              {/* Unread notification dot — mirrors the "New Reply" badge on
                  the messages list, so the same visual language carries
                  through into the thread itself. */}
              {hasUnread && (
                <span
                  className="relative flex h-3 w-3"
                  title="You have an unread reply"
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/my-messages")}
            className="cursor-pointer rounded-md border border-accent bg-white px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          >
            Back
          </button>
        </div>

        {/* Subject + status */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded border border-slate-300 bg-white px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-900">
              {contactMessage.subject}
            </h2>
            <p className="text-xs text-slate-500">
              Started {formatDate(contactMessage.createdAt)}
            </p>
          </div>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
            {status}
          </span>
        </div>

        {/* Chat thread */}
        <div className="rounded border border-slate-300 bg-white">
          <div className="max-h-[55vh] space-y-4 overflow-y-auto px-5 py-6">
            {thread.map((item) => (
              <div
                key={item.key}
                className={`flex items-end gap-2 ${
                  item.isAdmin ? "justify-start" : "justify-end"
                }`}
              >
                {item.isAdmin && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <FaHeadset size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[75%] ${
                    item.isAdmin ? "text-left" : "text-right"
                  }`}
                >
                  {/* Sender name + role */}
                  <p
                    className={`mb-1 text-xs font-semibold ${
                      item.isAdmin ? "text-slate-600" : "text-accent"
                    }`}
                  >
                    {item.isAdmin ? "Admin — Support" : "You — Customer"}
                  </p>

                  <div
                    className={`rounded-md border px-4 py-3 ${
                      item.isAdmin
                        ? "rounded-bl-none border-slate-300 bg-slate-50 text-slate-800"
                        : "rounded-br-none border-accent bg-accent text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {item.message}
                    </p>

                    <p
                      className={`mt-1.5 text-right text-[11px] ${
                        item.isAdmin ? "text-slate-400" : "text-white/70"
                      }`}
                    >
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>

                {!item.isAdmin && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <FaUser size={13} />
                  </div>
                )}
              </div>
            ))}

            <div ref={threadEndRef} />
          </div>

          {/* Reply composer */}
          <div className="border-t border-slate-300 p-4">
            <div className="flex items-end gap-3">
              <textarea
                rows={2}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={handleReplyKeyDown}
                placeholder="Write your reply... (Enter to send, Shift+Enter for a new line)"
                className="w-full flex-1 resize-none rounded-md border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
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
    </>
  );
}

export default MyMessageDetails;