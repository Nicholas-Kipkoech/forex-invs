// Environment variable validation

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || "";
}

export const env = {
  // Supabase
  supabaseUrl: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "", // Only on server

  // SMTP
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: process.env.SMTP_PORT || "587",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  notifyEmail: process.env.NOTIFY_EMAIL || "",
};

// Validate required client-side env vars
if (typeof window === "undefined") {
  // Server-side validation
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      "Missing required Supabase environment variables. Please check your .env file."
    );
  }
}

