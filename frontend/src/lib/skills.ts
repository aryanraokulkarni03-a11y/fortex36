// Official skills list for SkillSync

export const SKILLS_LIST = [
    "C",
    "C++",
    "Python",
    "Java",
    "JavaScript",
    "HTML",
    "CSS",
    "Git",
    "GitHub",
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "SQL",
    "Relational Databases",
    "REST APIs",
    "HTTP",
    "React.js",
    "Node.js",
    "Express.js",
    "JSON",
    "Linux",
    "Debugging",
    "Basic System Design",
    "Problem Solving",
    "Cybersecurity Basics",
    "TensorFlow",
    "UI/UX",
    "Data Science",
    "Machine Learning",
    "TypeScript"
];

// Search skills by query (case-insensitive partial match)
export function searchSkills(query: string): string[] {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return SKILLS_LIST.filter(skill =>
        skill.toLowerCase().includes(lowerQuery)
    );
}
