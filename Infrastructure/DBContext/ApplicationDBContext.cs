using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DBContext
{
    public class ApplicationDBContext : IdentityDbContext<User>
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options): base(options)
        {

        }

        #region DbSet
        public DbSet<Car> Cars { get; set; }
        public DbSet<CarAccidentHistory> CarAccidentsHistory { get; set;}
        public DbSet<CarInspectionHistory> CarInspectionsHistory { get; set;}
        public DbSet<CarInspectionHistoryDetail> CarInspectionHistoryDetails { get;set; }
        public DbSet<CarInsurance> CarInsurances { get; set; }
        public DbSet<CarOdometerHistory> CarOdometersHistory { get;set; }
        public DbSet<CarOwnerHistory> CarOwnersHistory { get; set;}
        public DbSet<CarServiceHistory> CarServicesHistory { get; set; }
        public DbSet<CarStolenHistory> CarStolenHistory { get; set; }
        public DbSet<CarPart> CarParts { get; set;}
        public DbSet<CarMaintainance> CarMaintainances { get;set; }
        public DbSet<CarRecall> CarRecalls { get; set; }
        public DbSet<CarRecallStatus> CarRecallStatus { get; set; }
        public DbSet<CarSalesInfo> CarSalesInfo { get; set; }
        public DbSet<CarSalesFeature> CarSalesFeature { get; set; }
        public DbSet<CarReport> CarReports { get; set; }
        public DbSet<CarSpecification> CarSpecification { get; set; }
        public DbSet<DataProvider> DataProviders { get; set; }

        public DbSet<ModelOdometer> ModelOdometers { get; set; }
        public DbSet<RecommendAction> RecommendActions { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderOption> OrderOptions { get; set; }
        public DbSet<Review> Reviews { get; set; }
        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<BaseAuditableEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedTime = DateTime.Now;
                        break;

                    case EntityState.Modified:
                        entry.Entity.LastModified = DateTime.Now;
                        break;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
