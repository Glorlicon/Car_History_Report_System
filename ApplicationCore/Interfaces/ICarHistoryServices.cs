using Application.Common.Models;
using Application.DTO.CarOwnerHistory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarHistoryServices<R,P,C,U> where P : PagingParameters
    {
        Task<PagedList<R>> GetAllCarHistorys(P parameter);

        Task<R> GetCarHistory(int id);

        Task<PagedList<R>> GetCarHistoryByCarId(string vinId, P parameter);

        Task<PagedList<R>> GetCarHistoryByUserId(string userId, P parameter);

        Task<int> CreateCarHistory(C request);

        Task DeleteCarHistory(int id);

        Task UpdateCarHistory(int id, U request);

        Task<IEnumerable<int>> CreateCarHistoryCollection(IEnumerable<C> requests);
    }
}
