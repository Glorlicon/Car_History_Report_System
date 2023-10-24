using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class Iteration3Update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ModelOdometers_RecommendActions_RecommendActionId",
                table: "ModelOdometers");

            migrationBuilder.DropForeignKey(
                name: "FK_Order_AspNetUsers_UserId",
                table: "Order");

            migrationBuilder.DropTable(
                name: "CarOdometersHistory");

            migrationBuilder.DropTable(
                name: "RecommendActions");

            migrationBuilder.DropIndex(
                name: "IX_ModelOdometers_RecommendActionId",
                table: "ModelOdometers");

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

            migrationBuilder.DropColumn(
                name: "Odometer",
                table: "ModelOdometers");

            migrationBuilder.DropColumn(
                name: "RecommendActionId",
                table: "ModelOdometers");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "CarServicesHistory");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "DiscountStart",
                table: "OrderOptions",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "DiscountEnd",
                table: "OrderOptions",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Order",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<int>(
                name: "OdometerPerMaintainance",
                table: "ModelOdometers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecommendAction",
                table: "ModelOdometers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "TimePerMaintainance",
                table: "ModelOdometers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Odometer",
                table: "CarStolenHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "ReportDate",
                table: "CarStolenHistory",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Odometer",
                table: "CarServicesHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtherServices",
                table: "CarServicesHistory",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateOnly>(
                name: "ReportDate",
                table: "CarServicesHistory",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Services",
                table: "CarServicesHistory",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Odometer",
                table: "CarOwnersHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "ReportDate",
                table: "CarOwnersHistory",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Odometer",
                table: "CarInsurances",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "ReportDate",
                table: "CarInsurances",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Odometer",
                table: "CarInspectionsHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "ReportDate",
                table: "CarInspectionsHistory",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Odometer",
                table: "CarAccidentsHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "ReportDate",
                table: "CarAccidentsHistory",
                type: "date",
                nullable: true);

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
                name: "FK_Order_AspNetUsers_UserId",
                table: "Order",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_AspNetUsers_UserId",
                table: "Order");

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

            migrationBuilder.DropColumn(
                name: "OdometerPerMaintainance",
                table: "ModelOdometers");

            migrationBuilder.DropColumn(
                name: "RecommendAction",
                table: "ModelOdometers");

            migrationBuilder.DropColumn(
                name: "TimePerMaintainance",
                table: "ModelOdometers");

            migrationBuilder.DropColumn(
                name: "Odometer",
                table: "CarStolenHistory");

            migrationBuilder.DropColumn(
                name: "ReportDate",
                table: "CarStolenHistory");

            migrationBuilder.DropColumn(
                name: "Odometer",
                table: "CarServicesHistory");

            migrationBuilder.DropColumn(
                name: "OtherServices",
                table: "CarServicesHistory");

            migrationBuilder.DropColumn(
                name: "ReportDate",
                table: "CarServicesHistory");

            migrationBuilder.DropColumn(
                name: "Services",
                table: "CarServicesHistory");

            migrationBuilder.DropColumn(
                name: "Odometer",
                table: "CarOwnersHistory");

            migrationBuilder.DropColumn(
                name: "ReportDate",
                table: "CarOwnersHistory");

            migrationBuilder.DropColumn(
                name: "Odometer",
                table: "CarInsurances");

            migrationBuilder.DropColumn(
                name: "ReportDate",
                table: "CarInsurances");

            migrationBuilder.DropColumn(
                name: "Odometer",
                table: "CarInspectionsHistory");

            migrationBuilder.DropColumn(
                name: "ReportDate",
                table: "CarInspectionsHistory");

            migrationBuilder.DropColumn(
                name: "Odometer",
                table: "CarAccidentsHistory");

            migrationBuilder.DropColumn(
                name: "ReportDate",
                table: "CarAccidentsHistory");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "DiscountStart",
                table: "OrderOptions",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "DiscountEnd",
                table: "OrderOptions",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Order",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Odometer",
                table: "ModelOdometers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RecommendActionId",
                table: "ModelOdometers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "CarServicesHistory",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "CarOdometersHistory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CarId = table.Column<string>(type: "nvarchar(18)", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ModifiedByUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    OdometerValue = table.Column<int>(type: "int", nullable: false),
                    ReportDate = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarOdometersHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CarOdometersHistory_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CarOdometersHistory_AspNetUsers_ModifiedByUserId",
                        column: x => x.ModifiedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CarOdometersHistory_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "VinId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecommendActions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecommendActions", x => x.Id);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_ModelOdometers_RecommendActionId",
                table: "ModelOdometers",
                column: "RecommendActionId");

            migrationBuilder.CreateIndex(
                name: "IX_CarOdometersHistory_CarId",
                table: "CarOdometersHistory",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_CarOdometersHistory_CreatedByUserId",
                table: "CarOdometersHistory",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CarOdometersHistory_ModifiedByUserId",
                table: "CarOdometersHistory",
                column: "ModifiedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ModelOdometers_RecommendActions_RecommendActionId",
                table: "ModelOdometers",
                column: "RecommendActionId",
                principalTable: "RecommendActions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_AspNetUsers_UserId",
                table: "Order",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
