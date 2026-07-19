import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaHeadset, FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

import AdminLayout from "../components/AdminLayout";
import { getAllContactMessages } from "../services/contactService";

const FILTERS = ["All", "New", "Read"];

function CustomerCare() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await getAllContactMessages();
      setMessages(response.messages || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load messages.");
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

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages]
  );

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "New" && !message.isRead) ||
        (filter === "Read" && message.isRead);

      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        message.fullName?.toLowerCase().includes(query) ||
        message.email?.toLowerCase().includes(query) ||
        message.subject?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [messages, filter, searchTerm]);

  const clearSearch = () => setSearchTerm("");

  // ---- Loading skeleton ----
  if (loading) {
    return (
      <AdminLayout title="Customer Care">
        <div className="space-y-6">
          <div className="h-6 w-80 animate-pulse rounded bg-slate-200" />
          <div className="h-16 animate-pulse rounded border border-slate-200 bg-slate-100" />
          <div className="h-96 animate-pulse rounded border border-slate-200 bg-slate-100" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Customer Care">
      <div className="space-y-6">
        {/* Page intro — AdminLayout's header already shows the title */}
        <p className="text-sm text-slate-500">
          View and respond to messages submitted through the Contact page.
        </p>

        {unreadCount > 0 && (
          <div className="flex items-center gap-3 rounded border border-amber-200 bg-amber-50 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600">
              <FaHeadset size={14} />
            </span>
            <p className="text-sm font-medium text-amber-800">
              {unreadCount} new message{unreadCount > 1 ? "s" : ""} waiting for a reply.
            </p>
          </div>
        )}

        {/* Search + Filters */}
        <div className="rounded border border-slate-200 bg-white p-4 sm:p-5">
          <div className="relative">
            <FaMagnifyingGlass
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by name, email or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search messages"
              className="w-full rounded-md border border-slate-200 py-2.5 pl-10 pr-9 text-sm text-slate-900 outline-none transition-colors focus:border-accent"
            />

            {searchTerm && (
              <button
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
              >
                <FaXmark size={14} />
              </button>
            )}
          </div>

          <div className="mt-4 inline-flex flex-wrap gap-1 rounded-md border border-slate-200 bg-slate-50 p-1">
            {FILTERS.map((item) => {
              const count = item === "New" ? unreadCount : null;
              const isActive = filter === item;

              return (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  aria-pressed={isActive}
                  className={`flex cursor-pointer items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border border-accent bg-white text-accent"
                      : "border border-transparent text-slate-600 hover:text-accent"
                  }`}
                >
                  {item}
                  {count > 0 && (
                    <span
                      className={`flex h-5 min-w-[20px] items-center justify-center rounded px-1 text-[11px] font-bold ${
                        isActive ? "bg-accent text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages Table */}
        <div className="overflow-hidden rounded border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-center">Date</th>
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                          <FaHeadset size={18} />
                        </span>
                        <p className="text-sm font-medium text-slate-700">
                          No messages found
                        </p>
                        <p className="text-xs text-slate-500">
                          {searchTerm || filter !== "All"
                            ? "Try adjusting your search or filter."
                            : "Customer messages will appear here."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((message) => (
                    <tr
                      key={message._id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        {message.fullName}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {message.email}
                      </td>

                      <td className="max-w-[220px] truncate px-5 py-4 text-sm text-slate-700">
                        {message.subject}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1 text-xs font-medium">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              message.isRead ? "bg-accent" : "bg-rose-500"
                            }`}
                          ></span>
                          <span
                            className={
                              message.isRead ? "text-accent" : "text-rose-700"
                            }
                          >
                            {message.isRead ? "Read" : "New"}
                          </span>
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center text-sm text-slate-700">
                        {formatDate(message.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <Link
                          to={`/admin/customer-care/${message._id}`}
                          className="inline-flex cursor-pointer items-center rounded-md border border-accent bg-white px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default CustomerCare;