using AssignmentSystem.DTOs.Auth;
using AssignmentSystem.Helpers;

namespace AssignmentSystem.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<LoginResponseDto>> LoginAsync(LoginRequestDto request);
    }
}
