import { Button } from "@/components/ui/button";

const OrdersSection = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Orders</h2>
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <p className="text-gray-900 font-medium">Order #1234</p>
        <p className="text-gray-600">Status: Shipped</p>
        <Button variant="outline" className="mt-2">View Details</Button>
      </div>
    </div>
  </div>
);

export default OrdersSection;