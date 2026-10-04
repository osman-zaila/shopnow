import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function OrderConfirmation() {
const { id } = useParams();

const [order, setOrder] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const getOrder = async () => {
try {
const savedUser = localStorage.getItem("user");


    if (!savedUser) {
      return;
    }

    const user = JSON.parse(savedUser);

    const response = await fetch(
      `http://localhost:8080/api/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load order");
    }

    const data = await response.json();
    setOrder(data);
  } catch (error) {
    console.error("Order confirmation error:", error);
  } finally {
    setLoading(false);
  }
};

getOrder();


}, [id]);

if (loading) {
return ( <main className="order-confirmation-page"> <div className="order-confirmation-card"> <p>Loading order...</p> </div> </main>
);
}

if (!order) {
return ( <main className="order-confirmation-page"> <div className="order-confirmation-card"> <h1>Order Not Found</h1>


      <Link to="/account/orders">
        My Orders
      </Link>
    </div>
  </main>
);


}

return ( <main className="order-confirmation-page"> <div className="order-confirmation-card">


    <div className="order-success-icon">
      ✓
    </div>

    <p className="order-confirmation-label">
      ORDER CONFIRMED
    </p>

    <h1>Order Placed Successfully!</h1>

    <p className="order-confirmation-text">
      Thank you for your order. We have received your order
      and will start processing it soon.
    </p>

    <div className="order-confirmation-info">

      <div>
        <span>Order Number</span>
        <strong>#{order.id}</strong>
      </div>

      <div>
        <span>Total Amount</span>
        <strong>
          ${Number(order.totalPrice).toFixed(2)}
        </strong>
      </div>

      <div>
        <span>Payment</span>
        <strong>{order.paymentMethod}</strong>
      </div>

      <div>
        <span>Status</span>
        <strong>{order.status}</strong>
      </div>

    </div>

    <div className="order-delivery-code">
      <span>Delivery Code</span>

      <strong>
        {order.deliveryCode || "------"}
      </strong>
    </div>

    <div className="order-confirmation-actions">

      <Link
        to={`/account/orders/${order.id}`}
        className="order-confirmation-primary"
      >
        View Order
      </Link>

      <Link
        to={`/account/orders/${order.id}/tracking`}
        className="order-confirmation-secondary"
      >
        Track Order
      </Link>

      <Link
        to="/products"
        className="order-confirmation-secondary"
      >
        Continue Shopping
      </Link>

    </div>

  </div>
</main>


);
}

export default OrderConfirmation;
