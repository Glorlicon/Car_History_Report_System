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
    public static class ReviewRepositoryExtension
    {
        public static IQueryable<Review> Filter(this IQueryable<Review> query, DataProviderReviewParameter parameter)
        {
            if (parameter.DataProviderId != null)
                query = query.Where(x => x.DataProviderId == parameter.DataProviderId);
            if (parameter.Rating != null)
                query = query.Where(x => x.Rating == parameter.Rating);
            return query;
        }

        public static IQueryable<Review> Sort(this IQueryable<Review> query, DataProviderReviewParameter parameter)
        {
            query = parameter.DataProviderId switch
            {
                1 => query.OrderBy(r => r.DataProviderId),
                -1 => query.OrderByDescending(r => r.DataProviderId),
                _ => query
            };            
            query = parameter.Rating switch
            {
                1 => query.OrderBy(r => r.Rating),
                -1 => query.OrderByDescending(r => r.Rating),
                _ => query
            };            
            query = parameter.SortByDate switch
            {
                1 => query.OrderBy(r => r.CreatedTime),
                -1 => query.OrderByDescending(r => r.CreatedTime),
                _ => query
            };
            return query;
        }
    }
}
