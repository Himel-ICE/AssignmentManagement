using AssignmentSystem.DTOs.AcademicClass;
using AssignmentSystem.DTOs.Role;
using AssignmentSystem.Entities;
using AssignmentSystem.Helpers;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Interfaces;
using AutoMapper;

namespace AssignmentSystem.Services.Implementations
{
    public class AcademicClassService : IAcademicClassService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AcademicClassService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<ApiResponse<AcademicClassResponseDto>> CreateAsync(CreateAcademicClassDto dto)
        {
            var existingClass = await _unitOfWork.AcademicClasses.GetByNameAsync(dto.Name);

            if (existingClass != null)
            {
                return new ApiResponse<AcademicClassResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Academic class already exists."
                };
            }
            var academicClass = _mapper.Map<AcademicClass>(dto);
            await _unitOfWork.AcademicClasses.AddAsync(academicClass);
            await _unitOfWork.SaveChangesAsync();
            var response = _mapper.Map<AcademicClassResponseDto>(academicClass);
            return new ApiResponse<AcademicClassResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status201Created,
                Message = "Academic class created successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<IEnumerable<AcademicClassResponseDto>>> GetAllAsync()
        {
            var academicClasses = await _unitOfWork.AcademicClasses.GetAllActiveAsync();

            var response = _mapper.Map<IEnumerable<AcademicClassResponseDto>>(academicClasses);

            return new ApiResponse<IEnumerable<AcademicClassResponseDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Academic classes retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<AcademicClassResponseDto>> GetByIdAsync(int id)
        {
            var academicClass = await _unitOfWork.AcademicClasses.GetByIdAsync(id);

            if (academicClass == null)
            {
                return new ApiResponse<AcademicClassResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Academic class not found."
                };
            }

            var response = _mapper.Map<AcademicClassResponseDto>(academicClass);

            return new ApiResponse<AcademicClassResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Academic class retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<AcademicClassResponseDto>> UpdateAsync(int id, UpdateAcademicClassDto dto)
        {
            var academicClass = await _unitOfWork.AcademicClasses.GetByIdAsync(id);

            if (academicClass == null)
            {
                return new ApiResponse<AcademicClassResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Academic class not found."
                };
            }

            var existingClass = await _unitOfWork.AcademicClasses
                .GetByNameAsync(dto.Name, id);

            if (existingClass != null)
            {
                return new ApiResponse<AcademicClassResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Academic class name already exists."
                };
            }

            academicClass.Name = dto.Name;
            academicClass.Department = dto.Department;
            academicClass.Semester = dto.Semester;
            academicClass.Section = dto.Section;
            academicClass.Description = dto.Description;
            academicClass.IsActive = dto.IsActive;

            _unitOfWork.AcademicClasses.Update(academicClass);

            await _unitOfWork.SaveChangesAsync();

            var response = _mapper.Map<AcademicClassResponseDto>(academicClass);

            return new ApiResponse<AcademicClassResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Academic class updated successfully.",
                Data = response
            };
        }
        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var academicClass = await _unitOfWork.AcademicClasses.GetByIdAsync(id);

            if (academicClass == null)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Academic class not found."
                };
            }

            await _unitOfWork.AcademicClasses.SoftDeleteAsync(id);

            await _unitOfWork.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Academic class deleted successfully.",
                Data = true
            };
        }

        public async Task<ApiResponse<IEnumerable<DropdownDto>>> GetDropdownAsync()
        {
            var academicClasses = await _unitOfWork.AcademicClasses.GetDropdownAsync();

            var response = _mapper.Map<IEnumerable<DropdownDto>>(academicClasses);

            return new ApiResponse<IEnumerable<DropdownDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Academic classes retrieved successfully.",
                Data = response
            };
        }
    }
}
