import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome-email';

// Make sure to set RESEND_API_KEY in your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

// You can configure this to a verified domain in Resend.
// For development, 'onboarding@resend.dev' is a safe default.
const fromEmail = 'Danny Store <onboarding@resend.dev>';
const storeName = 'Danny Store';

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }
    
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "YOUR_API_KEY_HERE") {
        console.warn("RESEND_API_KEY is not set or is a placeholder. Skipping email sending for:", email);
        return NextResponse.json({ message: 'Email sending skipped: RESEND_API_KEY not configured.' }, { status: 200 });
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `Welcome to ${storeName}!`,
      react: WelcomeEmail({ name: name, storeName: storeName }),
      text: `Welcome to ${storeName}, ${name}! We're so excited to have you join our community.` // Add a text version for email clients that don't render HTML
    });

    if (error) {
        console.error("Resend error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (e) {
    const error = e as Error;
    console.error("Send email API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
