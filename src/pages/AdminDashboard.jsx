import AdminLayout from "../components/AdminLayout";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaDollarSign,
} from "react-icons/fa";

function AdminDashboard() {
  const cards = [
    {
      title: "Users",
      value: "0",
      icon: <FaUsers size={24} />,
    },
    {
      title: "Products",
      value: "0",
      icon: <FaBoxOpen size={24} />,
    },
    {
      title: "Orders",
      value: "0",
      icon: <FaShoppingCart size={24} />,
    },
    {
      title: "Revenue",
      value: "Rs. 0",
      icon: <FaDollarSign size={24} />,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-3xl font-bold">
            Welcome Back 
          </h1>

          <p className="text-gray-500 mt-2">
            Here's what's happening in your store today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {card.value}
                  </h2>
                </div>

                <div className="text-accent">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        


      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;