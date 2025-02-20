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
    public class SurveyResponseRepository : GenericRepository<SurveyResponse>, ISurveyResponseRepository
    {
        public SurveyResponseRepository(MindAidContext context) : base(context) { }
    }
}
