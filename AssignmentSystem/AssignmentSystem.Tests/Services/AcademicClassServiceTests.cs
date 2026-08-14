using AssignmentSystem.DTOs.AcademicClass;
using AssignmentSystem.Entities;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Implementations;
using AssignmentSystem.Tests.Helpers;
using FluentAssertions;
using Moq;

namespace AssignmentSystem.Tests.Services
{
    public class AcademicClassServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWork = new();
        private readonly AutoMapper.IMapper _mapper = TestDataFactory.CreateMapper();

        private AcademicClassService CreateService()
        {
            return new AcademicClassService(_unitOfWork.Object, _mapper);
        }

        [Fact]
        public async Task CreateAsync_WhenNameExists_ShouldReturnBadRequest()
        {
            _unitOfWork.Setup(u => u.AcademicClasses.GetByNameAsync("CSE-101"))
                .ReturnsAsync(TestDataFactory.CreateAcademicClass());
            var service = CreateService();

            var result = await service.CreateAsync(new CreateAcademicClassDto { Name = "CSE-101" });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Academic class already exists.");
            _unitOfWork.Verify(u => u.AcademicClasses.AddAsync(It.IsAny<AcademicClass>()), Times.Never);
        }

        [Fact]
        public async Task CreateAsync_WithValidDto_ShouldReturnCreated()
        {
            _unitOfWork.Setup(u => u.AcademicClasses.GetByNameAsync(It.IsAny<string>()))
                .ReturnsAsync((AcademicClass?)null);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService();

            var result = await service.CreateAsync(new CreateAcademicClassDto
            {
                Name = "CSE-102",
                Department = "CSE",
                Semester = "Summer",
                Section = "B"
            });

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(201);
            result.Data.Should().NotBeNull();
            result.Data!.Name.Should().Be("CSE-102");
            _unitOfWork.Verify(u => u.AcademicClasses.AddAsync(It.IsAny<AcademicClass>()), Times.Once);
            _unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetByIdAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(99))
                .ReturnsAsync((AcademicClass?)null);
            var service = CreateService();

            var result = await service.GetByIdAsync(99);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task GetByIdAsync_WhenFound_ShouldReturnClass()
        {
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateAcademicClass());
            var service = CreateService();

            var result = await service.GetByIdAsync(1);

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(200);
            result.Data!.Id.Should().Be(1);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllActiveClasses()
        {
            _unitOfWork.Setup(u => u.AcademicClasses.GetAllActiveAsync())
                .ReturnsAsync(new List<AcademicClass>
                {
                    TestDataFactory.CreateAcademicClass(1),
                    TestDataFactory.CreateAcademicClass(2)
                });
            var service = CreateService();

            var result = await service.GetAllAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(2);
        }

        [Fact]
        public async Task UpdateAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(99))
                .ReturnsAsync((AcademicClass?)null);
            var service = CreateService();

            var result = await service.UpdateAsync(99, new UpdateAcademicClassDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task UpdateAsync_WhenNameTakenByAnother_ShouldReturnBadRequest()
        {
            var existing = TestDataFactory.CreateAcademicClass(1, "CSE-101");
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(1)).ReturnsAsync(existing);
            _unitOfWork.Setup(u => u.AcademicClasses.GetByNameAsync("CSE-200", 1))
                .ReturnsAsync(TestDataFactory.CreateAcademicClass(2, "CSE-200"));
            var service = CreateService();

            var result = await service.UpdateAsync(1, new UpdateAcademicClassDto { Name = "CSE-200" });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Academic class name already exists.");
        }

        [Fact]
        public async Task UpdateAsync_WithValidDto_ShouldReturnSuccess()
        {
            var existing = TestDataFactory.CreateAcademicClass(1, "CSE-101");
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(1)).ReturnsAsync(existing);
            _unitOfWork.Setup(u => u.AcademicClasses.GetByNameAsync(It.IsAny<string>(), 1))
                .ReturnsAsync((AcademicClass?)null);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService();

            var result = await service.UpdateAsync(1, new UpdateAcademicClassDto
            {
                Name = "CSE-201",
                Department = "EEE",
                Semester = "Fall",
                Section = "A",
                IsActive = true
            });

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(200);
            result.Data!.Name.Should().Be("CSE-201");
            existing.Department.Should().Be("EEE");
            _unitOfWork.Verify(u => u.AcademicClasses.Update(existing), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(99))
                .ReturnsAsync((AcademicClass?)null);
            var service = CreateService();

            var result = await service.DeleteAsync(99);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task DeleteAsync_WhenFound_ShouldSoftDeleteAndReturnSuccess()
        {
            _unitOfWork.Setup(u => u.AcademicClasses.GetByIdAsync(1))
                .ReturnsAsync(TestDataFactory.CreateAcademicClass());
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService();

            var result = await service.DeleteAsync(1);

            result.Success.Should().BeTrue();
            result.Data.Should().BeTrue();
            _unitOfWork.Verify(u => u.AcademicClasses.SoftDeleteAsync(1), Times.Once);
            _unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetDropdownAsync_ShouldReturnMappedClasses()
        {
            _unitOfWork.Setup(u => u.AcademicClasses.GetDropdownAsync())
                .ReturnsAsync(new List<AcademicClass>
                {
                    TestDataFactory.CreateAcademicClass(1, "CSE-101")
                });
            var service = CreateService();

            var result = await service.GetDropdownAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().Contain(d => d.Name == "CSE-101");
        }
    }
}
