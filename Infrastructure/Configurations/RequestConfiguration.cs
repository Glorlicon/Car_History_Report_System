using Domain.Entities;
using Domain.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class RequestConfiguration : IEntityTypeConfiguration<Request>
    {
        public void Configure(EntityTypeBuilder<Request> builder)
        {
            builder.Property(x => x.Description)
                .HasMaxLength(1000);
            builder.Property(x => x.Response)
                .HasMaxLength(1000);
            builder.Property(x => x.Type)
                .HasConversion(
                    f => f.ToString(),
                    f => (UserRequestType)Enum.Parse(typeof(UserRequestType), f));
            builder.Property(x => x.Status)
                .HasConversion(
                    f => f.ToString(),
                    f => (UserRequestStatus)Enum.Parse(typeof(UserRequestStatus), f));
        }
    }
}
