# Gmail SMTP Setup Guide

This guide will help you configure Gmail to send OTP emails for instructor password setup.

## Step 1: Enable 2-Factor Authentication on Your Gmail Account

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google," enable **2-Step Verification** if not already enabled
4. Follow the prompts to set it up

## Step 2: Generate an App Password

1. After enabling 2-Step Verification, go back to **Security**
2. Under "Signing in to Google," click on **App passwords** (or visit: https://myaccount.google.com/apppasswords)
3. You may need to sign in again
4. Select **Mail** for the app and **Other (Custom name)** for the device
5. Enter a name like "MeroSphere Backend" 
6. Click **Generate**
7. Google will display a 16-character password (example: `abcd efgh ijkl mnop`)
8. **Copy this password** - you won't be able to see it again!

## Step 3: Update Your .env File

Open `backend/.env` and update these lines:

```env
# Replace with your actual Gmail address
EMAIL_USER=your-email@gmail.com

# Replace with the 16-character app password (remove spaces)
EMAIL_PASSWORD=abcdefghijklmnop

# Update the from name if desired
EMAIL_FROM=MeroSphere <your-email@gmail.com>
```

## Step 4: Restart Your Backend Server

After updating the .env file, restart your backend server:

```bash
cd backend
npm run dev
```

## Testing

1. Admin creates an instructor with their email
2. Instructor clicks "Forgot Password" on login page
3. Instructor enters their email and clicks "Send OTP"
4. **OTP should now be sent to their real Gmail inbox!**

## Troubleshooting

### Error: "Invalid login"
- Make sure you're using an App Password, not your regular Gmail password
- Ensure 2-Step Verification is enabled on your Google account

### Error: "Username and Password not accepted"
- Double-check the EMAIL_USER matches your Gmail address exactly
- Verify the App Password has no spaces

### Emails not arriving
- Check spam/junk folder
- Verify the recipient email is correct
- Check backend console for error messages
- Make sure you restarted the server after updating .env

### Still having issues?
- Try generating a new App Password
- Make sure "Less secure app access" is OFF (use App Passwords instead)
- Check Google account activity to see if login attempts were blocked

## Security Notes

- **Never commit your .env file to Git** (it's in .gitignore)
- The App Password is specific to this application
- You can revoke App Passwords anytime from Google Account settings
- Consider using environment variables in production (not .env file)
