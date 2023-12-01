using Application.DTO.CarAccidentHistory;
using Application.DTO.CarStolenHistory;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class CarStolenHistoryRepositoryExtension
    {
        public static IQueryable<CarStolenHistory> Filter(this IQueryable<CarStolenHistory> query, CarStolenHistoryParameter parameter)
        {
            if (parameter.VinId != null)
            {
                query = query.Where(x => x.CarId.ToLower().Contains(parameter.VinId.ToLower()));
            }
            if (parameter.Status != null)
            {
                query = query.Where(x => x.Status == parameter.Status);
            }
            return query;
        }

        public static IQueryable<CarStolenHistory> Sort(this IQueryable<CarStolenHistory> query, CarStolenHistoryParameter parameter)
        {
            query = parameter.SortByLastModified switch
            {
                1 => query.OrderBy(x => x.LastModified),
                -1 => query.OrderByDescending(x => x.LastModified),
                _ => query
            };
            query = parameter.SortByStatus switch
            {
                1 => query.OrderBy(x => x.Status),
                -1 => query.OrderByDescending(x => x.Status),
                _ => query
            };
            return query;
        }
    }
}
