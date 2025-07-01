# Authentication System Setup Guide

## Overview
This guide will help you set up a complete authentication system with user profiles using Supabase.

## Issues Fixed
1. ✅ **Missing `profiles` table** - Created proper database structure
2. ✅ **Inconsistent data structure** - Standardized field names
3. ✅ **Missing profile update functionality** - Added complete CRUD operations
4. ✅ **Poor error handling** - Improved error handling and logging
5. ✅ **No automatic profile creation** - Added database triggers

## Step 1: Database Setup

### Run the SQL Script
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `database_setup.sql`
4. Click **Run**

This will create:
- `profiles` table with proper structure
- Row Level Security (RLS) policies
- Automatic profile creation trigger
- Updated timestamp trigger

## Step 2: Verify Database Structure

After running the SQL script, you should see:

### Tables
- `auth.users` (Supabase built-in)
- `public.profiles` (newly created)

### Policies
- Users can view own profile
- Users can insert own profile  
- Users can update own profile
- Users can delete own profile

### Functions
- `handle_new_user()` - Creates profile on signup
- `handle_updated_at()` - Updates timestamp on changes

## Step 3: Test the System

### Option 1: Use the Test Page
1. Navigate to `/auth-test` in your app
2. Use the test controls to verify functionality

### Option 2: Manual Testing
1. Sign up with a new email
2. Check that profile is automatically created
3. Sign in and verify profile data loads
4. Update profile information
5. Sign out and back in to verify persistence

## Step 4: Features Available

### Authentication
- ✅ User registration with email/password
- ✅ User login/logout
- ✅ Session management
- ✅ Password reset (ready to implement)

### Profile Management
- ✅ Automatic profile creation on signup
- ✅ Profile data fetching
- ✅ Profile data updating
- ✅ User display name generation
- ✅ User initials generation

### Security
- ✅ Row Level Security (RLS)
- ✅ User can only access own data
- ✅ Proper error handling
- ✅ Input validation

## Step 5: Troubleshooting

### Common Issues

#### "Could not find the 'full_name' column"
- **Solution**: Run the database setup SQL script
- **Cause**: Missing `profiles` table or columns

#### "Cannot insert a non-DEFAULT value into column 'id'"
- **Solution**: Don't specify `id` in INSERT statements
- **Cause**: `id` is auto-generated UUID

#### Profile not loading after signup
- **Solution**: Check browser console for errors
- **Cause**: Database trigger might not be working

#### RLS policy errors
- **Solution**: Verify user is authenticated
- **Cause**: Policies require authenticated user

### Debug Steps
1. Check browser console for errors
2. Verify database tables exist in Supabase
3. Check RLS policies are enabled
4. Verify triggers are working
5. Test with the AuthTest page

## Step 6: Customization

### Adding New Profile Fields
1. Add column to `profiles` table:
```sql
ALTER TABLE profiles ADD COLUMN new_field TEXT;
```

2. Update the `updateProfile` function in `AuthContext.jsx`
3. Update the `UserProfile.jsx` component
4. Update the database trigger if needed

### Changing Field Names
1. Update database schema
2. Update all references in code
3. Migrate existing data if needed

## Step 7: Production Considerations

### Security
- ✅ RLS policies are enabled
- ✅ User data is properly isolated
- ✅ No sensitive data in client-side code

### Performance
- ✅ Efficient queries with proper indexing
- ✅ Minimal database calls
- ✅ Proper error handling

### Scalability
- ✅ UUID primary keys
- ✅ Proper foreign key relationships
- ✅ Timestamp tracking

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify the database setup was completed
3. Test with the AuthTest page
4. Check Supabase logs for database errors

## Files Modified
- `src/contexts/AuthContext.jsx` - Enhanced with profile management
- `src/services/supabaseAuthService.js` - Added metadata support
- `src/components/auth/UserProfile.jsx` - Updated to use new context
- `src/components/Header.jsx` - Updated to use new context
- `database_setup.sql` - Complete database setup
- `src/pages/AuthTest.jsx` - Testing page
- `AUTH_SETUP.md` - This guide 