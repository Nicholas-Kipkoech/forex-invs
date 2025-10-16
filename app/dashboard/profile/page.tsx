"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Edit2, LogOut } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndInvestor = async () => {
      const { data } = await supabase.auth.getUser();
      const authUser = data.user;
      if (authUser) {
        setUser(authUser);
        setName(authUser.user_metadata?.name || "");
        setPhone(authUser.user_metadata?.phone || "");

        // Fetch investor record (if it exists)
        const { data: investor } = await supabase
          .from("investors")
          .select("name, phone")
          .eq("user_id", authUser.id)
          .single();

        if (investor) {
          setName(investor.name || "");
          setPhone(investor.phone || "");
        }
      }
    };
    fetchUserAndInvestor();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleSave() {
    if (!user) return;

    // ✅ 1. Update Supabase Auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: { name, phone },
    });
    if (authError) return alert(authError.message);

    // ✅ 2. Update or insert in investor table
    const { error: dbError } = await supabase.from("investors").upsert(
      {
        user_id: user.id,
        name,
        phone,
      },
      { onConflict: "user_id" }
    ); // 👈 tells Supabase to update instead of insert);

    if (dbError) return alert(dbError.message);

    setUser({ ...user, user_metadata: { ...user.user_metadata, name, phone } });
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
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-3xl font-bold text-emerald-700">
              {name?.[0] || user.email?.[0] || "U"}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border border-emerald-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <Button
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
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
                  {phone && (
                    <p className="text-sm text-emerald-700 mt-1">📞 +{phone}</p>
                  )}
                </div>
              )}
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

          {/* Account Info */}
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
