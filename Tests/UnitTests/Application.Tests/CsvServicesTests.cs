using Application.DTO.CarOwnerHistory;
using Application.DTO.CarRecall;
using Application.DTO.CarRegistrationHistory;
using Application.DTO.CarServiceHistory;
using Domain.Entities;
using Infrastructure.InfrastructureServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests
{
    public class CsvServicesTests
    {
        [Fact]
        public void ConvertListObjectToCsvFormat_ReturnCsvString()
        {
            //Arrange
            var listObjects = new List<CarRecallResponseDTO>()
            {
                new CarRecallResponseDTO()
                {
                    ID = 1,
                    Description = "None",
                    ModelId = "Model1",
                    RecallDate = new DateOnly(2023,1,1)
                },
                new CarRecallResponseDTO()
                {
                    ID = 2,
                    Description = "None",
                    ModelId = "Model2",
                    RecallDate = new DateOnly(2023,1,1)
                }
            };
            var service = new CsvServices();
            //Act
            var result = service.ConvertListObjectToCsvFormat(listObjects);
            //Assert
            var expectedResult = "ID,ModelId,Description,RecallDate\r\n1,Model1,None,01/01/2023\r\n2,Model2,None,01/01/2023\r\n";
            Assert.Equal(expectedResult, result);
        }

        [Fact]
        public void ConvertListObjectToCsvFormat_EmptyList_ReturnCsvString()
        {
            //Arrange
            var listObjects = new List<CarRecallResponseDTO>()
            {

            };
            var service = new CsvServices();
            //Act
            var result = service.ConvertListObjectToCsvFormat(listObjects);
            //Assert
            var expectedResult = "";
            Assert.Equal(expectedResult, result);
        }

        [Fact]
        public void ConvertToListObject_ReturnListObject()
        {
            //Arrange
            var csvString = "ID,ModelId,Description,RecallDate\r\n1,Model1,None,01/01/2023\r\n2,Model2,None,01/01/2023\r\n";
            MemoryStream stream = new MemoryStream(Encoding.UTF8.GetBytes(csvString));
            var service = new CsvServices();
            //Act
            var result = service.ConvertToListObject<CarRecallResponseDTO>(stream);
            //Assert
            Assert.Equal(2, result.Count());

            Assert.Equal(1, result.First().ID);
            Assert.Equal("None", result.First().Description);
            Assert.Equal("Model1", result.First().ModelId);
            Assert.Equal(new DateOnly(2023, 1, 1), result.First().RecallDate);

            Assert.Equal(2, result.Last().ID);
            Assert.Equal("None", result.Last().Description);
            Assert.Equal("Model2", result.Last().ModelId);
            Assert.Equal(new DateOnly(2023, 1, 1), result.Last().RecallDate);
        }
    }
}
