using AssignmentSystem.DTOs.TeacherClassSubject;
using AssignmentSystem.Entities;
using AssignmentSystem.Helpers;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Interfaces;
using AutoMapper;
using System.Security.Claims;

namespace AssignmentSystem.Services.Implementations
{
    public class TeacherClassSubjectService : ITeacherClassSubjectService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TeacherClassSubjectService(
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

        public async Task<ApiResponse<TeacherClassSubjectResponseDto>> CreateAsync(CreateTeacherClassSubjectDto dto)
        {
            // 1. Teacher Exists?
            var teacher = await _unitOfWork.Users.GetByIdWithRoleAsync(dto.TeacherId);

            if (teacher == null)
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Teacher not found."
                };
            }

            // 2. Is Teacher Role?
            if (!teacher.Role.Name.Equals("Teacher", StringComparison.OrdinalIgnoreCase))
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Selected user is not a teacher."
                };
            }

            // 3. Academic Class Exists?
            var academicClass = await _unitOfWork.AcademicClasses.GetByIdAsync(dto.AcademicClassId);

            if (academicClass == null)
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Academic class not found."
                };
            }

            // 4. Subject Exists?
            var subject = await _unitOfWork.Subjects.GetByIdAsync(dto.SubjectId);

            if (subject == null)
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Subject not found."
                };
            }

            // 5. Duplicate Assignment?
            var existingAssignment = await _unitOfWork.TeacherClassSubjects.GetAssignmentAsync(
                    dto.TeacherId,
                    dto.AcademicClassId,
                    dto.SubjectId);

            if (existingAssignment != null)
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "This teacher is already assigned to this class and subject."
                };
            }

            // 6. Mapping
            var assignment = _mapper.Map<TeacherClassSubject>(dto);

            // 7. Save
            await _unitOfWork.TeacherClassSubjects.AddAsync(assignment);

            await _unitOfWork.SaveChangesAsync();

            // 8. Reload with Navigation Properties
            assignment = await _unitOfWork.TeacherClassSubjects
                .GetByIdWithDetailsAsync(assignment.Id);

            var response = _mapper.Map<TeacherClassSubjectResponseDto>(assignment);

            return new ApiResponse<TeacherClassSubjectResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status201Created,
                Message = "Teacher assigned successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var assignment = await _unitOfWork.TeacherClassSubjects.GetByIdAsync(id);

            if (assignment == null)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Assignment not found."
                };
            }

            await _unitOfWork.TeacherClassSubjects.SoftDeleteAsync(id);

            await _unitOfWork.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Assignment deleted successfully.",
                Data = true
            };
        }

        public async Task<ApiResponse<IEnumerable<TeacherClassSubjectResponseDto>>> GetAllAsync()
        {
            var assignments = await _unitOfWork.TeacherClassSubjects
                .GetAllWithDetailsAsync();

            var response = _mapper.Map<IEnumerable<TeacherClassSubjectResponseDto>>(assignments);

            return new ApiResponse<IEnumerable<TeacherClassSubjectResponseDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Teacher assignments retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<IEnumerable<TeacherClassSubjectResponseDto>>> GetMyAsync()
        {
            var loggedInUserId = GetLoggedInUserId();

            if (loggedInUserId == null)
            {
                return new ApiResponse<IEnumerable<TeacherClassSubjectResponseDto>>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Message = "User is not authenticated."
                };
            }

            var assignments = await _unitOfWork.TeacherClassSubjects
                .GetByTeacherAsync(loggedInUserId.Value);

            var response = _mapper.Map<IEnumerable<TeacherClassSubjectResponseDto>>(assignments);

            return new ApiResponse<IEnumerable<TeacherClassSubjectResponseDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Your assigned classes retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<TeacherClassSubjectResponseDto>> GetByIdAsync(int id)
        {
            var assignment = await _unitOfWork.TeacherClassSubjects
                .GetByIdWithDetailsAsync(id);

            if (assignment == null)
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Assignment not found."
                };
            }

            var response = _mapper.Map<TeacherClassSubjectResponseDto>(assignment);

            return new ApiResponse<TeacherClassSubjectResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Assignment retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<TeacherClassSubjectResponseDto>> UpdateAsync(int id, UpdateTeacherClassSubjectDto dto)
        {
            var assignment = await _unitOfWork.TeacherClassSubjects.GetByIdAsync(id);

            if (assignment == null)
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Assignment not found."
                };
            }

            // Teacher
            var teacher = await _unitOfWork.Users.GetByIdWithRoleAsync(dto.TeacherId);

            if (teacher == null)
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Teacher not found."
                };
            }

            if (!teacher.Role.Name.Equals("Teacher", StringComparison.OrdinalIgnoreCase))
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Selected user is not a teacher."
                };
            }

            // Academic Class
            var academicClass = await _unitOfWork.AcademicClasses.GetByIdAsync(dto.AcademicClassId);

            if (academicClass == null)
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Academic class not found."
                };
            }

            // Subject
            var subject = await _unitOfWork.Subjects.GetByIdAsync(dto.SubjectId);

            if (subject == null)
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Subject not found."
                };
            }

            // Duplicate
            var duplicate = await _unitOfWork.TeacherClassSubjects.GetAssignmentAsync(
                dto.TeacherId,
                dto.AcademicClassId,
                dto.SubjectId,
                id);

            if (duplicate != null)
            {
                return new ApiResponse<TeacherClassSubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Assignment already exists."
                };
            }

            assignment.TeacherId = dto.TeacherId;
            assignment.AcademicClassId = dto.AcademicClassId;
            assignment.SubjectId = dto.SubjectId;
            assignment.IsActive = dto.IsActive;

            _unitOfWork.TeacherClassSubjects.Update(assignment);

            await _unitOfWork.SaveChangesAsync();

            var updated = await _unitOfWork.TeacherClassSubjects
                .GetByIdWithDetailsAsync(id);

            return new ApiResponse<TeacherClassSubjectResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Assignment updated successfully.",
                Data = _mapper.Map<TeacherClassSubjectResponseDto>(updated)
            };
        }
    }
}
