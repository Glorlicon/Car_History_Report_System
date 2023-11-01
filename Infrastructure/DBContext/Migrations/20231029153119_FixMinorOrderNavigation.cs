using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class FixMinorOrderNavigation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "01b21707-6b91-4d98-84d6-b100eae0fdaa", "1b81239a-d327-458f-aa8c-a35c01acf209", "User", "USER" },
                    { "1466a607-3fa2-404f-9b1e-17310ab4fad4", "c6d02486-2df1-428e-909c-247a1ab25ef8", "CarDealer", "CARDEALER" },
                    { "66bf314e-2fe3-461b-8611-880b31f1e1ca", "57dfe3f9-5850-4d88-ba4f-343c931ccbf6", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "6747836e-0e9c-4874-b19c-40d8f438867d", "0a87652b-90c6-473b-ac94-07620929519f", "Adminstrator", "ADMINSTRATOR" },
                    { "7fdb27aa-9ed5-4793-9a0f-16c891c6fe4c", "95796290-efba-4e23-9745-387e17fec729", "PoliceOffice", "POLICEOFFICE" },
                    { "9085ab55-3810-432c-a311-100f228aa345", "dd182ce3-4198-421e-94b9-b777413369b4", "Manufacturer", "MANUFACTURER" },
                    { "bbc60056-0dbc-4ea5-8c57-e5b837953773", "7f6be411-95bc-4079-84ee-151edeff5fca", "ServiceShop", "SERVICESHOP" },
                    { "c5d39636-ee7d-4b48-a3c4-241eddbb626f", "33669193-b4a3-4b70-a983-354b4d3e0aac", "VehicleRegistry", "VEHICLEREGISTRY" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "01b21707-6b91-4d98-84d6-b100eae0fdaa");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1466a607-3fa2-404f-9b1e-17310ab4fad4");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "66bf314e-2fe3-461b-8611-880b31f1e1ca");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6747836e-0e9c-4874-b19c-40d8f438867d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7fdb27aa-9ed5-4793-9a0f-16c891c6fe4c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9085ab55-3810-432c-a311-100f228aa345");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bbc60056-0dbc-4ea5-8c57-e5b837953773");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c5d39636-ee7d-4b48-a3c4-241eddbb626f");

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
    }
}
