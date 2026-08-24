import Application from '../models/Application.js';
import Project from '../models/Project.js';
import Workspace from '../models/Workspace.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { sendMockEmail } from '../utils/sendMockEmail.js';

// @desc    Apply to a project
// @route   POST /api/applications
// @access  Private/Creator
export const applyToCampaign = async (req, res, next) => {
  try {
    const projectId = req.body.projectId || req.body.campaignId;
    const { pitch, proposedRate } = req.body;

    if (!projectId || !pitch || !proposedRate) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }

    const campaign = await Project.findById(projectId);
    if (!campaign) {
      res.status(404);
      throw new Error('Project brief not found');
    }

    // Check for duplicate application
    const alreadyApplied = await Application.findOne({ projectId, creatorId: req.user._id });
    if (alreadyApplied) {
      res.status(400);
      throw new Error('You have already applied to this project');
    }

    const application = await Application.create({
      projectId,
      creatorId: req.user._id,
      pitch,
      proposedRate
    });

    // Notification for Brand (Company)
    await Notification.create({
      recipientId: campaign.brandId,
      senderId: req.user._id,
      projectId: campaign._id,
      type: 'new_application',
      title: 'New Application Received 📥',
      body: `Creator "${req.user.name}" submitted an application for campaign "${campaign.title}".`,
      link: '/dashboard?tab=applications'
    });

    // Notification for Creator
    await Notification.create({
      recipientId: req.user._id,
      senderId: campaign.brandId,
      projectId: campaign._id,
      type: 'application_submitted',
      title: 'Application Submitted',
      body: `Your application for campaign "${campaign.title}" was submitted successfully.`,
      link: '/dashboard?tab=applications'
    });

    // Trigger mock email alert to Brand owner
    try {
      const brandUser = await User.findById(campaign.brandId);
      if (brandUser) {
        sendMockEmail({
          to: brandUser.email,
          subject: 'New Sponsorship Pitch Received',
          body: `Hi ${brandUser.name},\n\nCreator ${req.user.name} has pitched for your campaign project: "${campaign.title}".\n\nReview it on your CreatorSync dashboard.\n\nBest,\nCreatorSync Team`
        });
      }
    } catch (mailErr) {
      console.warn('Simulated application pitch mail dispatch failed:', mailErr.message);
    }

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications submitted by current creator
// @route   GET /api/applications/me
// @access  Private/Creator
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ creatorId: req.user._id })
      .populate({
        path: 'projectId',
        select: 'title description budget status deadline location creatorsRequired requirements deliverables brandId isRemote',
        populate: {
          path: 'brandId',
          select: 'name profileImage'
        }
      })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private/Creator
