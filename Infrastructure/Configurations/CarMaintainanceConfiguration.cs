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
    public class CarMaintainanceConfiguration : IEntityTypeConfiguration<CarMaintainance>
    {
        public void Configure(EntityTypeBuilder<CarMaintainance> builder)
        {
            builder.HasKey(cm => new { cm.UserId, cm.CarId });
        }
    }
}
