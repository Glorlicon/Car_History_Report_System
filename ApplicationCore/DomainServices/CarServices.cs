﻿using Application.Common.Models;
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
        private readonly ICurrentUserServices _currentUserServices;

        public CarServices(IUnitOfWork unitOfWork, IMapper mapper, ICarOwnerHistoryServices carOwnerHistoryServices, ICurrentUserServices currentUserServices)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _carOwnerHistoryServices = carOwnerHistoryServices;
            _currentUserServices = currentUserServices;
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

        public async Task<PagedList<CarResponseDTO>> GetCarsByCurrentDataProviderId(CarParameter parameter)
        {
            var userId = _currentUserServices.GetCurrentUserId();
            var currentDataProviderId = await _unitOfWork.UserRepository.GetDataProviderId(userId);
            var cars = await _unitOfWork.CarRepository.GetCarsByCurrentDataProviderId(currentDataProviderId, parameter, false);
            var carsResponse = _mapper.Map<List<CarResponseDTO>>(cars);
            var count = await _unitOfWork.CarRepository.CountCarByCondition(c => c.CurrentDataProviderId == currentDataProviderId, parameter);
            return new PagedList<CarResponseDTO>(carsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }


        public async Task<PagedList<CarResponseDTO>> GetCarsByAdminstrator(CarParameter parameter)
        {
            var cars = await _unitOfWork.CarRepository.GetCarsByAdminstrator(parameter, false);
            var carsResponse = _mapper.Map<List<CarResponseDTO>>(cars);
            var count = await _unitOfWork.CarRepository.CountCarByCondition(c => c.CreatedByUser.Role == Domain.Enum.Role.Adminstrator, parameter);
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
            car.CarImages = null;
            car.LicensePlateNumber = null;
            car.CurrentDataProviderId = null;
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
            var userId = _currentUserServices.GetCurrentUserId();
            var dataProviderId = await _unitOfWork.UserRepository.GetDataProviderId(userId);
            if (dataProviderId is not null && car.CurrentDataProviderId != dataProviderId)
            {
                throw new CarCurrentDataProviderExist(vinId);
            }
            car.CurrentDataProviderId = dataProviderId;
            var carSalesInfo = _mapper.Map<CarSalesInfo>(request);
            car.CarSalesInfo = carSalesInfo;
            _mapper.Map(request.CarImages, car.CarImages);
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
            _mapper.Map(request.CarImages, car.CarImages);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task UpdateCarCurrentDataProvider(string vinId, CarCurrentDataProviderUpdateRequestDTO request)
        {
            var car = await _unitOfWork.CarRepository.GetCarById(vinId, trackChange: true);
            if (car is null)
            {
                throw new CarNotFoundException(vinId);
            }
            if(car.CurrentDataProviderId is not null)
            {
                throw new CarCurrentDataProviderExist(vinId);
            }
            var isDataProviderExist = await _unitOfWork.DataProviderRepository.IsExist(x => x.Id == request.DataProviderId);
            if(!isDataProviderExist)
            {
                throw new DataProviderNotFoundException(request.DataProviderId);
            }
            car.CurrentDataProviderId = request.DataProviderId;
            await _unitOfWork.SaveAsync();
        }

        public async Task<IEnumerable<CarResponseDTO>> GetCarByPartialPlate(string searchString, CarParameter parameter)
        {
            var cars = await _unitOfWork.CarRepository.GetCarsByPartialPlate(searchString, parameter, false);
            var carsResponse = _mapper.Map<List<CarResponseDTO>>(cars);
            return carsResponse;
        }
    }
}
