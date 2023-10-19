using Application.DTO.CarOwnerHistory;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarOwnerHistoryRepository : IBaseRepository<CarOwnerHistory>
    {
        Task<CarOwnerHistory> GetCarOwnerHistoryById(int id, bool trackChange);

        Task<CarOwnerHistory> GetCurrentCarOwner(string vinId, bool trackChange);

        Task<IEnumerable<CarOwnerHistory>> GetAllCarOwnerHistorys(CarOwnerHistoryParameter parameter, bool trackChange);

        Task<IEnumerable<CarOwnerHistory>> GetCarOwnerHistorysByCarId(string vinId, CarOwnerHistoryParameter parameter, bool trackChange);
    }
}
