using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Authentication;
using Application.DTO.User;
using Application.Interfaces;
using Application.Utility;
using Domain.Entities;
using Domain.Enum;
using Infrastructure.InfrastructureServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationServices _authServices;
        private readonly IEmailServices _emailServices;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _configuration;

        public AuthenticationController(IAuthenticationServices authServices, IEmailServices emailServices, IMemoryCache cache, IConfiguration configuration)
        {
            _authServices = authServices;
            _emailServices = emailServices;
            _cache = cache;
            _configuration = configuration;
        }

        /// <summary>
        /// Register
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegistrationRequestDTO request)
        {
            var result = await _authServices.RegisterAsync(request);
            if (!result.Result.Succeeded)
            {
                foreach (var error in result.Result.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                }
                return BadRequest(ModelState);
            }

            var confirmationLink = Url.Action(nameof(ConfirmEmail), "Authentication", new { result.VerifyToken, email = request.Email }, Request.Scheme);

            var verificationCode = AuthenticationUtility.GenerateVerificationCode();
            _cache.Set(request.Email, verificationCode, TimeSpan.FromMinutes(5));
            await _emailServices.SendEmailAsync(request.Email, "Your Verification Code", verificationCode);
            return StatusCode(201, new { userId = result.UserId, verifyToken = result.VerifyToken, code = verificationCode });
        }

        /// <summary>
        /// Login
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="200">Login Successfully</response>
        /// <response code="401">User Exist</response>
        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            var result = await _authServices.Login(request);
            if (!result.IsUserExist)
            {
                return Unauthorized();
            }
            return Ok(result);
        }

        /// <summary>
        /// Change password
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Change password Successfully</response>
        /// <response code="400">Change password failed</response>
        [HttpPut("change-password/{id}")]
        //[Authorize(Roles = "Adminstrator")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ChangePasswordAsync(string id, ChangePasswordUserRequestDTO request)
        {
            var result = await _authServices.ChangePassword(id, request);
            if (result == true)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("forgot")]
        public async Task<IActionResult> Forgot([FromBody] ForgotPasswordRequestDTO request)
        {
            var token = await _authServices.ForgotPassword(request);
            if (token != null)
            {
                var domain = _configuration["ResetPasswordString"];
                _emailServices.SendEmailAsync(request.Email, "Verify to reset your password", "Click this link to reset your password: " + domain + "?token=" + token + "?email=" + request.Email);
                return Ok(token);
            }
            else
            {
                return BadRequest();
            }
        }
        /// <summary>
        /// Reset password (bug invalid token) chua fix
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Change password Successfully</response>
        /// <response code="400">Change password failed</response>
        [HttpPost("reset")]
        public async Task<IActionResult> Reset([FromBody] ResetPasswordRequestDTO request)
        {
            var result = await _authServices.ResetPassword(request);
            if (result != null)
            {
                _emailServices.SendEmailAsync(request.Email, "Your new password: \n", result);
                return Ok(result);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("confirm-email", Name = "ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody] EmailConfirmationRequestDTO request)
        {
            _cache.TryGetValue(request.Email, out string storedCode);
            if (storedCode == null || storedCode != request.Code) return BadRequest("Invalid or expired code.");
            var result = await _authServices.ConfirmEmail(request.Token, request.Email);
            if (result)
                return Ok();
            else return BadRequest(ModelState);
        }

        [HttpPost("resend-email-confirm-token", Name = "ResendConfirmEmail")]
        public async Task<IActionResult> ResendConfirmEmailToken(EmailResendConfirmTokenRequestDTO request)
        {
            var result = await _authServices.ResendConfirmEmailTokenAsync(request);
            var verificationCode = AuthenticationUtility.GenerateVerificationCode();
            _cache.Set(request.Email, verificationCode, TimeSpan.FromMinutes(5));
            await _emailServices.SendEmailAsync(request.Email, "Your Verification Code", verificationCode);
            return Ok(new { Token = result });
        }

        /// <summary>
        /// Refresh login token
        /// </summary>
        /// <returns>New Login Token</returns>
        /// <response code="200">Get refresh token successful</response>
        /// <response code="401">User not logged in</response>
        [HttpPost("refresh-token")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetRefreshToken()
        {
            var result = await _authServices.ResendLoginTokenAsync();
            return Ok(new { Token = result });
        }

        [HttpPost("resend-email-code")]
        public async Task<IActionResult> ResendConfirmEmailCode(EmailCodeResendRequestDTO request)
        {
            var verificationCode = AuthenticationUtility.GenerateVerificationCode();
            _cache.Set(request.Email, verificationCode, TimeSpan.FromMinutes(5));
            await _emailServices.SendEmailAsync(request.Email, "Your Verification Code", verificationCode);
            return Ok();
        }

        [Authorize(Roles = "Adminstrator")]
        [HttpPost("suspend-account", Name = "SuspendAccount")]
        public async Task<IActionResult> SuspendAccount(string userId)
        {
            var result = await _authServices.SuspendAccount(userId);
            if (result)
                return Ok();
            else return BadRequest(ModelState);
        }

        [Authorize(Roles = "Adminstrator")]
        [HttpPost("unsuspend-account", Name = "UnsuspendAccount")]
        public async Task<IActionResult> UnsuspendAccount(string userId)
        {
            var result = await _authServices.UnSuspendAccount(userId);
            if (result)
                return Ok();
            else return BadRequest(ModelState);
        }
    }
}