export const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    // Verify creator owns this application
    if (application.creatorId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to withdraw this application');
    }

    // Withdraw is only allowed before selection (i.e. status must be 'pending' or 'shortlisted')
    if (application.status === 'approved' || application.status === 'rejected') {
      res.status(400);
      throw new Error('Cannot withdraw application after brand selection decisions have been made');
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application successfully withdrawn' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a project
// @route   GET /api/campaigns/:id/applications
// @access  Private/Brand
export const getCampaignApplications = async (req, res, next) => {
  try {
    const campaign = await Project.findById(req.params.id);
    if (!campaign) {
      res.status(404);
      throw new Error('Project brief not found');
    }

    if (campaign.brandId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view applicants for this project');
    }

    const applications = await Application.find({ projectId: req.params.id })
      .populate({
        path: 'creatorId',
        select: 'name email profileImage',
        populate: {
          path: 'creatorProfile'
        }
      })
      .sort({ createdAt: -1 });

    const enhancedApplications = await Promise.all(
      applications.map(async (app) => {
        const appObj = app.toObject();
        const creatorId = app.creatorId?._id;
        
        if (creatorId) {
          const reviews = await Review.find({ revieweeId: creatorId });
          const avgRating = reviews.length > 0
            ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
            : 5.0; // Default to 5.0 rating for new creators if no reviews exist

          const prevCollabsCount = await Workspace.countDocuments({
            creatorId,
            status: 'completed'
          });

          appObj.creatorRating = avgRating;
          appObj.previousCollaborationsCount = prevCollabsCount;
        } else {
          appObj.creatorRating = 5.0;
          appObj.previousCollaborationsCount = 0;
        }

        return appObj;
      })
    );

    res.json(enhancedApplications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (approve/reject/shortlist)
// @route   PUT /api/applications/:id
// @access  Private/Brand
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'shortlisted', 'approved', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid application status');
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    const campaign = await Project.findById(application.projectId);
    if (!campaign) {
      res.status(404);
      throw new Error('Associated project brief not found');
    }

    // Verify requesting brand owns the project
    if (campaign.brandId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update applicant status');
    }

    application.status = status;
    await application.save();

    // Trigger Notification for the Creator
    await Notification.create({
      recipientId: application.creatorId,
      senderId: req.user._id,
      projectId: campaign._id,
      type: 'application_status',
      title: 'Campaign Application Update',
      body: `Your sponsorship application for "${campaign.title}" has been ${status}.`,
      link: '/dashboard?tab=applications'
    });

    // Trigger Notification for the Brand (Company)
    await Notification.create({
      recipientId: req.user._id,
      senderId: application.creatorId,
      projectId: campaign._id,
      type: 'application_status',
      title: 'Applicant Status Updated',
      body: `You updated creator application status for "${campaign.title}" to ${status.toUpperCase()}.`,
      link: '/dashboard?tab=applications'
    });

    // Trigger mock email alert to Creator
    try {
      const creatorUser = await User.findById(application.creatorId);
      if (creatorUser) {
        sendMockEmail({
          to: creatorUser.email,
          subject: 'Campaign Application Update',
          body: `Hi ${creatorUser.name},\n\nYour application for the campaign brief: "${campaign.title}" has been ${status} by the brand.\n\nReview it on your CreatorSync dashboard.\n\nBest,\nCreatorSync Team`
        });
      }
    } catch (mailErr) {
      console.warn('Simulated application status update mail dispatch failed:', mailErr.message);
    }

    // If approved, automatically create Workspace and setup milestones from project deliverables
    if (status === 'approved') {
      const existingWorkspace = await Workspace.findOne({
        projectId: campaign._id,
        creatorId: application.creatorId
      });

      if (existingWorkspace) {
        if (!existingWorkspace.milestones || existingWorkspace.milestones.length === 0) {
          existingWorkspace.milestones = campaign.deliverables.map((deliv, index) => ({
            title: `Deliverable #${index + 1}: ${deliv}`,
            description: `Submit draft proof and publish live verification link for: ${deliv}`,
            status: 'pending'
          }));
          await existingWorkspace.save();
        }
      } else {
        const milestones = campaign.deliverables.map((deliv, index) => ({
          title: `Deliverable #${index + 1}: ${deliv}`,
          description: `Submit draft proof and publish live verification link for: ${deliv}`,
          status: 'pending'
        }));

        await Workspace.create({
          projectId: campaign._id,
          brandId: campaign.brandId,
          creatorId: application.creatorId,
          milestones,
          status: 'active'
        });
      }
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for brand campaigns
// @route   GET /api/applications/brand
// @access  Private/Brand
export const getBrandApplications = async (req, res, next) => {
  try {
    const projects = await Project.find({ brandId: req.user._id });
    const projectIds = projects.map(p => p._id);

    const applications = await Application.find({ projectId: { $in: projectIds } })
      .populate('projectId', 'title budget status deadline location deliverables')
      .populate({
        path: 'creatorId',
        select: 'name email profileImage',
        populate: {
          path: 'creatorProfile'
        }
      })
      .sort({ createdAt: -1 });

    const enhancedApplications = await Promise.all(
      applications.map(async (app) => {
        const appObj = app.toObject();
        const creatorId = app.creatorId?._id;
        
        if (creatorId) {
          const reviews = await Review.find({ revieweeId: creatorId });
          const avgRating = reviews.length > 0
            ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
            : 5.0; // Default to 5.0 rating for new creators if no reviews exist

          const prevCollabsCount = await Workspace.countDocuments({
            creatorId,
            status: 'completed'
          });

          appObj.creatorRating = avgRating;
          appObj.previousCollaborationsCount = prevCollabsCount;
        } else {
          appObj.creatorRating = 5.0;
          appObj.previousCollaborationsCount = 0;
        }

        return appObj;
      })
    );

    res.json(enhancedApplications);
  } catch (error) {
    next(error);
  }
};
