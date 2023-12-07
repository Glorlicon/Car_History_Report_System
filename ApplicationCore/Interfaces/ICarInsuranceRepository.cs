using Application.DTO.CarInsurance;
using Application.DTO.CarServiceHistory;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public interface ICarInsuranceRepository : ICarHistoryRepository<CarInsurance, CarInsuranceHistoryParameter>
    {
        Task<List<string>> InsuranceCompanyGetOwnCarIds(int? dataProviderId, bool trackChange);
        Task<List<string>> GetCarInsuranceUserIdsByCarId(string carId);
    }
}
