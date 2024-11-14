export interface LogType {
  date: string;
  habit: string;
}

export interface HabitType {
  name: string;
  description: string;
  frequency: string;
  icon?: string;
  id: string;
  logs: LogType[];
  createdAt: string;
}

export interface UserType {
  username: string;
  email: string;
  avatar?: string;
  id: string;
}
