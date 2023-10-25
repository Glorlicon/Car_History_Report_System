using Application.DTO.CarRecall;
using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarRecallStatusRepository : IBaseRepository<CarRecallStatus>
    {
        Task<CarRecallStatus> GetCarRecallStatus(int recallId, string carId, bool trackChange);

        Task<IEnumerable<CarRecallStatus>> GetCarRecallStatusByCar(string carId, CarRecallStatusParameter parameter, bool trackChange);

        Task<IEnumerable<CarRecallStatus>> GetCarRecallStatusByRecall(int recallId, CarRecallStatusParameter parameter, bool trackChange);
    }
}
