namespace AssignmentSystem.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(Entities.User user);
    }
}
