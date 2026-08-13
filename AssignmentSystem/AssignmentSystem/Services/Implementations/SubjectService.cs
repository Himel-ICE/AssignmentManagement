using AssignmentSystem.DTOs.Role;
using AssignmentSystem.DTOs.Subject;
using AssignmentSystem.Entities;
using AssignmentSystem.Helpers;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Interfaces;
using AutoMapper;

namespace AssignmentSystem.Services.Implementations
{
    public class SubjectService : ISubjectService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SubjectService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ApiResponse<SubjectResponseDto>> CreateAsync(CreateSubjectDto dto)
        {
            var existingSubject = await _unitOfWork.Subjects.GetByCodeAsync(dto.Code);

            if (existingSubject != null)
            {
                return new ApiResponse<SubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Subject code already exists."
                };
            }

            var subject = _mapper.Map<Subject>(dto);

            await _unitOfWork.Subjects.AddAsync(subject);

            await _unitOfWork.SaveChangesAsync();

            var response = _mapper.Map<SubjectResponseDto>(subject);

            return new ApiResponse<SubjectResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status201Created,
                Message = "Subject created successfully.",
                Data = response
            };
        }
        public async Task<ApiResponse<IEnumerable<SubjectResponseDto>>> GetAllAsync()
        {
            var subjects = await _unitOfWork.Subjects.GetAllActiveAsync();

            var response = _mapper.Map<IEnumerable<SubjectResponseDto>>(subjects);

            return new ApiResponse<IEnumerable<SubjectResponseDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Subjects retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<SubjectResponseDto>> GetByIdAsync(int id)
        {
            var subject = await _unitOfWork.Subjects.GetByIdAsync(id);

            if (subject == null)
            {
                return new ApiResponse<SubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Subject not found."
                };
            }

            var response = _mapper.Map<SubjectResponseDto>(subject);

            return new ApiResponse<SubjectResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Subject retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<SubjectResponseDto>> UpdateAsync(int id, UpdateSubjectDto dto)
        {
            var subject = await _unitOfWork.Subjects.GetByIdAsync(id);

            if (subject == null)
            {
                return new ApiResponse<SubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Subject not found."
                };
            }

            var existingSubject = await _unitOfWork.Subjects.GetByCodeAsync(dto.Code, id);

            if (existingSubject != null)
            {
                return new ApiResponse<SubjectResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Subject code already exists."
                };
            }

            subject.Code = dto.Code;
            subject.Name = dto.Name;
            subject.Credit = dto.Credit;
            subject.Description = dto.Description;
            subject.IsActive = dto.IsActive;

            _unitOfWork.Subjects.Update(subject);

            await _unitOfWork.SaveChangesAsync();

            var response = _mapper.Map<SubjectResponseDto>(subject);

            return new ApiResponse<SubjectResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Subject updated successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var subject = await _unitOfWork.Subjects.GetByIdAsync(id);

            if (subject == null)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Subject not found."
                };
            }

            await _unitOfWork.Subjects.SoftDeleteAsync(id);

            await _unitOfWork.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Subject deleted successfully.",
                Data = true
            };
        }


        public async Task<ApiResponse<IEnumerable<DropdownDto>>> GetDropdownAsync()
        {
            var subjects = await _unitOfWork.Subjects.GetDropdownAsync();

            var response = _mapper.Map<IEnumerable<DropdownDto>>(subjects);

            return new ApiResponse<IEnumerable<DropdownDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Subjects retrieved successfully.",
                Data = response
            };
        }


    }
}
