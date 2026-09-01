# Account creation

`POST /api/auth/register` `{ email, password, displayName? }`

```
1. Normalize email (trim + lowercase). Trim displayName or set null.
2. Validate. Fail 400 if email is invalid, password too short, or password equals email.
3. Hash password (Argon2id). Never store or log plaintext.
4. In one DB transaction:
     INSERT user (email, passwordHash, role: user)
     INSERT profile (userId = user.id, displayName)
   If email unique constraint fails (P2002): do not 409; same success response as a new user.
5. Respond 201. Never return passwordHash.
```

Controller → service → repository → Prisma. Service owns steps 1–3 and 5. Repository owns step 4.

## Tools

| Step | Tool |
|------|------|
| Route / DTO | TSOA (`AuthController`, `RegisterBody`) |
| Hash | Argon2id (`argon2`) — bcrypt if you want simpler |
| User + profile write | Prisma `$transaction` |
| Unique email | Postgres `email @unique` → Prisma `P2002` |
| Token after verify/login (not on register) | Existing HMAC `sign()` in `auth.service.ts` |
