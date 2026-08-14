using AssignmentSystem.DTOs.AcademicClass;
using AssignmentSystem.DTOs.Subject;
using AssignmentSystem.Entities;
using AssignmentSystem.Mappings;
using AssignmentSystem.Tests.Helpers;
using FluentAssertions;

namespace AssignmentSystem.Tests.Mappings
{
    public class MappingProfileTests
    {
        [Fact]
        public void MappingConfiguration_ShouldCreateMapperWithoutErrors()
        {
            var configuration = new AutoMapper.MapperConfiguration(cfg =>
                cfg.AddProfile<MappingProfile>());

            configuration.CompileMappings();

            configuration.CreateMapper().Should().NotBeNull();
        }

        [Fact]
        public void CreateAcademicClassDto_ShouldMapToAcademicClass()
        {
            var mapper = TestDataFactory.CreateMapper();

            var result = mapper.Map<AcademicClass>(new CreateAcademicClassDto
            {
                Name = "CSE-101",
                Department = "CSE",
                Semester = "Spring",
                Section = "A"
            });

            result.Name.Should().Be("CSE-101");
            result.Department.Should().Be("CSE");
            result.Semester.Should().Be("Spring");
            result.Section.Should().Be("A");
        }

        [Fact]
        public void AcademicClass_ShouldMapToAcademicClassResponseDto()
        {
            var mapper = TestDataFactory.CreateMapper();

            var result = mapper.Map<AcademicClassResponseDto>(
                TestDataFactory.CreateAcademicClass(1, "CSE-101"));

            result.Id.Should().Be(1);
            result.Name.Should().Be("CSE-101");
        }

        [Fact]
        public void CreateSubjectDto_ShouldMapToSubject()
        {
            var mapper = TestDataFactory.CreateMapper();

            var result = mapper.Map<Subject>(new CreateSubjectDto
            {
                Code = "CSE101",
                Name = "Data Structures",
                Credit = 3
            });

            result.Code.Should().Be("CSE101");
            result.Name.Should().Be("Data Structures");
            result.Credit.Should().Be(3);
        }

        [Fact]
        public void User_ShouldMapToUserResponseDtoWithRoleName()
        {
            var mapper = TestDataFactory.CreateMapper();
            var user = TestDataFactory.CreateUser(1, roleName: "Teacher");

            var result = mapper.Map<AssignmentSystem.DTOs.User.UserResponseDto>(user);

            result.Id.Should().Be(1);
            result.Role.Should().Be("Teacher");
        }

        [Fact]
        public void TeacherClassSubject_ShouldMapToResponseWithNames()
        {
            var mapper = TestDataFactory.CreateMapper();

            var result = mapper.Map<AssignmentSystem.DTOs.TeacherClassSubject.TeacherClassSubjectResponseDto>(
                TestDataFactory.CreateTeacherClassSubject(1));

            result.TeacherName.Should().Be("John Doe");
            result.AcademicClassName.Should().Be("CSE-101");
            result.SubjectCode.Should().Be("CSE101");
            result.SubjectName.Should().Be("Data Structures");
        }
    }
}
