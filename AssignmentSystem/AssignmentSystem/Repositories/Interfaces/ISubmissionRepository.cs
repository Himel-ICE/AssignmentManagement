using AssignmentSystem.Entities;

namespace AssignmentSystem.Repositories.Interfaces
{
    public interface ISubmissionRepository : IGenericRepository<Submission>
    {
        Task<IEnumerable<Submission>> GetAllWithDetailsAsync();
        Task<Submission?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<Submission>> GetByAssignmentAsync(int assignmentId);
        Task<IEnumerable<Submission>> GetByStudentAsync(int studentId);
        Task<Submission?> GetByAssignmentAndStudentAsync(int assignmentId, int studentId);
    }
}
