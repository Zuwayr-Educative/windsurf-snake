---
description: Generates a conventional commit message and a full PR description based on the current git diff.
---

1.  Analyze the staged changes in my git diff by looking at `@diff`.
2.  First, generate a concise, conventional commit message for these changes. The format should be `type(scope): summary`. Present it clearly in a code block so I can easily copy it.
3.  Second, generate a comprehensive Pull Request description. The description must have three sections, each with a clear heading: "## What Changed?", "## Why Was This Change Made?", and "## How Was This Implemented?". Be detailed and explain the changes for a teammate who has no context.
4.  Finally, provide a bulleted list under a "### Changed Files" heading that summarizes the key files that were modified in this diff.