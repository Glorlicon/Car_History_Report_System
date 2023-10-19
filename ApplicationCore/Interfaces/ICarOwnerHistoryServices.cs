using Application.Common.Models;
using Application.DTO.CarOwnerHistory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarOwnerHistoryServices
    {
        Task<PagedList<CarOwnerHistoryResponseDTO>> GetAllCarOwnerHistorys(CarOwnerHistoryParameter parameter);

        Task<CarOwnerHistoryResponseDTO> GetCarOwnerHistory(int id);

        Task<CarOwnerHistoryResponseDTO> GetCurrentCarOwner(string vinId);

        Task<PagedList<CarOwnerHistoryResponseDTO>> GetCarOwnerHistoryByCarId(string vinId, CarOwnerHistoryParameter parameter);

        Task<bool> CreateCarOwnerHistory(CarOwnerHistoryCreateRequestDTO request);

        Task<bool> DeleteCarOwnerHistory(int id);

        Task<bool> UpdateCarOwnerHistory(int id, CarOwnerHistoryUpdateRequestDTO request);
    }
}
