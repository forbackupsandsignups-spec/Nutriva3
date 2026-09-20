# Security Specification - Nutriva

## Data Invariants
- A user profile must belong to the authenticated user (`userId` in path matches `request.auth.uid`).
- A user can only read and write their own profile.
- Nutritional targets must be positive numbers.
- `savedMeals` and `foodDiary` are lists that should not exceed reasonable sizes (e.g., 100 entries) to prevent resource exhaustion.

## The "Dirty Dozen" Payloads
1. **Identity Theft**: Attempt to read another user's profile (`/users/attacker_uid` trying to read `/users/victim_uid`).
2. **Identity Spoofing**: Attempt to create a profile for another user.
3. **Ghost Field Injection**: Attempt to add a `isAdmin: true` field to a profile.
4. **Invalid Type**: Attempt to set `weight` to a string instead of a number.
5. **Enum Violation**: Attempt to set `gender` to `other`.
6. **Size Exhaustion (String)**: Attempt to set `name` to a 1MB string.
7. **Size Exhaustion (Array)**: Attempt to add 10,000 items to `savedMeals`.
8. **Unverified Auth**: Attempt to write as a user with `email_verified: false`.
9. **Missing Required Field**: Attempt to create a profile without `goal`.
10. **Malicious ID**: Attempt to use `../poison/path` as a userId.
11. **State Shortcutting**: (Not applicable here as it's a profile, not a multi-step process).
12. **PII Leak**: (Not applicable as reading other profiles is already blocked).

## Test Runner (Conceptual)
All the above payloads must return `PERMISSION_DENIED`.
