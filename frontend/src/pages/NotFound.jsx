import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-number">404</div>

        <div className="not-found-icon">🛍️</div>

        <h1>Page Not Found</h1>

        <p>
          Oops! The page you are looking for doesn't exist or may have
          been moved.
        </p>

        <Link to="/home" className="not-found-button">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;