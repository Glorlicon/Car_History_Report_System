using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class AddRequestAndWorkingTimeTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1795da06-6072-4348-8d07-3e5f9999fd60");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2a472643-6ec2-44d1-ab99-42662d6cb139");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6e64362b-3328-4c65-9616-98439f36d812");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8a963c0f-3df2-4ca6-9b56-7bbf6906cb5f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8e9add7f-0ea2-4485-bfeb-901d76f858b0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ae60c2dc-3268-4b9a-b02a-d60f717efd92");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "af8b2f91-eeeb-44fb-8b71-7e07e1252955");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e1ccb37e-1d30-4795-abcf-ae435dcf6909");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmount",
                table: "OrderOptions",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "OrderOptions",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                table: "OrderOptions",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AddColumn<string>(
                name: "ImageLink",
                table: "DataProviders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "CarSalesInfo",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.CreateTable(
                name: "CarImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CarId = table.Column<string>(type: "nvarchar(18)", nullable: false),
                    ImageLink = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CarImages_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "VinId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Requests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Response = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ModifiedByUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Requests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Requests_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Requests_AspNetUsers_ModifiedByUserId",
                        column: x => x.ModifiedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "WorkingTimes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DataProviderId = table.Column<int>(type: "int", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EndTime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsClosed = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkingTimes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkingTimes_DataProviders_DataProviderId",
                        column: x => x.DataProviderId,
                        principalTable: "DataProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0a2fa5da-5fab-4c03-940e-ce9e5b39cc26", "b4b6d5a3-def7-4c03-881d-fcb8cdb1f4a2", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "2e54970d-1974-4182-8de8-aaff4ae71cce", "b76e105e-0048-4a6a-b7e9-7c2c2c579693", "Manufacturer", "MANUFACTURER" },
                    { "4673d56e-11ca-4cba-89a9-fab7b8d9260d", "1865c9e9-9330-4bf3-ad2e-1b97832c70fd", "ServiceShop", "SERVICESHOP" },
                    { "6750c860-f53a-4887-8de8-eadf949ab47a", "c004c892-c0e8-472c-9f80-77c2974175f9", "PoliceOffice", "POLICEOFFICE" },
                    { "697651b6-4c34-4ac9-b016-60b8f198ca6a", "8d3ada5d-4d51-45d8-a28e-f19bcb417d29", "Adminstrator", "ADMINSTRATOR" },
                    { "6a9429f5-1de2-4101-afe8-889df17a19aa", "1a88eb75-060c-40db-b8f1-d2ba1ef8dacb", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "8dbc29c4-e443-40ae-9514-a89b53c6dfca", "35eefe85-e499-4aa0-8872-9ee1aaeb7b6b", "User", "USER" },
                    { "ae8b57c0-cfd9-4f6c-baff-99a567f2a07c", "fd2a7cc7-5deb-465d-b79f-9f47f9d6766f", "CarDealer", "CARDEALER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CarImages_CarId",
                table: "CarImages",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_Requests_CreatedByUserId",
                table: "Requests",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Requests_ModifiedByUserId",
                table: "Requests",
                column: "ModifiedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkingTimes_DataProviderId",
                table: "WorkingTimes",
                column: "DataProviderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CarImages");

            migrationBuilder.DropTable(
                name: "Requests");

            migrationBuilder.DropTable(
                name: "WorkingTimes");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0a2fa5da-5fab-4c03-940e-ce9e5b39cc26");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2e54970d-1974-4182-8de8-aaff4ae71cce");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4673d56e-11ca-4cba-89a9-fab7b8d9260d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6750c860-f53a-4887-8de8-eadf949ab47a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "697651b6-4c34-4ac9-b016-60b8f198ca6a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6a9429f5-1de2-4101-afe8-889df17a19aa");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8dbc29c4-e443-40ae-9514-a89b53c6dfca");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ae8b57c0-cfd9-4f6c-baff-99a567f2a07c");

            migrationBuilder.DropColumn(
                name: "ImageLink",
                table: "DataProviders");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmount",
                table: "OrderOptions",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "OrderOptions",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                table: "OrderOptions",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "CarSalesInfo",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1795da06-6072-4348-8d07-3e5f9999fd60", "3dc27054-3778-435e-8b22-64c11f4b8fd9", "PoliceOffice", "POLICEOFFICE" },
                    { "2a472643-6ec2-44d1-ab99-42662d6cb139", "02a5abfa-91da-4c70-b288-00ed4dee5908", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "6e64362b-3328-4c65-9616-98439f36d812", "bcbc4d18-6938-4a55-910c-fad2ba2b6855", "ServiceShop", "SERVICESHOP" },
                    { "8a963c0f-3df2-4ca6-9b56-7bbf6906cb5f", "2f412988-4ec0-42c6-8a75-5ef203f5c502", "Manufacturer", "MANUFACTURER" },
                    { "8e9add7f-0ea2-4485-bfeb-901d76f858b0", "fd2ebe51-9f77-4dd9-8cbb-11146d435269", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "ae60c2dc-3268-4b9a-b02a-d60f717efd92", "dac447a2-840c-4f29-8642-a08cab72b6d9", "CarDealer", "CARDEALER" },
                    { "af8b2f91-eeeb-44fb-8b71-7e07e1252955", "a115a9ad-cba6-4073-a0c4-032b97c6730d", "User", "USER" },
                    { "e1ccb37e-1d30-4795-abcf-ae435dcf6909", "73967e10-a530-4dc3-ba21-62eef2d620d3", "Adminstrator", "ADMINSTRATOR" }
                });
        }
    }
}
