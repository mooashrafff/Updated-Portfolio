import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Email API called');
    const { name, email, brief } = await request.json();
    console.log('Email data received:', { name, email, brief });

    if (!name || !email || !brief) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email using EmailJS
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID || 'service_r4jfnon',
        template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_zmxbvvb',
        user_id: process.env.EMAILJS_PUBLIC_KEY || 'CdLqLAX6Pnlyf5jw4',
        template_params: {
          to_name: name,
          to_email: email,
          message: brief,
          from_name: 'Mohamed Ashraf',
          reply_to: 'mohamedashrafalsawyy@gmail.com'
        }
      })
    });

    const emailResult = await emailResponse.json();
    console.log('EmailJS response:', emailResult);

    if (!emailResponse.ok) {
      console.warn('EmailJS sending failed, but form was submitted successfully');
      return NextResponse.json(
        { error: 'Email sending failed', details: emailResult },
        { status: 500 }
      );
    }

    console.log('Email sent successfully via EmailJS');
    return NextResponse.json(
      { message: 'Confirmation email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
