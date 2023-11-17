using Application.Common.Models;
using Domain.Common;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarHistoryRepository<T,P> : IBaseRepository<T> where T : CarHistory 
                                                                     where P : PagingParameters
    {
        IQueryable<T> Filter(IQueryable<T> query, P parameter);
        IQueryable<T> Sort(IQueryable<T> query, P parameter);

        Task<int> CountAllCarHistory(P parameter);

        Task<int> CountCarHistoryByCondition(Expression<Func<T, bool>> expression, P parameter);

        Task<T> GetCarHistoryById(int id, bool trackChange);

        Task<IEnumerable<T>> GetAllCarHistorys(P parameter, bool trackChange);

        Task<IEnumerable<T>> GetCarHistorysByCarId(string vinId, P parameter, bool trackChange);

        Task<IEnumerable<T>> GetCarHistorysByUserId(string userId, P parameter, bool trackChange);

        Task<IEnumerable<T>> GetCarHistorysByOwnCompany(List<string> carIds, P parameter, bool trackChange);
    }
}
