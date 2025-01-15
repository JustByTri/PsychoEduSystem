using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Entities;

namespace DAL.Repositories.IRepositories
{
    public interface IQuestionRepository
    {
        Task<Question> GetId(Guid questionId);
        Task<IEnumerable<Question>> GetAll();
        Task Add(Question question);
        Task Save();
    }
}
