using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarPart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarPartServices
    {
        Task<PagedList<CarPartResponseDTO>> GetAllCarParts(CarPartParameter parameter);

        Task<CarPartResponseDTO> GetCarPart(int id);

        Task<PagedList<CarPartResponseDTO>> GetCarPartByManufacturerId(int manufacturerId, CarPartParameter parameter);

        Task<PagedList<CarPartResponseDTO>> GetCarPartByCarId(string vinId, CarPartParameter parameter);

        Task<bool> CreateCarPart(CarPartCreateRequestDTO request);

        Task<bool> DeleteCarPart(int id);

        Task<bool> UpdateCarPart(int id, CarPartUpdateRequestDTO request);
    }
}
