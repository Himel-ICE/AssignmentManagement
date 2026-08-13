using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.DTOs.Assignment
{
    public class CreateAssignmentDto
    {
        [Required]
        public int TeacherClassSubjectId { get; set; }
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        [Required]
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;
        [Required]
        public DateTime Deadline { get; set; }
        [Range(1, 1000)]
        public decimal MaximumMarks { get; set; }
    }
}
