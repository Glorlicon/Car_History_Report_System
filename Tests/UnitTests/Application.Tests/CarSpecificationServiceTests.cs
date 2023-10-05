using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Threading.Tasks;
using Application.Common;
using Application.DomainServices;
using Application.DTO.CarSpecification;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
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

        public CarSpecificationServiceTests()
        {
            var myProfile = new MappingProfile();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile(myProfile));
            mapper = new Mapper(configuration);
            carModelsTestData = GetCarModelsList();
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
                CreatedByUserId = "User1"
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
                CreatedByUserId = "User2"
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
                CreatedByUserId = "User1"
            });
            return carModels;
        }

        private List<CarSpecification> GetCarModelsListByUserId(string userId)
        {
            return carModelsTestData.Where(x => x.CreatedByUserId == userId).ToList();
        }

        private List<CarSpecification> GetCarModelsListByManufacturerId(int manufacturerId)
        {
            return carModelsTestData.Where(x => x.ManufacturerId == manufacturerId).ToList();
        }

        [Fact]
        public async Task GetAllCarModels_ReturnsCarModelsList()
        {
            // Arrange
            bool trackChange = false;
            var mockRepo = new Mock<ICarSpecificationRepository>();
            mockRepo.Setup(repo => repo.GetAll(trackChange))
                    .ReturnsAsync(carModelsTestData);
            var service = new CarSpecificationServices(mockRepo.Object, mapper);
            // Act
            var result = await service.GetAllCarModels(trackChange);
            // Assert
            Assert.Equal(3, result.Count());
            Assert.IsAssignableFrom<IEnumerable<CarSpecificationResponseDTO>>(result);
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
            var service = new CarSpecificationServices(mockRepo.Object, mapper);
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
            var service = new CarSpecificationServices(mockRepo.Object, mapper);

            // Act
            Func<Task> act = () => service.GetCarModel(modelId, trackChange);
            //Assert
            var exception = await Assert.ThrowsAsync<CarSpecificationNotFoundException>(act);
            Assert.Equal("Car Model with id ModelTestNotExist was not found", exception.Message);
        }

        [Fact]
        public async Task GetCarModelByUserId_ReturnsCarModelsList()
        {
            // Arrange
            string userId = "User1";
            bool trackChange = false;
            var mockRepo = new Mock<ICarSpecificationRepository>();
            mockRepo.Setup(repo => repo.GetCarModelByUserId(userId,trackChange))
                    .ReturnsAsync(GetCarModelsListByUserId(userId));
            var service = new CarSpecificationServices(mockRepo.Object, mapper);
            // Act
            var result = await service.GetCarModelByUserId(userId, trackChange);
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
            mockRepo.Setup(repo => repo.GetCarModelByManufacturerId(manufacturerId, trackChange))
                    .ReturnsAsync(GetCarModelsListByManufacturerId(manufacturerId));
            var service = new CarSpecificationServices(mockRepo.Object, mapper);
            // Act
            var result = await service.GetCarModelByManufacturerId(manufacturerId, trackChange);
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
            var service = new CarSpecificationServices(mockRepo.Object, mapper);
            // Act
            Func<Task> act = () => service.UpdateCarModel(modelId,request);
            //Assert
            var exception = await Assert.ThrowsAsync<CarSpecificationNotFoundException>(act);
            Assert.Equal("Car Model with id ModelTestNotExist was not found", exception.Message);
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
            var service = new CarSpecificationServices(mockRepo.Object, mapper);
            // Act
            Func<Task> act = () => service.DeleteCarModel(modelId);
            //Assert
            var exception = await Assert.ThrowsAsync<CarSpecificationNotFoundException>(act);
            Assert.Equal("Car Model with id ModelTestNotExist was not found", exception.Message);
        }
    }
}
