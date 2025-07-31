using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetingsApp.Data.Migrations
{
    /// <inheritdoc />
    public partial class MeetingModelUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCanceled",
                table: "Meetings",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCanceled",
                table: "Meetings");
        }
    }
}
