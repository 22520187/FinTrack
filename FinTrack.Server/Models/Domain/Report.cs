using System;
using System.Collections.Generic;

namespace FinTrack.Server.Models.Domain;

public partial class Report
{
    public int ReportId { get; set; }

    public int? UserId { get; set; }

    public string? Type { get; set; }

    public string? Period { get; set; }

    public string? FileUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User? User { get; set; }
}
