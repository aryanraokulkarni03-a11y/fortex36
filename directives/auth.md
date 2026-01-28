# Authentication Directive

## Goal
Implement secure student-only authentication using SRM AP email domain restriction.

## Inputs
- Email address (must be @srmap.edu.in)
- OTP for verification

## Flow

### 1. Email Validation
```
User enters email
↓
Check domain === "srmap.edu.in"
↓
If invalid → Show error: "Only SRM AP students can register"
If valid → Send OTP
```

### 2. OTP Verification
```
User enters OTP
↓
Verify against stored OTP
↓
If valid → Create session
If invalid → Allow 3 retries
```

### 3. Session Management
```
Create JWT tokens:
- Access token: 15 min expiry, httpOnly cookie
- Refresh token: 7 days expiry, httpOnly cookie
```

## Tools
- NextAuth.js for auth framework
- nodemailer for OTP emails
- bcrypt for hashing OTP
- jsonwebtoken for JWT

## Edge Cases
- Invalid email domain → Clear error message
- OTP expired (5 min) → Resend option
- Too many attempts → Rate limit (5/hour)
- Session hijacking → Validate IP/fingerprint

## Security Requirements
- [ ] Tokens in httpOnly cookies (NOT localStorage)
- [ ] CSRF protection enabled
- [ ] Rate limiting on login attempts
- [ ] Email domain validation server-side

## Execution Scripts
- `execution/auth/validate_email.js` - Domain check
- `execution/auth/send_otp.js` - OTP email
- `execution/auth/verify_otp.js` - OTP validation
- `execution/auth/create_session.js` - JWT generation
