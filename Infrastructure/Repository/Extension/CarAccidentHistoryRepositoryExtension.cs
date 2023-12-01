using Application.DTO.CarAccidentHistory;
using Application.DTO.DataProvider;
using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class CarAccidentHistoryRepositoryExtension
    {
        public static IQueryable<CarAccidentHistory> Filter(this IQueryable<CarAccidentHistory> query, CarAccidentHistoryParameter parameter)
        {
            if (parameter.VinId != null)
            {
                query = query.Where(x => x.CarId.ToLower().Contains(parameter.VinId.ToLower()));
            }
            if (parameter.DamageLocation != null)
            {
                query = query.Where(x => x.DamageLocation == parameter.DamageLocation);
            }
            if (parameter.Serverity != null)
            {
                query = query.Where(x => x.Serverity == parameter.Serverity);
            }
            if (parameter.AccidentStartDate != null)
            {
                query = query.Where(x => x.AccidentDate >= parameter.AccidentStartDate);
            }
            if (parameter.AccidentEndDate != null)
            {
                query = query.Where(x => x.AccidentDate <= parameter.AccidentEndDate);
            }
            return query;
        }

        public static IQueryable<CarAccidentHistory> Sort(this IQueryable<CarAccidentHistory> query, CarAccidentHistoryParameter parameter)
        {
            query = parameter.SortByLastModified switch
            {
                1 => query.OrderBy(x => x.LastModified),
                -1 => query.OrderByDescending(x => x.LastModified),
                _ => query
            };
            query = parameter.SortByServerity switch
            {
                1 => query.OrderBy(x => x.Serverity),
                -1 => query.OrderByDescending(x => x.Serverity),
                _ => query
            };
            query = parameter.SortByAccidentDate switch
            {
                1 => query.OrderBy(x => x.AccidentDate),
                -1 => query.OrderByDescending(x => x.AccidentDate),
                _ => query
            };            

            return query;
        }
    }
}
