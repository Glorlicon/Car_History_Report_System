using Application.DTO.Car;
using Application.DTO.CarMaintainance;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarMaintainanceServices
    {
        Task<IEnumerable<CarMaintainanceTrackingResponseDTO>> GetCarMaintainanceTrackingListByUserId(string userId);

        Task AddCarToTrackingList(AddCarToTrackingListRequestDTO request);

        Task RemoveCarFromTrackingList(string carId, string userId);
    }
}
