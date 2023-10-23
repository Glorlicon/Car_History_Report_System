using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using Application.Validation.Car;
using Application.Validation.CarOwnerHistory;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Validator
{
    public class CarOwnerHistoryValidatorTests
    {
        private readonly CarOwnerHistoryCreateRequestDTOValidator _carOwnerHistoryCreateRequestDTOValidator;
        private readonly CarOwnerHistoryUpdateRequestDTOValidator _carOwnerHistoryUpdateRequestDTOValidator;
        public CarOwnerHistoryValidatorTests()
        {
            _carOwnerHistoryCreateRequestDTOValidator = new CarOwnerHistoryCreateRequestDTOValidator();
            _carOwnerHistoryUpdateRequestDTOValidator = new CarOwnerHistoryUpdateRequestDTOValidator();
        }

        [Fact]
        public void CarOwnerHistoryCreateRequestDTO_ShouldHaveError_NameEmpty()
        {
            //Arrange
            var model = new CarOwnerHistoryCreateRequestDTO
            {
                Name = ""
            };
            //Act
            var result = _carOwnerHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Name);
        }

        [Fact]
        public void CarOwnerHistoryCreateRequestDTO_ShouldHaveError_PhoneNumberTooLong()
        {
            //Arrange
            var model = new CarOwnerHistoryCreateRequestDTO
            {
                PhoneNumber = "03333333333"
            };
            //Act
            var result = _carOwnerHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void CarOwnerHistoryCreateRequestDTO_ShouldHaveError_PhoneNumberTooShort()
        {
            //Arrange
            var model = new CarOwnerHistoryCreateRequestDTO
            {
                PhoneNumber = "033333333"
            };
            //Act
            var result = _carOwnerHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void CarOwnerHistoryCreateRequestDTO_ShouldHaveError_PhoneNumberHaveCharacter()
        {
            //Arrange
            var model = new CarOwnerHistoryCreateRequestDTO
            {
                PhoneNumber = "033333333x"
            };
            //Act
            var result = _carOwnerHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void CarOwnerHistoryCreateRequestDTO_ShouldNotHaveError_PhoneNumberValid()
        {
            //Arrange
            var model = new CarOwnerHistoryCreateRequestDTO
            {
                PhoneNumber = "0828394039"
            };
            //Act
            var result = _carOwnerHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void CarOwnerHistoryCreateRequestDTO_ShouldHaveError_DOBLargerThanToday()
        {
            //Arrange
            var model = new CarOwnerHistoryCreateRequestDTO
            {
                DOB = DateOnly.FromDateTime(DateTime.Today.AddDays(1))
            };
            //Act
            var result = _carOwnerHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.DOB);
        }

        [Fact]
        public void CarOwnerHistoryCreateRequestDTO_ShouldHaveError_StartDateLargerThanEndDate()
        {
            //Arrange
            var model = new CarOwnerHistoryCreateRequestDTO
            {
                StartDate = new DateOnly(2023,1,2),
                EndDate = new DateOnly(2023,1,1)
            };
            //Act
            var result = _carOwnerHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.StartDate);
        }

        [Fact]
        public void CarOwnerHistoryCreateRequestDTO_ShouldNotHaveError_EndDateNull()
        {
            //Arrange
            var model = new CarOwnerHistoryCreateRequestDTO
            {
                StartDate = new DateOnly(2023, 1, 2),
                EndDate = null
            };
            //Act
            var result = _carOwnerHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.StartDate);
        }

        [Fact]
        public void CarOwnerHistoryUpdateRequestDTO_ShouldHaveError_NameEmpty()
        {
            //Arrange
            var model = new CarOwnerHistoryUpdateRequestDTO
            {
                Name = ""
            };
            //Act
            var result = _carOwnerHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Name);
        }

        [Fact]
        public void CarOwnerHistoryUpdateRequestDTO_ShouldHaveError_PhoneNumberTooLong()
        {
            //Arrange
            var model = new CarOwnerHistoryUpdateRequestDTO
            {
                PhoneNumber = "03333333333"
            };
            //Act
            var result = _carOwnerHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void CarOwnerHistoryUpdateRequestDTO_ShouldHaveError_PhoneNumberTooShort()
        {
            //Arrange
            var model = new CarOwnerHistoryUpdateRequestDTO
            {
                PhoneNumber = "033333333"
            };
            //Act
            var result = _carOwnerHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void CarOwnerHistoryUpdateRequestDTO_ShouldHaveError_PhoneNumberHaveCharacter()
        {
            //Arrange
            var model = new CarOwnerHistoryUpdateRequestDTO
            {
                PhoneNumber = "033333333x"
            };
            //Act
            var result = _carOwnerHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void CarOwnerHistoryUpdateRequestDTO_ShouldNotHaveError_PhoneNumberValid()
        {
            //Arrange
            var model = new CarOwnerHistoryUpdateRequestDTO
            {
                PhoneNumber = "0828394039"
            };
            //Act
            var result = _carOwnerHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void CarOwnerHistoryUpdateRequestDTO_ShouldHaveError_DOBLargerThanToday()
        {
            //Arrange
            var model = new CarOwnerHistoryUpdateRequestDTO
            {
                DOB = DateOnly.FromDateTime(DateTime.Today.AddDays(1))
            };
            //Act
            var result = _carOwnerHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.DOB);
        }

        [Fact]
        public void CarOwnerHistoryUpdateRequestDTO_ShouldHaveError_StartDateLargerThanEndDate()
        {
            //Arrange
            var model = new CarOwnerHistoryUpdateRequestDTO
            {
                StartDate = new DateOnly(2023, 1, 2),
                EndDate = new DateOnly(2023, 1, 1)
            };
            //Act
            var result = _carOwnerHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.StartDate);
        }

        [Fact]
        public void CarOwnerHistoryUpdateRequestDTO_ShouldNotHaveError_EndDateNull()
        {
            //Arrange
            var model = new CarOwnerHistoryUpdateRequestDTO
            {
                StartDate = new DateOnly(2023, 1, 2),
                EndDate = null
            };
            //Act
            var result = _carOwnerHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.StartDate);
        }
    }
}
