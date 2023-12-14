using Application.DTO.CarRegistrationHistory;
using Application.Validation.CarRegistrationHistory;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Validator
{
    public class CarRegistrationHistoryValidatorTest
    {
        private readonly CarRegistrationHistoryCreateRequestDTOValidator _carRegistrationHistoryCreateRequestDTOValidator;
        private readonly CarRegistrationHistoryUpdateRequestDTOValidator _carRegistrationHistoryUpdateRequestDTOValidator;
        public CarRegistrationHistoryValidatorTest()
        {
            _carRegistrationHistoryCreateRequestDTOValidator = new CarRegistrationHistoryCreateRequestDTOValidator();
            _carRegistrationHistoryUpdateRequestDTOValidator = new CarRegistrationHistoryUpdateRequestDTOValidator();
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldHaveError_OdometerSmallerThan0()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                Odometer = -1
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Odometer);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldNotHaveError_OdometerNull()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                Odometer = null
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldHaveError_ReportDateInFuture()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                ReportDate = DateOnly.FromDateTime(DateTime.Today.AddDays(1))
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.ReportDate);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldNotHaveError_ReportDateValid()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                ReportDate = DateOnly.FromDateTime(DateTime.Today)
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.ReportDate);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldHaveError_RegistrationNumberEmpty()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                RegistrationNumber = ""
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.RegistrationNumber);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldNotHaveError_RegistrationNumberNotEmpty()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                RegistrationNumber = "A1234"
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.RegistrationNumber);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldNotHaveError_LicensePlateNumberValid_1()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                LicensePlateNumber = "12A-12345"
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldNotHaveError_LicensePlateNumberValid_2()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                LicensePlateNumber = "12A-123.45"
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldNotHaveError_LicensePlateNumberValid_3()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                LicensePlateNumber = "12A-1234"
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldNotHaveError_LicensePlateNumberValid_4()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                LicensePlateNumber = "12A 12345"
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldHaveError_LicensePlateNumberTooLong()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                LicensePlateNumber = "12A-123456"
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldHaveError_LicensePlateNumberTooShort()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                LicensePlateNumber = "12A-123"
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldHaveError_LicensePlateNumberHaveInvalidChar()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                LicensePlateNumber = "12A-123#45"
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryCreateRequestDTO_ShouldHaveError_LicensePlateNumberHaveInvalidChar_2()
        {
            //Arrange
            var model = new CarRegistrationHistoryCreateRequestDTO
            {
                LicensePlateNumber = "12A-1234A"
            };
            //Act
            var result = _carRegistrationHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldHaveError_OdometerSmallerThan0()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                Odometer = -1
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Odometer);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldNotHaveError_OdometerNull()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                Odometer = null
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldHaveError_ReportDateInFuture()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                ReportDate = DateOnly.FromDateTime(DateTime.Today.AddDays(1))
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.ReportDate);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldNotHaveError_ReportDateValid()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                ReportDate = DateOnly.FromDateTime(DateTime.Today)
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.ReportDate);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldHaveError_RegistrationNumberEmpty()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                RegistrationNumber = ""
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.RegistrationNumber);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldNotHaveError_RegistrationNumberNotEmpty()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                RegistrationNumber = "A1234"
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.RegistrationNumber);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldNotHaveError_LicensePlateNumberValid_1()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                LicensePlateNumber = "12A-12345"
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldNotHaveError_LicensePlateNumberValid_2()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                LicensePlateNumber = "12A-123.45"
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldNotHaveError_LicensePlateNumberValid_3()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                LicensePlateNumber = "12A-1234"
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldNotHaveError_LicensePlateNumberValid_4()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                LicensePlateNumber = "12A 12345"
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldHaveError_LicensePlateNumberTooLong()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                LicensePlateNumber = "12A-123456"
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldHaveError_LicensePlateNumberTooShort()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                LicensePlateNumber = "12A-123"
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldHaveError_LicensePlateNumberHaveInvalidChar()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                LicensePlateNumber = "12A-123#45"
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.LicensePlateNumber);
        }

        [Fact]
        public void CarRegistrationHistoryUpdateRequestDTO_ShouldHaveError_LicensePlateNumberHaveInvalidChar_2()
        {
            //Arrange
            var model = new CarRegistrationHistoryUpdateRequestDTO
            {
                LicensePlateNumber = "12A-1234A"
            };
            //Act
            var result = _carRegistrationHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.LicensePlateNumber);
        }
    }
}
