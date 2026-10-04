import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";

function Products() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(
          "We couldn't load the products. Please try again."
        );
        setLoading(false);
      });
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products
    .filter((product) => {
      const productName = product.name.toLowerCase();

      const productCategory = product.category.toLowerCase();

      const searchText = search.toLowerCase();

      const matchesSearch =
        productName.includes(searchText) ||
        productCategory.includes(searchText);

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      if (sort === "name-az") {
        return a.name.localeCompare(b.name);
      }

      if (sort === "name-za") {
        return b.name.localeCompare(a.name);
      }

      return 0;
    });

  if (loading) {
    return (
      <main className="products-page">
        <div className="products-status">
          <div className="loading-spinner"></div>
          <h2>Loading products...</h2>
          <p>Please wait while we load our products.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="products-page">
        <div className="products-status products-error">
          <div className="error-icon">!</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            className="retry-button"
            onClick={handleRetry}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="products-page">
      <div className="products-header">
        <div className="section-heading">
          <h2>All Products</h2>
          <p>Find the products you are looking for.</p>
        </div>

        <div className="products-filters">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="category-filter"
          >
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
            <option value="name-za">Name: Z to A</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => {
          const favorite = isInWishlist(product.id);

          return (
            <div
              className="product-card"
              key={product.id}
            >
              <div className="product-card-image-wrapper">
                <Link
                  to={`/products/${product.id}`}
                  className="product-image-link"
                >
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                </Link>

                <button
                  className={`wishlist-button ${
                    favorite ? "wishlist-active" : ""
                  }`}
                  onClick={() => toggleWishlist(product)}
                  aria-label={
                    favorite
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  {favorite ? "♥" : "♡"}
                </button>
              </div>

              <div className="product-info">
                <Link
                  to={`/products/${product.id}`}
                  className="product-name-link"
                >
                  <h3>{product.name}</h3>
                </Link>

                <p className="product-category">
                  {product.category}
                </p>

                <p className="product-price">
                  ${Number(product.price).toFixed(2)}
                </p>

                {product.stock === 0 ? (
                  <p className="product-stock out-of-stock">
                    Out of Stock
                  </p>
                ) : (
                  <p className="product-stock in-stock">
                    {product.stock} Available
                  </p>
                )}

                <Link
                  to={`/products/${product.id}`}
                  className="product-button"
                >
                  View Product
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <p className="no-products">
          No products found.
        </p>
      )}
    </main>
  );
}

export default Products;