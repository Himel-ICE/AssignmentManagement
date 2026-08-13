using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.DTOs.Subject
{
    public class CreateSubjectDto
    {
        [Required]
        [MaxLength(20)]
        public string Code { get; set; } = string.Empty;
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        [Range(0.5, 10)]
        public decimal Credit { get; set; }
        [MaxLength(500)]
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
