using Application.DTO.CarInspectionHistory;
using Application.Validation.CarInspectionHistory;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Validator
{
    public class CarInspectionHistoryValidatorTest
    {
        private readonly CarInspectionHistoryCreateRequestDTOValidator _carInspectionHistoryCreateRequestDTOValidator;
        private readonly CarInspectionHistoryUpdateRequestDTOValidator _carInspectionHistoryUpdateRequestDTOValidator;
        private readonly CarInspectionHistoryDetailCreateRequestDTOValidator _carInspectionHistoryDetailCreateRequestDTOValidator;
        public CarInspectionHistoryValidatorTest()
        {
            _carInspectionHistoryCreateRequestDTOValidator = new CarInspectionHistoryCreateRequestDTOValidator();
            _carInspectionHistoryUpdateRequestDTOValidator = new CarInspectionHistoryUpdateRequestDTOValidator();
            _carInspectionHistoryDetailCreateRequestDTOValidator = new CarInspectionHistoryDetailCreateRequestDTOValidator();
        }

        [Fact]
        public void CarInspectionHistoryCreateRequestDTO_ShouldHaveError_OdometerSmallerThan0()
        {
            //Arrange
            var model = new CarInspectionHistoryCreateRequestDTO
            {
                Odometer = -1
            };
            //Act
            var result = _carInspectionHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Odometer);
        }

        [Fact]
        public void CarInspectionHistoryCreateRequestDTO_ShouldNotHaveError_OdometerNull()
        {
            //Arrange
            var model = new CarInspectionHistoryCreateRequestDTO
            {
                Odometer = null
            };
            //Act
            var result = _carInspectionHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }

        [Fact]
        public void CarInspectionHistoryCreateRequestDTO_ShouldHaveError_DescriptionEmpty()
        {
            //Arrange
            var model = new CarInspectionHistoryCreateRequestDTO
            {
                Description = ""
            };
            //Act
            var result = _carInspectionHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Description);
        }

        [Fact]
        public void CarInspectionHistoryCreateRequestDTO_ShouldNotHaveError_DescriptionNotEmpty()
        {
            //Arrange
            var model = new CarInspectionHistoryCreateRequestDTO
            {
                Description = "Description"
            };
            //Act
            var result = _carInspectionHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Description);
        }

        [Fact]
        public void CarInspectionHistoryCreateRequestDTO_ShouldHaveError_InspectionDateInFuture()
        {
            //Arrange
            var model = new CarInspectionHistoryCreateRequestDTO
            {
                InspectDate = DateOnly.FromDateTime(DateTime.Today.AddDays(1))
            };
            //Act
            var result = _carInspectionHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.InspectDate);
        }

        [Fact]
        public void CarInspectionHistoryCreateRequestDTO_ShouldNotHaveError_InspectionDateValid()
        {
            //Arrange
            var model = new CarInspectionHistoryCreateRequestDTO
            {
                InspectDate = DateOnly.FromDateTime(DateTime.Today)
            };
            //Act
            var result = _carInspectionHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.InspectDate);
        }

        [Fact]
        public void CarInspectionHistoryCreateRequestDTO_ShouldHaveError_InspectionNumberEmpty()
        {
            //Arrange
            var model = new CarInspectionHistoryCreateRequestDTO
            {
                InspectionNumber = ""
            };
            //Act
            var result = _carInspectionHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.InspectionNumber);
        }

        [Fact]
        public void CarInspectionHistoryCreateRequestDTO_ShouldNotHaveError_InspectionNumberNotEmpty()
        {
            //Arrange
            var model = new CarInspectionHistoryCreateRequestDTO
            {
                InspectionNumber = "A1234"
            };
            //Act
            var result = _carInspectionHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.InspectionNumber);
        }

        [Fact]
        public void CarInspectionHistoryCreateRequestDTO_ShouldHaveError_DetailCategoryEmpty()
        {
            //Arrange
            var model = new CarInspectionHistoryCreateRequestDTO
            {
                InspectionNumber = "A1234",
                Description = "Description",
                InspectDate = DateOnly.FromDateTime(DateTime.Today),
                CarInspectionHistoryDetail = new List<CarInspectionHistoryDetailCreateRequestDTO> {
                    new CarInspectionHistoryDetailCreateRequestDTO { InspectionCategory = ""},
                    new CarInspectionHistoryDetailCreateRequestDTO { InspectionCategory = "Safety"}
                }
            };
            //Act
            var result = _carInspectionHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveAnyValidationError();
        }

        [Fact]
        public void CarInspectionHistoryCreateRequestDTO_ShouldHaveError_DetailCategoryValid()
        {
            //Arrange
            var model = new CarInspectionHistoryCreateRequestDTO
            {
                CarInspectionHistoryDetail = new List<CarInspectionHistoryDetailCreateRequestDTO> {
                    new CarInspectionHistoryDetailCreateRequestDTO { InspectionCategory = "Safety"}
                }
            };
            //Act
            var result = _carInspectionHistoryCreateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.CarInspectionHistoryDetail);
        }

        [Fact]
        public void CarInspectionHistoryUpdateRequestDTO_ShouldHaveError_OdometerSmallerThan0()
        {
            //Arrange
            var model = new CarInspectionHistoryUpdateRequestDTO
            {
                Odometer = -1
            };
            //Act
            var result = _carInspectionHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Odometer);
        }

        [Fact]
        public void CarInspectionHistoryUpdateRequestDTO_ShouldNotHaveError_OdometerNull()
        {
            //Arrange
            var model = new CarInspectionHistoryUpdateRequestDTO
            {
                Odometer = null
            };
            //Act
            var result = _carInspectionHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Odometer);
        }

        [Fact]
        public void CarInspectionHistoryUpdateRequestDTO_ShouldHaveError_DescriptionEmpty()
        {
            //Arrange
            var model = new CarInspectionHistoryUpdateRequestDTO
            {
                Description = ""
            };
            //Act
            var result = _carInspectionHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.Description);
        }

        [Fact]
        public void CarInspectionHistoryUpdateRequestDTO_ShouldNotHaveError_DescriptionNotEmpty()
        {
            //Arrange
            var model = new CarInspectionHistoryUpdateRequestDTO
            {
                Description = "Description"
            };
            //Act
            var result = _carInspectionHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.Description);
        }

        [Fact]
        public void CarInspectionHistoryUpdateRequestDTO_ShouldHaveError_InspectionDateInFuture()
        {
            //Arrange
            var model = new CarInspectionHistoryUpdateRequestDTO
            {
                InspectDate = DateOnly.FromDateTime(DateTime.Today.AddDays(1))
            };
            //Act
            var result = _carInspectionHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.InspectDate);
        }

        [Fact]
        public void CarInspectionHistoryUpdateRequestDTO_ShouldNotHaveError_InspectionDateValid()
        {
            //Arrange
            var model = new CarInspectionHistoryUpdateRequestDTO
            {
                InspectDate = DateOnly.FromDateTime(DateTime.Today)
            };
            //Act
            var result = _carInspectionHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.InspectDate);
        }

        [Fact]
        public void CarInspectionHistoryUpdateRequestDTO_ShouldHaveError_InspectionNumberEmpty()
        {
            //Arrange
            var model = new CarInspectionHistoryUpdateRequestDTO
            {
                InspectionNumber = ""
            };
            //Act
            var result = _carInspectionHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveValidationErrorFor(m => m.InspectionNumber);
        }

        [Fact]
        public void CarInspectionHistoryUpdateRequestDTO_ShouldNotHaveError_InspectionNumberNotEmpty()
        {
            //Arrange
            var model = new CarInspectionHistoryUpdateRequestDTO
            {
                InspectionNumber = "A1234"
            };
            //Act
            var result = _carInspectionHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.InspectionNumber);
        }

        [Fact]
        public void CarInspectionHistoryUpdateRequestDTO_ShouldHaveError_DetailCategoryEmpty()
        {
            //Arrange
            var model = new CarInspectionHistoryUpdateRequestDTO
            {
                CarInspectionHistoryDetail = new List<CarInspectionHistoryDetailCreateRequestDTO> {
                    new CarInspectionHistoryDetailCreateRequestDTO { InspectionCategory = ""},
                    new CarInspectionHistoryDetailCreateRequestDTO { InspectionCategory = "Safety"}
                }
            };
            //Act
            var result = _carInspectionHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldHaveAnyValidationError();
        }

        [Fact]
        public void CarInspectionHistoryUpdateRequestDTO_ShouldHaveError_DetailCategoryValid()
        {
            //Arrange
            var model = new CarInspectionHistoryUpdateRequestDTO
            {
                CarInspectionHistoryDetail = new List<CarInspectionHistoryDetailCreateRequestDTO> {
                    new CarInspectionHistoryDetailCreateRequestDTO { InspectionCategory = "Safety"}
                }
            };
            //Act
            var result = _carInspectionHistoryUpdateRequestDTOValidator.TestValidate(model);
            //Assert
            result.ShouldNotHaveValidationErrorFor(m => m.CarInspectionHistoryDetail);
        }

    }
}
