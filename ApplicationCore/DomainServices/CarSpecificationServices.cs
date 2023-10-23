using Application.Common.Models;
using Application.DTO.CarSpecification;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class CarSpecificationServices : ICarSpecificationService
    {
        private readonly ICarSpecificationRepository _carSpecRepository;
        private readonly IMapper _mapper;
        public CarSpecificationServices(ICarSpecificationRepository carSpecRepository, IMapper mapper)
        {
            _carSpecRepository = carSpecRepository;
            _mapper = mapper;
        }

        public async Task<PagedList<CarSpecificationResponseDTO>> GetAllCarModels(CarSpecificationParameter parameter, bool trackChange)
        {
            var carModels = await _carSpecRepository.GetAllCarModels(parameter, trackChange);
            var carModelsResponse = _mapper.Map<List<CarSpecificationResponseDTO>>(carModels);
            var count = await _carSpecRepository.CountAll();
            return new PagedList<CarSpecificationResponseDTO>(carModelsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<CarSpecificationResponseDTO>> GetAllCarModelsTest(CarSpecificationParameter parameter, bool trackChange)
        {
            var carModels = await _carSpecRepository.GetAllCarModelsTest(parameter, trackChange);
            var carModelsResponse = _mapper.Map<List<CarSpecificationResponseDTO>>(carModels);
            var count = await _carSpecRepository.CountAll();
            return new PagedList<CarSpecificationResponseDTO>(carModelsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<CarSpecificationResponseDTO> GetCarModel(string modelId, bool trackChange)
        {
            var carModel = await _carSpecRepository.GetCarModelById(modelId, trackChange);
            if (carModel is null)
            {
                throw new CarSpecificationNotFoundException(modelId);
            }

            var carModelsResponse = _mapper.Map<CarSpecificationResponseDTO>(carModel);
            return carModelsResponse;
        }

        public async Task<PagedList<CarSpecificationResponseDTO>> GetCarModelByUserId(string userId, CarSpecificationParameter parameter, bool trackChange)
        {
            var carModels = await _carSpecRepository.GetCarModelByUserId(userId, parameter, trackChange);
            var carModelsResponse = _mapper.Map<List<CarSpecificationResponseDTO>>(carModels);
            var count = await _carSpecRepository.CountByCondition(cs => cs.CreatedByUserId == userId);
            return new PagedList<CarSpecificationResponseDTO>(carModelsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<CarSpecificationResponseDTO>> GetCarModelByManufacturerId(int manufacturerId, CarSpecificationParameter parameter, bool trackChange)
        {
            var carModels =  await _carSpecRepository.GetCarModelByManufacturerId(manufacturerId,parameter, trackChange);
            var carModelsResponse = _mapper.Map<List<CarSpecificationResponseDTO>>(carModels);
            var count = await _carSpecRepository.CountByCondition(cs => cs.ManufacturerId == manufacturerId);
            return new PagedList<CarSpecificationResponseDTO>(carModelsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<CarSpecificationResponseDTO>> GetCarModelsCreatedByAdminstrator(CarSpecificationParameter parameter)
        {
            var carModels = await _carSpecRepository.GetCarModelsCreatedByAdminstrator(parameter, trackChange: false);
            var carModelsResponse = _mapper.Map<List<CarSpecificationResponseDTO>>(carModels);
            var count = await _carSpecRepository.CountByCondition(x => x.CreatedByUser != null && x.CreatedByUser.Role == Domain.Enum.Role.Adminstrator);
            return new PagedList<CarSpecificationResponseDTO>(carModelsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<bool> CreateCarModel(CarSpecificationCreateRequestDTO request)
        {
            var carSpec = _mapper.Map<CarSpecification>(request);
            _carSpecRepository.Create(carSpec);
            await _carSpecRepository.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteCarModel(string modelId)
        {
            var carSpec = await _carSpecRepository.GetCarModelById(modelId, trackChange: true);
            if(carSpec is null)
            {
                throw new CarSpecificationNotFoundException(modelId);
            }
            _carSpecRepository.Delete(carSpec);
            await _carSpecRepository.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateCarModel(string modelId, CarSpecificationUpdateRequestDTO request)
        {

            var carSpec = await _carSpecRepository.GetCarModelById(modelId, trackChange: true);
            if(carSpec is null)
            {
                throw new CarSpecificationNotFoundException(modelId);
            }
            _mapper.Map(request, carSpec);
            await _carSpecRepository.SaveAsync();
            return true;
        }

    }
}
