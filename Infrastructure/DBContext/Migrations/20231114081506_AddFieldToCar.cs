using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class AddFieldToCar : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AddColumn<int>(
                name: "CurrentDataProviderId",
                table: "Cars",
                type: "int",
                nullable: true);

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

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "CurrentDataProviderId",
                table: "Cars");

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
        }
    }
}
