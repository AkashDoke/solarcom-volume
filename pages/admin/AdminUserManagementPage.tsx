
import React, { useState, useEffect } from 'react';
import { SectionWrapper, Card, LoadingSpinner, Alert, Badge } from '../../components/CommonUI';
import { User } from '../../types';
import { MOCK_USERS } from '../../constants'; // Using mock users for now

// Simulate fetching users (replace with actual API call in a real app)
const fetchMockUsers = (): Promise<User[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_USERS);
    }, 500);
  });
};

const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchMockUsers()
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching mock users:", err);
        setError("Failed to load user data.");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <SectionWrapper title="User Management">
        <LoadingSpinner />
      </SectionWrapper>
    );
  }

  if (error) {
    return (
      <SectionWrapper title="User Management">
        <Alert type="error" message={error} />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title="User Management">
      <Card className="p-0 overflow-x-auto"> {/* p-0 to allow table to span full width if needed */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Badge 
                    text={user.role === 'admin' ? 'Admin' : 'User'} 
                    color={user.role === 'admin' ? 'primary' : 'gray'} 
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary hover:text-green-700 mr-2" disabled>Edit</button>
                  <button className="text-red-600 hover:text-red-800" disabled>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
            <p className="p-4 text-center text-gray-500">No users found.</p>
        )}
      </Card>
      <p className="text-sm text-gray-500 mt-4 text-center">User editing and deletion are disabled in this demo.</p>
    </SectionWrapper>
  );
};

export default AdminUserManagementPage;
