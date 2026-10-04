import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
const navigate = useNavigate();
const { cart, cartTotal, clearCart } = useCart();

const [formData, setFormData] = useState({
fullName: "",
email: "",
phone: "",
address: "",
city: "",
paymentMethod: "",
});

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (event) => {
const { name, value } = event.target;


setFormData((current) => ({
  ...current,
  [name]: value,
}));


};

const validateForm = () => {
if (!formData.fullName.trim()) {
return "Full name is required.";
}

if (formData.fullName.trim().length < 3) {
  return "Full name must be at least 3 characters.";
}

if (!formData.email.trim()) {
  return "Email is required.";
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(formData.email.trim())) {
  return "Please enter a valid email address.";
}

if (!formData.phone.trim()) {
  return "Phone number is required.";
}

const phoneDigits = formData.phone.replace(/\D/g, "");

if (phoneDigits.length < 7) {
  return "Please enter a valid phone number.";
}

if (!formData.address.trim()) {
  return "Address is required.";
}

if (formData.address.trim().length < 5) {
  return "Address must be at least 5 characters.";
}

if (!formData.city.trim()) {
  return "City is required.";
}

if (!formData.paymentMethod) {
  return "Please select a payment method.";
}

if (!cart || cart.length === 0) {
  return "Your cart is empty.";
}

return "";


};

const handleSubmit = async (event) => {
event.preventDefault();


setError("");

const validationError = validateForm();

if (validationError) {
  setError(validationError);
  return;
}

try {
  setLoading(true);

  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    setError("Please login before placing your order.");
    setLoading(false);
    return;
  }

  const user = JSON.parse(savedUser);

  if (!user.token) {
    setError("Your session has expired. Please login again.");
    setLoading(false);
    return;
  }

  const orderItems = cart.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
  }));

  const orderData = {
    fullName: formData.fullName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    address: formData.address.trim(),
    city: formData.city.trim(),
    paymentMethod: formData.paymentMethod,
    totalPrice: Number(cartTotal),
    items: orderItems,
  };

  const response = await fetch(
    "http://localhost:8080/api/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(orderData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to place your order."
    );
  }

  clearCart();

  navigate(`/order-success/${data.id}`);
} catch (error) {
  console.error("Checkout error:", error);

  setError(
    error.message || "Something went wrong while placing your order."
  );
} finally {
  setLoading(false);
}


};

if (!cart || cart.length === 0) {
return ( <main className="checkout-page"> <div className="checkout-container"> <div className="checkout-empty"> <h1>Your Cart Is Empty</h1>


        <p>
          Add some products to your cart before checking out.
        </p>

        <button
          type="button"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </main>
);


}

return ( <main className="checkout-page"> <div className="checkout-container">


    <div className="checkout-header">
      <h1>Checkout</h1>

      <p>
        Complete your information to place your order.
      </p>
    </div>

    {error && (
      <div className="checkout-error">
        {error}
      </div>
    )}

    <div className="checkout-content">

      <form
        className="checkout-form"
        onSubmit={handleSubmit}
      >

        <div className="checkout-card">

          <h2>Customer Information</h2>

          <div className="checkout-field">
            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="checkout-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="checkout-field">
            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

        </div>

        <div className="checkout-card">

          <h2>Delivery Information</h2>

          <div className="checkout-field">
            <label htmlFor="address">
              Address
            </label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your delivery address"
              rows="4"
            />
          </div>

          <div className="checkout-field">
            <label htmlFor="city">
              City
            </label>

            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
            />
          </div>

        </div>

        <div className="checkout-card">

          <h2>Payment Method</h2>

          <div className="checkout-field">
            <label htmlFor="paymentMethod">
              Select Payment Method
            </label>

            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">
                Select payment method
              </option>

              <option value="Cash on Delivery">
                Cash on Delivery
              </option>

              <option value="Mobile Money">
                Mobile Money
              </option>
            </select>
          </div>

        </div>

        <button
          type="submit"
          className="place-order-button"
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

      </form>

      <aside className="checkout-summary">

        <div className="checkout-card">

          <h2>Order Summary</h2>

          <div className="checkout-products">

            {cart.map((item) => (
              <div
                className="checkout-product"
                key={item.id}
              >
                <div>
                  <strong>{item.name}</strong>

                  <span>
                    Qty: {item.quantity}
                  </span>
                </div>

                <strong>
                  $
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toFixed(2)}
                </strong>
              </div>
            ))}

          </div>

          <div className="checkout-total">
            <span>Total</span>

            <strong>
              ${Number(cartTotal).toFixed(2)}
            </strong>
          </div>

        </div>

      </aside>

    </div>

  </div>
</main>


);
}

export default Checkout;
