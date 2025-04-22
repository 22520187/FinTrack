using System;
using System.Collections.Generic;

namespace FinTrack.Server.Models.Domain;

public partial class Budget
{
    public int BudgetId { get; set; }

    public int? UserId { get; set; }

    public int? CategoryId { get; set; }

    public decimal AmountLimit { get; set; }

    public string Month { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<BudgetUsage> BudgetUsages { get; set; } = new List<BudgetUsage>();

    public virtual Category? Category { get; set; }

    public virtual User? User { get; set; }
}
