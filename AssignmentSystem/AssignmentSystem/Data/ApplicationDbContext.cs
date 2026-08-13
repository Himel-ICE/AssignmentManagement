using AssignmentSystem.Entities;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<AcademicClass> AcademicClasses { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<TeacherClassSubject> TeacherClassSubjects { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            #region Unique Index

            modelBuilder.Entity<Role>()
                .HasIndex(x => x.Name)
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");

            modelBuilder.Entity<User>()
                .HasIndex(x => x.Email)
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");

            modelBuilder.Entity<User>()
                .HasIndex(x => x.PhoneNumber)
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");

            modelBuilder.Entity<TeacherClassSubject>()
                .HasIndex(x => new
                {
                    x.TeacherId,
                    x.AcademicClassId,
                    x.SubjectId
                })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");

            modelBuilder.Entity<Submission>()
                .HasIndex(x => new
                {
                    x.AssignmentId,
                    x.StudentId
                })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");

            #endregion

            #region Relationships

            // User -> Role
            modelBuilder.Entity<User>()
                .HasOne(x => x.Role)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // TeacherClassSubject -> Teacher(User)
            modelBuilder.Entity<TeacherClassSubject>()
                .HasOne(x => x.Teacher)
                .WithMany(x => x.TeacherAssignments)
                .HasForeignKey(x => x.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);

            // TeacherClassSubject -> AcademicClass
            modelBuilder.Entity<TeacherClassSubject>()
                .HasOne(x => x.AcademicClass)
                .WithMany(x => x.TeacherClassSubjects)
                .HasForeignKey(x => x.AcademicClassId)
                .OnDelete(DeleteBehavior.Restrict);

            // TeacherClassSubject -> Subject
            modelBuilder.Entity<TeacherClassSubject>()
                .HasOne(x => x.Subject)
                .WithMany(x => x.TeacherClassSubjects)
                .HasForeignKey(x => x.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            // Assignment -> TeacherClassSubject
            modelBuilder.Entity<Assignment>()
                .HasOne(x => x.TeacherClassSubject)
                .WithMany(x => x.Assignments)
                .HasForeignKey(x => x.TeacherClassSubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            // Submission -> Assignment
            modelBuilder.Entity<Submission>()
                .HasOne(x => x.Assignment)
                .WithMany(x => x.Submissions)
                .HasForeignKey(x => x.AssignmentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Submission -> Student(User)
            modelBuilder.Entity<Submission>()
                .HasOne(x => x.Student)
                .WithMany(x => x.Submissions)
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            #endregion
        }
    }
}
