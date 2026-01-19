namespace TeamBoard.Api.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string OwnerUserId { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}