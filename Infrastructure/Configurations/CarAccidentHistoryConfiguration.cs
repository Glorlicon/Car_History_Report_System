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
    public class CarAccidentHistoryConfiguration : IEntityTypeConfiguration<CarAccidentHistory>
    {
        public void Configure(EntityTypeBuilder<CarAccidentHistory> builder)
        {
            builder.Property(ca => ca.Description)
                .HasMaxLength(2000);
            builder.Property(ca => ca.Location)
                .HasMaxLength(200);
            builder.Property(ca => ca.Note)
                .HasMaxLength(200);
        }
    }
}
