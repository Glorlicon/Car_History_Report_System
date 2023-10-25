using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class FixTableName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ModelOdometers_CarSpecification_ModelId",
                table: "ModelOdometers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ModelOdometers",
                table: "ModelOdometers");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0610fa57-81da-4d2d-9eee-bc273b4f13c2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "13867b22-820a-4bd3-ae25-b9453d008e5d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2eb600f6-eb68-4789-a650-9717d4442a62");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3ddc7cc2-6f72-4bb9-b9ed-d991e782f02c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4b781fd6-a157-4964-ab40-fcf9370a1153");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "73f89466-8b98-4dde-9bd1-6d51119b4a9a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a6e14e89-198a-4514-a93a-ecc5decf89cc");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cd68f2fc-4035-4bc4-be41-f8dc9f268ee4");

            migrationBuilder.RenameTable(
                name: "ModelOdometers",
                newName: "ModelMaintainances");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ModelMaintainances",
                table: "ModelMaintainances",
                columns: new[] { "ModelId", "MaintenancePart" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "06b68dee-89d8-4585-b2a1-4654919e01c9", "09a0c495-3f23-4def-8234-9412cf665dca", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "53a39e52-b13d-442e-9f09-4cea0d05eb9b", "3f8c5125-6ed9-427a-ae45-9d242700eab2", "PoliceOffice", "POLICEOFFICE" },
                    { "6a926ae8-43a4-4db7-a866-d67d278a0db7", "c9cd8c47-f39b-415b-9fc4-a8b15f9979f8", "Manufacturer", "MANUFACTURER" },
                    { "70aafdaa-8257-4a07-a13b-64be24b83481", "a2ec23f4-2c6d-46ef-9bbf-e981f5ebb517", "ServiceShop", "SERVICESHOP" },
                    { "92790515-368e-4e9c-94d5-96e709ef9b0d", "fc01ea83-7719-4d32-89c6-42d8f2257783", "Adminstrator", "ADMINSTRATOR" },
                    { "b76855c1-bf52-4755-bae6-f79411934673", "1d95e16d-b27d-43c4-8b99-ad65e0cbe3d9", "CarDealer", "CARDEALER" },
                    { "cab88091-5e25-4c42-961d-d700628431db", "eb440afa-9b22-4331-b8d6-91e61f112eaf", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "ee228b23-df24-42dc-89f7-7d38e6f89354", "5d6d66af-4c57-4d8f-b429-84f5d5985a6d", "User", "USER" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_ModelMaintainances_CarSpecification_ModelId",
                table: "ModelMaintainances",
                column: "ModelId",
                principalTable: "CarSpecification",
                principalColumn: "ModelID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ModelMaintainances_CarSpecification_ModelId",
                table: "ModelMaintainances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ModelMaintainances",
                table: "ModelMaintainances");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "06b68dee-89d8-4585-b2a1-4654919e01c9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "53a39e52-b13d-442e-9f09-4cea0d05eb9b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6a926ae8-43a4-4db7-a866-d67d278a0db7");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "70aafdaa-8257-4a07-a13b-64be24b83481");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "92790515-368e-4e9c-94d5-96e709ef9b0d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b76855c1-bf52-4755-bae6-f79411934673");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cab88091-5e25-4c42-961d-d700628431db");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ee228b23-df24-42dc-89f7-7d38e6f89354");

            migrationBuilder.RenameTable(
                name: "ModelMaintainances",
                newName: "ModelOdometers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ModelOdometers",
                table: "ModelOdometers",
                columns: new[] { "ModelId", "MaintenancePart" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0610fa57-81da-4d2d-9eee-bc273b4f13c2", "fa275df8-d810-43b1-862b-69c80c6d386f", "CarDealer", "CARDEALER" },
                    { "13867b22-820a-4bd3-ae25-b9453d008e5d", "f6e26c69-1c88-4b3d-ad74-0431c4c47fc8", "Adminstrator", "ADMINSTRATOR" },
                    { "2eb600f6-eb68-4789-a650-9717d4442a62", "ac1326a7-e5e9-44fa-884d-000d73fdc83c", "PoliceOffice", "POLICEOFFICE" },
                    { "3ddc7cc2-6f72-4bb9-b9ed-d991e782f02c", "7a93ba68-4ce2-40d0-99e4-5a98211c61fc", "Manufacturer", "MANUFACTURER" },
                    { "4b781fd6-a157-4964-ab40-fcf9370a1153", "03752983-8aef-447c-a4e1-06b59f8c278d", "User", "USER" },
                    { "73f89466-8b98-4dde-9bd1-6d51119b4a9a", "bdc820cf-317e-45ac-be93-ebb989c6bc3f", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "a6e14e89-198a-4514-a93a-ecc5decf89cc", "002564a4-115e-4d9b-89e2-771283bd1e74", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "cd68f2fc-4035-4bc4-be41-f8dc9f268ee4", "673e2264-7fc3-4062-af65-2dc1ffa78e1c", "ServiceShop", "SERVICESHOP" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_ModelOdometers_CarSpecification_ModelId",
                table: "ModelOdometers",
                column: "ModelId",
                principalTable: "CarSpecification",
                principalColumn: "ModelID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
