import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (

    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
      <div>
        <p className="text-sm font-medium text-gray-900">
          {user?.username || "User"}
        </p>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded bg-gray-900 px-3 py-1 text-sm text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
