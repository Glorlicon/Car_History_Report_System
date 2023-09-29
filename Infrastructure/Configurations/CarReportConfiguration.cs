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
    public class CarReportConfiguration : IEntityTypeConfiguration<CarReport>
    {
        public void Configure(EntityTypeBuilder<CarReport> builder)
        {
            builder.HasKey(x => new { x.UserId, x.CarId });
        }
    }
}
