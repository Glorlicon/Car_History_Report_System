using Application.DTO.CarMaintainance;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarMaintainanceRepository : IBaseRepository<CarMaintainance>
    {
        Task<CarMaintainance> GetCarMaintainanceById(string carId, string userId, bool trackChange);
        Task<IEnumerable<CarMaintainanceTrackingResponseDTO>> GetCarMaintainanceTrackingListByUserId(string userId, bool trackChange);
        Task<IEnumerable<string>> GetUserIdsTrackingModelId(string modelId, bool trackChange);
    }
}
