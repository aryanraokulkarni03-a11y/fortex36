// Shared user data for consistent profiles across the application

export interface UserProfile {
    id: number;
    name: string;
    avatar: string;
    department: string;
    year: string;
    skillsHave: string[];
    skillsWant: string[];
    rating: number;
    sessions: number;
    matchScore?: number;
    connectionDegree?: number;
    mutualConnection?: string | null;
    points?: number;
    badges?: number;
    streak?: number;
    trend?: string;
}

// Master user database - all pages reference this for consistent data
export const usersDatabase: Record<string, UserProfile> = {
    "Priya Sharma": {
        id: 1,
        name: "Priya Sharma",
        avatar: "PS",
        department: "CSE",
        year: "3rd Year",
        skillsHave: ["Python", "TensorFlow", "Data Structures & Algorithms"],
        skillsWant: ["React.js", "Node.js"],
        rating: 4.9,
        sessions: 28,
        matchScore: 94,
        connectionDegree: 2,
        mutualConnection: "Rahul Kumar",
        points: 2450,
        badges: 12,
        streak: 28,
        trend: "+15%"
    },
    "Arjun Reddy": {
        id: 2,
        name: "Arjun Reddy",
        avatar: "AR",
        department: "AI & DS",
        year: "2nd Year",
        skillsHave: ["Python", "SQL", "Data Structures & Algorithms"],
        skillsWant: ["JavaScript", "React.js"],
        rating: 4.7,
        sessions: 15,
        matchScore: 87,
        connectionDegree: 1,
        mutualConnection: null,
        points: 1980,
        badges: 8,
        streak: 14,
        trend: "+10%"
    },
    "Sneha Gupta": {
        id: 3,
        name: "Sneha Gupta",
        avatar: "SG",
        department: "ECE",
        year: "3rd Year",
        skillsHave: ["Python", "TensorFlow", "Problem Solving"],
        skillsWant: ["JavaScript", "React.js"],
        rating: 4.6,
        sessions: 22,
        matchScore: 82,
        connectionDegree: 3,
        mutualConnection: "Kavya + 2 others",
        points: 2150,
        badges: 9,
        streak: 18,
        trend: "+8%"
    },
    "Rohit Verma": {
        id: 4,
        name: "Rohit Verma",
        avatar: "RV",
        department: "CSE",
        year: "4th Year",
        skillsHave: ["Java", "Object-Oriented Programming", "REST APIs"],
        skillsWant: ["React.js", "Node.js"],
        rating: 4.8,
        sessions: 35,
        matchScore: 79,
        connectionDegree: 2,
        mutualConnection: "Amit Singh",
        points: 2280,
        badges: 10,
        streak: 21,
        trend: "+12%"
    },
    "Kavya Nair": {
        id: 5,
        name: "Kavya Nair",
        avatar: "KN",
        department: "IT",
        year: "2nd Year",
        skillsHave: ["Python", "SQL", "Relational Databases"],
        skillsWant: ["TensorFlow", "Data Structures & Algorithms"],
        rating: 4.5,
        sessions: 10,
        matchScore: 75,
        connectionDegree: 1,
        mutualConnection: null,
        points: 1850,
        badges: 7,
        streak: 12,
        trend: "+5%"
    },
    "Vikram Patel": {
        id: 6,
        name: "Vikram Patel",
        avatar: "VP",
        department: "CSE",
        year: "3rd Year",
        skillsHave: ["JavaScript", "React.js", "CSS"],
        skillsWant: ["Python", "TensorFlow"],
        rating: 4.4,
        sessions: 18,
        matchScore: 71,
        connectionDegree: 2,
        mutualConnection: "Priya Sharma"
    },
    "Ananya Das": {
        id: 7,
        name: "Ananya Das",
        avatar: "AD",
        department: "AI & DS",
        year: "4th Year",
        skillsHave: ["Python", "TensorFlow", "Basic System Design"],
        skillsWant: ["JavaScript", "Node.js"],
        rating: 4.7,
        sessions: 42,
        matchScore: 68,
        connectionDegree: 3,
        mutualConnection: "Arjun + 1 other"
    },
    "Rahul Kumar": {
        id: 8,
        name: "Rahul Kumar",
        avatar: "RK",
        department: "ECE",
        year: "2nd Year",
        skillsHave: ["C", "C++", "Debugging"],
        skillsWant: ["Python", "Linux"],
        rating: 4.3,
        sessions: 8,
        matchScore: 65,
        connectionDegree: 1,
        mutualConnection: null
    },
    "Kushaan Parekh": {
        id: 100,
        name: "Kushaan Parekh",
        avatar: "KP",
        department: "CSE",
        year: "2nd Year",
        skillsHave: ["React.js", "JavaScript", "Node.js", "CSS", "Git"],
        skillsWant: ["Python", "TensorFlow", "Data Structures & Algorithms"],
        rating: 4.8,
        sessions: 28,
        points: 1720,
        badges: 5,
        streak: 15,
        trend: "+18%"
    },
    "Amit Singh": {
        id: 9,
        name: "Amit Singh",
        avatar: "AS",
        department: "CSE",
        year: "3rd Year",
        skillsHave: ["Node.js", "Express.js", "REST APIs"],
        skillsWant: ["React.js", "JavaScript"],
        rating: 4.5,
        sessions: 26,
        points: 1650,
        badges: 6,
        streak: 10,
        trend: "+7%"
    },
    "Divya Patel": {
        id: 10,
        name: "Divya Patel",
        avatar: "DP",
        department: "IT",
        year: "2nd Year",
        skillsHave: ["HTML", "CSS", "JavaScript"],
        skillsWant: ["React.js", "Node.js"],
        rating: 4.6,
        sessions: 24,
        points: 1580,
        badges: 5,
        streak: 8,
        trend: "+9%"
    },
    // Additional users for skill coverage
    "Neha Kapoor": {
        id: 11,
        name: "Neha Kapoor",
        avatar: "NK",
        department: "CSE",
        year: "3rd Year",
        skillsHave: ["C", "C++", "Object-Oriented Programming"],
        skillsWant: ["Java", "Python"],
        rating: 4.5,
        sessions: 20,
        matchScore: 72
    },
    "Sanjay Mehta": {
        id: 12,
        name: "Sanjay Mehta",
        avatar: "SM",
        department: "IT",
        year: "4th Year",
        skillsHave: ["Java", "SQL", "Relational Databases"],
        skillsWant: ["Node.js", "Express.js"],
        rating: 4.6,
        sessions: 32,
        matchScore: 68
    },
    "Ritu Saxena": {
        id: 13,
        name: "Ritu Saxena",
        avatar: "RS",
        department: "CSE",
        year: "2nd Year",
        skillsHave: ["Git", "GitHub", "Linux"],
        skillsWant: ["Python", "JavaScript"],
        rating: 4.4,
        sessions: 14,
        matchScore: 70
    },
    "Karthik Iyer": {
        id: 14,
        name: "Karthik Iyer",
        avatar: "KI",
        department: "ECE",
        year: "3rd Year",
        skillsHave: ["C", "Debugging", "Problem Solving"],
        skillsWant: ["C++", "Data Structures & Algorithms"],
        rating: 4.3,
        sessions: 16,
        matchScore: 66
    },
    "Pooja Deshmukh": {
        id: 15,
        name: "Pooja Deshmukh",
        avatar: "PD",
        department: "IT",
        year: "3rd Year",
        skillsHave: ["HTTP", "REST APIs", "JSON"],
        skillsWant: ["Node.js", "Express.js"],
        rating: 4.5,
        sessions: 19,
        matchScore: 74
    },
    "Aditya Rao": {
        id: 16,
        name: "Aditya Rao",
        avatar: "AO",
        department: "CSE",
        year: "4th Year",
        skillsHave: ["Basic System Design", "REST APIs", "Object-Oriented Programming"],
        skillsWant: ["TensorFlow", "Python"],
        rating: 4.7,
        sessions: 38,
        matchScore: 76
    },
    "Meera Joshi": {
        id: 17,
        name: "Meera Joshi",
        avatar: "MJ",
        department: "AI & DS",
        year: "2nd Year",
        skillsHave: ["Python", "Data Structures & Algorithms", "Problem Solving"],
        skillsWant: ["React.js", "JavaScript"],
        rating: 4.4,
        sessions: 12,
        matchScore: 78
    },
    "Varun Khanna": {
        id: 18,
        name: "Varun Khanna",
        avatar: "VK",
        department: "CSE",
        year: "3rd Year",
        skillsHave: ["Linux", "Git", "Debugging"],
        skillsWant: ["Node.js", "Express.js"],
        rating: 4.6,
        sessions: 25,
        matchScore: 69
    },
    "Shreya Bansal": {
        id: 19,
        name: "Shreya Bansal",
        avatar: "SB",
        department: "IT",
        year: "2nd Year",
        skillsHave: ["HTML", "CSS", "JSON"],
        skillsWant: ["JavaScript", "React.js"],
        rating: 4.3,
        sessions: 11,
        matchScore: 71
    },
    "Nikhil Aggarwal": {
        id: 20,
        name: "Nikhil Aggarwal",
        avatar: "NA",
        department: "CSE",
        year: "4th Year",
        skillsHave: ["Cybersecurity Basics", "Linux", "Problem Solving"],
        skillsWant: ["Python", "REST APIs"],
        rating: 4.8,
        sessions: 30,
        matchScore: 67
    },
    "Tanvi Sharma": {
        id: 21,
        name: "Tanvi Sharma",
        avatar: "TS",
        department: "CSE",
        year: "3rd Year",
        skillsHave: ["UI/UX", "CSS", "HTML"],
        skillsWant: ["React.js", "JavaScript"],
        rating: 4.7,
        sessions: 24,
        matchScore: 73
    },
    "Rohan Menon": {
        id: 22,
        name: "Rohan Menon",
        avatar: "RM",
        department: "AI & DS",
        year: "4th Year",
        skillsHave: ["Data Science", "Python", "SQL"],
        skillsWant: ["TensorFlow", "Machine Learning"],
        rating: 4.8,
        sessions: 36,
        matchScore: 81
    },
    "Aisha Khan": {
        id: 23,
        name: "Aisha Khan",
        avatar: "AK",
        department: "AI & DS",
        year: "3rd Year",
        skillsHave: ["Machine Learning", "TensorFlow", "Python"],
        skillsWant: ["JavaScript", "Node.js"],
        rating: 4.9,
        sessions: 32,
        matchScore: 85
    },
    "Dev Patel": {
        id: 24,
        name: "Dev Patel",
        avatar: "DP2",
        department: "CSE",
        year: "2nd Year",
        skillsHave: ["TypeScript", "JavaScript", "React.js"],
        skillsWant: ["Python", "Data Science"],
        rating: 4.6,
        sessions: 18,
        matchScore: 77
    }
};

// List of departments for search
export const DEPARTMENTS = ["CSE", "AI & DS", "IT", "ECE"];

// Helper function to get user by name
export function getUserByName(name: string): UserProfile | undefined {
    return usersDatabase[name];
}

// Helper function to get user by ID
export function getUserById(id: number): UserProfile | undefined {
    return Object.values(usersDatabase).find(user => user.id === id);
}

// Search users by name (case-insensitive partial match)
export function searchUsers(query: string): UserProfile[] {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return Object.values(usersDatabase).filter(user =>
        user.name.toLowerCase().includes(lowerQuery)
    );
}

// Get users who can teach a specific skill
export function getUsersBySkill(skill: string): UserProfile[] {
    const lowerSkill = skill.toLowerCase();
    return Object.values(usersDatabase).filter(user =>
        user.skillsHave.some(s => s.toLowerCase() === lowerSkill)
    );
}

// Search departments by query (case-insensitive partial match)
export function searchDepartments(query: string): string[] {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return DEPARTMENTS.filter(dept =>
        dept.toLowerCase().includes(lowerQuery)
    );
}

// Get users by department
export function getUsersByDepartment(department: string): UserProfile[] {
    return Object.values(usersDatabase).filter(user =>
        user.department === department
    );
}
