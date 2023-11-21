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
    public class CarRegistrationHistoryConfiguration : IEntityTypeConfiguration<CarRegistrationHistory>
    {
        public void Configure(EntityTypeBuilder<CarRegistrationHistory> builder)
        {
            builder.Property(ca => ca.OwnerName)
                .HasMaxLength(50)
                .IsRequired();
            builder.Property(ca => ca.Note)
                .HasMaxLength(200);
            builder.Property(x => x.RegistrationNumber)
                .HasMaxLength(50);
            builder.HasIndex(x => x.RegistrationNumber)
                .IsUnique();
            builder.Property(x => x.LicensePlateNumber)
                .HasMaxLength(50)
                .IsRequired();
        }
    }
}
