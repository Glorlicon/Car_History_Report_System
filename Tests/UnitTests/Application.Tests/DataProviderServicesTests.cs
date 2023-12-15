using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.DataProvider;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
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
        private List<Car> carsTestData;
        private List<Review> reviewsTestData;
        private DataProviderParameter parameter;
        private Mock<IIdentityServices> mockService;
        private Mock<IEmailServices> mockEmailService;
        private Mock<ICarRepository> mockCarRepository;
        private Mock<IAuthenticationServices> mockAuthenticationService;
        private Mock<IReviewRepository> mockReviewRepository;

        public DataProviderServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            dataProvidersTestData = GetDataProviders();
            carsTestData = GetCars();
            reviewsTestData = GetReviews();
            parameter = new DataProviderParameter();
            mockService = new Mock<IIdentityServices>();
            mockEmailService = new Mock<IEmailServices>();
            mockCarRepository = new Mock<ICarRepository>();
            mockAuthenticationService = new Mock<IAuthenticationServices>();
            mockReviewRepository = new Mock<IReviewRepository>();
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
            dataProviders.Add(new DataProvider
            {
                Id = 1002,
                Name = "Data Provider Test 02",
                Description = "This is test description 2",
                Address = "This is test address 2",
                Service = "This is test service 2",
                PhoneNumber = "09825233762",
                Email = "EmailTest2@gmailtest.com",
                Type = DataProviderType.VehicleRegistry,
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
                Type = DataProviderType.ServiceShop,
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
            }); dataProviders.Add(new DataProvider
            {
                Id = 1004,
                Name = "Data Provider Test 04",
                Description = "This is test description 4",
                Address = "This is test address 4",
                Service = "This is test service 4",
                PhoneNumber = "09842363762",
                Email = "EmailTest4@gmailtest.com",
                Type = DataProviderType.PoliceOffice,
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
                Type = DataProviderType.Manufacturer,
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

        private List<Car> GetCars()
        {
            var cars = new List<Car>();
            cars.Add(new Car
            {
                VinId = "ABCHHFASHFHASFH20",
                LicensePlateNumber = "29A10971",
                ModelId = "2",
                Color = Color.White,
                EngineNumber = "Test",
                IsModified = false,
                IsCommercialUse = false,
                CurrentOdometer = 0,
                CreatedByUser = new User
                {
                    DataProvider = dataProvidersTestData.First()
                }


            });
            return cars;
        }

        private List<Review> GetReviews()
        {
            var reviews = new List<Review>();
            reviews.Add(new Review
            {
                DataProviderId = 1001,
                UserId = "test",
                Description = "test",
                Rating = 5,
                DataProvider = dataProvidersTestData.First()
            });
            return reviews;
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
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            var result = await service.GetAllDataProviders(parameter);
            // Assert
            Assert.Equal(5, result.Count());
            Assert.IsAssignableFrom<PagedList<DataProviderDetailsResponseDTO>>(result);
        }        
        
        [Fact]
        public async Task GetDataProviders_ReturnsDataProvidersListNull()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockRepo.Setup(repo => repo.GetAllDataProviders(parameter, trackChange))
                    .ReturnsAsync(value: null);
            mockRepo.Setup(repo => repo.CountAll()).ReturnsAsync(0);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            var result = await service.GetAllDataProviders(parameter);
            // Assert
            Assert.Equal(0, result.Count());
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

            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
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
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.GetDataProvider(id);
            // Assert
            await Assert.ThrowsAsync<DataProviderNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateDataProvider_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            int id = 1001;
            var request = new DataProviderUpdateRequestDTO();
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { DataProviderId = 1002, Role = Role.CarDealer });
            mockRepo.Setup(repo => repo.GetDataProvider(id, trackChange))
                                        .ReturnsAsync(value: null);

            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.UpdateDataProvider(id, request);
            // Assert
            await Assert.ThrowsAsync<DataProviderNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateDataProvider_ReturnsUnauthorizedAccessException()
        {
            // Arrange
            bool trackChange = true;
            int id = 1001;
            var request = new DataProviderUpdateRequestDTO();
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { DataProviderId = 1002, Role = Role.CarDealer });
            mockRepo.Setup(repo => repo.GetDataProvider(id, trackChange))
                                        .ReturnsAsync(dataProvidersTestData.First());

            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.UpdateDataProvider(id, request);
            // Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(act);
        }

        [Fact]
        public async Task UserNotLoggedIn_UpdateDataProvider_ReturnsUserNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            int id = 1001;
            var request = new DataProviderUpdateRequestDTO();
            var mockRepo = new Mock<IDataProviderRepository>();
            mockRepo.Setup(repo => repo.GetDataProvider(id, trackChange))
                                        .ReturnsAsync(dataProvidersTestData.First());

            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.UpdateDataProvider(id, request);
            // Assert
            await Assert.ThrowsAsync<UserNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateDataProvider_ReturnsNotFoundDataProviderException()
        {
            // Arrange
            bool trackChange = true;
            int id = 9999;
            var request = new DataProviderUpdateRequestDTO();
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { DataProviderId = 1001, Role = Role.CarDealer });
            mockRepo.Setup(repo => repo.GetDataProvider(id, trackChange))
                                        .ReturnsAsync(value: null);

            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Object);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync());
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.UpdateDataProvider(id, request);
            // Assert
            await Assert.ThrowsAsync<DataProviderNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteDataProvider_ReturnsNotFoundException()
        {
            // Arrange
            bool trackChange = true;
            int id = 1001;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockRepo.Setup(repo => repo.GetDataProvider(id, trackChange))
                    .ReturnsAsync(value: null);
            mockRepo.Setup(repo => repo.SaveAsync());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.DeleteDataProvider(id);
            // Assert
            await Assert.ThrowsAsync<DataProviderNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteDataProvider_ReturnsTrue()
        {
            // Arrange
            bool trackChange = true;
            int id = 1001;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
            .ReturnsAsync(new User { DataProviderId = 1001 });
            mockRepo.Setup(repo => repo.GetDataProvider(id, trackChange))
                    .ReturnsAsync(dataProvidersTestData.First());
            mockRepo.Setup(repo => repo.SaveAsync());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            var result = await service.DeleteDataProvider(id);
            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task ContactDataProvider_ReturnsTrue()
        {
            DataProviderContactCreateRequestDTO request = new DataProviderContactCreateRequestDTO();
            request.Email = "Test@gmail.com";
            request.PhoneNumber = "Test";
            request.FirstName = "Test";
            request.LastName = "Test";
            request.VinId = "ABCHHFASHFHASFH20";
            request.ZipCode = "10000";
            // Arrange
            bool trackChange = false;
            int id = 1001;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Role = Role.User });
            mockCarRepository.Setup(repo => repo.GetCarIncludeDataProviderFromVinId(request.VinId, trackChange))
                                    .ReturnsAsync(carsTestData.First());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            var result = await service.ContactDataProvider(request);
            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task ContactDataProvider_ReturnsCarNotFoundException()
        {
            DataProviderContactCreateRequestDTO request = new DataProviderContactCreateRequestDTO();
            request.Email = "Test@gmail.com";
            request.PhoneNumber = "Test";
            request.FirstName = "Test";
            request.LastName = "Test";
            request.VinId = "ABCHHFASHFHASFH20";
            request.ZipCode = "10000";
            // Arrange
            bool trackChange = false;
            int id = 1001;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Role = Role.User });
            mockCarRepository.Setup(repo => repo.GetCarIncludeDataProviderFromVinId(request.VinId, trackChange))
                                    .ReturnsAsync(value: null);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.ContactDataProvider(request);
            // Assert
            await Assert.ThrowsAsync<CarNotFoundException>(act);
        }

        [Fact]
        public async Task GetReviews_ReturnsReviewsList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<IDataProviderRepository>();
            DataProviderReviewParameter parameter = new DataProviderReviewParameter();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Role = Role.User });
            mockReviewRepository.Setup(repo => repo.GetAllReview(parameter, trackChange))
                    .ReturnsAsync(reviewsTestData);
            mockRepo.Setup(repo => repo.CountAll()).ReturnsAsync(3);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            var result = await service.GetAllReview(parameter);
            // Assert
            Assert.Equal(1, result.Count());
            Assert.IsAssignableFrom<PagedList<DataProviderReviewsResponseDTO>>(result);
        }

        [Fact]
        public async Task GetReviews_ReturnsReviewsListNull()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<IDataProviderRepository>();
            DataProviderReviewParameter parameter = new DataProviderReviewParameter();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Role = Role.User });
            mockReviewRepository.Setup(repo => repo.GetAllReview(parameter, trackChange))
                    .ReturnsAsync(value: null);
            mockRepo.Setup(repo => repo.CountAll()).ReturnsAsync(0);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            var result = await service.GetAllReview(parameter);
            // Assert
            Assert.Equal(0, result.Count());
            Assert.IsAssignableFrom<PagedList<DataProviderReviewsResponseDTO>>(result);
        }

        [Fact]
        public async Task GetReview_ReturnsReview()
        {
            // Arrange
            bool trackChange = false;
            string userId = "test";
            int dataProviderId = 1;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
            .ReturnsAsync(new User { Role = Role.User });
            mockReviewRepository.Setup(repo => repo.GetReview(userId, dataProviderId, trackChange))
                .ReturnsAsync(reviewsTestData.First());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();

            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            var result = await service.GetReview(userId, dataProviderId);
            // Asserts
            Assert.IsAssignableFrom<DataProviderReviewsResponseDTO>(result);
            Assert.Equal(userId, result.UserId);
        }

        [Fact]
        public async Task GetReview_ReturnsReviewNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string userId = "test";
            int dataProviderId = 1;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
            .ReturnsAsync(new User { Role = Role.User });
            mockReviewRepository.Setup(repo => repo.GetReview(userId, dataProviderId, trackChange))
                .ReturnsAsync(value: null);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();

            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.GetReview(userId, dataProviderId);
            // Assert
            await Assert.ThrowsAsync<ReviewNotFoundException>(act);
        }


        [Fact]
        public async Task ReviewDataProvider_ReturnsDataProviderNotFoundException()
        {
            DataProviderReviewCreateRequestDTO request = new DataProviderReviewCreateRequestDTO();
            // Arrange
            bool trackChange = false;
            int id = 1001;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Role = Role.User });
            mockRepo.Setup(x => x.GetDataProvider(id, trackChange))
                        .ReturnsAsync(value: null);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.ReviewDataProvider(id, request);
            // Assert
            await Assert.ThrowsAsync<DataProviderNotFoundException>(act);
        }

        [Fact]
        public async Task ReviewDataProvider_ReturnsTrue()
        {
            DataProviderReviewCreateRequestDTO request = new DataProviderReviewCreateRequestDTO();
            // Arrange
            bool trackChange = false;
            int id = 1001;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Role = Role.User });
            mockRepo.Setup(x => x.GetDataProvider(id, trackChange))
                        .ReturnsAsync(dataProvidersTestData.First());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            var result = await service.ReviewDataProvider(id, request);
            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task ReviewDataProvider_ReturnUserNotFoundException()
        {
            DataProviderReviewCreateRequestDTO request = new DataProviderReviewCreateRequestDTO();
            // Arrange
            bool trackChange = false;
            int id = 1001;
            var mockRepo = new Mock<IDataProviderRepository>();
            mockRepo.Setup(x => x.GetDataProvider(id, trackChange))
                        .ReturnsAsync(dataProvidersTestData.First());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.ReviewDataProvider(id, request);
            // Assert
            await Assert.ThrowsAsync<UserNotFoundException>(act);
        }

        [Fact]
        public async Task EditReviewDataProvider_ReturnsDataProviderNotFoundException()
        {
            DataProviderReviewUpdateRequestDTO request = new DataProviderReviewUpdateRequestDTO();
            // Arrange
            bool trackChange = false;
            int id = 1001;
            string userId = "test";
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Id = "test" });
            mockRepo.Setup(x => x.GetDataProvider(id, trackChange))
                        .ReturnsAsync(value: null);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.EditReviewDataProvider(id, request);
            // Assert
            await Assert.ThrowsAsync<DataProviderNotFoundException>(act);
        }

        [Fact]
        public async Task EditReviewDataProvider_ReturnsTrue()
        {
            DataProviderReviewUpdateRequestDTO request = new DataProviderReviewUpdateRequestDTO();
            // Arrange
            int id = 1001;
            string userId = "test";
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Id = "test" });
            mockRepo.Setup(x => x.GetDataProvider(id, false))
                        .ReturnsAsync(dataProvidersTestData.First());
            mockReviewRepository.Setup(x => x.GetReview(userId, id, true))
                        .ReturnsAsync(reviewsTestData.First());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            var result = await service.EditReviewDataProvider(id, request);
            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task EditReviewDataProvider_ReturnUserNotFoundException()
        {
            DataProviderReviewUpdateRequestDTO request = new DataProviderReviewUpdateRequestDTO();
            // Arrange
            bool trackChange = false;
            int id = 1001;
            string userId = "test";
            var mockRepo = new Mock<IDataProviderRepository>();
            mockRepo.Setup(x => x.GetDataProvider(id, trackChange))
                        .ReturnsAsync(dataProvidersTestData.First());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.EditReviewDataProvider(id, request);
            // Assert
            await Assert.ThrowsAsync<UserNotFoundException>(act);
        }


        [Fact]
        public async Task EditReviewDataProvider_ReturnsOldReviewNotExistException()
        {
            DataProviderReviewUpdateRequestDTO request = new DataProviderReviewUpdateRequestDTO();
            // Arrange
            int id = 1001;
            string userId = "test";
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Id = "test" });
            mockRepo.Setup(x => x.GetDataProvider(id, false))
                        .ReturnsAsync(dataProvidersTestData.First());
            mockReviewRepository.Setup(x => x.GetReview(userId, id, true))
                        .ReturnsAsync(value: null);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.EditReviewDataProvider(id, request);
            // Assert
            await Assert.ThrowsAsync<OldReviewNotExistException>(act);
        }

        [Fact]
        public async Task DeleteReviewDataProvider_ReturnsDataProviderNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = 1001;
            string userId = "test";
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Id = "test" });
            mockRepo.Setup(x => x.GetDataProvider(id, trackChange))
                        .ReturnsAsync(value: null);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.DeleteReviewDataProvider(id, userId);
            // Assert
            await Assert.ThrowsAsync<DataProviderNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteReviewDataProvider_ReturnsTrue()
        {
            // Arrange
            int id = 1001;
            string userId = "test";
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Id = "test" });
            mockRepo.Setup(x => x.GetDataProvider(id, false))
                        .ReturnsAsync(dataProvidersTestData.First());
            mockReviewRepository.Setup(x => x.GetReview(userId, id, true))
                        .ReturnsAsync(reviewsTestData.First());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            var result = await service.DeleteReviewDataProvider(id, userId);
            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteReviewDataProvider_ReturnUserNotFoundException()
        {
            // Arrange
            int id = 1001;
            string userId = "test";
            var mockRepo = new Mock<IDataProviderRepository>();
            mockRepo.Setup(x => x.GetDataProvider(id, false))
                        .ReturnsAsync(dataProvidersTestData.First());
            mockReviewRepository.Setup(x => x.GetReview(userId, id, true))
            .ReturnsAsync(reviewsTestData.First());
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.DeleteReviewDataProvider(id, userId);
            // Assert
            await Assert.ThrowsAsync<UserNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteReviewDataProvider_ReturnsOldReviewNotExistException()
        {
            // Arrange
            int id = 1001;
            string userId = "test";
            var mockRepo = new Mock<IDataProviderRepository>();
            mockAuthenticationService.Setup(x => x.GetCurrentUserAsync())
                        .ReturnsAsync(new User { Id = "test" });
            mockRepo.Setup(x => x.GetDataProvider(id, false))
                        .ReturnsAsync(dataProvidersTestData.First());
            mockReviewRepository.Setup(x => x.GetReview(userId, id, true))
                        .ReturnsAsync(value: null);
            //var mockUnitOfWork = new Mock<IUnitOfWork>();
            //mockUnitOfWork.Setup(uow => uow.DataProviderRepository)
            //              .Returns(mockRepo.Obje;ct);
            //mockUnitOfWork.Setup(uow => uow.SaveAsync())
            var service = new DataProviderService(mockRepo.Object, mapper, mockService.Object,
                mockEmailService.Object, mockCarRepository.Object, mockAuthenticationService.Object,
                mockReviewRepository.Object);
            // Act
            Func<Task> act = () => service.DeleteReviewDataProvider(id, userId);
            // Assert
            await Assert.ThrowsAsync<OldReviewNotExistException>(act);
        }
    }
}
