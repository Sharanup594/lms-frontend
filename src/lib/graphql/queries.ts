import { gql } from '@apollo/client/core'

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      role
      avatar
      coursesEnrolled
      coursesCompleted
      totalHours
    }
  }
`

export const DASHBOARD_STATS_QUERY = gql`
  query MyDashboardStats {
    myDashboardStats {
      coursesEnrolled
      coursesCompleted
      hoursLearned
      certificates
    }
  }
`

export const MY_COURSES_QUERY = gql`
  query MyCourses {
    myCourses {
      id
      title
      description
      instructor {
        id
        name
        avatar
      }
      category
      duration
      level
      thumbnail
      rating
      enrolled
      modules {
        id
        title
        orderIndex
        duration
        lessons {
          id
          title
          type
          duration
          orderIndex
          completed
        }
      }
      progress
      status
    }
  }
`

export const COURSES_QUERY = gql`
  query Courses($category: String, $level: Level, $search: String, $page: Int, $pageSize: Int) {
    courses(category: $category, level: $level, search: $search, page: $page, pageSize: $pageSize) {
      courses {
        id
        title
        description
        instructor {
          id
          name
          avatar
        }
        category
        duration
        level
        thumbnail
        rating
        enrolled
        modules {
          id
          title
          orderIndex
          duration
          lessons {
            id
            title
            type
            duration
            orderIndex
            completed
          }
        }
      }
      total
      page
      pageSize
    }
  }
`

export const COURSE_QUERY = gql`
  query Course($id: ID!) {
    course(id: $id) {
      id
      title
      description
      instructor {
        id
        name
        avatar
      }
      category
      duration
      level
      thumbnail
      rating
      enrolled
      modules {
        id
        title
        orderIndex
        duration
        lessons {
          id
          title
          type
          duration
          orderIndex
          completed
        }
      }
    }
  }
`

export const ACHIEVEMENTS_QUERY = gql`
  query Achievements {
    achievements {
      id
      title
      description
      icon
      earnedDate
    }
  }
`

export const ADMIN_STATS_QUERY = gql`
  query AdminStats {
    adminStats {
      totalCourses
      totalUsers
      totalEnrollments
      avgCompletion
    }
  }
`

export const USERS_QUERY = gql`
  query Users($search: String, $page: Int, $pageSize: Int) {
    users(search: $search, page: $page, pageSize: $pageSize) {
      users {
        id
        name
        email
        role
        avatar
        createdAt
        coursesEnrolled
        coursesCompleted
        totalHours
      }
      total
      page
      pageSize
    }
  }
`

// ── Pre-Enrolment Queries ────────────────────────────

export const MY_SKILL_ASSESSMENT_QUERY = gql`
  query MySkillAssessment {
    mySkillAssessment {
      id
      userId
      score
      interests
      recommendedCourseIds
      completedAt
    }
  }
`

// ── Assessment Queries ───────────────────────────────

export const ASSESSMENT_QUERY = gql`
  query Assessment($id: ID!) {
    assessment(id: $id) {
      id
      title
      description
      type
      courseId
      moduleId
      passingScore
      timeLimit
      totalPoints
      questions {
        id
        question
        type
        options
        points
        orderIndex
      }
      myAttempt {
        id
        score
        totalPoints
        passed
        completedAt
      }
    }
  }
`

export const COURSE_ASSESSMENTS_QUERY = gql`
  query CourseAssessments($courseId: ID!) {
    courseAssessments(courseId: $courseId) {
      id
      title
      description
      type
      passingScore
      timeLimit
      totalPoints
      myAttempt {
        id
        score
        totalPoints
        passed
        completedAt
      }
    }
  }
`

export const MY_ASSESSMENT_ATTEMPTS_QUERY = gql`
  query MyAssessmentAttempts {
    myAssessmentAttempts {
      id
      assessmentId
      score
      totalPoints
      passed
      startedAt
      completedAt
    }
  }
`
