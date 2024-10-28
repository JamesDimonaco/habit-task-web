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
