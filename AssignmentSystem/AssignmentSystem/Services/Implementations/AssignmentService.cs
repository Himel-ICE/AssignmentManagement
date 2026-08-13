using AssignmentSystem.DTOs.Assignment;
using AssignmentSystem.Entities;
using AssignmentSystem.Enums;
using AssignmentSystem.Helpers;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Interfaces;
using AutoMapper;
using System.Linq.Expressions;
using System.Security.Claims;

namespace AssignmentSystem.Services.Implementations
{
    public class AssignmentService : IAssignmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AssignmentService(IUnitOfWork unitOfWork, IMapper mapper, IHttpContextAccessor httpContextAccessor)
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

        public async Task<ApiResponse<bool>> CloseAsync(int id)
        {
            var assignment = await _unitOfWork.Assignments
                .GetByIdWithDetailsAsync(id);

            if (assignment == null || assignment.IsDeleted)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Assignment not found."
                };
            }

            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            if (!IsAdmin() && assignment.TeacherClassSubject.TeacherId != loggedInUserId.Value)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status403Forbidden,
                    Message = "You can only close your own assignments."
                };
            }

            assignment.Status = AssignmentStatus.Closed;

            _unitOfWork.Assignments.Update(assignment);

            await _unitOfWork.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Assignment closed successfully.",
                Data = true
            };
        }

        public async Task<ApiResponse<AssignmentResponseDto>> CreateAsync(CreateAssignmentDto dto)
        {
            // Logged-in User Id
            var userIdClaim = _httpContextAccessor.HttpContext?
                .User
                .FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            int loggedInUserId = int.Parse(userIdClaim.Value);

            // TeacherClassSubject Exists?
            var teacherClassSubject = await _unitOfWork.TeacherClassSubjects
                .GetByIdWithDetailsAsync(dto.TeacherClassSubjectId);

            if (teacherClassSubject == null)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Teacher assignment not found."
                };
            }

            // Ownership Check
            if (teacherClassSubject.TeacherId != loggedInUserId)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status403Forbidden,
                    Message = "You are not allowed to create assignment for this class."
                };
            }

            // Deadline Validation
            if (dto.Deadline <= DateTime.UtcNow)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Deadline must be a future date."
                };
            }

            // Map DTO -> Entity
            var assignment = _mapper.Map<Assignment>(dto);

            assignment.Status = AssignmentStatus.Draft;
            assignment.PublishedAt = null;

            await _unitOfWork.Assignments.AddAsync(assignment);

            await _unitOfWork.SaveChangesAsync();

            var createdAssignment = await _unitOfWork.Assignments.GetByIdWithDetailsAsync(assignment.Id);

            return new ApiResponse<AssignmentResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status201Created,
                Message = "Assignment created successfully.",
                Data = _mapper.Map<AssignmentResponseDto>(createdAssignment)
            };
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var assignment = await _unitOfWork.Assignments
                .GetByIdWithDetailsAsync(id);

            if (assignment == null || assignment.IsDeleted)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Assignment not found."
                };
            }

            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            if (!IsAdmin() && assignment.TeacherClassSubject.TeacherId != loggedInUserId.Value)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status403Forbidden,
                    Message = "You can only delete your own assignments."
                };
            }

            assignment.IsDeleted = true;

            _unitOfWork.Assignments.Update(assignment);

            await _unitOfWork.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Assignment deleted successfully.",
                Data = true
            };
        }

        public async Task<ApiResponse<IEnumerable<AssignmentResponseDto>>> GetAllAsync()
        {
            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<IEnumerable<AssignmentResponseDto>>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            var assignments = await _unitOfWork.Assignments.GetAllWithDetailsAsync();

            var isAdmin = IsAdmin();

            var isStudent = _httpContextAccessor.HttpContext?.User.IsInRole("Student") == true;

            IEnumerable<Entities.Assignment> scoped;

            if (isStudent)
            {
                scoped = assignments.Where(a =>
                    a.Status == AssignmentStatus.Published ||
                    a.Status == AssignmentStatus.Closed);
            }
            else if (isAdmin)
            {
                scoped = assignments;
            }
            else
            {
                scoped = assignments.Where(a =>
                    a.TeacherClassSubject.TeacherId == loggedInUserId.Value);
            }

            var response = _mapper.Map<IEnumerable<AssignmentResponseDto>>(scoped);

            return new ApiResponse<IEnumerable<AssignmentResponseDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Assignments retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<AssignmentResponseDto>> GetByIdAsync(int id)
        {
            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            var assignment = await _unitOfWork.Assignments
                .GetByIdWithDetailsAsync(id);

            if (assignment == null)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Assignment not found."
                };
            }

            var isAdmin = IsAdmin();

            var isStudent = _httpContextAccessor.HttpContext?.User.IsInRole("Student") == true;

            if (isStudent)
            {
                if (assignment.Status != AssignmentStatus.Published &&
                    assignment.Status != AssignmentStatus.Closed)
                {
                    return new ApiResponse<AssignmentResponseDto>
                    {
                        Success = false,
                        StatusCode = StatusCodes.Status403Forbidden,
                        Message = "This assignment is not available to students."
                    };
                }
            }
            else if (!isAdmin &&
                assignment.TeacherClassSubject.TeacherId != loggedInUserId.Value)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status403Forbidden,
                    Message = "You can only view your own assignments."
                };
            }

            return new ApiResponse<AssignmentResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Assignment retrieved successfully.",
                Data = _mapper.Map<AssignmentResponseDto>(assignment)
            };
        }

        public async Task<ApiResponse<bool>> PublishAsync(int id)
        {
            var assignment = await _unitOfWork.Assignments
                .GetByIdWithDetailsAsync(id);

            if (assignment == null || assignment.IsDeleted)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Assignment not found."
                };
            }

            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            if (!IsAdmin() && assignment.TeacherClassSubject.TeacherId != loggedInUserId.Value)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status403Forbidden,
                    Message = "You can only publish your own assignments."
                };
            }

            assignment.Status = AssignmentStatus.Published;
            assignment.PublishedAt = DateTime.UtcNow;

            _unitOfWork.Assignments.Update(assignment);

            await _unitOfWork.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Assignment published successfully.",
                Data = true
            };
        }

        public async Task<ApiResponse<AssignmentResponseDto>> UpdateAsync(int id, UpdateAssignmentDto dto)
        {
            var assignment = await _unitOfWork.Assignments
                .GetByIdWithDetailsAsync(id);

            if (assignment == null || assignment.IsDeleted)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Assignment not found."
                };
            }

            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            if (assignment.TeacherClassSubject.TeacherId != loggedInUserId.Value)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status403Forbidden,
                    Message = "You can only update your own assignments."
                };
            }

            if (assignment.Status == AssignmentStatus.Closed)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Closed assignment cannot be updated."
                };
            }

            if (dto.Deadline <= DateTime.UtcNow)
            {
                return new ApiResponse<AssignmentResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Deadline must be a future date."
                };
            }

            _mapper.Map(dto, assignment);

            _unitOfWork.Assignments.Update(assignment);

            await _unitOfWork.SaveChangesAsync();

            var updated = await _unitOfWork.Assignments
                .GetByIdWithDetailsAsync(id);

            return new ApiResponse<AssignmentResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Assignment updated successfully.",
                Data = _mapper.Map<AssignmentResponseDto>(updated)
            };
        }
    }
}
