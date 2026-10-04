import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const handleClearWishlist = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your wishlist?"
    );

    if (confirmed) {
      clearWishlist();
    }
  };

  return (
    <main className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <h1>My Wishlist</h1>
          <p>
            Products you saved for later.
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            className="clear-wishlist-button"
            onClick={handleClearWishlist}
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">
            ♡
          </div>

          <h2>Your wishlist is empty</h2>

          <p>
            You have not added any products to your
            wishlist yet.
          </p>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="wishlist-summary">
            <span>
              {wishlist.length}{" "}
              {wishlist.length === 1
                ? "product"
                : "products"}{" "}
              saved
            </span>
          </div>

          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div
                className="wishlist-card"
                key={product.id}
              >
                <div className="wishlist-card-image-wrapper">
                  <Link
                    to={`/products/${product.id}`}
                    className="wishlist-image-link"
                  >
                    <div className="wishlist-image">
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                  </Link>

                  <button
                    className="wishlist-heart-button"
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    aria-label="Remove from wishlist"
                  >
                    ♥
                  </button>
                </div>

                <div className="wishlist-info">
                  <Link
                    to={`/products/${product.id}`}
                    className="wishlist-name"
                  >
                    <h3>{product.name}</h3>
                  </Link>

                  <p className="wishlist-category">
                    {product.category}
                  </p>

                  <p className="wishlist-price">
                    ${Number(product.price).toFixed(2)}
                  </p>

                  {product.stock === 0 ? (
                    <p className="wishlist-stock wishlist-out">
                      Out of Stock
                    </p>
                  ) : (
                    <p className="wishlist-stock wishlist-in">
                      {product.stock} Available
                    </p>
                  )}

                  <div className="wishlist-actions">
                    <button
                      className="wishlist-cart-button"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>

                    <Link
                      to={`/products/${product.id}`}
                      className="wishlist-view-button"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default Wishlist;
