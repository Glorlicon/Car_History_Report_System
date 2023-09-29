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
    public class CarInspectionHistoryDetailConfiguration : IEntityTypeConfiguration<CarInspectionHistoryDetail>
    {
        public void Configure(EntityTypeBuilder<CarInspectionHistoryDetail> builder)
        {
            builder.Property(ca => ca.InspectionPart)
                .HasMaxLength(50)
                .IsRequired();
            builder.Property(ca => ca.Note)
                .HasMaxLength(200);
        }
    }
}
