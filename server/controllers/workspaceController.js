import Workspace from '../models/Workspace.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { sendMockEmail } from '../utils/sendMockEmail.js';

// @desc    Get all workspaces for current user
// @route   GET /api/workspaces
// @access  Private
export const getWorkspaces = async (req, res, next) => {
  try {
    const query = req.user.role === 'creator' 
      ? { creatorId: req.user._id } 
      : { brandId: req.user._id };

    const workspaces = await Workspace.find(query)
      .populate('projectId', 'title description budget deliverables targetPlatforms deadline location requirements isRemote niche')
      .populate('brandId', 'name email profileImage')
      .populate('creatorId', 'name email profileImage')
      .sort({ updatedAt: -1 });

    res.json(workspaces);
  } catch (error) {
    next(error);
  }
};

// @desc    Get workspace details by ID
// @route   GET /api/workspaces/:id
// @access  Private
export const getWorkspaceById = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('projectId', 'title description deliverables budget deadline')
      .populate('brandId', 'name email profileImage')
      .populate('creatorId', 'name email profileImage');

    if (!workspace) {
      res.status(404);
      throw new Error('Workspace not found');
    }

    // Verify requesting user is member of this workspace
    const isMember = 
      workspace.creatorId._id.toString() === req.user._id.toString() ||
      workspace.brandId._id.toString() === req.user._id.toString();

    if (!isMember) {
      res.status(403);
      throw new Error('Not authorized to access this workspace');
    }

    res.json(workspace);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit milestone proof (Creator only)
// @route   POST /api/workspaces/:id/milestones
// @access  Private/Creator
export const submitMilestone = async (req, res, next) => {
  try {
    const { milestoneId, submissionUrl, submissionNotes } = req.body;

    if (!milestoneId || !submissionUrl) {
      res.status(400);
      throw new Error('Milestone ID and submission URL are required');
    }

    const workspace = await Workspace.findById(req.params.id).populate('projectId', 'title');
    if (!workspace) {
      res.status(404);
      throw new Error('Workspace not found');
    }

    if (workspace.creatorId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the assigned creator can submit milestone proof');
    }

    // Find and update the milestone
    const milestone = workspace.milestones.id(milestoneId);
    if (!milestone) {
      res.status(404);
      throw new Error('Milestone not found');
    }

    milestone.status = 'submitted';
    milestone.submissionUrl = submissionUrl;
    milestone.submissionNotes = submissionNotes || '';
    milestone.feedbackNotes = ''; // clear previous feedback

    await workspace.save();

    const projId = workspace.projectId?._id || workspace.projectId;
    const projTitle = workspace.projectId?.title || 'Campaign';

    // Trigger Notification for Brand (Company)
    await Notification.create({
      recipientId: workspace.brandId,
      senderId: req.user._id,
      projectId: projId,
      type: 'submission_uploaded',
      title: 'Submission Uploaded 📤',
      body: `Creator "${req.user.name}" uploaded deliverable proof for milestone: "${milestone.title}" in campaign "${projTitle}"`,
      link: '/dashboard?tab=collaborations'
    });

    // Trigger Notification for Creator
    await Notification.create({
      recipientId: req.user._id,
      senderId: workspace.brandId,
      projectId: projId,
      type: 'submission_uploaded',
      title: 'Deliverable Proof Submitted',
      body: `Your deliverable proof of work for "${milestone.title}" was submitted to sponsor.`,
      link: '/dashboard?tab=active-collaborations'
    });

    // Trigger mock email alert to Brand Owner
    try {
      const brandUser = await User.findById(workspace.brandId);
      if (brandUser) {
        sendMockEmail({
          to: brandUser.email,
          subject: 'Submission Uploaded 📤',
          body: `Hi ${brandUser.name},\n\nCreator ${req.user.name} uploaded deliverable proof for milestone: "${milestone.title}" in campaign "${projTitle}".\n\nReview the submission files on your CreatorSync dashboard.\n\nBest,\nCreatorSync Team`
        });
      }
    } catch (mailErr) {
      console.warn('Simulated milestone mail dispatch failed:', mailErr.message);
    }

    res.json(workspace);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a milestone (Brand only)
// @route   PATCH /api/workspaces/:id/milestones/:mId
// @access  Private/Brand
export const approveMilestone = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate('projectId', 'title');
    if (!workspace) {
      res.status(404);
      throw new Error('Workspace not found');
    }

    if (workspace.brandId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the hiring brand can approve milestone deliverables');
    }

    const milestone = workspace.milestones.id(req.params.mId);
    if (!milestone) {
      res.status(404);
      throw new Error('Milestone not found');
    }

    milestone.status = 'approved';

    const allApproved = workspace.milestones.every(m => m.status === 'approved');
    if (allApproved) {
      workspace.status = 'completed';
    }

    await workspace.save();

    const projId = workspace.projectId?._id || workspace.projectId;
    const projTitle = workspace.projectId?.title || 'Campaign';

    // Notification for Creator
    await Notification.create({
      recipientId: workspace.creatorId,
      senderId: req.user._id,
      projectId: projId,
      type: 'milestone_approved',
      title: 'Milestone Approved! 🎉',
      body: `The brand approved your deliverable submission for: "${milestone.title}" in campaign "${projTitle}"`,
      link: '/dashboard?tab=active-collaborations'
    });

    // Notification for Brand (Company)
    await Notification.create({
      recipientId: req.user._id,
      senderId: workspace.creatorId,
      projectId: projId,
      type: 'milestone_approved',
      title: 'Milestone Approved',
      body: `You approved deliverable submission for milestone: "${milestone.title}" in campaign "${projTitle}"`,
      link: '/dashboard?tab=collaborations'
    });

    // Trigger mock email alert to Creator
    try {
      const creatorUser = await User.findById(workspace.creatorId);
      if (creatorUser) {
        sendMockEmail({
          to: creatorUser.email,
          subject: 'Milestone Approved! 🎉',
          body: `Hi ${creatorUser.name},\n\nThe brand approved your submission proof for milestone: "${milestone.title}".\n\nCheck workspace balances and contract payouts on CreatorSync.\n\nBest,\nCreatorSync Team`
        });
      }
    } catch (mailErr) {
      console.warn('Simulated milestone approval mail dispatch failed:', mailErr.message);
    }

    res.json(workspace);
  } catch (error) {
    next(error);
  }
};

