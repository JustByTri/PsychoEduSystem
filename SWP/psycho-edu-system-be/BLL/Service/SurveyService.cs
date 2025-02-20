    using BLL.Interface;
    using Common.DTO;
    using DAL.Entities;
    using DAL.UnitOfWork;
    using ExcelDataReader;
    using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    namespace BLL.Service
    {
        public class SurveyService : ISurveyService
        {
            private readonly IUnitOfWork _unitOfWork;

            public SurveyService(IUnitOfWork unitOfWork)
            {
                _unitOfWork = unitOfWork;
            }

            public async Task<SurveyWithQuestionsAndAnswersDTO> ImportSurveyFromExcel(IFormFile file, SurveySettingsDTO settings)
                {
                try
                {
                    Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

                    using (var stream = new MemoryStream())
                    {
                        await file.CopyToAsync(stream);
                        stream.Position = 0;

                        using (var reader = ExcelReaderFactory.CreateReader(stream))
                        {
                            var dataSet = reader.AsDataSet(new ExcelDataSetConfiguration
                            {
                                ConfigureDataTable = _ => new ExcelDataTableConfiguration
                                {
                                    UseHeaderRow = false
                                }
                            });

                            var dataTable = dataSet.Tables[0];
                            var questions = new List<SurveyQuestionDTO>();

                            // Read each row
                            for (int row = 0; row < dataTable.Rows.Count; row++)
                            {
                                // Bỏ qua hàng trống
                                if (string.IsNullOrEmpty(dataTable.Rows[row][0]?.ToString()))
                                    continue;
                                if (!int.TryParse(dataTable.Rows[row][0].ToString(), out int categoryId))
                                {
                                    continue; // Bỏ qua nếu không phải số
                                }

                        
                         
                               

                                    // Kiểm tra Category tồn tại
                                    var category = await _unitOfWork.Category.GetByIdInt(categoryId);
                                    if (category == null)
                                    {
                                
                                        continue;
                                    }

                              
                                    var question = new SurveyQuestionDTO
                                    {
                                        CategoryId = categoryId,
                                        CategoryName = category.DimensionName,
                                        Question = dataTable.Rows[row][1].ToString(), 
                                        Answers = new List<string>
                {
                    dataTable.Rows[row][2].ToString(), // Cột C - Answer 1
                    dataTable.Rows[row][3].ToString(), // Cột D - Answer 2
                    dataTable.Rows[row][4].ToString(), // Cột E - Answer 3
                    dataTable.Rows[row][5].ToString()  // Cột F - Answer 4
                },
                                        Points = new List<int> { 0, 1, 2, 3}
                                    };
                                    questions.Add(question);
                          
                            }

                            var surveyId = Guid.NewGuid();
                            var survey = new Survey
                            {
                                SurveyId = surveyId,
                                SurveyName = settings.Title,
                                Description = settings.Description,
                                SurveyFor = settings.Target,
                                 IsPublic = true,
                               CreateAt = DateTime.Now,
                            };

                            await _unitOfWork.Survey.AddAsync(survey);

                            var result = new SurveyWithQuestionsAndAnswersDTO
                            {
                                SurveyId = surveyId,
                                Description = settings.Description,
                     
                                UpdateAt = DateTime.Now,
                                Questions = new List<QuestionWithAnswersDTO>()
                            };

                            foreach (var q in questions)
                            {
                                var question = new Question
                                {
                                    QuestionId = Guid.NewGuid(),
                                    CategoryId = q.CategoryId,
                                    Content = q.Question,
                                    SurveyId = surveyId,
                                    CreateAt = DateTime.Now
                                };

                                await _unitOfWork.Question.AddAsync(question);

                                var answers = new List<AnswerDTO>();

                                // Add answers for each question
                                for (int i = 0; i < q.Answers.Count; i++)
                                {
                                    var answer = new Answer
                                    {
                                        AnswerId = Guid.NewGuid(),
                                        Content = q.Answers[i],
                                        Point = q.Points[i],
                                        QuestionId = question.QuestionId,
                                        CreateAt = DateTime.Now
                                    };

                                    await _unitOfWork.Answer.AddAsync(answer);

                                    // Add answer to response
                                    answers.Add(new AnswerDTO
                                    {
                                        AnswerId = answer.AnswerId,
                                        Content = answer.Content,
                                        Point = answer.Point
                                    });
                                }

                                // Add question with answers to result
                                result.Questions.Add(new QuestionWithAnswersDTO
                                {
                                    QuestionId = question.QuestionId,
                                    Content = question.Content,
                                    CategoryName = q.CategoryName,
                                    Answers = answers
                                });
                            }

                            await _unitOfWork.SaveChangeAsync();
                            return result; 
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Log exception nếu cần
                    Console.WriteLine($"Error: {ex.Message} , please check file again");
                    return null;
                }
            }
        public async Task<bool> UpdateSurveyAsync(Guid surveyId, UpdateSurveyDTO updateDto)
        {
            var survey = await _unitOfWork.Survey.GetByIdAsync(surveyId);
            if (survey == null)
                return false;

            survey.IsPublic = updateDto.IsPublic;
            survey.SurveyFor = updateDto.SurveyFor;
            survey.UpdateAt = DateTime.Now;

            _unitOfWork.Survey.UpdateAsync(survey);
            await _unitOfWork.SaveChangeAsync();
            return true;
        }

        public async Task<IEnumerable<SurveyDTO>> GetAllSurveysAsync()
        {
            var surveys = await _unitOfWork.Survey.GetAll().ToListAsync();
            return surveys.Select(s => new SurveyDTO
            {
                SurveyId = s.SurveyId,
                SurveyName = s.SurveyName,
                Description = s.Description,
                IsPublic = s.IsPublic,
                SurveyFor = s.SurveyFor,
                CreateAt = s.CreateAt,
                UpdateAt = s.UpdateAt
            });
        }

        public async Task<SurveyWithQuestionsAndAnswersDTO> GetSurveyByIdAsync(Guid surveyId)
        {
            var survey = await _unitOfWork.Survey.GetByConditionWithIncludesAsync(
                s => s.SurveyId == surveyId,
                s => s.Questions);

            if (survey == null)
                return null;

            var questionIds = survey.Questions.Select(q => q.QuestionId).ToList();
            var answers = await _unitOfWork.Answer.FindAll(a => questionIds.Contains(a.QuestionId)).ToListAsync();

            var categoryIds = survey.Questions.Select(q => q.CategoryId).Distinct().ToList();
            var categories = await _unitOfWork.Category.FindAll(c => categoryIds.Contains(c.DimensionId)).ToListAsync();

            foreach (var question in survey.Questions)
            {
                question.Answers = answers.Where(a => a.QuestionId == question.QuestionId).ToList();
            }

            return new SurveyWithQuestionsAndAnswersDTO
            {
                SurveyId = survey.SurveyId,
                Title = survey.SurveyName,
                Description = survey.Description,
                IsPublic = survey.IsPublic,
                Target = survey.SurveyFor,
                CreateAt = survey.CreateAt,
                UpdateAt = survey.UpdateAt,
                Questions = survey.Questions.Select(q => new QuestionWithAnswersDTO
                {
                    QuestionId = q.QuestionId,
                    Content = q.Content,
                    CategoryName = categories.FirstOrDefault(c => c.DimensionId == q.CategoryId)?.DimensionName,
                    Answers = q.Answers.Select(a => new AnswerDTO
                    {
                        AnswerId = a.AnswerId,
                        Content = a.Content,
                        Point = a.Point
                    }).ToList()
                }).ToList()
            };
        }
    }
}

