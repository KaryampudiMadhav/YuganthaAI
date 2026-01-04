# MongoDB Atlas Setup Guide

## Step-by-Step Instructions

### 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Click "Try Free"
- Sign up with email or Google

### 2. Create a Cluster
- After login, click "Build a Database"
- Select **FREE** M0 tier
- Choose cloud provider (AWS, Google Cloud, or Azure)
- Select region closest to you
- Cluster Name: Keep default or name it "Cluster0"
- Click "Create"
- Wait 3-5 minutes for cluster to deploy

### 3. Create Database User
- Click "Database Access" in left sidebar
- Click "Add New Database User"
- **Authentication Method:** Password
- **Username:** Choose a username (e.g., `merosphereuser`)
- **Password:** Click "Autogenerate Secure Password" and COPY it
- **Database User Privileges:** Select "Read and write to any database"
- Click "Add User"

**IMPORTANT:** Save your username and password securely!

### 4. Configure Network Access
- Click "Network Access" in left sidebar
- Click "Add IP Address"
- For development, click "Allow Access from Anywhere"
  - This adds `0.0.0.0/0` (all IPs)
- Click "Confirm"
- Wait for status to become "Active"

**Note:** For production, you should restrict this to specific IPs

### 5. Get Connection String
- Click "Database" in left sidebar
- Click "Connect" button on your cluster
- Select "Connect your application"
- **Driver:** Node.js
- **Version:** 4.1 or later
- Copy the connection string

It will look like:
```
mongodb+srv://merosphereuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Update Your .env File
Open `backend/.env` and update:

```env
MONGODB_URI=mongodb+srv://merosphereuser:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/merosphere?retryWrites=true&w=majority
```

**Replace:**
- `merosphereuser` with your actual username
- `YOUR_PASSWORD_HERE` with your actual password (the one you saved)
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

**Add database name:**
- Add `/merosphere` before the `?` to specify database name

### 7. Test Connection
Run your backend server:
```bash
cd backend
npm run dev
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

## Common Issues

### Issue 1: Authentication Failed
- Double-check username and password
- Make sure password doesn't contain special characters that need URL encoding
- If password has special chars, encode them: `@` → `%40`, `:` → `%3A`, etc.

### Issue 2: Network Timeout
- Verify "Network Access" has your IP whitelisted
- Check if firewall is blocking MongoDB Atlas

### Issue 3: Connection String Error
- Make sure you replaced `<password>` with actual password
- Ensure no extra spaces in connection string
- Database name should be between `/` and `?`

## Connection String Format

```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

Example:
```
mongodb+srv://john:Pass123@cluster0.abc12.mongodb.net/merosphere?retryWrites=true&w=majority
```

## Security Best Practices

1. **Never commit .env file** - Already in .gitignore
2. **Use strong passwords** - Use generated passwords
3. **Restrict IP access** - In production, whitelist only your server IP
4. **Rotate credentials** - Change passwords periodically
5. **Use environment variables** - Never hardcode credentials

## Need Help?

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- Connection Troubleshooting: https://docs.atlas.mongodb.com/troubleshoot-connection/
