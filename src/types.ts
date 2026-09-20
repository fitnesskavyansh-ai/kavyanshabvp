export type IssueStatus = 'New' | 'Under Review' | 'In Progress' | 'Resolved' | 'Closed';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type IssueCategory =
  | 'Student Issue'
  | 'College/University Issue'
  | 'Education'
  | 'Scholarship'
  | 'Hostel'
  | 'Examination'
  | 'Documentation'
  | 'Youth Issue'
  | 'Local Civic Issue'
  | 'Public Service'
  | 'Other';

export interface IssueAttachment {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface SubmittedIssue {
  id: string;
  ticketNumber: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  mobile: string;
  email?: string;
  district: string;
  city: string;
  areaLocality: string;
  category: IssueCategory;
  title: string;
  description: string;
  preferredContact: 'Phone' | 'WhatsApp' | 'Email' | 'Any';
  attachment?: IssueAttachment;
  status: IssueStatus;
  priority: IssuePriority;
  assignedTo?: string;
  adminNotes?: string;
  resolutionNotes?: string;
  consent: boolean;
}

export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  contact: string; // phone or email
  subject: string;
  message: string;
  status: 'New' | 'Replied' | 'Archived';
}

export interface JourneyMilestone {
  id: string;
  yearOrDate: string; // e.g. "June 2026", "9 September 2026"
  title: string; // e.g. "ABVP से जुड़ाव", "नगर मंत्री, मथुरा"
  englishLabel?: string; // e.g. "ABVP Journey Begins", "Current Responsibility"
  subtitle?: string;
  description: string;
  category: string; // e.g. "ABVP Journey", "Organisation", "Current Responsibility", "Present"
  status?: string; // e.g. "Journey Begins", "Early Journey", "Journey Continues", "Growth", "CURRENT", "Active"
  location?: string;
  photoUrl?: string;
  badge?: string;
  isPublished?: boolean;
  isCurrentResponsibility?: boolean;
}

export type ActivityCategory =
  | 'Student Issues'
  | 'Youth Activities'
  | 'Campus Activities'
  | 'Social Activities'
  | 'Public Interaction'
  | 'Awareness Programs'
  | 'Blood Donation / Service Activities'
  | 'Educational Activities'
  | 'Other Activities';

export interface ActivityItem {
  id: string;
  title: string;
  category: ActivityCategory | string;
  date: string;
  location: string;
  description: string;
  photos: string[];
  video?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
  mediaUrls?: string[];
  photoUrl?: string;
  gallery?: string[];
  keyOutcomes?: string[];
}

export type GalleryCategory =
  | 'ABVP Activities'
  | 'Student Activities'
  | 'Public Interaction'
  | 'Social Activities'
  | 'Events'
  | 'Personal / Professional';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateCategory =
  | 'Activity Update'
  | 'Event Announcement'
  | 'Student Information'
  | 'Public Notice'
  | 'Important Update';

export interface UpdatePost {
  id: string;
  title: string;
  category: UpdateCategory;
  date: string;
  featuredImage?: string;
  summary: string;
  description: string;
  gallery?: string[];
  externalLink?: string;
}

export interface PublicResourceDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  buttonText: string;
  tag?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ProfileConfig {
  name: string;
  communitySubtitle?: string;
  role: string;
  organisation: string;
  city: string;
  hometown?: string;
  residence: string;
  nativePlace: string;
  dob: string;
  education: string;
  currentYearSemester?: string;
  joiningDate: string;
  joiningYear: string;
  journeyBio: string;
  email: string;
  phone: string;
  officeLocation: string;
  socials: {
    instagram: string;
    facebook: string;
    linkedin: string;
    twitterX: string;
    youtube?: string;
  };
  photo?: string; // Canonical centralized profile photograph
  photoUrl: string; // Synchronized alias
  isPhotoLocked?: boolean;
  photoLockedAt?: string;
  shortIntro: string;
  detailedAbout: string;
  visionPoints: {
    title: string;
    description: string;
    icon: string;
  }[];
}
