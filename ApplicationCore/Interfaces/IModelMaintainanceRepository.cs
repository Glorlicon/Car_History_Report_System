using Application.DTO.CarSpecification;
using Application.DTO.ModelMaintainance;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IModelMaintainanceRepository : IBaseRepository<ModelMaintainance>
    {
        Task<List<ModelMaintainance>> GetModelMaintainances(ModelMaintainanceParameter parameter, bool trackChange);

        Task<List<ModelMaintainance>> GetModelMaintainancesByModelId(string modelId, ModelMaintainanceParameter parameter, bool trackChange);
    }
}
