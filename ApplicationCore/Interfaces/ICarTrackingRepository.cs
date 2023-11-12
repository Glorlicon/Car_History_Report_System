using Application.DTO.CarTracking;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarTrackingRepository : IBaseRepository<CarTracking>
    {
        Task<IEnumerable<CarTracking>> GetAllCarTrackings(CarTrackingParameter parameter, bool trackChange);
        Task<IEnumerable<CarTracking>> GetCarTrackingsByUserId(string userId, CarTrackingParameter parameter, bool trackChange);
        Task<IEnumerable<CarTracking>> GetCarCurrentlyTrackingsByCarId(string carId, CarTrackingParameter parameter, bool trackChange);

        Task<CarTracking> GetCarTracking(string userId, string carId, bool trackChange);

        Task<IEnumerable<string>> GetUserIdsTrackingCarId(string carId, bool trackChange);
    }
}
