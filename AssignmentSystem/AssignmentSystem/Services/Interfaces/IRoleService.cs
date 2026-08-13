using AssignmentSystem.DTOs.Role;
using AssignmentSystem.Helpers;

namespace AssignmentSystem.Services.Interfaces
{
    public interface IRoleService
    {
        Task<ApiResponse<IEnumerable<DropdownDto>>> GetDropdownAsync();
    }
}
