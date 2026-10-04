import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
const { id } = useParams();
const { addToCart } = useCart();
const { toggleWishlist, isInWishlist } = useWishlist();

const [product, setProduct] = useState(null);
const [relatedProducts, setRelatedProducts] = useState([]);
const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");
const [reviewLoading, setReviewLoading] = useState(false);
const [reviewError, setReviewError] = useState("");
const [reviewSuccess, setReviewSuccess] = useState("");
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchProduct = async () => {
try {
const productResponse = await fetch(
`http://localhost:8080/api/products/${id}`
);


    const productData = await productResponse.json();

    const productsResponse = await fetch(
      "http://localhost:8080/api/products"
    );

    const productsData = await productsResponse.json();

    setProduct(productData);

    const currentName = productData.name.toLowerCase();
    let productType = null;

    if (currentName.includes("speaker")) {
      productType = "speaker";
    } else if (currentName.includes("watch")) {
      productType = "watch";
    } else if (currentName.includes("mouse")) {
      productType = "mouse";
    } else if (
      currentName.includes("shoe") ||
      currentName.includes("shoes") ||
      currentName.includes("sneaker") ||
      currentName.includes("sneakers")
    ) {
      productType = "shoe";
    } else if (
      currentName.includes("t-shirt") ||
      currentName.includes("tshirt")
    ) {
      productType = "tshirt";
    } else if (
      currentName.includes("shirt") ||
      currentName.includes("jacket") ||
      currentName.includes("dress")
    ) {
      productType = "clothing";
    }

    const related = productsData
      .filter((item) => {
        if (item.id === productData.id) {
          return false;
        }

        const itemName = item.name.toLowerCase();

        if (productType === "speaker") {
          return itemName.includes("speaker");
        }

        if (productType === "watch") {
          return itemName.includes("watch");
        }

        if (productType === "mouse") {
          return itemName.includes("mouse");
        }

        if (productType === "shoe") {
          return (
            itemName.includes("shoe") ||
            itemName.includes("shoes") ||
            itemName.includes("sneaker") ||
            itemName.includes("sneakers")
          );
        }

        if (productType === "tshirt") {
          return (
            itemName.includes("t-shirt") ||
            itemName.includes("tshirt")
          );
        }

        if (productType === "clothing") {
          return (
            itemName.includes("shirt") ||
            itemName.includes("jacket") ||
            itemName.includes("dress")
          );
        }

        return false;
      })
      .slice(0, 10);

    setRelatedProducts(related);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching product:", error);
    setLoading(false);
  }
};

fetchProduct();


}, [id]);

