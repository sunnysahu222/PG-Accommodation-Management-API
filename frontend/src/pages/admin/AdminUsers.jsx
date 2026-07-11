import { useAdminUsers, useBlockUser } from '../../hooks/useAdmin';
import Button from '../../components/Button';

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();
  const blockUser = useBlockUser();

  if (isLoading) return <p className="text-gray-500">Loading users...</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-t border-gray-100 dark:border-gray-700">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">{u.verified ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="danger" onClick={() => blockUser.mutate(u.id)} isLoading={blockUser.isPending}>
                    Block
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
