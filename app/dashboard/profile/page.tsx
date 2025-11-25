"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Edit2, LogOut, User } from "lucide-react";
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

    const { error: authError } = await supabase.auth.updateUser({
      data: { name, phone },
    });
    if (authError) return alert(authError.message);

    const { error: dbError } = await supabase.from("investors").upsert(
      {
        user_id: user.id,
        name,
        phone,
      },
      { onConflict: "user_id" }
    );

    if (dbError) return alert(dbError.message);

    setUser({ ...user, user_metadata: { ...user.user_metadata, name, phone } });
    setEditing(false);
    alert("Profile updated!");
  }

  return (
    <div className="max-w-3xl mx-auto bg-black rounded-3xl shadow-xl p-8 border border-gray-800 text-white">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 border-white text-black hover:bg-white hover:text-black"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>

      {user ? (
        <div className="flex flex-col gap-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
              {name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || (
                <User className="h-10 w-10 text-white" />
              )}
            </div>

            <div className="flex-1">
              {editing ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="border border-white rounded-xl px-3 py-2 bg-black text-white focus:ring-2 focus:ring-white focus:outline-none"
                  />
                  <PhoneInput
                    country={"us"}
                    value={phone}
                    onChange={(value) => setPhone(value)}
                    inputClass="!w-full !border !border-white !rounded-xl !px-3 !py-2 !bg-black !text-white focus:!ring-2 focus:!ring-white"
                  />
                  <Button
                    onClick={handleSave}
                    className="bg-white text-black font-medium rounded-xl hover:bg-gray-200"
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold">{name || "N/A"}</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1 border-white hover:bg-gray-900 rounded-xl text-black"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </Button>
                  </div>
                  {phone && (
                    <p className="text-sm text-gray-400">📞 +{phone}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="bg-gray-900 border border-gray-700 p-4 rounded-2xl shadow-sm">
            <span className="text-sm text-gray-400">Email</span>
            <p className="font-medium mt-1">{user.email}</p>
          </div>

          {/* Account ID */}
          <div className="bg-gray-900 border border-gray-700 p-4 rounded-2xl shadow-sm">
            <span className="text-sm text-gray-400">Account ID</span>
            <p className="font-mono mt-1 text-sm truncate">{user.id}</p>
          </div>

          {/* Account Info */}
          <div className="bg-gray-900 border border-gray-700 p-4 rounded-2xl shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Account Status</span>
                <p className="font-medium mt-1">Active</p>
              </div>
              <div>
                <span className="text-gray-400">Member Since</span>
                <p className="font-medium mt-1">
                  {new Date(user.created_at).toDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading profile...</p>
      )}
    </div>
  );
}
