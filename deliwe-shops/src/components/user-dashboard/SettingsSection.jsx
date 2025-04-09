import React from "react";
import { Button } from "@/components/ui/button";

const SettingsSection = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
      <p>Manage your account settings here (e.g., shipping address, password).</p>
      <Button variant="outline" className="mt-2">
        Update Settings
      </Button>
    </div>
  );
};

export default SettingsSection;