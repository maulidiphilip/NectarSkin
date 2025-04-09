import React from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const ProfileSection = () => {
  const { user, loading } = useSelector((state) => state.auth);

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
      {loading ? (
        <p>Loading profile...</p>
      ) : user ? (
        <div className="space-y-2">
          <p>
            <span className="font-medium">Name:</span> {user.userName}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.userEmail}
          </p>
          <p>
            <span className="font-medium">Role:</span> {user.role}
          </p>
          <Button variant="outline" className="mt-2">
            Edit Profile
          </Button>
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
};

export default ProfileSection;