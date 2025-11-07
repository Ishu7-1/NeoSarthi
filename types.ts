export interface StudentProfile {
  major: string;
  gpa: string;
  projectKeywords: string;
  desiredRole: string;
  resumeText?: string;
}

export interface CourseRecommendation {
  id: string;
  title: string;
  rationale: string;
  url?: string;
}

export interface CareerPath {
  title: string;
  description: string;
}

export interface PrimaryCareerPath extends CareerPath {
  steps: string[];
}

export interface UniversityResource {
  name: string;
  description: string;
  type: string;
}

export interface Readiness {
  score: number;
  summary: string;
}

export interface Recommendations {
  readiness: Readiness;
  courses: CourseRecommendation[];
  careerPaths: {
    primary: PrimaryCareerPath;
    alternatives: CareerPath[];
  };
  universityResources: UniversityResource[];
  requiredSkills?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface RoadmapSkill {
  name: string;
  has: boolean;
  suggestion?: string;
}

export interface Roadmap {
  goal: string;
  skills: RoadmapSkill[];
}

export interface User {
  email: string;
  name?: string;
}
