using AssignmentSystem.Entities;

namespace AssignmentSystem.Repositories.Interfaces
{
    public interface IAssignmentRepository : IGenericRepository<Assignment>
    {
        Task<IEnumerable<Assignment>> GetAllWithDetailsAsync();
        Task<Assignment?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<Assignment>> GetByTeacherClassSubjectAsync(int teacherClassSubjectId);
    }
}
