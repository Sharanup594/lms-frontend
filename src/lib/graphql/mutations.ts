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
