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

        public async Task<IEnumerable<QuestionWithAnswersDTO>> ImportSurveyFromExcel(IFormFile file, string surveyTitle, string description)
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
                            // Kiểm tra nếu hàng rỗng thì bỏ qua
                            if (string.IsNullOrEmpty(dataTable.Rows[row][0]?.ToString()))
                                continue;

                            var question = new SurveyQuestionDTO
                            {
                                Question = dataTable.Rows[row][0].ToString(), // Column A - Question
                                Answers = new List<string>
                        {
                            dataTable.Rows[row][1].ToString(), // Column B - Answer 1
                            dataTable.Rows[row][2].ToString(), // Column C - Answer 2
                            dataTable.Rows[row][3].ToString(), // Column D - Answer 3
                            dataTable.Rows[row][4].ToString()  // Column E - Answer 4
                        },
                                Points = new List<int> { 1, 2, 3, 4 } // Points for answers
                            };
                            questions.Add(question);
                        }

                        // Create new survey
                        var survey = new Survey
                        {
                            SurveyId = Guid.NewGuid(),
                            Title = surveyTitle,
                            Description = description,
                            IsPublic = true,
                            CreateAt = DateTime.Now,
                            UpdateAt = DateTime.Now
                        };

                        await _unitOfWork.Survey.AddAsync(survey);

                        var result = new List<QuestionWithAnswersDTO>();

                        // Add questions and answers
                        foreach (var q in questions)
                        {
                            var question = new Question
                            {
                                QuestionId = Guid.NewGuid(),
                                Content = q.Question,
                                SurveyId = survey.SurveyId,
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
                            result.Add(new QuestionWithAnswersDTO
                            {
                                QuestionId = question.QuestionId,
                                Content = question.Content,
                                Answers = answers
                            });
                        }

                        await _unitOfWork.SaveChangeAsync();
                        return result; // Trả về danh sách câu hỏi và câu trả lời
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception nếu cần
                Console.WriteLine($"Error: {ex.Message}");
                return null;
            }
        }

    }
}
