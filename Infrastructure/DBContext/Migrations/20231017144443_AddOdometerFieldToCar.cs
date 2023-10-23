using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class AddOdometerFieldToCar : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<int>(
                name: "CurrentOdometer",
                table: "Cars",
                type: "int",
                nullable: false,
                defaultValue: 0);

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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.DropColumn(
                name: "CurrentOdometer",
                table: "Cars");

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
    }
}
