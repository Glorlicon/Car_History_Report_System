using Application.DTO.Car;
using Application.DTO.CarAccidentHistory;
using Application.DTO.CarOwnerHistory;
using Application.DTO.DataProvider;
using Application.Validation.Car;
using Application.Validation.CarAccidentHistory;
using Application.Validation.CarOwnerHistory;
using Application.Validation.DataProvider;
using Domain.Entities;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Validator
{
    public class DataProviderValidatorTest
    {
        private readonly DataProviderParameterValidator _dataProviderParameterValidator;
        private readonly DataProviderCreateRequestDTOValidator _dataProviderCreateRequestDTOValidator;
        private readonly DataProviderUpdateRequestDTOValidator _dataProviderUpdateRequestDTOValidator;        
        private readonly DataProviderWorkingTimesCreateRequestDTOValidator _dataProviderWorkingTimesCreateRequestDTOValidator;
        private readonly DataProviderWorkingTimesUpdateRequestDTOValidator _dataProviderWorkingTimesUpdateRequestDTOValidator;
        private readonly DataProviderReviewParameterValidator _dataProviderReviewParameterValidator;

        public DataProviderValidatorTest()
        {
            _dataProviderParameterValidator = new DataProviderParameterValidator();
            _dataProviderCreateRequestDTOValidator = new DataProviderCreateRequestDTOValidator();
            _dataProviderUpdateRequestDTOValidator = new DataProviderUpdateRequestDTOValidator();
            _dataProviderWorkingTimesCreateRequestDTOValidator = new DataProviderWorkingTimesCreateRequestDTOValidator();
            _dataProviderWorkingTimesUpdateRequestDTOValidator = new DataProviderWorkingTimesUpdateRequestDTOValidator();
            _dataProviderReviewParameterValidator = new DataProviderReviewParameterValidator();
        }

        [Fact]
        public void DataProviderCreateRequestDTO_ShouldHaveError_NameEmpty()
        {
            //Arrange
            var model = new DataProviderCreateRequestDTO
            {
                Name = ""
            };
            //Act
            var result = _dataProviderCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Name);
        }        
        
        [Fact]
        public void DataProviderUpdateRequestDTO_ShouldNotHaveError_NormalName()
        {
            //Arrange
            var model = new DataProviderUpdateRequestDTO
            {
                Name = "TestName"
            };
            //Act
            var result = _dataProviderUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Name);
        }

        [Fact]
        public void DataProviderUpdateRequestDTO_ShouldHaveError_NameEmpty()
        {
            //Arrange
            var model = new DataProviderUpdateRequestDTO
            {
                Name = ""
            };
            //Act
            var result = _dataProviderUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Name);
        }

        [Fact]
        public void DataProviderCreateRequestDTO_ShouldNotHaveError_NormalName()
        {
            //Arrange
            var model = new DataProviderCreateRequestDTO
            {
                Name = "TestName"
            };
            //Act
            var result = _dataProviderCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Name);
        }

        [Fact]
        public void DataProviderCreateRequestDTO_ShouldHaveError_PhoneNumberTooLong()
        {
            //Arrange
            var model = new DataProviderCreateRequestDTO
            {
                PhoneNumber = "03333333333"
            };
            //Act
            var result = _dataProviderCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void DataProviderCreateRequestDTO_ShouldHaveError_PhoneNumberTooShort()
        {
            //Arrange
            var model = new DataProviderCreateRequestDTO
            {
                PhoneNumber = "033333333"
            };
            //Act
            var result = _dataProviderCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void DataProviderCreateRequestDTO_ShouldHaveError_PhoneNumberHaveCharacter()
        {
            //Arrange
            var model = new DataProviderCreateRequestDTO
            {
                PhoneNumber = "033333333x"
            };
            //Act
            var result = _dataProviderCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void DataProviderCreateRequestDTO_ShouldNotHaveError_PhoneNumberValid()
        {
            //Arrange
            var model = new DataProviderCreateRequestDTO
            {
                PhoneNumber = "0828394039"
            };
            //Act
            var result = _dataProviderCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void DataProviderUpdateRequestDTO_ShouldHaveError_PhoneNumberTooLong()
        {
            //Arrange
            var model = new DataProviderUpdateRequestDTO
            {
                PhoneNumber = "03333333333"
            };
            //Act
            var result = _dataProviderUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void DataProviderUpdateRequestDTO_ShouldHaveError_PhoneNumberTooShort()
        {
            //Arrange
            var model = new DataProviderUpdateRequestDTO
            {
                PhoneNumber = "033333333"
            };
            //Act
            var result = _dataProviderUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void DataProviderUpdateRequestDTO_ShouldHaveError_PhoneNumberHaveCharacter()
        {
            //Arrange
            var model = new DataProviderUpdateRequestDTO
            {
                PhoneNumber = "033333333x"
            };
            //Act
            var result = _dataProviderUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void DataProviderUpdateRequestDTO_ShouldNotHaveError_PhoneNumberValid()
        {
            //Arrange
            var model = new DataProviderUpdateRequestDTO
            {
                PhoneNumber = "0828394039"
            };
            //Act
            var result = _dataProviderUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.PhoneNumber);
        }

        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldHaveError_StartHourExceedUpperBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                StartHour = 24
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.StartHour);
        }

        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldHaveError_StartHourSurpassLowerBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                StartHour = -1
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.StartHour);
        }

        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldHaveError_EndHourExceedUpperBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                EndHour = 24
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.EndHour);
        }

        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldHaveError_EndHourSurpassLowerBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                EndHour = -1
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.EndHour);
        }

        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldHaveError_StartMinuteExceedUpperBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                StartMinute = 60
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.StartMinute);
        }

        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldHaveError_StartMinuteSurpassLowerBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                StartMinute = -1
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.StartMinute);
        }

        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldHaveError_EndMinuteExceedUpperBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                EndMinute = 60
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.EndMinute);
        }

        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldHaveError_EndMinuteSurpassLowerBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                EndMinute = -1
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.EndMinute);
        }
        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldNotHaveError_StartHourValid()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                StartHour = 9
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.StartHour);
        }
        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldNotHaveError_EndHourValid()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                EndHour = 18
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.EndHour);
        }
        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldNotHaveError_StartMinuteValid()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                StartMinute = 30
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.StartMinute);
        }
        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldNotHaveError_EndMinuteValid()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                EndMinute = 30
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.EndMinute);
        }

        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldHaveError_StartHourExceedUpperBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                StartHour = 24
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.StartHour);
        }

        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldHaveError_StartHourSurpassLowerBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                StartHour = -1
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.StartHour);
        }

        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldHaveError_EndHourExceedUpperBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                EndHour = 24
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.EndHour);
        }

        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldHaveError_EndHourSurpassLowerBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                EndHour = -1
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.EndHour);
        }

        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldHaveError_StartMinuteExceedUpperBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                StartMinute = 60
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.StartMinute);
        }

        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldHaveError_StartMinuteSurpassLowerBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                StartMinute = -1
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.StartMinute);
        }

        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldHaveError_EndMinuteExceedUpperBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                EndMinute = 60
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.EndMinute);
        }

        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldHaveError_EndMinuteSurpassLowerBound()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                EndMinute = -1
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.EndMinute);
        }
        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldNotHaveError_StartHourValid()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                StartHour = 9
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.StartHour);
        }
        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldNotHaveError_EndHourValid()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                EndHour = 18
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.EndHour);
        }
        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldNotHaveError_StartMinuteValid()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                StartMinute = 30
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.StartMinute);
        }
        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldNotHaveError_EndMinuteValid()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                EndMinute = 30
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.EndMinute);
        }

        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldHaveError_DayOfWeekNotInRange()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                DayOfWeek = 8
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.DayOfWeek);
        }

        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldHaveError_DayOfWeekNotInRange()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                DayOfWeek = 8
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.DayOfWeek);
        }

        [Fact]
        public void DataProviderWorkingTimesCreateRequestDTO_ShouldNotHaveError_DayOfWeekValid()
        {
            //Arrange
            var model = new DataProviderWorkingTimesCreateRequestDTO
            {
                DayOfWeek = 4
            };
            //Act
            var result = _dataProviderWorkingTimesCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.DayOfWeek);
        }

        [Fact]
        public void DataProviderWorkingTimesUpdateRequestDTO_ShouldNotHaveError_DayOfWeekValid()
        {
            //Arrange
            var model = new DataProviderWorkingTimesUpdateRequestDTO
            {
                DayOfWeek = 4
            };
            //Act
            var result = _dataProviderWorkingTimesUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.DayOfWeek);
        }

        [Fact]
        public void DataProviderCreateRequestDTO_ShouldNotHaveError_EmailValid()
        {
            //Arrange
            var model = new DataProviderCreateRequestDTO
            {
                Email = "datng.1412@gmail.com"
            };
            //Act
            var result = _dataProviderCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Email);
        }        
        
        [Fact]
        public void DataProviderCreateRequestDTO_ShouldHaveError_EmailNotValid()
        {
            //Arrange
            var model = new DataProviderCreateRequestDTO
            {
                Email = "datng.1412.@gmail.com"
            };
            //Act
            var result = _dataProviderCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Email);
        }
        [Fact]
        public void DataProviderUpdateRequestDTO_ShouldNotHaveError_EmailValid()
        {
            //Arrange
            var model = new DataProviderUpdateRequestDTO
            {
                Email = "datng.1412@gmail.com"
            };
            //Act
            var result = _dataProviderUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Email);
        }        
        
        [Fact]
        public void DataProviderUpdateRequestDTO_ShouldHaveError_EmailNotValid()
        {
            //Arrange
            var model = new DataProviderUpdateRequestDTO
            {
                Email = "datng.1412.@gmail.com"
            };
            //Act
            var result = _dataProviderUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Email);
        }        
        
        [Fact]
        public void DataProviderParameter_ShouldNotHaveError_TypeCarDealer()
        {
            //Arrange
            var model = new DataProviderParameter
            {
                Type = Domain.Enum.DataProviderType.CarDealer
            };
            //Act
            var result = _dataProviderParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Type);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByNameNull()
        {
            //Arrange
            var model = new DataProviderParameter
            {
            };
            //Act
            var result = _dataProviderParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByName);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByNameEqualOne()
        {
            //Arrange
            var model = new DataProviderParameter
            {
                SortByName = 1
            };
            //Act
            var result = _dataProviderParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByName);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByNameEqualNegativeOne()
        {
            //Arrange
            var model = new DataProviderParameter
            {
                SortByName = -1
            };
            //Act
            var result = _dataProviderParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByName);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByNameEqualZero()
        {
            //Arrange
            var model = new DataProviderParameter
            {
                SortByName = 0
            };
            //Act
            var result = _dataProviderParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByName);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldHaveError_SortByNameEqualTwo()
        {
            //Arrange
            var model = new DataProviderParameter
            {
                SortByName = 2
            };
            //Act
            var result = _dataProviderParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.SortByName);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotError_DataProviderIdEqualTwo()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                DataProviderId = 2
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.DataProviderId);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldHaveError_DataProviderIdNull()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.DataProviderId);
        }        
        
        [Fact]
        public void DataProviderReviewParameter_ShouldHaveError_RatingNegative()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                Rating = 0
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Rating);
        }       
        
        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_RatingEqualFive()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                Rating = 5
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Rating);
        }        
        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_RatingEqualOne()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                Rating = 1
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Rating);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByDataProviderIdNull()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDataProviderId);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByDataProviderIdEqualOne()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByDataProviderId = 1
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDataProviderId);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByDataProviderIdEqualNegativeOne()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByDataProviderId = -1
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDataProviderId);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByDataProviderIdEqualZero()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByDataProviderId = 0
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDataProviderId);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldHaveError_SortByDataProviderIdEqualTwo()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByDataProviderId = 2
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.SortByDataProviderId);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByDateNull()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDate);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByDateEqualOne()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByDate = 1
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDate);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByDateEqualNegativeOne()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByDate = -1
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDate);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByDateEqualZero()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByDate = 0
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByDate);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldHaveError_SortByDateEqualTwo()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByDate = 2
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.SortByDate);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByRatingNull()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByRating);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByRatingEqualOne()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByRating = 1
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByRating);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByRatingEqualNegativeOne()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByRating = -1
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByRating);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldNotHaveError_SortByRatingEqualZero()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByRating = 0
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByRating);
        }

        [Fact]
        public void DataProviderReviewParameter_ShouldHaveError_SortByRatingEqualTwo()
        {
            //Arrange
            var model = new DataProviderReviewParameter
            {
                SortByRating = 2
            };
            //Act
            var result = _dataProviderReviewParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.SortByRating);
        }

    }
}
