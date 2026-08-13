using AssignmentSystem.Data;
using AssignmentSystem.Repositories.Interfaces;

namespace AssignmentSystem.Repositories.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        public IUserRepository Users { get; }
        public IRoleRepository Roles { get; }
        public IAcademicClassRepository AcademicClasses { get; }
        public ISubjectRepository Subjects { get; }
        public ITeacherClassSubjectRepository TeacherClassSubjects { get; }
        public IAssignmentRepository Assignments { get; }
        public ISubmissionRepository Submissions { get; }
        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Users = new UserRepository(_context);
            Roles = new RoleRepository(_context);
            AcademicClasses = new AcademicClassRepository(_context);
            Subjects = new SubjectRepository(_context);
            TeacherClassSubjects = new TeacherClassSubjectRepository(_context);
            Assignments = new AssignmentRepository(_context);
            Submissions = new SubmissionRepository(_context);
        }

        public async Task<int> SaveChangesAsync()
        {
            try
            {
                return await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());

                if (ex.InnerException != null)
                {
                    Console.WriteLine(ex.InnerException.ToString());
                }

                throw;
            }
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
    