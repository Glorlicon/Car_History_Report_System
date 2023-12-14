using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Car;
using Application.DTO.CarReport;
using Application.DTO.Order;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests
{
    public class CarReportServicesTests
    {
        private IMapper mapper;
        private List<CarReport> data;
        private Mock<ICurrentUserServices> mockcurrentUserService;

        public CarReportServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            data = GetData();
            mockcurrentUserService = new Mock<ICurrentUserServices>();
        }

        private List<CarReport> GetData()
        {
            return new List<CarReport>
            {
                new CarReport
                {
                    CarId = "Car1",
                    UserId = "User1",
                    CreatedDate = new DateOnly(2023,1,1)
                },
                new CarReport
                {
                    CarId = "Car2",
                    UserId = "User1",
                    CreatedDate = new DateOnly(2023,1,1)
                },
                new CarReport
                {
                    CarId = "Car1",
                    UserId = "User1",
                    CreatedDate = new DateOnly(2023,12,12)
                },
                new CarReport
                {
                    CarId = "Car1",
                    UserId = "User2",
                    CreatedDate = new DateOnly(2023,1,1)
                },
                new CarReport
                {
                    CarId = "Car3",
                    UserId = "User1",
                    CreatedDate = new DateOnly(2023,1,1)
                },
                new CarReport
                {
                    CarId = "Car2",
                    UserId = "User2",
                    CreatedDate = new DateOnly(2023,1,1)
                },
            };
        }

        [Fact]
        public async Task GetCarReportsByUserId_ReturnsCarReportsList()
        {
            // Arrange
            bool trackChange = false;
            string userId = "User1";
            var mockRepo = new Mock<ICarReportRepository>();
            mockRepo.Setup(repo => repo.GetByUserId(userId, trackChange))
                    .ReturnsAsync(data.Where(x => x.UserId == userId));
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            var result = await service.GetCarReportsByUserId(userId);
            // Assert
            Assert.Equal(4, result.Count());
            Assert.IsAssignableFrom<IEnumerable<CarReportResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarReportById_ReturnsCarReportResponse()
        {
            // Arrange
            bool trackChange = false;
            string carId = "Car1";
            string userId = "User1";
            DateOnly date = new DateOnly(2023, 1, 1);
            var mockRepo = new Mock<ICarReportRepository>();
            mockRepo.Setup(repo => repo.GetById(carId, userId, date, trackChange))
                    .ReturnsAsync(data.SingleOrDefault(x => x.UserId == userId && x.CarId == carId && x.CreatedDate == date));
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            var result = await service.GetCarReportById(carId,userId,date);
            // Assert
            Assert.Equal(carId, result.CarId);
            Assert.Equal(userId, result.UserId);
            Assert.Equal(date, result.CreatedDate);
            Assert.IsAssignableFrom<CarReportResponseDTO>(result);
        }

        [Fact]
        public async Task GetOrder_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string carId = "Car1";
            string userId = "User1";
            DateOnly date = new DateOnly(2023, 1, 12);
            var mockRepo = new Mock<ICarReportRepository>();
            mockRepo.Setup(repo => repo.GetById(carId, userId, date, trackChange))
                    .ReturnsAsync(data.SingleOrDefault(x => x.UserId == userId && x.CarId == carId && x.CreatedDate == date));
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            Func<Task> act = () => service.GetCarReportById(carId, userId, date);
            // Assert
            await Assert.ThrowsAsync<CarReportNotFoundException>(act);
        }

        [Fact]
        public async Task AddCarReport_ThrowCarNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            var request = new CarReportCreateRequestDTO
            {
                CarId = "CarNotExist",
                UserId = "User1"
            };
            int maxReportNumber = 1;
            var mockRepo = new Mock<ICarReportRepository>();

            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.IsExist(x => x.VinId == request.CarId))
                    .ReturnsAsync(false);

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(request.UserId, true))
                .ReturnsAsync(value: new User { Id = "User1", MaxReportNumber = maxReportNumber });

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);

            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            Func<Task> act = () => service.AddCarReportToUserCarReportList(request);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }

        [Fact]
        public async Task AddCarReport_ThrowUserNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            var request = new CarReportCreateRequestDTO
            {
                CarId = "Car1",
                UserId = "UserNotExist"
            };
            int maxReportNumber = 1;
            var mockRepo = new Mock<ICarReportRepository>();

            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.IsExist(x => x.VinId == request.CarId))
                    .ReturnsAsync(true);

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(request.UserId, true))
                .ReturnsAsync(value: null);

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);

            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            Func<Task> act = () => service.AddCarReportToUserCarReportList(request);
            // Assert
            await Assert.ThrowsAsync<UserNotFoundException>(act);
        }

        [Fact]
        public async Task AddCarReport_ThrowNotEnoughReportException()
        {
            // Arrange
            bool trackChange = false;
            var request = new CarReportCreateRequestDTO
            {
                CarId = "Car1",
                UserId = "User1"
            };
            int maxReportNumber = 0;
            var mockRepo = new Mock<ICarReportRepository>();

            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.IsExist(x => x.VinId == request.CarId))
                    .ReturnsAsync(true);

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(request.UserId, true))
                .ReturnsAsync(new User { Id = "User1", MaxReportNumber = maxReportNumber });

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);

            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            Func<Task> act = () => service.AddCarReportToUserCarReportList(request);
            // Assert
            await Assert.ThrowsAsync<NotEnoughReportException>(act);
        }

        [Fact]
        public async Task GetCarReportDataByCarId_ThrowCarNotFoundException()
        {
            // Arrange
            bool trackChange = false;

            string carId = "CarNotExist";
            string userId = "User1";
            DateOnly date = new DateOnly(2023, 1, 1);

            var mockRepo = new Mock<ICarReportRepository>();

            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.GetCarReportDataById(carId, trackChange))
                    .ReturnsAsync(value: null);

            mockcurrentUserService.Setup(s => s.GetCurrentUserId())
                    .Returns(userId);

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(userId, true))
                .ReturnsAsync(new User { Id = "User1", MaxReportNumber = 1, Role = Role.User});

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);

            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            Func<Task> act = () => service.GetCarReportDataByCarId(carId, date);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }

        [Fact]
        public async Task GetCarReportDataByCarId_CheckAccessReport_ThrowUserNotFoundException()
        {
            // Arrange
            bool trackChange = false;

            string carId = "Car1";
            string userId = "User1";
            DateOnly date = new DateOnly(2023, 1, 1);

            var mockRepo = new Mock<ICarReportRepository>();

            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.GetCarReportDataById(carId, trackChange))
                    .ReturnsAsync(value: new Car { VinId = carId});

            mockcurrentUserService.Setup(s => s.GetCurrentUserId())
                    .Returns(userId);

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(userId, true))
                .ReturnsAsync(value: null);

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);

            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            Func<Task> act = () => service.GetCarReportDataByCarId(carId, date);
            // Assert
            await Assert.ThrowsAsync<UserNotFoundException>(act);
        }

        [Fact]
        public async Task GetCarReportDataByCarId_CheckAccessReport_ThrowCarReportAccessUnauthorized_Manufacturer()
        {
            // Arrange
            bool trackChange = false;

            string carId = "Car1";
            string userId = "User1";
            DateOnly date = new DateOnly(2023, 1, 1);

            var mockRepo = new Mock<ICarReportRepository>();

            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.GetCarReportDataById(carId, trackChange))
                    .ReturnsAsync(value: new Car
                                {
                                    VinId = carId,
                                    Model = new CarSpecification
                                    {
                                        ManufacturerId = 2
                                    }
                                });

            mockcurrentUserService.Setup(s => s.GetCurrentUserId())
                    .Returns(userId);

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(userId, true))
                .ReturnsAsync(value: new User { Id = userId, Role = Role.Manufacturer, DataProviderId = 1});

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);

            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            Func<Task> act = () => service.GetCarReportDataByCarId(carId, date);
            // Assert
            await Assert.ThrowsAsync<CarReportAccessUnauthorized>(act);
        }

        [Fact]
        public async Task GetCarReportDataByCarId_CheckAccessReport_ThrowCarReportAccessUnauthorized_Insurance()
        {
            // Arrange
            bool trackChange = false;

            string carId = "Car1";
            string userId = "User1";
            DateOnly date = new DateOnly(2023, 1, 1);

            var mockRepo = new Mock<ICarReportRepository>();

            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.GetCarReportDataById(carId, trackChange))
                    .ReturnsAsync(value: new Car
                    {
                        VinId = carId,
                        Model = new CarSpecification
                        {
                            ManufacturerId = 1
                        },
                        CarInsurances = new List<CarInsurance>
                        {
                            new CarInsurance{ CarId = carId, CreatedByUserId = "User2"},
                            new CarInsurance{ CarId = carId, CreatedByUserId = "User3"}
                        }
                    });

            mockcurrentUserService.Setup(s => s.GetCurrentUserId())
                    .Returns(userId);

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(userId, true))
                .ReturnsAsync(value: new User { Id = userId, Role = Role.InsuranceCompany, DataProviderId = 1 });

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);

            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            Func<Task> act = () => service.GetCarReportDataByCarId(carId, date);
            // Assert
            await Assert.ThrowsAsync<CarReportAccessUnauthorized>(act);
        }

        [Fact]
        public async Task GetCarReportDataByCarId_CheckAccessReport_Insurance_OK()
        {
            // Arrange
            bool trackChange = false;

            string carId = "Car1";
            string userId = "User1";
            DateOnly date = new DateOnly(2023, 1, 1);

            var mockRepo = new Mock<ICarReportRepository>();

            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.GetCarReportDataById(carId, trackChange))
                    .ReturnsAsync(value: new Car
                    {
                        VinId = carId,
                        Model = new CarSpecification
                        {
                            ManufacturerId = 1
                        },
                        CarInsurances = new List<CarInsurance>
                        {
                            new CarInsurance{ CarId = carId, CreatedByUserId = "User2"},
                            new CarInsurance{ CarId = carId, CreatedByUserId = "User1"}
                        }
                    });

            mockcurrentUserService.Setup(s => s.GetCurrentUserId())
                    .Returns(userId);

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(userId, true))
                .ReturnsAsync(value: new User { Id = userId, Role = Role.InsuranceCompany, DataProviderId = 1 });

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);

            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            await service.GetCarReportDataByCarId(carId, date);
            // Assert
        }

        [Fact]
        public async Task GetCarReportDataByCarId_CheckAccessReport_ThrowNotEnoughReportException_User()
        {
            // Arrange
            bool trackChange = false;

            string carId = "Car1";
            string userId = "User1";
            DateOnly date = new DateOnly(2023, 1, 1);

            var mockRepo = new Mock<ICarReportRepository>();
            mockRepo.Setup(repo => repo.GetById(carId, userId, date, trackChange))
                .ReturnsAsync(value: null);

            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.GetCarReportDataById(carId, trackChange))
                    .ReturnsAsync(value: new Car
                    {
                        VinId = carId
                    });

            mockcurrentUserService.Setup(s => s.GetCurrentUserId())
                    .Returns(userId);

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(userId, true))
                .ReturnsAsync(value: new User { Id = userId, Role = Role.User, MaxReportNumber = 0});

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);

            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            Func<Task> act = () => service.GetCarReportDataByCarId(carId, date);
            // Assert
            await Assert.ThrowsAsync<NotEnoughReportException>(act);
        }

        [Fact]
        public async Task GetCarReportDataByCarId_CheckAccessReport_ThrowCarReportNotFoundException_User()
        {
            // Arrange
            bool trackChange = false;

            string carId = "Car1";
            string userId = "User1";
            DateOnly date = new DateOnly(2023, 1, 2);

            var mockRepo = new Mock<ICarReportRepository>();
            mockRepo.Setup(repo => repo.GetById(carId, userId, date, trackChange))
                .ReturnsAsync(value: null);

            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.GetCarReportDataById(carId, trackChange))
                    .ReturnsAsync(value: new Car
                    {
                        VinId = carId
                    });

            mockcurrentUserService.Setup(s => s.GetCurrentUserId())
                    .Returns(userId);

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(userId, true))
                .ReturnsAsync(value: new User { Id = userId, Role = Role.User, MaxReportNumber = 2 });

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);

            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            Func<Task> act = () => service.GetCarReportDataByCarId(carId, date);
            // Assert
            await Assert.ThrowsAsync<CarReportNotFoundException>(act);
        }

        [Fact]
        public async Task GetCarReportDataByCarId_ReturnCarReportDataResponseDTO()
        {
            // Arrange
            bool trackChange = false;

            string carId = "Car1";
            string userId = "User1";
            DateOnly date = new DateOnly(2023, 1, 1);

            var mockRepo = new Mock<ICarReportRepository>();
            mockRepo.Setup(repo => repo.GetById(carId, userId, date, trackChange))
                .ReturnsAsync(data.First);

            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.GetCarReportDataById(carId, trackChange))
                    .ReturnsAsync(value: new Car
                    {
                        VinId = carId,
                        Model = new CarSpecification
                        {
                            ModelID = "Model1",
                            ReleasedDate = date,
                        },
                        CarOwnerHistories = new List<CarOwnerHistory>(),

                    });

            mockcurrentUserService.Setup(s => s.GetCurrentUserId())
                    .Returns(userId);

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.GetUserByUserId(userId, true))
                .ReturnsAsync(value: new User { Id = userId, Role = Role.User, MaxReportNumber = 2 });

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarReportRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            mockUnitOfWork.Setup(uow => uow.UserRepository)
                            .Returns(mockUserRepository.Object);

            var service = new CarReportServices(mockUnitOfWork.Object, mockcurrentUserService.Object, mapper);
            // Act
            var result = await service.GetCarReportDataByCarId(carId, date);
            // Assert
            Assert.IsType<CarReportDataResponseDTO>(result);
            Assert.Equal(carId, result.VinId);
        }
    }
}
