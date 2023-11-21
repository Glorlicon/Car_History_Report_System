using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class ChangeNameCarStolenHistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1ee0cdcb-7c7c-413c-bc19-735acb3cb5c1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "24c86787-fdc9-47fb-9048-3c163d5549da");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "526cb946-1a45-4401-9a43-9c52bb1622a4");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "707061f4-9f5a-4a80-81b0-aa8f7416c1ae");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bbde687d-7329-40da-b280-b616a10817b0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cf85e993-ab7e-4346-9997-4e77af9c558a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d4a04e9c-0733-4157-a9d7-3d5119d02404");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dc4bd41a-8c5b-4f0e-8372-064d6f4799a0");

            migrationBuilder.RenameColumn(
                name: "Descripton",
                table: "CarStolenHistory",
                newName: "Description");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "13157624-1b78-48ee-9846-ca9fe7aec09d", "f9611e17-2df9-4860-8486-6b94c679ee49", "ServiceShop", "SERVICESHOP" },
                    { "1eabfe02-a13c-4d4f-ba33-2341e5a8f2d9", "084149db-044a-46bb-8cf8-d79e19edf3a1", "User", "USER" },
                    { "24aa2e63-058d-4642-904d-0248c03bff14", "1cba4d63-eee4-41e4-a5a3-e8b46d75d58f", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "400caef9-6771-4558-bd8d-1106c7d91fb6", "c0e17b50-d324-4a87-bfe9-3d0f927c0738", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "9db98916-ad21-4519-8938-a94e6a764736", "4a4609b8-fcfa-4771-a798-bf03746ac04d", "CarDealer", "CARDEALER" },
                    { "c37c9a17-8d92-40bf-90fd-24e863a3557c", "c37d594a-7a01-4440-a783-f0f2bb3708ec", "PoliceOffice", "POLICEOFFICE" },
                    { "e1181037-bc70-430c-b1c2-a7b702aae12a", "be25ce9f-6c6d-468a-8690-80db49047bc1", "Adminstrator", "ADMINSTRATOR" },
                    { "e5f28176-46de-4797-bfc5-1b1354c36dbd", "cf6c62b0-ac17-4e0d-b617-c9a4d54d06c0", "Manufacturer", "MANUFACTURER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "13157624-1b78-48ee-9846-ca9fe7aec09d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1eabfe02-a13c-4d4f-ba33-2341e5a8f2d9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "24aa2e63-058d-4642-904d-0248c03bff14");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "400caef9-6771-4558-bd8d-1106c7d91fb6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9db98916-ad21-4519-8938-a94e6a764736");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c37c9a17-8d92-40bf-90fd-24e863a3557c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e1181037-bc70-430c-b1c2-a7b702aae12a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e5f28176-46de-4797-bfc5-1b1354c36dbd");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "CarStolenHistory",
                newName: "Descripton");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1ee0cdcb-7c7c-413c-bc19-735acb3cb5c1", "4e9556bb-8b8e-44ce-8362-c891aa7df0ee", "PoliceOffice", "POLICEOFFICE" },
                    { "24c86787-fdc9-47fb-9048-3c163d5549da", "1def478f-a66e-474b-86ab-21de2ec67bac", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "526cb946-1a45-4401-9a43-9c52bb1622a4", "65b977df-58d9-4670-982c-1b60a6f71a2e", "ServiceShop", "SERVICESHOP" },
                    { "707061f4-9f5a-4a80-81b0-aa8f7416c1ae", "09a565e3-8a82-4773-9718-b979536177e6", "User", "USER" },
                    { "bbde687d-7329-40da-b280-b616a10817b0", "c0c0a924-2d5e-4ec6-901e-6c5b07340c0c", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "cf85e993-ab7e-4346-9997-4e77af9c558a", "bf7e110b-2c64-407c-9fe3-f6d2c0f00899", "Manufacturer", "MANUFACTURER" },
                    { "d4a04e9c-0733-4157-a9d7-3d5119d02404", "ff4cc300-62f0-4d29-8421-e68bc995ae04", "Adminstrator", "ADMINSTRATOR" },
                    { "dc4bd41a-8c5b-4f0e-8372-064d6f4799a0", "288516b5-8bb2-4050-a6a7-b1f79108f754", "CarDealer", "CARDEALER" }
                });
        }
    }
}
