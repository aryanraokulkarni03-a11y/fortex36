# SkillSync Demo Script

**Target Audience:** Hackathon Judges / Campus Peers  
**Duration:** 3-5 Minutes  

## 1. Introduction (0:00 - 0:45)

*   **Hook:** "Finding mentors on campus is hard. You don't know who knows what."
*   **The Problem:** Existing solutions (LinkedIn) are too formal or disconnected from campus life.
*   **The Solution:** SkillSync - an AI-powered peer learning network specifically for universities.
*   **Key Tech:** GraphRAG (Graph Retrieval-Augmented Generation) for intelligent matching, not just keyword search.

## 2. Hero & First Impressions (0:45 - 1:30)

*   **Action:** Open `http://localhost:3000`
*   **Visual Highlights:**
    *   Show off the **"Tech-Brutalist Luxury"** design.
    *   Point out the **massive typography** and **parallax scroll** effects.
    *   Highlight the **Live Stats Bar** counting up (active students, matches).
*   **Narrative:** "We didn't just build a tool; we built an experience. It feels alive and premium."

## 3. The "Wow" Moment: Finding a Mentor (1:30 - 3:00)

*   **Action:** Click **"Find Mentors"** or go to `/matches`
*   **Step 1: Search**
    *   Type: "Machine Learning"
    *   **Observer:** Notice the animated search bar focus and instant feedback.
*   **Step 2: The Results**
    *   **Show:** The staggered card reveal.
    *   **Highlight:** "Rahul Kumar" (Match Score: 94%).
    *   **Explain the AI Score:** "This isn't random. Our GraphRAG engine analyzes:
        1.  Proficiency (Rahul is an Expert)
        2.  Year Gap (He's a Senior)
        3.  Branch Match (CSE)
        4.  **Mutual Exchange:** I can teach him React!"
*   **Action:** Click **"Connect"** button.
    *   Show the success toast notification.

## 4. User Dashboard (3:00 - 3:45)

*   **Action:** Go to `/dashboard`
*   **Visuals:**
    *   Show "Welcome back!" message.
    *   Highlight the **"My Skills"** section with glowing badges.
    *   Show **"Recent Matches"** pending status.
*   **Narrative:** "The dashboard is your command center. You can see who you're teaching and what you're learning."

## 5. Mobile Responsiveness (3:45 - 4:15)

*   **Action:** Open Chrome DevTools (F12) -> Toggle Device Toolbar (Mobile).
*   **Show:**
    *   Hamburger menu animation.
    *   Stacked layout of stats.
    *   Touch-friendly buttons.
*   **Narrative:** "Built mobile-first for students on the go."

## 6. Closing & Q&A (4:15 - 5:00)

*   **Summary:** "SkillSync connects the campus graph using AI. It turns every student into a teacher and a learner."
*   **Call to Action:** "Live now. Sign up and find your mentor today."

---

## Demo Personas (Pre-seeded)

**1. Rahul Kumar (u1) - The Expert**
*   **Teaches:** Machine Learning (5/5), Python (5/5)
*   **Learns:** React (2/5)

**2. Priya Singh (u2) - The Frontend Dev**
*   **Teaches:** React (4/5), JavaScript (4/5)
*   **Learns:** Machine Learning (1/5)
*   *Perfect Match for Rahul!*

**3. Amit Verma (u3) - The Learner**
*   **Teaches:** Python (3/5)
*   **Learns:** DSA (2/5), ML (1/5)
