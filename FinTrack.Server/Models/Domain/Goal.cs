using System;
using System.Collections.Generic;

namespace FinTrack.Server.Models.Domain;

public partial class Goal
{
    public int GoalId { get; set; }

    public int? UserId { get; set; }

    public string Title { get; set; } = null!;

    public decimal TargetAmount { get; set; }

    public DateOnly Deadline { get; set; }

    public decimal? SavedAmount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<GoalProgress> GoalProgresses { get; set; } = new List<GoalProgress>();

    public virtual User? User { get; set; }
}
