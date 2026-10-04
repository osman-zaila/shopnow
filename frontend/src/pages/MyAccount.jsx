import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MyAccount() {
const navigate = useNavigate();

const savedUser = localStorage.getItem("user");

let user = null;

try {
user = savedUser ? JSON.parse(savedUser) : null;
} catch {
localStorage.removeItem("user");
}

const [showEdit, setShowEdit] = useState(false);
const [showPassword, setShowPassword] = useState(false);

const [saving, setSaving] = useState(false);
const [passwordSaving, setPasswordSaving] = useState(false);

const [error, setError] = useState("");
const [passwordError, setPasswordError] = useState("");
const [passwordSuccess, setPasswordSuccess] = useState("");

const [formData, setFormData] = useState({
name: user?.name || "",
email: user?.email || "",
});

const [passwordData, setPasswordData] = useState({
currentPassword: "",
newPassword: "",
confirmPassword: "",
});

const getToken = () => {
if (!user?.token) {
throw new Error("Your session has expired. Please login again.");
}

return user.token;


};

const handleLogout = () => {
localStorage.removeItem("user");
window.location.replace("/login");
};

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handlePasswordChange = (e) => {
setPasswordData({
...passwordData,
[e.target.name]: e.target.value,
});
};

const handleEdit = () => {
setError("");


setFormData({
  name: user.name,
  email: user.email,
});

setShowEdit(true);
setShowPassword(false);


};

const handleCancel = () => {
setError("");


setFormData({
  name: user.name,
  email: user.email,
});

setShowEdit(false);


};

const handlePasswordOpen = () => {
setPasswordError("");
setPasswordSuccess("");


setPasswordData({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

setShowPassword(true);
setShowEdit(false);


};

const handlePasswordCancel = () => {
setPasswordError("");
setPasswordSuccess("");


setPasswordData({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

setShowPassword(false);


};

const handleSubmit = async (e) => {
e.preventDefault();

setSaving(true);
setError("");

try {
  const token = getToken();

  const response = await fetch(
    `http://localhost:8080/api/users/${user.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name.trim(),
        email: formData.email.trim(),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile.");
  }

  const updatedUser = {
    ...user,
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    token: user.token,
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));

  setShowEdit(false);

  window.location.reload();
} catch (error) {
  console.error("Profile update error:", error);

  setError(
    error.message || "Failed to update profile. Please try again."
  );
} finally {
  setSaving(false);
}


};

const handlePasswordSubmit = async (e) => {
e.preventDefault();


setPasswordError("");
setPasswordSuccess("");

if (
  passwordData.newPassword !== passwordData.confirmPassword
) {
  setPasswordError("New passwords do not match.");
  return;
}

if (passwordData.newPassword.length < 6) {
  setPasswordError(
    "New password must be at least 6 characters."
  );
  return;
}

setPasswordSaving(true);

try {
  const token = getToken();

  const response = await fetch(
    `http://localhost:8080/api/users/${user.id}/password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to change password."
    );
  }

  setPasswordSuccess("Password changed successfully.");

  setPasswordData({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
} catch (error) {
  console.error("Password change error:", error);

  setPasswordError(
    error.message || "Failed to change password."
  );
} finally {
  setPasswordSaving(false);
}


};

if (!user) {
navigate("/login");
return null;
}

return ( <main className="account-page"> <div className="account-header"> <h1>My Account</h1> <p>Manage your ShopNow account.</p> </div>


  <div className="account-card">
    <div className="account-avatar">
      {user.name?.charAt(0).toUpperCase()}
    </div>

    {!showEdit && !showPassword && (
      <div className="account-info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <span>{user.role}</span>
      </div>
    )}

    {showEdit && (
      <form
        className="account-edit-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <p className="account-error">
            {error}
          </p>
        )}

        <div className="account-edit-actions">
          <button
            type="button"
            className="account-cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="account-save-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    )}

    {showPassword && (
      <form
        className="account-edit-form"
        onSubmit={handlePasswordSubmit}
      >
        <div className="form-group">
          <label>Current Password</label>

          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Enter current password"
            required
          />
        </div>

        <div className="form-group">
          <label>New Password</label>

          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            minLength="6"
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
            minLength="6"
            required
          />
        </div>

        {passwordError && (
          <p className="account-error">
            {passwordError}
          </p>
        )}

        {passwordSuccess && (
          <p className="account-success">
            {passwordSuccess}
          </p>
        )}

        <div className="account-edit-actions">
          <button
            type="button"
            className="account-cancel-button"
            onClick={handlePasswordCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="account-save-button"
            disabled={passwordSaving}
          >
            {passwordSaving
              ? "Changing..."
              : "Change Password"}
          </button>
        </div>
      </form>
    )}
  </div>

  <div className="account-actions">
    {!showEdit && !showPassword && (
      <>
        <button
          onClick={handleEdit}
          className="account-button"
        >
          Edit Profile
        </button>

        <button
          onClick={handlePasswordOpen}
          className="account-button"
        >
          Change Password
        </button>

        <button
          onClick={() => navigate("/account/orders")}
          className="account-button"
        >
          My Orders
        </button>

        <button
          onClick={handleLogout}
          className="account-logout-button"
        >
          Logout
        </button>
      </>
    )}
  </div>
</main>


);
}

export default MyAccount;
