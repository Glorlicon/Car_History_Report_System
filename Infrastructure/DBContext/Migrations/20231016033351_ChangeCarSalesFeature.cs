using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class ChangeCarSalesFeature : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CarSalesFeature");

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

            migrationBuilder.AddColumn<string>(
                name: "Features",
                table: "CarSalesInfo",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1468dfda-b4f1-41b7-ba6b-cfa22d1f0c64", "c8003c73-46b6-4747-82b8-7a2ffbd6cbb6", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "1f88ebd5-3bf6-496c-a344-108a1b6c24b5", "8cac58ec-de63-45a5-854d-5d77c69f0b04", "User", "USER" },
                    { "35cd5e0c-2248-4393-acb1-2faaa3f790e1", "383c830d-1fcb-4f7d-889e-97fc7b3130fa", "Manufacturer", "MANUFACTURER" },
                    { "71ed671c-8c87-4f33-9dbb-9ba347009acd", "da07c605-cad1-4743-94fb-78afa86736db", "PoliceOffice", "POLICEOFFICE" },
                    { "87d35539-9548-40b2-90d5-34ff26c1cc7a", "5d6f5e8c-12d4-449d-8fce-087a358ce2e9", "ServiceShop", "SERVICESHOP" },
                    { "bf2c67c6-791d-4bc8-877c-17884014aae5", "54db511c-ebb5-4c83-9c41-62cb0be48413", "CarDealer", "CARDEALER" },
                    { "d6974125-f767-483e-93a9-169c1b14ace6", "94350b71-f521-4f36-b303-1dcb1b5d42db", "Adminstrator", "ADMINSTRATOR" },
                    { "dba9038a-618c-40e0-bba1-4e26fe21c8fc", "23309dd1-61ee-4d3c-bd12-90318c40ca87", "VehicleRegistry", "VEHICLEREGISTRY" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1468dfda-b4f1-41b7-ba6b-cfa22d1f0c64");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1f88ebd5-3bf6-496c-a344-108a1b6c24b5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "35cd5e0c-2248-4393-acb1-2faaa3f790e1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "71ed671c-8c87-4f33-9dbb-9ba347009acd");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "87d35539-9548-40b2-90d5-34ff26c1cc7a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bf2c67c6-791d-4bc8-877c-17884014aae5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d6974125-f767-483e-93a9-169c1b14ace6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dba9038a-618c-40e0-bba1-4e26fe21c8fc");

            migrationBuilder.DropColumn(
                name: "Features",
                table: "CarSalesInfo");

            migrationBuilder.CreateTable(
                name: "CarSalesFeature",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesInfoId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarSalesFeature", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CarSalesFeature_CarSalesInfo_SalesInfoId",
                        column: x => x.SalesInfoId,
                        principalTable: "CarSalesInfo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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
                name: "IX_CarSalesFeature_SalesInfoId",
                table: "CarSalesFeature",
                column: "SalesInfoId");
        }
    }
}
