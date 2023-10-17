using Azure;
using Domain.Entities;
using Domain.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class CarConfiguration : IEntityTypeConfiguration<Car>
    {
        public void Configure(EntityTypeBuilder<Car> builder)
        {
            builder.Property(c => c.VinId)
                .HasMaxLength(18)
                .IsRequired();
            builder.Property(c => c.LicensePlateNumber)
                .HasMaxLength(20);
            builder.Property(c => c.EngineNumber)
                .HasMaxLength(20);
            builder.Property(c => c.CurrentOdometer)
                .HasDefaultValue(0);
            builder.Property(c => c.Color)
                .HasConversion(
                    co => co.ToString(),
                    co => (Color)Enum.Parse(typeof(Color), co));
        }
    }
}
