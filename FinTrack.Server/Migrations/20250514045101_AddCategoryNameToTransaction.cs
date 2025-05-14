using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinTrack.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryNameToTransaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Users_UserID",
                table: "Transactions");

            migrationBuilder.AddColumn<string>(
                name: "CategoryName",
                table: "Transactions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK__Transacti__UserI__403A8C7D",
                table: "Transactions",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Transacti__UserI__403A8C7D",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "CategoryName",
                table: "Transactions");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Users_UserID",
                table: "Transactions",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID");
        }
    }
}
