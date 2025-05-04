// src/components/UserRequests.jsx
import React from "react";

const UserRequests = () => {
  const requests = [
    { category: "Plumbing", issue: "Leaking pipe", offerPrice: "2000", userId: "U-001" },
    { category: "Electrical", issue: "Faulty wiring", offerPrice: "1500", userId: "U-002" },
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">User Service Requests</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-200">
            <tr className="text-center">
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Issue Description</th>
              <th className="p-2 border">Offer Price</th>
              <th className="p-2 border">User ID</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={index} className="text-center border-t">
                <td className="p-2 border">{req.category}</td>
                <td className="p-2 border">{req.issue}</td>
                <td className="p-2 border">{req.offerPrice}</td>
                <td className="p-2 border">{req.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserRequests;
