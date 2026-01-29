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
        skillsHave: ["Machine Learning", "Python", "TensorFlow"],
        skillsWant: ["React", "UI/UX"],
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
        skillsHave: ["Python", "Data Science", "SQL"],
        skillsWant: ["TypeScript", "Backend"],
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
        skillsHave: ["Deep Learning", "Computer Vision"],
        skillsWant: ["Web Dev", "React"],
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
        skillsHave: ["Java", "Spring Boot", "Microservices"],
        skillsWant: ["React", "Frontend"],
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
        skillsHave: ["Python", "Django", "PostgreSQL"],
        skillsWant: ["Machine Learning", "AI"],
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
        skillsHave: ["Flutter", "Dart", "Firebase"],
        skillsWant: ["React Native", "Swift"],
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
        skillsHave: ["NLP", "PyTorch", "Hugging Face"],
        skillsWant: ["Web Dev", "JavaScript"],
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
        skillsHave: ["C++", "Embedded Systems", "Arduino"],
        skillsWant: ["Python", "IoT"],
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
        skillsHave: ["React", "TypeScript", "Node.js", "CSS", "Git"],
        skillsWant: ["Machine Learning", "Python", "TensorFlow", "Data Science"],
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
        skillsHave: ["Node.js", "Express", "MongoDB"],
        skillsWant: ["React", "TypeScript"],
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
        skillsWant: ["React", "Node.js"],
        rating: 4.6,
        sessions: 24,
        points: 1580,
        badges: 5,
        streak: 8,
        trend: "+9%"
    }
};

// Helper function to get user by name
export function getUserByName(name: string): UserProfile | undefined {
    return usersDatabase[name];
}

// Helper function to get user by ID
export function getUserById(id: number): UserProfile | undefined {
    return Object.values(usersDatabase).find(user => user.id === id);
}
