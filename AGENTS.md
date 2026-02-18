# Agent Safety Rules

## Secret files are off-limits
- Do not read, print, summarize, search, or modify `.env`, `.env.local`, `.env.*`, `*.pem`, `*.key`, or any secrets file.
- If a task requires environment values, ask the user to provide safe placeholders or work from `.env.local.example`.
- Never include secret values in terminal output, logs, diffs, or commit messages.

## Allowed config workflow
- Use `.env.local.example` as the only template for local setup.
- Keep real secret files local and untracked.
