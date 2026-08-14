using AssignmentSystem.Entities;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Implementations;
using AssignmentSystem.Tests.Helpers;
using FluentAssertions;
using Moq;

namespace AssignmentSystem.Tests.Services
{
    public class RoleServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWork = new();
        private readonly AutoMapper.IMapper _mapper = TestDataFactory.CreateMapper();

        private RoleService CreateService()
        {
            return new RoleService(_unitOfWork.Object, _mapper);
        }

        [Fact]
        public async Task GetDropdownAsync_ShouldReturnMappedRoles()
        {
            var roles = new List<Role>
            {
                TestDataFactory.CreateRole(1, "Admin"),
                TestDataFactory.CreateRole(2, "Teacher"),
                TestDataFactory.CreateRole(3, "Student")
            };
            _unitOfWork.Setup(u => u.Roles.GetDropdownAsync()).ReturnsAsync(roles);
            var service = CreateService();

            var result = await service.GetDropdownAsync();

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(200);
            result.Data.Should().HaveCount(3);
            result.Data!.Should().Contain(d => d.Name == "Admin");
        }
    }
}
