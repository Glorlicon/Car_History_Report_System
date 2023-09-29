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
    public class CarSpecificationConfiguration : IEntityTypeConfiguration<CarSpecification>
    {
        public void Configure(EntityTypeBuilder<CarSpecification> builder)
        {
            builder.Property(x => x.WheelFormula)
                .HasMaxLength(20);
            builder.Property(x => x.WheelTread)
                .HasMaxLength(20);
            builder.Property(x => x.Dimension)
                .HasMaxLength(20);
            builder.Property(x => x.WheelTread)
                .HasMaxLength(20);
            builder.Property(x => x.Country)
                .HasMaxLength(20)
                .IsRequired();
            builder.Property(x => x.FuelType)
                .HasConversion(
                    f => f.ToString(),
                    f => (FuelType)Enum.Parse(typeof(FuelType), f))
                .IsRequired();
            builder.Property(x => x.BodyType)
                .HasConversion(
                    f => f.ToString(),
                    f => (BodyType)Enum.Parse(typeof(BodyType), f))
                .IsRequired();
        }
    }
}
