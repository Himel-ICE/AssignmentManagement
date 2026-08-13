namespace AssignmentSystem.Repositories.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        IRoleRepository Roles { get; }
        IAcademicClassRepository AcademicClasses { get; }
        ISubjectRepository Subjects { get; }
        ITeacherClassSubjectRepository TeacherClassSubjects { get; }
        IAssignmentRepository Assignments { get; }
        ISubmissionRepository Submissions { get; }
        Task<int> SaveChangesAsync();
    }
}
