namespace AssignmentSystem.Entities
{
    public class TeacherClassSubject : BaseEntity
    {
        public int TeacherId { get; set; }
        public int AcademicClassId { get; set; }
        public int SubjectId { get; set; }
        public bool IsActive { get; set; } = true;
        public User Teacher { get; set; } = null!;
        public AcademicClass AcademicClass { get; set; } = null!;
        public Subject Subject { get; set; } = null!;
        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
