# Dependabot investigation — 3 November 2026

## Diagnosis

The queued `.github/dependabot.yml` record is check run **125370211669**, in suite **112387359320**, on historical main commit `cc3466daf8f0e7d9fe9a8f0cbedadc5f555a48bc`. It belongs to GitHub's **Dependabot App**, slug `dependabot`, App ID **29110**. Its details URL is `https://dependabot-api.githubapp.com`.

The suite was created/updated at `2026-11-02T15:33:17Z`; the check has the same start time, status `queued`, no completion time, no conclusion, no output text and zero annotations. It is separate from the `Website quality / verify` Actions job, which passed on that commit. Successful updater jobs belong to the `github-actions` App, ID 15368, rather than the App that owns this configuration record.

REST check runs/suites, combined commit status, workflow runs, job steps/logs, repository settings and open PRs were inspected. The available API evidence identifies a stale or incomplete GitHub App event; it does not expose the managed service's internal cause. It is not evidence of a failed repository workflow or an unavailable runner.

## Configuration and permissions

- `.github/dependabot.yml` remains intact: version 2; weekly root updates for npm and GitHub Actions; npm open-PR limit 5. It parses with the existing YAML library. The manifest, committed lockfile and workflow directory exist. There are no private registries or custom runner requirements.
- Actions is enabled, all Actions are allowed, and workflow token permissions default to read. The quality workflow's concurrency group is scoped to its ref and does not control dynamic Dependabot runs. There are no self-hosted runners; the actual updater jobs run successfully on hosted runners.
- The repository credential has admin access, but cannot impersonate the Dependabot App. Main had no branch protection or rulesets; none were removed or changed. No check/status was created, edited or fabricated.
- Empty Vercel/Render check suites were also observed without any check runs. They are external App suite entries, not failing quality jobs or runner queues.

## Legitimate fixes and rechecks

Vulnerability alerts and automatic security fixes were disabled. Both were enabled through the repository API and verified: automated fixes `enabled: true`, `paused: false`; `security_and_analysis.dependabot_security_updates.status: enabled`. Secret scanning and push protection remained enabled. No security capability was disabled and no configuration was deleted.

Rerequesting suite 112387359320 through REST returned HTTP 404. The documented GraphQL mutation returned `FORBIDDEN`: **“RerequestCheckSuite can only be accessed by a GitHub App.”** A user/admin token cannot complete or rerequest another App's check through that API.

The repository owner then used **Recent update jobs → Check for updates** for both ecosystems. Both fresh jobs passed:

| Ecosystem      | Run                                                                                        | Created (UTC)       | Completed (UTC) | Result  |
| -------------- | ------------------------------------------------------------------------------------------ | ------------------- | --------------- | ------- |
| npm            | [41647121217](https://github.com/rizad-mohamed/Majestic-SriLanka/actions/runs/41647121217) | 2026-11-03 13:45:01 | 13:46:05        | Success |
| GitHub Actions | [41647167530](https://github.com/rizad-mohamed/Majestic-SriLanka/actions/runs/41647167530) | 2026-11-03 13:45:18 | 13:45:58        | Success |

Earlier updater runs also passed. Thus dependency updates and security fixes are operational. These rechecks did **not** change the historical configuration record's queued status. It must not be described as a successful check.

## Remaining GitHub-side action

If GitHub continues displaying the old queued record, a repository administrator must ask **GitHub Support / the GitHub-managed Dependabot service** to reconcile check run **125370211669**, suite **112387359320**, on SHA **cc3466daf8f0e7d9fe9a8f0cbedadc5f555a48bc**, citing the two successful fresh updater jobs above and the App-only rerequest error. The normal native recheck has already been performed. Repository source changes cannot truthfully complete this App-owned record.

Merge verification uses the actual checks and statuses attached to the final PR head. Historical or empty suite records are reported separately; no branch rule is bypassed. The final delivery records the checks on the actual merged main commit as well.

References: [Checks suites API](https://docs.github.com/en/rest/checks/suites), [Dependabot on Actions](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-on-actions), [rerunning Dependabot jobs](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/re-run-dependabot-jobs).
