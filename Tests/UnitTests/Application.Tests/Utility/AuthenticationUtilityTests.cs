using Application.Utility;
using Org.BouncyCastle.Bcpg;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Application.Tests.Utility
{
    public class AuthenticationUtilityTests
    {
        [Fact]
        public void AuthenticationUtilityTests_GenerateVerificationCode_ShouldNotHaveError()
        {
            //Arrange
            //Act
            var result = AuthenticationUtility.GenerateVerificationCode();
            //Assert
            Assert.Equal(6, result.Length);
        }
    }
}
