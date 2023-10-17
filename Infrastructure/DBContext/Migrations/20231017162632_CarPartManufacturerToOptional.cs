using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class CarPartManufacturerToOptional : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CarParts_DataProviders_ManufacturerId",
                table: "CarParts");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "045d4f19-51f3-4cfd-98d1-a27e37e890b1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1115eba8-088f-4d96-bb4c-416d0c5db623");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2015ab45-2720-4979-b1ef-9b6c420e56d2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5355287a-1255-4925-b638-2dcdedebd0d3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "62ee0827-8899-4fa1-bed4-958a2fe064ee");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6b629ba6-7a6a-4c35-ab26-47358fee371a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7fd42754-cc4a-4baf-a675-b895d2e9dbc8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "80718e25-6102-4270-b3db-092f06896a89");

            migrationBuilder.AlterColumn<int>(
                name: "ManufacturerId",
                table: "CarParts",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "01e3cc89-c0a4-471f-b59d-95f32679b7b8", "6e879a42-964f-4f08-a7cf-304abe855596", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "025d5dbd-c9e1-49fa-a5d3-030cd841ce12", "6fa9c2d9-3f94-4ed8-8af3-54feb9fe36fd", "User", "USER" },
                    { "64ed13ae-9ad4-48dc-9ad8-7d8d7e495a68", "c429fe55-93dd-40aa-8ae2-a76533441d36", "ServiceShop", "SERVICESHOP" },
                    { "97c09e19-319d-4d72-9772-57b793f91412", "536253f3-d498-4dfb-acc6-250307e5f7ac", "PoliceOffice", "POLICEOFFICE" },
                    { "a56f44ec-69e6-48cf-9fd3-c1ffe1d1f9f4", "a6ab798b-727a-4cb9-a42b-e55f522daf5a", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "ac9cebcd-c518-4bbd-9952-56c4e64dd556", "b8a991ea-5dd0-4470-be0d-8a195e03b513", "Manufacturer", "MANUFACTURER" },
                    { "af91af0e-6293-4170-9c07-425297f0fd2b", "77dac981-3e82-439a-ab1e-6f28f964aa51", "Adminstrator", "ADMINSTRATOR" },
                    { "b4a0a1f0-254c-4ddc-a53a-80a7589ae41d", "2f70f384-8d60-4bf7-b1d6-3d24854248df", "CarDealer", "CARDEALER" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_CarParts_DataProviders_ManufacturerId",
                table: "CarParts",
                column: "ManufacturerId",
                principalTable: "DataProviders",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CarParts_DataProviders_ManufacturerId",
                table: "CarParts");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "01e3cc89-c0a4-471f-b59d-95f32679b7b8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "025d5dbd-c9e1-49fa-a5d3-030cd841ce12");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "64ed13ae-9ad4-48dc-9ad8-7d8d7e495a68");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "97c09e19-319d-4d72-9772-57b793f91412");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a56f44ec-69e6-48cf-9fd3-c1ffe1d1f9f4");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ac9cebcd-c518-4bbd-9952-56c4e64dd556");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "af91af0e-6293-4170-9c07-425297f0fd2b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b4a0a1f0-254c-4ddc-a53a-80a7589ae41d");

            migrationBuilder.AlterColumn<int>(
                name: "ManufacturerId",
                table: "CarParts",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "045d4f19-51f3-4cfd-98d1-a27e37e890b1", "1f6960bf-13da-4d86-9d16-bbfc654f1424", "Manufacturer", "MANUFACTURER" },
                    { "1115eba8-088f-4d96-bb4c-416d0c5db623", "5a33dfda-ddd6-4954-8157-5213cd5a3fe7", "User", "USER" },
                    { "2015ab45-2720-4979-b1ef-9b6c420e56d2", "d6736656-ef17-4a1f-a8a1-9a99c914feee", "Adminstrator", "ADMINSTRATOR" },
                    { "5355287a-1255-4925-b638-2dcdedebd0d3", "c3739545-995c-48af-acc0-e9da79808bb3", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "62ee0827-8899-4fa1-bed4-958a2fe064ee", "0860c88b-7b60-46e9-965d-9886fe7d0baa", "ServiceShop", "SERVICESHOP" },
                    { "6b629ba6-7a6a-4c35-ab26-47358fee371a", "ac7fd261-1f0a-428e-aa7e-d82fd19f94da", "CarDealer", "CARDEALER" },
                    { "7fd42754-cc4a-4baf-a675-b895d2e9dbc8", "c2143bf6-ee51-4044-8f6c-c5d256d0bdcf", "PoliceOffice", "POLICEOFFICE" },
                    { "80718e25-6102-4270-b3db-092f06896a89", "cab09ff6-76db-47ea-b40a-4753d7bc6da1", "VehicleRegistry", "VEHICLEREGISTRY" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_CarParts_DataProviders_ManufacturerId",
                table: "CarParts",
                column: "ManufacturerId",
                principalTable: "DataProviders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
