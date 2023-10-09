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
    public class CarStolenHistoryConfiguration : IEntityTypeConfiguration<CarStolenHistory>
    {
        public void Configure(EntityTypeBuilder<CarStolenHistory> builder)
        {
            builder.Property(co => co.Descripton)
                .HasMaxLength(2000);
            builder.Property(co => co.Note)
                .HasMaxLength(200);
        }
    }
}
