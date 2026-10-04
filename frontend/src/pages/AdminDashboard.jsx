import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
const [orders, setOrders] = useState([]);
const [products, setProducts] = useState([]);
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const fetchDashboardData = async () => {
try {
setLoading(true);
setError("");


  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser?.token) {
    throw new Error("Authentication token not found");
  }

  const headers = {
    Authorization: `Bearer ${storedUser.token}`,
  };

  const [
    ordersResponse,
    productsResponse,
    usersResponse,
  ] = await Promise.all([
    fetch("http://localhost:8080/api/orders", {
      headers,
    }),
    fetch("http://localhost:8080/api/products", {
      headers,
    }),
    fetch("http://localhost:8080/api/users", {
      headers,
    }),
  ]);

  if (
    !ordersResponse.ok ||
    !productsResponse.ok ||
    !usersResponse.ok
  ) {
    throw new Error("Failed to fetch dashboard data");
  }

  const ordersData = await ordersResponse.json();
  const productsData = await productsResponse.json();
  const usersData = await usersResponse.json();

  setOrders(ordersData);
  setProducts(productsData);
  setUsers(usersData);
} catch (error) {
  console.error("Error fetching dashboard data:", error);
  setError(
    "We couldn't load the dashboard data. Please try again."
  );
} finally {
  setLoading(false);
}


};

useEffect(() => {
fetchDashboardData();
}, []);

const totalSales = orders.reduce((total, order) => {
if (order.status === "Cancelled") {
return total;
}


return total + Number(order.totalPrice || 0);


}, 0);

const pendingOrders = orders.filter(
(order) => order.status === "Pending"
).length;

const processingOrders = orders.filter(
(order) => order.status === "Processing"
).length;

const shippedOrders = orders.filter(
(order) => order.status === "Shipped"
).length;

const deliveredOrders = orders.filter(
(order) => order.status === "Delivered"
).length;

const cancelledOrders = orders.filter(
(order) => order.status === "Cancelled"
).length;

const lowStockProducts = products.filter(
(product) =>
Number(product.stock) > 0 &&
Number(product.stock) <= 3
);

const outOfStockProducts = products.filter(
(product) => Number(product.stock) === 0
);

const recentOrders = [...orders]
.sort((a, b) => Number(b.id) - Number(a.id))
.slice(0, 5);

if (loading) {
return ( <main className="admin-dashboard-page"> <div className="admin-dashboard-loading"> <div className="admin-dashboard-spinner"></div> <h2>Loading dashboard...</h2> <p>
Please wait while we load your store data. </p> </div> </main>
);
}

if (error) {
return ( <main className="admin-dashboard-page"> <div className="admin-dashboard-loading dashboard-error"> <div className="dashboard-error-icon">!</div> <h2>Something went wrong</h2> <p>{error}</p>


      <button
        className="refresh-dashboard-button"
        onClick={fetchDashboardData}
      >
        Try Again
      </button>
    </div>
  </main>
);


}

