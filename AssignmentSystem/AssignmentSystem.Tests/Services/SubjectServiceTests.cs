using AssignmentSystem.DTOs.Subject;
using AssignmentSystem.Entities;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Implementations;
using AssignmentSystem.Tests.Helpers;
using FluentAssertions;
using Moq;

namespace AssignmentSystem.Tests.Services
{
    public class SubjectServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWork = new();
        private readonly AutoMapper.IMapper _mapper = TestDataFactory.CreateMapper();

        private SubjectService CreateService()
        {
            return new SubjectService(_unitOfWork.Object, _mapper);
        }

        [Fact]
        public async Task CreateAsync_WhenCodeExists_ShouldReturnBadRequest()
        {
            _unitOfWork.Setup(u => u.Subjects.GetByCodeAsync("CSE101"))
                .ReturnsAsync(TestDataFactory.CreateSubject());
            var service = CreateService();

            var result = await service.CreateAsync(new CreateSubjectDto { Code = "CSE101" });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Subject code already exists.");
            _unitOfWork.Verify(u => u.Subjects.AddAsync(It.IsAny<Subject>()), Times.Never);
        }

        [Fact]
        public async Task CreateAsync_WithValidDto_ShouldReturnCreated()
        {
            _unitOfWork.Setup(u => u.Subjects.GetByCodeAsync(It.IsAny<string>()))
                .ReturnsAsync((Subject?)null);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService();

            var result = await service.CreateAsync(new CreateSubjectDto
            {
                Code = "CSE102",
                Name = "Algorithms",
                Credit = 3
            });

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(201);
            result.Data!.Code.Should().Be("CSE102");
            _unitOfWork.Verify(u => u.Subjects.AddAsync(It.IsAny<Subject>()), Times.Once);
        }

        [Fact]
        public async Task GetByIdAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Subjects.GetByIdAsync(99))
                .ReturnsAsync((Subject?)null);
            var service = CreateService();

            var result = await service.GetByIdAsync(99);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task GetByIdAsync_WhenFound_ShouldReturnSubject()
        {
            _unitOfWork.Setup(u => u.Subjects.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateSubject());
            var service = CreateService();

            var result = await service.GetByIdAsync(1);

            result.Success.Should().BeTrue();
            result.Data!.Id.Should().Be(1);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllActiveSubjects()
        {
            _unitOfWork.Setup(u => u.Subjects.GetAllActiveAsync())
                .ReturnsAsync(new List<Subject>
                {
                    TestDataFactory.CreateSubject(1),
                    TestDataFactory.CreateSubject(2)
                });
            var service = CreateService();

            var result = await service.GetAllAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(2);
        }

        [Fact]
        public async Task UpdateAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Subjects.GetByIdAsync(99))
                .ReturnsAsync((Subject?)null);
            var service = CreateService();

            var result = await service.UpdateAsync(99, new UpdateSubjectDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task UpdateAsync_WhenCodeTakenByAnother_ShouldReturnBadRequest()
        {
            var existing = TestDataFactory.CreateSubject(1, "CSE101");
            _unitOfWork.Setup(u => u.Subjects.GetByIdAsync(1)).ReturnsAsync(existing);
            _unitOfWork.Setup(u => u.Subjects.GetByCodeAsync("CSE200", 1))
                .ReturnsAsync(TestDataFactory.CreateSubject(2, "CSE200"));
            var service = CreateService();

            var result = await service.UpdateAsync(1, new UpdateSubjectDto { Code = "CSE200" });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
        }

        [Fact]
        public async Task UpdateAsync_WithValidDto_ShouldReturnSuccess()
        {
            var existing = TestDataFactory.CreateSubject(1, "CSE101");
            _unitOfWork.Setup(u => u.Subjects.GetByIdAsync(1)).ReturnsAsync(existing);
            _unitOfWork.Setup(u => u.Subjects.GetByCodeAsync(It.IsAny<string>(), 1))
                .ReturnsAsync((Subject?)null);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService();

            var result = await service.UpdateAsync(1, new UpdateSubjectDto
            {
                Code = "CSE201",
                Name = "Databases",
                Credit = 4,
                IsActive = true
            });

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(200);
            result.Data!.Name.Should().Be("Databases");
            _unitOfWork.Verify(u => u.Subjects.Update(existing), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_WhenFound_ShouldSoftDeleteAndReturnSuccess()
        {
            _unitOfWork.Setup(u => u.Subjects.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateSubject());
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService();

            var result = await service.DeleteAsync(1);

            result.Success.Should().BeTrue();
            result.Data.Should().BeTrue();
            _unitOfWork.Verify(u => u.Subjects.SoftDeleteAsync(1), Times.Once);
        }
    }
}
