import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { sanitizeInput, validateEmail } from "@/lib/utils";
import { NotificationData } from "@/lib/types";

// Validate environment variables
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const notifyEmail = process.env.NOTIFY_EMAIL;

if (!smtpHost || !smtpUser || !smtpPass || !notifyEmail) {
  console.warn(
    "SMTP configuration incomplete. Email notifications will not work."
  );
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: Number(smtpPort) || 587,
  secure: false,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export async function POST(req: Request) {
  try {
    // Validate SMTP configuration
    if (!smtpHost || !smtpUser || !smtpPass || !notifyEmail) {
      return NextResponse.json(
        { message: "Email service is not configured" },
        { status: 503 }
      );
    }

    const data: NotificationData = await req.json();
    const { type, name, email, phone, depositAmount, withdrawalAmount, file } =
      data;

    // Validation
    if (!type || !name || !email) {
      return NextResponse.json(
        { message: "Missing required fields: type, name, and email are required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = phone ? sanitizeInput(phone) : undefined;

    let subject = "";
    let html = "";
    let attachments: { filename: string; content: string; encoding: string }[] =
      [];

    // ✅ New user registration
    if (type === "registration") {
      subject = `🎉 New User Registration: ${sanitizedName}`;
      html = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <div style="background:#f0fdf4;padding:20px;border-radius:10px;text-align:center;">
          <h2 style="color:#059669;">New User Registration</h2>
          <p>A new user has just registered on Forex Managed Investments.</p>
        </div>
        <div style="margin-top:20px;padding:20px;border:1px solid #d1fae5;border-radius:10px;">
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Phone Number:</strong> ${sanitizedPhone || "N/A"}</p>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#777;">This is an automated notification from Forex Managed Investments.</p>
      </div>`;
    }

    // 💰 Deposit notification
    else if (type === "deposit") {
      if (!depositAmount) {
        return NextResponse.json(
          { message: "Deposit amount is required for deposit notifications" },
          { status: 400 }
        );
      }

      subject = `💰 New Deposit by ${sanitizedName}`;
      html = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <div style="background:#f0fdf4;padding:20px;border-radius:10px;text-align:center;">
          <h2 style="color:#059669;">New Deposit Notification</h2>
          <p>A user has made a deposit. Details below:</p>
        </div>
        <div style="margin-top:20px;padding:20px;border:1px solid #d1fae5;border-radius:10px;">
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Deposit Amount:</strong> ${sanitizeInput(depositAmount)}</p>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#777;">This is an automated notification from Forex Managed Investments.</p>
      </div>`;

      if (file && file.base64 && file.filename && file.mimetype) {
        // Validate file size (max 10MB)
        const fileSize = Buffer.from(file.base64, "base64").length;
        if (fileSize > 10 * 1024 * 1024) {
          return NextResponse.json(
            { message: "File size exceeds 10MB limit" },
            { status: 400 }
          );
        }
        attachments.push({
          filename: sanitizeInput(file.filename),
          content: file.base64,
          encoding: "base64",
        });
      }
    }

    // 💸 Withdrawal request notification
    else if (type === "withdrawal") {
      if (!withdrawalAmount) {
        return NextResponse.json(
          {
            message:
              "Withdrawal amount is required for withdrawal notifications",
          },
          { status: 400 }
        );
      }

      subject = `💸 Withdrawal Request from ${sanitizedName}`;
      html = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <div style="background:#fef3c7;padding:20px;border-radius:10px;text-align:center;">
          <h2 style="color:#b45309;">Withdrawal Request Received</h2>
          <p>An investor has requested a crypto withdrawal. Details below:</p>
        </div>
        <div style="margin-top:20px;padding:20px;border:1px solid #fde68a;border-radius:10px;">
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Requested Amount:</strong> ${sanitizeInput(withdrawalAmount)}</p>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#777;">This is an automated notification from Forex Managed Investments.</p>
      </div>`;
    }

    // ✅ Withdrawal completed notification (optional future use)
    else if (type === "withdrawal_complete") {
      if (!withdrawalAmount) {
        return NextResponse.json(
          { message: "Withdrawal amount is required" },
          { status: 400 }
        );
      }

      subject = `✅ Withdrawal Completed for ${sanitizedName}`;
      html = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <div style="background:#dcfce7;padding:20px;border-radius:10px;text-align:center;">
          <h2 style="color:#166534;">Withdrawal Completed</h2>
          <p>The following withdrawal has been successfully processed:</p>
        </div>
        <div style="margin-top:20px;padding:20px;border:1px solid #bbf7d0;border-radius:10px;">
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Amount:</strong> ${sanitizeInput(withdrawalAmount)}</p>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#777;">This is an automated notification from Forex Managed Investments.</p>
      </div>`;
    } else {
      return NextResponse.json(
        { message: "Invalid notification type. Must be one of: registration, deposit, withdrawal, withdrawal_complete" },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      from: `"Forex Managed Investments" <${smtpUser}>`,
      to: notifyEmail,
      subject,
      html,
      attachments,
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending notification email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send email";
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
