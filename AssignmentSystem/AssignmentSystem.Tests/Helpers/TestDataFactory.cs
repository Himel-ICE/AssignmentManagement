using AssignmentSystem.Entities;
using AssignmentSystem.Enums;
using AutoMapper;
using AssignmentSystem.Mappings;

namespace AssignmentSystem.Tests.Helpers
{
    public static class TestDataFactory
    {
        public static IMapper CreateMapper()
        {
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            configuration.CompileMappings();
            return configuration.CreateMapper();
        }

        public static Role CreateRole(int id, string name)
        {
            return new Role
            {
                Id = id,
                Name = name
            };
        }

        public static User CreateUser(
            int id = 1,
            string firstName = "John",
            string lastName = "Doe",
            string email = "john.doe@example.com",
            string roleName = "Teacher",
            string? password = "password123",
            bool isActive = true)
        {
            return new User
            {
                Id = id,
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                PhoneNumber = "1234567890",
                Password = password ?? string.Empty,
                Gender = "Male",
                IsActive = isActive,
                RoleId = 1,
                Role = CreateRole(1, roleName)
            };
        }

        public static AcademicClass CreateAcademicClass(int id = 1, string? name = "CSE-101")
        {
            return new AcademicClass
            {
                Id = id,
                Name = name ?? $"CSE-{id}",
                Department = "CSE",
                Semester = "Spring",
                Section = "A",
                Description = null,
                IsActive = true
            };
        }

        public static Subject CreateSubject(int id = 1, string? code = "CSE101")
        {
            return new Subject
            {
                Id = id,
                Code = code ?? $"CSE{id}",
                Name = "Data Structures",
                Credit = 3,
                Description = null,
                IsActive = true
            };
        }

        public static TeacherClassSubject CreateTeacherClassSubject(
            int id = 1,
            int teacherId = 1,
            int academicClassId = 1,
            int subjectId = 1)
        {
            return new TeacherClassSubject
            {
                Id = id,
                TeacherId = teacherId,
                AcademicClassId = academicClassId,
                SubjectId = subjectId,
                IsActive = true,
                Teacher = CreateUser(teacherId, "John", "Doe"),
                AcademicClass = CreateAcademicClass(academicClassId),
                Subject = CreateSubject(subjectId)
            };
        }

        public static Assignment CreateAssignment(
            int id = 1,
            int teacherClassSubjectId = 1,
            int teacherId = 1,
            AssignmentStatus status = AssignmentStatus.Draft,
            DateTime? deadline = null)
        {
            return new Assignment
            {
                Id = id,
                TeacherClassSubjectId = teacherClassSubjectId,
                Title = "Midterm Assignment",
                Description = "Solve all problems.",
                Deadline = deadline ?? DateTime.UtcNow.AddDays(7),
                MaximumMarks = 100,
                Status = status,
                PublishedAt = status == AssignmentStatus.Published ? DateTime.UtcNow : null,
                TeacherClassSubject = CreateTeacherClassSubject(teacherClassSubjectId, teacherId)
            };
        }

        public static Submission CreateSubmission(
            int id = 1,
            int assignmentId = 1,
            int studentId = 1,
            SubmissionStatus status = SubmissionStatus.Submitted,
            decimal? marks = null)
        {
            return new Submission
            {
                Id = id,
                AssignmentId = assignmentId,
                StudentId = studentId,
                Answer = "My answer",
                SubmittedAt = DateTime.UtcNow,
                Marks = marks,
                Feedback = null,
                Status = status,
                Assignment = CreateAssignment(
                    assignmentId,
                    status: AssignmentStatus.Published),
                Student = CreateUser(studentId, "Jane", "Smith", "jane@example.com", "Student")
            };
        }
    }
}
