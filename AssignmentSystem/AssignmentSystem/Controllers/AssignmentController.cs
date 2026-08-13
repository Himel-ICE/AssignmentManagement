using AssignmentSystem.DTOs.Assignment;
using AssignmentSystem.Services.Implementations;
using AssignmentSystem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AssignmentController : ControllerBase
    {
        private readonly IAssignmentService _service;

        public AssignmentController(IAssignmentService service)
        {
            _service = service;
        }

        [HttpPost("create")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> Create(CreateAssignmentDto dto)
        {
            var result = await _service.CreateAsync(dto);

            return StatusCode(result.StatusCode, result);
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return StatusCode(result.StatusCode, result);
        }
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return StatusCode(result.StatusCode, result);
        }
        [HttpPut("update/{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> Update(int id, UpdateAssignmentDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return StatusCode(result.StatusCode, result);
        }
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return StatusCode(result.StatusCode, result);
        }
        [HttpPatch("publish/{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Publish(int id)
        {
            var result = await _service.PublishAsync(id);
            return StatusCode(result.StatusCode, result);
        }
        [HttpPatch("close/{id}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Close(int id)
        {
            var result = await _service.CloseAsync(id);
            return StatusCode(result.StatusCode, result);
        }
    }
}
