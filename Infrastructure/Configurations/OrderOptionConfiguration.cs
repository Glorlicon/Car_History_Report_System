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
    public class OrderOptionConfiguration : IEntityTypeConfiguration<OrderOption>
    {
        public void Configure(EntityTypeBuilder<OrderOption> builder)
        {
            builder.Property(co => co.Name)
                .HasMaxLength(50)
                .IsRequired();
            builder.Property(co => co.Description)
                .HasMaxLength(2000)
                .IsRequired();
            builder.Property(x => x.Price)
                .HasPrecision(14,2);
            builder.Property(x => x.Discount)
                .HasPrecision(14,2);
            builder.Property(x => x.TotalAmount)
                .HasPrecision(14,2);
        }
    }
}
