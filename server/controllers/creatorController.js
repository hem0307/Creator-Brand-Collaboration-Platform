import Creator from '../models/Creator.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import Application from '../models/Application.js';
import Bookmark from '../models/Bookmark.js';

// @desc    Get public creator profile portfolio by User ID + performance analytics
// @route   GET /api/creators/:id
// @access  Public
export const getCreatorProfile = async (req, res, next) => {
  try {
    const creatorUserId = req.params.id;

    const creator = await Creator.findOne({ userId: creatorUserId })
      .populate('userId', 'name email profileImage username phone country city createdAt');
    if (!creator) {
      res.status(404);
      throw new Error('Creator profile not found');
    }

    // Reviews & Ratings
    const reviews = await Review.find({ revieweeId: creatorUserId })
      .populate('reviewerId', 'name email profileImage')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1))
      : 0;

    // Workspace / Collaboration Analytics
    const allWorkspaces = await Workspace.find({ creatorId: creatorUserId })
      .populate('projectId', 'title budget deadline');

    const completedWorkspaces = allWorkspaces.filter(w => w.status === 'completed');
    const activeWorkspaces   = allWorkspaces.filter(w => w.status === 'active');

    // On-Time Delivery: milestones approved vs total milestones across completed workspaces
    let totalMilestones = 0;
    let approvedMilestones = 0;
    completedWorkspaces.forEach(w => {
      totalMilestones += w.milestones.length;
      approvedMilestones += w.milestones.filter(m => m.status === 'approved').length;
    });
    const onTimeDeliveryRate = totalMilestones > 0
      ? Math.round((approvedMilestones / totalMilestones) * 100)
      : 100; // default 100% if no milestones yet

    // Repeat Collaborations: brands that have more than 1 workspace with this creator
    const brandCounts = {};
    allWorkspaces.forEach(w => {
      const bId = w.brandId?.toString();
      if (bId) brandCounts[bId] = (brandCounts[bId] || 0) + 1;
    });
    const repeatCollabCount = Object.values(brandCounts).filter(c => c > 1).length;

    // Application Acceptance Rate
    const totalApplications = await Application.countDocuments({ creatorId: creatorUserId });
    const acceptedApplications = await Application.countDocuments({ creatorId: creatorUserId, status: 'approved' });
    const acceptanceRate = totalApplications > 0
      ? Math.round((acceptedApplications / totalApplications) * 100)
      : 0;

    // Recent Activity: last 5 workspaces
    const recentActivity = allWorkspaces
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map(w => ({
        campaignTitle: w.projectId?.title || 'Campaign',
        status: w.status,
        date: w.updatedAt
      }));

    // Profile Completion Score
    const fields = [
      creator.bio, creator.category, creator.primaryPlatform,
      creator.followersCount > 0, creator.avgEngagement > 0,
      creator.niche?.length > 0, creator.skills?.length > 0,
      creator.socialChannels?.length > 0, creator.portfolioUrl,
      creator.userId?.profileImage
    ];
    const filledFields = fields.filter(Boolean).length;
    const profileCompletion = Math.round((filledFields / fields.length) * 100);

    // Bookmark status for authenticated viewer (brand)
    let isSaved = false;
    if (req.user?._id) {
      const bookmark = await Bookmark.findOne({
        userId: req.user._id,
        itemType: 'creator',
        itemId: creatorUserId
      });
      isSaved = !!bookmark;
    }

    res.json({
      creator,
      reviews,
      avgRating,
      totalReviews: reviews.length,
      // Performance Stats
      performanceStats: {
        campaignsCompleted: completedWorkspaces.length,
        activeCollaborations: activeWorkspaces.length,
        totalApplications,
        acceptedApplications,
        acceptanceRate,
        onTimeDeliveryRate,
        repeatCollabCount,
        avgRating,
        totalReviews: reviews.length,
        profileCompletion
      },
      recentActivity,
      isSaved
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark (save/unsave) a creator profile
// @route   POST /api/creators/:id/bookmark
// @access  Private (Brand)
export const toggleCreatorBookmark = async (req, res, next) => {
  try {
    const creatorUserId = req.params.id;
    const existing = await Bookmark.findOne({
      userId: req.user._id,
      itemType: 'creator',
      itemId: creatorUserId
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ isSaved: false, message: 'Creator removed from saved list.' });
    } else {
      await Bookmark.create({
        userId: req.user._id,
        itemType: 'creator',
        itemId: creatorUserId
      });
      return res.json({ isSaved: true, message: 'Creator saved successfully.' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update creator portfolio sections
// @route   PUT /api/creators/me
// @access  Private/Creator
export const updateMyPortfolio = async (req, res, next) => {
  try {
    let creator = await Creator.findOne({ userId: req.user._id });

    if (!creator) {
      // Lazy initialize profile if not existing
      creator = new Creator({ userId: req.user._id });
    }

    const {
      niche,
      skills,
      bio,
      portfolioUrl,
      portfolioDescription,
      socialChannels,
      experience,
      achievements,
      certificates,
      videos,
      images,

      // User credentials fields
      name,
      profileImage,
      username,
      phone,
      country,
      city,

      // Creator professional fields
      coverBanner,
      category,
      primaryPlatform,
      experienceYears,
      languages,
      availability,

      // Creator social links
      instagramUrl,
      youtubeUrl,
      linkedinUrl,
      xUrl,
      facebookUrl,
      websiteUrl,

      // Creator audience stats
      followersCount,
      avgEngagement,
      avgReach,
      monthlyViews,

      // Creator showcase
      showcase
    } = req.body;

    // 1. Update core credentials in User schema
    if (name !== undefined || profileImage !== undefined || username !== undefined || phone !== undefined || country !== undefined || city !== undefined) {
      const user = await User.findById(req.user._id);
      if (user) {
        if (name !== undefined) user.name = name;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (username !== undefined) user.username = username;
        if (phone !== undefined) user.phone = phone;
        if (country !== undefined) user.country = country;
        if (city !== undefined) user.city = city;
        await user.save();
      }
    }

    // 2. Update Creator schema fields
    creator.niche = niche !== undefined ? niche : creator.niche;
    creator.skills = skills !== undefined ? skills : creator.skills;
    creator.bio = bio !== undefined ? bio : creator.bio;
    creator.portfolioUrl = portfolioUrl !== undefined ? portfolioUrl : creator.portfolioUrl;
    creator.portfolioDescription = portfolioDescription !== undefined ? portfolioDescription : creator.portfolioDescription;
    creator.socialChannels = socialChannels !== undefined ? socialChannels : creator.socialChannels;
    creator.experience = experience !== undefined ? experience : creator.experience;
    creator.achievements = achievements !== undefined ? achievements : creator.achievements;
    creator.certificates = certificates !== undefined ? certificates : creator.certificates;
    creator.videos = videos !== undefined ? videos : creator.videos;
    creator.images = images !== undefined ? images : creator.images;

    creator.coverBanner = coverBanner !== undefined ? coverBanner : creator.coverBanner;
    creator.category = category !== undefined ? category : creator.category;
    creator.primaryPlatform = primaryPlatform !== undefined ? primaryPlatform : creator.primaryPlatform;
    creator.experienceYears = experienceYears !== undefined ? Number(experienceYears) : creator.experienceYears;
    creator.languages = languages !== undefined ? languages : creator.languages;
    creator.availability = availability !== undefined ? availability : creator.availability;

    creator.instagramUrl = instagramUrl !== undefined ? instagramUrl : creator.instagramUrl;
    creator.youtubeUrl = youtubeUrl !== undefined ? youtubeUrl : creator.youtubeUrl;
    creator.linkedinUrl = linkedinUrl !== undefined ? linkedinUrl : creator.linkedinUrl;
    creator.xUrl = xUrl !== undefined ? xUrl : creator.xUrl;
    creator.facebookUrl = facebookUrl !== undefined ? facebookUrl : creator.facebookUrl;
    creator.websiteUrl = websiteUrl !== undefined ? websiteUrl : creator.websiteUrl;

    creator.followersCount = followersCount !== undefined ? Number(followersCount) : creator.followersCount;
    creator.avgEngagement = avgEngagement !== undefined ? Number(avgEngagement) : creator.avgEngagement;
    creator.avgReach = avgReach !== undefined ? Number(avgReach) : creator.avgReach;
    creator.monthlyViews = monthlyViews !== undefined ? Number(monthlyViews) : creator.monthlyViews;
    
    creator.showcase = showcase !== undefined ? showcase : creator.showcase;

    await creator.save();
    res.json(creator);
  } catch (error) {
    next(error);
  }
};
