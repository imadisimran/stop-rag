export type IncidentStatus = "urgent" | "reviewing";

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  image: string;
  imageAlt: string;
  likes: number;
  comments: number;
  timeAgo: string;
  location: string;
}

export type FilterType = "All" | "Recent" | "Damage" | "Urgent";
