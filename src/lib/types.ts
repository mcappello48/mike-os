export type Status = 'Inbox' | 'Action Now' | 'Waiting On' | 'Follow Up' | 'Deep Work' | 'Done';
export type Priority = 'High' | 'Medium' | 'Low';

export type Project = {
  id: string;
  name: string;
  client?: string;
  status: string;
  priority: Priority;
  dueDate?: string;
  notes?: string;
};

export type Task = {
  id: string;
  title: string;
  projectId?: string;
  status: Status;
  priority: Priority;
  dueDate?: string;
  owner?: string;
  source?: string;
  summary?: string;
  createdAt: string;
};

export type FollowUp = {
  id: string;
  person: string;
  company?: string;
  projectId?: string;
  waitingFor: string;
  lastContactDate?: string;
  followUpDate?: string;
  status: Status;
  createdAt: string;
};

export type Note = {
  id: string;
  raw: string;
  cleanSummary: string;
  projectId?: string;
  createdAt: string;
};

export type AppData = {
  projects: Project[];
  tasks: Task[];
  followUps: FollowUp[];
  notes: Note[];
};
