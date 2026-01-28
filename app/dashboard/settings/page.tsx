"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Mail,
  Smartphone,
  Key,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    tradeAlerts: true,
    copyTradeAlerts: true,
    priceAlerts: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "en",
    currency: "USD",
    timezone: "UTC",
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("sk_live_••••••••••••••••••••••••");

  const handleSave = () => {
    // In production, save to database
    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and security</p>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <div className="text-sm font-medium text-white capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {key === "email" && "Receive notifications via email"}
                    {key === "push" && "Browser push notifications"}
                    {key === "tradeAlerts" && "Alert when trades execute"}
                    {key === "copyTradeAlerts" && "Alert when copy trades execute"}
                    {key === "priceAlerts" && "Price movement alerts"}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setNotifications({ ...notifications, [key]: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div>
                <div className="text-sm font-medium text-white">Two-Factor Authentication</div>
                <div className="text-xs text-gray-400">
                  Add an extra layer of security to your account
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.twoFactor}
                  onChange={(e) =>
                    setSecurity({ ...security, twoFactor: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div>
                <div className="text-sm font-medium text-white">Login Alerts</div>
                <div className="text-xs text-gray-400">
                  Get notified when someone logs into your account
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.loginAlerts}
                  onChange={(e) =>
                    setSecurity({ ...security, loginAlerts: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm font-medium text-white mb-2">API Key</div>
              <div className="flex items-center gap-2">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm"
                />
                <Button
                  onClick={() => setShowApiKey(!showApiKey)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-white/5 hover:bg-white/10"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-white/5 hover:bg-white/10"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Use this key to access our API. Keep it secure and never share it.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Theme
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPreferences({ ...preferences, theme: "dark" })}
                  variant={preferences.theme === "dark" ? "default" : "outline"}
                  className={preferences.theme === "dark" ? "bg-emerald-500" : "border-white/20"}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
                <Button
                  onClick={() => setPreferences({ ...preferences, theme: "light" })}
                  variant={preferences.theme === "light" ? "default" : "outline"}
                  className={preferences.theme === "light" ? "bg-emerald-500" : "border-white/20"}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) =>
                  setPreferences({ ...preferences, language: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Currency
              </label>
              <select
                value={preferences.currency}
                onChange={(e) =>
                  setPreferences({ ...preferences, currency: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CNY">CNY (¥)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) =>
                  setPreferences({ ...preferences, timezone: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST (Eastern)</option>
                <option value="PST">PST (Pacific)</option>
                <option value="GMT">GMT (London)</option>
                <option value="CET">CET (Central Europe)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </motion.div>
      </div>
    </div>
  );
}


