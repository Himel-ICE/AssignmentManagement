using AssignmentSystem.DTOs.Role;
using AssignmentSystem.DTOs.User;
using AssignmentSystem.Entities;
using AssignmentSystem.Helpers;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Interfaces;
using AutoMapper;

namespace AssignmentSystem.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ApiResponse<UserResponseDto>> CreateAsync(CreateUserDto dto)
        {
            // Check duplicate email & Phone number
            var existingUser = await _unitOfWork.Users.GetByEmailAsync(dto.Email);
            var phoneExists = await _unitOfWork.Users.GetByPhoneNumberAsync(dto.PhoneNumber, 0);
            if (phoneExists != null)
            {
                return new ApiResponse<UserResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Phone number already exists."
                };
            }
            if (existingUser != null)
            {
                return new ApiResponse<UserResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Email already exists."
                };
            }

            // Check Role
            var role = await _unitOfWork.Roles.GetByIdAsync(dto.RoleId);

            if (role == null)
            {
                return new ApiResponse<UserResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Invalid role."
                };
            }

            // DTO → Entity
            var user = _mapper.Map<User>(dto);
            user.Password = dto.Password;
            user.RoleId = dto.RoleId;
            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();
            user.Role = role;
            var response = _mapper.Map<UserResponseDto>(user);
            return new ApiResponse<UserResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status201Created,
                Message = "User created successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);

            if (user == null || user.IsDeleted)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "User not found."
                };
            }

            user.IsDeleted = true;
            user.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Users.Update(user);

            await _unitOfWork.SaveChangesAsync();

            return new ApiResponse<bool>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "User deleted successfully.",
                Data = true
            };
        }

        public async Task<ApiResponse<IEnumerable<UserListDto>>> GetAllAsync()
        {
            var users = await _unitOfWork.Users.GetAllAsync();

            var response = _mapper.Map<IEnumerable<UserListDto>>(users);

            return new ApiResponse<IEnumerable<UserListDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Users retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<UserResponseDto>> GetByIdAsync(int id)
        {
            var user = await _unitOfWork.Users.GetByIdWithRoleAsync(id);

            if (user == null)
            {
                return new ApiResponse<UserResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "User not found."
                };
            }

            var response = _mapper.Map<UserResponseDto>(user);

            return new ApiResponse<UserResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "User retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<IEnumerable<DropdownDto>>> GetTeacherDropdownAsync()
        {
            var teachers = await _unitOfWork.Users.GetTeacherDropdownAsync();

            var response = _mapper.Map<IEnumerable<DropdownDto>>(teachers);

            return new ApiResponse<IEnumerable<DropdownDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Teachers retrieved successfully.",
                Data = response
            };
        }

        public async Task<ApiResponse<UserResponseDto>> UpdateAsync(UpdateUserDto dto)
        {
            var user = await _unitOfWork.Users.GetByIdWithRoleAsync(dto.Id);

            if (user == null)
            {
                return new ApiResponse<UserResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "User not found."
                };
            }

            var emailExists = await _unitOfWork.Users.GetByEmailAsync(dto.Email, dto.Id);

            if (emailExists != null)
            {
                return new ApiResponse<UserResponseDto>
                {
                    Success = false,
                    StatusCode= StatusCodes.Status200OK,
                    Message = "Email already exists."
                };
            }

            var phoneExists = await _unitOfWork.Users.GetByPhoneNumberAsync(dto.PhoneNumber, dto.Id);

            if (phoneExists != null)
            {
                return new ApiResponse<UserResponseDto>
                {
                    Success = false,
                    StatusCode= StatusCodes.Status200OK,
                    Message = "Phone number already exists."
                };
            }

            var role = await _unitOfWork.Roles.GetByIdAsync(dto.RoleId);

            if (role == null)
            {
                return new ApiResponse<UserResponseDto>
                {
                    Success = false,
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Invalid role."
                };
            }

            _mapper.Map(dto, user);

            user.Role = role;

            _unitOfWork.Users.Update(user);

            await _unitOfWork.SaveChangesAsync();

            var response = _mapper.Map<UserResponseDto>(user);

            return new ApiResponse<UserResponseDto>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "User updated successfully.",
                Data = response
            };
        }
    }
}
