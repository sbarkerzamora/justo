# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 0.x (latest) | ✅ |
| Older versions | ❌ |

## Reporting a Vulnerability

Justo is an open source labor assistant project. We take security seriously.

If you discover a security vulnerability, please **do not** open a public GitHub issue.
Instead, email the maintainers directly at **stephanbarkerzamora@gmail.com** with:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You should receive a response within 48 hours. If you don't, please follow up.

## What to expect

1. We will acknowledge receipt within 2 business days.
2. We will assess and prioritize the issue.
3. We will work on a fix and release it as soon as possible.
4. We will notify you when the fix is deployed.
5. We will credit you in the release notes (if desired).

## Scope

This security policy covers:

- The `@justo/core`, `@justo/tools`, `@justo/pdf` packages
- The `apps/web` application
- The API endpoints under `/api/`
- Authentication, authorization, and rate limiting
- Data privacy (PII handling, anonymous stats)

## Out of scope

- Third-party dependencies (report upstream)
- Self-hosted instances not running the latest version
- Theoretical vulnerabilities without proof of concept

## Responsible Disclosure

We kindly ask that you follow responsible disclosure practices:
allow us reasonable time to fix the issue before making it public.
We aim for a 90-day disclosure timeline from the date of the report.
