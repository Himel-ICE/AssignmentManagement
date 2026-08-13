using AssignmentSystem.DTOs.AcademicClass;
using AssignmentSystem.DTOs.Role;
using AssignmentSystem.Helpers;

namespace AssignmentSystem.Services.Interfaces
{
    public interface IAcademicClassService
    {
        Task<ApiResponse<AcademicClassResponseDto>> CreateAsync(CreateAcademicClassDto dto);
        Task<ApiResponse<IEnumerable<AcademicClassResponseDto>>> GetAllAsync();
        Task<ApiResponse<AcademicClassResponseDto>> GetByIdAsync(int id);
        Task<ApiResponse<AcademicClassResponseDto>> UpdateAsync(int id, UpdateAcademicClassDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<IEnumerable<DropdownDto>>> GetDropdownAsync();
    }
}
