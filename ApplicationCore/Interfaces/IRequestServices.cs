using Application.Common.Models;
using Application.DTO.CarSpecification;
using Application.DTO.Request;
using Application.DTO.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IRequestServices
    {
        Task<PagedList<RequestResponsDTO>> GetAllRequests(RequestParameter parameter, bool trackChange);

        Task<RequestResponsDTO> GetRequest(int id, bool trackChange);

        Task<PagedList<RequestResponsDTO>> GetAllRequestByUserId(string userId, RequestParameter parameter, bool trackChange);

        Task<bool> CreateRequest(RequestCreateRequestDTO requestDTO);

        Task<bool> DeleteRequest(int id);

        Task<bool> UpdateRequest(int id, RequestUpdateRequestDTO requestDTO);

    }
}
