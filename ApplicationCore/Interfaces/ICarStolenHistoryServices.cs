using Application.Common.Models;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarStolenHistory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarStolenHistoryServices
    {
        Task<PagedList<CarStolenHistoryResponseDTO>> GetAllCarStolenHistorys(CarStolenHistoryParameter parameter);

        Task<CarStolenHistoryResponseDTO> GetCarStolenHistory(int id);

        Task<CarStolenHistoryResponseDTO> GetCurrentCarStolen(string vinId);

        Task<PagedList<CarStolenHistoryResponseDTO>> GetCarStolenHistoryByCarId(string vinId, CarStolenHistoryParameter parameter);

        Task<bool> CreateCarStolenHistory(CarStolenHistoryCreateRequestDTO request);

        Task<bool> DeleteCarStolenHistory(int id);

        Task<bool> UpdateCarStolenHistory(int id, CarStolenHistoryUpdateRequestDTO request);

        Task<PagedList<CarStolenHistoryResponseDTO>> InsuranceCompanyGetOwnCarStolenHistories(CarStolenHistoryParameter parameter);

        Task<CarStolenHistoryResponseDTO> InsuranceCompanyGetOwnCarStolenHistoryDetail(int id);

    }
}
