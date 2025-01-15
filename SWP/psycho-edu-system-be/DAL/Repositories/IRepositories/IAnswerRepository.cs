using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Entities;

namespace DAL.Repositories.IRepositories
{
    public interface IAnswerRepository
    {
        Task<Answer> GetId(Guid answerId);
        Task<IEnumerable<Answer>> GetAll();
        Task Add(Answer answer);
        Task Save();
    }
}
