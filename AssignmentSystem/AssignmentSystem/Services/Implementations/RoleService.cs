using AssignmentSystem.DTOs.Role;
using AssignmentSystem.Helpers;
using AssignmentSystem.Repositories.Interfaces;
using AssignmentSystem.Services.Interfaces;
using AutoMapper;

namespace AssignmentSystem.Services.Implementations
{
    public class RoleService : IRoleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public RoleService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<ApiResponse<IEnumerable<DropdownDto>>> GetDropdownAsync()
        {
            var roles = await _unitOfWork.Roles.GetDropdownAsync();

            return new ApiResponse<IEnumerable<DropdownDto>>
            {
                Success = true,
                StatusCode = StatusCodes.Status200OK,
                Message = "Roles retrieved successfully.",
                Data = _mapper.Map<IEnumerable<DropdownDto>>(roles)
            };
        }
    }
}
