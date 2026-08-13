namespace AssignmentSystem.DTOs.Subject
{
    public class SubjectResponseDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Credit { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}
