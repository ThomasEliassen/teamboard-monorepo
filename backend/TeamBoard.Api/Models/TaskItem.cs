namespace TeamBoard.Api.Models;

public class TaskItem
{
    public int Id {get; set;}
    public int ProjectId {get; set;}
    public string Title {get; set;} = String.Empty;
    public bool IsDone {get; set;}
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
}