using Domain.Entities;
using Domain.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class CarStolenHistoryConfiguration : IEntityTypeConfiguration<CarStolenHistory>
    {
        public void Configure(EntityTypeBuilder<CarStolenHistory> builder)
        {
            builder.Property(co => co.Description)
                .HasMaxLength(2000);
            builder.Property(co => co.Note)
                .HasMaxLength(200);
            builder.Property(x => x.Status)
                .HasConversion(
                    f => f.ToString(),
                    f => (CarStolenStatus)Enum.Parse(typeof(CarStolenStatus), f))
                .IsRequired();
        }
    }
}
