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
    public class CarImagesConfiguration : IEntityTypeConfiguration<CarImages>
    {
        public void Configure(EntityTypeBuilder<CarImages> builder)
        {
            builder.Property(x => x.ImageLink)
                .HasMaxLength(100);
        }
    }
}
