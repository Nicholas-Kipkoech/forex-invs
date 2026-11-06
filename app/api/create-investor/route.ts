
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sanitizeInput } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables.");

      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    // Authenticate the requesting user.
    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const token = authorization.replace("Bearer ", "");

    const supabaseAuth = createClient(
      supabaseUrl,
      supabaseAnonKey
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired authentication token." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { user_id, name, phone } = body;

    // Users can only create their own investor profile.
    if (user_id !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to create this profile." },
        { status: 403 }
      );
    }

    if (
      !name ||
      typeof name !== "string" ||
      name.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (phone !== undefined && phone !== null && typeof phone !== "string") {
      return NextResponse.json(
        { error: "Invalid phone number." },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedPhone = phone ? sanitizeInput(phone) : null;

    // Admin client is only used after authentication.
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data, error } = await supabaseAdmin
      .from("investors")
      .insert({
        user_id: user.id,
        name: sanitizedName,
        balance: 0,
        phone: sanitizedPhone,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating investor:", error);

      return NextResponse.json(
        { error: "Failed to create investor profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });

  } catch (error) {
    console.error("Unexpected create-investor error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
