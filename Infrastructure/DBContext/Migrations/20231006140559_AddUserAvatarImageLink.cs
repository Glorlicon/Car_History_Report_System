using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class AddUserAvatarImageLink : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AddColumn<string>(
                name: "AvatarImageLink",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1795da06-6072-4348-8d07-3e5f9999fd60", "3dc27054-3778-435e-8b22-64c11f4b8fd9", "PoliceOffice", "POLICEOFFICE" },
                    { "2a472643-6ec2-44d1-ab99-42662d6cb139", "02a5abfa-91da-4c70-b288-00ed4dee5908", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "6e64362b-3328-4c65-9616-98439f36d812", "bcbc4d18-6938-4a55-910c-fad2ba2b6855", "ServiceShop", "SERVICESHOP" },
                    { "8a963c0f-3df2-4ca6-9b56-7bbf6906cb5f", "2f412988-4ec0-42c6-8a75-5ef203f5c502", "Manufacturer", "MANUFACTURER" },
                    { "8e9add7f-0ea2-4485-bfeb-901d76f858b0", "fd2ebe51-9f77-4dd9-8cbb-11146d435269", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "ae60c2dc-3268-4b9a-b02a-d60f717efd92", "dac447a2-840c-4f29-8642-a08cab72b6d9", "CarDealer", "CARDEALER" },
                    { "af8b2f91-eeeb-44fb-8b71-7e07e1252955", "a115a9ad-cba6-4073-a0c4-032b97c6730d", "User", "USER" },
                    { "e1ccb37e-1d30-4795-abcf-ae435dcf6909", "73967e10-a530-4dc3-ba21-62eef2d620d3", "Adminstrator", "ADMINSTRATOR" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1795da06-6072-4348-8d07-3e5f9999fd60");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2a472643-6ec2-44d1-ab99-42662d6cb139");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6e64362b-3328-4c65-9616-98439f36d812");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8a963c0f-3df2-4ca6-9b56-7bbf6906cb5f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8e9add7f-0ea2-4485-bfeb-901d76f858b0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ae60c2dc-3268-4b9a-b02a-d60f717efd92");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "af8b2f91-eeeb-44fb-8b71-7e07e1252955");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e1ccb37e-1d30-4795-abcf-ae435dcf6909");

            migrationBuilder.DropColumn(
                name: "AvatarImageLink",
                table: "AspNetUsers");

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
        }
    }
}
