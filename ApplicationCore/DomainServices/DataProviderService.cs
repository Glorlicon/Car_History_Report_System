using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarSpecification;
using Application.DTO.DataProvider;
using Application.Interfaces;
using Application.Validation.Car;
using Application.Validation.DataProvider;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using FluentValidation.AspNetCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class DataProviderService : IDataProviderService
    {
        private readonly IDataProviderRepository _dataProviderRepository;
        private readonly IIdentityServices _identityServices;
        private readonly IMapper _mapper;
        private readonly IEmailServices _emailServices;
        private readonly ICarRepository _carRepository;
        private readonly IAuthenticationServices _authenticationServices;
        private readonly IReviewRepository _reviewRepository;
        public DataProviderService(IDataProviderRepository dataProviderRepository, IMapper mapper, IIdentityServices identityServices, IEmailServices emailServices, ICarRepository carRepository, IAuthenticationServices authenticationServices, IReviewRepository reviewRepository)
        {
            _dataProviderRepository = dataProviderRepository;
            _mapper = mapper;
            _identityServices = identityServices;
            _emailServices = emailServices;
            _carRepository = carRepository;
            _authenticationServices = authenticationServices;
            _reviewRepository = reviewRepository;
        }

        public async Task<PagedList<DataProviderDetailsResponseDTO>> GetAllDataProviders(DataProviderParameter parameter)
        {
            var dataProviders = await _dataProviderRepository.GetAllDataProviders(parameter, trackChange: false);
            var dataProvidersResponse = _mapper.Map<List<DataProviderDetailsResponseDTO>>(dataProviders);
            var count = await _dataProviderRepository.CountAll();
            return new PagedList<DataProviderDetailsResponseDTO>(dataProvidersResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<IEnumerable<DataProviderDetailsResponseDTO>> GetAllDataProvidersWithoutUser(DataProviderParameter parameter, DataProviderType type)
        {
            var dataProviders = await _dataProviderRepository.GetAllDataProvidersWithoutUser(parameter, type, trackChange: false);
            var dataProvidersResponse = _mapper.Map<IEnumerable<DataProviderDetailsResponseDTO>>(dataProviders);
            return dataProvidersResponse;
        }

        public async Task<IEnumerable<DataProviderDetailsResponseDTO>> GetAllDataProvidersByType(DataProviderType type)
        {
            var dataProviders = await _dataProviderRepository.GetAllDataProvidersByType(type, false);
            var dataProvidersResponse = _mapper.Map<IEnumerable<DataProviderDetailsResponseDTO>>(dataProviders);
            return dataProvidersResponse;
        }

        public async Task<DataProviderDetailsResponseDTO> GetDataProvider(int dataProviderId)
        {
            var dataProvider = await _dataProviderRepository.GetDataProvider(dataProviderId, false);
            if (dataProvider is null)
            {
                throw new DataProviderNotFoundException(dataProviderId);
            }
            var dataProviderResponse = _mapper.Map<DataProviderDetailsResponseDTO>(dataProvider);
            return dataProviderResponse;
        }

        public async Task<DataProviderDetailsResponseDTO> GetDataProviderByUserId(string userId)
        {
            var user = await _identityServices.GetUserAsync(userId);
            if (user is null)
            {
                throw new UserNotFoundException(userId);
            }
            if (user.DataProviderId is null)
            {
                throw new DataProviderNotFoundException(user.DataProviderId);
            }
            return await GetDataProvider(user.DataProviderId.Value);
        }

        public async Task<DataProviderDetailsResponseDTO> CreateDataProvider(DataProviderCreateRequestDTO request)
        {
            var dataProvider = _mapper.Map<DataProvider>(request);
            foreach (WorkingTime wkt in dataProvider.WorkingTimes)
            {
                if (wkt.IsClosed == true)
                {
                    wkt.StartTime = new TimeOnly(0, 0);
                    wkt.EndTime = new TimeOnly(0, 0);
                }
            }
            _dataProviderRepository.Create(dataProvider);
            await _dataProviderRepository.SaveAsync();
            var result = _mapper.Map<DataProviderDetailsResponseDTO>(dataProvider);
            return result;
        }

        public async Task<bool> DeleteDataProvider(int dataProviderId)
        {
            var dataProvider = await _dataProviderRepository.GetDataProvider(dataProviderId, true);
            if (dataProvider is null)
            {
                throw new DataProviderNotFoundException(dataProviderId);
            }
            _dataProviderRepository.Delete(dataProvider);
            await _dataProviderRepository.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateDataProvider(int dataProviderId, DataProviderUpdateRequestDTO request)
        {
            var user = await _authenticationServices.GetCurrentUserAsync();
            if (user is null)
            {
                throw new UserNotFoundException("No current user is logged in");
            }
            if (user.DataProviderId is null)
            {
                throw new UnauthorizedAccessException();
            }
            var dataProvider = await _dataProviderRepository.GetDataProvider(dataProviderId, true);

            if (dataProvider is null)
            {
                throw new DataProviderNotFoundException(dataProviderId);
            }
            if (dataProvider.Id != user.DataProviderId && user.Role != Role.Adminstrator)
            {
                throw new UnauthorizedAccessException();
            }
            _mapper.Map(request, dataProvider);
            await _dataProviderRepository.SaveAsync();
            return true;
        }

        public async Task<bool> ContactDataProvider(DataProviderContactCreateRequestDTO request)
        {
            var car = await _carRepository.GetCarIncludeDataProviderFromVinId(request.VinId, trackChange: false);

            if (car == null)
            {
                throw (new CarNotFoundException(request.VinId));
            }

            if (car.CreatedByUser.DataProvider == null)
            {
                throw (new DataProviderNotFoundException(car.CreatedByUser.DataProviderId));
            }
            await _emailServices.SendEmailAsync(car.CreatedByUser.DataProvider.Email + "", "User contact",
               "Hello " + car.CreatedByUser.DataProvider.Name + "\n" +
               "This user interested in this car with VinId : " + request.VinId + "\n" +
               "This is user contact: \n" +
               "FirstName: " + request.FirstName + "\n" +
               "LastName: " + request.LastName + "\n" +
               "Email: " + request.Email + "\n" +
               "ZipCode: " + request.ZipCode + "\n" +
               "PhoneNumber: " + request.PhoneNumber + "\n");
            return true;
        }
        public async Task<bool> ReviewDataProvider(int dataProviderId, DataProviderReviewCreateRequestDTO request)
        {
            var user = await _authenticationServices.GetCurrentUserAsync();
            if (user is null)
            {
                throw new UserNotFoundException("No current user is logged in");
            }
            var dataProvider = await _dataProviderRepository.GetDataProvider(dataProviderId, trackChange: false);
            if (dataProvider is null)
            {
                throw new DataProviderNotFoundException(dataProviderId);
            }
            var oldReview = await _reviewRepository.GetReview(user.Id, dataProviderId, trackChange: false);
            if (oldReview is not null)
            {
                throw new OldReviewExistException(user.Id, dataProviderId);
            }
            var review = _mapper.Map<Review>(request);
            review.DataProviderId = dataProviderId;
            review.UserId = user.Id;
            _reviewRepository.Create(review);
            await _reviewRepository.SaveAsync();
            return true;
        }

        public async Task<bool> EditReviewDataProvider(int dataProviderId, DataProviderReviewUpdateRequestDTO request)
        {
            var user = await _authenticationServices.GetCurrentUserAsync();
            if (user is null)
            {
                throw new UserNotFoundException("No current user is logged in");
            }
            var dataProvider = await _dataProviderRepository.GetDataProvider(dataProviderId, trackChange: false);
            if (dataProvider is null)
            {
                throw new DataProviderNotFoundException(dataProviderId);
            }
            var oldReview = await _reviewRepository.GetReview(user.Id, dataProviderId, trackChange: true);
            if (oldReview is null)
            {
                throw new OldReviewNotExistException(user.Id, dataProviderId);
            }
            _mapper.Map(request, oldReview);
            await _reviewRepository.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteReviewDataProvider(int dataProviderId, string userId)
        {
            var user = await _authenticationServices.GetCurrentUserAsync();
            if (user is null)
            {
                throw new UserNotFoundException("No current user is logged in");
            }
            var dataProvider = await _dataProviderRepository.GetDataProvider(dataProviderId, false);
            if (dataProvider is null)
            {
                throw new DataProviderNotFoundException(dataProviderId);
            }
            var review = await _reviewRepository.GetReview(user.Id, dataProviderId, trackChange: true);
            if (review is null)
            {
                throw new OldReviewNotExistException(user.Id, dataProviderId);
            }
            _reviewRepository.Delete(review);
            await _dataProviderRepository.SaveAsync();
            return true;
        }

        public async Task<PagedList<DataProviderReviewsResponseDTO>> GetAllReview(DataProviderReviewParameter parameter)
        {
            var reviews = await _reviewRepository.GetAllReview(parameter, trackChange: false);
            var reviewsResponse = _mapper.Map<List<DataProviderReviewsResponseDTO>>(reviews);
            var count = await _reviewRepository.CountAll();
            return new PagedList<DataProviderReviewsResponseDTO>(reviewsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<DataProviderReviewsResponseDTO> GetReview(string userId, int dataProviderId)
        {
            var review = await _reviewRepository.GetReview(userId, dataProviderId, trackChange: false);
            if (review is null)
            {
                throw new ReviewNotFoundException(userId, dataProviderId);
            }
            var reviewsResponse = _mapper.Map<DataProviderReviewsResponseDTO>(review);
            return reviewsResponse;
        }
    }
}
