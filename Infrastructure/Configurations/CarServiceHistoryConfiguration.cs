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
    public class CarServiceHistoryConfiguration : IEntityTypeConfiguration<CarServiceHistory>
    {
        public void Configure(EntityTypeBuilder<CarServiceHistory> builder)
        {
            builder.Property(co => co.Note)
                .HasMaxLength(200);
            builder.Property(co => co.OtherServices)
                .HasMaxLength(500)
                .IsRequired();
            builder.Property(x => x.Services)
                .IsRequired();
        }
    }
}
