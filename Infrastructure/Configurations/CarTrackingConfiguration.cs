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
    public class CarTrackingConfiguration : IEntityTypeConfiguration<CarTracking>
    {
        public void Configure(EntityTypeBuilder<CarTracking> builder)
        {

            builder.HasKey(x => new { x.UserId, x.CarId});
        }
    }
}
