---
description: 
---

## Scope Discipline 
When implementing a feature or fixing a bug, adhere strictly to the following:

Stay on target — Only modify code directly required to complete the current task. If a file doesn't need changes for the feature, don't touch it.
No opportunistic refactoring — Resist the urge to "clean up" unrelated code, rename variables elsewhere, reorganize imports, or upgrade patterns you happen to notice. These create noise in diffs and complicate reviews.
No drive-by improvements — Even if adjacent code is suboptimal, leave it unless it blocks your task. If it's worth addressing later, put it in the memory, notify the user, and then move on. 
Minimal footprint — Prefer the smallest change that correctly implements the requirement. Avoid expanding scope "while you're in there."
Ask before expanding — If the task seems to require touching significantly more code than expected, pause and confirm scope before proceeding.
Exception: If broken/blocking code is discovered in the direct path of implementation, fix only what's necessary to unblock, and note it clearly in the PR description.