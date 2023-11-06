using Application.DTO.Car;
using Application.Utility;
using Application.Validation.Car;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Utility
{
    public class StringUtitityTests
    {
        [Fact]
        public void StringUtility_EmailRegex_ShouldNotHaveError_WhenValid()
        {
            //Arrange
            string tmp = "datng.1412@gmail.com";
            //Act
            var result = StringUtility.IsEmailByRegex(tmp);
            //Assert
            Assert.True(result);
        }    
        
        [Fact]
        public void StringUtility_EmailRegex_ShouldHaveError_WhenNotValid1()
        {
            //Arrange
            string tmp = "datng.1412.@gmail.com";
            //Act
            var result = StringUtility.IsEmailByRegex(tmp);
            //Assert
            Assert.False(result);
        }        

        [Fact]
        public void StringUtility_EmailRegex_ShouldHaveError_WhenTwoDotClose()
        {
            //Arrange
            string tmp = "datng..1412@gmail.com";
            //Act
            var result = StringUtility.IsEmailByRegex(tmp);
            //Assert
            Assert.False(result);
        }       
        
        [Fact]
        public void StringUtility_EmailRegex_ShouldHaveError_WhenSpecialCharacter()
        {
            //Arrange
            string tmp = "datng#1412@gmail.com";
            //Act
            var result = StringUtility.IsEmailByRegex(tmp);
            //Assert
            Assert.False(result);
        }        
        
        [Fact]
        public void StringUtility_EmailRegex_ShouldHaveError_WhenSpace()
        {
            //Arrange
            string tmp = "datng 1412@gmail.com";
            //Act
            var result = StringUtility.IsEmailByRegex(tmp);
            //Assert
            Assert.False(result);
        }    
        
        [Fact]
        public void StringUtility_EmailRegex_ShouldHaveError_WhenStartWithDot()
        {
            //Arrange
            string tmp = ".datng1412@gmail.com";
            //Act
            var result = StringUtility.IsEmailByRegex(tmp);
            //Assert
            Assert.False(result);
        }
    }
}
