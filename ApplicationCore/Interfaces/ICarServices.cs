using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarServices
    {
        Task<PagedList<CarResponseDTO>> GetAllCars(CarParameter parameter);

        Task<CarResponseDTO> GetCar(string vinID);

        Task<PagedList<CarResponseDTO>> GetCarCreatedByUserId(string userId, CarParameter parameter);

        Task<PagedList<CarResponseDTO>> GetCarByManufacturerId(int manufacturerId, CarParameter parameter);

        Task<PagedList<CarResponseDTO>> GetCarsByCarDealerId(int carDealerId, CarParameter parameter);

        Task<PagedList<CarResponseDTO>> GetCarsByCurrentDataProviderId(CarParameter parameter);

        Task<PagedList<CarResponseDTO>> GetCarsByAdminstrator(CarParameter parameter);

        Task<PagedList<CarResponseDTO>> GetCarsCurrentlySelling(CarParameter parameter);

        Task<IEnumerable<CarResponseDTO>> GetCarByPartialPlate(string searchString, CarParameter parameter);

        Task<bool> SoldCar(string vinID, CarOwnerHistoryCreateRequestDTO request);

        Task<bool> CreateCar(CarCreateRequestDTO request);

        Task<bool> CreateCarSalesInfo(string vinId, CarSalesInfoCreateRequestDTO request);

        Task<bool> UpdateCarSalesInfo(string vinId, CarSalesInfoUpdateRequestDTO request);

        Task<bool> DeleteCar(string vinId);

        Task<bool> UpdateCar(string vinId, CarUpdateRequestDTO request);

        Task UpdateCarCurrentDataProvider(string vinId, CarCurrentDataProviderUpdateRequestDTO request);
    }
}
