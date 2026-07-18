import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import AdminLayout from "../components/AdminLayout";
import { getAllContactMessages } from "../services/contactService";

function CustomerCare() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await getAllContactMessages();
      setMessages(response.messages);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Customer Care">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No contact messages found.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Subject</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Date</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((message) => (
                <tr
                  key={message._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{message.fullName}</td>

                  <td className="px-6 py-4">{message.email}</td>

                  <td className="px-6 py-4">{message.subject}</td>

                  <td className="px-6 py-4 text-center">
                    {message.isRead ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        Read
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                        New
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/admin/customer-care/${message._id}`}
                      className="rounded-lg bg-accent px-4 py-2 text-white transition hover:opacity-90"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default CustomerCare;