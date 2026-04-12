import { gql } from '@apollo/client/core'

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
        avatar
      }
    }
  }
`

export const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
        avatar
      }
    }
  }
`

export const ENROLL_MUTATION = gql`
  mutation EnrollInCourse($courseId: ID!) {
    enrollInCourse(courseId: $courseId) {
      id
      status
      progress
    }
  }
`

export const MARK_LESSON_COMPLETE_MUTATION = gql`
  mutation MarkLessonComplete($lessonId: ID!) {
    markLessonComplete(lessonId: $lessonId) {
      id
      completed
    }
  }
`

export const CREATE_COURSE_MUTATION = gql`
  mutation CreateCourse($input: CourseInput!) {
    createCourse(input: $input) {
      id
      title
    }
  }
`

export const DELETE_COURSE_MUTATION = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $role: Role, $name: String) {
    updateUser(id: $id, role: $role, name: $name) {
      id
      name
      role
    }
  }
`

// ── Pre-Enrolment Mutations ─────────────────────────

export const SUBMIT_SKILL_ASSESSMENT_MUTATION = gql`
  mutation SubmitSkillAssessment($answers: [SkillAnswerInput!]!, $interests: [String!]!) {
    submitSkillAssessment(answers: $answers, interests: $interests) {
      id
      score
      interests
      recommendedCourseIds
      completedAt
    }
  }
`

// ── Assessment Mutations ────────────────────────────

export const SUBMIT_ASSESSMENT_MUTATION = gql`
  mutation SubmitAssessment($assessmentId: ID!, $answers: [Int!]!) {
    submitAssessment(assessmentId: $assessmentId, answers: $answers) {
      id
      score
      totalPoints
      passed
      completedAt
    }
  }
`

export const CREATE_ASSESSMENT_MUTATION = gql`
  mutation CreateAssessment($input: CreateAssessmentInput!) {
    createAssessment(input: $input) {
      id
      title
    }
  }
`

export const DELETE_ASSESSMENT_MUTATION = gql`
  mutation DeleteAssessment($id: ID!) {
    deleteAssessment(id: $id)
  }
`

// ── Stage 4: Projects ────────────────────────────────

export const SUBMIT_PROJECT_MUTATION = gql`
  mutation SubmitProject($projectId: ID!, $submissionUrl: String!) {
    submitProject(projectId: $projectId, submissionUrl: $submissionUrl) {
      id
      status
    }
  }
`

// ── Stage 6: Feedback ────────────────────────────────

export const SUBMIT_FEEDBACK_MUTATION = gql`
  mutation SubmitFeedback($courseId: String, $rating: Int!, $comment: String!, $category: String) {
    submitFeedback(courseId: $courseId, rating: $rating, comment: $comment, category: $category) {
      id
      rating
      comment
    }
  }
`

// ── Stage 7: Placement ──────────────────────────────

export const UPDATE_PLACEMENT_MUTATION = gql`
  mutation UpdateMyPlacement($status: String!, $company: String, $role: String, $salary: String, $notes: String) {
    updateMyPlacement(status: $status, company: $company, role: $role, salary: $salary, notes: $notes) {
      id
      status
      company
      role
    }
  }
`
