using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
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
    public class CarOwnerHistoryServicesTests
    {
        private IMapper mapper;
        private List<CarOwnerHistory> testData;
        private CarOwnerHistoryParameter parameter;

        public CarOwnerHistoryServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            testData = GetTestData();
            parameter = new CarOwnerHistoryParameter();
        }

        private List<CarOwnerHistory> GetTestData()
        {
            var lists = new List<CarOwnerHistory>();
            lists.Add(new CarOwnerHistory
            {
                Id= 1,
                Name = "Owner 1",
                CarId = "Car1",
                StartDate = new DateOnly(2023,1,1),
                EndDate = null
            });
            lists.Add(new CarOwnerHistory
            {
                Id = 2,
                Name = "Owner 2",
                CarId = "Car1"
            });
            lists.Add(new CarOwnerHistory
            {
                Id = 3,
                Name = "Owner 3",
                CarId = "Car2"
            });
            return lists;
        }

        [Fact]
        public async Task GetAllCarOwnerHistorys_ReturnsCarOwnerHistorysList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<ICarOwnerHistoryRepository>();
            mockRepo.Setup(repo => repo.GetAllCarOwnerHistorys(parameter, trackChange))
                    .ReturnsAsync(testData);
            mockRepo.Setup(repo => repo.CountAll()).ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarOwnerHistoryRepository)
                          .Returns(mockRepo.Object);
            var service = new CarOwnerHistoryServices(mockUnitOfWork.Object, mapper);
            // Act
            var result = await service.GetAllCarOwnerHistorys(parameter);
            // Assert
            Assert.IsAssignableFrom<PagedList<CarOwnerHistoryResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarOwnerHistoryByCarId_ReturnsCarOwnerHistorysList()
        {
            // Arrange
            string vinId = "Car1";
            bool trackChange = false;
            var mockRepo = new Mock<ICarOwnerHistoryRepository>();
            mockRepo.Setup(repo => repo.GetCarOwnerHistorysByCarId(vinId, parameter, trackChange))
                    .ReturnsAsync(testData);
            mockRepo.Setup(repo => repo.CountByCondition(x => x.CarId == vinId)).ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarOwnerHistoryRepository)
                          .Returns(mockRepo.Object);
            var service = new CarOwnerHistoryServices(mockUnitOfWork.Object, mapper);
            // Act
            var result = await service.GetCarOwnerHistoryByCarId(vinId, parameter);
            // Assert
            Assert.IsAssignableFrom<PagedList<CarOwnerHistoryResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarOwnerHistory_ReturnsCarOwnerHistory()
        {
            // Arrange
            bool trackChange = false;
            int id = 1;
            var mockRepo = new Mock<ICarOwnerHistoryRepository>();
            mockRepo.Setup(repo => repo.GetCarOwnerHistoryById(id, trackChange))
                    .ReturnsAsync(testData.First());
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarOwnerHistoryRepository)
                          .Returns(mockRepo.Object);
            var service = new CarOwnerHistoryServices(mockUnitOfWork.Object, mapper);
            // Act
            var result = await service.GetCarOwnerHistory(id);
            // Assert
            Assert.IsAssignableFrom<CarOwnerHistoryResponseDTO>(result);
        }

        [Fact]
        public async Task GetCarOwnerHistory_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 1;
            var mockRepo = new Mock<ICarOwnerHistoryRepository>();
            mockRepo.Setup(repo => repo.GetCarOwnerHistoryById(id, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarOwnerHistoryRepository)
                          .Returns(mockRepo.Object);
            var service = new CarOwnerHistoryServices(mockUnitOfWork.Object, mapper);
            // Act
            Func<Task> act = () => service.GetCarOwnerHistory(id);
            // Assert
            await Assert.ThrowsAsync<CarHistoryRecordNotFoundException>(act);
        }

        [Fact]
        public async Task GetCurrentCarOwner_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string vinId = "Car1";
            var mockRepo = new Mock<ICarOwnerHistoryRepository>();
            mockRepo.Setup(repo => repo.GetCurrentCarOwner(vinId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarOwnerHistoryRepository)
                          .Returns(mockRepo.Object);
            var service = new CarOwnerHistoryServices(mockUnitOfWork.Object, mapper);
            // Act
            Func<Task> act = () => service.GetCurrentCarOwner(vinId);
            // Assert
            await Assert.ThrowsAsync<CarHistoryNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateCar_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 1;
            var request = new CarOwnerHistoryUpdateRequestDTO();
            var mockRepo = new Mock<ICarOwnerHistoryRepository>();
            mockRepo.Setup(repo => repo.GetCarOwnerHistoryById(id, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarOwnerHistoryRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new CarOwnerHistoryServices(mockUnitOfWork.Object, mapper);
            // Act
            Func<Task> act = () => service.UpdateCarOwnerHistory(id, request);
            // Assert
            await Assert.ThrowsAsync<CarHistoryRecordNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteCar_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 1;
            var mockRepo = new Mock<ICarOwnerHistoryRepository>();
            mockRepo.Setup(repo => repo.GetCarOwnerHistoryById(id, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarOwnerHistoryRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new CarOwnerHistoryServices(mockUnitOfWork.Object, mapper);
            // Act
            Func<Task> act = () => service.DeleteCarOwnerHistory(id);
            // Assert
            await Assert.ThrowsAsync<CarHistoryRecordNotFoundException>(act);
        }

        [Fact]
        public async Task CreateCarOwnerHistory_AddEndDateToCurrentOwner()
        {
            // Arrange
            bool trackChange = true;
            var request = new CarOwnerHistoryCreateRequestDTO
            {
                CarId = "Car1",
                StartDate = new DateOnly(2023,6,8)
            };
            var currentOwner = new CarOwnerHistory
            {
                Id = 1,
                Name = "Owner 1",
                CarId = "Car1",
                StartDate = new DateOnly(2023, 1, 1),
                EndDate = null
            };
            var mockRepo = new Mock<ICarOwnerHistoryRepository>();
            mockRepo.Setup(repo => repo.GetCurrentCarOwner(request.CarId, trackChange))
                .ReturnsAsync(currentOwner);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarOwnerHistoryRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new CarOwnerHistoryServices(mockUnitOfWork.Object, mapper);
            // Act
            await service.CreateCarOwnerHistory(request);
            // Assert
            Assert.Equal(currentOwner.EndDate, request.StartDate.Value.AddDays(-1));
        }
    }
}
