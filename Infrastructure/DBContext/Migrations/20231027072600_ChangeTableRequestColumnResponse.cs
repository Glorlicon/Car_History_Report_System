using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class ChangeTableRequestColumnResponse : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "06b68dee-89d8-4585-b2a1-4654919e01c9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "53a39e52-b13d-442e-9f09-4cea0d05eb9b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6a926ae8-43a4-4db7-a866-d67d278a0db7");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "70aafdaa-8257-4a07-a13b-64be24b83481");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "92790515-368e-4e9c-94d5-96e709ef9b0d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b76855c1-bf52-4755-bae6-f79411934673");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cab88091-5e25-4c42-961d-d700628431db");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ee228b23-df24-42dc-89f7-7d38e6f89354");

            migrationBuilder.AlterColumn<string>(
                name: "Response",
                table: "Requests",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1c51ea19-ddab-4086-a909-cd3501ffd28c", "25aaaaff-e0a7-4e3b-a339-0f1ff2a6c31c", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "2c44f315-c000-4c33-8ec4-35a77846247e", "c651810e-e174-4bf1-b76a-5f8ac0840461", "PoliceOffice", "POLICEOFFICE" },
                    { "7c1e9691-35e3-4e8e-8d73-bb5f27e449c5", "2aa79934-5c64-4abe-8330-97c0eeeed37d", "User", "USER" },
                    { "86a02f12-691c-426c-83b3-9968d12cf14e", "0351d6e3-0ace-49fe-978b-cfaaacc56b56", "Manufacturer", "MANUFACTURER" },
                    { "93d74e66-8973-41a1-a84d-2e28d972a53d", "92c2f873-5f64-4711-9497-c3bcc77aa116", "CarDealer", "CARDEALER" },
                    { "a23dc8a2-12d8-47f2-ab48-2e130ce63178", "a86cf8f3-86dc-47a0-89da-b2644d96de5a", "Adminstrator", "ADMINSTRATOR" },
                    { "b3b2d2dc-bdab-4cc3-b459-d7a01da27743", "d74cfc55-41e4-4d5c-a4f2-1277cad63dbd", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "d1c5ea54-84ca-47fd-90f3-7801c8c76d5c", "9ede41d8-53d8-48d3-8eb7-e0b645cf1296", "ServiceShop", "SERVICESHOP" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1c51ea19-ddab-4086-a909-cd3501ffd28c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2c44f315-c000-4c33-8ec4-35a77846247e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7c1e9691-35e3-4e8e-8d73-bb5f27e449c5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "86a02f12-691c-426c-83b3-9968d12cf14e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "93d74e66-8973-41a1-a84d-2e28d972a53d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a23dc8a2-12d8-47f2-ab48-2e130ce63178");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b3b2d2dc-bdab-4cc3-b459-d7a01da27743");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d1c5ea54-84ca-47fd-90f3-7801c8c76d5c");

            migrationBuilder.AlterColumn<string>(
                name: "Response",
                table: "Requests",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "06b68dee-89d8-4585-b2a1-4654919e01c9", "09a0c495-3f23-4def-8234-9412cf665dca", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "53a39e52-b13d-442e-9f09-4cea0d05eb9b", "3f8c5125-6ed9-427a-ae45-9d242700eab2", "PoliceOffice", "POLICEOFFICE" },
                    { "6a926ae8-43a4-4db7-a866-d67d278a0db7", "c9cd8c47-f39b-415b-9fc4-a8b15f9979f8", "Manufacturer", "MANUFACTURER" },
                    { "70aafdaa-8257-4a07-a13b-64be24b83481", "a2ec23f4-2c6d-46ef-9bbf-e981f5ebb517", "ServiceShop", "SERVICESHOP" },
                    { "92790515-368e-4e9c-94d5-96e709ef9b0d", "fc01ea83-7719-4d32-89c6-42d8f2257783", "Adminstrator", "ADMINSTRATOR" },
                    { "b76855c1-bf52-4755-bae6-f79411934673", "1d95e16d-b27d-43c4-8b99-ad65e0cbe3d9", "CarDealer", "CARDEALER" },
                    { "cab88091-5e25-4c42-961d-d700628431db", "eb440afa-9b22-4331-b8d6-91e61f112eaf", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "ee228b23-df24-42dc-89f7-7d38e6f89354", "5d6d66af-4c57-4d8f-b429-84f5d5985a6d", "User", "USER" }
                });
        }
    }
}
