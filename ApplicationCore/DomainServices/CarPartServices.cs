using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarPart;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class CarPartServices : ICarPartServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CarPartServices(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedList<CarPartResponseDTO>> GetAllCarParts(CarPartParameter parameter)
        {
            var carParts = await _unitOfWork.CarPartRepository.GetAllCarParts(parameter, false);
            var carPartsResponse = _mapper.Map<List<CarPartResponseDTO>>(carParts);
            var count = await _unitOfWork.CarPartRepository.CountAll();
            return new PagedList<CarPartResponseDTO>(carPartsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<CarPartResponseDTO> GetCarPart(int id)
        {
            var carPart = await _unitOfWork.CarPartRepository.GetCarPartById(id, trackChange: false);
            if (carPart is null)
            {
                throw new CarPartNotFoundException(id);
            }
            var carPartResponse = _mapper.Map<CarPartResponseDTO>(carPart);
            return carPartResponse;
        }

        public async Task<PagedList<CarPartResponseDTO>> GetCarPartByCarId(string vinId, CarPartParameter parameter)
        {
            var carParts = await _unitOfWork.CarPartRepository.GetCarPartsByCarId(vinId, parameter, false);
            var carPartsResponse = _mapper.Map<List<CarPartResponseDTO>>(carParts);
            var count = await _unitOfWork.CarPartRepository.CountByCondition(x => x.Cars.Any(x => x.VinId == vinId));
            return new PagedList<CarPartResponseDTO>(carPartsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<CarPartResponseDTO>> GetCarPartByManufacturerId(int manufacturerId, CarPartParameter parameter)
        {
            var carParts = await _unitOfWork.CarPartRepository.GetCarPartsByManufacturerId(manufacturerId, parameter, false);
            var carPartsResponse = _mapper.Map<List<CarPartResponseDTO>>(carParts);
            var count = await _unitOfWork.CarPartRepository.CountByCondition(x => x.ManufacturerId == manufacturerId);
            return new PagedList<CarPartResponseDTO>(carPartsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<bool> UpdateCarPart(int id, CarPartUpdateRequestDTO request)
        {
            var carPart = await _unitOfWork.CarPartRepository.GetCarPartById(id, trackChange: true);
            if (carPart is null)
            {
                throw new CarPartNotFoundException(id);
            }
            _mapper.Map(request, carPart);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> CreateCarPart(CarPartCreateRequestDTO request)
        {
            var carPart = _mapper.Map<CarPart>(request);
            _unitOfWork.CarPartRepository.Create(carPart);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteCarPart(int id)
        {
            var carPart = await _unitOfWork.CarPartRepository.GetCarPartById(id, trackChange: true);
            if (carPart is null)
            {
                throw new CarPartNotFoundException(id);
            }
            _unitOfWork.CarPartRepository.Delete(carPart);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}
