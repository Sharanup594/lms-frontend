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

// ── Pre-Enrolment ───────────────────────────────────

export interface SkillAssessment {
  id: string
  userId: string
  score: number
  interests: string[]
  recommendedCourseIds: string[]
  completedAt: string
}

// ── Course Assessments ──────────────────────────────

export interface Assessment {
  id: string
  title: string
  description: string
  type: 'PRE_COURSE' | 'IN_COURSE' | 'POST_COURSE'
  courseId: string
  moduleId?: string
  passingScore: number
  timeLimit?: number
  totalPoints: number
  published: boolean
  questions: AssessmentQuestion[]
  myAttempt?: AssessmentAttempt
}

export interface AssessmentQuestion {
  id: string
  question: string
  type: string
  options: string[]
  points: number
  orderIndex: number
}

export interface AssessmentAttempt {
  id: string
  userId: string
  assessmentId: string
  score: number
  totalPoints: number
  passed: boolean
  startedAt: string
  completedAt?: string
}
