using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinTrack.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveReportTypeConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the check constraint on Reports.Type column
            migrationBuilder.Sql("ALTER TABLE Reports DROP CONSTRAINT CK__Reports__Type__5EBF139D");
            
            migrationBuilder.AddColumn<float>(
                name: "TotalAmount",
                table: "Categories",
                type: "real",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "Categories");
                
            // Add the check constraint back (if needed)
            // migrationBuilder.Sql("ALTER TABLE Reports ADD CONSTRAINT CK__Reports__Type__5EBF139D CHECK (Type IN ('SomeValue1', 'SomeValue2'))");
        }
    }
}
