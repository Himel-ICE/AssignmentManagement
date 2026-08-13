using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.DTOs.Submission
{
    public class UpdateSubmissionDto
    {
        [Required]
        [MaxLength(20000)]
        public string Answer { get; set; } = string.Empty;
    }
}
