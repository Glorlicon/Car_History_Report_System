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
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(x => x.FirstName)
                .HasMaxLength(30)
                .IsRequired();
            builder.Property(x => x.LastName)
                .HasMaxLength(30)
                .IsRequired();
            builder.Property(x => x.Address)
                .HasMaxLength(100);
            builder.Property(x => x.MaxReportNumber)
                .HasDefaultValue(0);
        }
    }
}
