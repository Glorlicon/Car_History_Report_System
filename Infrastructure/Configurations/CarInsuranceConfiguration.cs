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
    public class CarInsuranceConfiguration : IEntityTypeConfiguration<CarInsurance>
    {
        public void Configure(EntityTypeBuilder<CarInsurance> builder)
        {
            builder.Property(ca => ca.Description)
                .HasMaxLength(2000);
            builder.Property(ca => ca.Note)
                .HasMaxLength(200);
        }
    }
}
