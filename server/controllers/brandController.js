import Brand from '../models/Brand.js';
import Project from '../models/Project.js';
import Review from '../models/Review.js';
import Workspace from '../models/Workspace.js';

// @desc    Get public brand profile details by User ID
// @route   GET /api/brands/:id
// @access  Public
export const getBrandProfile = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ userId: req.params.id }).populate('userId', 'name email profileImage');
    if (!brand) {
      res.status(404);
      throw new Error('Brand profile not found');
    }

    // Fetch campaigns/projects published by this brand
    const projects = await Project.find({ brandId: req.params.id }).sort({ createdAt: -1 });

    // Fetch mutual reviews left by creators for this brand
    const reviews = await Review.find({ revieweeId: req.params.id }).populate('reviewerId', 'name email profileImage');
    
    // Average ratings calculations
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length 
      : 0;

    // Fetch workspaces to compute hiring count
    const totalHired = await Workspace.countDocuments({ brandId: req.params.id });

    res.json({
      brand,
      projects,
      reviews,
      avgRating,
      totalReviews: reviews.length,
      totalHired
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update brand profile details
// @route   PUT /api/brands/me
// @access  Private/Brand
export const updateMyBrandProfile = async (req, res, next) => {
  try {
    let brand = await Brand.findOne({ userId: req.user._id });
    if (!brand) {
      brand = new Brand({ userId: req.user._id, companyName: req.user.name });
    }

    const {
      companyName,
      industry,
      website,
      description,
      socialLinks,
      images,
      companyLogo,
      coverBanner,
      phone,
      country,
      city,
      address,
      productsServices,
      mission,
      linkedinUrl,
      instagramUrl,
      facebookUrl,
      youtubeUrl,
      twitterUrl
    } = req.body;

    brand.companyName = companyName || brand.companyName;
    brand.industry = industry !== undefined ? industry : brand.industry;
    brand.website = website !== undefined ? website : brand.website;
    brand.description = description !== undefined ? description : brand.description;
    brand.socialLinks = socialLinks !== undefined ? socialLinks : brand.socialLinks;
    brand.images = images !== undefined ? images : brand.images;
    
    brand.companyLogo = companyLogo !== undefined ? companyLogo : brand.companyLogo;
    brand.coverBanner = coverBanner !== undefined ? coverBanner : brand.coverBanner;
    brand.phone = phone !== undefined ? phone : brand.phone;
    brand.country = country !== undefined ? country : brand.country;
    brand.city = city !== undefined ? city : brand.city;
    brand.address = address !== undefined ? address : brand.address;
    brand.productsServices = productsServices !== undefined ? productsServices : brand.productsServices;
    brand.mission = mission !== undefined ? mission : brand.mission;
    brand.linkedinUrl = linkedinUrl !== undefined ? linkedinUrl : brand.linkedinUrl;
    brand.instagramUrl = instagramUrl !== undefined ? instagramUrl : brand.instagramUrl;
    brand.facebookUrl = facebookUrl !== undefined ? facebookUrl : brand.facebookUrl;
    brand.youtubeUrl = youtubeUrl !== undefined ? youtubeUrl : brand.youtubeUrl;
    brand.twitterUrl = twitterUrl !== undefined ? twitterUrl : brand.twitterUrl;

    await brand.save();
    res.json(brand);
  } catch (error) {
    next(error);
  }
};
