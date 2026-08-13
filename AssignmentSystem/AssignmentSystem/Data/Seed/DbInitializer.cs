using AssignmentSystem.Entities;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Data.Seed
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            await context.Database.MigrateAsync();

            if (!await context.Roles.AnyAsync())
            {
                var roles = new List<Role>
            {
                new Role
                {
                    Name = "Admin",
                    Description = "System Administrator"
                },
                new Role
                {
                    Name = "Teacher",
                    Description = "Teacher"
                },
                new Role
                {
                    Name = "Student",
                    Description = "Student"
                }
            };

                await context.Roles.AddRangeAsync(roles);
                await context.SaveChangesAsync();
            }
        }
    }
}
