using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class FixOrderTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "PurchaseDate",
                table: "Order");

            migrationBuilder.AddColumn<string>(
                name: "TransactionId",
                table: "Order",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

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

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "TransactionId",
                table: "Order");

            migrationBuilder.AddColumn<DateOnly>(
                name: "PurchaseDate",
                table: "Order",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

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
    }
}
