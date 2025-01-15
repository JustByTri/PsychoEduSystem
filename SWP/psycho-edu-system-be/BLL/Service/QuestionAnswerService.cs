//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using BLL.Interface;
//using DAL.Entities;
//using DAL.Repositories.IRepositories;
//using OfficeOpenXml;

//namespace BLL.Service
//{
//    public class QuestionAnswerService : IQuestionAnswerService
//    {
//        private readonly IQuestionRepository _questionRepository;
//        private readonly IAnswerRepository _answerRepository;

//        public QuestionAnswerService(IQuestionRepository questionRepository, IAnswerRepository answerRepository)
//        {
//            _questionRepository = questionRepository;
//            _answerRepository = answerRepository;
//        }

//        public async Task ReadExcelAndSaveToDB(string filePath)
//        {
//            var questionAnswer = await ReadExcelFile(filePath);
//            foreach (var item in questionAnswer)
//            {
//                await _questionRepository.Add(questionAnswer, item);


//            }
//        }
//    }
//}
