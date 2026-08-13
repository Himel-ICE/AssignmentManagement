using AssignmentSystem.Data;
using AssignmentSystem.Entities;
using AssignmentSystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Repositories.Implementations
{
    public class SubjectRepository : GenericRepository<Subject>, ISubjectRepository
    {
        public SubjectRepository(ApplicationDbContext context)
            : base(context)
        {
        }
        public async Task<IEnumerable<Subject>> GetAllActiveAsync()
        {
            return await _context.Subjects.Where(x => !x.IsDeleted).OrderBy(x => x.Code).ToListAsync();
        }
        public async Task<Subject?> GetByCodeAsync(string code)
        {
            return await _context.Subjects.FirstOrDefaultAsync(x => x.Code == code && !x.IsDeleted);
        }
        public async Task<Subject?> GetByCodeAsync(string code, int excludeId)
        {
            return await _context.Subjects.FirstOrDefaultAsync(x => x.Code == code && x.Id != excludeId && !x.IsDeleted);
        }
        public async Task<IEnumerable<Subject>> GetDropdownAsync()
        {
            return await _context.Subjects
                .Where(x => !x.IsDeleted && x.IsActive)
                .OrderBy(x => x.Name)
                .ToListAsync();
        }
    }
}
