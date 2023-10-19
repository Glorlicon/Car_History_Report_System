using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarSpecification;
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
    public class CarServices : ICarServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICarOwnerHistoryServices _carOwnerHistoryServices;

        public CarServices(IUnitOfWork unitOfWork, IMapper mapper, ICarOwnerHistoryServices carOwnerHistoryServices)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _carOwnerHistoryServices = carOwnerHistoryServices;
        }

        public async Task<PagedList<CarResponseDTO>> GetAllCars(CarParameter parameter)
        {
            var cars = await _unitOfWork.CarRepository.GetAllCar(parameter, false);
            var carsResponse = _mapper.Map<List<CarResponseDTO>>(cars);
            var count = await _unitOfWork.CarRepository.CountCarAll(parameter);
            return new PagedList<CarResponseDTO>(carsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<CarResponseDTO>> GetCarByManufacturerId(int manufacturerId, CarParameter parameter)
        {
            var cars = await _unitOfWork.CarRepository.GetCarsByManufacturerId(manufacturerId,parameter, false);
            var carsResponse = _mapper.Map<List<CarResponseDTO>>(cars);
            var count = await _unitOfWork.CarRepository.CountCarByCondition(c => c.Model.ManufacturerId == manufacturerId, parameter);
            return new PagedList<CarResponseDTO>(carsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<CarResponseDTO>> GetCarCreatedByUserId(string userId, CarParameter parameter)
        {
            var cars = await _unitOfWork.CarRepository.GetCarsByUserId(userId,parameter, false);
            var carsResponse = _mapper.Map<List<CarResponseDTO>>(cars);
            var count = await _unitOfWork.CarRepository.CountCarByCondition(c => c.CreatedByUserId == userId, parameter);
            return new PagedList<CarResponseDTO>(carsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<CarResponseDTO>> GetCarsByCarDealerId(int carDealerId, CarParameter parameter)
        {
            var cars = await _unitOfWork.CarRepository.GetCarsByCarDealerId(carDealerId, parameter, false);
            var carsResponse = _mapper.Map<List<CarResponseDTO>>(cars);
            var count = await _unitOfWork.CarRepository.CountCarByCondition(c => c.CreatedByUser.DataProviderId == carDealerId, parameter);
            return new PagedList<CarResponseDTO>(carsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<PagedList<CarResponseDTO>> GetCarsCurrentlySelling(CarParameter parameter)
        {
            var cars = await _unitOfWork.CarRepository.GetCarsCurrentlySelling(parameter, false);
            var carsResponse = _mapper.Map<List<CarResponseDTO>>(cars);
            var count = await _unitOfWork.CarRepository.CountCarByCondition(c => c.CarSalesInfo != null, parameter);
            return new PagedList<CarResponseDTO>(carsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<CarResponseDTO> GetCar(string vinID)
        {
            var car = await _unitOfWork.CarRepository.GetCarById(vinID, trackChange: false);
            if (car is null)
            {
                throw new CarNotFoundException(vinID);
            }
            var carResponse = _mapper.Map<CarResponseDTO>(car);
            return carResponse;
        }

        public async Task<bool> CreateCar(CarCreateRequestDTO request)
        {
            var car = _mapper.Map<Car>(request);
            _unitOfWork.CarRepository.Create(car);
            await _unitOfWork.SaveAsync();
            /*
            if (request.CarPartIds != null)
            {
                var carParts = await _unitOfWork.CarPartRepository.GetCarPartsByIdList(request.CarPartIds, true);
                car.CarParts = carParts;
                await _unitOfWork.SaveAsync();
            }
            */
            return true;
        }

        public async Task<bool> DeleteCar(string vinId)
        {
            var car = await _unitOfWork.CarRepository.GetCarById(vinId, trackChange: true);
            if (car is null)
            {
                throw new CarNotFoundException(vinId);
            }
            _unitOfWork.CarRepository.Delete(car);
            await _unitOfWork.CarRepository.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateCar(string vinId, CarUpdateRequestDTO request)
        {
            var car = await _unitOfWork.CarRepository.GetCarById(vinId, trackChange: true);

            if (car is null)
            {
                throw new CarNotFoundException(vinId);
            }
            _mapper.Map(request,car);
            /*
            if (request.CarPartIds != null)
            {
                var carParts = await _unitOfWork.CarPartRepository.GetCarPartsByIdList(request.CarPartIds, true);
                car.CarParts = carParts;
            }
            */
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> SoldCar(string vinID, CarOwnerHistoryCreateRequestDTO request)
        {
            var car = await _unitOfWork.CarRepository.GetCarById(vinID, trackChange: true);

            if (car is null)
            {
                throw new CarNotFoundException(vinID);
            }
            car.CarSalesInfo = null;
            await _carOwnerHistoryServices.CreateCarOwnerHistory(request);
            //await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> CreateCarSalesInfo(string vinId, CarSalesInfoCreateRequestDTO request)
        {
            var car = await _unitOfWork.CarRepository.GetCarById(request.CarId, trackChange: true);
            if(car is null)
            {
                throw new CarNotFoundException(request.CarId);
            }
            var carSalesInfo = _mapper.Map<CarSalesInfo>(request);
            car.CarSalesInfo = carSalesInfo;
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateCarSalesInfo(string vinId, CarSalesInfoUpdateRequestDTO request)
        {
            var car = await _unitOfWork.CarRepository.GetCarById(vinId, trackChange: true);
            if (car is null)
            {
                throw new CarNotFoundException(vinId);
            }
            _mapper.Map(request, car.CarSalesInfo);
            car.CarSalesInfo.Features = new List<string>(car.CarSalesInfo.Features);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}
