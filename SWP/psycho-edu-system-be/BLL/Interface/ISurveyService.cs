using Common.DTO;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interface
{
  public interface ISurveyService
    {
 Task<SurveyWithQuestionsAndAnswersDTO> ImportSurveyFromExcel(IFormFile file, SurveySettingsDTO settings);
        Task<bool> UpdateSurveyAsync(Guid surveyId, UpdateSurveyDTO updateDto);
        Task<IEnumerable<SurveyDTO>> GetAllSurveysAsync();
        Task<SurveyWithQuestionsAndAnswersDTO> GetSurveyByIdAsync(Guid surveyId);
        Task<SurveyResponseDTO> GetSurveyByUserIdAsync(Guid userId);
    }
}
