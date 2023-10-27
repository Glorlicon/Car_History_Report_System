using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.DataProvider;
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
    public class DataProviderServicesTests
    {
        private IMapper mapper;
        private List<DataProvider> dataProvidersTestData;
        private DataProviderParameter parameter;
        private Mock<IIdentityServices> mockService;
        private Mock<IEmailServices> mockEmailService;
        private Mock<ICarRepository> mockCarRepository;

        public DataProviderServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            dataProvidersTestData = GetDataProviders();
            parameter = new DataProviderParameter();
            mockService = new Mock<IIdentityServices>();
            mockEmailService = new Mock<IEmailServices>();
            mockCarRepository = new Mock<ICarRepository>();
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
                Type = Domain.Enum.DataProviderType.CarDealer,
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
            dataProviders.Add(new DataProvider
            {
                Id = 1002,
                Name = "Data Provider Test 02",
                Description = "This is test description 2",
                Address = "This is test address 2",
                Service = "This is test service 2",
                PhoneNumber = "09825233762",
                Email = "EmailTest2@gmailtest.com",
                Type = Domain.Enum.DataProviderType.VehicleRegistry,
                ImageLink = "image2.jpg",
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
            dataProviders.Add(new DataProvider
            {
                Id = 1003,
                Name = "Data Provider Test 03",
                Description = "This is test description 3",
                Address = "This is test address 3",
                Service = "This is test service 3",
                PhoneNumber = "09836683762",
                Email = "EmailTest3@gmailtest.com",
                Type = Domain.Enum.DataProviderType.ServiceShop,
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
            });dataProviders.Add(new DataProvider
            {
                Id = 1004,
                Name = "Data Provider Test 04",
                Description = "This is test description 4",
                Address = "This is test address 4",
                Service = "This is test service 4",
                PhoneNumber = "09842363762",
                Email = "EmailTest4@gmailtest.com",
                Type = Domain.Enum.DataProviderType.PoliceOffice,
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
            dataProviders.Add(new DataProvider
            {
                Id = 1005,
                Name = "Data Provider Test 05",
                Description = "This is test description 5",
                Address = "This is test address 5",
                Service = "This is test service 5",
                PhoneNumber = "0952346762",
                Email = "EmailTest5@gmailtest.com",
                Type = Domain.Enum.DataProviderType.Manufacturer,
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

        [Fact]
        public async Task GetDataProviders_ReturnsDataProvidersList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockRepo.Setup(repo => repo.GetAllDataProviders(parameter, trackChange))
                    .ReturnsAsync(dataProvidersTestData);
            mockRepo.Setup(repo => repo.CountAll()).ReturnsAsync(3);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object, mockEmailService.Object, mockCarRepository.Object);
            // Act
            var result = await service.GetAllDataProviders(parameter);
            // Assert
            Assert.Equal(5, result.Count());
            Assert.IsAssignableFrom<PagedList<DataProviderDetailsResponseDTO>>(result);
        }

        [Fact]
        public async Task GetDataProvider_ReturnsDataProvider()
        {
            // Arrange
            bool trackChange = false;
            int id = 1001;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockRepo.Setup(repo => repo.GetDataProvider(id, trackChange))
                .ReturnsAsync(dataProvidersTestData.First());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();

            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object, mockEmailService.Object, mockCarRepository.Object);
            // Act
            var result = await service.GetDataProvider(id);
            // Asserts
            Assert.IsAssignableFrom<DataProviderDetailsResponseDTO>(result);
            Assert.Equal(id, result.Id);
        }

        [Fact]
        public async Task GetDataProvider_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 1001;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockRepo.Setup(repo => repo.GetDataProvider(id, trackChange))
                    .ReturnsAsync(value: null);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object, mockEmailService.Object, mockCarRepository.Object);
            // Act
            Func<Task> act = () => service.GetDataProvider(id);
            // Assert
            await Assert.ThrowsAsync<DataProviderNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateDataProvider_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 1001;
            var request = new DataProviderUpdateRequestDTO();
            var mockRepo = new Mock<IDataProviderRepository>();
            mockRepo.Setup(repo => repo.GetDataProvider(id, trackChange))
                    .ReturnsAsync(value: null);
            mockRepo.Setup(repo => repo.SaveAsync());

            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object, mockEmailService.Object, mockCarRepository.Object);
            // Act
            Func<Task> act = () => service.UpdateDataProvider(id, request);
            // Assert
            await Assert.ThrowsAsync<DataProviderNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteDataProvider_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 1001;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockRepo.Setup(repo => repo.GetDataProvider(id, trackChange))
                    .ReturnsAsync(value: null);
            mockRepo.Setup(repo => repo.SaveAsync());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object, mockEmailService.Object, mockCarRepository.Object);
            // Act
            Func<Task> act = () => service.DeleteDataProvider(id);
            // Assert
            await Assert.ThrowsAsync<DataProviderNotFoundException>(act);
        }
    }
}
