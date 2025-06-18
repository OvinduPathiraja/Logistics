import { Edit, Eye, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';

interface CognitoUser {
  username: string;
  email: string;
  name: string;
  phone?: string;
  group?: string;
  status: string;
}

const AdminUserList: React.FC = () => {
  const auth = useAuth();
  const isAdmin = (auth.user?.profile?.['cognito:groups'] as string[] | undefined)?.includes('Admins');
  const [users, setUsers] = useState<CognitoUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (!isAdmin) return;

  const fetchUsers = async () => {
    try {
        const res = await fetch('https://qdazv9v0ji.execute-api.eu-north-1.amazonaws.com/prod');
        if (!res.ok) throw new Error('Failed to fetch users');

        const data = await res.json();

        const parsed = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;

        if (!Array.isArray(parsed)) throw new Error('Invalid response format (expected array)');

        setUsers(parsed);
    } catch (err: any) {
        console.error('User fetch error:', err);
        setError(err.message || 'Unknown error');
    } finally {
        setLoading(false);
    }
    };


    fetchUsers();
    }, [isAdmin]);


  if (!isAdmin) {
    return <div className="p-6 text-red-600">Access Denied: Admins only</div>;
  }

  if (loading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Cognito Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Email', 'Group'].map(header => (
                <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user,index) => (
              <tr key={user.username} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{user.email}</td>
                <td className="px-4 py-2 text-sm">{user.group || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                        <button className="text-green-600 hover:text-green-900"><Edit className="h-4 w-4" /></button>
                        <button className="text-red-600 hover:text-red-900"><Trash className="h-4 w-4" /></button>
                      </div>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserList;