// @desc    Request changes for a milestone (Brand only)
// @route   PATCH /api/workspaces/:id/milestones/:mId/request-changes
// @access  Private/Brand
export const requestMilestoneChanges = async (req, res, next) => {
  try {
    const { feedbackNotes } = req.body;
    const workspace = await Workspace.findById(req.params.id).populate('projectId', 'title');
    if (!workspace) {
      res.status(404);
      throw new Error('Workspace not found');
    }

    if (workspace.brandId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the hiring brand can request changes for deliverables');
    }

    const milestone = workspace.milestones.id(req.params.mId);
    if (!milestone) {
      res.status(404);
      throw new Error('Milestone not found');
    }

    milestone.status = 'changes_requested';
    milestone.feedbackNotes = feedbackNotes || 'Please revise the deliverable per brand guidelines.';

    await workspace.save();

    const projId = workspace.projectId?._id || workspace.projectId;

    // Notification for Creator
    await Notification.create({
      recipientId: workspace.creatorId,
      senderId: req.user._id,
      projectId: projId,
      type: 'milestone_changes_requested',
      title: 'Changes Requested on Deliverable',
      body: `The brand requested revision on milestone: "${milestone.title}". Notes: "${milestone.feedbackNotes}"`,
      link: '/dashboard?tab=active-collaborations'
    });

    // Notification for Brand (Company)
    await Notification.create({
      recipientId: req.user._id,
      senderId: workspace.creatorId,
      projectId: projId,
      type: 'milestone_changes_requested',
      title: 'Revision Request Sent',
      body: `You requested revisions on milestone: "${milestone.title}"`,
      link: '/dashboard?tab=collaborations'
    });

    // Trigger mock email alert to Creator
    try {
      const creatorUser = await User.findById(workspace.creatorId);
      if (creatorUser) {
        sendMockEmail({
          to: creatorUser.email,
          subject: 'Action Needed: Revision Requested for Deliverable',
          body: `Hi ${creatorUser.name},\n\nThe brand requested changes for milestone: "${milestone.title}".\nFeedback: ${milestone.feedbackNotes}\n\nPlease update your submission on CreatorSync.\n\nBest,\nCreatorSync Team`
        });
      }
    } catch (mailErr) {
      console.warn('Simulated revision request email failed:', mailErr.message);
    }

    res.json(workspace);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark collaboration workspace as completed (Brand only)
// @route   PATCH /api/workspaces/:id/complete
// @access  Private/Brand
export const completeWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('projectId', 'title')
      .populate('creatorId', 'name');
    if (!workspace) {
      res.status(404);
      throw new Error('Workspace not found');
    }

    if (workspace.brandId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the hiring brand can mark collaboration completed');
    }

    workspace.status = 'completed';
    workspace.milestones.forEach(m => {
      if (m.status !== 'approved') m.status = 'approved';
    });

    await workspace.save();

    const projId = workspace.projectId?._id || workspace.projectId;
    const projTitle = workspace.projectId?.title || 'Campaign';

    // Notification for Creator
    await Notification.create({
      recipientId: workspace.creatorId._id || workspace.creatorId,
      senderId: req.user._id,
      projectId: projId,
      type: 'campaign_completed',
      title: 'Campaign Completed! 🎉',
      body: `The brand marked collaboration campaign "${projTitle}" as COMPLETED.`,
      link: '/dashboard?tab=completed-collaborations'
    });

    // Notification for Brand (Company)
    await Notification.create({
      recipientId: req.user._id,
      senderId: workspace.creatorId._id || workspace.creatorId,
      projectId: projId,
      type: 'campaign_completed',
      title: 'Campaign Completed 🎉',
      body: `Campaign "${projTitle}" with creator "${workspace.creatorId?.name}" is now marked COMPLETED.`,
      link: '/dashboard?tab=collaborations'
    });

    res.json(workspace);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark payment as paid/released (Brand only)
// @route   PATCH /api/workspaces/:id/pay
// @access  Private/Brand
export const markPaymentPaid = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('projectId', 'title budget')
      .populate('creatorId', 'name');
    if (!workspace) {
      res.status(404);
      throw new Error('Workspace not found');
    }

    if (workspace.brandId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the hiring brand can release/mark payment paid');
    }

    workspace.paymentStatus = 'paid';
    await workspace.save();

    const projId = workspace.projectId?._id || workspace.projectId;
    const projTitle = workspace.projectId?.title || 'Campaign';

    // Sync with Payment collection
    let payment = await Payment.findOne({
      projectId: projId,
      creatorId: workspace.creatorId._id || workspace.creatorId,
      brandId: workspace.brandId
    });

    const paidAmt = workspace.agreedRate || workspace.projectId?.budget?.max || 1000;

    if (payment) {
      payment.status = 'released';
      payment.transactionReference = `PAY-COMP-${Date.now()}`;
      await payment.save();
    } else {
      await Payment.create({
        projectId: projId,
        creatorId: workspace.creatorId._id || workspace.creatorId,
        brandId: workspace.brandId,
        amount: paidAmt,
        status: 'released',
        transactionReference: `PAY-COMP-${Date.now()}`
      });
    }

    // Notification for Creator
    await Notification.create({
      recipientId: workspace.creatorId._id || workspace.creatorId,
      senderId: req.user._id,
      projectId: projId,
      type: 'payment_completed',
      title: 'Payment Released! 💰',
      body: `Brand marked payment of $${paidAmt.toLocaleString()} as PAID for campaign "${projTitle}".`,
      link: '/dashboard?tab=completed-collaborations'
    });

    // Notification for Brand (Company)
    await Notification.create({
      recipientId: req.user._id,
      senderId: workspace.creatorId._id || workspace.creatorId,
      projectId: projId,
      type: 'payment_completed',
      title: 'Payment Completed 💰',
      body: `You marked payment of $${paidAmt.toLocaleString()} as PAID for campaign "${projTitle}".`,
      link: '/dashboard?tab=collaborations'
    });

    // Email Creator
    try {
      const creatorUser = await User.findById(workspace.creatorId);
      if (creatorUser) {
        sendMockEmail({
          to: creatorUser.email,
          subject: 'Payment Released! 💰',
          body: `Hi ${creatorUser.name},\n\nThe brand marked payment of $${paidAmt.toLocaleString()} as PAID for campaign: "${projTitle}".\n\nCheck your earnings on CreatorSync.\n\nBest,\nCreatorSync Team`
        });
      }
    } catch (mailErr) {
      console.warn('Simulated payment email failed:', mailErr.message);
    }

    res.json(workspace);
  } catch (error) {
    next(error);
  }
};

// @desc    Post a message to workspace chat
// @route   POST /api/workspaces/:id/messages
// @access  Private
export const addMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400);
      throw new Error('Message text cannot be empty');
    }

    const workspace = await Workspace.findById(req.params.id).populate('projectId', 'title');
    if (!workspace) {
      res.status(404);
      throw new Error('Workspace not found');
    }

    const isMember = 
      workspace.creatorId.toString() === req.user._id.toString() ||
      workspace.brandId.toString() === req.user._id.toString();

    if (!isMember) {
      res.status(403);
      throw new Error('Not authorized to message in this workspace');
    }

    workspace.messages.push({
      senderId: req.user._id,
      text
    });

    await workspace.save();

    const recipientId = workspace.creatorId.toString() === req.user._id.toString()
      ? workspace.brandId
      : workspace.creatorId;

    await Notification.create({
      recipientId,
      senderId: req.user._id,
      projectId: workspace.projectId?._id || workspace.projectId,
      type: 'chat_message',
      title: `New Message from ${req.user.name}`,
      body: `"${text.length > 40 ? text.substring(0, 40) + '...' : text}"`,
      link: `/dashboard?tab=messages`
    });
    
    res.status(201).json(workspace.messages);
  } catch (error) {
    next(error);
  }
};
