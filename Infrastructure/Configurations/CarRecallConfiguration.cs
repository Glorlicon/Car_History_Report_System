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
    public class CarRecallConfiguration : IEntityTypeConfiguration<CarRecall>
    {
        public void Configure(EntityTypeBuilder<CarRecall> builder)
        {
            builder.Property(x => x.Description)
                .HasMaxLength(2000)
                .IsRequired();
        }
    }
}
