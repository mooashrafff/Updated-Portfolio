# Email Confirmation Setup Guide

## 📧 Resend Email Service Setup

To enable automatic confirmation emails when clients submit the contact form, you need to set up Resend:

### 1. Create Resend Account
- Go to [resend.com](https://resend.com)
- Sign up for a free account
- Verify your email address

### 2. Get API Key
- Go to [API Keys](https://resend.com/api-keys)
- Create a new API key
- Copy the key

### 3. Add Environment Variable
Add this to your `.env.local` file:
```
RESEND_API_KEY=your_resend_api_key_here
```

### 4. Domain Setup (Optional but Recommended)
- Add your domain to Resend
- Update the "from" email in `/src/app/api/send-confirmation-email/route.ts`
- Change `noreply@mohamedashraf.dev` to your actual domain

### 5. Test the Feature
1. Submit the contact form
2. Check the client's email for confirmation
3. Check your Supabase messages table for the form data

## 🎯 What Happens Now

When a client submits the contact form:
1. ✅ Form data is saved to Supabase
2. ✅ Confirmation email is sent to client
3. ✅ Client receives professional thank you email
4. ✅ You get notified via Supabase dashboard

## 📧 Email Template Features

The confirmation email includes:
- Professional greeting with client's name
- Project brief summary
- Next steps explanation
- Your contact information
- Social media links
- Professional branding

## 🔧 Troubleshooting

If emails aren't sending:
1. Check your Resend API key
2. Verify domain setup
3. Check browser console for errors
4. Ensure `.env.local` is in project root
5. Restart your development server

## 📊 Free Tier Limits

Resend free tier includes:
- 3,000 emails/month
- 100 emails/day
- Perfect for portfolio contact forms
