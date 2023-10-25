using Application.DTO.Car;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository.Extension
{
    public static class CarRepositoryExtension
    {
        public static IQueryable<Car> Filter(this IQueryable<Car> query, CarParameter parameter)
        {
            if (parameter.Make != null)
                query = query.Where(x => x.Model.Manufacturer.Name == parameter.Make);
            if (parameter.Model != null)
                query = query.Where(x => x.ModelId == parameter.Model);
            if (parameter.BodyType != null)
                query = query.Where(x => x.Model.BodyType == parameter.BodyType);
            query = query.Where(x => x.Model.ReleasedDate.Year >= parameter.YearStart && x.Model.ReleasedDate.Year <= parameter.YearEnd);
            query = query.Where(x => x.CurrentOdometer >= parameter.MileageMin && x.CurrentOdometer <= parameter.MileageMax);
            query = query.Where(x => x.CarSalesInfo == null ||  (x.CarSalesInfo.Price >= parameter.PriceMin && x.CarSalesInfo.Price <= parameter.PriceMax));
            return query;
        }

        public static IQueryable<Car> Sort(this IQueryable<Car> query, CarParameter parameter)
        {
            query = parameter.SortByPrice switch
            {
                1 => query.OrderBy(c => c.CarSalesInfo.Price),
                -1 => query.OrderByDescending(c => c.CarSalesInfo.Price),
                _ => query
            };

            query = parameter.SortByDate switch
            {
                1 => query.OrderBy(c => c.Model.ReleasedDate),
                -1 => query.OrderByDescending(c => c.Model.ReleasedDate),
                _ => query
            };

            query = parameter.SortByMileage switch
            {
                1 => query.OrderBy(c => c.CurrentOdometer),
                -1 => query.OrderByDescending(c => c.CurrentOdometer),
                _ => query
            };
            return query;
        }
    }
}
