import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "../../components/loader";

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        // Get token from localStorage (make sure admin login stores it)
        const token = localStorage.getItem("token");

        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/contact", {
          headers: {
            Authorization: `Bearer ${token}`, // send admin token
          },
        });

        setMessages(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }
    fetchMessages();
  }, []);

  return (
    <div className="w-full min-h-full">
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border border-secondary/10 bg-primary shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-secondary/10 px-6 py-4">
            <h1 className="text-lg font-semibold text-secondary">Contact Messages</h1>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {messages.length} messages
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <Loader />
            ) : (
              <table className="w-full min-w-[880px] text-left">
                <thead className="bg-secondary text-white">
                  <tr>
                    <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">Name</th>
                    <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">Email</th>
                    <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">Mobile</th>
                    <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">Message</th>
                    <th className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-secondary/10">
                  {messages.map((msg) => (
                    <tr key={msg._id} className="odd:bg-white even:bg-primary hover:bg-accent/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-secondary">
                        {msg.firstName} {msg.lastName}
                      </td>
                      <td className="px-4 py-3 font-medium text-secondary">{msg.email}</td>
                      <td className="px-4 py-3 font-medium text-secondary">{msg.mobile}</td>
                      <td className="px-4 py-3 font-medium text-secondary">{msg.message}</td>
                      <td className="px-4 py-3 font-medium text-secondary">
                        {new Date(msg.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr>
                      <td className="px-4 py-12 text-center text-secondary/60" colSpan={5}>
                        No messages to display.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
