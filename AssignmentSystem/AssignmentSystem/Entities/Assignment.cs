using AssignmentSystem.Enums;

namespace AssignmentSystem.Entities
{
    public class Assignment : BaseEntity
    {
        public int TeacherClassSubjectId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public decimal MaximumMarks { get; set; }
        public AssignmentStatus Status { get; set; }
        public DateTime? PublishedAt { get; set; }
        public TeacherClassSubject TeacherClassSubject { get; set; } = null!;
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}
