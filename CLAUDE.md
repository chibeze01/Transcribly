# Worker Instructions — SOF-19

Your repo: Transcribly
Your repo path: /mnt/c/git/Transcribly
Your journal: /mnt/c/Dev/agent-system/repos/Transcribly/work-journal/SOF-19.md
Your worktree: /mnt/c/Dev/agent-system/repos/Transcribly/worktrees/SOF-19
Your branch: agent/sof-19

You will be invoked separately for each phase. Check your prompt to know which phase to run.

## Comment conventions

When posting comments on the Linear issue, ALWAYS prefix your message with 🤖 (robot emoji).
This is how the system distinguishes your comments from human comments.

Example:
```
🤖 Here is my proposed plan for this issue:

**Files to modify:**
- src/services/auth.ts — add token refresh logic
...
```

**Important:** After posting a plan or revised plan comment, you MUST update your journal with:
- **Current Plan Comment ID** — the Linear comment ID returned from the API
- **Current Plan Posted At** — the ISO timestamp when the comment was posted

These fields anchor the approval watcher so it knows which plan is current.

## How approval works

The human reviews your 🤖 plan comment in Linear and either:
- Reacts with ✅ on your plan comment → approval
- Comments `/approve` → approval
- Comments anything else (without `/approve`) → feedback for revision

You don't need to poll or wait. The system re-invokes you for the appropriate next phase.

## Phase 1 — Planning (invoked with "Phase 1")
1. Read your journal for the issue summary.
2. Explore the codebase in your worktree.
3. Write a detailed plan (files to change, steps, risks).
4. Update journal: fill Plan section, set Status = "awaiting-approval".
5. Post the plan as a 🤖-prefixed comment on SOF-19 in Linear.
6. Update journal:
   - Set **Current Plan Comment ID** to the comment ID returned by Linear.
   - Set **Current Plan Posted At** to the current ISO timestamp.
   - Set **Plan Posted To Linear/Jira** to "yes".
7. Add a checkpoint: "Plan complete, posted to Linear".
8. Exit. The watcher will re-invoke you after the human responds.

## Revision — Revise plan based on feedback (invoked with "Revision")
1. Read the latest comments on SOF-19 in Linear.
2. Identify the human feedback (comments NOT starting with 🤖, posted after your last plan).
3. Revise your plan in the journal based on the feedback.
4. Post the revised plan as a 🤖-prefixed comment on SOF-19 in Linear,
   referencing what changed and why.
5. Update journal:
   - Set **Current Plan Comment ID** to the new comment ID.
   - Set **Current Plan Posted At** to the current ISO timestamp.
   - Set Status = "awaiting-approval".
6. Add a checkpoint: "Plan revised based on feedback, reposted to Linear".
7. Exit. The watcher will re-invoke you again after the human responds.

## Phase 2 — Implementation (invoked with "Phase 2")
1. Read your journal. Confirm Approved By is not "pending".
   If it is still "pending", log an error to your journal and exit.
2. Update journal Status = "in-progress".
3. Implement the plan step by step.
4. Log checkpoints to your journal as you go.
5. Run tests. Fix failures.
6. git add -A && git commit && git push origin agent/sof-19
7. Update journal: Status = "complete", fill Outcome section.
8. Post a 🤖-prefixed completion comment on SOF-19 in Linear with the branch name.

## Rules
- Always prefix your Linear comments with 🤖.
- Always update Current Plan Comment ID and Current Plan Posted At after posting a plan.
- Only write to your own journal file.
- Only work inside your own worktree.
- Never touch master or other branches.
- On unrecoverable error: set Status = "failed", describe reason in journal.
