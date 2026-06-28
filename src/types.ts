export interface Comment {
  id: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  courseName: string;
  courseCode: string;
  branch: string;
  semester: number;
  materialType: 'notes' | 'past_papers' | 'lab_manuals' | 'syllabus' | 'other';
  topic: string;
  content: string; // Brief markdown/text content representing the material
  fileUrl: string; // Simulation URL
  fileSize: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  comments: Comment[];
  uploadedBy: string;
  uploaderId: string;
  uploaderRep: number;
  createdAt: string;
  verified: boolean;
  premium: boolean;
}

export interface UserPortfolio {
  id: string;
  name: string;
  branch: string;
  semester: number;
  reputationScore: number;
  badge: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  bio: string;
  resourcesUploadedCount: number;
  totalUpvotesReceived: number;
  skills: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

export interface TAM_SAM_SOM_Data {
  name: string;
  value: number;
  label: string;
  description: string;
  percentage: string;
}

export interface TeamMember {
  name: string;
  role: string;
  studentId: string;
  branch: string;
  bio: string;
  avatar: string;
}

export interface UserSession {
  id: string;
  name: string;
  role: 'learner' | 'contributor';
  branch?: string;
  semester?: number;
  badge?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  reputationScore?: number;
  skills?: string[];
  bio?: string;
}

