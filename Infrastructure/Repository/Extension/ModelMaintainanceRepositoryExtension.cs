using Application.DTO.DataProvider;
using Application.DTO.ModelMaintainance;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class ModelMaintainanceRepositoryExtension
    {
        public static IQueryable<ModelMaintainance> Filter(this IQueryable<ModelMaintainance> query, ModelMaintainanceParameter parameter)
        {
            if (parameter.MaintainancePart != null)
            {
                query = query.Where(x => x.MaintenancePart.ToLower().Contains(parameter.MaintainancePart.ToLower()));
            }
            return query;
        }

        public static IQueryable<ModelMaintainance> Sort(this IQueryable<ModelMaintainance> query, ModelMaintainanceParameter parameter)
        {
            query = parameter.SortByOdometer switch
            {
                1 => query.OrderBy(x => x.OdometerPerMaintainance),
                -1 => query.OrderByDescending(x => x.OdometerPerMaintainance),
                _ => query
            };            
            query = parameter.SortByTime switch
            {
                1 => query.OrderBy(x => x.DayPerMaintainance),
                -1 => query.OrderByDescending(x => x.DayPerMaintainance),
                _ => query
            };
            return query;
        }
    }
}
