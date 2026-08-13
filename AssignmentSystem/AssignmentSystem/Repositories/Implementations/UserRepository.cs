using AssignmentSystem.Data;
using AssignmentSystem.Entities;
using AssignmentSystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Repositories.Implementations
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context)
        : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Email == email && !x.IsDeleted);
        }
        public async Task<IEnumerable<User>> GetAllWithRoleAsync()
        {
            return await _context.Users.Include(x => x.Role).Where(x => !x.IsDeleted).OrderBy(x => x.FirstName).ToListAsync();
        }
        public async Task<User?> GetByIdWithRoleAsync(int id)
        {
            return await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
        }
        public async Task<User?> GetByEmailAsync(string email, int excludeUserId)
        {
            return await _context.Users.FirstOrDefaultAsync(x =>
                    x.Email == email && x.Id != excludeUserId && !x.IsDeleted);
        }

        public async Task<User?> GetByPhoneNumberAsync(string phoneNumber, int excludeUserId)
        {
            return await _context.Users .FirstOrDefaultAsync(x =>
                    x.PhoneNumber == phoneNumber && x.Id != excludeUserId && !x.IsDeleted);
        }
        public async Task<User?> LoginAsync(string email, string password)
        {
            return await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(x =>
                x.Email == email &&
                x.Password == password &&
                !x.IsDeleted &&
                x.IsActive);
        }

        public async Task<IEnumerable<User>> GetTeacherDropdownAsync()
        {
            return await _context.Users
                .Include(x => x.Role)
                .Where(x => !x.IsDeleted && x.IsActive && x.Role.Name == "Teacher")
                .OrderBy(x => x.FirstName)
                .ToListAsync();
        }
    }
}
