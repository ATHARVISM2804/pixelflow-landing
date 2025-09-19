import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No captcha token provided' },
        { status: 400 }
      );
    }

    if (!SECRET_KEY) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, message: 'Captcha verified successfully' });
    } else {
      return NextResponse.json(
        { success: false, message: 'Captcha verification failed', errors: data['error-codes'] },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during captcha verification' },
      { status: 500 }
    );
  }
}
