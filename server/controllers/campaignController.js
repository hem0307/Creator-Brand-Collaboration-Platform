import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendMockEmail } from '../utils/sendMockEmail.js';

// @desc    Create a new project
// @route   POST /api/campaigns
// @access  Private/Brand
export const createCampaign = async (req, res, next) => {
  try {
    const {
      title,
      description,
      deliverables,
      niche,
      targetPlatforms,
      budget,
      creatorsRequired,
      deadline,
      location,
      requirements,
      isRemote,
      status,
      productName,
      paymentPerCreator,
      minFollowers,
      minEngagementRate,
      preferredCreatorCategory,
      language,
      appDeadline,
      startDate,
      endDate,
      submissionDeadline,
      productImages,
      brandGuidelines
    } = req.body;

    if (!title || !description || !deliverables || !niche || !targetPlatforms || !budget) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const campaign = await Project.create({
      brandId: req.user._id,
      title,
      description,
      deliverables,
      niche,
      targetPlatforms,
      budget,
      creatorsRequired,
      deadline,
      location,
      requirements,
      isRemote,
      status: status || 'active',
      productName,
      paymentPerCreator,
      minFollowers,
      minEngagementRate,
      preferredCreatorCategory,
      language,
      appDeadline,
      startDate,
      endDate,
      submissionDeadline,
      productImages,
      brandGuidelines
    });

    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active campaigns (projects)
// @route   GET /api/campaigns
// @access  Private
export const getCampaigns = async (req, res, next) => {
  try {
    const { search, niche, platform, minBudget, country, remote, sortBy, page, limit = 9 } = req.query;
    let query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (niche) {
      query.niche = { $in: niche.split(',') };
    }

    if (platform) {
      query.targetPlatforms = { $in: platform.split(',') };
    }

    if (minBudget) {
      query['budget.max'] = { $gte: Number(minBudget) };
    }

    if (country) {
      query.location = { $regex: country, $options: 'i' };
    }

    if (remote !== undefined && remote !== '') {
      query.isRemote = remote === 'true';
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'highest-budget') {
      sortOption = { 'budget.max': -1 };
    } else if (sortBy === 'deadline') {
      sortOption = { deadline: 1 };
    }

    let total = await Project.countDocuments(query);

    if (page) {
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 9;
      const skipIndex = (pageNum - 1) * limitNum;

      const campaigns = await Project.find(query)
        .populate('brandId', 'name email profileImage')
        .sort(sortOption)
        .skip(skipIndex)
        .limit(limitNum);

      return res.json({
        campaigns,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        total
      });
    }

    const campaigns = await Project.find(query)
      .populate('brandId', 'name email profileImage')
      .sort(sortOption);

    res.json(campaigns);
  } catch (error) {
    next(error);
  }
};

// @desc    Get campaign (project) by ID
// @route   GET /api/campaigns/:id
// @access  Private
export const getCampaignById = async (req, res, next) => {
  try {
    const campaign = await Project.findById(req.params.id).populate('brandId', 'name email profileImage');
    if (!campaign) {
      res.status(404);
      throw new Error('Project brief not found');
    }
    res.json(campaign);
  } catch (error) {
    next(error);
  }
};

// @desc    Get campaigns (projects) published by brand
// @route   GET /api/campaigns/me
// @access  Private/Brand
export const getMyCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Project.find({ brandId: req.user._id }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/campaigns/:id
// @access  Private/Brand
export const updateCampaign = async (req, res, next) => {
  try {
    const campaign = await Project.findById(req.params.id);

    if (!campaign) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (campaign.brandId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('User not authorized to update this project');
    }

    const updatedCampaign = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedCampaign);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/campaigns/:id
// @access  Private/Brand
export const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Project.findById(req.params.id);

    if (!campaign) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (campaign.brandId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('User not authorized to delete this project');
    }

    await campaign.deleteOne();
    res.json({ message: 'Project brief removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite creator to campaign
// @route   POST /api/campaigns/:id/invite
// @access  Private/Brand
export const inviteCreatorToCampaign = async (req, res, next) => {
  try {
    const { creatorId } = req.body;
    if (!creatorId) {
      res.status(400);
      throw new Error('Creator ID is required');
    }

    const campaign = await Project.findById(req.params.id);
    if (!campaign) {
      res.status(404);
      throw new Error('Campaign not found');
    }

    if (campaign.brandId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('User not authorized to send invitations for this campaign');
    }

    const creatorUser = await User.findById(creatorId);
    if (!creatorUser) {
      res.status(404);
      throw new Error('Creator user not found');
    }

    // Create Notification alert for the Creator
    await Notification.create({
      recipientId: creatorId,
      senderId: req.user._id,
      projectId: campaign._id,
      type: 'campaign_invitation',
      title: 'Campaign Invitation ✉️',
      body: `${req.user.name} has invited you to apply for their sponsorship campaign: "${campaign.title}"`,
      link: `/campaigns/${campaign._id}`
    });

    // Create confirmation Notification for the Brand (Company)
    await Notification.create({
      recipientId: req.user._id,
      senderId: creatorId,
      projectId: campaign._id,
      type: 'system_alert',
      title: 'Invitation Sent',
      body: `You sent a campaign invitation to creator "${creatorUser.name}" for "${campaign.title}".`,
      link: `/campaigns/${campaign._id}`
    });

    // Send mock email alert to Creator
    try {
      sendMockEmail({
        to: creatorUser.email,
        subject: 'Campaign Invitation',
        body: `Hi ${creatorUser.name},\n\nBrand ${req.user.name} has invited you to apply for their sponsorship campaign: "${campaign.title}".\n\nCheck out the details and submit your pitch here: http://localhost:5173/campaigns/${campaign._id}\n\nBest,\nCreatorSync Team`
      });
    } catch (mailErr) {
      console.warn('Simulated campaign invitation email notification dispatch failed:', mailErr.message);
    }

    res.json({ success: true, message: 'Invitation sent successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to campaign invitation (Creator accepts or rejects)
// @route   POST /api/campaigns/:id/invitation-response
// @access  Private/Creator
export const respondToInvitation = async (req, res, next) => {
  try {
    const { action } = req.body; // 'accepted' or 'rejected'
    const campaign = await Project.findById(req.params.id);
    if (!campaign) {
      res.status(404);
      throw new Error('Campaign not found');
    }

    const isAccepted = action === 'accepted';
    const notifType = isAccepted ? 'invitation_accepted' : 'invitation_rejected';

    // Notification for Brand (Company)
    await Notification.create({
      recipientId: campaign.brandId,
      senderId: req.user._id,
      projectId: campaign._id,
      type: notifType,
      title: isAccepted ? 'Creator Accepted Invitation! 🎉' : 'Invitation Declined ❌',
      body: isAccepted 
        ? `Creator "${req.user.name}" accepted your invitation for campaign "${campaign.title}".`
        : `Creator "${req.user.name}" declined your invitation for campaign "${campaign.title}".`,
      link: isAccepted ? '/dashboard?tab=collaborations' : '/dashboard?tab=campaigns'
    });

    // Notification for Creator
    await Notification.create({
      recipientId: req.user._id,
      senderId: campaign.brandId,
      projectId: campaign._id,
      type: notifType,
      title: isAccepted ? 'Invitation Accepted' : 'Invitation Declined',
      body: isAccepted 
        ? `You accepted the invitation for campaign "${campaign.title}".`
        : `You declined the invitation for campaign "${campaign.title}".`,
      link: isAccepted ? '/dashboard?tab=active-collaborations' : '/discover'
    });

    res.json({ success: true, message: `Invitation ${action}` });
  } catch (error) {
    next(error);
  }
};
