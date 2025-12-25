
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  skills: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
}