useEffect(() => {
const fetchReviews = async () => {
try {
const response = await fetch(
`http://localhost:8080/api/reviews/product/${id}`
);


    if (!response.ok) {
      throw new Error("Failed to load reviews");
    }

    const data = await response.json();
    setReviews(data);
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

fetchReviews();


}, [id]);

const handleSubmitReview = async (e) => {
e.preventDefault();


setReviewError("");
setReviewSuccess("");

const savedUser = localStorage.getItem("user");

if (!savedUser) {
  setReviewError("Please login before writing a review.");
  return;
}

let user;

try {
  user = JSON.parse(savedUser);
} catch {
  localStorage.removeItem("user");
  setReviewError("Your session is invalid. Please login again.");
  return;
}

if (!user.token) {
  setReviewError("Your session has expired. Please login again.");
  return;
}

if (!comment.trim()) {
  setReviewError("Please write a review.");
  return;
}

setReviewLoading(true);

try {
  const response = await fetch(
    "http://localhost:8080/api/reviews",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        productId: product.id,
        rating: Number(rating),
        comment: comment.trim(),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to submit review"
    );
  }

  setReviews((currentReviews) => [
    data,
    ...currentReviews,
  ]);

  setComment("");
  setRating(5);
  setReviewSuccess("Your review has been added.");
} catch (error) {
  console.error("Error submitting review:", error);

  setReviewError(
    error.message || "Failed to submit review."
  );
} finally {
  setReviewLoading(false);
}


};

if (loading) {
return ( <main className="product-details-page"> <h2>Loading product...</h2> </main>
);
}

if (!product) {
return ( <main className="product-details-page"> <h2>Product Not Found</h2>


    <Link
      to="/products"
      className="back-button"
    >
      Back to Products
    </Link>
  </main>
);


}

const favorite = isInWishlist(product.id);

const averageRating =
reviews.length > 0
? (
reviews.reduce(
(total, review) => total + review.rating,
0
) / reviews.length
).toFixed(1)
: "0.0";

return ( <main className="product-details-page"> <div className="product-details"> <div className="product-details-image"> <img
         src={product.image}
         alt={product.name}
       /> </div>


    <div className="product-details-info">
      <p className="details-category">
        {product.category}
      </p>

      <h1>{product.name}</h1>

      <p className="details-price">
        ${Number(product.price).toFixed(2)}
      </p>

      <p className="details-stock">
        {product.stock === 0
          ? "Out of Stock"
          : `${product.stock} Available`}
      </p>

      <p className="details-description">
        This is a high-quality{" "}
        {product.name.toLowerCase()}.
        It is a great choice for everyday use and
        provides excellent value for the price.
      </p>

      <div className="product-details-actions">
        <button
          className="add-cart-button"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          {product.stock === 0
            ? "Out of Stock"
            : "Add to Cart"}
        </button>

        <button
          className={`details-wishlist-button ${
            favorite ? "details-wishlist-active" : ""
          }`}
          onClick={() => toggleWishlist(product)}
        >
          {favorite
            ? "♥ Saved to Wishlist"
            : "♡ Add to Wishlist"}
        </button>
      </div>

      <Link
        to="/products"
        className="back-button"
      >
        ← Back to Products
      </Link>
    </div>
  </div>

  <section className="reviews-section">
    <div className="reviews-header">
      <div>
        <h2>Customer Reviews</h2>

        <p>
          {reviews.length === 0
            ? "No reviews yet."
            : `${reviews.length} review${
                reviews.length > 1 ? "s" : ""
              }`}
        </p>
      </div>

      <div className="reviews-average">
        <strong>{averageRating}</strong>
        <span>★</span>
      </div>
    </div>

    <form
      className="review-form"
      onSubmit={handleSubmitReview}
    >
      <h3>Write a Review</h3>

      <div className="rating-selector">
        <span>Your Rating</span>

        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={
                star <= rating
                  ? "rating-star active"
                  : "rating-star"
              }
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        rows="4"
      />

      {reviewError && (
        <p className="review-error">
          {reviewError}
        </p>
      )}

      {reviewSuccess && (
        <p className="review-success">
          {reviewSuccess}
        </p>
      )}

      <button
        type="submit"
        className="submit-review-button"
        disabled={reviewLoading}
      >
        {reviewLoading
          ? "Submitting..."
          : "Submit Review"}
      </button>
    </form>

    <div className="reviews-list">
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>
            Be the first customer to review this product.
          </p>
        </div>
      ) : (
        reviews.map((review) => (
          <div
            className="review-card"
            key={review.id}
          >
            <div className="review-card-header">
              <div>
                <h3>{review.userName}</h3>

                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= review.rating
                          ? "filled"
                          : ""
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="review-comment">
              {review.comment}
            </p>
          </div>
        ))
      )}
    </div>
  </section>

  {relatedProducts.length > 0 && (
    <section className="related-products-section">
      <div className="related-products-header">
        <h2>You May Also Like</h2>

        <p>
          More products you may like.
        </p>
      </div>

      <div className="related-products-grid">
        {relatedProducts.map((item) => (
          <div
            className="related-product-card"
            key={item.id}
          >
            <Link
              to={`/products/${item.id}`}
              className="related-product-image-link"
            >
              <div className="related-product-image">
                <img
                  src={item.image}
                  alt={item.name}
                />
              </div>
            </Link>

            <div className="related-product-info">
              <Link
                to={`/products/${item.id}`}
                className="related-product-name"
              >
                <h3>{item.name}</h3>
              </Link>

              <p>
                ${Number(item.price).toFixed(2)}
              </p>

              <span>
                {item.stock === 0
                  ? "Out of Stock"
                  : `${item.stock} Available`}
              </span>

              <Link
                to={`/products/${item.id}`}
                className="related-product-button"
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )}
</main>


);
}

export default ProductDetails;
