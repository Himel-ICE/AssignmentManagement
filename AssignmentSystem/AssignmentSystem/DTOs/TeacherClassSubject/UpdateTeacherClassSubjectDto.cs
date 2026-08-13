using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.DTOs.TeacherClassSubject
{
    public class UpdateTeacherClassSubjectDto
    {
        [Required]
        public int TeacherId { get; set; }
        [Required]
        public int AcademicClassId { get; set; }
        [Required]
        public int SubjectId { get; set; }
        public bool IsActive { get; set; }
    }
}
