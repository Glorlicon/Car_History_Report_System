using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Common;
using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Infrastructure.DBContext
{
    public class ApplicationDBContext : IdentityDbContext<User>
    {
        private readonly ICurrentUserServices _currentUserServices;

        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options
                                    , ICurrentUserServices currentUserServices) : base(options)
        {
            _currentUserServices = currentUserServices;
        }

        #region DbSet
        public DbSet<Car> Cars { get; set; }
        public DbSet<CarAccidentHistory> CarAccidentsHistory { get; set;}
        public DbSet<CarInspectionHistory> CarInspectionsHistory { get; set;}
        public DbSet<CarInspectionHistoryDetail> CarInspectionHistoryDetails { get;set; }
        public DbSet<CarInsurance> CarInsurances { get; set; }
        //public DbSet<CarOdometerHistory> CarOdometersHistory { get;set; }
        public DbSet<CarOwnerHistory> CarOwnersHistory { get; set;}
        public DbSet<CarServiceHistory> CarServicesHistory { get; set; }
        public DbSet<CarStolenHistory> CarStolenHistory { get; set; }
        public DbSet<CarPart> CarParts { get; set;}
        public DbSet<CarMaintainance> CarMaintainances { get;set; }
        public DbSet<CarRecall> CarRecalls { get; set; }
        public DbSet<CarRecallStatus> CarRecallStatus { get; set; }
        public DbSet<CarSalesInfo> CarSalesInfo { get; set; }
        //public DbSet<CarSalesFeature> CarSalesFeature { get; set; }
        public DbSet<CarReport> CarReports { get; set; }
        public DbSet<CarSpecification> CarSpecification { get; set; }
        public DbSet<DataProvider> DataProviders { get; set; }

        public DbSet<ModelMaintainance> ModelOdometers { get; set; }
        //public DbSet<RecommendAction> RecommendActions { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderOption> OrderOptions { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Request> Requests { get; set; }

        public DbSet<WorkingTime> WorkingTimes { get; set; }

        public DbSet<CarImages> CarImages { get; set; }
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
                        entry.Entity.CreatedByUserId = _currentUserServices.GetCurrentUserId();
                        break;

                    case EntityState.Modified:
                        entry.Entity.LastModified = DateTime.Now;
                        entry.Entity.ModifiedByUserId = _currentUserServices.GetCurrentUserId();
                        break;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
