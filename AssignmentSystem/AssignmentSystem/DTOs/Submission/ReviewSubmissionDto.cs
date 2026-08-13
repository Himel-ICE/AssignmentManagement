using AssignmentSystem.Enums;
using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.DTOs.Submission
{
    public class ReviewSubmissionDto
    {
        [Range(0, 1000)]
        public decimal? Marks { get; set; }
        [MaxLength(2000)]
        public string? Feedback { get; set; }
        public SubmissionStatus Status { get; set; }
    }
}
