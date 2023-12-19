using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Threading.Tasks;
using Application.Common;
using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.CarSpecification;
using Application.DTO.ModelMaintainance;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Moq;
using Xunit;

namespace UnitTests.Application.Tests
{
    public class CarSpecificationServiceTests
    {
        private IMapper mapper;
        private List<CarSpecification> carModelsTestData;
        private List<ModelMaintainance> modelMaintainancesTestData;
        private CarSpecificationParameter parameter;
        private ModelMaintainanceParameter maintainanceParameter;
        private Mock<IModelMaintainanceRepository> mockIModelMaintainanceRepository;

        public CarSpecificationServiceTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            carModelsTestData = GetCarModelsList();
            modelMaintainancesTestData = GetModelMaintainancesList();
            parameter = new CarSpecificationParameter();
            maintainanceParameter = new ModelMaintainanceParameter();
            mockIModelMaintainanceRepository = new Mock<IModelMaintainanceRepository>();
        }


        private List<CarSpecification> GetCarModelsList()
        {
            var carModels = new List<CarSpecification>();
            carModels.Add(new CarSpecification
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
                CreatedByUserId = "User1",
                CreatedByUser = new User { Role = Domain.Enum.Role.Adminstrator },
                ModelOdometers = new ModelMaintainance[]
                {
                    new ModelMaintainance
                    {
                        MaintenancePart = "Engine",
                        OdometerPerMaintainance = 20000,
                        RecommendAction = "Check",
                        DayPerMaintainance = 7
                    },
                    new ModelMaintainance
                    {
                        MaintenancePart = "Tire",
                        OdometerPerMaintainance = 10000,
                        RecommendAction = "Check",
                        DayPerMaintainance = 7
                    }
                }
            });
            carModels.Add(new CarSpecification
            {
                ModelID = "ModelTest2",
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
                CreatedByUserId = "User2",
                ModelOdometers = new ModelMaintainance[]
                {
                    new ModelMaintainance
                    {
                        MaintenancePart = "Engine",
                        OdometerPerMaintainance = 20000,
                        RecommendAction = "Check",
                        DayPerMaintainance = 7
                    },
                    new ModelMaintainance
                    {
                        MaintenancePart = "Tire",
                        OdometerPerMaintainance = 10000,
                        RecommendAction = "Check",
                        DayPerMaintainance = 7
                    }
                }
            });
            carModels.Add(new CarSpecification
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
                CreatedByUserId = "User1",
                ModelOdometers = new ModelMaintainance[]
                {
                    new ModelMaintainance
                    {
                        MaintenancePart = "Engine",
                        OdometerPerMaintainance = 20000,
                        RecommendAction = "Check",
                        DayPerMaintainance = 7
                    },
                    new ModelMaintainance
                    {
                        MaintenancePart = "Tire",
                        OdometerPerMaintainance = 10000,
                        RecommendAction = "Check",
                        DayPerMaintainance = 7
                    }
                }
            });
            return carModels;
        }

        private List<ModelMaintainance> GetModelMaintainancesList()
        {
            var modelMaintainances = new List<ModelMaintainance>();
            modelMaintainances.Add
                (new ModelMaintainance
                {
                    ModelId = "ModelTest1",
                    Model = carModelsTestData.First(),
                    DayPerMaintainance = 7,
                    OdometerPerMaintainance = 3000,
                    MaintenancePart = "test part",
                    RecommendAction = "test recommend"
                }
                );
            modelMaintainances.Add
                (new ModelMaintainance
                {
                    ModelId = "ModelTest2",
                    Model = carModelsTestData.First(),
                    DayPerMaintainance = 7,
                    OdometerPerMaintainance = 3000,
                    MaintenancePart = "test part",
                    RecommendAction = "test recommend"
                }
                );
            return modelMaintainances;
        }

        private List<CarSpecification> GetCarModelsListByUserId(string userId)
        {
            return carModelsTestData.Where(x => x.CreatedByUserId == userId).ToList();
        }

        private List<CarSpecification> GetCarModelsListByManufacturerId(int manufacturerId)
        {
            return carModelsTestData.Where(x => x.ManufacturerId == manufacturerId).ToList();
        }

        private List<CarSpecification> GetCarModelsListByAdminstrator()
        {
            return carModelsTestData.Where(x => x.CreatedByUser != null && x.CreatedByUser.Role == Domain.Enum.Role.Adminstrator).ToList();
        }

        private List<ModelMaintainance> GetModelMaintainancesListByModelId(string modelId)
        {
            return modelMaintainancesTestData.Where(x => x.ModelId == modelId).ToList();
        }

        [Fact]
        public async Task GetAllCarModels_ReturnsCarModelsList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<ICarSpecificationRepository>();
            mockRepo.Setup(repo => repo.GetAllCarModels(parameter, trackChange))
                    .ReturnsAsync(carModelsTestData);
            mockRepo.Setup(repo => repo.CountAll()).ReturnsAsync(3);
            var service = new CarSpecificationServices(mockRepo.Object, mapper, mockIModelMaintainanceRepository.Object);
            // Act
            var result = await service.GetAllCarModels(parameter, trackChange);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.IsAssignableFrom<PagedList<CarSpecificationResponseDTO>>(result);
        }

        [Fact]
        public async Task GetCarModel_ReturnsCarModel()
        {
            // Arrange
            bool trackChange = false;
            string modelId = "ModelTest1";
            var mockRepo = new Mock<ICarSpecificationRepository>();
            mockRepo.Setup(repo => repo.GetCarModelById(modelId, trackChange))
                    .ReturnsAsync(carModelsTestData.First());
            var service = new CarSpecificationServices(mockRepo.Object, mapper, mockIModelMaintainanceRepository.Object);
            // Act
            var result = await service.GetCarModel(modelId, trackChange);
            // Assert
            Assert.IsAssignableFrom<CarSpecificationResponseDTO>(result);
            Assert.Equal("Manufacturer1", result.ManufacturerName);
            Assert.Equal(modelId, result.ModelID);
        }

        [Fact]
        public async Task GetCarModel_ReturnsCarNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string modelId = "ModelTestNotExist";
            var mockRepo = new Mock<ICarSpecificationRepository>();

            mockRepo.Setup(repo => repo.GetCarModelById(modelId, trackChange))
                    .ReturnsAsync(value: null);
            var service = new CarSpecificationServices(mockRepo.Object, mapper, mockIModelMaintainanceRepository.Object);

            // Act
            Func<Task> act = () => service.GetCarModel(modelId, trackChange);
            //Assert
            var exception = await Assert.ThrowsAsync<CarSpecificationNotFoundException>(act);
        }

        [Fact]
        public async Task GetCarModelByUserId_ReturnsCarModelsList()
        {
            // Arrange
            string userId = "User1";
            bool trackChange = false;
            var mockRepo = new Mock<ICarSpecificationRepository>();
            mockRepo.Setup(repo => repo.GetCarModelByUserId(userId, parameter, trackChange))
                    .ReturnsAsync(GetCarModelsListByUserId(userId));
            mockRepo.Setup(repo => repo.CountByCondition(cs => cs.CreatedByUserId == userId)).ReturnsAsync(2);
            var service = new CarSpecificationServices(mockRepo.Object, mapper, mockIModelMaintainanceRepository.Object);
            // Act
            var result = await service.GetCarModelByUserId(userId, parameter, trackChange);
            // Assert
            Assert.Equal(2, result.Count());
            Assert.IsAssignableFrom<IEnumerable<CarSpecificationResponseDTO>>(result);
            Assert.Equal(result.Any(x => x.CreatedByUserId != userId), false);
        }

        [Fact]
        public async Task GetCarModelByManufacturerId_ReturnsCarModelsList()
        {
            // Arrange
            int manufacturerId = 1;
            bool trackChange = false;
            var mockRepo = new Mock<ICarSpecificationRepository>();
            mockRepo.Setup(repo => repo.GetCarModelByManufacturerId(manufacturerId, parameter, trackChange))
                    .ReturnsAsync(GetCarModelsListByManufacturerId(manufacturerId));
            mockRepo.Setup(repo => repo.CountByCondition(cs => cs.ManufacturerId == manufacturerId)).ReturnsAsync(2);
            var service = new CarSpecificationServices(mockRepo.Object, mapper, mockIModelMaintainanceRepository.Object);
            // Act
            var result = await service.GetCarModelByManufacturerId(manufacturerId, parameter, trackChange);
            // Assert
            Assert.Equal(2, result.Count());
            Assert.IsAssignableFrom<IEnumerable<CarSpecificationResponseDTO>>(result);
            Assert.Equal(result.Any(x => x.ManufacturerId != manufacturerId), false);
        }

        [Fact]
        public async Task UpdateCarModel_ReturnsCarNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string modelId = "ModelTestNotExist";
            CarSpecificationUpdateRequestDTO request = null;
            var mockRepo = new Mock<ICarSpecificationRepository>();
            mockRepo.Setup(repo => repo.GetCarModelById(modelId, trackChange))
                    .ReturnsAsync(value: null);
            var service = new CarSpecificationServices(mockRepo.Object, mapper, mockIModelMaintainanceRepository.Object);
            // Act
            Func<Task> act = () => service.UpdateCarModel(modelId, request);
            //Assert
            var exception = await Assert.ThrowsAsync<CarSpecificationNotFoundException>(act);
        }

        [Fact]
        public async Task DeleteCarModel_ReturnsCarNotFoundException()
        {
            // Arrange
            bool trackChange = false;
            string modelId = "ModelTestNotExist";
            var mockRepo = new Mock<ICarSpecificationRepository>();
            mockRepo.Setup(repo => repo.GetCarModelById(modelId, trackChange))
                    .ReturnsAsync(value: null);
            var service = new CarSpecificationServices(mockRepo.Object, mapper, mockIModelMaintainanceRepository.Object);
            // Act
            Func<Task> act = () => service.DeleteCarModel(modelId);
            //Assert
            var exception = await Assert.ThrowsAsync<CarSpecificationNotFoundException>(act);
        }

        [Fact]
        public async Task GetCarModelsCreatedByAdminstrator_ReturnCarModels()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<ICarSpecificationRepository>();
            mockRepo.Setup(repo => repo.GetCarModelsCreatedByAdminstrator(parameter, trackChange))
                    .ReturnsAsync(GetCarModelsListByAdminstrator());
            mockRepo.Setup(repo => repo.CountByCondition(x => x.CreatedByUser != null && x.CreatedByUser.Role == Domain.Enum.Role.Adminstrator, parameter))
                .ReturnsAsync(1);
            var service = new CarSpecificationServices(mockRepo.Object, mapper, mockIModelMaintainanceRepository.Object);
            // Act
            var result = await service.GetCarModelsCreatedByAdminstrator(parameter);
            //Assert
            Assert.Equal(1, result.Count());
            Assert.IsAssignableFrom<PagedList<CarSpecificationResponseDTO>>(result);
        }

        [Fact]
        public async Task GetModelMaintainances_ReturnsModelMaintainances()
        {
            // Arrange\
            bool trackChange = false;
            var mockRepo = new Mock<ICarSpecificationRepository>();
            mockIModelMaintainanceRepository.Setup(repo => repo.GetModelMaintainances(maintainanceParameter, trackChange))
                .ReturnsAsync(modelMaintainancesTestData);
            mockIModelMaintainanceRepository.Setup(repo => repo.CountAll(maintainanceParameter))
                .ReturnsAsync(2);
            var service = new CarSpecificationServices(mockRepo.Object, mapper, mockIModelMaintainanceRepository.Object);
            // Act
            var result = await service.GetModelMaintainances(maintainanceParameter, trackChange);
            //Assert
            Assert.Equal(2, result.Count());
            Assert.IsAssignableFrom<PagedList<ModelMaintainanceResponseDTO>>(result);
        }

        [Fact]
        public async Task GetModelMaintainancesByModelId_ReturnsModelMaintainances()
        {
            // Arrange\
            string modelId = "ModelTest1";
            bool trackChange = false;
            var mockRepo = new Mock<ICarSpecificationRepository>();
            mockIModelMaintainanceRepository.Setup(repo => repo.GetModelMaintainancesByModelId(modelId, maintainanceParameter, trackChange))
                    .ReturnsAsync(GetModelMaintainancesListByModelId(modelId));
            mockIModelMaintainanceRepository.Setup(repo => repo.CountByCondition(x => x.ModelId == modelId, maintainanceParameter));
            var service = new CarSpecificationServices(mockRepo.Object, mapper, mockIModelMaintainanceRepository.Object);
            // Act
            var result = await service.GetModelMaintainancesByModelId(modelId, maintainanceParameter, trackChange);
            //Assert
            Assert.Equal(1, result.Count());
            Assert.IsAssignableFrom<PagedList<ModelMaintainanceResponseDTO>>(result);
        }
    }
}
