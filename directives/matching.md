# Peer Matching Directive

## Goal
Match students who want to learn skills with peers who can teach, using GraphRAG for relationship-aware recommendations.

## Inputs
- User ID (seeker)
- Skill name or ID they want to learn
- Optional filters: year, branch

## Flow

### 1. Build Knowledge Graph
```
Nodes:
- User nodes (id, name, year, branch)
- Skill nodes (id, name, category)

Edges:
- CAN_TEACH: User → Skill (with proficiency 1-5)
- WANTS_TO_LEARN: User → Skill
- HAD_SESSION: User → User (for connection degrees)
```

### 2. Find Mentors
```
Given: User wants to learn "Machine Learning"
↓
Find all users with CAN_TEACH edge to "Machine Learning"
↓
Calculate match score for each
↓
Return ranked list
```

### 3. Match Score Calculation
```
Score = 0

// Proficiency (0-25 points)
score += mentor.proficiency * 5

// Year difference bonus (seniors teaching = good)
if mentor.year > seeker.year:
    score += (mentor.year - seeker.year) * 10

// Same branch bonus
if mentor.branch === seeker.branch:
    score += 15

// Mutual exchange opportunity (big bonus!)
if seeker CAN_TEACH something mentor WANTS_TO_LEARN:
    score += 25

// Past positive interaction
if had_positive_session_before:
    score += 20

return min(score, 100)
```

### 4. Connection Degrees
```
1st degree: Direct session together
2nd degree: 1 hop in session graph
3rd degree: 2 hops in session graph
Out of network: No path found
```

## Tools
- NetworkX (Python) for graph operations
- FastAPI for microservice
- Groq for AI-enhanced matching explanations

## Edge Cases
- No mentors found → Suggest "Ask Anyone" chain
- All mentors busy → Show availability status
- Skill not in database → Suggest similar skills

## Execution Scripts
- `execution/graphrag/build_graph.py` - Construct graph from DB
- `execution/graphrag/find_mentors.py` - Query mentors
- `execution/graphrag/calc_degrees.py` - Connection path
- `execution/graphrag/match_score.py` - Score calculation
