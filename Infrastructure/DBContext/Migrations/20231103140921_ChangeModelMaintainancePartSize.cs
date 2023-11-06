using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class ChangeModelMaintainancePartSize : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "17c12d15-6846-4889-a375-9440bac2c9f0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "48087d20-78ba-444a-831e-de6a7f68760b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5eef6185-ed8a-472c-8d60-807ede4d1bed");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "61e2bf92-4c79-4717-9feb-a0ff142752d4");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "76e59fe4-1511-4575-88f6-614f963db435");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b1ab2262-8613-41f2-ad5c-0ce4acd7bd3c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e72d0cd2-9e59-4dd5-8ac4-e9b7df781bb1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f29988a8-2570-4e58-9cc8-9dc462d945ea");

            migrationBuilder.AlterColumn<string>(
                name: "MaintenancePart",
                table: "ModelMaintainances",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Services",
                table: "CarServicesHistory",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "04cad02a-cf63-4907-81ad-faa048d4d102", "cba550e6-102e-4f15-9bb7-3b758ba5bcf7", "Adminstrator", "ADMINSTRATOR" },
                    { "78372399-f257-4bff-ac9c-125db0d2617c", "d3d62559-26c4-43f6-b3d3-d648a5961521", "Manufacturer", "MANUFACTURER" },
                    { "84ac956b-c0d3-470f-9122-542ea6ca25f5", "c1ccff4e-a490-4a7c-91b4-283fc72a615b", "CarDealer", "CARDEALER" },
                    { "93d6c213-4d77-405c-8dc4-58414a1981a7", "e5887116-b98d-4a45-ac06-7805f5385bd0", "ServiceShop", "SERVICESHOP" },
                    { "96d38e42-fd34-42e1-9d7d-5784fe8c91d8", "9055ba6c-f9c8-48b8-a159-c5cd0a6dc270", "User", "USER" },
                    { "b30efb96-b35b-486f-bf01-0580b579c892", "ad90f165-349f-4d4c-bff3-56df39ffcfab", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "cd564395-68ae-49b4-a2e7-4bd4d1144e3c", "35993a8b-bdf8-4501-9f50-dca25b09df6d", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "d023e6f8-0856-42b5-b698-450cba704ef7", "70e2a19c-288a-4def-af1c-07e449fc0035", "PoliceOffice", "POLICEOFFICE" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "04cad02a-cf63-4907-81ad-faa048d4d102");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "78372399-f257-4bff-ac9c-125db0d2617c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "84ac956b-c0d3-470f-9122-542ea6ca25f5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "93d6c213-4d77-405c-8dc4-58414a1981a7");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "96d38e42-fd34-42e1-9d7d-5784fe8c91d8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b30efb96-b35b-486f-bf01-0580b579c892");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cd564395-68ae-49b4-a2e7-4bd4d1144e3c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d023e6f8-0856-42b5-b698-450cba704ef7");

            migrationBuilder.AlterColumn<string>(
                name: "MaintenancePart",
                table: "ModelMaintainances",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "Services",
                table: "CarServicesHistory",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "17c12d15-6846-4889-a375-9440bac2c9f0", "4a0d3e13-602d-441e-a232-613fd4966160", "Adminstrator", "ADMINSTRATOR" },
                    { "48087d20-78ba-444a-831e-de6a7f68760b", "b60dd191-f07d-4763-abb4-984b878899d5", "CarDealer", "CARDEALER" },
                    { "5eef6185-ed8a-472c-8d60-807ede4d1bed", "504ba09c-7cb4-4bb3-9a1b-a855af857e4b", "User", "USER" },
                    { "61e2bf92-4c79-4717-9feb-a0ff142752d4", "dfb17998-8b03-46a1-8f58-20ffa974097b", "PoliceOffice", "POLICEOFFICE" },
                    { "76e59fe4-1511-4575-88f6-614f963db435", "3413b221-c122-427e-b715-fda23a613bc1", "Manufacturer", "MANUFACTURER" },
                    { "b1ab2262-8613-41f2-ad5c-0ce4acd7bd3c", "e7dba985-483c-44e7-8618-ce7c4fd463c3", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "e72d0cd2-9e59-4dd5-8ac4-e9b7df781bb1", "b29d61e6-2c0a-4298-b9b3-a79405ce83e3", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "f29988a8-2570-4e58-9cc8-9dc462d945ea", "4ecd6940-4f7f-4cb9-96d6-6e159026f2d8", "ServiceShop", "SERVICESHOP" }
                });
        }
    }
}
