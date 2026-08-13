using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.DTOs.AcademicClass
{
    public class CreateAcademicClassDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        [Required]
        [MaxLength(100)]
        public string Department { get; set; } = string.Empty;
        [Required]
        [MaxLength(50)]
        public string Semester { get; set; } = string.Empty;
        [Required]
        [MaxLength(50)]
        public string Section { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
