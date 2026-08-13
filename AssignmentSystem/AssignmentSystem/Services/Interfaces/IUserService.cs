using AssignmentSystem.DTOs.Role;
using AssignmentSystem.DTOs.User;
using AssignmentSystem.Helpers;

namespace AssignmentSystem.Services.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse<UserResponseDto>> CreateAsync(CreateUserDto dto);

        Task<ApiResponse<UserResponseDto>> UpdateAsync(UpdateUserDto dto);

        Task<ApiResponse<bool>> DeleteAsync(int id);

        Task<ApiResponse<UserResponseDto>> GetByIdAsync(int id);

        Task<ApiResponse<IEnumerable<UserListDto>>> GetAllAsync();

        Task<ApiResponse<IEnumerable<DropdownDto>>> GetTeacherDropdownAsync();
    }
}