return ( <main className="admin-dashboard-page"> <div className="admin-dashboard-header"> <div> <span className="admin-dashboard-label">
SHOPNOW ADMIN </span>


      <h1>Admin Dashboard</h1>

      <p>
        Manage your online store and monitor your
        business activity.
      </p>
    </div>

    <div className="admin-dashboard-header-actions">
      <button
        className="refresh-dashboard-button"
        onClick={fetchDashboardData}
      >
        ↻ Refresh
      </button>

      <Link
        to="/admin/users"
        className="view-all-orders-button"
      >
        Manage Users
      </Link>

      <Link
        to="/admin/orders"
        className="view-all-orders-button"
      >
        View Orders
      </Link>
    </div>
  </div>

  <div className="dashboard-cards">
    <div className="dashboard-card dashboard-card-orders">
      <div className="dashboard-card-icon">
        🛒
      </div>

      <div>
        <h3>Total Orders</h3>
        <p>{orders.length}</p>
      </div>
    </div>

    <div className="dashboard-card dashboard-card-products">
      <div className="dashboard-card-icon">
        📦
      </div>

      <div>
        <h3>Total Products</h3>
        <p>{products.length}</p>
      </div>
    </div>

    <div className="dashboard-card dashboard-card-users">
      <div className="dashboard-card-icon">
        👥
      </div>

      <div>
        <h3>Total Users</h3>
        <p>{users.length}</p>
      </div>
    </div>

    <div className="dashboard-card dashboard-card-sales">
      <div className="dashboard-card-icon">
        $
      </div>

      <div>
        <h3>Total Sales</h3>
        <p>${totalSales.toFixed(2)}</p>
      </div>
    </div>

    <div className="dashboard-card dashboard-card-pending">
      <div className="dashboard-card-icon">
        ⏳
      </div>

      <div>
        <h3>Pending Orders</h3>
        <p>{pendingOrders}</p>
      </div>
    </div>

    <div className="dashboard-card dashboard-card-cancelled">
      <div className="dashboard-card-icon">
        ✕
      </div>

      <div>
        <h3>Cancelled Orders</h3>
        <p>{cancelledOrders}</p>
      </div>
    </div>

    <div className="dashboard-card dashboard-card-low-stock">
      <div className="dashboard-card-icon">
        ⚠
      </div>

      <div>
        <h3>Low Stock</h3>
        <p>{lowStockProducts.length}</p>
      </div>
    </div>

    <div className="dashboard-card dashboard-card-out-stock">
      <div className="dashboard-card-icon">
        !
      </div>

      <div>
        <h3>Out of Stock</h3>
        <p>{outOfStockProducts.length}</p>
      </div>
    </div>
  </div>

  <div className="admin-dashboard-main-grid">
    <section className="recent-orders-section">
      <div className="recent-orders-header">
        <div>
          <h2>Recent Orders</h2>
          <p>
            Latest orders from your customers.
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="view-all-orders-button"
        >
          View All
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <div className="no-recent-orders">
          <div className="no-orders-icon">
            🛒
          </div>

          <h3>No Orders Found</h3>

          <p>
            There are no customer orders yet.
          </p>
        </div>
      ) : (
        <div className="recent-orders-table-container">
          <table className="recent-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>
                      #{order.id}
                    </strong>
                  </td>

                  <td>
                    <div className="dashboard-customer">
                      <strong>
                        {order.fullName}
                      </strong>

                      <span>
                        {order.email}
                      </span>
                    </div>
                  </td>

                  <td>
                    {order.paymentMethod}
                  </td>

                  <td>
                    <strong>
                      $
                      {Number(
                        order.totalPrice || 0
                      ).toFixed(2)}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={`dashboard-status status-${(
                        order.status || "Pending"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}
                      `}
                    >
                      {order.status || "Pending"}
                    </span>
                  </td>

                  <td>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="view-order-button"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>

    <section className="dashboard-status-section">
      <div className="dashboard-section-heading">
        <div>
          <h2>Order Status</h2>
          <p>
            Current order activity.
          </p>
        </div>
      </div>

      <div className="dashboard-status-list">
        <div className="dashboard-status-item">
          <div>
            <span className="status-dot status-dot-pending"></span>
            <span>Pending</span>
          </div>

          <strong>{pendingOrders}</strong>
        </div>

        <div className="dashboard-status-item">
          <div>
            <span className="status-dot status-dot-processing"></span>
            <span>Processing</span>
          </div>

          <strong>{processingOrders}</strong>
        </div>

        <div className="dashboard-status-item">
          <div>
            <span className="status-dot status-dot-shipped"></span>
            <span>Shipped</span>
          </div>

          <strong>{shippedOrders}</strong>
        </div>

        <div className="dashboard-status-item">
          <div>
            <span className="status-dot status-dot-delivered"></span>
            <span>Delivered</span>
          </div>

          <strong>{deliveredOrders}</strong>
        </div>

        <div className="dashboard-status-item">
          <div>
            <span className="status-dot status-dot-cancelled"></span>
            <span>Cancelled</span>
          </div>

          <strong>{cancelledOrders}</strong>
        </div>
      </div>
    </section>
  </div>

  <div className="admin-dashboard-bottom-grid">
    <section className="dashboard-stock-section">
      <div className="dashboard-section-heading">
        <div>
          <h2>Stock Alerts</h2>
          <p>
            Products that need your attention.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="dashboard-small-link"
        >
          Manage Products
        </Link>
      </div>

      {lowStockProducts.length === 0 &&
      outOfStockProducts.length === 0 ? (
        <div className="stock-success">
          <span>✓</span>

          <div>
            <strong>Stock looks good</strong>

            <p>
              No products need restocking right
              now.
            </p>
          </div>
        </div>
      ) : (
        <div className="stock-alert-list">
          {outOfStockProducts
            .slice(0, 4)
            .map((product) => (
              <div
                className="stock-alert-item"
                key={product.id}
              >
                <div className="stock-product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </div>

                <div className="stock-product-info">
                  <strong>
                    {product.name}
                  </strong>

                  <span>
                    Out of Stock
                  </span>
                </div>

                <Link
                  to="/admin/products"
                  className="stock-action"
                >
                  Update
                </Link>
              </div>
            ))}

          {lowStockProducts
            .slice(0, 4)
            .map((product) => (
              <div
                className="stock-alert-item"
                key={product.id}
              >
                <div className="stock-product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </div>

                <div className="stock-product-info">
                  <strong>
                    {product.name}
                  </strong>

                  <span className="low-stock-text">
                    Only {product.stock} left
                  </span>
                </div>

                <Link
                  to="/admin/products"
                  className="stock-action"
                >
                  Update
                </Link>
              </div>
            ))}
        </div>
      )}
    </section>

    <section className="dashboard-quick-actions">
      <div className="dashboard-section-heading">
        <div>
          <h2>Quick Actions</h2>
          <p>
            Common admin tasks.
          </p>
        </div>
      </div>

      <div className="quick-actions-grid">
        <Link
          to="/admin/products"
          className="quick-action"
        >
          <span>📦</span>

          <div>
            <strong>Products</strong>

            <small>
              Manage store products
            </small>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="quick-action"
        >
          <span>🛒</span>

          <div>
            <strong>Orders</strong>

            <small>
              Manage customer orders
            </small>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="quick-action"
        >
          <span>👥</span>

          <div>
            <strong>Users</strong>

            <small>
              Manage customer accounts
            </small>
          </div>
        </Link>
      </div>
    </section>
  </div>
</main>

);
}

export default AdminDashboard;
