using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.CarRecall;
using Application.DTO.CarServiceHistory;
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
    public class CarRecallServicesTests
    {
        private IMapper mapper;
        private List<CarRecall> data;
        private List<CarRecallStatus> recallStatusData;
        private CarRecallParameter parameter;
        private CarRecallStatusParameter recallStatusParameter;
        private Mock<INotificationServices> mockNotificationServices;

        public CarRecallServicesTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            data = GetData();
            recallStatusData = GetCarRecallStatusesData();
            parameter = new CarRecallParameter();
            mockNotificationServices = new Mock<INotificationServices>();
        }

        private List<CarRecallStatus> GetCarRecallStatusesData()
        {
            var datas = new List<CarRecallStatus>
            {
                new CarRecallStatus
                {
                    CarId = "Car1",
                    CarRecallId = 1,
                    Status = Domain.Enum.RecallStatus.Open
                },
                new CarRecallStatus
                {
                    CarId = "Car2",
                    CarRecallId = 1,
                    Status = Domain.Enum.RecallStatus.Closed
                },
                new CarRecallStatus
                {
                    CarId = "Car1",
                    CarRecallId = 2,
                    Status = Domain.Enum.RecallStatus.Open
                },
                new CarRecallStatus
                {
                    CarId = "Car2",
                    CarRecallId = 2,
                    Status = Domain.Enum.RecallStatus.Closed
                },
                new CarRecallStatus
                {
                    CarId = "Car1",
                    CarRecallId = 3,
                    Status = Domain.Enum.RecallStatus.Closed
                },
                new CarRecallStatus
                {
                    CarId = "Car2",
                    CarRecallId = 3,
                    Status = Domain.Enum.RecallStatus.Open
                }
            };
            return datas;
        }

        private List<CarRecall> GetData()
        {
            var datas = new List<CarRecall>();
            datas.Add(new CarRecall
            {
                ID = 1,
                CreatedByUserId = "User1",
                ModelId = "Model1",
                ModifiedByUserId = "User1",
                Description = "None",
                CreatedTime = DateTime.Now,
                RecallDate = new DateOnly(2023,1,1),
                Model = new CarSpecification
                {
                    ModelID = "Model1",
                    ManufacturerId = 1
                },
                CarRecallStatuses= new List<CarRecallStatus>
                {
                    new CarRecallStatus
                    {
                        CarId = "Car1",
                        CarRecallId = 1,
                        Status = Domain.Enum.RecallStatus.Open
                    },
                    new CarRecallStatus
                    {
                        CarId = "Car2",
                        CarRecallId = 1,
                        Status = Domain.Enum.RecallStatus.Closed
                    }
                }
            });
            datas.Add(new CarRecall
            {
                ID = 2,
                CreatedByUserId = "User1",
                ModelId = "Model2",
                Model = new CarSpecification
                {
                    ModelID = "Model2",
                    ManufacturerId = 2
                },
                ModifiedByUserId = "User1",
                Description = "None",
                CreatedTime = DateTime.Now,
                RecallDate = new DateOnly(2023, 1, 1),
                CarRecallStatuses = new List<CarRecallStatus>
                {
                    new CarRecallStatus
                    {
                        CarId = "Car1",
                        CarRecallId = 2,
                        Status = Domain.Enum.RecallStatus.Open
                    },
                    new CarRecallStatus
                    {
                        CarId = "Car2",
                        CarRecallId = 2,
                        Status = Domain.Enum.RecallStatus.Closed
                    }
                }
            });
            datas.Add(new CarRecall
            {
                ID = 3,
                CreatedByUserId = "User2",
                ModelId = "Model1",
                Model = new CarSpecification
                {
                    ModelID = "Model1",
                    ManufacturerId = 1
                },
                ModifiedByUserId = "User2",
                Description = "None",
                CreatedTime = DateTime.Now,
                RecallDate = new DateOnly(2023, 1, 1),
                CarRecallStatuses = new List<CarRecallStatus>
                {
                    new CarRecallStatus
                    {
                        CarId = "Car1",
                        CarRecallId = 3,
                        Status = Domain.Enum.RecallStatus.Closed
                    },
                    new CarRecallStatus
                    {
                        CarId = "Car2",
                        CarRecallId = 3,
                        Status = Domain.Enum.RecallStatus.Open
                    }
                }
            });
            return datas;
        }

        [Fact]
        public async Task GetCarRecall_ReturnsCarRecallResponse()
        {
            // Arrange
            bool trackChange = false;
            int id = 1;
            var mockRepo = new Mock<ICarRecallRepository>();
            mockRepo.Setup(repo => repo.GetCarRecallById(id, trackChange))
                    .ReturnsAsync(data.First);
            mockRepo.Setup(repo => repo.CountAll(parameter)).ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallRepository)
                          .Returns(mockRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            var result = await service.GetCarRecall(id);
            // Assert
            Assert.Equal(1, result.ID);
            Assert.IsAssignableFrom<CarRecallResponseDTO>(result);
        }

        [Fact]
        public async Task GetCarRecall_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = -1;
            var mockRepo = new Mock<ICarRecallRepository>();
            mockRepo.Setup(repo => repo.GetCarRecallById(id, trackChange))
                    .ReturnsAsync(value: null);
            mockRepo.Setup(repo => repo.CountAll(parameter)).ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallRepository)
                          .Returns(mockRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            Func<Task> act = () => service.GetCarRecall(id);
            // Assert
            await Assert.ThrowsAsync<CarRecallNotFoundException>(act);
        }

        [Fact]
        public async Task GetAllCarRecalls_ReturnsCarRecallsList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<ICarRecallRepository>();
            mockRepo.Setup(repo => repo.GetCarRecalls(parameter, trackChange))
                    .ReturnsAsync(data);
            mockRepo.Setup(repo => repo.CountAll(parameter)).ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallRepository)
                          .Returns(mockRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            var result = await service.GetAllCarRecalls(parameter);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.Equal(3, result.PagingData.TotalCount);
            Assert.IsAssignableFrom<PagedList<CarRecallResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarRecallsByManufacturer_ReturnsCarRecallsList()
        {
            // Arrange
            bool trackChange = false;
            int manufacturerId = 1;
            var mockRepo = new Mock<ICarRecallRepository>();
            mockRepo.Setup(repo => repo.GetCarRecallsByManufacturer(manufacturerId,parameter, trackChange))
                    .ReturnsAsync(data.Where(x => x.Model.ManufacturerId == manufacturerId));
            mockRepo.Setup(repo => repo.CountByCondition(x => x.Model.ManufacturerId == manufacturerId,parameter)).ReturnsAsync(2);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallRepository)
                          .Returns(mockRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            var result = await service.GetCarRecallsByManufacturer(manufacturerId, parameter);
            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal(2, result.PagingData.TotalCount);
            Assert.IsAssignableFrom<PagedList<CarRecallResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarRecallsByModel_ReturnsCarRecallsList()
        {
            // Arrange
            bool trackChange = false;
            string modelId = "Model1";
            var mockRepo = new Mock<ICarRecallRepository>();
            mockRepo.Setup(repo => repo.GetCarRecallsByModel(modelId, parameter, trackChange))
                    .ReturnsAsync(data.Where(x => x.ModelId == modelId));
            mockRepo.Setup(repo => repo.CountByCondition(x => x.ModelId == modelId, parameter)).ReturnsAsync(2);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallRepository)
                          .Returns(mockRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            var result = await service.GetCarRecallsByModel(modelId, parameter);
            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal(2, result.PagingData.TotalCount);
            Assert.IsAssignableFrom<PagedList<CarRecallResponseDTO>>(result);
        }

        [Fact]
        public async Task CreateCarRecall_ThrowCarSpecificationNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            var request = new CarRecallCreateRequestDTO
            {
                ModelId = "ModelNotExist"
            };
            var mockRepo = new Mock<ICarRecallRepository>();
            var mockCarSpecRepo = new Mock<ICarSpecificationRepository>();
            mockCarSpecRepo.Setup(repo => repo.IsExist(x => x.ModelID == request.ModelId))
                    .ReturnsAsync(false);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallRepository)
                          .Returns(mockRepo.Object);
            mockUnitOfWork.Setup(uow => uow.CarSpecificationRepository)
                          .Returns(mockCarSpecRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            Func<Task> act = () => service.CreateCarRecall(request);
            // Assert
            await Assert.ThrowsAsync<CarSpecificationNotFoundException>(act);
        }

        [Fact]
        public async Task UpdateCarRecall_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            var request = new CarRecallUpdateRequestDTO
            {

            };
            int id = -1;
            var mockRepo = new Mock<ICarRecallRepository>();
            mockRepo.Setup(repo => repo.GetCarRecallById(id, trackChange))
                    .ReturnsAsync(value: null);
            mockRepo.Setup(repo => repo.CountAll(parameter)).ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallRepository)
                          .Returns(mockRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            Func<Task> act = () => service.UpdateCarRecall(id, request);
            // Assert
            await Assert.ThrowsAsync<CarRecallNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteCarRecall_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int id = -1;
            var mockRepo = new Mock<ICarRecallRepository>();
            mockRepo.Setup(repo => repo.GetCarRecallById(id, trackChange))
                    .ReturnsAsync(value: null);
            mockRepo.Setup(repo => repo.CountAll(parameter)).ReturnsAsync(3);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallRepository)
                          .Returns(mockRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            Func<Task> act = () => service.DeleteCarRecall(id);
            // Assert
            await Assert.ThrowsAsync<CarRecallNotFoundException>(act);
        }

        [Fact]
        public async Task GetCarRecallStatus_ReturnsCarRecallStatusResponse()
        {
            // Arrange
            bool trackChange = false;
            int recallId = 1;
            string carId = "Car1";
            var mockRepo = new Mock<ICarRecallStatusRepository>();
            mockRepo.Setup(repo => repo.GetCarRecallStatus(recallId, carId, trackChange))
                    .ReturnsAsync(recallStatusData.First);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallStatusRepository)
                          .Returns(mockRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            var result = await service.GetCarRecallStatus(recallId,carId);
            // Assert
            Assert.Equal(recallId, result.CarRecallId);
            Assert.Equal(carId, result.CarId);
            Assert.IsAssignableFrom<CarRecallStatusResponseDTO>(result);
        }

        [Fact]
        public async Task GetCarRecallStatus_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int recallId = 1;
            string carId = "CarNotExist";
            var mockRepo = new Mock<ICarRecallStatusRepository>();
            mockRepo.Setup(repo => repo.GetCarRecallStatus(recallId, carId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallStatusRepository)
                          .Returns(mockRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            Func<Task> act = () => service.GetCarRecallStatus(recallId, carId);
            // Assert
            await Assert.ThrowsAsync<CarRecallStatusNotFound>(act);
        }

        [Fact]
        public async Task GetCarRecallStatusByCar_ReturnsCarRecallsList()
        {
            // Arrange
            bool trackChange = false;
            string carId = "Car1";
            var mockRepo = new Mock<ICarRecallStatusRepository>();
            mockRepo.Setup(repo => repo.GetCarRecallStatusByCar(carId, recallStatusParameter, trackChange))
                    .ReturnsAsync(recallStatusData.Where(x => x.CarId == carId));
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallStatusRepository)
                          .Returns(mockRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            var result = await service.GetCarRecallStatusByCar(carId, recallStatusParameter);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.IsAssignableFrom<IEnumerable<CarRecallStatusResponseDTO>>(result);
        }

        [Fact]
        public async Task UpdateCarRecallStatus_ThrowNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            int recallId = 1;
            string carId = "CarNotExist";
            var request = new CarRecallStatusUpdateRequestDTO
            {

            };
            var mockRepo = new Mock<ICarRecallStatusRepository>();
            mockRepo.Setup(repo => repo.GetCarRecallStatus(recallId, carId, trackChange))
                    .ReturnsAsync(value: null);
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            mockUnitOfWork.Setup(uow => uow.CarRecallStatusRepository)
                          .Returns(mockRepo.Object);
            var service = new CarRecallServices(mockUnitOfWork.Object, mapper, mockNotificationServices.Object);
            // Act
            Func<Task> act = () => service.UpdateCarRecallStatus(recallId, carId, request);
            // Assert
            await Assert.ThrowsAsync<CarRecallStatusNotFound>(act);
        }
    }
}
