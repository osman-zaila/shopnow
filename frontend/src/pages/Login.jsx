import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
email: "",
password: "",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();


setLoading(true);
setError("");

try {
  const response = await fetch(
    "http://localhost:8080/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  const user = await response.json();

  localStorage.setItem("user", JSON.stringify(user));

  if (user.role === "ADMIN") {
    navigate("/admin/dashboard");
  } else {
    navigate("/home");
  }
} catch (error) {
  console.error("Login error:", error);
  setError("Invalid email or password.");
} finally {
  setLoading(false);
}

};

return ( <main className="login-page"> <div className="login-card"> <div className="login-header"> <h1>Welcome Back</h1> <p>Login to your ShopNow account.</p> </div>


    {error && (
      <div className="login-error">
        {error}
      </div>
    )}

    <form
      className="login-form"
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label>Email</label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
      </div>

      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  </div>
</main>


);
}

export default Login;
