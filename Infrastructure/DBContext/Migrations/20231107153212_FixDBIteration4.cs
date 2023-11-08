using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DBContext.Migrations
{
    public partial class FixDBIteration4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CarReports",
                table: "CarReports");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "005ebeff-d999-43e3-bf35-d2b21bd42122");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0706e9d8-8643-4ee0-9876-22ea1010ea3f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "13c87c57-785c-4fa7-857f-820f67e3b83f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "81918f67-2b07-46ce-8866-7698a61674f3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9a606d26-4d4f-4ea5-9580-ce8c019eb7b1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9a8d9aa5-17cb-481d-8cb1-0dc573997811");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d1390089-00d5-40ca-8fb0-ab64753d57b6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e8add7ed-5e9c-48cc-bff7-9fe662a05e9d");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "CarStolenHistory");

            migrationBuilder.DropColumn(
                name: "ReportedDate",
                table: "CarStolenHistory");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "CarStolenHistory");

            migrationBuilder.DropColumn(
                name: "CreatedTime",
                table: "CarReports");

            migrationBuilder.DropColumn(
                name: "HistoryId",
                table: "CarInspectionHistoryDetails");

            migrationBuilder.RenameColumn(
                name: "InspectionPart",
                table: "CarInspectionHistoryDetails",
                newName: "InspectionCategory");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Notifications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "CarStolenHistory",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateOnly>(
                name: "CreatedDate",
                table: "CarReports",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "InsuranceNumber",
                table: "CarInsurances",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InspectionNumber",
                table: "CarInspectionsHistory",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CarReports",
                table: "CarReports",
                columns: new[] { "UserId", "CarId", "CreatedDate" });

            migrationBuilder.CreateTable(
                name: "CarTrackings",
                columns: table => new
                {
                    CarId = table.Column<string>(type: "nvarchar(18)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IsFollowing = table.Column<bool>(type: "bit", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarTrackings", x => new { x.UserId, x.CarId });
                    table.ForeignKey(
                        name: "FK_CarTrackings_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CarTrackings_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "VinId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserNotification",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NotificationId = table.Column<int>(type: "int", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserNotification", x => new { x.UserId, x.NotificationId });
                    table.ForeignKey(
                        name: "FK_UserNotification_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserNotification_Notifications_NotificationId",
                        column: x => x.NotificationId,
                        principalTable: "Notifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_Order_TransactionId",
                table: "Order",
                column: "TransactionId",
                unique: true,
                filter: "[TransactionId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CarInsurances_InsuranceNumber",
                table: "CarInsurances",
                column: "InsuranceNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CarInspectionsHistory_InspectionNumber",
                table: "CarInspectionsHistory",
                column: "InspectionNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CarTrackings_CarId",
                table: "CarTrackings",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_UserNotification_NotificationId",
                table: "UserNotification",
                column: "NotificationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CarTrackings");

            migrationBuilder.DropTable(
                name: "UserNotification");

            migrationBuilder.DropIndex(
                name: "IX_Order_TransactionId",
                table: "Order");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CarReports",
                table: "CarReports");

            migrationBuilder.DropIndex(
                name: "IX_CarInsurances_InsuranceNumber",
                table: "CarInsurances");

            migrationBuilder.DropIndex(
                name: "IX_CarInspectionsHistory_InspectionNumber",
                table: "CarInspectionsHistory");

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
                name: "Type",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "CarStolenHistory");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "CarReports");

            migrationBuilder.DropColumn(
                name: "InsuranceNumber",
                table: "CarInsurances");

            migrationBuilder.DropColumn(
                name: "InspectionNumber",
                table: "CarInspectionsHistory");

            migrationBuilder.RenameColumn(
                name: "InspectionCategory",
                table: "CarInspectionHistoryDetails",
                newName: "InspectionPart");

            migrationBuilder.AddColumn<DateOnly>(
                name: "EndDate",
                table: "CarStolenHistory",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReportedDate",
                table: "CarStolenHistory",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateOnly>(
                name: "StartDate",
                table: "CarStolenHistory",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedTime",
                table: "CarReports",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "HistoryId",
                table: "CarInspectionHistoryDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CarReports",
                table: "CarReports",
                columns: new[] { "UserId", "CarId" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "005ebeff-d999-43e3-bf35-d2b21bd42122", "53628af0-8d71-4361-837f-e492fffed951", "Adminstrator", "ADMINSTRATOR" },
                    { "0706e9d8-8643-4ee0-9876-22ea1010ea3f", "5baf6d37-2a2b-41a1-8608-4685ea146e16", "ServiceShop", "SERVICESHOP" },
                    { "13c87c57-785c-4fa7-857f-820f67e3b83f", "b4fac866-99c9-4a2b-8864-edac218ce220", "InsuranceCompany", "INSURANCECOMPANY" },
                    { "81918f67-2b07-46ce-8866-7698a61674f3", "2893f680-0240-4203-a47d-5506ef3efb0d", "Manufacturer", "MANUFACTURER" },
                    { "9a606d26-4d4f-4ea5-9580-ce8c019eb7b1", "6ad41f64-a058-499b-ac4b-95e63c0c79d2", "CarDealer", "CARDEALER" },
                    { "9a8d9aa5-17cb-481d-8cb1-0dc573997811", "24127fc5-48da-4d77-999b-fd3c47d5ca5e", "VehicleRegistry", "VEHICLEREGISTRY" },
                    { "d1390089-00d5-40ca-8fb0-ab64753d57b6", "39005275-d5a2-4f36-a053-b873f00d4c15", "PoliceOffice", "POLICEOFFICE" },
                    { "e8add7ed-5e9c-48cc-bff7-9fe662a05e9d", "b57fa0a9-73b4-4db7-92b8-fb7c76f26a66", "User", "USER" }
                });
        }
    }
}
