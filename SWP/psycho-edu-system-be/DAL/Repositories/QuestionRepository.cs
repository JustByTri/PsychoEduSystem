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
    public class QuestionRepository : IQuestionRepository
    {
        private readonly MindAidContext _mindAidContext;

        public QuestionRepository(MindAidContext mindAidContext)
        {
            _mindAidContext = mindAidContext;
        }

        public async Task<Question> GetId(Guid questionId)
        {
            return await _mindAidContext.QuestionSets.FindAsync(questionId);

        }

        public async Task<IEnumerable<Question>> GetAll()
        {
            return await _mindAidContext.QuestionSets.ToListAsync();

        }

        public async Task Add(Question question)
        {
            await _mindAidContext.QuestionSets.AddAsync(question);
        }

        public async Task Save()
        {
            await _mindAidContext.SaveChangesAsync();
        }
    }
}
