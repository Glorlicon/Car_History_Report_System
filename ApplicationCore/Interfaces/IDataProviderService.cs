using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.DataProvider;
using Application.DTO.Request;
using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IDataProviderService
    {
        Task<PagedList<DataProviderDetailsResponseDTO>> GetAllDataProviders(DataProviderParameter parameter);

        Task<PagedList<DataProviderDetailsResponseDTO>> GetAllDataProvidersWithoutUser(DataProviderParameter parameter, DataProviderType type);

        Task<PagedList<DataProviderDetailsResponseDTO>> GetAllDataProvidersByType(DataProviderType type, DataProviderParameter parameter);

        Task<DataProviderDetailsResponseDTO> GetDataProvider(int dataProviderId);

        Task<DataProviderDetailsResponseDTO> GetDataProviderByUserId(string userId);

        Task<DataProviderDetailsResponseDTO> CreateDataProvider(DataProviderCreateRequestDTO request);

        Task<bool> DeleteDataProvider(int dataProviderId);

        Task<bool> UpdateDataProvider(int dataProviderId, DataProviderUpdateRequestDTO request);

        Task<bool> ContactDataProvider(DataProviderContactCreateRequestDTO request);

        Task<PagedList<DataProviderReviewsResponseDTO>> GetAllReview(DataProviderReviewParameter parameter);

        Task<DataProviderReviewsResponseDTO> GetReview(string userId, int dataProviderId);

        Task<bool> ReviewDataProvider(int dataProviderId, DataProviderReviewCreateRequestDTO request);

        Task<bool> EditReviewDataProvider(int dataProviderId, DataProviderReviewUpdateRequestDTO request);

        Task<bool> DeleteReviewDataProvider(int dataProviderId, string userId);
    }
}
