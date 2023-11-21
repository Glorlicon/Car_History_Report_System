using Application.DTO.CarOwnerHistory;
using Application.DTO.CarStolenHistory;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarStolenHistoryRepository : IBaseRepository<CarStolenHistory>
    {
        Task<CarStolenHistory> GetCarStolenHistoryById(int id, bool trackChange);

        Task<IEnumerable<CarStolenHistory>> GetAllCarStolenHistorys(CarStolenHistoryParameter parameter, bool trackChange);

        Task<CarStolenHistory> GetCurrentCarStolen(string vinId, bool trackChange);

        Task<IEnumerable<CarStolenHistory>> GetCarStolenHistorysByCarId(string vinId, CarStolenHistoryParameter parameter, bool trackChange);
       
        Task<IEnumerable<CarStolenHistory>> InsuranceCompanyGetCarStolenHistorysBelongToOwnCompany(List<string?> carIds, CarStolenHistoryParameter parameter, bool trackChange);
       
    }
}
