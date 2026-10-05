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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
            <p className="text-gray-400">Manage your account information</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 border-white/20 bg-white/5 hover:bg-white/10 text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>

      {user ? (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-4xl font-bold text-slate-900 shadow-lg">
                {name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || (
                  <User className="h-12 w-12 text-slate-900" />
                )}
              </div>

              <div className="flex-1">
                {editing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                    <PhoneInput
                      country={"us"}
                      value={phone}
                      onChange={(value) => setPhone(value)}
                      containerClass="w-full"
                      inputClass="!w-full !h-[42px] !bg-white/5 !border !border-white/10 !text-white !rounded-lg !pl-14 focus:!border-emerald-500/50 focus:!ring-2 outline-none"
                      buttonClass="!bg-white/10 !border-white/10 !rounded-l-lg"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setEditing(false)}
                        variant="outline"
                        className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">
                        {name || "User"}
                      </h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-1 border-white/20 bg-white/5 hover:bg-white/10 text-white"
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
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <span className="text-sm text-gray-400 mb-2 block">Email</span>
              <p className="font-medium text-white">{user.email}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <span className="text-sm text-gray-400 mb-2 block">Account ID</span>
              <p className="font-mono text-sm text-white truncate">{user.id}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <span className="text-sm text-gray-400 mb-2 block">Account Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <p className="font-medium text-white">Active</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <span className="text-sm text-gray-400 mb-2 block">Member Since</span>
              <p className="font-medium text-white">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      )}
      </div>
    </div>
  );
}
