using AssignmentSystem.Entities;

namespace AssignmentSystem.Repositories.Interfaces
{
    public interface ITeacherClassSubjectRepository : IGenericRepository<TeacherClassSubject>
    {
        Task<TeacherClassSubject?> GetAssignmentAsync(int teacherId, int academicClassId, int subjectId);
        Task<TeacherClassSubject?> GetAssignmentAsync(int teacherId, int academicClassId, int subjectId, int excludeId);
        Task<IEnumerable<TeacherClassSubject>> GetAllWithDetailsAsync();
        Task<IEnumerable<TeacherClassSubject>> GetByTeacherAsync(int teacherId);
        Task<TeacherClassSubject?> GetByIdWithDetailsAsync(int id);
    }
}
