# SkillSync Project Directive

> Master directive for the SkillSync peer learning platform

## Goal
Build an AI-powered peer learning network for SRM AP students that matches mentors with learners using GraphRAG.

## Inputs
- User profiles with skills (teaching/learning)
- SRM AP student email for verification
- Interest categories for event matching

## Core Workflows

### 1. Authentication Flow
- Directive: `directives/auth.md`
- Execution: `execution/auth/`
- Validates @srmap.edu.in email domain
- Issues JWT tokens (httpOnly cookies)

### 2. Skill Matching Flow
- Directive: `directives/matching.md`
- Execution: `execution/graphrag/`
- Uses NetworkX for graph-based matching
- Calculates connection degrees (1st/2nd/3rd)

### 3. Event Discovery Flow
- Directive: `directives/events.md`
- Execution: `execution/events/`
- Matches events to user interests
- Ranks by relevance score

### 4. Rating Flow
- Directive: `directives/ratings.md`
- Execution: `execution/ratings/`
- Post-session feedback
- Trust score calculation

## Outputs
- Web application (Next.js on Vercel)
- GraphRAG microservice (Python on Railway)
- MongoDB database (Atlas)

## Edge Cases
- User tries to register with non-SRM email → Reject with clear message
- No mentors found for skill → Suggest "Ask Anyone" chain
- Rate limit on Groq API → Cache responses, fallback to basic matching

## Tech Stack
- Frontend: Next.js 14, TypeScript, Tailwind, shadcn/ui
- Backend: Node.js, Express.js, MongoDB
- AI: Groq (Llama 3.3), NetworkX, LangChain.js
- Auth: NextAuth.js, JWT

## Success Criteria
- [ ] Auth with SRM email works
- [ ] Users can add/manage skills
- [ ] Matching returns ranked mentors
- [ ] Connection degrees display correctly
- [ ] Events filter by interests
- [ ] Rating system functional
- [ ] UI is polished and responsive
