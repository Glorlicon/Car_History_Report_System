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
    public class CarOwnerHistoryConfiguration : IEntityTypeConfiguration<CarOwnerHistory>
    {
        public void Configure(EntityTypeBuilder<CarOwnerHistory> builder)
        {
            builder.Property(co => co.Name)
                .HasMaxLength(50)
                .IsRequired();
            builder.Property(co => co.Note)
                .HasMaxLength(200);
            builder.Property(co => co.PhoneNumber)
                .HasMaxLength(15);
            builder.Property(co => co.Address)
                .HasMaxLength(100);
        }
    }
}
