import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (
    location.pathname === "/" ||
    location.pathname === "/login"
  ) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">ShopNow</Link>
      </div>

      <div className="navbar-links">
        {user?.role === "ADMIN" && (
          <Link to="/admin/dashboard">
            Admin Dashboard
          </Link>
        )}

        <Link to="/home">Home</Link>

        <Link to="/products">Products</Link>

        <Link to="/wishlist">
          Wishlist
          {wishlistCount > 0 && (
            <span className="wishlist-count">
              {wishlistCount}
            </span>
          )}
        </Link>

        <Link to="/cart">
          Cart
          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/account">
              My Account
            </Link>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
