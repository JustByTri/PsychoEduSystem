using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Data;
using DAL.Entities;
using DAL.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class AnswerRepository : IAnswerRepository

    {
        private readonly MindAidContext _mindAidContext;

        public AnswerRepository(MindAidContext mindAidContext)
        {
            _mindAidContext = mindAidContext;
        }

        public async Task<Answer> GetId(Guid answerId)
        {
            return await _mindAidContext.Answers.FirstOrDefaultAsync(a => a.AnswerId == answerId);
        }

        public async Task<IEnumerable<Answer>> GetAll()
        {
            return await _mindAidContext.Answers.ToListAsync();
        }

        public async Task Add(Answer answer)
        {
            await _mindAidContext.AddAsync(answer);
        }

        public async Task Save()
        {
            await _mindAidContext.SaveChangesAsync();
        }
    }
}
