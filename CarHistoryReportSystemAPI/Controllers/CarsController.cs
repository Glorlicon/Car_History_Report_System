using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using Application.Interfaces;
using Application.Validation.Car;
using Application.Validation.CarOwnerHistory;
using AutoMapper;
using Domain.Enum;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly ICarServices _carService;

        public CarsController(ICarServices carService)
        {
            _carService = carService;
        }

        /// <summary>
        /// Get All Cars
        /// </summary>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet(Name = "GetCars")]
        [ProducesResponseType(typeof(IEnumerable<CarResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarsAsync([FromQuery] CarParameter parameter)
        {
            CarParameterValidator validator = new CarParameterValidator();
            var validationResult = validator.Validate(parameter);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(error.ErrorMessage);
                }
                return BadRequest(errors);
            }
            var cars = await _carService.GetAllCars(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(cars.PagingData));
            return Ok(cars);
        }

        /// <summary>
        /// Get Car By vinId
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car</returns>
        [HttpGet("{vinId}", Name = "GetCar")]
        [ProducesResponseType(typeof(CarResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarAsync(string vinId)
        {
            var car = await _carService.GetCar(vinId);
            return Ok(car);
        }

        /// <summary>
        /// Get Car Sales Info By vinId
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>CarSalesInfo</returns>
        [HttpGet("{vinId}/car-sales-info", Name = "GetCarSalesInfo")]
        [ProducesResponseType(typeof(CarSalesInfoResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarSalesInfoAsync(string vinId)
        {
            var car = await _carService.GetCar(vinId);
            if(car.CarSalesInfo is null)
            {
                return NotFound(new {error = $"Car with id {car.VinId} don't have car sales info" });
            }
            return Ok(car.CarSalesInfo);
        }

        /// <summary>
        /// Get All Cars Created by UserId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("user/{userId}", Name = nameof(GetCarByUserIdAsync))]
        [ProducesResponseType(typeof(IEnumerable<CarResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarByUserIdAsync(string userId, [FromQuery] CarParameter parameter)
        {
            CarParameterValidator validator = new CarParameterValidator();
            var validationResult = validator.Validate(parameter);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(error.ErrorMessage);
                }
                return BadRequest(errors);
            }
            var cars = await _carService.GetCarCreatedByUserId(userId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(cars.PagingData));
            return Ok(cars);
        }

        /// <summary>
        /// Get All Cars of manufacturerId
        /// </summary>
        /// <param name="manufacturerId"></param>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("manufacturer/{manufacturerId}", Name = "GetCarByManufacturerId")]
        [ProducesResponseType(typeof(IEnumerable<CarResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarByManufacturerIdAsync(int manufacturerId, [FromQuery] CarParameter parameter)
        {
            CarParameterValidator validator = new CarParameterValidator();
            var validationResult = validator.Validate(parameter);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(error.ErrorMessage);
                }
                return BadRequest(errors);
            }
            var cars = await _carService.GetCarByManufacturerId(manufacturerId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(cars.PagingData));
            return Ok(cars);
        }

        /// <summary>
        /// Get All Cars of Car Dealer Id Selling
        /// </summary>
        /// <param name="carDealerId"></param>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("car-dealer/{carDealerId}", Name = "GetCarsByCarDealerId")]
        [ProducesResponseType(typeof(IEnumerable<CarResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarsByCarDealerIdAsync(int carDealerId, [FromQuery] CarParameter parameter)
        {
            CarParameterValidator validator = new CarParameterValidator();
            var validationResult = validator.Validate(parameter);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(error.ErrorMessage);
                }
                return BadRequest(errors);
            }
            var cars = await _carService.GetCarsByCarDealerId(carDealerId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(cars.PagingData));
            return Ok(cars);
        }

        /// <summary>
        /// Get All Cars Created by adminstrator
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("created-by-admin", Name = "GetCarsByAdminstrator")]
        [Authorize(Roles = "Adminstrator")]
        [ProducesResponseType(typeof(IEnumerable<CarResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarsByAdminstratorAsync([FromQuery] CarParameter parameter)
        {
            CarParameterValidator validator = new CarParameterValidator();
            var validationResult = validator.Validate(parameter);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(error.ErrorMessage);
                }
                return BadRequest(errors);
            }
            var cars = await _carService.GetCarsByAdminstrator(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(cars.PagingData));
            return Ok(cars);
        }

        /// <summary>
        /// Get All Cars Currently selling
        /// </summary>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("selling", Name = "GetCarsCurrentlySelling")]
        [ProducesResponseType(typeof(IEnumerable<CarResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarsCurrentlySellingAsync([FromQuery] CarParameter parameter)
        {
            CarParameterValidator validator = new CarParameterValidator();
            var validationResult = validator.Validate(parameter);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(error.ErrorMessage);
                }
                return BadRequest(errors);
            }
            var cars = await _carService.GetCarsCurrentlySelling(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(cars.PagingData));
            return Ok(cars);
        }

        /// <summary>
        /// Create car
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateCar")]
        [Authorize(Roles = "Adminstrator,Manufacturer,CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarAsync([FromBody] CarCreateRequestDTO request)
        {
            CarCreateRequestDTOValidator validator = new CarCreateRequestDTOValidator();
            var validationResult = validator.Validate(request);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(error.ErrorMessage);
                }
                return BadRequest(errors);
            }
            var result = await _carService.CreateCar(request);
            return NoContent();
        }

        /// <summary>
        /// Create car sales info
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost("{vinId}/car-sales-info",Name = "CreateCarSalesInfo")]
        [Authorize(Roles = "Adminstrator,CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarSalesInfoAsync(string vinId, [FromBody] CarSalesInfoCreateRequestDTO request)
        {
            var result = await _carService.CreateCarSalesInfo(vinId, request);
            return NoContent();
        }

        /// <summary>
        /// Update Car Sales Info
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car model not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("{vinId}/car-sales-info")]
        [Authorize(Roles = "Adminstrator,CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCarSalesInfoAsync(string vinId, [FromBody] CarSalesInfoUpdateRequestDTO request)
        {
            var result = await _carService.UpdateCarSalesInfo(vinId, request);
            return NoContent();
        }

        /// <summary>
        /// Update Car
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car model not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("{vinId}")]
        [Authorize(Roles = "Adminstrator,Manufacturer,CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCarAsync(string vinId, [FromBody] CarUpdateRequestDTO request)
        {
            CarUpdateRequestDTOValidator validator = new CarUpdateRequestDTOValidator();
            var validationResult = validator.Validate(request);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(error.ErrorMessage);
                }
                return BadRequest(errors);
            }
            var result = await _carService.UpdateCar(vinId, request);
            return NoContent();
        }

        /// <summary>
        /// Delete Car
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns></returns>
        /// <response code="204">Delete Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car not found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("{vinId}")]
        [Authorize(Roles = "Adminstrator,Manufacturer,CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCarAsync(string vinId)
        {
            var result = await _carService.DeleteCar(vinId);
            return NoContent();
        }

        /// <summary>
        /// Get All Car's Color
        /// </summary>
        /// <returns>Car's Color List</returns>
        [HttpGet("color-list", Name = "GetColorList")]
        public IActionResult GetColorList()
        {
            var listTypes = Enum.GetNames(typeof(Color));
            return Ok(listTypes);
        }

        /// <summary>
        /// Sold Car
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">vinId not found</response>
        /// <response code="500">Sold Car Failed</response>
        [HttpPost("{vinId}/sold")]
        [Authorize(Roles = "CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SoldCar(string vinId, [FromBody] CarOwnerHistoryCreateRequestDTO request)
        {
            CarOwnerHistoryCreateRequestDTOValidator validator = new CarOwnerHistoryCreateRequestDTOValidator();
            var validationResult = validator.Validate(request);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(error.ErrorMessage);
                }
                return BadRequest(errors);
            }
            var result = await _carService.SoldCar(vinId, request);
            return NoContent();
        }
    }
}
