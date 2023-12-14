using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Car;
using Application.DTO.CarRecall;
using Application.DTO.CarTracking;
using Application.DTO.Notification;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Infrastructure.Repository;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests
{
    public class NotificationServicesTests
    {
        private IMapper mapper;
        private List<Notification> data;
        private List<UserNotification> userNotificationData;
        private List<CarTracking> carTrackingData;
        private UserNotificationParameter parameter;
        private CarTrackingParameter carTrackingParameter;

        public NotificationServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            data = GetData();
            parameter = new UserNotificationParameter();
            carTrackingParameter = new();
            userNotificationData = GetUserNotificationData();
            carTrackingData = GetCarTrackingData();
        }

        private List<CarTracking> GetCarTrackingData()
        {
            return new List<CarTracking>
            {
                new CarTracking
                {
                    CarId = "Car1",
                    UserId = "User1",
                    CreatedTime = DateTime.Now,
                    IsFollowing = true,
                },
                new CarTracking
                {
                    CarId = "Car2",
                    UserId = "User1",
                    CreatedTime = DateTime.Now,
                    IsFollowing = false,
                },
                new CarTracking
                {
                    CarId = "Car1",
                    UserId = "User2",
                    CreatedTime = DateTime.Now,
                    IsFollowing = true,
                },
                new CarTracking
                {
                    CarId = "Car2",
                    UserId = "User2",
                    CreatedTime = DateTime.Now,
                    IsFollowing = true,
                },
                new CarTracking
                {
                    CarId = "Car3",
                    UserId = "User1",
                    CreatedTime = DateTime.Now,
                    IsFollowing = true,
                },
            };
        }

        private List<UserNotification> GetUserNotificationData()
        {
            return new List<UserNotification>
            {
                new UserNotification
                {
                    NotificationId = 1,
                    UserId = "User1",
                    IsRead = false,
                },
                new UserNotification
                {
                    NotificationId = 1,
                    UserId = "User2",
                    IsRead = false,
                },
                new UserNotification
                {
                    NotificationId = 2,
                    UserId = "User1",
                    IsRead = true,
                },
                new UserNotification
                {
                    NotificationId = 3,
                    UserId = "User1",
                    IsRead = false,
                },
                new UserNotification
                {
                    NotificationId = 3,
                    UserId = "User2",
                    IsRead = false,
                }
            };
        }

        private List<Notification> GetData()
        {
            return new List<Notification>
            {
                new Notification
                {
                    Id = 1,
                    Description = "Test",
                    CreatedByUserId = "User1",
                    ModifiedByUserId = "User1",
                    RelatedCarId = "Car1",
                    RelatedLink = "None",
                    Title = "Test",
                    RelatedUserId = "User1",
                    CreatedTime = DateTime.Now,
                    Type = Domain.Enum.NotificationType.CarRecall
                },
                new Notification
                {
                    Id = 2,
                    Description = "Test",
                    CreatedByUserId = "User1",
                    ModifiedByUserId = "User1",
                    RelatedCarId = "Car1",
                    RelatedLink = "None",
                    Title = "Test 2",
                    RelatedUserId = "User1",
                    CreatedTime = DateTime.Now,
                    Type = Domain.Enum.NotificationType.PoliceAlert
                },
                new Notification
                {
                    Id = 3,
                    Description = "Test",
                    CreatedByUserId = "User1",
                    ModifiedByUserId = "User1",
                    RelatedCarId = "Car2",
                    RelatedLink = "None",
                    Title = "Test 3",
                    RelatedUserId = "User1",
                    CreatedTime = DateTime.Now,
                    Type = Domain.Enum.NotificationType.Request
                },
            };
        }

        [Fact]
        public async Task GetUserNotifications_ReturnsUserNotificationsList()
        {
            // Arrange
            string userId = "User1";
            bool trackChange = false;
            var mockRepo = new Mock<IUserNotificationRepository>();
            mockRepo.Setup(repo => repo.GetUserNotificationsByUserId(userId, parameter, trackChange))
                    .ReturnsAsync(userNotificationData.Where(x => x.UserId == userId));
            mockRepo.Setup(repo => repo.CountByCondition(x => x.UserId == userId, parameter))
                .ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.UserNotificationRepository)
                          .Returns(mockRepo.Object);
            var service = new NotificationServices(mockUnitOfWork.Object, mapper);
            // Act
            var result = await service.GetUserNotifications(userId, parameter);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.Equal(3, result.PagingData.TotalCount);
            Assert.IsAssignableFrom<PagedList<UserNotificationResponseDTO>>(result);
        }

        [Fact]
        public async Task GetUserNotification_ReturnsUserNotificationResponse()
        {
            // Arrange
            bool trackChange = false;
            int notificationId = 1;
            string userId = "User1";
            var mockRepo = new Mock<IUserNotificationRepository>();
            mockRepo.Setup(repo => repo.GetUserNotification(userId, notificationId, trackChange))
                    .ReturnsAsync(userNotificationData.First);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.UserNotificationRepository)
                          .Returns(mockRepo.Object);
            var service = new NotificationServices(mockUnitOfWork.Object, mapper);
            // Act
            var result = await service.GetUserNotification(userId, notificationId);
            // Assert
            Assert.Equal(notificationId, result.NotificationId);
            Assert.Equal(userId, result.UserId);
            Assert.False(result.IsRead);
            Assert.IsAssignableFrom<UserNotificationResponseDTO>(result);
        }

        [Fact]
        public async Task GetUserNotification_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int notificationId = 1;
            string userId = "User1";
            var mockRepo = new Mock<IUserNotificationRepository>();
            mockRepo.Setup(repo => repo.GetUserNotification(userId, notificationId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.UserNotificationRepository)
                          .Returns(mockRepo.Object);
            var service = new NotificationServices(mockUnitOfWork.Object, mapper);
            // Act
            Func<Task> act = () => service.GetUserNotification(userId, notificationId);
            // Assert
            await Assert.ThrowsAsync<UserNotificationNotFoundException>(act);
        }

        [Fact]
        public async Task ReadUserNotification_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            int notificationId = 1;
            string userId = "User1";
            var mockRepo = new Mock<IUserNotificationRepository>();
            mockRepo.Setup(repo => repo.GetUserNotification(userId, notificationId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.UserNotificationRepository)
                          .Returns(mockRepo.Object);
            var service = new NotificationServices(mockUnitOfWork.Object, mapper);
            // Act
            Func<Task> act = () => service.ReadUserNotification(userId, notificationId);
            // Assert
            await Assert.ThrowsAsync<UserNotificationNotFoundException>(act);
        }

        [Fact]
        public async Task GetCarTrackedList_ReturnCarTrackedListResponse()
        {
            // Arrange
            bool trackChange = false;
            string userId = "User1";
            var mockRepo = new Mock<ICarTrackingRepository>();
            mockRepo.Setup(repo => repo.GetCarTrackingsByUserId(userId, carTrackingParameter, trackChange))
                    .ReturnsAsync(carTrackingData.Where(x => x.UserId == userId));
            mockRepo.Setup(repo => repo.CountByCondition(x => x.UserId == userId))
                .ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarTrackingRepository)
                          .Returns(mockRepo.Object);
            var service = new NotificationServices(mockUnitOfWork.Object, mapper);
            // Act
            var result = await service.GetCarTrackedList(userId, carTrackingParameter);
            // Assert
            Assert.Equal(3, result.Count);
            Assert.Equal(3, result.PagingData.TotalCount);
            Assert.IsAssignableFrom<PagedList<CarTrackingResponseDTO>>(result);
        }

        [Fact]
        public async Task StopTrackingCar_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            string carId = "CarNotExist";
            string userId = "User1";
            var mockRepo = new Mock<ICarTrackingRepository>();
            mockRepo.Setup(repo => repo.GetCarTracking(userId, carId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarTrackingRepository)
                          .Returns(mockRepo.Object);
            var service = new NotificationServices(mockUnitOfWork.Object, mapper);
            // Act
            Func<Task> act = () => service.StopTrackingCar(userId, carId);
            // Assert
            await Assert.ThrowsAsync<CarTrackingNotFoundException>(act);
        }

        [Fact]
        public async Task TrackCar_ThrowCarNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            string carId = "CarNotExist";
            string userId = "User1";
            var mockRepo = new Mock<ICarTrackingRepository>();
            var mockCarRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarTracking(userId, carId, trackChange))
                    .ReturnsAsync(value: null);
            mockCarRepo.Setup(repo => repo.IsExist(x => x.VinId == carId))
                    .ReturnsAsync(false);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarTrackingRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            var service = new NotificationServices(mockUnitOfWork.Object, mapper);
            // Act
            Func<Task> act = () => service.TrackCar(userId, carId);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }

        [Fact]
        public async Task TrackCar_ThrowCarAlreadyTrackedException()
        {
            // Arrange
            bool trackChange = true;
            string carId = "Car1";
            string userId = "User1";
            var mockRepo = new Mock<ICarTrackingRepository>();
            var mockCarRepo = new Mock<ICarRepository>();
            mockRepo.Setup(repo => repo.GetCarTracking(userId, carId, trackChange))
                    .ReturnsAsync(carTrackingData.First);
            mockCarRepo.Setup(repo => repo.IsExist(x => x.VinId == carId))
                    .ReturnsAsync(true);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarTrackingRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarRepository)
                          .Returns(mockCarRepo.Object);
            var service = new NotificationServices(mockUnitOfWork.Object, mapper);
            // Act
            Func<Task> act = () => service.TrackCar(userId, carId);
            // Assert
            await Assert.ThrowsAsync<CarAlreadyTrackedException>(act);
        }
    }
}
