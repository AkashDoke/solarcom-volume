
import React from 'react';
import { Link } from 'react-router-dom';
import { SectionWrapper, Card, Button } from '../../components/CommonUI';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <SectionWrapper title="Admin Dashboard">
      <Card className="p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome, {user?.name || 'Admin'}!</h2>
        <p className="text-gray-600 mb-6">Manage your SolarCom platform from here.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-primary mb-2">User Management</h3>
            <p className="text-sm text-gray-600 mb-3">View and manage platform users.</p>
            <Link to="/admin/users">
              <Button variant="secondary" size="sm">Go to Users</Button>
            </Link>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-primary mb-2">Product Management</h3>
            <p className="text-sm text-gray-600 mb-3">Add, edit, or remove products from the store. (Coming Soon)</p>
            <Button variant="secondary" size="sm" disabled>Manage Products</Button>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-primary mb-2">Service Management</h3>
            <p className="text-sm text-gray-600 mb-3">Update available services and lead details. (Coming Soon)</p>
            <Button variant="secondary" size="sm" disabled>Manage Services</Button>
          </Card>

           <Card className="p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-primary mb-2">Lead Management</h3>
            <p className="text-sm text-gray-600 mb-3">View and track customer enquiries and leads. (Coming Soon)</p>
            <Button variant="secondary" size="sm" disabled>View Leads</Button>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-primary mb-2">Order Management</h3>
            <p className="text-sm text-gray-600 mb-3">Track and manage e-commerce orders. (Coming Soon)</p>
            <Button variant="secondary" size="sm" disabled>Manage Orders</Button>
          </Card>

           <Card className="p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-primary mb-2">Site Settings</h3>
            <p className="text-sm text-gray-600 mb-3">Configure platform settings. (Coming Soon)</p>
            <Button variant="secondary" size="sm" disabled>Configure Settings</Button>
          </Card>
        </div>
      </Card>
    </SectionWrapper>
  );
};

export default AdminDashboardPage;
