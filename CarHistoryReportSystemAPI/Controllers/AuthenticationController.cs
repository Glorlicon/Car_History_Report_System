using Application.DTO.Authentication;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationServices _authServices;
        private readonly IEmailServices _emailServices;

        public AuthenticationController(IAuthenticationServices authServices, IEmailServices emailServices)
        {
            _authServices = authServices;
            _emailServices = emailServices;
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
            //await _emailServices.SendEmailAsync(request.Email, "Confirmation Email Link", confirmationLink);
            return StatusCode(201, new { userId = result.UserId , verifyToken = result.VerifyToken });
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
            var result = await _authServices.ConfirmEmail(request.Token, request.Email);
            if(result)
                return Ok();
            else return BadRequest(ModelState);
        }

        [HttpPost("resend-email-confirm-token", Name = "ResendConfirmEmail")]
        public async Task<IActionResult> ResendConfirmEmailToken(LoginRequestDTO request)
        {
            var result = await _authServices.ResendConfirmEmailTokenAsync(request);
            return Ok(new { Token = result });
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
