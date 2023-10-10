using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class WorkingTimeConfiguration : IEntityTypeConfiguration<WorkingTime>
    {
        public void Configure(EntityTypeBuilder<WorkingTime> builder)
        {
            builder.Property(x => x.StartTime)
                .HasConversion(
                    f => f.ToString(),
                    f => TimeOnly.Parse(f));
            builder.Property(x => x.EndTime)
                .HasConversion(
                    f => f.ToString(),
                    f => TimeOnly.Parse(f));
        }
    }
}
