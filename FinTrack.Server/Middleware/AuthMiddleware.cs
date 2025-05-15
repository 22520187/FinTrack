using Microsoft.AspNetCore.Http;

namespace FinTrack.Server.Middleware
{
        public class AuthMiddleware
        {
            private readonly RequestDelegate _next;

            public AuthMiddleware(RequestDelegate next)
            {
                _next = next;
            }

            public async Task InvokeAsync(HttpContext context)
            {
                if (context.Request.Cookies.TryGetValue("AuthToken", out var token))
                {
                    // Add JWT to Authorization header if missing
                    if (!context.Request.Headers.ContainsKey("Authorization"))
                    {
                        context.Request.Headers.Append("Authorization", $"Bearer {token}");
                    }
                }

                await _next(context);
            }
        }

}

