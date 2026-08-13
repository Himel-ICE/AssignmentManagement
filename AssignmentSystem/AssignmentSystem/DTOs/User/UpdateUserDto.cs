namespace AssignmentSystem.DTOs.User
{
    public class UpdateUserDto
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string? IdentityNumber { get; set; }

        public string Gender { get; set; } = string.Empty;

        public int RoleId { get; set; }

        public bool IsActive { get; set; }
    }
}
