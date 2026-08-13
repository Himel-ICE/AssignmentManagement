using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.DTOs.Submission
{
    public class CreateSubmissionDto
    {
        [Required]
        public int AssignmentId { get; set; }
        [Required]
        [MaxLength(20000)]
        public string Answer { get; set; } = string.Empty;
    }
}
