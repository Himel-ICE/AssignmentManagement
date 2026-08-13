using AssignmentSystem.Enums;

namespace AssignmentSystem.DTOs.Assignment
{
    public class AssignmentResponseDto
    {
        public int Id { get; set; }
        public int TeacherClassSubjectId { get; set; }
        public string TeacherName { get; set; } = string.Empty;
        public string Class { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public decimal MaximumMarks { get; set; }
        public AssignmentStatus Status { get; set; }
        public DateTime? PublishedAt { get; set; }
        public bool IsExpired => Deadline < DateTime.UtcNow;
    }
}
