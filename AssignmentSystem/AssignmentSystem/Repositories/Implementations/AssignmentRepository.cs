using AssignmentSystem.Data;
using AssignmentSystem.Entities;
using AssignmentSystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Repositories.Implementations
{
    public class AssignmentRepository : GenericRepository<Assignment>, IAssignmentRepository
    {
        public AssignmentRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<Assignment>> GetAllWithDetailsAsync()
        {
            return await _context.Assignments
                .Include(x => x.TeacherClassSubject)
                    .ThenInclude(x => x.Teacher)
                .Include(x => x.TeacherClassSubject)
                    .ThenInclude(x => x.AcademicClass)
                .Include(x => x.TeacherClassSubject)
                    .ThenInclude(x => x.Subject)
                .Where(x => !x.IsDeleted)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<Assignment?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Assignments
                .Include(x => x.TeacherClassSubject)
                    .ThenInclude(x => x.Teacher)
                .Include(x => x.TeacherClassSubject)
                    .ThenInclude(x => x.AcademicClass)
                .Include(x => x.TeacherClassSubject)
                    .ThenInclude(x => x.Subject)
                .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
        }

        public async Task<IEnumerable<Assignment>> GetByTeacherClassSubjectAsync(int teacherClassSubjectId)
        {
            return await _context.Assignments
                .Where(x => x.TeacherClassSubjectId == teacherClassSubjectId &&
                            !x.IsDeleted)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }
    }
}
