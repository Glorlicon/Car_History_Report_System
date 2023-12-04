using Application.DTO.CarRecall;
using Application.DTO.CarSpecification;
using Application.DTO.ModelMaintainance;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IModelMaintainanceRepository : IBaseRepository<ModelMaintainance>
    {
        Task<int> CountAll(ModelMaintainanceParameter parameter);
        Task<int> CountByCondition(Expression<Func<ModelMaintainance, bool>> expression, ModelMaintainanceParameter parameter);
        Task<List<ModelMaintainance>> GetModelMaintainances(ModelMaintainanceParameter parameter, bool trackChange);

        Task<List<ModelMaintainance>> GetModelMaintainancesByModelId(string modelId, ModelMaintainanceParameter parameter, bool trackChange);
    }
}
