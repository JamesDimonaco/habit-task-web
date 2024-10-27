export interface LogType {
  date: string;
  habbit: string;
}

export interface HabbitType {
  name: string;
  description: string;
  frequency: string;
  icon?: string;
  id: string;
  logs: LogType[];
  createdAt: string;
}
