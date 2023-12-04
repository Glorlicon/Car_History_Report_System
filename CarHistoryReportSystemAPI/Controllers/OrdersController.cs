using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Car;
using Application.DTO.Order;
using Application.Interfaces;
using Application.Validation.Car;
using CarHistoryReportSystemAPI.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderServices _orderService;
        private readonly IStringLocalizer<SharedResources> _sharedLocalizer;

        public OrdersController(IOrderServices orderService, IStringLocalizer<SharedResources> sharedLocalizer)
        {
            _orderService = orderService;
            _sharedLocalizer = sharedLocalizer;
        }

        /// <summary>
        /// Get All Orders
        /// </summary>
        /// <returns>Order List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<OrderResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetOrdersAsync([FromQuery] OrderParameter parameter)
        {
            var orders = await _orderService.GetAllOrders(parameter);
            Response.Headers.AccessControlExposeHeaders = "*";
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(orders.PagingData));
            return Ok(orders);
        }

        /// <summary>
        /// Get All Orders by User Id
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="parameter"></param>
        /// <returns>Order List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<OrderResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetOrdersByUserIdAsync(string userId, [FromQuery] OrderParameter parameter)
        {
            var orders = await _orderService.GetOrdersByUserId(userId,parameter);
            Response.Headers.AccessControlExposeHeaders = "*";
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(orders.PagingData));
            return Ok(orders);
        }

        /// <summary>
        /// Get Order By id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Order</returns>
        [HttpGet("{id}", Name = "GetOrder")]
        [ProducesResponseType(typeof(OrderResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrderAsync(int id)
        {
            var order = await _orderService.GetOrder(id);
            return Ok(order);
        }

        /// <summary>
        /// Create order
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="201">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost]
        //[Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateOrderAsync([FromBody] OrderCreateRequestDTO request)
        {
            var result = await _orderService.CreateOrder(request);
            return CreatedAtRoute("GetOrder", new { id = result.Id }, result);
        }

        /// <summary>
        /// Get All Order Options
        /// </summary>
        /// <returns>Order Option List</returns>
        [HttpGet("options")]
        [ProducesResponseType(typeof(IEnumerable<OrderOptionResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetOrderOptions()
        {
            var orderOptions = await _orderService.GetAllOrderOptions(); 
            return Ok(orderOptions);
        }

        /// <summary>
        /// Get Order Option By id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Order Option</returns>
        [HttpGet("options/{id}", Name = "GetOrderOption")]
        [ProducesResponseType(typeof(OrderOptionResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrderOptionAsync(int id)
        {
            var order = await _orderService.GetOrderOption(id);
            return Ok(order);
        }

        /// <summary>
        /// Create order option
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="201">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost("options")]
        //[Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateOrderOptionAsync([FromBody] OrderOptionCreateRequestDTO request)
        {
            var id = await _orderService.CreateOrderOption(request);
            return CreatedAtRoute("GetOrderOption", new { id = id }, null);
        }

        /// <summary>
        /// Update Order Option
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Order Option not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("options/{id}")]
        //[Authorize(Roles = "Adminstrator,CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateOrderOptionAsync(int id, [FromBody] OrderOptionUpdateRequestDTO request)
        {
            await _orderService.UpdateOrderOption(id, request);
            return NoContent();
        }

        /// <summary>
        /// Delete Order Option
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Delete Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Order Option not found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("options/{id}")]
        //[Authorize(Roles = "Adminstrator,CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteOrderOptionAsync(int id)
        {
            await _orderService.DeleteOrderOption(id);
            return NoContent();
        }
    }
}
