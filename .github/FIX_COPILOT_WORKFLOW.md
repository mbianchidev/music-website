# Fix for Copilot Workflow Failures

## Problem

The GitHub Copilot coding agent workflow is failing with this error:

```
remote: error: GH013: Repository rule violations found for refs/heads/copilot/*
remote: - Cannot update this protected ref.
```

## Steps to Fix

### Quick Fix (Recommended)

1. **Go to Repository Settings**
   - Navigate to https://github.com/mbianchidev/music-website/settings/rules

2. **Review Rulesets**
   - Look for any ruleset that targets branches starting with `copilot/`
   - Check if there's a pattern like `copilot/*` or `refs/heads/copilot/*`

3. **Add Bypass Permission**
   - Click on the ruleset
   - Scroll to "Bypass list"
   - Add one of the following:
     - `copilot-swe-agent[bot]` (the Copilot bot)
     - `GitHub Actions` (all GitHub Actions)
     - Repository admin (if you want to manually approve)

4. **Save Changes**
   - Click "Save changes"

### Alternative: Use GitHub CLI

If you have the GitHub CLI installed, you can use this command to check existing rules:

```bash
gh api repos/mbianchidev/music-website/rulesets
```

Then update the specific ruleset to add a bypass for the Copilot bot.

### Alternative: Modify Rule Target Pattern

If you don't want to add a bypass, you can modify the ruleset to exclude `copilot/*` branches:

1. Edit the ruleset
2. Change the target branches pattern to exclude `copilot/*`
3. For example, if protecting `main`, use pattern: `main` (not `**`)

## Verification

After making the change:

1. Check the current branch rules:
   ```bash
   gh api repos/mbianchidev/music-website/rules/branches/copilot/test-branch
   ```

2. The Copilot workflow should now be able to push to `copilot/*` branches

3. Try retriggering the failed workflow or starting a new Copilot task

## Why This Happened

Repository rules are designed to protect branches from unauthorized changes. The `copilot/*` branch pattern is likely being protected by a rule that applies to all branches or a wildcard pattern. The Copilot workflow needs explicit bypass permission to push to these protected branches.

## More Information

- GitHub Docs: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- GitHub API Docs: https://docs.github.com/en/rest/repos/rules
