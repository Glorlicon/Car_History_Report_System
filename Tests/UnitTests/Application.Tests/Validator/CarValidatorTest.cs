using Application.DTO.Car;
using Application.Validation.Car;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Validator
{
    public class CarValidatorTest
    {
        private readonly CarParameterValidator _carParameterValidator;
        private readonly CarCreateRequestDTOValidator _carCreateRequestDTOValidator;
        private readonly CarUpdateRequestDTOValidator _carUpdateRequestDTOValidator;
        public CarValidatorTest()
        {
            _carParameterValidator = new CarParameterValidator();
            _carCreateRequestDTOValidator = new CarCreateRequestDTOValidator();
            _carUpdateRequestDTOValidator = new CarUpdateRequestDTOValidator();
        }

        [Fact]
        public void CarParameter_ShouldHaveError_WhenYearStartBiggerThanYearEnd()
        {
            //Arrange
            var model = new CarParameter
            {
                YearStart = 2023,
                YearEnd = 2022
            };
            //Act
            var result = _carParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.YearStart);
        }

        [Fact]
        public void CarParameter_ShouldNotHaveError_WhenYearStartSmallerOrEqualYearEnd()
        {
            //Arrange
            var model = new CarParameter
            {
                YearStart = 2022,
                YearEnd = 2023
            };
            var model2 = new CarParameter
            {
                YearStart = 2022,
                YearEnd = 2022
            };
            //Act
            var result = _carParameterValidator.TestValidate(model);
            var result2 = _carParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.YearStart);
            result2.ShouldNotHaveValidationErrorFor(m => m.YearStart);
        }

        [Fact]
        public void CarParameter_ShouldHaveError_WhenPriceMinBiggerThanPriceMax()
        {
            //Arrange
            var model = new CarParameter
            {
                PriceMin = 2022.2m,
                PriceMax = 2022.1m
            };
            //Act
            var result = _carParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PriceMin);
        }

        [Fact]
        public void CarParameter_ShouldNotHaveError_WhenPriceMinSmallerOrEqualPriceMax()
        {
            //Arrange
            var model = new CarParameter
            {
                PriceMin = 2022,
                PriceMax = 2023
            };
            var model2 = new CarParameter
            {
                PriceMin = 2022.1m,
                PriceMax = 2022.1m
            };
            //Act
            var result = _carParameterValidator.TestValidate(model);
            var result2 = _carParameterValidator.TestValidate(model2);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.PriceMin);
            result2.ShouldNotHaveValidationErrorFor(m => m.PriceMin);
        }

        [Fact]
        public void CarCreateRequestDTO_ShouldHaveError_VinIdTooLong()
        {
            //Arrange
            var model = new CarCreateRequestDTO
            {
               VinId = "KNAB23120LT614241x"
            };
            //Act
            var result = _carCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.VinId);
        }

        [Fact]
        public void CarCreateRequestDTO_ShouldHaveError_VinIdTooShort()
        {
            //Arrange
            var model = new CarCreateRequestDTO
            {
                VinId = "KNAB23120LT61424"
            };
            //Act
            var result = _carCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.VinId);
        }

        [Fact]
        public void CarCreateRequestDTO_ShouldHaveError_VinIdHaveInvalidCharacter()
        {
            //Arrange
            var model = new CarCreateRequestDTO
            {
                VinId = "KNAB23120LT61424Q"
            };
            //Act
            var result = _carCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.VinId);
        }

        [Fact]
        public void CarCreateRequestDTO_ShouldHaveError_VinIdHaveTrailingSpace()
        {
            //Arrange
            var model = new CarCreateRequestDTO
            {
                VinId = " KNAB23120LT614241"
            };
            //Act
            var result = _carCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.VinId);
        }

        [Fact]
        public void CarCreateRequestDTO_ShouldHaveError_VinIdHaveSpecialCharacter()
        {
            //Arrange
            var model = new CarCreateRequestDTO
            {
                VinId = " KNAB23120LT61424#"
            };
            //Act
            var result = _carCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.VinId);
        }

        [Fact]
        public void CarCreateRequestDTO_ShouldNotHaveError_ValidVinId()
        {
            //Arrange
            var model = new CarCreateRequestDTO
            {
                VinId = " KNAB23120LT614241"
            };
            //Act
            var result = _carCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.VinId);
        }

        [Fact]
        public void CarCreateRequestDTO_ShouldHaveError_LicensePlateNumberEmpty()
        {
            //Arrange
            var model = new CarCreateRequestDTO
            {
                LicensePlateNumber = ""
            };
            //Act
            var result = _carCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarCreateRequestDTO_ShouldNotHaveError_LicensePlateNumberNull()
        {
            //Arrange
            var model = new CarCreateRequestDTO
            {
                LicensePlateNumber = null
            };
            //Act
            var result = _carCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarCreateRequestDTO_ShouldHaveError_EngineNumberEmpty()
        {
            //Arrange
            var model = new CarCreateRequestDTO
            {
                EngineNumber = ""
            };
            //Act
            var result = _carCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.EngineNumber);
        }

        [Fact]
        public void CarUpdateRequestDTO_ShouldHaveError_LicensePlateNumberEmpty()
        {
            //Arrange
            var model = new CarUpdateRequestDTO
            {
                LicensePlateNumber = ""
            };
            //Act
            var result = _carUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarUpdateRequestDTO_ShouldNotHaveError_LicensePlateNumberNull()
        {
            //Arrange
            var model = new CarUpdateRequestDTO
            {
                LicensePlateNumber = null
            };
            //Act
            var result = _carUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarUpdateRequestDTO_ShouldHaveError_EngineNumberEmpty()
        {
            //Arrange
            var model = new CarUpdateRequestDTO
            {
                EngineNumber = ""
            };
            //Act
            var result = _carUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.EngineNumber);
        }
    }
}
