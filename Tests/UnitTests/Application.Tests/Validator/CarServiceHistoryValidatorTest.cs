using Application.DTO.CarServiceHistory;
using Application.Validation.CarServiceHistory;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Validator
{
    public class CarServiceHistoryValidatorTest
    {
        private readonly CarServiceHistoryCreateRequestDTOValidator _carServiceHistoryCreateRequestDTOValidator;
        private readonly CarServiceHistoryUpdateRequestDTOValidator _carServiceHistoryUpdateRequestDTOValidator;
        public CarServiceHistoryValidatorTest()
        {
            _carServiceHistoryCreateRequestDTOValidator = new CarServiceHistoryCreateRequestDTOValidator();
            _carServiceHistoryUpdateRequestDTOValidator = new CarServiceHistoryUpdateRequestDTOValidator();
        }

        [Fact]
        public void CarServiceHistoryCreateRequestDTO_ShouldHaveError_OdometerSmallerThan0()
        {
            //Arrange
            var model = new CarServiceHistoryCreateRequestDTO
            {
                Odometer = -1
            };
            //Act
            var result = _carServiceHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Odometer);
        }

        [Fact]
        public void CarServiceHistoryCreateRequestDTO_ShouldNotHaveError_OdometerNull()
        {
            //Arrange
            var model = new CarServiceHistoryCreateRequestDTO
            {
                Odometer = null
            };
            //Act
            var result = _carServiceHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }

        [Fact]
        public void CarServiceHistoryUpdateRequestDTO_ShouldHaveError_OdometerSmallerThan0()
        {
            //Arrange
            var model = new CarServiceHistoryUpdateRequestDTO
            {
                Odometer = -1
            };
            //Act
            var result = _carServiceHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Odometer);
        }

        [Fact]
        public void CarServiceHistoryUpdateRequestDTO_ShouldNotHaveError_OdometerNull()
        {
            //Arrange
            var model = new CarServiceHistoryUpdateRequestDTO
            {
                Odometer = null
            };
            //Act
            var result = _carServiceHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }
    }
}
