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
    public class ModelOdometerConfiguration : IEntityTypeConfiguration<ModelMaintainance>
    {
        public void Configure(EntityTypeBuilder<ModelMaintainance> builder)
        {
            builder.HasKey(x => new { x.ModelId, x.MaintenancePart });
            builder.Property(x => x.MaintenancePart)
                .HasMaxLength(50);
        }
    }
}
