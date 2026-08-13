using AssignmentSystem.Entities;

namespace AssignmentSystem.Repositories.Interfaces
{
    public interface ISubjectRepository : IGenericRepository<Subject>
    {
        Task<Subject?> GetByCodeAsync(string code);
        Task<Subject?> GetByCodeAsync(string code, int excludeId);
        Task<IEnumerable<Subject>> GetAllActiveAsync();
        Task<IEnumerable<Subject>> GetDropdownAsync();
    }
}
