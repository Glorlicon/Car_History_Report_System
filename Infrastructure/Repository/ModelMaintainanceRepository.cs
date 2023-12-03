using Application.DTO.CarRecall;
using Application.DTO.CarSpecification;
using Application.DTO.ModelMaintainance;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using Infrastructure.Repository.Extension;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class ModelMaintainanceRepository : BaseRepository<ModelMaintainance>, IModelMaintainanceRepository
    {
        protected ApplicationDBContext repositoryContext;
        public ModelMaintainanceRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }


        public async Task<int> CountAll(ModelMaintainanceParameter parameter)
        {
            return await FindAll(false)
                            .Filter(parameter)
                            .CountAsync();
        }

        public async Task<int> CountByCondition(Expression<Func<ModelMaintainance, bool>> expression, ModelMaintainanceParameter parameter)
        {
            return await FindByCondition(expression, false)
                            .Filter(parameter)
                            .CountAsync();
        }
        public async Task<List<ModelMaintainance>> GetModelMaintainancesByModelId(string modelId, ModelMaintainanceParameter parameter, bool trackChange)
        {
            return await FindByCondition(mm => mm.ModelId == modelId, trackChange)
                            .Filter(parameter)
                            .Sort(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }   
        
        public async Task<List<ModelMaintainance>> GetModelMaintainances(ModelMaintainanceParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Filter(parameter)
                            .Sort(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }
    }
}
