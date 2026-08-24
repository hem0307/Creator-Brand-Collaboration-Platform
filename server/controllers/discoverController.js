import Creator from '../models/Creator.js';
import Brand from '../models/Brand.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Workspace from '../models/Workspace.js';

// @desc    Discover Creators with enhanced search, filters, pagination
// @route   GET /api/discover/creators
// @access  Public
export const discoverCreators = async (req, res, next) => {
  try {
    const {
      search, category, skill, minFollowers, platform,
      country, language, availability, minEngagement,
      sortBy = 'newest', page = 1, limit = 9
    } = req.query;

    let creatorQuery = {};

    // Filter by niche/category (partial match in array)
    if (category) {
      creatorQuery.niche = { $in: [new RegExp(category, 'i')] };
    }

    // Filter by skills
    if (skill) {
      creatorQuery.skills = { $in: skill.split(',').map(s => new RegExp(s.trim(), 'i')) };
    }

    // Filter by followers (total followersCount field)
    if (minFollowers) {
      creatorQuery.followersCount = { $gte: Number(minFollowers) };
    }

    // Filter by primary platform
    if (platform) {
      creatorQuery.primaryPlatform = { $regex: platform, $options: 'i' };
    }

    // Filter by languages
    if (language) {
      creatorQuery.languages = { $in: [new RegExp(language, 'i')] };
    }

    // Filter by availability
    if (availability) {
      creatorQuery.availability = { $regex: availability, $options: 'i' };
    }

    // Filter by minimum engagement rate
    if (minEngagement) {
      creatorQuery.avgEngagement = { $gte: Number(minEngagement) };
    }

    const skipIndex = (page - 1) * limit;

    // Build user-level filter (name/email search + country)
    let userQuery = { role: 'creator' };
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (country) {
      userQuery.country = { $regex: country, $options: 'i' };
    }

    // Fetch matching user IDs
    const users = await User.find(userQuery).select('_id name email profileImage country city');
    const userIds = users.map(u => u._id);
    creatorQuery.userId = { $in: userIds };

    // Determine sort order
    let sortOption = { createdAt: -1 }; // newest
    if (sortBy === 'followers') sortOption = { followersCount: -1 };
    if (sortBy === 'engagement') sortOption = { avgEngagement: -1 };
    if (sortBy === 'rating') sortOption = { avgEngagement: -1 }; // proxy; real rating comes from Review

    const total = await Creator.countDocuments(creatorQuery);
    const creators = await Creator.find(creatorQuery)
      .populate('userId', 'name email profileImage country city')
      .sort(sortOption)
      .skip(skipIndex)
      .limit(Number(limit));

    // Enrich each creator with avgRating and completedCampaigns
    const enriched = await Promise.all(creators.map(async (c) => {
      const creatorObj = c.toObject();
      const uId = c.userId?._id;

      const reviews = await Review.find({ revieweeId: uId });
      creatorObj.avgRating = reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 0;

      creatorObj.completedCampaigns = await Workspace.countDocuments({
        creatorId: uId, status: 'completed'
      });

      return creatorObj;
    }));

    res.json({
      creators: enriched,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Discover Brands with search, filters, pagination
// @route   GET /api/discover/brands
// @access  Public
export const discoverBrands = async (req, res, next) => {
  try {
    const { search, industry, page = 1, limit = 9 } = req.query;
    let brandQuery = {};

    if (industry) {
      brandQuery.industry = { $regex: industry, $options: 'i' };
    }

    let userQuery = { role: 'brand' };
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(userQuery).select('_id');
    const userIds = users.map(u => u._id);
    brandQuery.userId = { $in: userIds };

    const skipIndex = (page - 1) * limit;

    const total = await Brand.countDocuments(brandQuery);
    const brands = await Brand.find(brandQuery)
      .populate('userId', 'name email profileImage')
      .skip(skipIndex)
      .limit(Number(limit));

    res.json({
      brands,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};
