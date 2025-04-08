// src/components/Admin/UsersSection.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  clearSelectedUser,
} from "@/store/User-Slice"; // Ensure this matches your file structure

const UsersSection = () => {
  const dispatch = useDispatch();
  const { users, selectedUser, loading, error } = useSelector(
    (state) => state.user || {}
  );

  useEffect(() => {
    console.log("Fetching all users...");
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleViewUser = (userId) => {
    dispatch(getUserById(userId));
  };

  const handleUpdateUser = (userId, newRole) => {
    const userData = { role: newRole };
    dispatch(updateUser({ userId, userData }));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  const handleClearSelected = () => {
    dispatch(clearSelectedUser());
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 relative">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Manage Users
      </h2>

      {loading && (
        <p className="text-center text-gray-600">Loading users...</p>
      )}
      {error && (
        <p className="text-center text-red-600 mb-4">Error: {error}</p>
      )}

      <div className="mb-6">
        <Button
          onClick={() => {
            console.log("Refreshing user list...");
            dispatch(getAllUsers());
          }}
          className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
        >
          Refresh User List
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <p className="text-gray-900 font-medium truncate">
                {user.userName}
              </p>
              <p className="text-gray-600 text-sm">Email: {user.userEmail}</p>
              <p className="text-gray-600 text-sm">Role: {user.role}</p>
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewUser(user._id)}
                  className="w-full sm:w-auto"
                >
                  View/Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUser(user._id)}
                  className="w-full sm:w-auto"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No users found.
          </p>
        )}
      </div>

      {selectedUser && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-2xl z-50 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">User Details</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Username:</span>{" "}
              {selectedUser.userName}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {selectedUser.userEmail}
            </p>
            <div>
              <label className="font-medium">Role:</label>
              <select
                value={selectedUser.role}
                onChange={(e) => handleUpdateUser(selectedUser._id, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={handleClearSelected}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersSection;