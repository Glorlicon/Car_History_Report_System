using Application.DTO.CarServiceHistory;
using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarServiceHistoryRepository : ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>
    {
        Task<int?> GetLastCarOdometerByService(string carId, CarServiceType service);

        Task<DateOnly?> GetLastDateServicedByService(string carId, CarServiceType service);
    }
}
