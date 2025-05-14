using System;
using System.Collections.Generic;

namespace FinTrack.Server.Models.Domain;

public partial class Transaction
{
    public int TransactionId { get; set; }

    public int? UserId { get; set; }

    public decimal Amount { get; set; }

    public string? Type { get; set; }

    public int? CategoryId { get; set; }

    public string? Note { get; set; }

    public bool? IsImportant { get; set; }

    public string? CategoryName { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Category? Category { get; set; }

    public virtual User? User { get; set; }
}
