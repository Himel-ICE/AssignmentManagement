namespace AssignmentSystem.DTOs.TeacherClassSubject
{
    public class TeacherClassSubjectResponseDto
    {
        public int Id { get; set; }
        public int TeacherId { get; set; }
        public string TeacherName { get; set; } = string.Empty;
        public int AcademicClassId { get; set; }
        public string AcademicClassName { get; set; } = string.Empty;
        public int SubjectId { get; set; }
        public string SubjectCode { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
