using Application.Common.Models;
using Application.DTO.DataProvider;
using Application.DTO.Request;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces

{ 
    public interface IReviewRepository : IBaseRepository<Review>
    {
        Task<int> CountAll(DataProviderReviewParameter parameter);

        Task<Review> GetReview(string userId, int dataProviderId, bool trackChange);

        Task<IEnumerable<Review>> GetAllReview(DataProviderReviewParameter parameter, bool trackChange);
    }
}
