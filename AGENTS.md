# AGENTS.md

## Package manager
- Use YARN only. Never use npm (npm rewrites `yarn.lock` and creates `package-lock.json`).
- Add dependencies with `yarn add <pkg>`, remove with `yarn remove <pkg>`.

## Build / dist
- NEVER build the package automatically (`npm run build` / `webpack` / `tsc`) as part of a task.
- If a build is run purely for verification, do NOT leave the generated files in `dist/`. Revert `dist/` afterwards so the diff stays readable for human review.
- `dist/` build artifacts are generated ONLY manually by the user.