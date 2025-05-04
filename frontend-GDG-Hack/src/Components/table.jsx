// src/components/ui/table.jsx
import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      <tr>{children}</tr>
    </thead>
  );
}

export function TableRow({ children, className = '' }) {
  return (
    <tr className={`bg-white hover:bg-gray-100 ${className}`}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }) {
  return (
    <th
      scope="col"
      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}
