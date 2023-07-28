using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class DateTimExtensions
    {
        public static int CalculateAge(this DateOnly dob){
            var today = DateOnly.FromDateTime(DateTime.Now);
            var age = today.Year - dob.Year;
            if (dob> today.AddYears(-age))
            {
                age--;
            }
            return age;
        }
    }
}