using AssignmentSystem.DTOs.Assignment;
using AssignmentSystem.Helpers;

namespace AssignmentSystem.Services.Interfaces
{
    public interface IAssignmentService
    {
        Task<ApiResponse<AssignmentResponseDto>> CreateAsync(CreateAssignmentDto dto);
        Task<ApiResponse<IEnumerable<AssignmentResponseDto>>> GetAllAsync();
        Task<ApiResponse<AssignmentResponseDto>> GetByIdAsync(int id);
        Task<ApiResponse<AssignmentResponseDto>> UpdateAsync(int id, UpdateAssignmentDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<bool>> PublishAsync(int id);
        Task<ApiResponse<bool>> CloseAsync(int id);
    }
}
