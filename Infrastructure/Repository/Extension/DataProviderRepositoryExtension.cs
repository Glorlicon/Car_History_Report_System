using Application.DTO.DataProvider;
using Application.DTO.Request;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class DataProviderRepositoryExtension
    {
        public static IQueryable<DataProvider> Filter(this IQueryable<DataProvider> query, DataProviderParameter parameter)
        {
            if (parameter.Name != null)
            {
                query = query.Where(x => x.Name.ToLower().Contains(parameter.Name.ToLower()));
            }
            if (parameter.Type != null)
                query = query.Where(x => x.Type == parameter.Type);

            if (parameter.Email != null)
                query = query.Where(x => x.Email.ToLower().Contains(parameter.Email.ToLower()));
            return query;
        }

        public static IQueryable<DataProvider> Sort(this IQueryable<DataProvider> query, DataProviderParameter parameter)
        {
            query = parameter.SortByName switch
            {
                1 => query.OrderBy(x => x.Name),
                -1 => query.OrderByDescending(x => x.Name),
                _ => query
            };

            query = parameter.SortByType switch
            {
                1 => query.OrderBy(x => x.Type),
                -1 => query.OrderByDescending(x => x.Type),
                _ => query
            };
            return query;
        }
    }
}
