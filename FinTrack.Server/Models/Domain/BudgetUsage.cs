using System;
using System.Collections.Generic;

namespace FinTrack.Server.Models.Domain;

public partial class BudgetUsage
{
    public int UsageId { get; set; }

    public int? BudgetId { get; set; }

    public decimal SpentAmount { get; set; }

    public DateTime? RecordedAt { get; set; }

    public virtual Budget? Budget { get; set; }
}
