using AssignmentSystem.DTOs.Submission;
using AssignmentSystem.Entities;
using AssignmentSystem.Enums;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Implementations;
using AssignmentSystem.Tests.Helpers;
using FluentAssertions;
using Moq;

namespace AssignmentSystem.Tests.Services
{
    public class SubmissionServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWork = new();
        private readonly AutoMapper.IMapper _mapper = TestDataFactory.CreateMapper();

        private SubmissionService CreateService(int? userId = null, params string[] roles)
        {
            return new SubmissionService(
                _unitOfWork.Object,
                _mapper,
                TestHttpContextHelper.CreateHttpContextAccessor(userId, roles));
        }

        private static Assignment PublishedAssignment(int teacherId = 1)
        {
            return TestDataFactory.CreateAssignment(
                1,
                teacherId: teacherId,
                status: AssignmentStatus.Published,
                deadline: DateTime.UtcNow.AddDays(7));
        }

        [Fact]
        public async Task SubmitAsync_WhenNotAuthenticated_ShouldReturnUnauthorized()
        {
            var service = CreateService();

            var result = await service.SubmitAsync(new CreateSubmissionDto { AssignmentId = 1 });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(401);
        }

        [Fact]
        public async Task SubmitAsync_WhenAssignmentNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1))
                .ReturnsAsync((Assignment?)null);
            var service = CreateService(userId: 3, "Student");

            var result = await service.SubmitAsync(new CreateSubmissionDto { AssignmentId = 1 });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task SubmitAsync_WhenAssignmentNotPublished_ShouldReturnBadRequest()
        {
            var assignment = TestDataFactory.CreateAssignment(1, status: AssignmentStatus.Draft);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            var service = CreateService(userId: 3, "Student");

            var result = await service.SubmitAsync(new CreateSubmissionDto { AssignmentId = 1 });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Assignment is not published yet.");
        }

        [Fact]
        public async Task SubmitAsync_WhenDeadlinePassed_ShouldReturnBadRequest()
        {
            var assignment = TestDataFactory.CreateAssignment(
                1,
                status: AssignmentStatus.Published,
                deadline: DateTime.UtcNow.AddDays(-1));
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            var service = CreateService(userId: 3, "Student");

            var result = await service.SubmitAsync(new CreateSubmissionDto { AssignmentId = 1 });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Submission deadline has passed.");
        }

        [Fact]
        public async Task SubmitAsync_WhenAlreadySubmitted_ShouldReturnBadRequest()
        {
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(PublishedAssignment());
            _unitOfWork.Setup(u => u.Submissions.GetByAssignmentAndStudentAsync(1, 3))
                .ReturnsAsync(TestDataFactory.CreateSubmission(1));
            var service = CreateService(userId: 3, "Student");

            var result = await service.SubmitAsync(new CreateSubmissionDto { AssignmentId = 1 });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("You have already submitted this assignment.");
        }

        [Fact]
        public async Task SubmitAsync_WithValidData_ShouldReturnCreated()
        {
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(PublishedAssignment());
            _unitOfWork.Setup(u => u.Submissions.GetByAssignmentAndStudentAsync(1, 3))
                .ReturnsAsync((Submission?)null);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            _unitOfWork.Setup(u => u.Submissions.GetByIdWithDetailsAsync(It.IsAny<int>()))
                .ReturnsAsync(TestDataFactory.CreateSubmission(1, studentId: 3));

            Submission? captured = null;
            _unitOfWork.Setup(u => u.Submissions.AddAsync(It.IsAny<Submission>()))
                .Callback<Submission>(s => captured = s)
                .Returns(Task.CompletedTask);
            var service = CreateService(userId: 3, "Student");

            var result = await service.SubmitAsync(new CreateSubmissionDto
            {
                AssignmentId = 1,
                Answer = "My solution"
            });

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(201);
            captured.Should().NotBeNull();
            captured!.StudentId.Should().Be(3);
            captured.Status.Should().Be(SubmissionStatus.Submitted);
            _unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_WhenNotOwner_ShouldReturnForbidden()
        {
            var submission = TestDataFactory.CreateSubmission(1, studentId: 5);
            _unitOfWork.Setup(u => u.Submissions.GetByIdWithDetailsAsync(1)).ReturnsAsync(submission);
            var service = CreateService(userId: 3, "Student");

            var result = await service.UpdateAsync(1, new UpdateSubmissionDto { Answer = "Updated" });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(403);
        }

        [Fact]
        public async Task UpdateAsync_WhenAssignmentClosed_ShouldReturnBadRequest()
        {
            var submission = TestDataFactory.CreateSubmission(1, studentId: 3);
            submission.Assignment.Status = AssignmentStatus.Closed;
            _unitOfWork.Setup(u => u.Submissions.GetByIdWithDetailsAsync(1)).ReturnsAsync(submission);
            var service = CreateService(userId: 3, "Student");

            var result = await service.UpdateAsync(1, new UpdateSubmissionDto { Answer = "Updated" });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Assignment is not published anymore.");
        }

        [Fact]
        public async Task UpdateAsync_WhenDeadlinePassed_ShouldReturnBadRequest()
        {
            var submission = TestDataFactory.CreateSubmission(1, studentId: 3);
            submission.Assignment.Deadline = DateTime.UtcNow.AddDays(-1);
            _unitOfWork.Setup(u => u.Submissions.GetByIdWithDetailsAsync(1)).ReturnsAsync(submission);
            var service = CreateService(userId: 3, "Student");

            var result = await service.UpdateAsync(1, new UpdateSubmissionDto { Answer = "Updated" });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Submission deadline has passed.");
        }

        [Fact]
        public async Task UpdateAsync_WhenReviewed_ShouldReturnBadRequest()
        {
            var submission = TestDataFactory.CreateSubmission(1, studentId: 3, status: SubmissionStatus.Reviewed);
            _unitOfWork.Setup(u => u.Submissions.GetByIdWithDetailsAsync(1)).ReturnsAsync(submission);
            var service = CreateService(userId: 3, "Student");

            var result = await service.UpdateAsync(1, new UpdateSubmissionDto { Answer = "Updated" });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Submission has already been reviewed and cannot be updated.");
        }

        [Fact]
        public async Task UpdateAsync_WithValidData_ShouldReturnSuccess()
        {
            var submission = TestDataFactory.CreateSubmission(1, studentId: 3);
            _unitOfWork.Setup(u => u.Submissions.GetByIdWithDetailsAsync(1)).ReturnsAsync(submission);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService(userId: 3, "Student");

            var result = await service.UpdateAsync(1, new UpdateSubmissionDto { Answer = "Updated" });

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(200);
            submission.Answer.Should().Be("Updated");
            _unitOfWork.Verify(u => u.Submissions.Update(submission), Times.Once);
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
        public async Task GetAllAsync_ForAdmin_ShouldSeeAllSubmissions()
        {
            _unitOfWork.Setup(u => u.Submissions.GetAllWithDetailsAsync())
                .ReturnsAsync(new List<Submission>
                {
                    TestDataFactory.CreateSubmission(1, studentId: 3),
                    TestDataFactory.CreateSubmission(2, studentId: 4)
                });
            var service = CreateService(userId: 9, "Admin");

            var result = await service.GetAllAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetAllAsync_ForTeacher_ShouldOnlySeeOwnStudentsSubmissions()
        {
            var mine = TestDataFactory.CreateSubmission(1, studentId: 3);
            var others = TestDataFactory.CreateSubmission(2, studentId: 4);
            others.Assignment.TeacherClassSubject.TeacherId = 7;
            _unitOfWork.Setup(u => u.Submissions.GetAllWithDetailsAsync())
                .ReturnsAsync(new List<Submission> { mine, others });
            var service = CreateService(userId: 1, "Teacher");

            var result = await service.GetAllAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(1);
        }

        [Fact]
        public async Task GetMyAsync_ShouldReturnStudentsOwnSubmissions()
        {
            _unitOfWork.Setup(u => u.Submissions.GetByStudentAsync(3))
                .ReturnsAsync(new List<Submission>
                {
                    TestDataFactory.CreateSubmission(1, studentId: 3),
                    TestDataFactory.CreateSubmission(2, studentId: 3)
                });
            var service = CreateService(userId: 3, "Student");

            var result = await service.GetMyAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetByAssignmentAsync_ForNonAdminNotOwner_ShouldReturnForbidden()
        {
            var assignment = TestDataFactory.CreateAssignment(1, teacherId: 7);
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1)).ReturnsAsync(assignment);
            var service = CreateService(userId: 1, "Teacher");

            var result = await service.GetByAssignmentAsync(1);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(403);
        }

        [Fact]
        public async Task GetByAssignmentAsync_ForOwner_ShouldReturnSubmissions()
        {
            _unitOfWork.Setup(u => u.Assignments.GetByIdWithDetailsAsync(1))
                .ReturnsAsync(TestDataFactory.CreateAssignment(1, teacherId: 1));
            _unitOfWork.Setup(u => u.Submissions.GetByAssignmentAsync(1))
                .ReturnsAsync(new List<Submission> { TestDataFactory.CreateSubmission(1) });
            var service = CreateService(userId: 1, "Teacher");

            var result = await service.GetByAssignmentAsync(1);

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(1);
        }

        [Fact]
        public async Task ReviewAsync_WhenNotOwnerAndNotAdmin_ShouldReturnForbidden()
        {
            var submission = TestDataFactory.CreateSubmission(1, studentId: 3);
            submission.Assignment.TeacherClassSubject.TeacherId = 7;
            _unitOfWork.Setup(u => u.Submissions.GetByIdWithDetailsAsync(1)).ReturnsAsync(submission);
            var service = CreateService(userId: 1, "Teacher");

            var result = await service.ReviewAsync(1, new ReviewSubmissionDto
            {
                Status = SubmissionStatus.Reviewed,
                Marks = 90
            });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(403);
        }

        [Fact]
        public async Task ReviewAsync_WhenStatusIsSubmitted_ShouldReturnBadRequest()
        {
            var submission = TestDataFactory.CreateSubmission(1, studentId: 3);
            _unitOfWork.Setup(u => u.Submissions.GetByIdWithDetailsAsync(1)).ReturnsAsync(submission);
            var service = CreateService(userId: 1, "Teacher");

            var result = await service.ReviewAsync(1, new ReviewSubmissionDto
            {
                Status = SubmissionStatus.Submitted
            });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("A reviewed submission must be marked as Reviewed or Rejected.");
        }

        [Fact]
        public async Task ReviewAsync_WhenMarksExceedMaximum_ShouldReturnBadRequest()
        {
            var submission = TestDataFactory.CreateSubmission(1, studentId: 3);
            _unitOfWork.Setup(u => u.Submissions.GetByIdWithDetailsAsync(1)).ReturnsAsync(submission);
            var service = CreateService(userId: 1, "Teacher");

            var result = await service.ReviewAsync(1, new ReviewSubmissionDto
            {
                Status = SubmissionStatus.Reviewed,
                Marks = 9999
            });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Marks must be between 0 and 100.");
        }

        [Fact]
        public async Task ReviewAsync_WithValidData_ShouldReturnSuccess()
        {
            var submission = TestDataFactory.CreateSubmission(1, studentId: 3);
            _unitOfWork.Setup(u => u.Submissions.GetByIdWithDetailsAsync(1)).ReturnsAsync(submission);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService(userId: 1, "Teacher");

            var result = await service.ReviewAsync(1, new ReviewSubmissionDto
            {
                Status = SubmissionStatus.Reviewed,
                Marks = 85,
                Feedback = "Good job"
            });

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(200);
            submission.Marks.Should().Be(85);
            submission.Status.Should().Be(SubmissionStatus.Reviewed);
            _unitOfWork.Verify(u => u.Submissions.Update(submission), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_WhenFound_ShouldSoftDeleteAndReturnSuccess()
        {
            var submission = TestDataFactory.CreateSubmission(1, studentId: 3);
            _unitOfWork.Setup(u => u.Submissions.GetByIdAsync(1)).ReturnsAsync(submission);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService(userId: 1);

            var result = await service.DeleteAsync(1);

            result.Success.Should().BeTrue();
            result.Data.Should().BeTrue();
            submission.IsDeleted.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Submissions.GetByIdAsync(99))
                .ReturnsAsync((Submission?)null);
            var service = CreateService(userId: 1);

            var result = await service.DeleteAsync(99);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }
    }
}
