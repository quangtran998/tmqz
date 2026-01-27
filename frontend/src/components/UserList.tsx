'use client';

interface OnlineUser {
  id: string;
  username: string;
}

interface UserListProps {
  users: OnlineUser[];
  currentUserId: string;
}

export default function UserList({ users, currentUserId }: UserListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Online Users ({users.length})
      </h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-gray-700">
              {user.username}
              {user.id === currentUserId && (
                <span className="text-xs text-gray-400 ml-1">(you)</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
