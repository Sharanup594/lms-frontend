export interface Instructor {
  id: string
  name: string
  avatar: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: Instructor
  category: string
  duration: string
  enrolled: number
  rating: number
  progress: number
  thumbnail: string
  modules: Module[]
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status: 'not-started' | 'in-progress' | 'completed'
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
  duration: string
  orderIndex?: number
}

export interface Lesson {
  id: string
  title: string
  type: 'video' | 'article' | 'quiz' | 'VIDEO' | 'ARTICLE' | 'QUIZ'
  duration: string
  completed: boolean
  orderIndex?: number
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  createdAt?: string
  coursesEnrolled: number
  coursesCompleted: number
  totalHours: number
}

export interface DashboardStats {
  coursesEnrolled: number
  coursesCompleted: number
  hoursLearned: number
  certificates: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedDate: string
}
