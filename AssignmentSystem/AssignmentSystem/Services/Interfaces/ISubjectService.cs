using AssignmentSystem.DTOs.Role;
using AssignmentSystem.DTOs.Subject;
using AssignmentSystem.Helpers;

namespace AssignmentSystem.Services.Interfaces
{
    public interface ISubjectService
    {
        Task<ApiResponse<SubjectResponseDto>> CreateAsync(CreateSubjectDto dto);
        Task<ApiResponse<IEnumerable<SubjectResponseDto>>> GetAllAsync();
        Task<ApiResponse<SubjectResponseDto>> GetByIdAsync(int id);
        Task<ApiResponse<SubjectResponseDto>> UpdateAsync(int id, UpdateSubjectDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<IEnumerable<DropdownDto>>> GetDropdownAsync();
    }
}
