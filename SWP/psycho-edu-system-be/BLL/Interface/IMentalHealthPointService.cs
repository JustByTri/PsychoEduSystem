using Common.DTO;
using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interface
{
   public interface IMentalHealthPointService
    {
        Task<MentalHealthPointResponseDTO> AddMentalHealthPoints(MentalHealthPointInputDTO input);
    }
}
