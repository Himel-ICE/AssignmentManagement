using AssignmentSystem.Data;
using AssignmentSystem.Entities;
using AssignmentSystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Repositories.Implementations
{
    public class AcademicClassRepository : GenericRepository<AcademicClass>, IAcademicClassRepository
    {
        public AcademicClassRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<AcademicClass>> GetAllActiveAsync()
        {
            return await _context.AcademicClasses.Where(x => !x.IsDeleted).OrderBy(x => x.Name).ToListAsync();
        }

        public async Task<AcademicClass?> GetByNameAsync(string name)
        {
            return await _context.AcademicClasses.FirstOrDefaultAsync(x => x.Name == name && !x.IsDeleted);
        }

        public async Task<AcademicClass?> GetByNameAsync(string name, int excludeId)
        {
            return await _context.AcademicClasses.FirstOrDefaultAsync(x =>  x.Name == name && x.Id != excludeId && !x.IsDeleted);
        }

        public async Task<IEnumerable<AcademicClass>> GetDropdownAsync()
        {
            return await _context.AcademicClasses
                .Where(x => !x.IsDeleted && x.IsActive)
                .OrderBy(x => x.Name)
                .ToListAsync();
        }
    }
}
