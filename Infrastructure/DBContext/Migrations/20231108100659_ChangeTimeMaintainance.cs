using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class ChangeTimeMaintainance : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "165e50a7-8878-408a-9724-53f7251dab61");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1aff259f-dfce-4c38-bd60-e638f106c49a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2eba274c-d024-460e-957c-86787499cb25");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "55929adc-178f-45ec-a847-5224e31b35dd");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5b4d6264-01fa-4bbc-a486-2a6b51367f61");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "66d37672-92b5-44f7-ad78-cdde7d4ded06");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ce8c7de5-eaeb-43e6-a8e8-c2775498641e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ea0fc5b9-7a05-44bb-afd9-149b5278af20");

            migrationBuilder.DropColumn(
                name: "TimePerMaintainance",
                table: "ModelMaintainances");

            migrationBuilder.AddColumn<int>(
                name: "DayPerMaintainance",
                table: "ModelMaintainances",
                type: "int",
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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                name: "DayPerMaintainance",
                table: "ModelMaintainances");

            migrationBuilder.AddColumn<DateTime>(
                name: "TimePerMaintainance",
                table: "ModelMaintainances",
                type: "datetime2",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "165e50a7-8878-408a-9724-53f7251dab61", "f8c9fb5d-bf24-4f51-a8e6-b77256092377", "PoliceOffice", "POLICEOFFICE" },
                    { "1aff259f-dfce-4c38-bd60-e638f106c49a", "710091e1-5ebe-462e-a4c5-acb7b038897b", "User", "USER" },
                    { "2eba274c-d024-460e-957c-86787499cb25", "37c695fc-e0d5-4c26-aee9-b036fd55cd38", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "55929adc-178f-45ec-a847-5224e31b35dd", "8596a1c5-546b-4242-84db-fc8c2e900d1c", "Adminstrator", "ADMINSTRATOR" },
                    { "5b4d6264-01fa-4bbc-a486-2a6b51367f61", "567d7cb9-5b19-4d8c-9a01-15d145c3cb88", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "66d37672-92b5-44f7-ad78-cdde7d4ded06", "b76b8044-4bed-41b8-897b-ed2cc5d0d3fd", "ServiceShop", "SERVICESHOP" },
                    { "ce8c7de5-eaeb-43e6-a8e8-c2775498641e", "cfb050ea-a3a5-4c72-9d94-4ea9e753e96c", "CarDealer", "CARDEALER" },
                    { "ea0fc5b9-7a05-44bb-afd9-149b5278af20", "41a71b6d-70fd-41da-aba7-3c81724c35c8", "Manufacturer", "MANUFACTURER" }
                });
        }
    }
}
