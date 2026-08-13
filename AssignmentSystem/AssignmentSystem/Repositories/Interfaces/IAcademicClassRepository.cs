using AssignmentSystem.Entities;

namespace AssignmentSystem.Repositories.Interfaces
{
    public interface IAcademicClassRepository : IGenericRepository<AcademicClass>
    {
        Task<AcademicClass?> GetByNameAsync(string name);
        Task<AcademicClass?> GetByNameAsync(string name, int excludeId);
        Task<IEnumerable<AcademicClass>> GetAllActiveAsync();
        Task<IEnumerable<AcademicClass>> GetDropdownAsync();
    }
}
