using System;
using System.Collections.Generic;

namespace FinTrack.Server.Models.Domain;

public partial class Category
{
    public int CategoryId { get; set; }

    public int? UserId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Type { get; set; }

    public bool? IsDefault { get; set; }

    public float? TotalAmount { get; set; }

    public virtual ICollection<Budget> Budgets { get; set; } = new List<Budget>();

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

    public virtual User? User { get; set; }
}
