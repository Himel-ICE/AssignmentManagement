using AssignmentSystem.DTOs.Submission;
using AssignmentSystem.Helpers;

namespace AssignmentSystem.Services.Interfaces
{
    public interface ISubmissionService
    {
        Task<ApiResponse<SubmissionResponseDto>> SubmitAsync(CreateSubmissionDto dto);
        Task<ApiResponse<SubmissionResponseDto>> UpdateAsync(int id, UpdateSubmissionDto dto);
        Task<ApiResponse<IEnumerable<SubmissionResponseDto>>> GetAllAsync();
        Task<ApiResponse<IEnumerable<SubmissionResponseDto>>> GetByAssignmentAsync(int assignmentId);
        Task<ApiResponse<IEnumerable<SubmissionResponseDto>>> GetMyAsync();
        Task<ApiResponse<SubmissionResponseDto>> ReviewAsync(int id, ReviewSubmissionDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }
}
