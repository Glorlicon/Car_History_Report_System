using Application.DTO.CarAccidentHistory;
using Application.DTO.Request;
using Application.Validation.CarAccidentHistory;
using Application.Validation.Request;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Validator
{
    public class RequestParameterValidatorTests
    {
        private readonly RequestParameterValidator _RequestParameterValidator;
        public RequestParameterValidatorTests()
        {
            _RequestParameterValidator = new RequestParameterValidator();
        }

        [Fact]
        public void RequestParameter_ShouldNotHaveError_RequestStatusIsInEnum()
        {
            //Arrange
            var model = new RequestParameter
            {
                RequestStatus = Domain.Enum.UserRequestStatus.Approved
            };
            //Act
            var result = _RequestParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.RequestStatus);
        }       
        
        [Fact]
        public void RequestParameter_ShouldNotHaveError_RequestTypeIsInEnum()
        {
            //Arrange
            var model = new RequestParameter
            {
                RequestType = Domain.Enum.UserRequestType.General
            };
            //Act
            var result = _RequestParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.RequestType);
        }

        [Fact]
        public void RequestParameter_ShouldNotHaveError_SortByDateNull()
        {
            //Arrange
            var model = new RequestParameter
            {
            };
            //Act
            var result = _RequestParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDate);
        }

        [Fact]
        public void RequestParameter_ShouldNotHaveError_SortByDateEqualOne()
        {
            //Arrange
            var model = new RequestParameter
            {
                SortByDate = 1
            };
            //Act
            var result = _RequestParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDate);
        }

        [Fact]
        public void RequestParameter_ShouldNotHaveError_SortByDateEqualNegativeOne()
        {
            //Arrange
            var model = new RequestParameter
            {
                SortByDate = -1
            };
            //Act
            var result = _RequestParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDate);
        }

        [Fact]
        public void RequestParameter_ShouldNotHaveError_SortByDateEqualZero()
        {
            //Arrange
            var model = new RequestParameter
            {
                SortByDate = 0
            };
            //Act
            var result = _RequestParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDate);
        }

        [Fact]
        public void RequestParameter_ShouldHaveError_SortByDateEqualTwo()
        {
            //Arrange
            var model = new RequestParameter
            {
                SortByDate = 2
            };
            //Act
            var result = _RequestParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.SortByDate);
        }
    }
}
