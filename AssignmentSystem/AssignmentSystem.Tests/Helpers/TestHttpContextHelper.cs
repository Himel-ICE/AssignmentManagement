using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace AssignmentSystem.Tests.Helpers
{
    public static class TestHttpContextHelper
    {
        public static IHttpContextAccessor CreateHttpContextAccessor(
            int? userId = null,
            params string[] roles)
        {
            var claims = new List<Claim>();

            if (userId.HasValue)
            {
                claims.Add(new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString()));
            }

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);

            var httpContext = new DefaultHttpContext
            {
                User = principal
            };

            var accessor = new HttpContextAccessor
            {
                HttpContext = httpContext
            };

            return accessor;
        }
    }
}
