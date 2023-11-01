using Application.DTO.CarSpecification;
using Application.DTO.Request;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IRequestRepository : IBaseRepository<Request>
    {
        Task<Request> GetRequestById(int id, bool trackChange);
        Task<Request> GetRequestByIdAndUserId(int id, string userId, bool trackChange);

        Task<IEnumerable<Request>> GetAllRequests(RequestParameter parameter, bool trackChange);

        //Task<IEnumerable<CarSpecification>> GetAllCarModelsTest(CarSpecificationParameter parameter, bool trackChange);

        Task<IEnumerable<Request>> GetAllRequestByUserId(string userId, RequestParameter parameter, bool trackChange);
    }
}
