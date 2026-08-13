using AssignmentSystem.Data;
using AssignmentSystem.Entities;
using AssignmentSystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Repositories.Implementations
{
    public class TeacherClassSubjectRepository : GenericRepository<TeacherClassSubject>, ITeacherClassSubjectRepository
    {
        public TeacherClassSubjectRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<TeacherClassSubject?> GetAssignmentAsync(
            int teacherId,
            int academicClassId,
            int subjectId)
        {
            return await _context.TeacherClassSubjects
                .FirstOrDefaultAsync(x =>
                    x.TeacherId == teacherId &&
                    x.AcademicClassId == academicClassId &&
                    x.SubjectId == subjectId &&
                    !x.IsDeleted);
        }

        public async Task<TeacherClassSubject?> GetAssignmentAsync(
            int teacherId,
            int academicClassId,
            int subjectId,
            int excludeId)
        {
            return await _context.TeacherClassSubjects
                .FirstOrDefaultAsync(x =>
                    x.TeacherId == teacherId &&
                    x.AcademicClassId == academicClassId &&
                    x.SubjectId == subjectId &&
                    x.Id != excludeId &&
                    !x.IsDeleted);
        }

        public async Task<IEnumerable<TeacherClassSubject>> GetAllWithDetailsAsync()
        {
            return await _context.TeacherClassSubjects
                .Include(x => x.Teacher)
                .Include(x => x.AcademicClass)
                .Include(x => x.Subject)
                .Where(x => !x.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<TeacherClassSubject>> GetByTeacherAsync(int teacherId)
        {
            return await _context.TeacherClassSubjects
                .Include(x => x.Teacher)
                .Include(x => x.AcademicClass)
                .Include(x => x.Subject)
                .Where(x => x.TeacherId == teacherId && !x.IsDeleted)
                .OrderBy(x => x.AcademicClass.Name)
                .ThenBy(x => x.Subject.Name)
                .ToListAsync();
        }

        public async Task<TeacherClassSubject?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.TeacherClassSubjects
                .Include(x => x.Teacher)
                .Include(x => x.AcademicClass)
                .Include(x => x.Subject)
                .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
        }
    }
}
