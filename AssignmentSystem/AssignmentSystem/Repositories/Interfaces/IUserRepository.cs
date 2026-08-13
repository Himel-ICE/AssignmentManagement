using AssignmentSystem.Entities;

namespace AssignmentSystem.Repositories.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdWithRoleAsync(int id);
        Task<User?> GetByEmailAsync(string email, int excludeUserId);
        Task<User?> GetByPhoneNumberAsync(string phoneNumber, int excludeUserId);
        Task<User?> LoginAsync(string email, string password);
        Task<IEnumerable<User>> GetTeacherDropdownAsync();
    }
}
