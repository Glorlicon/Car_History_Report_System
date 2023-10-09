using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class FixUserDataProviderRelationship : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_DataProviders_DataProviderId",
                table: "AspNetUsers");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "06a1568b-fa58-4ca4-abaa-da6461a99bb4");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "30754da5-1425-4785-a88d-836345695b3e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6a9c41e8-494e-4554-b803-1e39f7d136c5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c04a4684-65a2-4f39-a441-4f9770668285");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d0c7a943-b3cd-4b04-9100-a0724f6f7a9e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d4b858ba-3b4b-4d6c-973a-b65d26a58586");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d5e1f1c2-7a9a-47c9-86cf-9d4612087191");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f8dd8e38-abe7-4b48-ab34-c7281ffffb2b");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "28f8763f-ec21-442b-9ef5-caf777618c45", "0b67f0d7-865e-416f-bc41-531f4ce7d318", "CarDealer", "CARDEALER" },
                    { "61cb143f-f808-4fb9-89d8-9bd35e4fe764", "ef714cd1-b0be-48e0-ac4b-20342e7669fc", "PoliceOffice", "POLICEOFFICE" },
                    { "6ed79f12-4f08-4684-b0e5-3f11529193d1", "86db80a7-32d0-41aa-ad72-081e17110a2b", "Adminstrator", "ADMINSTRATOR" },
                    { "b7c4f887-a4a8-41ce-81dd-8ac4370cd9c0", "bc6ad6ba-9946-4292-9b44-109784d6d804", "ServiceShop", "SERVICESHOP" },
                    { "c2821c33-eab9-482f-8ee6-e5e5a12578cd", "23d52bb2-cb78-430d-9e99-dd14eb3c8aec", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "c9995cfb-af3c-4455-9bed-952e083bd072", "f1e47140-59e9-45c5-87af-8187f61fcbfa", "Manufacturer", "MANUFACTURER" },
                    { "e48855fd-d791-48fc-b2d2-7fff29de5a7f", "cfb70532-4de7-4da3-bac8-0bcb6ba4180a", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "ece3f1d7-debb-404a-a0e4-f724ba46722a", "9d8c97cb-2b42-4bf4-b658-c32f0a5b00e5", "User", "USER" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_DataProviders_DataProviderId",
                table: "AspNetUsers",
                column: "DataProviderId",
                principalTable: "DataProviders",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_DataProviders_DataProviderId",
                table: "AspNetUsers");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "28f8763f-ec21-442b-9ef5-caf777618c45");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "61cb143f-f808-4fb9-89d8-9bd35e4fe764");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6ed79f12-4f08-4684-b0e5-3f11529193d1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b7c4f887-a4a8-41ce-81dd-8ac4370cd9c0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c2821c33-eab9-482f-8ee6-e5e5a12578cd");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c9995cfb-af3c-4455-9bed-952e083bd072");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e48855fd-d791-48fc-b2d2-7fff29de5a7f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ece3f1d7-debb-404a-a0e4-f724ba46722a");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "06a1568b-fa58-4ca4-abaa-da6461a99bb4", "50482a1e-9480-40c4-bed5-d84fd1e386b0", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "30754da5-1425-4785-a88d-836345695b3e", "3fbe4ef8-8c41-40e5-9bb5-32f0da87656c", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "6a9c41e8-494e-4554-b803-1e39f7d136c5", "b806589b-8d14-4a33-a5a8-491abdf0972c", "CarDealer", "CARDEALER" },
                    { "c04a4684-65a2-4f39-a441-4f9770668285", "61bd0222-030d-4c94-99e7-b8a8d4daafb8", "ServiceShop", "SERVICESHOP" },
                    { "d0c7a943-b3cd-4b04-9100-a0724f6f7a9e", "6013f0f6-fc4b-4762-86c5-d0c0b9f15dde", "Adminstrator", "ADMINSTRATOR" },
                    { "d4b858ba-3b4b-4d6c-973a-b65d26a58586", "7df42156-1125-4a51-bc05-6e73e07b36ec", "PoliceOffice", "POLICEOFFICE" },
                    { "d5e1f1c2-7a9a-47c9-86cf-9d4612087191", "af704549-8803-4222-84fc-57d32dce0bc8", "User", "USER" },
                    { "f8dd8e38-abe7-4b48-ab34-c7281ffffb2b", "7e81eae2-06f7-4eb1-b98c-da5e7ae39564", "Manufacturer", "MANUFACTURER" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_DataProviders_DataProviderId",
                table: "AspNetUsers",
                column: "DataProviderId",
                principalTable: "DataProviders",
                principalColumn: "Id");
        }
    }
}
