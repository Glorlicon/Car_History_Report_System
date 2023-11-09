using Application.DomainServices;
using Application.DTO.Authentication;
using Application.DTO.Car;
using Application.DTO.CarSpecification;
using Application.DTO.User;
using Application.Interfaces;
using Application.Validation.Car;
using Domain.Entities;
using Domain.Enum;
using Infrastructure.InfrastructureServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }


        //[HttpPost]
        //public IActionResult Index(string username, string roleName)
        //{
        //    _userService.AddRoleToUser(username, roleName);
        //    return Ok();
        //}

        //[HttpPost("assign-role")]
        //public IActionResult assignRole(User model)
        //{
        //    _userService.AddRoleToUser2(model);
        //    return Ok();
        //}
        /// <summary>
        /// Create user
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="201">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Roles = "Adminstrator")]
        public async Task<IActionResult> CreateUserAsync([FromBody] CreateUserRequestDTO request)
        {
            var result = await _userService.CreateAsync(request);
            if (!result.Result.Succeeded)
            {
                foreach (var error in result.Result.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                }
                return BadRequest(ModelState);
            }
            return StatusCode(201, new { userId = result.UserId, verifyToken = result.VerifyToken });
        }

        /// <summary>
        /// Get Users detail
        /// </summary>
        /// <returns>Return user list</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserResponseDTO>), StatusCodes.Status200OK)]
        [Authorize(Roles = "Adminstrator")]
        public async Task<IActionResult> ListAccountAsync([FromQuery] UserParameter parameter)
        {
            var users = await _userService.GetAllUsers(parameter, trackChange: false);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(users.PagingData));
            return Ok(users);
        }
        /// <summary>
        /// Get User By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}", Name = "GetUserDetail")]
        [Authorize(Roles = "Adminstrator,User")]
        public async Task<IActionResult> GetUserDetailAync(string id)
        {
            var user = await _userService.GetUser(id);
            return Ok(user);
        }

        /// <summary>
        /// Update User
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Updated failed</response>
        /// <response code="404">User not found</response>
        [HttpPut("{id}")]
        [Authorize(Roles = "Adminstrator")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUserAsync(string id, UpdateUserRequestDTO request)
        {
            var result = await _userService.UpdateUser(id, request);
            if (result == true)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// User Update Own Profile
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Updated failed</response>
        /// <response code="404">User not found</response>
        [HttpPut]
        [Authorize(Roles = "Adminstrator,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice,User")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUserProfileAsync(UpdateUserOwnProfileRequestDTO request)
        {
            var result = await _userService.UpdateUserOwnProfile(request);
            if (result == true)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest();
            }
        }

        //[HttpDelete("{id}")]
        //[Authorize(Roles = "Adminstrator")]
        //[ProducesResponseType(StatusCodes.Status204NoContent)]
        //[ProducesResponseType(StatusCodes.Status400BadRequest)]
        //public async Task<IActionResult> DeleteUserAsync(string id)
        //{
        //    var result = await _userService.DeleteUser(id);
        //    if (result == true)
        //    {
        //        return Ok(); ;
        //    }
        //    else
        //    {
        //        return BadRequest();
        //    }
        //}

        [HttpGet("get-roles")]
        public async Task<IActionResult> GetRoleList()
        {
            var roles = Enum.GetNames(typeof(Role));
            return Ok(roles);
        }
    }
}
