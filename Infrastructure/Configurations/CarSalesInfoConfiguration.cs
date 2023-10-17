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
    public class CarSalesInfoConfiguration : IEntityTypeConfiguration<CarSalesInfo>
    {
        public void Configure(EntityTypeBuilder<CarSalesInfo> builder)
        {
            builder.Property(x => x.Description)
                .HasMaxLength(2000)
                .IsRequired();
            builder.Property(x => x.Price)
                .HasPrecision(14, 2);
            builder.Property(x => x.Features)
                .HasConversion(
                    f => string.Join(";", f),
                    f => f.Split(";", StringSplitOptions.None).ToList()
                )
                .HasMaxLength(500);
        }
    }
}
