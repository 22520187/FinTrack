using System;

namespace FinTrack.Server.Helpers
{
    public static class TimeZoneHelper
    {
        private static readonly TimeZoneInfo VietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

        /// <summary>
        /// Gets current time in Vietnam timezone (UTC+7)
        /// </summary>
        /// <returns>Current DateTime in Vietnam timezone</returns>
        public static DateTime GetVietnamTime()
        {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, VietnamTimeZone);
        }

        /// <summary>
        /// Converts UTC time to Vietnam timezone
        /// </summary>
        /// <param name="utcTime">UTC DateTime</param>
        /// <returns>DateTime in Vietnam timezone</returns>
        public static DateTime ConvertToVietnamTime(DateTime utcTime)
        {
            return TimeZoneInfo.ConvertTimeFromUtc(utcTime, VietnamTimeZone);
        }

        /// <summary>
        /// Converts Vietnam time to UTC
        /// </summary>
        /// <param name="vietnamTime">DateTime in Vietnam timezone</param>
        /// <returns>UTC DateTime</returns>
        public static DateTime ConvertToUtc(DateTime vietnamTime)
        {
            return TimeZoneInfo.ConvertTimeToUtc(vietnamTime, VietnamTimeZone);
        }
    }
}
