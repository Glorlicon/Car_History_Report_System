using Domain.Entities;
using Domain.Enum;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Configurations
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            var Roles = Enum.GetValues(typeof(Role)).Cast<Role>();
            List<IdentityRole> identityRoles = new List<IdentityRole>();
            foreach (var role in Roles)
            {
                identityRoles.Add(new IdentityRole
                {
                    Name = role.ToString(),
                    NormalizedName = role.ToString().ToUpper()
                });
            }
            builder.HasData(identityRoles);
        }
    }
}
