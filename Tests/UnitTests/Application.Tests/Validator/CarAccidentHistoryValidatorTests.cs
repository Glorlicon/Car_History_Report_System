using Application.DTO.CarAccidentHistory;
using Application.DTO.CarOwnerHistory;
using Application.Validation.CarAccidentHistory;
using Application.Validation.CarOwnerHistory;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Validator
{
    public class CarAccidentHistoryValidatorTests
    {
        private readonly CarAccidentHistoryCreateRequestDTOValidator _carAccidentHistoryCreateRequestDTOValidator;
        private readonly CarAccidentHistoryUpdateRequestDTOValidator _carAccidentHistoryUpdateRequestDTOValidator;
        private readonly CarAccidentHistoryParameterValidator _carAccidentHistoryParameterValidator;
        public CarAccidentHistoryValidatorTests()
        {
            _carAccidentHistoryCreateRequestDTOValidator = new CarAccidentHistoryCreateRequestDTOValidator();
            _carAccidentHistoryUpdateRequestDTOValidator = new CarAccidentHistoryUpdateRequestDTOValidator();
            _carAccidentHistoryParameterValidator = new CarAccidentHistoryParameterValidator();
        }

        [Fact]
        public void CarAccidentHistoryCreateRequestDTO_ShouldHaveError_OdometerLessThanZero()
        {
            //Arrange
            var model = new CarAccidentHistoryCreateRequestDTO
            {
                Odometer = -1
            };
            //Act
            var result = _carAccidentHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Odometer);
        }        

        [Fact]
        public void CarAccidentHistoryCreateRequestDTO_ShouldNotHaveError_OdometerZero()
        {
            //Arrange
            var model = new CarAccidentHistoryCreateRequestDTO
            {
                Odometer = 0
            };
            //Act
            var result = _carAccidentHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }        
        
        [Fact]
        public void CarAccidentHistoryCreateRequestDTO_ShouldNotHaveError_OdometerValidInteger()
        {
            //Arrange
            var model = new CarAccidentHistoryCreateRequestDTO
            {
                Odometer = 1000
            };
            //Act
            var result = _carAccidentHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }        
        
        [Fact]
        public void CarAccidentHistoryCreateRequestDTO_ShouldNotHaveError_OdometerNull()
        {
            //Arrange
            var model = new CarAccidentHistoryCreateRequestDTO
            {
                Odometer = null
            };
            //Act
            var result = _carAccidentHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }        
        
        [Fact]
        public void CarAccidentHistoryUpdateRequestDTO_ShouldHaveError_OdometerLessThanZero()
        {
            //Arrange
            var model = new CarAccidentHistoryUpdateRequestDTO
            {
                Odometer = -1
            };
            //Act
            var result = _carAccidentHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Odometer);
        }        

        [Fact]
        public void CarAccidentHistoryUpdateRequestDTO_ShouldNotHaveError_OdometerZero()
        {
            //Arrange
            var model = new CarAccidentHistoryUpdateRequestDTO
            {
                Odometer = 0
            };
            //Act
            var result = _carAccidentHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }        
        
        [Fact]
        public void CarAccidentHistoryUpdateRequestDTO_ShouldNotHaveError_OdometerValidInteger()
        {
            //Arrange
            var model = new CarAccidentHistoryUpdateRequestDTO
            {
                Odometer = 1000
            };
            //Act
            var result = _carAccidentHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }        
        
        [Fact]      
        public void CarAccidentHistoryUpdateRequestDTO_ShouldNotHaveError_OdometerNull()
        {
            //Arrange
            var model = new CarAccidentHistoryUpdateRequestDTO
            {
                Odometer = null
            };
            //Act
            var result = _carAccidentHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        } 
        
        [Fact]      
        public void CarAccidentHistoryParameter_ShouldHaveError_VinIdEmpty()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                VinId = ""
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.VinId);
        }       
        
        [Fact]      
        public void CarAccidentHistoryParameter_ShouldHaveError_VinIdNull()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                VinId = null
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.VinId);
        }
                
        [Fact]      
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByServerityNull()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByServerity);
        }   
        
        [Fact]      
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByServerityEqualOne()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByServerity = 1
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByServerity);
        }    
        
        [Fact]      
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByServerityEqualNegativeOne()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByServerity = -1
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByServerity);
        }
                
        [Fact]      
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByServerityEqualZero()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByServerity = 0
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByServerity);
        }               
        
        [Fact]      
        public void CarAccidentHistoryParameter_ShouldHaveError_SortByServerityEqualTwo()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByServerity = 2
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.SortByServerity);
        }       
        
        [Fact]      
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByAccidentDateNull()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByAccidentDate);
        }   
        
        [Fact]      
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByAccidentDateEqualOne()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByAccidentDate = 1
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByAccidentDate);
        }    
        
        [Fact]      
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByAccidentDateEqualNegativeOne()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByAccidentDate = -1
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByAccidentDate);
        }
                
        [Fact]      
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByAccidentDateEqualZero()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByAccidentDate = 0
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByAccidentDate);
        }

        [Fact]
        public void CarAccidentHistoryParameter_ShouldHaveError_SortByAccidentDateEqualTwo()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByAccidentDate = 2
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.SortByAccidentDate);
        }


        [Fact]
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByLastModifiedNull()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByLastModified);
        }

        [Fact]
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByLastModifiedEqualOne()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByLastModified = 1
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByLastModified);
        }

        [Fact]
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByLastModifiedEqualNegativeOne()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByLastModified = -1
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByLastModified);
        }

        [Fact]
        public void CarAccidentHistoryParameter_ShouldNotHaveError_SortByLastModifiedEqualZero()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByLastModified = 0
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.SortByLastModified);
        }

        [Fact]
        public void CarAccidentHistoryParameter_ShouldHaveError_SortByLastModifiedEqualTwo()
        {
            //Arrange
            var model = new CarAccidentHistoryParameter
            {
                SortByLastModified = 2
            };
            //Act
            var result = _carAccidentHistoryParameterValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.SortByLastModified);
        }
    }
}
