using AssignmentSystem.DTOs.Assignment;
using AssignmentSystem.Entities;
using AssignmentSystem.Enums;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Implementations;
using AssignmentSystem.Tests.Helpers;
using FluentAssertions;
using Moq;

namespace AssignmentSystem.Tests.Services
{
    public class AssignmentServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWork = new();
        private readonly AutoMapper.IMapper _mapper = TestDataFactory.CreateMapper();

        private AssignmentService CreateService(int? userId = null, params string[] roles)
        {
            return new AssignmentService(
                _unitOfWork.Object,
                _mapper,
                TestHttpContextHelper.CreateHttpContextAccessor(userId, roles));
        }

        private static CreateAssignmentDto CreateValidDto(DateTime? deadline = null)
        {
            return new CreateAssignmentDto
            {
                TeacherClassSubjectId = 1,
                Title = "Midterm",
                Description = "Solve problems.",
                Deadline = deadline ?? DateTime.UtcNow.AddDays(7),
                MaximumMarks = 100
            };
        }

        private static UpdateAssignmentDto CreateValidUpdateDto(DateTime? deadline = null)
        {
            return new UpdateAssignmentDto
            {
                TeacherClassSubjectId = 1,
                Title = "Midterm",
                Description = "Solve problems.",
                Deadline = deadline ?? DateTime.UtcNow.AddDays(7),
                MaximumMarks = 100
            };
        }

        [Fact]
        public async Task CreateAsync_WhenNotAuthenticated_ShouldReturnUnauthorized()
        {
            var service = CreateService();

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(401);
        }

