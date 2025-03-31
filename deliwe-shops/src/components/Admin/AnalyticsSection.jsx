const AnalyticsSection = () => (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">150</p>
          <p className="text-gray-600">Total Sales</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">45</p>
          <p className="text-gray-600">Pending Orders</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">300</p>
          <p className="text-gray-600">Users</p>
        </div>
      </div>
    </div>
  );
  
  export default AnalyticsSection;