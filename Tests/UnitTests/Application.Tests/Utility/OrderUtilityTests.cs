using Application.DTO.Order;
using Application.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Utility
{
    public class OrderUtilityTests
    {
        [Fact]
        public void CalculateTotalAmount_CreateRequest_WithoutDiscount()
        {
            //Arrange
            var request = new OrderOptionCreateRequestDTO
            {
                Price = 100,
                Discount = 0,
                DiscountStart = null,
                DiscountEnd= null,
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(100, result);
        }

        [Fact]
        public void CalculateTotalAmount_CreateRequest_WithDiscount()
        {
            //Arrange
            var request = new OrderOptionCreateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = new DateOnly(2023,1,1),
                DiscountEnd = new DateOnly(2024, 1, 1),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(80, result);
        }

        [Fact]
        public void CalculateTotalAmount_CreateRequest_WithDiscount_OutOfDiscountPeriod_1()
        {
            //Arrange
            var request = new OrderOptionCreateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = new DateOnly(2022, 1, 1),
                DiscountEnd = new DateOnly(2023, 1, 1),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(100, result);
        }

        [Fact]
        public void CalculateTotalAmount_CreateRequest_WithDiscount_OutOfDiscountPeriod_2()
        {
            //Arrange
            var request = new OrderOptionCreateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = new DateOnly(2024, 1, 1),
                DiscountEnd = new DateOnly(2025, 1, 1),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(100, result);
        }

        [Fact]
        public void CalculateTotalAmount_CreateRequest_WithDiscount_OutOfDiscountPeriod_Boundary_1()
        {
            //Arrange
            var request = new OrderOptionCreateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = DateOnly.FromDateTime(DateTime.Today),
                DiscountEnd = DateOnly.FromDateTime(DateTime.Today.AddDays(1)),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(80, result);
        }

        [Fact]
        public void CalculateTotalAmount_CreateRequest_WithDiscount_OutOfDiscountPeriod_Boundary_2()
        {
            //Arrange
            var request = new OrderOptionCreateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                DiscountEnd = DateOnly.FromDateTime(DateTime.Today),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(80, result);
        }

        [Fact]
        public void CalculateTotalAmount_CreateRequest_WithDiscount_OutOfDiscountPeriod_Boundary_3()
        {
            //Arrange
            var request = new OrderOptionCreateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                DiscountEnd = DateOnly.FromDateTime(DateTime.Today.AddDays(1)),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(80, result);
        }

        [Fact]
        public void CalculateTotalAmount_UpdateRequest_WithoutDiscount()
        {
            //Arrange
            var request = new OrderOptionUpdateRequestDTO
            {
                Price = 100,
                Discount = 0,
                DiscountStart = null,
                DiscountEnd = null,
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(100, result);
        }

        [Fact]
        public void CalculateTotalAmount_UpdateRequest_WithDiscount()
        {
            //Arrange
            var request = new OrderOptionUpdateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = new DateOnly(2023, 1, 1),
                DiscountEnd = new DateOnly(2024, 1, 1),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(80, result);
        }

        [Fact]
        public void CalculateTotalAmount_UpdateRequest_WithDiscount_OutOfDiscountPeriod_1()
        {
            //Arrange
            var request = new OrderOptionUpdateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = new DateOnly(2022, 1, 1),
                DiscountEnd = new DateOnly(2023, 1, 1),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(100, result);
        }

        [Fact]
        public void CalculateTotalAmount_UpdateRequest_WithDiscount_OutOfDiscountPeriod_2()
        {
            //Arrange
            var request = new OrderOptionUpdateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = new DateOnly(2024, 1, 1),
                DiscountEnd = new DateOnly(2025, 1, 1),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(100, result);
        }

        [Fact]
        public void CalculateTotalAmount_UpdateRequest_WithDiscount_OutOfDiscountPeriod_Boundary_1()
        {
            //Arrange
            var request = new OrderOptionUpdateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = DateOnly.FromDateTime(DateTime.Today),
                DiscountEnd = DateOnly.FromDateTime(DateTime.Today.AddDays(1)),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(80, result);
        }

        [Fact]
        public void CalculateTotalAmount_UpdateRequest_WithDiscount_OutOfDiscountPeriod_Boundary_2()
        {
            //Arrange
            var request = new OrderOptionUpdateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                DiscountEnd = DateOnly.FromDateTime(DateTime.Today),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(80, result);
        }

        [Fact]
        public void CalculateTotalAmount_UpdateRequest_WithDiscount_OutOfDiscountPeriod_Boundary_3()
        {
            //Arrange
            var request = new OrderOptionUpdateRequestDTO
            {
                Price = 100,
                Discount = 20,
                DiscountStart = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                DiscountEnd = DateOnly.FromDateTime(DateTime.Today.AddDays(1)),
            };
            //Act
            var result = OrderUtility.CalculateTotalAmount(request);
            //Assert
            Assert.Equal(80, result);
        }
    }
}
