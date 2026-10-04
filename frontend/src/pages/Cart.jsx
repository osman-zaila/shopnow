import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  const handleClearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (confirmed) {
      clearCart();
    }
  };

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            🛒
          </div>

          <h1>Your Cart is Empty</h1>

          <p>
            You have not added any products to your
            cart yet.
          </p>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-header">
        <div>
          <h1>Shopping Cart</h1>

          <p>
            Review your products before checkout.
          </p>
        </div>

        <button
          className="clear-cart-button"
          onClick={handleClearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cart.map((item) => {
            const itemTotal =
              Number(item.price) * item.quantity;

            return (
              <div
                className="cart-item"
                key={item.id}
              >
                <Link
                  to={`/products/${item.id}`}
                  className="cart-item-image-link"
                >
                  <div className="cart-item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                </Link>

                <div className="cart-item-info">
                  <Link
                    to={`/products/${item.id}`}
                    className="cart-item-name"
                  >
                    <h2>{item.name}</h2>
                  </Link>

                  <p className="cart-item-category">
                    {item.category}
                  </p>

                  <p className="cart-item-price">
                    ${Number(item.price).toFixed(2)}
                  </p>

                  <p className="cart-item-stock">
                    {item.stock} Available
                  </p>
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      disabled={
                        item.quantity >= item.stock
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-item-total">
                    ${itemTotal.toFixed(2)}
                  </p>

                  <button
                    className="remove-cart-button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>
              ${cartTotal.toFixed(2)}
            </strong>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <strong>Free</strong>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total</span>
            <strong>
              ${cartTotal.toFixed(2)}
            </strong>
          </div>

          <Link
            to="/checkout"
            className="checkout-button"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/products"
            className="continue-shopping cart-continue"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
