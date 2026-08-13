namespace AssignmentSystem.Entities
{
    public class User : BaseEntity
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? IdentityNumber { get; set; }
        public string Gender { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
        public ICollection<TeacherClassSubject> TeacherAssignments { get; set; } = new List<TeacherClassSubject>();
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}
