using Application.DTO.Car;
using Application.DTO.CarRecall;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarRecallRepository : IBaseRepository<CarRecall>
    {
        Task<int> CountAll(CarRecallParameter parameter);
        Task<int> CountByCondition(Expression<Func<CarRecall, bool>> expression, CarRecallParameter parameter);
        Task<CarRecall> GetCarRecallById(int id, bool trackChange);

        Task<IEnumerable<CarRecall>> GetCarRecalls(CarRecallParameter parameter, bool trackChange);

        Task<IEnumerable<CarRecall>> GetCarRecallsByManufacturer(int manufacturerId, CarRecallParameter parameter, bool trackChange);

        Task<IEnumerable<CarRecall>> GetCarRecallsByModel(string modelId, CarRecallParameter parameter, bool trackChange);
    }
}
