// src/components/RegisteredUsers.jsx
import React from "react";

const RegisteredUsers = () => {
  const users = [
    {
      name: "Ali Khan",
      email: "ali@example.com",
      password: "********",
      dob: "01/01/1990",
      cnic: "12345-6789012-3",
      phone: "0300-1234567",
      gender: "Male",
      location: "Lahore",
    },
    {
      name: "Sana Malik",
      email: "sana@example.com",
      password: "********",
      dob: "05/12/1992",
      cnic: "54321-0987654-1",
      phone: "0311-7654321",
      gender: "Female",
      location: "Karachi",
    },
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Registered Users</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-200">
            <tr className="text-center">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Password</th>
              <th className="p-2 border">DOB</th>
              <th className="p-2 border">CNIC</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Location</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="text-center border-t">
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.password}</td>
                <td className="p-2 border">{user.dob}</td>
                <td className="p-2 border">{user.cnic}</td>
                <td className="p-2 border">{user.phone}</td>
                <td className="p-2 border">{user.gender}</td>
                <td className="p-2 border">{user.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredUsers;
