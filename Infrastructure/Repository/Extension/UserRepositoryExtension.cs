using Application.DTO.CarAccidentHistory;
using Application.DTO.User;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class UserRepositoryExtension
    {
        public static IQueryable<User> Filter(this IQueryable<User> query, UserParameter parameter)
        {
            if (parameter.Username != null)
            {
                query = query.Where(x => x.NormalizedUserName.Contains(parameter.Username.ToUpper()));
            }
            if (parameter.Email != null)
            {
                query = query.Where(x => x.NormalizedEmail.Contains(parameter.Email.ToUpper()));
            }
            if (parameter.Role != null)
            {
                query = query.Where(x => x.Role == parameter.Role);
            }
            if (parameter.DataProviderName != null)
            {
                query = query.Where(x => x.DataProvider.Name.ToUpper().Contains(parameter.DataProviderName.ToUpper()));
            }

            return query;
        }

        public static IQueryable<User> Sort(this IQueryable<User> query, UserParameter parameter)
        {
            query = parameter.SortByDataProvider switch
            {
                1 => query.OrderBy(x => x.DataProviderId),
                -1 => query.OrderByDescending(x => x.DataProviderId),
                _ => query
            };
            query = parameter.SortByRole switch
            {
                1 => query.OrderBy(x => x.Role),
                -1 => query.OrderByDescending(x => x.Role),
                _ => query
            };
            return query;
        }
    }
}
