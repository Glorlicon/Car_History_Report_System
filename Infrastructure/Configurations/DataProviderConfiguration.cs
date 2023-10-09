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
    public class DataProviderConfiguration : IEntityTypeConfiguration<DataProvider>
    {
        public void Configure(EntityTypeBuilder<DataProvider> builder)
        {
            builder.Property(co => co.Name)
                .HasMaxLength(50)
                .IsRequired();
            builder.Property(co => co.Description)
                .HasMaxLength(2000)
                .IsRequired();
            builder.Property(co => co.PhoneNumber)
                .HasMaxLength(15);
            builder.Property(co => co.Address)
                .HasMaxLength(100);
            builder.Property(co => co.WebsiteLink)
                .HasMaxLength(100);
            builder.Property(co => co.Service)
                .HasMaxLength(2000);
            builder.Property(co => co.Email)
                .HasMaxLength(100);
            builder.Property(x => x.Type)
                .HasConversion(
                    f => f.ToString(),
                    f => (DataProviderType)Enum.Parse(typeof(DataProviderType), f))
                .IsRequired();
        }
    }
}
