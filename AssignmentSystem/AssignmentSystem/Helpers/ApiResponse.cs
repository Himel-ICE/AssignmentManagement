namespace AssignmentSystem.Helpers
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }
        public ApiResponse()
        {
        }
        public ApiResponse(bool success, int statusCode, string message, T? data = default, List<string>? errors = null)
        {
            Success = success;
            StatusCode = statusCode;
            Message = message;
            Data = data;
            Errors = errors;
        }
    }
}
