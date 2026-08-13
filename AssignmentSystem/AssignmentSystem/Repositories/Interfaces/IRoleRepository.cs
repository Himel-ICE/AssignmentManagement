using AssignmentSystem.Entities;

namespace AssignmentSystem.Repositories.Interfaces
{
    public interface IRoleRepository : IGenericRepository<Role>
    {
        Task<IEnumerable<Role>> GetDropdownAsync();
    }
}
