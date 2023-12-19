using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Car;
using Application.DTO.CarRegistrationHistory;
using Application.DTO.CarServiceHistory;
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
    public class CarHistoryServicesTests
    {
        private IMapper mapper;
        private List<CarServiceHistory> carHistoryTestData;
        private CarServiceHistoryParameter parameter;
        private Mock<IAuthenticationServices> mockAuthenticationServices;
        private Mock<INotificationServices> mockNotificationServices;

        public CarHistoryServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            carHistoryTestData = GetCarHistoryData();
            parameter = new CarServiceHistoryParameter();
            mockNotificationServices = new Mock<INotificationServices>();
            mockAuthenticationServices = new Mock<IAuthenticationServices>();
        }

        private List<CarServiceHistory> GetCarHistoryData()
        {
            var carHistorys = new List<CarServiceHistory>();
            carHistorys.Add(
                new CarServiceHistory
                {
                    Id = 1,
                    CarId = "Car1",
                    CreatedByUserId = "User1",
                    CreatedByUser = new User
                    {
                        Id = "User1",
                        DataProviderId = 1,
                        DataProvider = new DataProvider
                        {
                            Id = 1,
                            Name = "Data Provider 1"
                        }
                    },
                    CreatedTime = DateTime.Now,
                    ReportDate = new DateOnly(2023,1,1),
                    Odometer = 0,
                    ModifiedByUserId = "User1",
                    Note = "note",
                    OtherServices = "None",
                    ServiceTime = DateTime.Now,
                    Services = Domain.Enum.CarServiceType.TireRotation
                }
            );
            carHistorys.Add(
                new CarServiceHistory
                {
                    Id = 2,
                    CarId = "Car1",
                    CreatedByUserId = "User2",
                    CreatedByUser = new User
                    {
                        Id = "User2",
                        DataProviderId = 2,
                        DataProvider = new DataProvider
                        {
                            Id = 1,
                            Name = "Data Provider 2"
                        }
                    },
                    CreatedTime = DateTime.Now,
                    ReportDate = new DateOnly(2023, 1, 1),
                    Odometer = 12,
                    ModifiedByUserId = "User2",
                    Note = "note",
                    OtherServices = "None",
                    ServiceTime = DateTime.Now,
                    Services = Domain.Enum.CarServiceType.TireRotation
                }
            );
            carHistorys.Add(
                new CarServiceHistory
                {
                    Id = 3,
                    CarId = "Car2",
                    CreatedByUserId = "User1",
                    CreatedByUser = new User
                    {
                        Id = "User1",
                        DataProviderId = 1,
                        DataProvider = new DataProvider
                        {
                            Id = 1,
                            Name = "Data Provider 1"
                        }
                    },
                    CreatedTime = DateTime.Now,
                    ReportDate = new DateOnly(2023, 1, 1),
                    Odometer = 34,
                    ModifiedByUserId = "User1",
                    Note = "note",
                    OtherServices = "None",
                    ServiceTime = DateTime.Now,
                    Services = Domain.Enum.CarServiceType.TireRotation
                }
            );
            return carHistorys;
        }

        [Fact]
        public async Task GetAllCarHistorys_ReturnsCarHistorysList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>>();
            mockRepo.Setup(repo => repo.GetAllCarHistorys(parameter, trackChange))
                    .ReturnsAsync(carHistoryTestData);
            mockRepo.Setup(repo => repo.CountAllCarHistory(parameter)).ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockCarRepo = new Mock<ICarRepository>();
            var service = new CarHistoryServices<CarServiceHistory,
                                             CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>(mockRepo.Object, mapper, mockCarRepo.Object, mockNotificationServices.Object, mockAuthenticationServices.Object,mockUnitOfWork.Object);
            // Act
            var result = await service.GetAllCarHistorys(parameter);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.Equal(3, result.PagingData.TotalCount);
            Assert.IsAssignableFrom<PagedList<CarServiceHistoryResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarHistory_ReturnsCarHistoryResponse()
        {
            // Arrange
            bool trackChange = false;
            int id = 1;
            var mockRepo = new Mock<ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>>();
            mockRepo.Setup(repo => repo.GetCarHistoryById(id, trackChange))
                    .ReturnsAsync(carHistoryTestData.First);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockCarRepo = new Mock<ICarRepository>();
            var service = new CarHistoryServices<CarServiceHistory,
                                             CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>(mockRepo.Object, mapper, mockCarRepo.Object, mockNotificationServices.Object, mockAuthenticationServices.Object, mockUnitOfWork.Object);
            // Act
            var result = await service.GetCarHistory(id);
            // Assert
            Assert.Equal(1, result.Id);
            Assert.Equal("Data Provider 1", result.Source);
            Assert.IsAssignableFrom<CarServiceHistoryResponseDTO>(result);
        }

        [Fact]
        public async Task GetCarHistory_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = -1;
            var mockRepo = new Mock<ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>>();
            mockRepo.Setup(repo => repo.GetCarHistoryById(id, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockCarRepo = new Mock<ICarRepository>();
            var service = new CarHistoryServices<CarServiceHistory,
                                             CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>(mockRepo.Object, mapper, mockCarRepo.Object, mockNotificationServices.Object, mockAuthenticationServices.Object, mockUnitOfWork.Object);
            // Act
            Func<Task> act = () => service.GetCarHistory(id);
            // Assert
            await Assert.ThrowsAsync<CarHistoryRecordNotFoundException>(act);
        }

        [Fact]
        public async Task GetCarHistoryByCarId_ReturnsCarHistorysList()
        {
            // Arrange
            bool trackChange = false;
            string vinId = "Car1";
            var mockRepo = new Mock<ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>>();
            mockRepo.Setup(repo => repo.GetCarHistorysByCarId(vinId, parameter, trackChange))
                    .ReturnsAsync(carHistoryTestData.Where(x => x.CarId == vinId));
            mockRepo.Setup(repo => repo.CountCarHistoryByCondition(x => x.CarId == vinId, parameter)).ReturnsAsync(2);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockCarRepo = new Mock<ICarRepository>();
            var service = new CarHistoryServices<CarServiceHistory,
                                             CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>(mockRepo.Object, mapper, mockCarRepo.Object, mockNotificationServices.Object, mockAuthenticationServices.Object, mockUnitOfWork.Object);
            // Act
            var result = await service.GetCarHistoryByCarId(vinId, parameter);
            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal(2, result.PagingData.TotalCount);
            Assert.IsAssignableFrom<PagedList<CarServiceHistoryResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarHistoryByDataProviderId_ReturnsCarHistorysList()
        {
            // Arrange
            bool trackChange = false;
            int dataProviderId = 1;
            var mockRepo = new Mock<ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>>();
            mockRepo.Setup(repo => repo.GetCarHistorysByDataProviderId(dataProviderId, parameter, trackChange))
                    .ReturnsAsync(carHistoryTestData.Where(x => x.CreatedByUserId == "User1"));
            mockRepo.Setup(repo => repo.CountCarHistoryByCondition(x => x.CreatedByUser.DataProviderId == dataProviderId, parameter)).ReturnsAsync(2);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockCarRepo = new Mock<ICarRepository>();
            var service = new CarHistoryServices<CarServiceHistory,
                                             CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>(mockRepo.Object, mapper, mockCarRepo.Object, mockNotificationServices.Object, mockAuthenticationServices.Object, mockUnitOfWork.Object);
            // Act
            var result = await service.GetCarHistoryByDataProviderId(dataProviderId, parameter);
            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal(2, result.PagingData.TotalCount);
            Assert.IsAssignableFrom<PagedList<CarServiceHistoryResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarHistoryByUserId_ReturnsCarHistorysList()
        {
            // Arrange
            bool trackChange = false;
            string userId = "User1";
            var mockRepo = new Mock<ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>>();
            mockRepo.Setup(repo => repo.GetCarHistorysByUserId(userId, parameter, trackChange))
                    .ReturnsAsync(carHistoryTestData.Where(x => x.CreatedByUserId == userId));
            mockRepo.Setup(repo => repo.CountCarHistoryByCondition(x => x.CreatedByUserId == userId, parameter)).ReturnsAsync(2);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockCarRepo = new Mock<ICarRepository>();
            var service = new CarHistoryServices<CarServiceHistory,
                                             CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>(mockRepo.Object, mapper, mockCarRepo.Object, mockNotificationServices.Object, mockAuthenticationServices.Object, mockUnitOfWork.Object);
            // Act
            var result = await service.GetCarHistoryByUserId(userId, parameter);
            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal(2, result.PagingData.TotalCount);
            Assert.IsAssignableFrom<PagedList<CarServiceHistoryResponseDTO>>(result);
        }

        [Fact]
        public async Task CreateCarHistory_ThrowCarNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            string vinId = "CarNotExist";
            var CarHistoryCreateRequestDTO = new CarServiceHistoryCreateRequestDTO
            {
                CarId = vinId,
            };
            var mockRepo = new Mock<ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.GetCarById(vinId, trackChange))
                    .ReturnsAsync(value: null);
            var service = new CarHistoryServices<CarServiceHistory,
                                             CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>(mockRepo.Object, mapper, mockCarRepo.Object, mockNotificationServices.Object, mockAuthenticationServices.Object, mockUnitOfWork.Object);
            // Act
            Func<Task> act = () => service.CreateCarHistory(CarHistoryCreateRequestDTO);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateCarHistory_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            int id = -1;
            var CarHistoryUpdateRequestDTO = new CarServiceHistoryUpdateRequestDTO
            {

            };
            var mockRepo = new Mock<ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>>();
            mockRepo.Setup(repo => repo.GetCarHistoryById(id, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockCarRepo = new Mock<ICarRepository>();
            var service = new CarHistoryServices<CarServiceHistory,
                                             CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>(mockRepo.Object, mapper, mockCarRepo.Object, mockNotificationServices.Object, mockAuthenticationServices.Object, mockUnitOfWork.Object);
            // Act
            Func<Task> act = () => service.UpdateCarHistory(id, CarHistoryUpdateRequestDTO);
            // Assert
            await Assert.ThrowsAsync<CarHistoryRecordNotFoundException>(act);
        }

        [Fact]
        public async Task CreateCarHistoryCollection_ThrowCarNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            string vinId = "Car1";
            string vinIdNotExist = "CarNotExist";
            var CarHistoryCreateRequestDTOs = new List<CarServiceHistoryCreateRequestDTO>
            {
                new CarServiceHistoryCreateRequestDTO
                {
                    CarId = vinId
                },
                new CarServiceHistoryCreateRequestDTO
                {
                    CarId = vinIdNotExist
                }
            };
            var mockRepo = new Mock<ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.GetCarById(vinId, trackChange))
                    .ReturnsAsync(value: new Car { VinId = vinId});
            mockCarRepo.Setup(repo => repo.GetCarById(vinIdNotExist, trackChange))
                    .ReturnsAsync(value: null);
            var service = new CarHistoryServices<CarServiceHistory,
                                             CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>(mockRepo.Object, mapper, mockCarRepo.Object, mockNotificationServices.Object, mockAuthenticationServices.Object, mockUnitOfWork.Object);
            // Act
            Func<Task> act = () => service.CreateCarHistoryCollection(CarHistoryCreateRequestDTOs);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }

        [Fact]
        public async Task CreateCarHistoryCollection_ThrowNullCollectionException()
        {
            // Arrange
            bool trackChange = true;
            string vinId = "Car1";
            string vinIdNotExist = "CarNotExist";
            List<CarServiceHistoryCreateRequestDTO> CarHistoryCreateRequestDTOs = null;
            var mockRepo = new Mock<ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockCarRepo = new Mock<ICarRepository>();
            mockCarRepo.Setup(repo => repo.GetCarById(vinId, trackChange))
                    .ReturnsAsync(value: new Car { VinId = vinId });
            mockCarRepo.Setup(repo => repo.GetCarById(vinIdNotExist, trackChange))
                    .ReturnsAsync(value: null);
            var service = new CarHistoryServices<CarServiceHistory,
                                             CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>(mockRepo.Object, mapper, mockCarRepo.Object, mockNotificationServices.Object, mockAuthenticationServices.Object, mockUnitOfWork.Object);
            // Act
            Func<Task> act = () => service.CreateCarHistoryCollection(CarHistoryCreateRequestDTOs);
            // Assert
            await Assert.ThrowsAsync<NullCollectionException>(act);
        }
    }
}
