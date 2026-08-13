using AssignmentSystem.DTOs.Auth;
using AssignmentSystem.Helpers;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Interfaces;

namespace AssignmentSystem.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJwtService _jwtService;

        public AuthService(
            IUnitOfWork unitOfWork,
            IJwtService jwtService)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
        }

        public async Task<ApiResponse<LoginResponseDto>> LoginAsync(LoginRequestDto request)
        {
            var user = await _unitOfWork.Users.LoginAsync(request.Email, request.Password);

            if (user == null)
            {
                return new ApiResponse<LoginResponseDto>
                {
                    Success = false,
                    StatusCode = 401,
                    Message = "Invalid email or password."
                };
            }

            var token = _jwtService.GenerateToken(user);

            return new ApiResponse<LoginResponseDto>
            {
                Success = true,
                StatusCode = 200,
                Message = "Login successful.",
                Data = new LoginResponseDto
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(120),
                    UserId = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role.Name
                }
            };
        }
    }
}
