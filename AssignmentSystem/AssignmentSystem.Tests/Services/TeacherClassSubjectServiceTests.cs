using AssignmentSystem.DTOs.TeacherClassSubject;
using AssignmentSystem.Entities;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Implementations;
using AssignmentSystem.Tests.Helpers;
using FluentAssertions;
using Moq;

namespace AssignmentSystem.Tests.Services
{
    public class TeacherClassSubjectServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWork = new();
        private readonly AutoMapper.IMapper _mapper = TestDataFactory.CreateMapper();

        private TeacherClassSubjectService CreateService(int? userId = null)
        {
            return new TeacherClassSubjectService(
                _unitOfWork.Object,
                _mapper,
                TestHttpContextHelper.CreateHttpContextAccessor(userId));
        }

        private static CreateTeacherClassSubjectDto CreateValidDto()
        {
            return new CreateTeacherClassSubjectDto
            {
                TeacherId = 1,
                AcademicClassId = 1,
                SubjectId = 1,
                IsActive = true
            };
        }

        [Fact]
        public async Task CreateAsync_WhenTeacherNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(1))
                .ReturnsAsync((User?)null);
            var service = CreateService();

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
            result.Message.Should().Be("Teacher not found.");
        }

        [Fact]
        public async Task CreateAsync_WhenUserIsNotTeacher_ShouldReturnBadRequest()
        {
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(1))
                .ReturnsAsync(TestDataFactory.CreateUser(1, roleName: "Student"));
            var service = CreateService();

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Selected user is not a teacher.");
        }

        [Fact]
        public async Task CreateAsync_WhenAcademicClassNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(1))
                .ReturnsAsync(TestDataFactory.CreateUser(1, roleName: "Teacher"));
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(1))
                .ReturnsAsync((AcademicClass?)null);
            var service = CreateService();

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
            result.Message.Should().Be("Academic class not found.");
        }

        [Fact]
        public async Task CreateAsync_WhenSubjectNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(1))
                .ReturnsAsync(TestDataFactory.CreateUser(1, roleName: "Teacher"));
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateAcademicClass());
            _unitOfWork.Setup(u => u.Subjects.GetByIdAsync(1))
                .ReturnsAsync((Subject?)null);
            var service = CreateService();

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
            result.Message.Should().Be("Subject not found.");
        }

        [Fact]
        public async Task CreateAsync_WhenDuplicateAssignment_ShouldReturnBadRequest()
        {
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(1))
                .ReturnsAsync(TestDataFactory.CreateUser(1, roleName: "Teacher"));
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateAcademicClass());
            _unitOfWork.Setup(u => u.Subjects.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateSubject());
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetAssignmentAsync(1, 1, 1))
                .ReturnsAsync(TestDataFactory.CreateTeacherClassSubject());
            var service = CreateService();

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("This teacher is already assigned to this class and subject.");
        }

        [Fact]
        public async Task CreateAsync_WithValidData_ShouldReturnCreated()
        {
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(1))
                .ReturnsAsync(TestDataFactory.CreateUser(1, roleName: "Teacher"));
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateAcademicClass());
            _unitOfWork.Setup(u => u.Subjects.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateSubject());
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetAssignmentAsync(1, 1, 1))
                .ReturnsAsync((TeacherClassSubject?)null);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByIdWithDetailsAsync(It.IsAny<int>()))
                .ReturnsAsync(TestDataFactory.CreateTeacherClassSubject());
            var service = CreateService();

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(201);
            result.Data!.TeacherName.Should().Be("John Doe");
            _unitOfWork.Verify(u => u.TeacherClassSubjects.AddAsync(It.IsAny<TeacherClassSubject>()), Times.Once);
            _unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetMyAsync_WhenNotAuthenticated_ShouldReturnUnauthorized()
        {
            var service = CreateService();

            var result = await service.GetMyAsync();

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(401);
        }

        [Fact]
        public async Task GetMyAsync_WhenAuthenticated_ShouldReturnTeachersAssignments()
        {
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByTeacherAsync(7))
                .ReturnsAsync(new List<TeacherClassSubject>
                {
                    TestDataFactory.CreateTeacherClassSubject(1, teacherId: 7)
                });
            var service = CreateService(userId: 7);

            var result = await service.GetMyAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(1);
        }

        [Fact]
        public async Task GetByIdAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByIdWithDetailsAsync(99))
                .ReturnsAsync((TeacherClassSubject?)null);
            var service = CreateService();

            var result = await service.GetByIdAsync(99);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllAssignments()
        {
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetAllWithDetailsAsync())
                .ReturnsAsync(new List<TeacherClassSubject>
                {
                    TestDataFactory.CreateTeacherClassSubject(1),
                    TestDataFactory.CreateTeacherClassSubject(2)
                });
            var service = CreateService();

            var result = await service.GetAllAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(2);
        }

        [Fact]
        public async Task DeleteAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByIdAsync(99))
                .ReturnsAsync((TeacherClassSubject?)null);
            var service = CreateService();

            var result = await service.DeleteAsync(99);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task DeleteAsync_WhenFound_ShouldSoftDeleteAndReturnSuccess()
        {
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateTeacherClassSubject());
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService();

            var result = await service.DeleteAsync(1);

            result.Success.Should().BeTrue();
            result.Data.Should().BeTrue();
            _unitOfWork.Verify(u => u.TeacherClassSubjects.SoftDeleteAsync(1), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByIdAsync(99))
                .ReturnsAsync((TeacherClassSubject?)null);
            var service = CreateService();

            var result = await service.UpdateAsync(99, new UpdateTeacherClassSubjectDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
            result.Message.Should().Be("Assignment not found.");
        }

        [Fact]
        public async Task UpdateAsync_WithValidData_ShouldReturnSuccess()
        {
            var existing = TestDataFactory.CreateTeacherClassSubject(1, teacherId: 1);
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByIdAsync(1)).ReturnsAsync(existing);
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(1))
                .ReturnsAsync(TestDataFactory.CreateUser(1, roleName: "Teacher"));
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateAcademicClass());
            _unitOfWork.Setup(u => u.Subjects.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateSubject());
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetAssignmentAsync(1, 1, 1, 1))
                .ReturnsAsync((TeacherClassSubject?)null);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByIdWithDetailsAsync(1))
                .ReturnsAsync(TestDataFactory.CreateTeacherClassSubject(1, teacherId: 1));
            var service = CreateService();

            var result = await service.UpdateAsync(1, new UpdateTeacherClassSubjectDto
            {
                TeacherId = 1,
                AcademicClassId = 1,
                SubjectId = 1,
                IsActive = true
            });

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(200);
            _unitOfWork.Verify(u => u.TeacherClassSubjects.Update(existing), Times.Once);
        }
    }
}
