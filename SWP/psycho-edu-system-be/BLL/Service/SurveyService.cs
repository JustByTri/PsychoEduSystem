using BLL.Interface;
using Common.DTO;
using DAL.Entities;
using DAL.UnitOfWork;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;
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

                            try
                            {
                                // Đọc CategoryId từ cột đầu tiên (A)
                                var categoryId = int.Parse(dataTable.Rows[row][0].ToString());

                                // Kiểm tra Category tồn tại
                                var category = await _unitOfWork.Category.GetByIdInt(categoryId);
                                if (category == null)
                                {
                                    // Có thể ném exception hoặc ghi log
                                    continue;
                                }

                                // Tạo DTO cho câu hỏi
                                var question = new SurveyQuestionDTO
                                {
                                    CategoryId = categoryId,
                                    CategoryName = category.CategoryName,
                                    Question = dataTable.Rows[row][1].ToString(), // Cột B - Câu hỏi
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
                            catch (Exception ex)
                            {
                                throw new ArgumentException("Error when export file, please check");
                            }
                        }

                        var surveyId = Guid.NewGuid();
                        var survey = new Survey
                        {
                            SurveyId = surveyId,
                            Title = settings.Title,
                            Description = settings.Description,
                            Target = settings.Target,
                         
                            UpdateAt = DateTime.Now,
                        };

                        await _unitOfWork.Survey.AddAsync(survey);

                        var result = new SurveyWithQuestionsAndAnswersDTO
                        {
                            SurveyId = surveyId,
                            Title = settings.Title,
                            Description = settings.Description,
                            Target = settings.Target,
                          
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

    }
}