        [Fact]
        public async Task CreateAsync_WhenTeacherClassSubjectNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByIdWithDetailsAsync(1))
                .ReturnsAsync((TeacherClassSubject?)null);
            var service = CreateService(userId: 1);

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
            result.Message.Should().Be("Teacher assignment not found.");
        }

        [Fact]
        public async Task CreateAsync_WhenNotOwner_ShouldReturnForbidden()
        {
            var tcs = TestDataFactory.CreateTeacherClassSubject(1, teacherId: 5);
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByIdWithDetailsAsync(1)).ReturnsAsync(tcs);
            var service = CreateService(userId: 1);

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(403);
        }

        [Fact]
        public async Task CreateAsync_WhenDeadlineInPast_ShouldReturnBadRequest()
        {
            var tcs = TestDataFactory.CreateTeacherClassSubject(1, teacherId: 1);
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByIdWithDetailsAsync(1)).ReturnsAsync(tcs);
            var service = CreateService(userId: 1);

            var result = await service.CreateAsync(CreateValidDto(DateTime.UtcNow.AddDays(-1)));

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Deadline must be a future date.");
        }

        [Fact]
        public async Task CreateAsync_WithValidData_ShouldReturnCreatedWithDraftStatus()
        {
            var tcs = TestDataFactory.CreateTeacherClassSubject(1, teacherId: 1);
            _unitOfWork.Setup(u => u.TeacherClassSubjects.GetByIdWithDetailsAsync(1)).ReturnsAsync(tcs);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(It.IsAny<int>()))
                .ReturnsAsync(TestDataFactory.CreateAssignment(1, status: AssignmentStatus.Draft));

            Assignment? captured = null;
            _unitOfWork.Setup(u => u.Assignments.AddAsync(It.IsAny<Assignment>()))
                .Callback<Assignment>(a => captured = a)
                .Returns(Task.CompletedTask);
            var service = CreateService(userId: 1);

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(201);
            captured.Should().NotBeNull();
            captured!.Status.Should().Be(AssignmentStatus.Draft);
            captured.PublishedAt.Should().BeNull();
            _unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task CloseAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(99))
                .ReturnsAsync((Assignment?)null);
            var service = CreateService(userId: 1);

            var result = await service.CloseAsync(99);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task CloseAsync_WhenNotOwnerAndNotAdmin_ShouldReturnForbidden()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 5);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            var service = CreateService(userId: 1);

            var result = await service.CloseAsync(1);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(403);
        }

        [Fact]
        public async Task CloseAsync_WhenOwner_ShouldCloseAndReturnSuccess()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 1);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService(userId: 1);

            var result = await service.CloseAsync(1);

            result.Success.Should().BeTrue();
            result.Data.Should().BeTrue();
            assignment.Status.Should().Be(AssignmentStatus.Closed);
            _unitOfWork.Verify(u => u.Assignments.Update(assignment), Times.Once);
        }

        [Fact]
        public async Task CloseAsync_WhenAdmin_ShouldCloseOtherTeachersAssignment()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 5);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService(userId: 9, "Admin");

            var result = await service.CloseAsync(1);

            result.Success.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteAsync_WhenAlreadyDeleted_ShouldReturnNotFound()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 1);
            assignment.IsDeleted = true;
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            var service = CreateService(userId: 1);

            var result = await service.DeleteAsync(1);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task DeleteAsync_WhenOwner_ShouldMarkDeleted()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 1);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService(userId: 1);

            var result = await service.DeleteAsync(1);

            result.Success.Should().BeTrue();
            assignment.IsDeleted.Should().BeTrue();
        }

        [Fact]
        public async Task PublishAsync_WhenOwner_ShouldPublishAssignment()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 1);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService(userId: 1);

            var result = await service.PublishAsync(1);

            result.Success.Should().BeTrue();
            assignment.Status.Should().Be(AssignmentStatus.Published);
            assignment.PublishedAt.Should().NotBeNull();
        }

        [Fact]
        public async Task GetAllAsync_WhenNotAuthenticated_ShouldReturnUnauthorized()
        {
            var service = CreateService();

            var result = await service.GetAllAsync();

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(401);
        }

        [Fact]
        public async Task GetAllAsync_ForStudent_ShouldOnlySeePublishedAndClosed()
        {
            var assignments = new List<Assignment>
            {
                TestDataFactory.CreateAssignment(1, status: AssignmentStatus.Draft),
                TestDataFactory.CreateAssignment(2, status: AssignmentStatus.Published),
                TestDataFactory.CreateAssignment(3, status: AssignmentStatus.Closed)
            };
            _unitOfWork.Setup(u => u.Assignments.GetAllWithDetailsAsync()).ReturnsAsync(assignments);
            var service = CreateService(userId: 3, "Student");

            var result = await service.GetAllAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(2);
            result.Data!.Should().NotContain(a => a.Id == 1);
        }

        [Fact]
        public async Task GetAllAsync_ForTeacher_ShouldOnlySeeOwnAssignments()
        {
            var mine = TestDataFactory.CreateAssignment(1, teacherId: 1);
            var others = TestDataFactory.CreateAssignment(2, teacherId: 2);
            _unitOfWork.Setup(u => u.Assignments.GetAllWithDetailsAsync())
                .ReturnsAsync(new List<Assignment> { mine, others });
            var service = CreateService(userId: 1, "Teacher");

            var result = await service.GetAllAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(1);
            result.Data!.Single().Id.Should().Be(1);
        }

        [Fact]
        public async Task GetAllAsync_ForAdmin_ShouldSeeAll()
        {
            _unitOfWork.Setup(u => u.Assignments.GetAllWithDetailsAsync())
                .ReturnsAsync(new List<Assignment>
                {
                    TestDataFactory.CreateAssignment(1, teacherId: 1),
                    TestDataFactory.CreateAssignment(2, teacherId: 2)
                });
            var service = CreateService(userId: 9, "Admin");

            var result = await service.GetAllAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetByIdAsync_WhenNotAuthenticated_ShouldReturnUnauthorized()
        {
            var service = CreateService();

            var result = await service.GetByIdAsync(1);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(401);
        }

        [Fact]
        public async Task GetByIdAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(99))
                .ReturnsAsync((Assignment?)null);
            var service = CreateService(userId: 1);

            var result = await service.GetByIdAsync(99);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task GetByIdAsync_ForStudent_WhenDraft_ShouldReturnForbidden()
        {
            var assignment = TestDataFactory.CreateAssignment(1, status: AssignmentStatus.Draft);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            var service = CreateService(userId: 3, "Student");

            var result = await service.GetByIdAsync(1);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(403);
        }

        [Fact]
        public async Task GetByIdAsync_ForStudent_WhenPublished_ShouldReturnAssignment()
        {
            var assignment = TestDataFactory.CreateAssignment(1, status: AssignmentStatus.Published);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            var service = CreateService(userId: 3, "Student");

            var result = await service.GetByIdAsync(1);

            result.Success.Should().BeTrue();
            result.Data!.Id.Should().Be(1);
        }

        [Fact]
        public async Task GetByIdAsync_ForTeacher_WhenNotOwner_ShouldReturnForbidden()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 2);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            var service = CreateService(userId: 1, "Teacher");

            var result = await service.GetByIdAsync(1);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(403);
        }

        [Fact]
        public async Task UpdateAsync_WhenClosed_ShouldReturnBadRequest()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 1, status: AssignmentStatus.Closed);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            var service = CreateService(userId: 1);

            var result = await service.UpdateAsync(1, CreateValidUpdateDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Closed assignment cannot be updated.");
        }

        [Fact]
        public async Task UpdateAsync_WhenNotOwner_ShouldReturnForbidden()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 2);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            var service = CreateService(userId: 1);

            var result = await service.UpdateAsync(1, CreateValidUpdateDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(403);
        }

        [Fact]
        public async Task UpdateAsync_WithPastDeadline_ShouldReturnBadRequest()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 1);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            var service = CreateService(userId: 1);

            var result = await service.UpdateAsync(1, CreateValidUpdateDto(DateTime.UtcNow.AddDays(-2)));

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
        }

        [Fact]
        public async Task UpdateAsync_WithValidData_ShouldReturnSuccess()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 1);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService(userId: 1);

            var result = await service.UpdateAsync(1, CreateValidUpdateDto());

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(200);
            _unitOfWork.Verify(u => u.Assignments.Update(assignment), Times.Once);
        }
    }
}
