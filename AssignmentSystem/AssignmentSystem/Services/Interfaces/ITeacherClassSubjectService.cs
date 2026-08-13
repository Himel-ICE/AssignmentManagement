using AssignmentSystem.DTOs.TeacherClassSubject;
using AssignmentSystem.Helpers;

namespace AssignmentSystem.Services.Interfaces
{
    public interface ITeacherClassSubjectService
    {
        Task<ApiResponse<TeacherClassSubjectResponseDto>> CreateAsync(CreateTeacherClassSubjectDto dto);
        Task<ApiResponse<IEnumerable<TeacherClassSubjectResponseDto>>> GetAllAsync();
        Task<ApiResponse<IEnumerable<TeacherClassSubjectResponseDto>>> GetMyAsync();
        Task<ApiResponse<TeacherClassSubjectResponseDto>> GetByIdAsync(int id);
        Task<ApiResponse<TeacherClassSubjectResponseDto>> UpdateAsync(int id, UpdateTeacherClassSubjectDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }
}
