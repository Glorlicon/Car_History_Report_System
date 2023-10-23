using Application.Common.Models;
using Application.DTO.CarSpecification;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarSpecificationService
    {
        Task<PagedList<CarSpecificationResponseDTO>> GetAllCarModels(CarSpecificationParameter parameter, bool trackChange);

        Task<PagedList<CarSpecificationResponseDTO>> GetAllCarModelsTest(CarSpecificationParameter parameter, bool trackChange);

        Task<CarSpecificationResponseDTO> GetCarModel(string modelId, bool trackChange);

        Task<PagedList<CarSpecificationResponseDTO>> GetCarModelByUserId(string userId, CarSpecificationParameter parameter, bool trackChange);

        Task<PagedList<CarSpecificationResponseDTO>> GetCarModelByManufacturerId(int manufacturerId, CarSpecificationParameter parameter, bool trackChange);

        Task<PagedList<CarSpecificationResponseDTO>> GetCarModelsCreatedByAdminstrator(CarSpecificationParameter parameter);

        Task<bool> CreateCarModel(CarSpecificationCreateRequestDTO request);

        Task<bool> DeleteCarModel(string modelId);

        Task<bool> UpdateCarModel(string modelId, CarSpecificationUpdateRequestDTO request);

    }
}
