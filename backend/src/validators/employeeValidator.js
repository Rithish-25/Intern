const { z } = require('zod');

const employeeSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().email('Invalid email address'),
  mobile: z.string().trim().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
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
