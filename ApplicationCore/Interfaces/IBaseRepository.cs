using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IBaseRepository<T>
    {
        Task<IEnumerable<T>> GetAll(bool trackChange);

        Task<int> CountAll();

        Task<bool> IsExist(Expression<Func<T, bool>> expression);

        Task<int> CountByCondition(Expression<Func<T, bool>> expression);

        IQueryable<T> FindAll(bool trackChanges);
        IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges);
        void Create(T entity);
        void Update(T entity);
        void Delete(T entity);

        void Attach(object obj);

        Task SaveAsync();
    }
}
