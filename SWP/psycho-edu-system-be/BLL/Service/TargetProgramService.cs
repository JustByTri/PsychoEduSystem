using BLL.Interface;
using DAL.Entities;
using DAL.UnitOfWork;
using System.Threading.Tasks;

namespace BLL.Service
{
    public class TargetProgramService : ITargetProgramService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TargetProgramService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<TargetProgram> AddProgramAsync(TargetProgram program)
        {
            try
            {
                await _unitOfWork.TargetProgram.AddProgamAsync(program); //  Gọi đúng qua UnitOfWork
                await _unitOfWork.SaveChangeAsync();
                return program;

            }
            catch (Exception ex)
            {
                throw new Exception($"Error while saving TargetProgram: {ex.InnerException?.Message ?? ex.Message}");
            }

        }


        public async Task<IEnumerable<TargetProgram>> GetAllProgramsAsync()
        {
            return await _unitOfWork.TargetProgram.GetAllAsync();
        }

        public async Task<TargetProgram> UpdateProgramAsync(TargetProgram program)
        {
            _unitOfWork.TargetProgram.Update(program);
            await _unitOfWork.SaveChangeAsync();
            return program;
        }

        public async Task<TargetProgram> GetProgramByIdAsync(Guid id)
        {
            return await _unitOfWork.TargetProgram.GetByIdAsync(id);
        }

        public async Task DeleteProgramAsync(Guid id)
        {
            var program = await _unitOfWork.TargetProgram.GetByIdAsync(id);
            if (program != null)
            {
                _unitOfWork.TargetProgram.Delete(program);
                await _unitOfWork.SaveChangeAsync();
            }
        }





    }
}
