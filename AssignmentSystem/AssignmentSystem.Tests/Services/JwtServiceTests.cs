using AssignmentSystem.Configuration;
using AssignmentSystem.Services.Implementations;
using AssignmentSystem.Tests.Helpers;
using FluentAssertions;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AssignmentSystem.Tests.Services
{
    public class JwtServiceTests
    {
        private readonly JwtSettings _settings = new()
        {
            Key = "ThisIsASecretKeyForTestingPurposesOnly1234567890!",
            Issuer = "AssignmentSystem",
            Audience = "AssignmentSystemClient",
            DurationInMinutes = 120
        };

        private JwtService CreateService()
        {
            return new JwtService(Options.Create(_settings));
        }

        [Fact]
        public void GenerateToken_ShouldReturnNonEmptyToken()
        {
            var service = CreateService();
            var user = TestDataFactory.CreateUser(id: 42, email: "teacher@example.com", roleName: "Teacher");

            var token = service.GenerateToken(user);

            token.Should().NotBeNullOrWhiteSpace();
        }

        [Fact]
        public void GenerateToken_ShouldContainUserClaims()
        {
            var service = CreateService();
            var user = TestDataFactory.CreateUser(id: 7, email: "teacher@example.com", roleName: "Teacher");

            var token = service.GenerateToken(user);

            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            jwt.Subject.Should().Be("7");
            jwt.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Email && c.Value == "teacher@example.com");
            jwt.Claims.Should().Contain(c => c.Type == ClaimTypes.NameIdentifier && c.Value == "7");
            jwt.Claims.Should().Contain(c => c.Type == ClaimTypes.Role && c.Value == "Teacher");
            jwt.Claims.Should().Contain(c => c.Type == ClaimTypes.Name && c.Value == "John Doe");
        }

        [Fact]
        public void GenerateToken_ShouldSetIssuerAudienceAndExpiry()
        {
            var service = CreateService();
            var user = TestDataFactory.CreateUser();

            var token = service.GenerateToken(user);

            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            jwt.Issuer.Should().Be(_settings.Issuer);
            jwt.Audiences.Should().Contain(_settings.Audience);
            jwt.ValidTo.Should().BeCloseTo(DateTime.UtcNow.AddMinutes(_settings.DurationInMinutes), TimeSpan.FromSeconds(10));
        }

        [Theory]
        [InlineData("Admin")]
        [InlineData("Teacher")]
        [InlineData("Student")]
        public void GenerateToken_ShouldIncludeRoleClaim(string roleName)
        {
            var service = CreateService();
            var user = TestDataFactory.CreateUser(roleName: roleName);

            var token = service.GenerateToken(user);

            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            jwt.Claims.Should().Contain(c => c.Type == ClaimTypes.Role && c.Value == roleName);
        }
    }
}
