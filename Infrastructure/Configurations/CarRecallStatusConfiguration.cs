using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class CarRecallStatusConfiguration : IEntityTypeConfiguration<CarRecallStatus>
    {
        public void Configure(EntityTypeBuilder<CarRecallStatus> builder)
        {
            builder.HasKey(x => new { x.CarId, x.CarRecallId });

            builder.HasOne(e => e.Car)
                        .WithMany(e => e.CarRecallStatuses)
                        .HasForeignKey(e => e.CarId)
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

            builder.HasOne(e => e.CarRecall)
                .WithMany(e => e.CarRecallStatuses)
                .HasForeignKey(e => e.CarRecallId)
                .OnDelete(DeleteBehavior.NoAction)
                .IsRequired();
        }
    }
}
