using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarRecall;
using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarRecallServices
    {
        Task<CarRecallResponseDTO> GetCarRecall(int id);

        Task<PagedList<CarRecallResponseDTO>> GetAllCarRecalls(CarRecallParameter parameter);

        Task<PagedList<CarRecallResponseDTO>> GetCarRecallsByManufacturer(int manufacturerId, CarRecallParameter parameter);

        Task<PagedList<CarRecallResponseDTO>> GetCarRecallsByModel(string modelId, CarRecallParameter parameter);

        Task CreateCarRecall(CarRecallCreateRequestDTO request);

        Task DeleteCarRecall(int id);

        Task UpdateCarRecall(int id, CarRecallUpdateRequestDTO request);

        Task<CarRecallStatusResponseDTO> GetCarRecallStatus(int recallId, string carId);

        Task<IEnumerable<CarRecallStatusResponseDTO>> GetCarRecallStatusByCar(string carId, CarRecallStatusParameter parameter);

        Task UpdateCarRecallStatus(int recallId, string carId, CarRecallStatusUpdateRequestDTO request);
    }
}
