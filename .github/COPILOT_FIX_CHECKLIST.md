# Copilot Workflow Fix Checklist

Use this checklist to fix the failing Copilot workflow in your repository.

## Prerequisites

- [ ] I am a repository admin or owner
- [ ] I can access https://github.com/mbianchidev/music-website/settings/rules

## Fix Steps

### 1. Access Repository Rules
- [ ] Navigate to repository Settings
- [ ] Click on "Rules" under "Code and automation"
- [ ] Click on "Rulesets"

### 2. Identify the Blocking Ruleset
- [ ] Look for rulesets with status "Active"
- [ ] Check which ruleset targets:
  - [ ] `**/*` (all branches)
  - [ ] `*` (wildcard)
  - [ ] `copilot/*` (specific pattern)
- [ ] Note the ruleset name: ___________________________

### 3. Add Bypass Permission
- [ ] Click on the ruleset name to edit it
- [ ] Scroll down to the "Bypass list" section
- [ ] Click "Add bypass"
- [ ] Select type: **"Apps"** or **"GitHub Apps"**
- [ ] Search for: `copilot-swe-agent`
- [ ] Select the app from the list
- [ ] Click "Add"
- [ ] Verify it appears in the bypass list

### 4. Save Changes
- [ ] Click "Save changes" at the bottom of the page
- [ ] Confirm the success message appears
- [ ] Note the time you made the change: ___________________________

### 5. Verify the Fix (Optional)
- [ ] Run this command to verify:
  ```bash
  gh api repos/mbianchidev/music-website/rulesets
  ```
- [ ] Check that `copilot-swe-agent` appears in the bypass list

### 6. Test the Fix
Choose one option:

**Option A: Retry the failed workflow**
- [ ] Go to https://github.com/mbianchidev/music-website/actions/runs/20443417307
- [ ] Click "Re-run failed jobs" or "Re-run all jobs"
- [ ] Monitor the "Processing Request" step
- [ ] Verify it completes successfully

**Option B: Start a new Copilot task**
- [ ] Create a new issue with a simple request for Copilot
- [ ] Assign to @copilot
- [ ] Wait for the workflow to complete
- [ ] Check that the PR shows file changes (not 0 files)

### 7. Confirm Success
- [ ] Workflow completed without GH013 errors
- [ ] PR shows actual file changes
- [ ] Commits appear in the branch

## Troubleshooting

If something didn't work, check:
- [ ] Did you wait 1-2 minutes after saving for changes to propagate?
- [ ] Did you select the **app** "copilot-swe-agent" (not the bot user)?
- [ ] Is the ruleset status "Active" (not "Evaluate" or "Disabled")?
- [ ] Are there multiple rulesets? (You might need to update all of them)
- [ ] Are there organization-level rules? (Check org settings too)

## Additional Help

- See [FIX_COPILOT_WORKFLOW.md](./FIX_COPILOT_WORKFLOW.md) for detailed instructions
- See [../COPILOT_WORKFLOW_FIX.md](../COPILOT_WORKFLOW_FIX.md) for technical analysis

## Notes

Date fixed: ___________________________  
Fixed by: ___________________________  
Additional notes:

___________________________________________________________________

___________________________________________________________________

___________________________________________________________________
