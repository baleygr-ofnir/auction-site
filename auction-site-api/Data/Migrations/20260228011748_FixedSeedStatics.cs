using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace auction_site_api.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixedSeedStatics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 1, 1, 17, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 1, 1, 11, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "CreatedAt", "EndTime", "StartTime" },
                values: new object[] { new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 1, 1, 14, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 1, 1, 10, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "CreatedAt", "EndTime", "StartTime" },
                values: new object[] { new DateTime(2024, 12, 29, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 12, 31, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 12, 29, 12, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Bids",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "CreatedAt",
                value: new DateTime(2025, 1, 1, 11, 30, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Bids",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                column: "CreatedAt",
                value: new DateTime(2025, 1, 1, 11, 50, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Bids",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                column: "CreatedAt",
                value: new DateTime(2024, 12, 31, 11, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "CreatedAt",
                value: new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                column: "CreatedAt",
                value: new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                column: "CreatedAt",
                value: new DateTime(2025, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 2, 28, 1, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), new DateTime(2026, 2, 28, 6, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), new DateTime(2026, 2, 28, 0, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399) });

            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "CreatedAt", "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 2, 28, 1, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), new DateTime(2026, 2, 28, 3, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), new DateTime(2026, 2, 27, 23, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399) });

            migrationBuilder.UpdateData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "CreatedAt", "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 2, 25, 1, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), new DateTime(2026, 2, 27, 1, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), new DateTime(2026, 2, 25, 1, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399) });

            migrationBuilder.UpdateData(
                table: "Bids",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "CreatedAt",
                value: new DateTime(2026, 2, 28, 0, 42, 2, 775, DateTimeKind.Utc).AddTicks(2399));

            migrationBuilder.UpdateData(
                table: "Bids",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                column: "CreatedAt",
                value: new DateTime(2026, 2, 28, 1, 2, 2, 775, DateTimeKind.Utc).AddTicks(2399));

            migrationBuilder.UpdateData(
                table: "Bids",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                column: "CreatedAt",
                value: new DateTime(2026, 2, 27, 0, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "CreatedAt",
                value: new DateTime(2026, 2, 28, 1, 12, 2, 774, DateTimeKind.Utc).AddTicks(8095));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                column: "CreatedAt",
                value: new DateTime(2026, 2, 28, 1, 12, 2, 774, DateTimeKind.Utc).AddTicks(8275));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                column: "CreatedAt",
                value: new DateTime(2026, 2, 28, 1, 12, 2, 774, DateTimeKind.Utc).AddTicks(8277));
        }
    }
}
