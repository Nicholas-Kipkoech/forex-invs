"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Edit2, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setName(data.user.user_metadata?.name || "");
      }
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleSave() {
    if (!user) return;
    const { error } = await supabase.auth.updateUser({
      data: { name },
    });
    if (error) return alert(error.message);
    setUser({ ...user, user_metadata: { name } });
    setEditing(false);
    alert("Profile updated!");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-xl space-y-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-emerald-700">
          Your Profile
        </h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 text-rose-600 border-rose-200 hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>

      {user ? (
        <div className="flex flex-col gap-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-3xl font-bold text-emerald-700">
              {name?.[0] || user.email?.[0] || "U"}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-emerald-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <Button
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <h2 className="text-2xl font-semibold text-emerald-700">
                    {name || "N/A"}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1 border-emerald-300 hover:bg-emerald-50"
                  >
                    <Edit2 className="h-4 w-4" /> Edit
                  </Button>
                </div>
              )}
              <p className="text-sm text-slate-500 mt-1">Full Name</p>
            </div>
          </div>

          {/* Email */}
          <div className="bg-emerald-50 p-4 rounded-2xl shadow flex flex-col">
            <span className="text-sm text-slate-500">Email</span>
            <p className="font-medium text-emerald-700 mt-1">{user.email}</p>
          </div>

          {/* Account ID */}
          <div className="bg-emerald-50 p-4 rounded-2xl shadow flex flex-col">
            <span className="text-sm text-slate-500">Account ID</span>
            <p className="font-mono text-emerald-700 mt-1">{user.id}</p>
          </div>

          {/* Additional Info Placeholder */}
          <div className="bg-emerald-50 p-4 rounded-2xl shadow flex flex-col space-y-2">
            <span className="text-sm text-slate-500">Account Status</span>
            <p className="text-emerald-700 font-medium">Active</p>

            <span className="text-sm text-slate-500">Member Since</span>
            <p className="text-emerald-700 font-medium">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-slate-500 text-center">Loading profile...</p>
      )}
    </div>
  );
}
