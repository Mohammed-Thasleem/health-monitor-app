export interface HealthMetric {
  id: string;
  user_id: string;
  date: string;
  steps: number;
  water_intake: number;
  weight: number;
  sleep_hours: number;
  created_at: string;
  updated_at: string;
}

export interface UserGoals {
  id: string;
  user_id: string;
  steps_goal: number;
  water_goal: number;
  weight_goal: number;
  sleep_goal: number;
  created_at: string;
  updated_at: string;
}

export interface HealthFormData {
  date: string;
  steps: number;
  water_intake: number;
  weight: number;
  sleep_hours: number;
}

export interface GoalsFormData {
  steps_goal: number;
  water_goal: number;
  weight_goal: number;
  sleep_goal: number;
}
