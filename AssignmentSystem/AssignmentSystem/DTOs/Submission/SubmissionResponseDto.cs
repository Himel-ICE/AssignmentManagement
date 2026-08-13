using AssignmentSystem.Enums;

namespace AssignmentSystem.DTOs.Submission
{
    public class SubmissionResponseDto
    {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public string AssignmentTitle { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public string Class { get; set; } = string.Empty;
        public string TeacherName { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public decimal? Marks { get; set; }
        public string? Feedback { get; set; }
        public SubmissionStatus Status { get; set; }
        public bool IsExpired => Deadline < DateTime.UtcNow;
    }
}
