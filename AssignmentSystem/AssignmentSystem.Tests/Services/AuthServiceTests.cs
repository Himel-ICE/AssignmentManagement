using AssignmentSystem.DTOs.Auth;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Implementations;
using AssignmentSystem.Services.Interfaces;
using AssignmentSystem.Tests.Helpers;
using FluentAssertions;
using Moq;

namespace AssignmentSystem.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWork = new();
        private readonly Mock<IJwtService> _jwtService = new();

        private AuthService CreateService()
        {
            return new AuthService(_unitOfWork.Object, _jwtService.Object);
        }

        [Fact]
        public async Task LoginAsync_WithValidCredentials_ShouldReturnSuccessWithToken()
        {
            var user = TestDataFactory.CreateUser(id: 1, roleName: "Teacher");
            _unitOfWork.Setup(u => u.Users.LoginAsync(user.Email, "secret"))
                .ReturnsAsync(user);
            _jwtService.Setup(j => j.GenerateToken(user)).Returns("jwt-token");
            var service = CreateService();

            var result = await service.LoginAsync(new LoginRequestDto
            {
                Email = user.Email,
                Password = "secret"
            });

            result.Success.Should().BeTrue();
            result.StatusCode.Should().Be(200);
            result.Data.Should().NotBeNull();
            result.Data!.Token.Should().Be("jwt-token");
            result.Data.UserId.Should().Be(user.Id);
            result.Data.Role.Should().Be("Teacher");
            result.Data.Expiration.Should().BeAfter(DateTime.UtcNow);
        }

        [Fact]
        public async Task LoginAsync_WithInvalidCredentials_ShouldReturnUnauthorized()
        {
            _unitOfWork.Setup(u => u.Users.LoginAsync(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync((AssignmentSystem.Entities.User?)null);
            var service = CreateService();

            var result = await service.LoginAsync(new LoginRequestDto
            {
                Email = "nobody@example.com",
                Password = "wrong"
            });

            result.Success.Should().BeFalse();
            result.StatusCode.Should().Be(401);
            result.Message.Should().Be("Invalid email or password.");
            _jwtService.Verify(j => j.GenerateToken(It.IsAny<AssignmentSystem.Entities.User>()), Times.Never);
        }

        [Theory]
        [InlineData("Student")]
        [InlineData("Admin")]
        [InlineData("Teacher")]
        public async Task LoginAsync_ShouldReturnCorrectRole(string roleName)
        {
            var user = TestDataFactory.CreateUser(roleName: roleName);
            _unitOfWork.Setup(u => u.Users.LoginAsync(user.Email, "secret"))
                .ReturnsAsync(user);
            _jwtService.Setup(j => j.GenerateToken(user)).Returns("jwt-token");
            var service = CreateService();

            var result = await service.LoginAsync(new LoginRequestDto
            {
                Email = user.Email,
                Password = "secret"
            });

            result.Data!.Role.Should().Be(roleName);
        }
    }
}
