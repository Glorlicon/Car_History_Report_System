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
    public class CarPartConfiguration : IEntityTypeConfiguration<CarPart>
    {
        public void Configure(EntityTypeBuilder<CarPart> builder)
        {
            builder.Property(co => co.Name)
                .HasMaxLength(50)
                .IsRequired();
            builder.Property(co => co.Description)
                .HasMaxLength(2000);
        }
    }
}
