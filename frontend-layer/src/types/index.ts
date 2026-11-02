export interface Skill {
  name: string;
  category?: string;
}

export interface Education {
  degree: string;
  institution?: string;
  start_date?: string;
  end_date?: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  date?: string;
}

export interface Project {
  name: string;
  description?: string;
  technologies: string[];
}

export interface WorkExperience {
  role?: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;

  skills: Skill[];
  roles: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
}

export interface Evidence {
  requirement?: string;
  sentence?: string;
  source?: string;
  relevance?: number;
}

export interface Gap {
  requirement?: string;
  description?: string;
  severity?: string;
}

export interface MatchItem {
  requirement: string;
  matched: boolean;
  score: number;
  evidence?: string;
  gap?: string;
}

export interface MatchResult {
  total_score: number;
  matched_items: MatchItem[];
  evidence: Evidence[];
  gaps: Gap[];
  suggestions: string[];
}

export interface AnalysisResponse {
  success: boolean;
  message?: string;
  result?: MatchResult;
  resume_id?: string;
  filename?: string;
  profile?: ResumeData;
}