const Employee = require('../models/Employee');

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Calculate total, active, and inactive counts
    const totalEmployees = await Employee.countDocuments({ createdBy: req.user.uid });
    const activeEmployees = await Employee.countDocuments({ status: 'Active', createdBy: req.user.uid });
    const inactiveEmployees = await Employee.countDocuments({ status: 'Inactive', createdBy: req.user.uid });

    // Aggregate employees count by department
    const departmentStats = await Employee.aggregate([
      { $match: { createdBy: req.user.uid } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: '$count',
          _id: 0
        }
      },
      { $sort: { value: -1 } }
    ]);

    // Aggregate employees count by status
    const statusStats = await Employee.aggregate([
      { $match: { createdBy: req.user.uid } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: '$count',
          _id: 0
        }
      }
    ]);

    // Fetch the 5 most recently added employees
    const recentEmployees = await Employee.find({ createdBy: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully.',
      data: {
        cards: {
          total: totalEmployees,
          active: activeEmployees,
          inactive: inactiveEmployees
        },
        charts: {
          department: departmentStats,
          status: statusStats
        },
        recentEmployees
      }
    });
  } catch (error) {
    next(error);
  }
};
