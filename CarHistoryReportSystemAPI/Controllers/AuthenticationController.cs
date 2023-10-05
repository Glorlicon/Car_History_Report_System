using Application.DTO.Authentication;
using Application.Interfaces;
using Application.Utility;
using Domain.Entities;
using Domain.Enum;
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

        public AuthenticationController(IAuthenticationServices authServices, IEmailServices emailServices, IMemoryCache cache)
        {
            _authServices = authServices;
            _emailServices = emailServices;
            _cache = cache;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegistrationRequestDTO request)
        {
            var result = await _authServices.RegisterAsync(request);
            if (!result.Result.Succeeded)
            {
                foreach (var error in result.Result.Errors)
                {
                    ModelState.TryAddModelError(error.Code,error.Description);
                }
                return BadRequest(ModelState);
            }

            var confirmationLink = Url.Action(nameof(ConfirmEmail), "Authentication", new { result.VerifyToken, email = request.Email }, Request.Scheme);

            var verificationCode = AuthenticationUtility.GenerateVerificationCode();
            _cache.Set(request.Email, verificationCode, TimeSpan.FromMinutes(5));
            await _emailServices.SendEmailAsync(request.Email, "Your Verification Code", verificationCode);
            return StatusCode(201, new { userId = result.UserId , verifyToken = result.VerifyToken, code = verificationCode });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            var result = await _authServices.Login(request);
            if (!result.IsUserExist)
            {
                return Unauthorized();
            }
            return Ok(result);
        }

        [HttpPost("confirm-email",Name = "ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody] EmailConfirmationRequestDTO request)
        {
            _cache.TryGetValue(request.Email, out string storedCode);
            if (storedCode == null || storedCode != request.Code) return BadRequest("Invalid or expired code.");
            var result = await _authServices.ConfirmEmail(request.Token, request.Email);
            if(result)
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
