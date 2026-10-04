import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

function AdminOrders() {
const [orders, setOrders] = useState([]);

const [loading, setLoading] = useState(true);

const [updatingId, setUpdatingId] = useState(null);

const getAuthHeaders = () => {
const storedUser = JSON.parse(localStorage.getItem("user"));


return {
  Authorization: `Bearer ${storedUser?.token}`,
};


};

const fetchOrders = () => {
fetch("http://localhost:8080/api/orders", {
headers: getAuthHeaders(),
})
.then((response) => {
if (!response.ok) {
throw new Error("Failed to fetch orders");
}


    return response.json();
  })
  .then((data) => {
    setOrders(data);
    setLoading(false);
  })
  .catch((error) => {
    console.error("Error fetching orders:", error);
    setLoading(false);
  });


};

useEffect(() => {
fetchOrders();
}, []);

const updateStatus = async (id, status) => {
try {
setUpdatingId(id);


  const response = await fetch(
    `http://localhost:8080/api/orders/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        status: status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update order status");
  }

  const updatedOrder = await response.json();

  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === updatedOrder.id ? updatedOrder : order
    )
  );
} catch (error) {
  console.error("Error updating order status:", error);
  alert("Failed to update order status.");
} finally {
  setUpdatingId(null);
}


};

if (loading) {
return ( <main className="admin-orders-page"> <div className="admin-orders-loading"> <div className="admin-orders-spinner"></div>


      <h2>Loading orders...</h2>

      <p>Please wait while orders are loading.</p>
    </div>
  </main>
);


}

return ( <main className="admin-orders-page"> <div className="admin-orders-header"> <div> <span className="admin-orders-label">SHOPNOW ADMIN</span>


      <h1>Orders</h1>

      <p>Manage customer orders from your store.</p>
    </div>

    <button
      className="refresh-orders-button"
      onClick={fetchOrders}
    >
      ↻ Refresh
    </button>
  </div>

  {orders.length === 0 ? (
    <div className="no-orders">
      <div className="no-orders-icon">🛒</div>

      <h2>No Orders Found</h2>

      <p>There are no customer orders yet.</p>
    </div>
  ) : (
    <div className="orders-table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <strong>#{order.id}</strong>
              </td>

              <td>
                <strong>{order.fullName}</strong>
              </td>

              <td>{order.email}</td>

              <td>{order.phone}</td>

              <td>{order.city}</td>

              <td>{order.paymentMethod}</td>

              <td>
                <strong>
                  ${Number(order.totalPrice || 0).toFixed(2)}
                </strong>
              </td>

              <td>
                <select
                  className={`order-status-select status-${(
                    order.status || "Pending"
                  )
                    .toLowerCase()
                    .replace(/\s+/g, "-")}
                  `}
                  value={order.status || "Pending"}
                  disabled={updatingId === order.id}
                  onChange={(event) =>
                    updateStatus(order.id, event.target.value)
                  }
                >
                  <option value="Pending">Pending</option>

                  <option value="Processing">Processing</option>

                  <option value="Shipped">Shipped</option>

                  <option value="Delivered">Delivered</option>
                </select>
              </td>

              <td>
                <Link
                  to={`/admin/orders/${order.id}`}
                  className="view-order-button"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</main>


);
}

export default AdminOrders;
