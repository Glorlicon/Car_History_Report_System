using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class ChangeServiceHistoryEnum : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<int>(
                name: "Services",
                table: "CarServicesHistory",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "005ebeff-d999-43e3-bf35-d2b21bd42122", "53628af0-8d71-4361-837f-e492fffed951", "Adminstrator", "ADMINSTRATOR" },
                    { "0706e9d8-8643-4ee0-9876-22ea1010ea3f", "5baf6d37-2a2b-41a1-8608-4685ea146e16", "ServiceShop", "SERVICESHOP" },
                    { "13c87c57-785c-4fa7-857f-820f67e3b83f", "b4fac866-99c9-4a2b-8864-edac218ce220", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "81918f67-2b07-46ce-8866-7698a61674f3", "2893f680-0240-4203-a47d-5506ef3efb0d", "Manufacturer", "MANUFACTURER" },
                    { "9a606d26-4d4f-4ea5-9580-ce8c019eb7b1", "6ad41f64-a058-499b-ac4b-95e63c0c79d2", "CarDealer", "CARDEALER" },
                    { "9a8d9aa5-17cb-481d-8cb1-0dc573997811", "24127fc5-48da-4d77-999b-fd3c47d5ca5e", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "d1390089-00d5-40ca-8fb0-ab64753d57b6", "39005275-d5a2-4f36-a053-b873f00d4c15", "PoliceOffice", "POLICEOFFICE" },
                    { "e8add7ed-5e9c-48cc-bff7-9fe662a05e9d", "b57fa0a9-73b4-4db7-92b8-fb7c76f26a66", "User", "USER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "005ebeff-d999-43e3-bf35-d2b21bd42122");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0706e9d8-8643-4ee0-9876-22ea1010ea3f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "13c87c57-785c-4fa7-857f-820f67e3b83f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "81918f67-2b07-46ce-8866-7698a61674f3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9a606d26-4d4f-4ea5-9580-ce8c019eb7b1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9a8d9aa5-17cb-481d-8cb1-0dc573997811");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d1390089-00d5-40ca-8fb0-ab64753d57b6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e8add7ed-5e9c-48cc-bff7-9fe662a05e9d");

            migrationBuilder.AlterColumn<string>(
                name: "Services",
                table: "CarServicesHistory",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

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
    }
}
