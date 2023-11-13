using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class AddRegistrationHistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "30a501a8-d295-48c7-b3d1-56ad91cb85b2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4ccfabb2-98c7-4d61-815f-2820696d0208");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "64d48ece-479e-49ff-9a96-26f989930a9e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "775dcc45-d069-466a-910f-ffa376bf76af");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c182e624-f565-4935-9fe7-fac65f756083");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c8016df2-1b21-4bb0-9995-1413d894f63d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cbaccad7-c8a9-40a8-a1f9-ba32c418763f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f8b97982-e635-42d3-ba5f-17d318f18fc4");

            migrationBuilder.CreateTable(
                name: "CarRegistrationHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OwnerName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RegistrationNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ExpireDate = table.Column<DateOnly>(type: "date", nullable: false),
                    LicensePlateNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedByUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ModifiedByUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CarId = table.Column<string>(type: "nvarchar(18)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Odometer = table.Column<int>(type: "int", nullable: true),
                    ReportDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarRegistrationHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CarRegistrationHistories_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CarRegistrationHistories_AspNetUsers_ModifiedByUserId",
                        column: x => x.ModifiedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CarRegistrationHistories_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "VinId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2f38af18-54b7-4301-abdb-490d2d810e87", "eb47b332-d472-4fcc-82ac-0754a7d179da", "User", "USER" },
                    { "3da03901-e6e8-462a-b992-0ec768a651ad", "645a9338-ba9a-43ce-ad53-78d9541b2223", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "402248d7-d50d-423a-a71f-e39adf2af1be", "9eb3b199-9f36-45be-b8ac-aaa2a14e66cd", "PoliceOffice", "POLICEOFFICE" },
                    { "46ae95c7-f44a-45e7-8300-00527e6d7574", "9725da98-f9c3-49a1-884d-0de5c3b56a39", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "4d81076f-2870-4c8b-854a-0a8f436332fc", "bba6cd14-44af-49fc-b34b-d5edeec59903", "CarDealer", "CARDEALER" },
                    { "9edc5860-150d-46c0-977b-3bef66e84b3a", "060b3160-7041-4da1-93f6-b126ff67c2ad", "Manufacturer", "MANUFACTURER" },
                    { "e47a4a22-879e-4d17-9819-7b5018a0c2b8", "9056a94e-6171-4114-98b2-171a25f5ea93", "ServiceShop", "SERVICESHOP" },
                    { "ff75b685-f6ab-4209-bb64-8436ebdcea51", "a9c7bafd-8090-45af-a7d1-01d5ab4c644f", "Adminstrator", "ADMINSTRATOR" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CarRegistrationHistories_CarId",
                table: "CarRegistrationHistories",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_CarRegistrationHistories_CreatedByUserId",
                table: "CarRegistrationHistories",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CarRegistrationHistories_ModifiedByUserId",
                table: "CarRegistrationHistories",
                column: "ModifiedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CarRegistrationHistories_RegistrationNumber",
                table: "CarRegistrationHistories",
                column: "RegistrationNumber",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CarRegistrationHistories");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2f38af18-54b7-4301-abdb-490d2d810e87");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3da03901-e6e8-462a-b992-0ec768a651ad");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "402248d7-d50d-423a-a71f-e39adf2af1be");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "46ae95c7-f44a-45e7-8300-00527e6d7574");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4d81076f-2870-4c8b-854a-0a8f436332fc");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9edc5860-150d-46c0-977b-3bef66e84b3a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e47a4a22-879e-4d17-9819-7b5018a0c2b8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ff75b685-f6ab-4209-bb64-8436ebdcea51");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "30a501a8-d295-48c7-b3d1-56ad91cb85b2", "ff522cd7-9286-4fc2-a4f3-2610bf012d98", "CarDealer", "CARDEALER" },
                    { "4ccfabb2-98c7-4d61-815f-2820696d0208", "19527132-a7aa-4f0d-b13e-606ba016b01f", "User", "USER" },
                    { "64d48ece-479e-49ff-9a96-26f989930a9e", "e478f6db-61e7-4a5e-bdd7-dd2cf27edd31", "Adminstrator", "ADMINSTRATOR" },
                    { "775dcc45-d069-466a-910f-ffa376bf76af", "91f943ac-4e03-44bb-944a-84814b51bd34", "Manufacturer", "MANUFACTURER" },
                    { "c182e624-f565-4935-9fe7-fac65f756083", "89c25d4b-9f71-47b2-a37f-4d29a5e5088e", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "c8016df2-1b21-4bb0-9995-1413d894f63d", "d26a4188-bd9e-4967-aa94-ef86a31d355d", "ServiceShop", "SERVICESHOP" },
                    { "cbaccad7-c8a9-40a8-a1f9-ba32c418763f", "a00b76b3-f706-43ac-8557-7dc4168ede59", "PoliceOffice", "POLICEOFFICE" },
                    { "f8b97982-e635-42d3-ba5f-17d318f18fc4", "f3f8bdfa-f867-46c9-b232-4746c5689249", "InsuranceCompany", "INSURANCECOMPANY" }
                });
        }
    }
}
