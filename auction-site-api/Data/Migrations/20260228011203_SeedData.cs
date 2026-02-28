using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace auction_site_api.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "IsActive", "IsAdmin", "PasswordHash", "UpdatedAt", "Username" },
                values: new object[,]
                {
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), new DateTime(2026, 2, 28, 1, 12, 2, 774, DateTimeKind.Utc).AddTicks(8095), "admin@example.com", true, true, "", null, "admin" },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), new DateTime(2026, 2, 28, 1, 12, 2, 774, DateTimeKind.Utc).AddTicks(8275), "alice@example.com", true, false, "", null, "alice" },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), new DateTime(2026, 2, 28, 1, 12, 2, 774, DateTimeKind.Utc).AddTicks(8277), "bob@example.com", true, false, "", null, "bob" }
                });

            migrationBuilder.InsertData(
                table: "Auctions",
                columns: new[] { "Id", "CreatedAt", "CreatorId", "Description", "EndTime", "IsActive", "StartPrice", "StartTime", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 2, 28, 1, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "15\" gaming laptop with RTX GPU", new DateTime(2026, 2, 28, 6, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), true, 800m, new DateTime(2026, 2, 28, 0, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), "Gaming Laptop", null },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 2, 28, 1, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), "Custom mechanical keyboard", new DateTime(2026, 2, 28, 3, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), true, 100m, new DateTime(2026, 2, 27, 23, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), "Mechanical Keyboard", null },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2026, 2, 25, 1, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "Box of LPs", new DateTime(2026, 2, 27, 1, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), true, 50m, new DateTime(2026, 2, 25, 1, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), "Vintage Vinyl Collection", null }
                });

            migrationBuilder.InsertData(
                table: "Bids",
                columns: new[] { "Id", "Amount", "AuctionId", "CreatedAt", "UserId" },
                values: new object[,]
                {
                    { new Guid("44444444-4444-4444-4444-444444444444"), 820m, new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 2, 28, 0, 42, 2, 775, DateTimeKind.Utc).AddTicks(2399), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc") },
                    { new Guid("55555555-5555-5555-5555-555555555555"), 850m, new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 2, 28, 1, 2, 2, 775, DateTimeKind.Utc).AddTicks(2399), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc") },
                    { new Guid("66666666-6666-6666-6666-666666666666"), 90m, new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2026, 2, 27, 0, 12, 2, 775, DateTimeKind.Utc).AddTicks(2399), new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Bids",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "Bids",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "Bids",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));

            migrationBuilder.DeleteData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Auctions",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"));
        }
    }
}
