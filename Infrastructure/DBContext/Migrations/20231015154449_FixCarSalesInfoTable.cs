using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class FixCarSalesInfoTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cars_CarSalesInfo_CarSalesInfoId",
                table: "Cars");

            migrationBuilder.DropIndex(
                name: "IX_Cars_CarSalesInfoId",
                table: "Cars");

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
                name: "CarSalesInfoId",
                table: "Cars");

            migrationBuilder.AddColumn<string>(
                name: "CarId",
                table: "CarSalesInfo",
                type: "nvarchar(18)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "08399f27-0cfc-4cf8-af64-e05ff697bc30", "17d975bf-d475-4887-8a74-f7c111fa3430", "Adminstrator", "ADMINSTRATOR" },
                    { "1288becb-e0f1-444d-ab38-abbf1c257109", "cdb5d5a3-46ab-40c6-951d-e2b9357178e3", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "2bdb7c11-934c-4c9e-8afb-66a61887c4d6", "15135fd0-501e-446d-815c-7606465922e3", "CarDealer", "CARDEALER" },
                    { "6c03eba2-7677-453a-86ff-45801517e80b", "94b50a87-cd58-45d6-b264-3f4b094acfb3", "ServiceShop", "SERVICESHOP" },
                    { "70c05dd8-7de4-4a9b-839e-d5d465b21a8e", "16e36ec1-0edb-4c8c-ae08-ff65a2234d10", "Manufacturer", "MANUFACTURER" },
                    { "a720129f-4ef4-4333-b495-f34679cfab35", "53ef0905-1ad8-4335-8148-cdb838bae98c", "User", "USER" },
                    { "f25e8a3c-c554-49a2-9634-fa102d548d7e", "1ca95467-030f-4351-a984-1e07a45559f7", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "fbb7a4e5-7e59-4cce-b209-081fc711cf38", "5788d178-508a-4230-bf6d-a8c9e153ae95", "PoliceOffice", "POLICEOFFICE" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CarSalesInfo_CarId",
                table: "CarSalesInfo",
                column: "CarId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CarSalesInfo_Cars_CarId",
                table: "CarSalesInfo",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "VinId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CarSalesInfo_Cars_CarId",
                table: "CarSalesInfo");

            migrationBuilder.DropIndex(
                name: "IX_CarSalesInfo_CarId",
                table: "CarSalesInfo");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "08399f27-0cfc-4cf8-af64-e05ff697bc30");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1288becb-e0f1-444d-ab38-abbf1c257109");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2bdb7c11-934c-4c9e-8afb-66a61887c4d6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6c03eba2-7677-453a-86ff-45801517e80b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "70c05dd8-7de4-4a9b-839e-d5d465b21a8e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a720129f-4ef4-4333-b495-f34679cfab35");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f25e8a3c-c554-49a2-9634-fa102d548d7e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fbb7a4e5-7e59-4cce-b209-081fc711cf38");

            migrationBuilder.DropColumn(
                name: "CarId",
                table: "CarSalesInfo");

            migrationBuilder.AddColumn<int>(
                name: "CarSalesInfoId",
                table: "Cars",
                type: "int",
                nullable: true);

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
                name: "IX_Cars_CarSalesInfoId",
                table: "Cars",
                column: "CarSalesInfoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cars_CarSalesInfo_CarSalesInfoId",
                table: "Cars",
                column: "CarSalesInfoId",
                principalTable: "CarSalesInfo",
                principalColumn: "Id");
        }
    }
}
