using Application.Common;
using Application.DomainServices;
using Application.DTO.DataProvider;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
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
    public class IdentityServicesTests
    {
        private IMapper mapper;
        private List<User> usersTestData;
        private List<DataProvider> dataProvidersTestData;
        private Mock<IUnitOfWork> mockUnitOfWork;


        public IdentityServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            usersTestData = GetUsers();
            dataProvidersTestData = GetDataProviders();
            mockUnitOfWork = new Mock<IUnitOfWork>();
        }

        private List<DataProvider> GetDataProviders()
        {
            var dataProviders = new List<DataProvider>();
            dataProviders.Add(new DataProvider
            {
                Id = 1001,
                Name = "Data Provider Test 01",
                Description = "This is test description 1",
                Address = "This is test address 1",
                Service = "This is test service 1",
                PhoneNumber = "0981235762",
                Email = "EmailTest1@gmailtest.com",
                Type = DataProviderType.CarDealer,
                ImageLink = "image.jpg",
                WorkingTimes = new WorkingTime[]
                {
                    new WorkingTime
                    {
                        DayOfWeek = 1,
                        StartTime = new TimeOnly(8, 30),
                        EndTime = new TimeOnly(18, 0),
                        IsClosed = false
                    },
                    new WorkingTime
                    {
                        DayOfWeek = 2,
                        StartTime = new TimeOnly(8, 30),
                        EndTime = new TimeOnly(18, 0),
                        IsClosed = false
                    },
                    new WorkingTime
                    {
                        DayOfWeek = 3,
                        StartTime = new TimeOnly(8, 30),
                        EndTime = new TimeOnly(18, 0),
                        IsClosed = false
                    },
                    new WorkingTime
                    {
                        DayOfWeek = 4,
                        StartTime = new TimeOnly(8, 30),
                        EndTime = new TimeOnly(18, 0),
                        IsClosed = false
                    },
                    new WorkingTime
                    {
                        DayOfWeek = 4,
                        StartTime = new TimeOnly(8, 30),
                        EndTime = new TimeOnly(18, 0),
                        IsClosed = false
                    },
                    new WorkingTime
                    {
                        DayOfWeek = 5,
                        StartTime = new TimeOnly(8, 30),
                        EndTime = new TimeOnly(18, 0),
                        IsClosed = false
                    },
                    new WorkingTime
                    {
                        DayOfWeek = 6,
                        StartTime = new TimeOnly(8, 30),
                        EndTime = new TimeOnly(18, 0),
                        IsClosed = false
                    },
                    new WorkingTime
                    {
                        DayOfWeek = 0,
                        StartTime = new TimeOnly(8, 30),
                        EndTime = new TimeOnly(18, 0),
                        IsClosed = false
                    }
                }
            });
            return dataProviders;
        }

        public List<User> GetUsers()
        {
            var users = new List<User>();
            users.Add(new User
            {
                FirstName = "Name",
                LastName = "Test",
                DataProviderId = 1,
                DataProvider = dataProvidersTestData.First(),

            });
            return users;
        }
        //[Fact]
        //public async Task GetCurrentCarOwner_ReturnsNotFoundException()
        //{
        //    // Arrange
        //    bool trackChange = false;
        //    string vinId = "Car1";
        //    var mockRepo = new Mock<ICarOwnerHistoryRepository>();
        //    mockRepo.Setup(repo => repo.GetCurrentCarOwner(vinId, trackChange))
        //            .ReturnsAsync(value: null);
        //    var mockUnitOfWork = new Mock<IUnitOfWork>();
        //    mockUnitOfWork.Setup(uow => uow.CarOwnerHistoryRepository)
        //                  .Returns(mockRepo.Object);
        //    var service = new CarOwnerHistoryServices(mockUnitOfWork.Object, mapper);
        //    // Act
        //    Func<Task> act = () => service.GetCurrentCarOwner(vinId);
        //    // Assert
        //    await Assert.ThrowsAsync<CarHistoryNotFoundException>(act);
        //}
    }
}
