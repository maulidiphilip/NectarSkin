import { Button } from "@/components/ui/button";

const UsersSection = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Users</h2>
    <div className="space-y-4">
      <Button className="bg-amber-600 hover:bg-amber-700">View All Users</Button>
      <div className="border rounded-lg p-4">
        <p className="text-gray-900 font-medium">Takondwa Maulidi</p>
        <p className="text-gray-600">Role: Admin</p>
        <Button variant="outline" className="mt-2">Edit Role</Button>
      </div>
    </div>
  </div>
);

export default UsersSection;