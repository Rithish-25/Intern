const Employee = require('../models/Employee');
const { validateEmployee } = require('../validators/employeeValidator');

// @desc    Get all employees (with filter, search, sort, and pagination)
// @route   GET /api/v1/employees
// @access  Private
exports.getEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', department = '', status = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = { createdBy: { $in: [req.user.uid, null] } };

    // Apply department filter
    if (department) {
      query.department = department;
    }

    // Apply status filter
    if (status) {
      query.status = status;
    }

    // Apply search filter (matches fullName or email case-insensitively)
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination calculations
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skipNum = (pageNum - 1) * limitNum;

    // Sorting parameters
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const employees = await Employee.find(query)
      .sort(sort)
      .skip(skipNum)
      .limit(limitNum);

    const total = await Employee.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully.',
      data: {
        employees,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee details
// @route   GET /api/v1/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, createdBy: { $in: [req.user.uid, null] } });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee details retrieved successfully.',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/v1/employees
// @access  Private
exports.createEmployee = async (req, res, next) => {
  try {
    // Validate request body with Zod
    const validation = validateEmployee(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
        data: null
      });
    }

    const { email } = req.body;
    
    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'An employee with this email address already exists.',
        data: null
      });
    }

    const newEmployee = new Employee({ ...req.body, createdBy: req.user.uid });
    const savedEmployee = await newEmployee.save();

    return res.status(201).json({
      success: true,
      message: 'Employee added successfully.',
      data: savedEmployee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/v1/employees/:id
// @access  Private
exports.updateEmployee = async (req, res, next) => {
  try {
    // Validate request body with Zod
    const validation = validateEmployee(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
        data: null
      });
    }

    const { email } = req.body;

    // Check if email is used by another employee
    const duplicateEmployee = await Employee.findOne({ email, _id: { $ne: req.params.id } });
    if (duplicateEmployee) {
      return res.status(409).json({
        success: false,
        message: 'An employee with this email address already exists.',
        data: null
      });
    }

    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: req.params.id, createdBy: { $in: [req.user.uid, null] } },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully.',
      data: updatedEmployee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/v1/employees/:id
// @access  Private
exports.deleteEmployee = async (req, res, next) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({ _id: req.params.id, createdBy: { $in: [req.user.uid, null] } });

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee has been deleted successfully.',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
