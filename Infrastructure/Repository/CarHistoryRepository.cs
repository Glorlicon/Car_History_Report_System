using Application.Common.Models;
using Application.Interfaces;
using Domain.Common;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Infrastructure.Repository
{
    public class CarHistoryRepository<T, P> : BaseRepository<T>, ICarHistoryRepository<T, P> where T : CarHistory
                                                                                           where P : PagingParameters
    {
        protected ApplicationDBContext repositoryContext;
        public CarHistoryRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }
        public virtual IQueryable<T> Filter(IQueryable<T> query, P parameter)
        {
            return query;
        }

        public virtual IQueryable<T> Sort(IQueryable<T> query, P parameter)
        {
            return query.OrderByDescending(x => x.ReportDate);
        }

        public virtual async Task<IEnumerable<T>> GetAllCarHistorys(P parameter, bool trackChange)
        {
            var query = FindAll(trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public virtual async Task<T> GetCarHistoryById(int id, bool trackChange)
        {
            var query = FindByCondition(x => x.Id == id, trackChange);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .SingleOrDefaultAsync();
        }

        public virtual async Task<IEnumerable<T>> GetCarHistorysByCarId(string vinId, P parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CarId == vinId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetCarHistorysByUserId(string userId, P parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CreatedByUserId == userId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetCarHistorysByDataProviderId(int dataProviderId, P parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CreatedByUser.DataProviderId == dataProviderId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetCarHistorysByOwnCompany(List<string> carIds, P parameter, bool trackChange)
        {
            var query = FindByCondition(x => carIds.Contains(x.CarId), trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public async Task<int> CountAllCarHistory(P parameter)
        {
            var query = FindAll(false);
            query = Filter(query, parameter);
            return await query.CountAsync();
        }

        public async Task<int> CountCarHistoryByCondition(Expression<Func<T, bool>> expression, P parameter)
        {
            var query = FindByCondition(expression, false);
            query = Filter(query, parameter);
            return await query.CountAsync();
        }
    }
}
