using AssignmentSystem.DTOs.User;
using AssignmentSystem.Entities;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Implementations;
using AssignmentSystem.Tests.Helpers;
using FluentAssertions;
using Moq;

namespace AssignmentSystem.Tests.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWork = new();
        private readonly AutoMapper.IMapper _mapper = TestDataFactory.CreateMapper();

        private UserService CreateService()
        {
            return new UserService(_unitOfWork.Object, _mapper);
        }

        private static CreateUserDto CreateValidDto()
        {
            return new CreateUserDto
            {
                FirstName = "Alice",
                LastName = "Smith",
                Email = "alice@example.com",
                PhoneNumber = "1112223333",
                Password = "password123",
                Gender = "Female",
                RoleId = 2,
                IsActive = true
            };
        }

        [Fact]
        public async Task CreateAsync_WhenPhoneExists_ShouldReturnBadRequest()
        {
            _unitOfWork.Setup(u => u.Users.GetByPhoneNumberAsync("1112223333", 0))
                .ReturnsAsync(TestDataFactory.CreateUser(5));
            var service = CreateService();

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Phone number already exists.");
            _unitOfWork.Verify(u => u.Users.AddAsync(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public async Task CreateAsync_WhenEmailExists_ShouldReturnBadRequest()
        {
            _unitOfWork.Setup(u => u.Users.GetByPhoneNumberAsync(It.IsAny<string>(), 0))
                .ReturnsAsync((User?)null);
            _unitOfWork.Setup(u => u.Users.GetByEmailAsync("alice@example.com"))
                .ReturnsAsync(TestDataFactory.CreateUser(5, email: "alice@example.com"));
            var service = CreateService();

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Email already exists.");
        }

        [Fact]
        public async Task CreateAsync_WhenRoleInvalid_ShouldReturnBadRequest()
        {
            _unitOfWork.Setup(u => u.Users.GetByPhoneNumberAsync(It.IsAny<string>(), 0))
                .ReturnsAsync((User?)null);
            _unitOfWork.Setup(u => u.Users.GetByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);
            _unitOfWork.Setup(u => u.Roles.GetByIdAsync(99))
                .ReturnsAsync((Role?)null);
            var service = CreateService();

            var dto = CreateValidDto();
            dto.RoleId = 99;

            var result = await service.CreateAsync(dto);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(400);
            result.Message.Should().Be("Invalid role.");
        }

        [Fact]
        public async Task CreateAsync_WithValidData_ShouldReturnCreated()
        {
            var role = TestDataFactory.CreateRole(2, "Teacher");
            _unitOfWork.Setup(u => u.Users.GetByPhoneNumberAsync(It.IsAny<string>(), 0))
                .ReturnsAsync((User?)null);
            _unitOfWork.Setup(u => u.Users.GetByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);
            _unitOfWork.Setup(u => u.Roles.GetByIdAsync(2)).ReturnsAsync(role);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService();

            var result = await service.CreateAsync(CreateValidDto());

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(201);
            result.Data!.Email.Should().Be("alice@example.com");
            result.Data.Role.Should().Be("Teacher");
            _unitOfWork.Verify(u => u.Users.AddAsync(It.Is<User>(x => x.Password == "password123")), Times.Once);
            _unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnMappedUsers()
        {
            _unitOfWork.Setup(u => u.Users.GetAllAsync())
                .ReturnsAsync(new List<User>
                {
                    TestDataFactory.CreateUser(1),
                    TestDataFactory.CreateUser(2, "Jane", "Smith")
                });
            var service = CreateService();

            var result = await service.GetAllAsync();

            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(2);
            result.Data!.First().FullName.Should().Be("John Doe");
        }

        [Fact]
        public async Task GetByIdAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(99))
                .ReturnsAsync((User?)null);
            var service = CreateService();

            var result = await service.GetByIdAsync(99);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task GetByIdAsync_WhenFound_ShouldReturnUser()
        {
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(1))
                .ReturnsAsync(TestDataFactory.CreateUser());
            var service = CreateService();

            var result = await service.GetByIdAsync(1);

            result.Success.Should().BeTrue();
            result.Data!.Role.Should().Be("Teacher");
        }

        [Fact]
        public async Task GetTeacherDropdownAsync_ShouldReturnMappedTeachers()
        {
            _unitOfWork.Setup(u => u.Users.GetTeacherDropdownAsync())
                .ReturnsAsync(new List<User> { TestDataFactory.CreateUser(1) });
            var service = CreateService();

            var result = await service.GetTeacherDropdownAsync();

            result.Success.Should().BeTrue();
            result.Data!.Should().Contain(d => d.Name == "John Doe");
        }

        [Fact]
        public async Task UpdateAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(99))
                .ReturnsAsync((User?)null);
            var service = CreateService();

            var result = await service.UpdateAsync(new UpdateUserDto { Id = 99 });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task UpdateAsync_WhenEmailExists_ShouldReturnBadRequest()
        {
            var user = TestDataFactory.CreateUser(1);
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(1)).ReturnsAsync(user);
            _unitOfWork.Setup(u => u.Users.GetByEmailAsync("taken@example.com", 1))
                .ReturnsAsync(TestDataFactory.CreateUser(2, email: "taken@example.com"));
            var service = CreateService();

            var result = await service.UpdateAsync(new UpdateUserDto
            {
                Id = 1,
                Email = "taken@example.com"
            });

            result.Success.Should().BeFalse();
            result.Message.Should().Be("Email already exists.");
        }

        [Fact]
        public async Task UpdateAsync_WithValidData_ShouldReturnSuccess()
        {
            var user = TestDataFactory.CreateUser(1);
            var role = TestDataFactory.CreateRole(3, "Student");
            _unitOfWork.Setup(u => u.Users.GetByIdWithRoleAsync(1)).ReturnsAsync(user);
            _unitOfWork.Setup(u => u.Users.GetByEmailAsync(It.IsAny<string>(), 1))
                .ReturnsAsync((User?)null);
            _unitOfWork.Setup(u => u.Users.GetByPhoneNumberAsync(It.IsAny<string>(), 1))
                .ReturnsAsync((User?)null);
            _unitOfWork.Setup(u => u.Roles.GetByIdAsync(3)).ReturnsAsync(role);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService();

            var result = await service.UpdateAsync(new UpdateUserDto
            {
                Id = 1,
                FirstName = "Johnny",
                LastName = "Doe",
                Email = "johnny@example.com",
                PhoneNumber = "9998887777",
                Gender = "Male",
                RoleId = 3,
                IsActive = true
            });

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(200);
            result.Data!.FirstName.Should().Be("Johnny");
            result.Data.Role.Should().Be("Student");
            _unitOfWork.Verify(u => u.Users.Update(user), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_WhenNotFound_ShouldReturnNotFound()
        {
            _unitOfWork.Setup(u => u.Users.GetByIdAsync(99))
                .ReturnsAsync((User?)null);
            var service = CreateService();

            var result = await service.DeleteAsync(99);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task DeleteAsync_WhenAlreadyDeleted_ShouldReturnNotFound()
        {
            var user = TestDataFactory.CreateUser(1);
            user.IsDeleted = true;
            _unitOfWork.Setup(u => u.Users.GetByIdAsync(1)).ReturnsAsync(user);
            var service = CreateService();

            var result = await service.DeleteAsync(1);

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task DeleteAsync_WhenFound_ShouldSoftDeleteAndReturnSuccess()
        {
            var user = TestDataFactory.CreateUser(1);
            _unitOfWork.Setup(u => u.Users.GetByIdAsync(1)).ReturnsAsync(user);
            _unitOfWork.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);
            var service = CreateService();

            var result = await service.DeleteAsync(1);

            result.Success.Should().BeTrue();
            result.Data.Should().BeTrue();
            user.IsDeleted.Should().BeTrue();
            _unitOfWork.Verify(u => u.Users.Update(user), Times.Once);
        }
    }
}
