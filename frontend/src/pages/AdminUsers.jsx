import { useEffect, useState } from "react";

function AdminUsers() {
const [users, setUsers] = useState([]);
const [search, setSearch] = useState("");
const [roleFilter, setRoleFilter] = useState("ALL");
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState("");
const [showForm, setShowForm] = useState(false);
const [saving, setSaving] = useState(false);
const [editingUser, setEditingUser] = useState(null);

const [formData, setFormData] = useState({
name: "",
email: "",
password: "",
role: "CUSTOMER",
});

const getAuthHeaders = () => {
const savedUser = localStorage.getItem("user");


if (!savedUser) {
  throw new Error("Please login again.");
}

let user;

try {
  user = JSON.parse(savedUser);
} catch {
  localStorage.removeItem("user");
  throw new Error("Your session is invalid. Please login again.");
}

if (!user.token) {
  throw new Error("Your session has expired. Please login again.");
}

return {
  "Content-Type": "application/json",
  Authorization: `Bearer ${user.token}`,
};


};

const fetchUsers = async (isRefresh = false) => {
try {
if (isRefresh) {
setRefreshing(true);
} else {
setLoading(true);
}

  setError("");

  const headers = getAuthHeaders();

  const response = await fetch(
    "http://localhost:8080/api/users",
    {
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch users"
    );
  }

  setUsers(data);
} catch (error) {
  console.error("Error fetching users:", error);

  setError(
    error.message ||
      "We couldn't load the users. Please try again."
  );
} finally {
  setLoading(false);
  setRefreshing(false);
}


};

useEffect(() => {
fetchUsers();
}, []);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const resetForm = () => {
setFormData({
name: "",
email: "",
password: "",
role: "CUSTOMER",
});


setEditingUser(null);
setShowForm(false);


};

const handleAddUser = () => {
setEditingUser(null);


setFormData({
  name: "",
  email: "",
  password: "",
  role: "CUSTOMER",
});

setShowForm(true);


};

const handleEdit = (user) => {
setEditingUser(user);


setFormData({
  name: user.name,
  email: user.email,
  password: "",
  role: user.role,
});

setShowForm(true);


};

const handleSubmit = async (e) => {
e.preventDefault();


setSaving(true);

try {
  const headers = getAuthHeaders();

  if (editingUser) {
    const response = await fetch(
      `http://localhost:8080/api/users/${editingUser.id}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update user"
      );
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === data.id ? data : user
      )
    );
  } else {
    const response = await fetch(
      "http://localhost:8080/api/users",
      {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to add user"
      );
    }

    setUsers((currentUsers) => [
      ...currentUsers,
      data,
    ]);
  }

  resetForm();
} catch (error) {
  console.error("Error saving user:", error);

  alert(
    error.message || "Failed to save user."
  );
} finally {
  setSaving(false);
}


};

const handleDelete = async (id) => {
const confirmDelete = window.confirm(
"Are you sure you want to delete this user?"
);


if (!confirmDelete) {
  return;
}

try {
  const headers = getAuthHeaders();

  const response = await fetch(
    `http://localhost:8080/api/users/${id}`,
    {
      method: "DELETE",
      headers,
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to delete user"
    );
  }

  setUsers((currentUsers) =>
    currentUsers.filter(
      (user) => user.id !== id
    )
  );
} catch (error) {
  console.error("Error deleting user:", error);

  alert(
    error.message || "Failed to delete user."
  );
}


};

const totalUsers = users.length;

const adminUsers = users.filter(
(user) => user.role === "ADMIN"
).length;

const customerUsers = users.filter(
(user) => user.role === "CUSTOMER"
).length;

const filteredUsers = users.filter((user) => {
const searchText = search.toLowerCase().trim();


const matchesSearch =
  user.name.toLowerCase().includes(searchText) ||
  user.email.toLowerCase().includes(searchText) ||
  String(user.id).includes(searchText);

const matchesRole =
  roleFilter === "ALL" ||
  user.role === roleFilter;

return matchesSearch && matchesRole;


});

if (loading) {
return ( <main className="admin-users-page"> <div className="admin-users-loading"> <div className="admin-users-spinner"></div>


      <h2>Loading users...</h2>

      <p>
        Please wait while we load your users.
      </p>
    </div>
  </main>
);


}

if (error) {
return ( <main className="admin-users-page"> <div className="admin-users-loading admin-users-error"> <div className="admin-users-error-icon">
! </div>


      <h2>Something went wrong</h2>

      <p>{error}</p>

      <button
        className="refresh-users-button"
        onClick={() => fetchUsers()}
      >
        Try Again
      </button>
    </div>
  </main>
);


}

return ( <main className="admin-users-page"> <div className="admin-users-header"> <div> <span className="admin-users-label">
SHOPNOW ADMIN </span>


      <h1>Users</h1>

      <p>
        Manage customer and administrator accounts.
      </p>
    </div>

    <div className="admin-users-header-actions">
      <button
        className="refresh-users-button"
        onClick={() => fetchUsers(true)}
        disabled={refreshing}
      >
        {refreshing
          ? "Refreshing..."
          : "↻ Refresh"}
      </button>

      <button
        className="add-user-button"
        onClick={
          showForm && !editingUser
            ? resetForm
            : handleAddUser
        }
      >
        {showForm && !editingUser
          ? "Close Form"
          : "+ Add User"}
      </button>
    </div>
  </div>

  <div className="admin-users-stats">
    <div className="admin-user-stat-card">
      <div className="admin-user-stat-icon">
        👥
      </div>

      <div>
        <span>Total Users</span>
        <strong>{totalUsers}</strong>
      </div>
    </div>

    <div className="admin-user-stat-card">
      <div className="admin-user-stat-icon admin-user-stat-admin">
        🛡️
      </div>

      <div>
        <span>Administrators</span>
        <strong>{adminUsers}</strong>
      </div>
    </div>

    <div className="admin-user-stat-card">
      <div className="admin-user-stat-icon admin-user-stat-customer">
        👤
      </div>

      <div>
        <span>Customers</span>
        <strong>{customerUsers}</strong>
      </div>
    </div>
  </div>

  {showForm && (
    <div className="add-user-form-card">
      <div className="add-user-form-header">
        <div>
          <h2>
            {editingUser
              ? "Edit User"
              : "Add New User"}
          </h2>

          <p>
            {editingUser
              ? "Update the user information below."
              : "Create a new user account."}
          </p>
        </div>
      </div>

      <form
        className="add-user-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter user name"
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
            placeholder="Enter user email"
            required
          />
        </div>

        {!editingUser && (
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Role</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="CUSTOMER">
              CUSTOMER
            </option>

            <option value="ADMIN">
              ADMIN
            </option>
          </select>
        </div>

        <div className="add-user-form-actions">
          <button
            type="button"
            className="cancel-user-button"
            onClick={resetForm}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-user-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingUser
              ? "Update User"
              : "Save User"}
          </button>
        </div>
      </form>
    </div>
  )}

  <div className="admin-users-toolbar">
    <div className="admin-users-search">
      <span>⌕</span>

      <input
        type="text"
        placeholder="Search by name, email or ID..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />
    </div>

    <select
      className="admin-users-role-filter"
      value={roleFilter}
      onChange={(e) =>
        setRoleFilter(e.target.value)
      }
    >
      <option value="ALL">
        All Roles
      </option>

      <option value="ADMIN">
        Admin
      </option>

      <option value="CUSTOMER">
        Customer
      </option>
    </select>
  </div>

  {filteredUsers.length === 0 ? (
    <div className="no-admin-users">
      <div className="no-admin-users-icon">
        👥
      </div>

      <h2>
        {users.length === 0
          ? "No Users Found"
          : "No Matching Users"}
      </h2>

      <p>
        {users.length === 0
          ? "There are no users in your store yet."
          : "Try changing your search or role filter."}
      </p>
    </div>
  ) : (
    <div className="admin-users-table-container">
      <div className="admin-users-table-header">
        <div>
          <h2>User Accounts</h2>

          <p>
            Showing {filteredUsers.length} of{" "}
            {users.length} users
          </p>
        </div>
      </div>

      <div className="admin-users-table-scroll">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>
                    #{user.id}
                  </strong>
                </td>

                <td>
                  <div className="admin-user-name-cell">
                    <div className="admin-user-avatar">
                      {user.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {user.name}
                      </strong>

                      <span>
                        User ID #{user.id}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="admin-user-email">
                    {user.email}
                  </span>
                </td>

                <td>
                  <span
                    className={`admin-user-role ${
                      user.role === "ADMIN"
                        ? "admin-role"
                        : "customer-role"
                    }`}
                  >
                    {user.role === "ADMIN"
                      ? "Admin"
                      : "Customer"}
                  </span>
                </td>

                <td>
                  {user.role === "ADMIN" ? (
                    <span className="protected-user">
                      🛡 Protected
                    </span>
                  ) : (
                    <div className="admin-user-actions">
                      <button
                        className="edit-user-button"
                        onClick={() =>
                          handleEdit(user)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-user-button"
                        onClick={() =>
                          handleDelete(user.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
</main>


);
}

export default AdminUsers;
