using AssignmentSystem.DTOs.Submission;
using AssignmentSystem.Entities;
using AssignmentSystem.Enums;
using AssignmentSystem.Helpers;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Interfaces;
using AutoMapper;
using System.Security.Claims;

namespace AssignmentSystem.Services.Implementations
{
    public class SubmissionService : ISubmissionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SubmissionService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        private int? GetLoggedInUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?
                .User
                .FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return null;

            return int.TryParse(userIdClaim.Value, out var id) ? id : null;
        }

        private bool IsAdmin()
        {
            return _httpContextAccessor.HttpContext?.User.IsInRole("Admin") == true;
        }

        public async Task<ApiResponse<SubmissionResponseDto>> SubmitAsync(CreateSubmissionDto dto)
        {
            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            var assignment = await _unitOfWork.Assignments.GetByIdWithDetailsAsync(dto.AssignmentId);

            if (assignment == null)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Assignment not found."
                };
            }

            if (assignment.Status != AssignmentStatus.Published)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Assignment is not published yet."
                };
            }

            if (assignment.Deadline <= DateTime.UtcNow)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Submission deadline has passed."
                };
            }

            var existingSubmission = await _unitOfWork.Submissions
                .GetByAssignmentAndStudentAsync(dto.AssignmentId, loggedInUserId.Value);

            if (existingSubmission != null)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "You have already submitted this assignment."
                };
            }

            var submission = _mapper.Map<Submission>(dto);

            submission.StudentId = loggedInUserId.Value;
            submission.SubmittedAt = DateTime.UtcNow;
            submission.Status = SubmissionStatus.Submitted;

            await _unitOfWork.Submissions.AddAsync(submission);

            await _unitOfWork.SaveChangesAsync();

            var createdSubmission = await _unitOfWork.Submissions
                .GetByIdWithDetailsAsync(submission.Id);

            return new ApiResponse<SubmissionResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status201Created,
                Message = "Assignment submitted successfully.",
                Data = _mapper.Map<SubmissionResponseDto>(createdSubmission)
            };
        }

        public async Task<ApiResponse<SubmissionResponseDto>> UpdateAsync(int id, UpdateSubmissionDto dto)
        {
            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            var submission = await _unitOfWork.Submissions.GetByIdWithDetailsAsync(id);

            if (submission == null)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Submission not found."
                };
            }

            if (submission.StudentId != loggedInUserId.Value)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status403Forbidden,
                    Message = "You can only update your own submission."
                };
            }

            if (submission.Assignment.Status != AssignmentStatus.Published)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Assignment is not published anymore."
                };
            }

            if (submission.Assignment.Deadline <= DateTime.UtcNow)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Submission deadline has passed."
                };
            }

            if (submission.Status != SubmissionStatus.Submitted)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Submission has already been reviewed and cannot be updated."
                };
            }

            submission.Answer = dto.Answer;
            submission.SubmittedAt = DateTime.UtcNow;

            _unitOfWork.Submissions.Update(submission);

            await _unitOfWork.SaveChangesAsync();

            var updated = await _unitOfWork.Submissions.GetByIdWithDetailsAsync(id);

            return new ApiResponse<SubmissionResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Submission updated successfully.",
                Data = _mapper.Map<SubmissionResponseDto>(updated)
            };
        }

        public async Task<ApiResponse<IEnumerable<SubmissionResponseDto>>> GetAllAsync()
        {
            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<IEnumerable<SubmissionResponseDto>>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            var submissions = await _unitOfWork.Submissions.GetAllWithDetailsAsync();

            if (!IsAdmin())
            {
                submissions = submissions.Where(s =>
                    s.Assignment.TeacherClassSubject.TeacherId == loggedInUserId.Value);
            }

            var response = _mapper.Map<IEnumerable<SubmissionResponseDto>>(submissions);

            return new ApiResponse<IEnumerable<SubmissionResponseDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Submissions retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<IEnumerable<SubmissionResponseDto>>> GetByAssignmentAsync(int assignmentId)
        {
            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<IEnumerable<SubmissionResponseDto>>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            if (!IsAdmin())
            {
                var assignment = await _unitOfWork.Assignments.GetByIdWithDetailsAsync(assignmentId);

                if (assignment == null)
                {
                    return new ApiResponse<IEnumerable<SubmissionResponseDto>>
                    {
                        Success = false,
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Assignment not found."
                    };
                }

                if (assignment.TeacherClassSubject.TeacherId != loggedInUserId.Value)
                {
                    return new ApiResponse<IEnumerable<SubmissionResponseDto>>
                    {
                        Success = false,
                        StatusCode = StatusCodes.Status403Forbidden,
                        Message = "You can only view submissions for your own assignments."
                    };
                }
            }

            var submissions = await _unitOfWork.Submissions.GetByAssignmentAsync(assignmentId);

            var response = _mapper.Map<IEnumerable<SubmissionResponseDto>>(submissions);

            return new ApiResponse<IEnumerable<SubmissionResponseDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Submissions retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<IEnumerable<SubmissionResponseDto>>> GetMyAsync()
        {
            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<IEnumerable<SubmissionResponseDto>>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            var submissions = await _unitOfWork.Submissions.GetByStudentAsync(loggedInUserId.Value);

            var response = _mapper.Map<IEnumerable<SubmissionResponseDto>>(submissions);

            return new ApiResponse<IEnumerable<SubmissionResponseDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Submissions retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<SubmissionResponseDto>> ReviewAsync(int id, ReviewSubmissionDto dto)
        {
            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            var submission = await _unitOfWork.Submissions.GetByIdWithDetailsAsync(id);

            if (submission == null)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Submission not found."
                };
            }

            if (!IsAdmin() && submission.Assignment.TeacherClassSubject.TeacherId != loggedInUserId.Value)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status403Forbidden,
                    Message = "You can only review submissions for your own assignments."
                };
            }

            if (submission.Assignment.Status != AssignmentStatus.Published &&
                submission.Assignment.Status != AssignmentStatus.Closed)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Cannot review a submission for an assignment that is not published or closed."
                };
            }

            if (dto.Status == SubmissionStatus.Submitted)
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "A reviewed submission must be marked as Reviewed or Rejected."
                };
            }

            if (dto.Marks.HasValue &&
                (dto.Marks.Value < 0 || dto.Marks.Value > submission.Assignment.MaximumMarks))
            {
                return new ApiResponse<SubmissionResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = $"Marks must be between 0 and {submission.Assignment.MaximumMarks}."
                };
            }

            submission.Marks = dto.Marks;
            submission.Feedback = dto.Feedback;
            submission.Status = dto.Status;

            _unitOfWork.Submissions.Update(submission);

            await _unitOfWork.SaveChangesAsync();

            var updated = await _unitOfWork.Submissions.GetByIdWithDetailsAsync(id);

            return new ApiResponse<SubmissionResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Submission reviewed successfully.",
                Data = _mapper.Map<SubmissionResponseDto>(updated)
            };
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var submission = await _unitOfWork.Submissions.GetByIdAsync(id);

            if (submission == null || submission.IsDeleted)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Submission not found."
                };
            }

            submission.IsDeleted = true;

            _unitOfWork.Submissions.Update(submission);

            await _unitOfWork.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Submission deleted successfully.",
                Data = true
            };
        }
    }
}
