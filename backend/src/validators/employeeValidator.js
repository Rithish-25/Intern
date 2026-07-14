const { z } = require('zod');

const employeeSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address format (must end with a domain suffix like .com, .edu, etc.)'),
  mobile: z.string().trim().regex(/^[1-9]\d{9}$/, 'Mobile number must be exactly 10 digits and cannot start with 0'),
  department: z.string().trim().min(1, 'Department is required'),
  designation: z.string().trim().min(1, 'Designation is required'),
  joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid joining date'
  }),
  status: z.enum(['Active', 'Inactive'], {
    invalid_type_error: 'Status must be Active or Inactive'
  })
});

const validateEmployee = (data) => {
  return employeeSchema.safeParse(data);
};

module.exports = {
  validateEmployee
};
