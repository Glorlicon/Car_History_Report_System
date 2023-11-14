using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarSpecification;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests
{
    public class CarServicesTests
    {
        private IMapper mapper;
        private List<Car> carTestData;
        private CarParameter parameter;
        private Mock<ICarOwnerHistoryServices> mockService;
        private Mock<ICurrentUserServices> mockcurrentUserService;

        public CarServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            carTestData = GetCarsList();
            parameter = new CarParameter();
            mockService = new Mock<ICarOwnerHistoryServices>();
            mockcurrentUserService = new Mock<ICurrentUserServices>();
        }

        private List<Car> GetCarsList()
        {
            var cars = new List<Car>();
            cars.Add(new Car
            {
                VinId = "2T1KR32E28C706767",
                LicensePlateNumber = "30F-34567",
                ModelId = "ModelTest1",
                Model = new CarSpecification
                {
                    ModelID = "ModelTest1",
                    ManufacturerId = 1,
                    Manufacturer = new DataProvider
                    {
                        Id = 1,
                        Name = "Manufacturer1",
                        Description = "Manufacturer",
                        Type = Domain.Enum.DataProviderType.Manufacturer
                    },
                    WheelFormula = "WheelFormula",
                    ReleasedDate = new DateOnly(2023, 1, 1),
                    Country = "VN",
                    FuelType = Domain.Enum.FuelType.Gasoline,
                    BodyType = Domain.Enum.BodyType.Sedan,
                    CreatedByUserId = "User1"
                },
                Color = Domain.Enum.Color.White,
                EngineNumber = "Engine"
            });
            cars.Add(new Car
            {
                VinId = "RLMAF4CX4NV001005",
                LicensePlateNumber = "30F-34567",
                ModelId = "ModelTest1",
                Model = new CarSpecification
                {
                    ModelID = "ModelTest1",
                    ManufacturerId = 1,
                    Manufacturer = new DataProvider
                    {
                        Id = 1,
                        Name = "Manufacturer1",
                        Description = "Manufacturer",
                        Type = Domain.Enum.DataProviderType.Manufacturer
                    },
                    WheelFormula = "WheelFormula",
                    ReleasedDate = new DateOnly(2023, 1, 1),
                    Country = "VN",
                    FuelType = Domain.Enum.FuelType.Gasoline,
                    BodyType = Domain.Enum.BodyType.Sedan,
                    CreatedByUserId = "User1"
                },
                Color = Domain.Enum.Color.Beige,
                EngineNumber = "Engine"
            });
            cars.Add(new Car
            {
                VinId = "1N4BL4EV2KC238807",
                LicensePlateNumber = "30F-34567",
                ModelId = "ModelTest3",
                Model = new CarSpecification
                {
                    ModelID = "ModelTest3",
                    ManufacturerId = 2,
                    Manufacturer = new DataProvider
                    {
                        Id = 2,
                        Name = "Manufacturer2",
                        Description = "Manufacturer",
                        Type = Domain.Enum.DataProviderType.Manufacturer
                    },
                    WheelFormula = "WheelFormula",
                    ReleasedDate = new DateOnly(2023, 1, 1),
                    Country = "VN",
                    FuelType = Domain.Enum.FuelType.Gasoline,
                    BodyType = Domain.Enum.BodyType.Sedan,
                    CreatedByUserId = "User1"
                },
                Color = Domain.Enum.Color.Black,
                EngineNumber = "Engine"
            });
            return cars;
        }

        [Fact]
        public async Task GetAllCars_ReturnsCarsList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetAllCar(parameter, trackChange))
                    .ReturnsAsync(carTestData);
            mockRepo.Setup(repo => repo.CountAll()).ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            var result = await service.GetAllCars(parameter);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.IsAssignableFrom<PagedList<CarResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarByManufacturerId_ReturnsCarsList()
        {
            // Arrange
            int manufacturerId = 1;
            bool trackChange = false;
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarsByManufacturerId(manufacturerId,parameter, trackChange))
                    .ReturnsAsync(carTestData);
            mockRepo.Setup(repo => repo.CountCarByCondition(c => c.Model.ManufacturerId == manufacturerId, parameter))
                .ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            var result = await service.GetCarByManufacturerId(manufacturerId, parameter);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.IsAssignableFrom<PagedList<CarResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarCreatedByUserId_ReturnsCarsList()
        {
            // Arrange
            string userId = "user";
            bool trackChange = false;
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarsByUserId(userId, parameter, trackChange))
                    .ReturnsAsync(carTestData);
            mockRepo.Setup(repo => repo.CountCarByCondition(c => c.CreatedByUserId == userId, parameter))
                .ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            var result = await service.GetCarCreatedByUserId(userId, parameter);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.IsAssignableFrom<PagedList<CarResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarsByCarDealerId_ReturnsCarsList()
        {
            // Arrange
            int carDealerId = 1;
            bool trackChange = false;
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarsByCarDealerId(carDealerId, parameter, trackChange))
                    .ReturnsAsync(carTestData);
            mockRepo.Setup(repo => repo.CountCarByCondition(c => c.CreatedByUser.DataProviderId == carDealerId, parameter))
                .ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            var result = await service.GetCarsByCarDealerId(carDealerId, parameter);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.IsAssignableFrom<PagedList<CarResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarsCurrentlySelling_ReturnsCarsList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarsCurrentlySelling(parameter, trackChange))
                    .ReturnsAsync(carTestData);
            mockRepo.Setup(repo => repo.CountCarByCondition(c => c.CarSalesInfo != null, parameter))
                .ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            var result = await service.GetCarsCurrentlySelling(parameter);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.IsAssignableFrom<PagedList<CarResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCar_ReturnsCar()
        {
            // Arrange
            bool trackChange = false;
            string vinId = "2T1KR32E28C706767";
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarById(vinId, trackChange))
                    .ReturnsAsync(carTestData.First());
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            var result = await service.GetCar(vinId);
            // Assert
            Assert.IsAssignableFrom<CarResponseDTO>(result);
            Assert.Equal(vinId, result.VinId);
        }

        [Fact]
        public async Task GetCar_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string vinId = "2T1KR32E28C706799";
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarById(vinId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            Func<Task> act = () => service.GetCar(vinId);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateCar_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string vinId = "2T1KR32E28C706799";
            var request = new CarUpdateRequestDTO();
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarById(vinId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            Func<Task> act = () => service.UpdateCar(vinId, request);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteCar_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string vinId = "2T1KR32E28C706799";
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarById(vinId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            Func<Task> act = () => service.DeleteCar(vinId);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }

        [Fact]
        public async Task CreateCarSalesInfo_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string vinId = "2T1KR32E28C706799";
            var request = new CarSalesInfoCreateRequestDTO();
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarById(vinId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            Func<Task> act = () => service.CreateCarSalesInfo(vinId, request);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateCarSalesInfo_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string vinId = "2T1KR32E28C706799";
            var request = new CarSalesInfoUpdateRequestDTO();
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarById(vinId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            Func<Task> act = () => service.UpdateCarSalesInfo(vinId, request);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }

        [Fact]
        public async Task SoldCar_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            string vinId = "2T1KR32E28C706799";
            var request = new CarOwnerHistoryCreateRequestDTO();
            var mockRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarById(vinId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new CarServices(mockUnitOfWork.Object, mapper, mockService.Object, mockcurrentUserService.Object);
            // Act
            Func<Task> act = () => service.SoldCar(vinId, request);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }
    }
}
