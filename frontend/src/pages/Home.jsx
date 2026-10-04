import { Link } from "react-router-dom";
import products from "../data/products";

function Home() {
  const featuredProducts = products.slice(0, 8);

  return (
    <main className="home-page">

      {/* Hero Section */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-small-text">
            Welcome to ShopNow
          </p>

          <h1>
            Find Everything
            <br />
            You Need in One Place
          </h1>

          <p className="hero-description">
            Discover quality products at affordable prices.
            Shop easily and enjoy a simple shopping experience.
          </p>

          <Link
            to="/products"
            className="hero-button"
          >
            Shop Now
          </Link>

        </div>

      </section>


      {/* Categories */}

      <section className="categories-section">

        <div className="section-heading">

          <h2>
            Shop by Category
          </h2>

          <p>
            Find products from your favorite categories.
          </p>

        </div>

        <div className="categories">

          <div className="category-card">
            <div className="category-icon">
              📱
            </div>

            <h3>
              Electronics
            </h3>

            <p>
              Phones, watches and more
            </p>
          </div>


          <div className="category-card">
            <div className="category-icon">
              👕
            </div>

            <h3>
              Clothing
            </h3>

            <p>
              Modern clothes for everyone
            </p>
          </div>


          <div className="category-card">
            <div className="category-icon">
              👟
            </div>

            <h3>
              Shoes
            </h3>

            <p>
              Comfortable shoes for every day
            </p>
          </div>


          <div className="category-card">
            <div className="category-icon">
              👜
            </div>

            <h3>
              Accessories
            </h3>

            <p>
              Complete your style
            </p>
          </div>

        </div>

      </section>


      {/* Featured Products */}

      <section className="products-section">

        <div className="section-heading">

          <h2>
            Featured Products
          </h2>

          <p>
            Check out some of our popular products.
          </p>

        </div>


        <div className="products-grid">

          {featuredProducts.map((product) => (

            <div
              className="product-card"
              key={product.id}
            >

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


              <div className="product-info">

                <Link
                  to={`/products/${product.id}`}
                  className="product-name-link"
                >

                  <h3>
                    {product.name}
                  </h3>

                </Link>


                <p className="product-category">
                  {product.category}
                </p>


                <p className="product-price">
                  ${product.price}
                </p>


                <Link
                  to={`/products/${product.id}`}
                  className="product-button"
                >
                  View Product
                </Link>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}

export default Home;