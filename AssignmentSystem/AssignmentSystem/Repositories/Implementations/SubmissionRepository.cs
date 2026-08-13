using AssignmentSystem.Data;
using AssignmentSystem.Entities;
using AssignmentSystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Repositories.Implementations
{
    public class SubmissionRepository : GenericRepository<Submission>, ISubmissionRepository
    {
        public SubmissionRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        private IQueryable<Submission> WithDetails()
        {
            return _context.Submissions
                .Include(x => x.Assignment)
                    .ThenInclude(x => x.TeacherClassSubject)
                        .ThenInclude(x => x.AcademicClass)
                .Include(x => x.Assignment)
                    .ThenInclude(x => x.TeacherClassSubject)
                        .ThenInclude(x => x.Subject)
                .Include(x => x.Assignment)
                    .ThenInclude(x => x.TeacherClassSubject)
                        .ThenInclude(x => x.Teacher)
                .Include(x => x.Student);
        }

        public async Task<IEnumerable<Submission>> GetAllWithDetailsAsync()
        {
            return await WithDetails()
                .Where(x => !x.IsDeleted)
                .OrderByDescending(x => x.SubmittedAt)
                .ToListAsync();
        }

        public async Task<Submission?> GetByIdWithDetailsAsync(int id)
        {
            return await WithDetails()
                .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
        }

        public async Task<IEnumerable<Submission>> GetByAssignmentAsync(int assignmentId)
        {
            return await WithDetails()
                .Where(x => x.AssignmentId == assignmentId && !x.IsDeleted)
                .OrderByDescending(x => x.SubmittedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Submission>> GetByStudentAsync(int studentId)
        {
            return await WithDetails()
                .Where(x => x.StudentId == studentId && !x.IsDeleted)
                .OrderByDescending(x => x.SubmittedAt)
                .ToListAsync();
        }

        public async Task<Submission?> GetByAssignmentAndStudentAsync(int assignmentId, int studentId)
        {
            return await WithDetails()
                .FirstOrDefaultAsync(x =>
                    x.AssignmentId == assignmentId &&
                    x.StudentId == studentId &&
                    !x.IsDeleted);
        }
    }
}
