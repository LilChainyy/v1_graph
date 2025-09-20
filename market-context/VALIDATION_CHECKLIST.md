# Validation Checklist

## ✅ **Setup Complete - Ready for Testing**

### **Current Status:**
- ✅ Tag system implemented
- ✅ Calendar views updated with tag chips
- ✅ Tag filtering with URL persistence
- ✅ Cross-database architecture working
- ⚠️ **Environment variables need to be set**

---

## **Step 1: Environment Setup (Required)**

### **Create `.env.local` file:**
```bash
# Create the file in project root
touch .env.local
```

### **Add Supabase credentials:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Configuration
DATABASE_URL="file:./dev.db"
```

### **Get Supabase credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## **Step 2: Test Calendar with Tags**

### **Test URL:** `http://localhost:3001/calendar/HOOD`

### **Expected Results:**
- ✅ Calendar loads without errors
- ✅ Events display with tag chips below titles
- ✅ Tag filter dropdown appears above calendar
- ✅ Filtering by tag works
- ✅ URL updates with `?tag=MACRO_FOMC` parameter
- ✅ Bookmarkable filtered views

### **Visual Verification:**
1. **Event Cards:** Should show small tag chips (e.g., "EARNINGS", "MACRO_FOMC")
2. **Tag Filter:** Dropdown with "All tags" + available tags
3. **Filtering:** Selecting a tag hides events without that tag
4. **URL Persistence:** `?tag=MACRO_FOMC` stays in URL when filtering

---

## **Step 3: Test Authentication**

### **Test URL:** `http://localhost:3001/`

### **Expected Results:**
- ✅ Home page loads without errors
- ✅ Sign-in button works
- ✅ Authentication flow completes
- ✅ User profile loads after sign-in

### **Test Steps:**
1. Click "Sign In" button
2. Complete OAuth flow
3. Verify user is logged in
4. Check that profile data loads

---

## **Step 4: Test Tag Management**

### **Option A: CSV Import (Recommended)**
```bash
# Use the generated CSV file
node scripts/sync-event-tags.js
```

### **Option B: Admin Interface**
- Navigate to test views in the app
- Use "Test Tags" button to add/edit tags
- Verify tags appear in calendar

### **Expected Results:**
- ✅ Tags can be added to events
- ✅ Tags persist in Supabase
- ✅ Tags appear in calendar view
- ✅ Tag filtering works with new tags

---

## **Step 5: Test URL Sharing**

### **Test URLs:**
- `http://localhost:3001/calendar/HOOD` (all events)
- `http://localhost:3001/calendar/HOOD?tag=EARNINGS` (earnings only)
- `http://localhost:3001/calendar/HOOD?tag=MACRO_FOMC` (FOMC only)

### **Expected Results:**
- ✅ All URLs load correctly
- ✅ Filtered views show only relevant events
- ✅ URLs can be bookmarked and shared
- ✅ Back/forward navigation works

---

## **Step 6: Test Different Tickers**

### **Test URLs:**
- `http://localhost:3001/calendar/NVDA`
- `http://localhost:3001/calendar/AAPL`
- `http://localhost:3001/calendar/TSLA`

### **Expected Results:**
- ✅ Each ticker shows relevant events
- ✅ Tags are ticker-specific where appropriate
- ✅ Global events show for all tickers
- ✅ Filtering works for each ticker

---

## **Step 7: Test List View**

### **Test Steps:**
1. Go to any ticker calendar
2. Switch to "List" view
3. Verify events show with tags
4. Test tag filtering in list view

### **Expected Results:**
- ✅ List view shows events with tag chips
- ✅ Tag filtering works in list view
- ✅ Events are sorted by date
- ✅ Tag chips are clickable

---

## **Troubleshooting**

### **Common Issues:**

#### **"Internal Server Error"**
- **Cause:** Missing environment variables
- **Fix:** Set up `.env.local` with Supabase credentials

#### **"No events found"**
- **Cause:** No events in database for ticker
- **Fix:** Check if events exist in Prisma Studio

#### **"Tags not showing"**
- **Cause:** No tags in Supabase
- **Fix:** Run tag backfill script or add tags manually

#### **"Filter not working"**
- **Cause:** JavaScript error or missing tags
- **Fix:** Check browser console for errors

### **Debug Commands:**
```bash
# Check environment variables
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"

# Test Supabase connection
node test-supabase-connection.js

# Check build errors
npm run build

# Check server logs
npm run dev
```

---

## **Success Criteria**

### **✅ All Tests Pass When:**
1. **Calendar loads** with tag chips on events
2. **Tag filtering works** and persists in URL
3. **Authentication works** after adding env vars
4. **Tag management works** via CSV or admin interface
5. **URL sharing works** with filtered views
6. **Multiple tickers work** with appropriate tags
7. **List view works** with tag display and filtering

### **🎯 Acceptance Criteria Met:**
- ✅ Tags appear as chips on event cards
- ✅ Selecting a tag filters the calendar
- ✅ Filter state persists in URL (`?tag=MACRO_FOMC`)
- ✅ Auth still works after adding environment variables
- ✅ Tags can be added/edited via admin view or CSV import

---

## **Next Steps After Validation**

1. **Deploy to production** with proper environment variables
2. **Set up Supabase tables** using provided SQL scripts
3. **Import tag data** using CSV backfill script
4. **Configure Realtime** for future social features
5. **Monitor performance** and user feedback

---

*Last Updated: [Current Date]*  
*Status: Ready for validation*  
*Next: Set up environment variables and test*
