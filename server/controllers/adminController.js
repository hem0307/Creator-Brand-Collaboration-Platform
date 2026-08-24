import User from '../models/User.js';
import Project from '../models/Project.js';
import Report from '../models/Report.js';
import Payment from '../models/Payment.js';

// @desc    Get admin general platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const creatorUsers = await User.countDocuments({ role: 'creator' });
    const brandUsers = await User.countDocuments({ role: 'brand' });
    const totalProjects = await Project.countDocuments();
    const activeReports = await Report.countDocuments({ status: 'pending' });

    // Mock platform fee calculation based on releasing payments
    const payments = await Payment.find({ status: 'released' });
    const totalReleasingPayouts = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const platformFeeRevenue = totalReleasingPayouts * 0.05; // 5% platform service fee

    res.json({
      totalUsers,
      creatorUsers,
      brandUsers,
      totalProjects,
      activeReports,
      platformFeeRevenue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get paginated users list with keyword search and role filters
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const skipIndex = (page - 1) * limit;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(Number(limit));

    res.json({
      users,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user authorization role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role || !['creator', 'brand', 'admin'].includes(role)) {
      res.status(400);
      throw new Error('Please select a valid user role');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User account not found');
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Suspend user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Prevent admin deleting self
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot delete your own admin account');
    }

    await user.deleteOne();
    res.json({ message: 'User suspended and account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate project campaign brief
// @route   DELETE /api/admin/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project brief not found');
    }

    await project.deleteOne();
    res.json({ message: 'Project campaign removed for content moderation' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get flagged reports list
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporterId', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (resolve or dismiss)
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
export const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !['resolved', 'dismissed'].includes(status)) {
      res.status(400);
      throw new Error('Invalid report status');
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      res.status(404);
      throw new Error('Flagged report details not found');
    }

    report.status = status;
    await report.save();

    res.json({ message: `Report status updated to ${status}`, report });
  } catch (error) {
    next(error);
  }
};
