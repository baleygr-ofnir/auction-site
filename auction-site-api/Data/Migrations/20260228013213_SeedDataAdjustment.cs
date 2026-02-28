using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace auction_site_api.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedDataAdjustment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "EndTime",
                value: new DateTime(2030, 1, 1, 10, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "EndTime",
                value: new DateTime(2030, 1, 1, 10, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "EndTime",
                value: new DateTime(2030, 1, 1, 10, 0, 0, 0, DateTimeKind.Utc));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "EndTime",
                value: new DateTime(2025, 1, 1, 17, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "EndTime",
                value: new DateTime(2025, 1, 1, 14, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "EndTime",
                value: new DateTime(2024, 12, 31, 12, 0, 0, 0, DateTimeKind.Utc));
        }
    }
}
