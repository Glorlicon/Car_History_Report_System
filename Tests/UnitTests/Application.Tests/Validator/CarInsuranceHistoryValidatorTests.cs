using Application.DTO.CarInsurance;
using Application.Validation.CarInsuranceHistory;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Validator
{
    public class CarInsuranceHistoryValidatorTests
    {
        private readonly CarInsuranceHistoryCreateRequestDTOValidator _carInsuranceHistoryCreateRequestDTOValidator;
        private readonly CarInsuranceHistoryUpdateRequestDTOValidator _carInsuranceHistoryUpdateRequestDTOValidator;
        public CarInsuranceHistoryValidatorTests()
        {
            _carInsuranceHistoryCreateRequestDTOValidator = new CarInsuranceHistoryCreateRequestDTOValidator();
            _carInsuranceHistoryUpdateRequestDTOValidator = new CarInsuranceHistoryUpdateRequestDTOValidator();
        }

        [Fact]
        public void CarInsuranceHistoryCreateRequestDTO_ShouldHaveError_OdometerLessThanZero()
        {
            //Arrange
            var model = new CarInsuranceHistoryCreateRequestDTO
            {
                Odometer = -1
            };
            //Act
            var result = _carInsuranceHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Odometer);
        }        

        [Fact]
        public void CarInsuranceHistoryCreateRequestDTO_ShouldNotHaveError_OdometerZero()
        {
            //Arrange
            var model = new CarInsuranceHistoryCreateRequestDTO
            {
                Odometer = 0
            };
            //Act
            var result = _carInsuranceHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }        
        
        [Fact]
        public void CarInsuranceHistoryCreateRequestDTO_ShouldNotHaveError_OdometerValidInteger()
        {
            //Arrange
            var model = new CarInsuranceHistoryCreateRequestDTO
            {
                Odometer = 1000
            };
            //Act
            var result = _carInsuranceHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }        
        
        [Fact]
        public void CarInsuranceHistoryCreateRequestDTO_ShouldNotHaveError_OdometerNull()
        {
            //Arrange
            var model = new CarInsuranceHistoryCreateRequestDTO
            {
                Odometer = null
            };
            //Act
            var result = _carInsuranceHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }        
        
        [Fact]
        public void CarInsuranceHistoryUpdateRequestDTO_ShouldHaveError_OdometerLessThanZero()
        {
            //Arrange
            var model = new CarInsuranceHistoryUpdateRequestDTO
            {
                Odometer = -1
            };
            //Act
            var result = _carInsuranceHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Odometer);
        }        

        [Fact]
        public void CarInsuranceHistoryUpdateRequestDTO_ShouldNotHaveError_OdometerZero()
        {
            //Arrange
            var model = new CarInsuranceHistoryUpdateRequestDTO
            {
                Odometer = 0
            };
            //Act
            var result = _carInsuranceHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }        
        
        [Fact]
        public void CarInsuranceHistoryUpdateRequestDTO_ShouldNotHaveError_OdometerValidInteger()
        {
            //Arrange
            var model = new CarInsuranceHistoryUpdateRequestDTO
            {
                Odometer = 1000
            };
            //Act
            var result = _carInsuranceHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }        
        
        [Fact]      
        public void CarInsuranceHistoryUpdateRequestDTO_ShouldNotHaveError_OdometerNull()
        {
            //Arrange
            var model = new CarInsuranceHistoryUpdateRequestDTO
            {
                Odometer = null
            };
            //Act
            var result = _carInsuranceHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }     
       
    }
}
