import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { type, name, email, phone, depositAmount, withdrawalAmount, file } =
      data;

    if (!type || !name || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    let subject = "";
    let html = "";
    let attachments: { filename: string; content: string; encoding: string }[] =
      [];

    // ✅ New user registration
    if (type === "registration") {
      subject = `🎉 New User Registration: ${name}`;
      html = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <div style="background:#f0fdf4;padding:20px;border-radius:10px;text-align:center;">
          <h2 style="color:#059669;">New User Registration</h2>
          <p>A new user has just registered on Forex Managed Investments.</p>
        </div>
        <div style="margin-top:20px;padding:20px;border:1px solid #d1fae5;border-radius:10px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${phone || "N/A"}</p>
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

      subject = `💰 New Deposit by ${name}`;
      html = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <div style="background:#f0fdf4;padding:20px;border-radius:10px;text-align:center;">
          <h2 style="color:#059669;">New Deposit Notification</h2>
          <p>A user has made a deposit. Details below:</p>
        </div>
        <div style="margin-top:20px;padding:20px;border:1px solid #d1fae5;border-radius:10px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Deposit Amount:</strong> ${depositAmount}</p>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#777;">This is an automated notification from Forex Managed Investments.</p>
      </div>`;

      if (file && file.base64 && file.filename && file.mimetype) {
        attachments.push({
          filename: file.filename,
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

      subject = `💸 Withdrawal Request from ${name}`;
      html = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <div style="background:#fef3c7;padding:20px;border-radius:10px;text-align:center;">
          <h2 style="color:#b45309;">Withdrawal Request Received</h2>
          <p>An investor has requested a crypto withdrawal. Details below:</p>
        </div>
        <div style="margin-top:20px;padding:20px;border:1px solid #fde68a;border-radius:10px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Requested Amount:</strong> ${withdrawalAmount}</p>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#777;">This is an automated notification from Forex Managed Investments.</p>
      </div>`;
    }

    // ✅ Withdrawal completed notification (optional future use)
    else if (type === "withdrawal_complete") {
      subject = `✅ Withdrawal Completed for ${name}`;
      html = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <div style="background:#dcfce7;padding:20px;border-radius:10px;text-align:center;">
          <h2 style="color:#166534;">Withdrawal Completed</h2>
          <p>The following withdrawal has been successfully processed:</p>
        </div>
        <div style="margin-top:20px;padding:20px;border:1px solid #bbf7d0;border-radius:10px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Amount:</strong> ${withdrawalAmount}</p>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#777;">This is an automated notification from Forex Managed Investments.</p>
      </div>`;
    } else {
      return NextResponse.json(
        { message: "Invalid notification type" },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      from: `"Forex Managed Investments" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject,
      html,
      attachments,
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
