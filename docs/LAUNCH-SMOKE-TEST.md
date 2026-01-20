# Launch Smoke Test Checklist

**Purpose**: Quick verification that critical functionality works before and after launch  
**Time Required**: ~10 minutes  
**When to Run**: Before launch, after deployment, after major changes

---

## Pre-Launch Checklist

### ✅ Pages Load Successfully
- [ ] Homepage (/) - loads without errors
- [ ] About (/about) - loads without errors
- [ ] Services (/services) - loads without errors
- [ ] Pricing (/pricing) - loads without errors
- [ ] Contact (/contact) - loads without errors
- [ ] Blog (/blog) - loads without errors
- [ ] Privacy Policy (/privacy) - loads without errors
- [ ] Terms of Service (/terms) - loads without errors

### ✅ Navigation
- [ ] Desktop menu expands/collapses correctly
- [ ] Mobile hamburger menu opens/closes
- [ ] All navigation links work
- [ ] Logo links back to homepage
- [ ] Footer links work (social, legal pages)

### ✅ Contact Form
- [ ] Form displays all required fields (Name, Email, Phone, Message)
- [ ] Submit button is clickable
- [ ] Form validation works (try submitting empty form)
- [ ] Success message appears after valid submission
- [ ] Lead appears in Supabase database
- [ ] Lead syncs to HubSpot (check CRM)
- [ ] Rate limiting works (try 5 rapid submissions)

### ✅ Search Functionality
- [ ] Search dialog opens (Cmd+K or Ctrl+K)
- [ ] Search returns results
- [ ] Search results are clickable
- [ ] Search works on mobile

### ✅ Performance
- [ ] Page loads in < 3 seconds
- [ ] No visible layout shifts
- [ ] Images load properly
- [ ] No console errors (check browser DevTools)
- [ ] No console warnings (critical ones only)

### ✅ Mobile Responsiveness
- [ ] Test on mobile device or DevTools mobile view
- [ ] Navigation menu works
- [ ] Forms are usable
- [ ] Text is readable (not too small)
- [ ] Buttons are tappable (not too small)

### ✅ PWA Features
- [ ] Install prompt appears (if applicable)
- [ ] Manifest.json loads (check DevTools → Application)
- [ ] Service worker registers (check DevTools → Application)
- [ ] Icons are correct

### ✅ SEO & Metadata
- [ ] Page titles are correct (check browser tab)
- [ ] Meta descriptions exist (view page source)
- [ ] Open Graph images work (test with social media debugger)
- [ ] Robots.txt accessible (/robots.txt)
- [ ] Sitemap accessible (/sitemap.xml)

### ✅ Analytics & Monitoring
- [ ] Analytics tracking fires (check provider dashboard)
- [ ] Contact form submission tracked as conversion
- [ ] Sentry captures errors (if enabled)

### ✅ Security
- [ ] HTTPS works (SSL certificate valid)
- [ ] No mixed content warnings
- [ ] CSP headers present (check DevTools → Network)
- [ ] No credentials in page source

---

## Post-Launch Verification

Run these checks immediately after deploying to production:

### Critical Path (Must Work)
1. [ ] Homepage loads
2. [ ] Contact form submits successfully
3. [ ] Lead saved to database (verify in Supabase)
4. [ ] Privacy and Terms pages load (no 404s)

### Quick Validation
5. [ ] Check browser console for errors
6. [ ] Test one navigation flow (home → services → contact)
7. [ ] Verify analytics event appears
8. [ ] Confirm monitoring is capturing data (Sentry)

---

## Known Issues to Ignore

Document expected warnings/issues here:
- [None currently]

---

## Emergency Rollback Triggers

If these fail, consider immediate rollback (see /docs/ROLLBACK.md):
- [ ] Homepage returns 500 error
- [ ] Contact form completely broken (can't submit)
- [ ] Database connection fails
- [ ] Critical security header missing

---

## Test Results Log

### Latest Test: [DATE]
- Tester: [NAME]
- Environment: [Production/Staging/Preview]
- Overall Status: ✅ Pass / ❌ Fail
- Issues Found: [List any issues]
- Action Taken: [What was done]

---

## Notes

- Use browser DevTools (F12) to check console for errors
- Test in multiple browsers if possible (Chrome, Firefox, Safari)
- Clear browser cache if seeing stale content
- Use incognito/private mode for clean test
