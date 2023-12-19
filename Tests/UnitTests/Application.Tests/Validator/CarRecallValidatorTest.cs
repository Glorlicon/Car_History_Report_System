using Application.DTO.CarInspectionHistory;
using Application.DTO.CarRecall;
using Application.Validation.CarInspectionHistory;
using Application.Validation.CarRecall;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Validator
{
    public class CarRecallValidatorTest
    {
        private readonly CarRecallStatusParameterValidator _carRecallStatusParameterValidator;
        public CarRecallValidatorTest()
        {
            _carRecallStatusParameterValidator = new CarRecallStatusParameterValidator();
        }

        [Fact]
        public void CarRecallStatusParameter_ShouldHaveError_StatusInvalid_1()
        {
            //Arrange
            var model = new CarRecallStatusParameter
            {
                Status = "Opened"
            };
            //Act
            var result = _carRecallStatusParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Status);
        }

        [Fact]
        public void CarRecallStatusParameter_ShouldHaveError_StatusInvalid_2()
        {
            //Arrange
            var model = new CarRecallStatusParameter
            {
                Status = "Close"
            };
            //Act
            var result = _carRecallStatusParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Status);
        }

        [Fact]
        public void CarRecallStatusParameter_ShouldNotHaveError_StatusValidOpen()
        {
            //Arrange
            var model = new CarRecallStatusParameter
            {
                Status = "Open"
            };
            //Act
            var result = _carRecallStatusParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Status);
        }

        [Fact]
        public void CarRecallStatusParameter_ShouldNotHaveError_StatusValidClose()
        {
            //Arrange
            var model = new CarRecallStatusParameter
            {
                Status = "Closed"
            };
            //Act
            var result = _carRecallStatusParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Status);
        }

        [Fact]
        public void CarRecallStatusParameter_ShouldNotHaveError_StatusNull()
        {
            //Arrange
            var model = new CarRecallStatusParameter
            {
                Status = null
            };
            //Act
            var result = _carRecallStatusParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Status);
        }
    }
}
