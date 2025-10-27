# 🚀 Supabase Setup Guide for Portfolio

## Step 1: Test Current Setup

1. **Visit**: `http://localhost:3000/debug-supabase`
2. **Click**: "Test Connection" button
3. **Check**: What errors appear

## Step 2: Create Storage Buckets

### Option A: Use Debug Tool
1. **Go to**: `http://localhost:3000/debug-supabase`
2. **Click**: "Create Storage Buckets" button

### Option B: Manual Setup in Supabase Dashboard
1. **Go to**: https://supabase.com/dashboard/project/sseahcmjacelbdcapttd
2. **Click**: "Storage" in left sidebar
3. **Click**: "New bucket"
4. **Create bucket**: `avatars`
   - **Public**: ✅ Yes
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/*`
5. **Create bucket**: `resumes`
   - **Public**: ✅ Yes
   - **File size limit**: 10MB
   - **Allowed MIME types**: `application/pdf`

## Step 3: Update Database Schema

1. **Go to**: https://supabase.com/dashboard/project/sseahcmjacelbdcapttd
2. **Click**: "SQL Editor" in left sidebar
3. **Run this SQL**:

```sql
-- Add missing column for fun image
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fun_image_url TEXT;

-- Update existing profile with current values
UPDATE profiles SET 
  avatar_url = '/profile.png',
  square_avatar_url = '/avatar.png'
WHERE id = (SELECT id FROM profiles LIMIT 1);
```

## Step 4: Test Image Upload

1. **Go to**: `http://localhost:3000/admin`
2. **Scroll to**: "Image Management" section
3. **Try uploading**: A small image file (< 5MB)
4. **Check browser console**: For detailed error messages

## Step 5: Verify Everything Works

1. **Test Supabase**: `http://localhost:3000/test-supabase`
2. **Test Admin**: `http://localhost:3000/admin`
3. **Test Avatar**: Go to chat page and see if avatar appears

## Common Issues & Solutions

### ❌ "Bucket not found" Error
**Solution**: Create the `avatars` bucket in Supabase Storage

### ❌ "Column does not exist" Error
**Solution**: Run the SQL to add `fun_image_url` column

### ❌ "Permission denied" Error
**Solution**: Make sure buckets are set to public

### ❌ "File too large" Error
**Solution**: Use images smaller than 5MB

### ❌ "Invalid file type" Error
**Solution**: Use only image files (jpg, png, gif, etc.)

## Quick Fix Commands

If you need to reset everything:

```sql
-- Delete and recreate profiles table
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;

-- Then run the full schema from supabase-schema.sql
```

## Success Indicators

✅ **Debug tool shows**: "All tests passed! Ready to upload images."
✅ **Admin upload works**: No error messages
✅ **Avatar appears**: In chat page with your new image
✅ **Console shows**: Successful upload messages

## Need Help?

1. **Check browser console** for detailed error messages
2. **Use debug tool** at `/debug-supabase` to diagnose issues
3. **Verify Supabase project** has correct URL and keys in `.env.local`
