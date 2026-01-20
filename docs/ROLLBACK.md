# Rollback Procedure

**Purpose**: Quickly revert to a previous working deployment if production issues occur  
**Platform**: Cloudflare Pages  
**Time Required**: ~2-5 minutes

---

## When to Rollback

Consider immediate rollback if:
- ❌ Homepage or critical pages return 500 errors
- ❌ Contact form completely broken (can't save leads)
- ❌ Database connection failures preventing core functionality
- ❌ Critical security vulnerability discovered
- ❌ Major UI breakage affecting all users

**Do NOT rollback for**:
- ✅ Minor visual issues (fix forward instead)
- ✅ Non-critical features broken (can wait for hotfix)
- ✅ Analytics not tracking (fix forward)

---

## Cloudflare Pages Rollback Steps

### Option 1: Via Cloudflare Dashboard (Recommended)

1. **Access Deployments**:
   - Go to: https://dash.cloudflare.com/
   - Navigate to: Workers & Pages → your-dedicated-marketer → Deployments

2. **Find Last Known Good Deployment**:
   - Look at the deployment history
   - Identify the last deployment before the problem started
   - Check the timestamp and commit hash

3. **Rollback**:
   - Click the **three dots (...)** next to the good deployment
   - Select **"Rollback to this deployment"**
   - Confirm the rollback

4. **Verify**:
   - Wait 1-2 minutes for propagation
   - Visit your production URL
   - Run the critical checks from [LAUNCH-SMOKE-TEST.md](LAUNCH-SMOKE-TEST.md)
   - Verify the issue is resolved

5. **Monitor**:
   - Check Sentry for any errors
   - Monitor analytics for traffic patterns
   - Check Supabase for lead submissions

### Option 2: Via Git (If Dashboard Unavailable)

1. **Identify Last Good Commit**:
   ```bash
   git log --oneline -10
   ```

2. **Create Rollback Branch**:
   ```bash
   git checkout -b rollback-emergency
   git revert <bad-commit-hash>
   git push origin rollback-emergency
   ```

3. **Trigger Deployment**:
   - Push triggers automatic Cloudflare Pages build
   - Monitor deployment in Cloudflare dashboard

4. **Verify** (same as Option 1)

---

## Rollback Verification Checklist

After rollback, verify these critical paths:

- [ ] Homepage loads without errors
- [ ] Contact form submits successfully
- [ ] Lead saved to Supabase (check database)
- [ ] HubSpot sync working (check CRM)
- [ ] No console errors in browser DevTools
- [ ] Privacy and Terms pages load
- [ ] Analytics tracking fires

**If verification fails**: Check if the issue existed before the recent deployment (might be infrastructure/third-party problem).

---

## Post-Rollback Actions

### Immediate (Within 1 hour)
1. [ ] Document what went wrong in a post-mortem note
2. [ ] Notify team/stakeholders of rollback
3. [ ] Identify root cause of the issue
4. [ ] Create hotfix branch to address the issue

### Short-term (Within 24 hours)
5. [ ] Test hotfix in preview environment
6. [ ] Run full smoke test on preview
7. [ ] Deploy hotfix to production
8. [ ] Verify hotfix resolves original issue

### Long-term
9. [ ] Update [LAUNCH-SMOKE-TEST.md](LAUNCH-SMOKE-TEST.md) with new checks if needed
10. [ ] Add safeguards to prevent similar issues
11. [ ] Update documentation if process revealed gaps

---

## Environment Variable Rollback

If the issue is caused by bad environment variables:

1. **Access Cloudflare Pages Settings**:
   - Workers & Pages → your-dedicated-marketer → Settings → Environment variables

2. **Revert Variables**:
   - Compare current values with known-good values (check `.env.local` or [SUPABASE_SETUP.md](SUPABASE_SETUP.md))
   - Update incorrect values
   - Click **Save**

3. **Redeploy**:
   - Go to Deployments tab
   - Click **"Retry deployment"** on the latest deployment
   - This rebuilds with the corrected environment variables

4. **Verify** (same checklist as above)

---

## Database Rollback (Supabase)

**⚠️ WARNING**: Database rollbacks are risky and should be last resort.

### If Bad Data Was Written
- Run SQL to delete/fix bad records
- Example: Delete leads from last hour
  ```sql
  DELETE FROM leads WHERE created_at > NOW() - INTERVAL '1 hour';
  ```

### If Schema Was Changed
- Supabase doesn't have automatic schema rollback
- Manually run migration to revert schema changes
- Test thoroughly before executing

**Better approach**: Fix forward rather than rollback database

---

## Communication Template

Use this when notifying about rollback:

```
[ROLLBACK NOTICE]

Time: [TIMESTAMP]
Issue: [Brief description of problem]
Action: Rolled back to deployment [COMMIT_HASH] from [TIME]
Status: [Investigating/Resolved/Monitoring]
Impact: [Who was affected, for how long]
Next Steps: [What's being done to fix]

ETA for fix: [ESTIMATE or TBD]
```

---

## Rollback History Log

### [DATE] - [ISSUE DESCRIPTION]
- **Trigger**: [What went wrong]
- **Rollback To**: [Commit hash / deployment ID]
- **Duration of Issue**: [How long was site broken]
- **Root Cause**: [What caused it]
- **Prevention**: [What was done to prevent recurrence]

---

## Emergency Contacts

- **Cloudflare Support**: https://dash.cloudflare.com/support
- **Supabase Support**: https://supabase.com/dashboard/support
- **HubSpot Support**: https://help.hubspot.com/

---

## Testing Rollback (Dry Run)

**Optional but recommended**: Practice rollback on a preview branch

1. Create a test deployment with a known "bad" change
2. Follow rollback procedure to revert
3. Verify the process works as expected
4. Document any issues or improvements needed

---

## Notes

- Cloudflare Pages keeps deployment history indefinitely
- You can rollback to any previous deployment, not just the immediate prior
- Rolling back doesn't delete the bad deployment - you can still inspect it
- Consider using preview deployments for testing risky changes
