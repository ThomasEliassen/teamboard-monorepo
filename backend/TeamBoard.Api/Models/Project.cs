namespace TeamBoard.Api.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = String.Empty;
    public string OwnerUserId { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}