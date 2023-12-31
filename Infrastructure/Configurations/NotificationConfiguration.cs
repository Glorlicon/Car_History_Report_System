﻿using Domain.Entities;
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
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.Property(co => co.Title)
                .HasMaxLength(200)
                .IsRequired();
            builder.Property(co => co.Description)
                .HasMaxLength(2000);
            builder.Property(co => co.RelatedLink)
                .HasMaxLength(100);
            builder.Property(x => x.Type)
                .HasConversion(
                    f => f.ToString(),
                    f => (NotificationType)Enum.Parse(typeof(NotificationType), f))
                .IsRequired();
        }
    }
}
