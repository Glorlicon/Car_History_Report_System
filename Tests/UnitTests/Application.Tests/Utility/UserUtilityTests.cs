using Application.Utility;
using Org.BouncyCastle.Bcpg;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Utility
{
    public class UserUtilityTests
    {
        [Fact]
        public void UserUtility_GenerateRandomPassword_ShouldNotHaveError()
        {
            //Arrange
            int length = 20;
            //Act
            var result = UserUtility.GenerateRandomPassword(20);
            //Assert
            Assert.Equal(20, result.Length);
        }
    }
}
