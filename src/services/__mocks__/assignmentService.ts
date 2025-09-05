// Mock implementation of assignmentService for testing
export const assignmentService = {
  createAssignment: jest.fn(),
  getAssignments: jest.fn(),
  getAssignment: jest.fn(),
  updateAssignment: jest.fn(),
  deleteAssignment: jest.fn(),
  submitAssignment: jest.fn(),
  getSubmissions: jest.fn(),
  getSubmission: jest.fn(),
  gradeSubmission: jest.fn(),
  updateGrade: jest.fn(),
  downloadFile: jest.fn(),
  uploadFile: jest.fn(),
  getAssignmentStats: jest.fn(),
  getDepartments: jest.fn(),
  getCourses: jest.fn(),
  bulkGradeSubmissions: jest.fn(),
  exportGrades: jest.fn()
}
