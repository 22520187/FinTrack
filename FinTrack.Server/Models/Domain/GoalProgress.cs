using System;
using System.Collections.Generic;

namespace FinTrack.Server.Models.Domain;

public partial class GoalProgress
{
    public int ProgressId { get; set; }

    public int? GoalId { get; set; }

    public decimal SavedAmount { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Goal? Goal { get; set; }
}
