import { useEffect, useState } from "react";

function AdminProducts() {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [showForm, setShowForm] = useState(false);
const [editingProduct, setEditingProduct] = useState(null);

const [formData, setFormData] = useState({
name: "",
category: "Electronics",
price: "",
image: "",
stock: "",
});

const [saving, setSaving] = useState(false);

const getAuthHeaders = () => {
const storedUser = JSON.parse(localStorage.getItem("user"));


return {
  Authorization: `Bearer ${storedUser?.token}`,
};


};

const fetchProducts = () => {
fetch("http://localhost:8080/api/products", {
headers: getAuthHeaders(),
})
.then((response) => {
if (!response.ok) {
throw new Error("Failed to fetch products");
}


    return response.json();
  })
  .then((data) => {
    setProducts(data);
    setLoading(false);
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
    setLoading(false);
  });


};

useEffect(() => {
fetchProducts();
}, []);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleAddProduct = () => {
setEditingProduct(null);


setFormData({
  name: "",
  category: "Electronics",
  price: "",
  image: "",
  stock: "",
});

setShowForm(true);


};

const handleEditProduct = (product) => {
setEditingProduct(product);


setFormData({
  name: product.name,
  category: product.category,
  price: product.price,
  image: product.image,
  stock: product.stock,
});

setShowForm(true);

window.scrollTo({
  top: 0,
  behavior: "smooth",
});


};

const handleSubmit = async (e) => {
e.preventDefault();


setSaving(true);

try {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser?.token) {
    throw new Error("Authentication token not found");
  }

  const url = editingProduct
    ? `http://localhost:8080/api/products/${editingProduct.id}`
    : "http://localhost:8080/api/products";

  const method = editingProduct ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedUser.token}`,
    },
    body: JSON.stringify({
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      image: formData.image,
      stock: Number(formData.stock),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save product");
  }

  const savedProduct = await response.json();

  if (editingProduct) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === savedProduct.id
          ? savedProduct
          : product
      )
    );
  } else {
    setProducts((currentProducts) => [
      ...currentProducts,
      savedProduct,
    ]);
  }

  setFormData({
    name: "",
    category: "Electronics",
    price: "",
    image: "",
    stock: "",
  });

  setEditingProduct(null);
  setShowForm(false);
} catch (error) {
  console.error("Error saving product:", error);
  alert("Failed to save product.");
} finally {
  setSaving(false);
}


};

const handleDeleteProduct = async (productId) => {
const confirmed = window.confirm(
"Are you sure you want to delete this product?"
);


if (!confirmed) {
  return;
}

try {
  const response = await fetch(
    `http://localhost:8080/api/products/${productId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  setProducts((currentProducts) =>
    currentProducts.filter(
      (product) => product.id !== productId
    )
  );
} catch (error) {
  console.error("Error deleting product:", error);
  alert("Failed to delete product.");
}


};

const handleCancel = () => {
setShowForm(false);
setEditingProduct(null);


setFormData({
  name: "",
  category: "Electronics",
  price: "",
  image: "",
  stock: "",
});


};

if (loading) {
return ( <main className="admin-products-page"> <h2>Loading products...</h2> </main>
);
}

return ( <main className="admin-products-page"> <div className="admin-products-header"> <div> <h1>Products</h1>


      <p>
        Manage products in your online store.
      </p>
    </div>

    <button
      className="add-product-button"
      onClick={handleAddProduct}
    >
      {showForm && !editingProduct
        ? "Close Form"
        : "+ Add Product"}
    </button>
  </div>

  {showForm && (
    <div className="add-product-form-card">
      <h2>
        {editingProduct
          ? "Edit Product"
          : "Add New Product"}
      </h2>

      <p>
        {editingProduct
          ? "Update the product information below."
          : "Enter the product information below."}
      </p>

      <form
        className="add-product-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>Product Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Electronics">
              Electronics
            </option>

            <option value="Clothing">
              Clothing
            </option>

            <option value="Shoes">
              Shoes
            </option>

            <option value="Accessories">
              Accessories
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>Price</label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Stock</label>

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Enter stock quantity"
            min="0"
            step="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>

          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="add-product-form-actions">
          <button
            type="button"
            className="cancel-product-button"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-product-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingProduct
              ? "Update Product"
              : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  )}

  {products.length === 0 ? (
    <div className="no-admin-products">
      <h2>No Products Found</h2>

      <p>
        There are no products in your store yet.
      </p>
    </div>
  ) : (
    <div className="admin-products-table-container">
      <table className="admin-products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>#{product.id}</td>

              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  className="admin-product-image"
                />
              </td>

              <td>
                <strong>{product.name}</strong>
              </td>

              <td>{product.category}</td>

              <td>
                ${Number(product.price).toFixed(2)}
              </td>

              <td>
                {product.stock === 0 ? (
                  <span className="out-of-stock">
                    Out of Stock
                  </span>
                ) : (
                  <span className="in-stock">
                    {product.stock} Available
                  </span>
                )}
              </td>

              <td>
                <button
                  className="edit-product-button"
                  onClick={() =>
                    handleEditProduct(product)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-product-button"
                  onClick={() =>
                    handleDeleteProduct(product.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</main>


);
}

export default AdminProducts;
