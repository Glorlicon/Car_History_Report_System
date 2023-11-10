using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class FixWrongTypeNotificationTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Cars_RelatedCarVinId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_RelatedCarVinId",
                table: "Notifications");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1685863b-c978-400b-b619-5089b0332af7");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "84324ded-5b19-4c29-8649-a795981a1bcf");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8b882f42-3414-4124-ab73-dcd6661b6eae");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "919cf312-4c27-437c-9b1c-9b1327321661");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cdfcd527-5e51-4be8-8fea-297b5e71cbc5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dbc256b9-bad0-409e-8dcd-4d7c1a4d2436");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e7e42b0b-95c3-457d-8bd6-edf77abdb8cc");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e8960cfc-7a6c-4488-ab04-46ceae27dd31");

            migrationBuilder.DropColumn(
                name: "RelatedCarVinId",
                table: "Notifications");

            migrationBuilder.AlterColumn<string>(
                name: "RelatedCarId",
                table: "Notifications",
                type: "nvarchar(18)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedByUserId",
                table: "Notifications",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModified",
                table: "Notifications",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ModifiedByUserId",
                table: "Notifications",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "30a501a8-d295-48c7-b3d1-56ad91cb85b2", "ff522cd7-9286-4fc2-a4f3-2610bf012d98", "CarDealer", "CARDEALER" },
                    { "4ccfabb2-98c7-4d61-815f-2820696d0208", "19527132-a7aa-4f0d-b13e-606ba016b01f", "User", "USER" },
                    { "64d48ece-479e-49ff-9a96-26f989930a9e", "e478f6db-61e7-4a5e-bdd7-dd2cf27edd31", "Adminstrator", "ADMINSTRATOR" },
                    { "775dcc45-d069-466a-910f-ffa376bf76af", "91f943ac-4e03-44bb-944a-84814b51bd34", "Manufacturer", "MANUFACTURER" },
                    { "c182e624-f565-4935-9fe7-fac65f756083", "89c25d4b-9f71-47b2-a37f-4d29a5e5088e", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "c8016df2-1b21-4bb0-9995-1413d894f63d", "d26a4188-bd9e-4967-aa94-ef86a31d355d", "ServiceShop", "SERVICESHOP" },
                    { "cbaccad7-c8a9-40a8-a1f9-ba32c418763f", "a00b76b3-f706-43ac-8557-7dc4168ede59", "PoliceOffice", "POLICEOFFICE" },
                    { "f8b97982-e635-42d3-ba5f-17d318f18fc4", "f3f8bdfa-f867-46c9-b232-4746c5689249", "InsuranceCompany", "INSURANCECOMPANY" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_CreatedByUserId",
                table: "Notifications",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ModifiedByUserId",
                table: "Notifications",
                column: "ModifiedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_RelatedCarId",
                table: "Notifications",
                column: "RelatedCarId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_CreatedByUserId",
                table: "Notifications",
                column: "CreatedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_ModifiedByUserId",
                table: "Notifications",
                column: "ModifiedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Cars_RelatedCarId",
                table: "Notifications",
                column: "RelatedCarId",
                principalTable: "Cars",
                principalColumn: "VinId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_CreatedByUserId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_ModifiedByUserId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Cars_RelatedCarId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_CreatedByUserId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_ModifiedByUserId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_RelatedCarId",
                table: "Notifications");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "30a501a8-d295-48c7-b3d1-56ad91cb85b2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4ccfabb2-98c7-4d61-815f-2820696d0208");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "64d48ece-479e-49ff-9a96-26f989930a9e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "775dcc45-d069-466a-910f-ffa376bf76af");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c182e624-f565-4935-9fe7-fac65f756083");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c8016df2-1b21-4bb0-9995-1413d894f63d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cbaccad7-c8a9-40a8-a1f9-ba32c418763f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f8b97982-e635-42d3-ba5f-17d318f18fc4");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "LastModified",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "ModifiedByUserId",
                table: "Notifications");

            migrationBuilder.AlterColumn<int>(
                name: "RelatedCarId",
                table: "Notifications",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(18)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RelatedCarVinId",
                table: "Notifications",
                type: "nvarchar(18)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1685863b-c978-400b-b619-5089b0332af7", "1c27a20d-a0cd-4860-85f9-9f53b8ad1a77", "PoliceOffice", "POLICEOFFICE" },
                    { "84324ded-5b19-4c29-8649-a795981a1bcf", "b9466846-afa6-4b11-9d6e-9fd7344cc4f9", "Adminstrator", "ADMINSTRATOR" },
                    { "8b882f42-3414-4124-ab73-dcd6661b6eae", "b519539f-8c2e-4d52-bded-41021eee6d57", "ServiceShop", "SERVICESHOP" },
                    { "919cf312-4c27-437c-9b1c-9b1327321661", "00de0685-c0dd-40c7-b0ad-d491b3722f8c", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "cdfcd527-5e51-4be8-8fea-297b5e71cbc5", "07e3b131-c245-45a4-84b7-6d5a03f3aa40", "User", "USER" },
                    { "dbc256b9-bad0-409e-8dcd-4d7c1a4d2436", "f920c8d3-c5f0-44d7-a9ff-1cd541b57b7b", "CarDealer", "CARDEALER" },
                    { "e7e42b0b-95c3-457d-8bd6-edf77abdb8cc", "ae3d9b72-e769-4730-aed9-bbb1df851c04", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "e8960cfc-7a6c-4488-ab04-46ceae27dd31", "ab035747-f611-473a-87c6-e36b49878efb", "Manufacturer", "MANUFACTURER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_RelatedCarVinId",
                table: "Notifications",
                column: "RelatedCarVinId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Cars_RelatedCarVinId",
                table: "Notifications",
                column: "RelatedCarVinId",
                principalTable: "Cars",
                principalColumn: "VinId");
        }
    }
}
