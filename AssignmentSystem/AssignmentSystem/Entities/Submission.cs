using AssignmentSystem.Enums;

namespace AssignmentSystem.Entities
{
    public class Submission : BaseEntity
    {
        public int AssignmentId { get; set; }
        public int StudentId { get; set; }
        public string Answer { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public decimal? Marks { get; set; }
        public string? Feedback { get; set; }
        public SubmissionStatus Status { get; set; }
        public Assignment Assignment { get; set; } = null!;
        public User Student { get; set; } = null!;
    }
}
