import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Creator from './models/Creator.js';
import Brand from './models/Brand.js';
import Project from './models/Project.js';
import Application from './models/Application.js';
import Workspace from './models/Workspace.js';
import Message from './models/Message.js';
import Notification from './models/Notification.js';
import Review from './models/Review.js';
import Payment from './models/Payment.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/creatorsync');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Creator.deleteMany();
    await Brand.deleteMany();
    await Project.deleteMany();
    await Application.deleteMany();
    await Workspace.deleteMany();
    await Message.deleteMany();
    await Notification.deleteMany();
    await Review.deleteMany();
    await Payment.deleteMany();

    console.log('Creating Famous Indian Brands & Creator Accounts...');

    // ────────────────────────────────────────────────────────
    // 1. BRAND / COMPANY ACCOUNTS
    // ────────────────────────────────────────────────────────

    // Brand 1: boAt Lifestyle
    const boatUser = await User.create({
      name: 'boAt Lifestyle',
      email: 'brand@creatorsync.com',
      password: 'Password123!',
      role: 'brand',
      profileImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
      username: 'boatlifestyle',
      phone: '+91 98765 43210',
      country: 'India',
      city: 'Mumbai',
      isVerified: true,
      themePreference: 'dark',
      language: 'en'
    });

    const boatBrand = await Brand.create({
      userId: boatUser._id,
      companyName: 'boAt Lifestyle',
      industry: 'Consumer Electronics & Audio Wearables',
      website: 'https://www.boat-lifestyle.com',
      description: "India's #1 earwear & wearable audio brand, founded by Aman Gupta & Sameer Mehta. Designing ultra-stylish headphones, ANC earbuds, and smartwatches for India's youth.",
      companyLogo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
      coverBanner: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200',
      phone: '+91 98765 43210',
      country: 'India',
      city: 'Mumbai',
      address: 'Imagine Marketing Ltd., Bandra West, Mumbai, Maharashtra 400050',
      productsServices: 'boAt Airdopes 500 ANC, Wave Call Smartwatch, Rockerz Wireless Headphones, Stone Bluetooth Speakers',
      mission: 'Plug into Nirvana with affordable, high-design audio accessories.',
      instagramUrl: 'https://instagram.com/boat.nirvana',
      youtubeUrl: 'https://youtube.com/c/boatlifestyle',
      twitterUrl: 'https://twitter.com/RockWithboAt',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
      ]
    });

    // Brand 2: Mamaearth
    const mamaearthUser = await User.create({
      name: 'Mamaearth India',
      email: 'mamaearth@creatorsync.com',
      password: 'Password123!',
      role: 'brand',
      profileImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200',
      username: 'mamaearth',
      phone: '+91 99887 76655',
      country: 'India',
      city: 'Gurugram',
      isVerified: true,
      themePreference: 'dark',
      language: 'en'
    });

    const mamaearthBrand = await Brand.create({
      userId: mamaearthUser._id,
      companyName: 'Mamaearth',
      industry: 'D2C Beauty & Personal Care',
      website: 'https://mamaearth.in',
      description: 'India’s fastest-growing toxin-free, natural beauty & skincare brand for conscious Indian consumers.',
      companyLogo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200',
      coverBanner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200',
      country: 'India',
      city: 'Gurugram',
      address: 'Honasa Consumer Ltd., Sector 44, Gurugram, Haryana 122003',
      productsServices: 'Vitamin C Face Serum, Onion Hair Oil, Ubtan Face Wash, Rice Water Gel',
      mission: 'Goodness Inside. Toxin-free skincare made with natural Indian ingredients.',
      instagramUrl: 'https://instagram.com/mamaearth.in',
      youtubeUrl: 'https://youtube.com/c/mamaearth'
    });

    // Brand 3: CRED
    const credUser = await User.create({
      name: 'CRED India',
      email: 'cred@creatorsync.com',
      password: 'Password123!',
      role: 'brand',
      profileImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200',
      username: 'cred',
      phone: '+91 91234 56789',
      country: 'India',
      city: 'Bengaluru',
      isVerified: true
    });

    const credBrand = await Brand.create({
      userId: credUser._id,
      companyName: 'CRED',
      industry: 'Fintech & Premium Rewards',
      website: 'https://cred.club',
      description: 'Exclusive rewards and credit card management app for India’s premium creditworthy individuals.',
      companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200',
      coverBanner: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200',
      country: 'India',
      city: 'Bengaluru',
      productsServices: 'CRED Pay UPI, CRED Coins, CRED Flash Credit Line, CRED Store Exclusives',
      mission: 'Making financial discipline rewarding for India’s top credit users.'
    });

    // Brand 4: Zomato India
    const zomatoUser = await User.create({
      name: 'Zomato India',
      email: 'zomato@creatorsync.com',
      password: 'Password123!',
      role: 'brand',
      profileImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
      username: 'zomato',
      phone: '+91 98989 89898',
      country: 'India',
      city: 'Gurugram',
      isVerified: true
    });

    const zomatoBrand = await Brand.create({
      userId: zomatoUser._id,
      companyName: 'Zomato',
      industry: 'Food Tech & Quick Commerce',
      website: 'https://zomato.com',
      description: 'India’s leading food ordering, dining discovery, and quick delivery platform.',
      companyLogo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
      country: 'India',
      city: 'Gurugram',
      productsServices: 'Zomato Gold, Zomato Legends, Quick Delivery, Dining Deals'
    });


    // ────────────────────────────────────────────────────────
    // 2. FAMOUS INDIAN CREATOR ACCOUNTS
    // ────────────────────────────────────────────────────────

    // Creator 1: Technical Guruji (Gaurav Chaudhary)
    const tgUser = await User.create({
      name: 'Gaurav Chaudhary (Technical Guruji)',
      email: 'creator@creatorsync.com',
      password: 'Password123!',
      role: 'creator',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      username: 'technicalguruji',
      phone: '+91 98111 22233',
      country: 'India',
      city: 'New Delhi',
      isVerified: true,
      themePreference: 'dark',
      language: 'hi'
    });

    const tgCreator = await Creator.create({
      userId: tgUser._id,
      category: 'Tech & Electronics',
      primaryPlatform: 'YouTube',
      experienceYears: 9,
      languages: ['Hindi', 'English'],
      availability: 'Available',
      followersCount: 23500000, // 23.5M
      avgEngagement: 6.2,
      avgReach: 4500000,
      monthlyViews: 45000000,
      bio: 'Namaste Dosto! Tech reviewer & gadget enthusiast. I review smartphones, smartwatches, 4K TVs, and audio gear in Hindi for 23.5 Million tech buyers across India.',
      portfolioUrl: 'https://youtube.com/c/TechnicalGuruji',
      portfolioDescription: 'India’s largest tech community delivering daily unboxing videos, flagship smartphone reviews, and honest gadget testing.',
      coverBanner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
      youtubeUrl: 'https://youtube.com/c/TechnicalGuruji',
      instagramUrl: 'https://instagram.com/technicalguruji',
      twitterUrl: 'https://twitter.com/TGuruji',
      niche: ['Tech & Electronics', 'Gadgets', 'Smartphones', 'Audio Gear'],
      skills: ['4K Tech Reviews', 'Unboxing Production', 'Hindi Storytelling', 'Product Benchmarking'],
      socialChannels: [
        { platform: 'youtube', handle: '@TechnicalGuruji', followers: 23500000 },
        { platform: 'instagram', handle: '@technicalguruji', followers: 4800000 },
        { platform: 'twitter', handle: '@TGuruji', followers: 3200000 }
      ],
      showcase: [
        {
          title: 'boAt Airdopes 500 ANC — Unboxing & Hindi Review',
          platform: 'YouTube',
          description: 'Comprehensive 12-minute review testing active noise cancellation on Delhi Metro.',
          url: 'https://youtube.com/watch?v=demo_tg_boat',
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
        }
      ],
      experience: [
        {
          companyName: 'boAt Lifestyle',
          projectTitle: 'Airdopes ANC Launch',
          date: new Date('2025-10-15'),
          description: 'Created 1 dedicated YouTube video generating 1.2M views.'
        }
      ],
      achievements: [
        { title: 'Best Tech Creator Award 2025 - TechCon India', date: new Date('2025-11-10') }
      ]
    });

    // Creator 2: Ajey Nagar (CarryMinati)
    const carryUser = await User.create({
      name: 'Ajey Nagar (CarryMinati)',
      email: 'carry@creatorsync.com',
      password: 'Password123!',
      role: 'creator',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      username: 'carryminati',
      phone: '+91 98222 33344',
      country: 'India',
      city: 'Faridabad',
      isVerified: true
    });

    const carryCreator = await Creator.create({
      userId: carryUser._id,
      category: 'Gaming & Comedy',
      primaryPlatform: 'YouTube',
      experienceYears: 10,
      languages: ['Hindi', 'English'],
      availability: 'Available',
      followersCount: 41200000, // 41.2M
      avgEngagement: 9.8,
      avgReach: 12000000,
      monthlyViews: 85000000,
      bio: 'India’s premier gaming & comedy creator. Known for high-octane gameplay live streams, viral roasts, and defining Indian youth pop culture.',
      portfolioUrl: 'https://youtube.com/c/CarryMinati',
      coverBanner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
      niche: ['Gaming', 'Comedy', 'Live Streaming', 'Pop Culture'],
      skills: ['Live Game Streaming', 'Roast Comedy', 'Brand Commercial Integration'],
      socialChannels: [
        { platform: 'youtube', handle: '@CarryMinati', followers: 41200000 },
        { platform: 'instagram', handle: '@carryminati', followers: 19500000 }
      ],
      showcase: [
        {
          title: 'CRED Pay Summer Carnival Commercial Roast',
          platform: 'YouTube',
          description: 'Viral 5-minute comedic sketch showcasing CRED Pay cashback rewards.',
          url: 'https://youtube.com/watch?v=demo_carry_cred',
          thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800'
        }
      ]
    });

    // Creator 3: Bhuvan Bam (BB Ki Vines)
    const bhuvanUser = await User.create({
      name: 'Bhuvan Bam (BB Ki Vines)',
      email: 'bhuvan@creatorsync.com',
      password: 'Password123!',
      role: 'creator',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      username: 'bhuvanbam',
      country: 'India',
      city: 'New Delhi',
      isVerified: true
    });

    const bhuvanCreator = await Creator.create({
      userId: bhuvanUser._id,
      category: 'Comedy & Entertainment',
      primaryPlatform: 'YouTube',
      experienceYears: 9,
      languages: ['Hindi'],
      availability: 'Available',
      followersCount: 26400000, // 26.4M
      avgEngagement: 8.5,
      monthlyViews: 38000000,
      bio: 'Actor, singer, songwriter & creator of BB Ki Vines. India’s pioneer original digital comedy artist.',
      niche: ['Comedy & Entertainment', 'Music & Acting', 'Brand Campaigns'],
      socialChannels: [
        { platform: 'youtube', handle: '@BBKiVines', followers: 26400000 },
        { platform: 'instagram', handle: '@bhuvan.bam22', followers: 18200000 }
      ]
    });

    // Creator 4: Shlok Srivastava (Tech Burner)
    const shlokUser = await User.create({
      name: 'Shlok Srivastava (Tech Burner)',
      email: 'shlok@creatorsync.com',
      password: 'Password123!',
      role: 'creator',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
      username: 'techburner',
      country: 'India',
      city: 'New Delhi',
      isVerified: true
    });

    const shlokCreator = await Creator.create({
      userId: shlokUser._id,
      category: 'Tech & Innovation',
      primaryPlatform: 'YouTube',
      followersCount: 11400000, // 11.4M
      avgEngagement: 7.4,
      monthlyViews: 28000000,
      bio: 'Making technology super fun, engaging, and accessible! Wild tech experiments, gadget teardowns, and smartphone reviews.',
      niche: ['Tech & Electronics', 'Gadgets', 'Innovation'],
      socialChannels: [
        { platform: 'youtube', handle: '@TechBurner', followers: 11400000 },
        { platform: 'instagram', handle: '@techburner', followers: 4200000 }
      ]
    });

    // Creator 5: Prajakta Koli (MostlySane)
    const prajaktaUser = await User.create({
      name: 'Prajakta Koli (MostlySane)',
      email: 'prajakta@creatorsync.com',
      password: 'Password123!',
      role: 'creator',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      username: 'mostly_sane',
      country: 'India',
      city: 'Mumbai',
      isVerified: true
    });

    const prajaktaCreator = await Creator.create({
      userId: prajaktaUser._id,
      category: 'Lifestyle & Comedy',
      primaryPlatform: 'YouTube',
      followersCount: 7200000, // 7.2M
      avgEngagement: 5.8,
      monthlyViews: 15000000,
      bio: 'Observational comedy, relatable vlogs, and youth lifestyle series. UNDP Youth Climate Champion.',
      niche: ['Lifestyle', 'Comedy', 'Beauty & Fashion'],
      socialChannels: [
        { platform: 'youtube', handle: '@MostlySane', followers: 7200000 },
        { platform: 'instagram', handle: '@mostly_sane', followers: 5100000 }
      ]
    });


    // ────────────────────────────────────────────────────────
    // 3. CAMPAIGN BRIEFS (INDIAN BRANDS)
    // ────────────────────────────────────────────────────────
    console.log('Creating Indian Brand Campaign Briefs...');

    // Campaign 1: boAt Airdopes 500 ANC Launch (Active)
    const project1 = await Project.create({
      brandId: boatUser._id,
      title: 'boAt Airdopes 500 ANC Flagship Launch',
      productName: 'boAt Airdopes 500 ANC Earbuds',
      description: 'boAt Lifestyle is launching our top-of-the-line Airdopes 500 Active Noise Cancelling Earbuds with 35dB Hybrid ANC, Beast Mode low latency, and 38-hour playback. We need tech and lifestyle creators across India to test ANC in real Indian city environments.',
      deliverables: [
        '1 Dedicated YouTube Review Video (8-12 mins) in Hindi/English',
        '2 Instagram Reels showcasing ANC Metro & Café Noise Test',
        '1 Story with Swipe-Up Buy Link'
      ],
      niche: ['Tech & Electronics', 'Gadgets', 'Audio Gear'],
      targetPlatforms: ['YouTube', 'Instagram'],
      budget: { min: 350000, max: 600000, currency: 'INR' },
      paymentPerCreator: 450000,
      creatorsRequired: 3,
      minFollowers: 100000,
      minEngagementRate: 4.0,
      preferredCreatorCategory: 'Tech & Electronics',
      language: 'Hindi',
      location: 'India',
      requirements: ['4K resolution video', 'Demonstrate 35dB ANC test on Delhi/Mumbai metro', 'Highlight ENx quad mic clarity'],
      isRemote: true,
      status: 'active',
      appDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      submissionDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      productImages: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
      ],
      brandGuidelines: 'Youthful, high-energy tone. Use hashtag #PlugIntoNirvana and tag @boat.nirvana.'
    });

    // Campaign 2: Mamaearth Vitamin C Glow Campaign (Active)
    const project2 = await Project.create({
      brandId: mamaearthUser._id,
      title: 'Mamaearth Vitamin C Face Serum Summer Campaign',
      productName: 'Mamaearth Vitamin C Serum with Gotu Kola',
      description: 'Skincare awareness campaign focusing on Indian skin types, natural glow, and toxin-free ingredients.',
      deliverables: ['2 Instagram Reels (Before & After 7 Days)', '1 YouTube Integration'],
      niche: ['Lifestyle', 'Beauty & Fashion'],
      targetPlatforms: ['Instagram', 'YouTube'],
      budget: { min: 200000, max: 450000, currency: 'INR' },
      paymentPerCreator: 250000,
      creatorsRequired: 2,
      status: 'active',
      location: 'India'
    });

    // Campaign 3: CRED Pay Summer Carnival (Active)
    const project3 = await Project.create({
      brandId: credUser._id,
      title: 'CRED Pay Summer Jackpot Launch',
      productName: 'CRED Pay UPI & Rewards',
      description: 'High-concept creative comedy campaign highlighting cashback rewards and luxury prizes on UPI payments.',
      deliverables: ['1 High-Production Cinematic Reel', '1 YouTube Short Showcase'],
      niche: ['Comedy & Entertainment', 'Lifestyle', 'Fintech'],
      targetPlatforms: ['Instagram', 'YouTube'],
      budget: { min: 500000, max: 1000000, currency: 'INR' },
      paymentPerCreator: 600000,
      creatorsRequired: 2,
      status: 'active',
      location: 'India'
    });

    // Campaign 4: boAt Wave Call Smartwatch (Completed)
    const project4 = await Project.create({
      brandId: boatUser._id,
      title: 'boAt Wave Call Smartwatch Launch',
      productName: 'boAt Wave Call Smartwatch',
      description: 'BT calling smartwatch launch featuring HD display and 100+ sports modes.',
      deliverables: ['1 Fitness & Calling Review Video', '1 Instagram Reel'],
      niche: ['Tech & Electronics', 'Fitness & Health'],
      targetPlatforms: ['YouTube', 'Instagram'],
      budget: { min: 300000, max: 500000, currency: 'INR' },
      paymentPerCreator: 350000,
      creatorsRequired: 1,
      status: 'completed',
      location: 'India'
    });

    // Campaign 5: Zomato Gourmet Dining Festival (Active)
    const project5 = await Project.create({
      brandId: zomatoUser._id,
      title: 'Zomato Gold Gourmet Dining Review',
      productName: 'Zomato Gold Membership',
      description: 'Food vloggers & lifestyle creators reviewing 1+1 food offers across top restaurants in Mumbai, Delhi & Bangalore.',
      deliverables: ['2 Restaurant Review Vlogs', '3 Instagram Stories'],
      niche: ['Lifestyle', 'Food & Dining'],
      targetPlatforms: ['Instagram', 'YouTube'],
      budget: { min: 150000, max: 300000, currency: 'INR' },
      paymentPerCreator: 200000,
      creatorsRequired: 3,
      status: 'active',
      location: 'India'
    });


    // ────────────────────────────────────────────────────────
    // 4. APPLICATIONS & PITCH PROPOSALS
    // ────────────────────────────────────────────────────────
    console.log('Creating Applications & Pitch Proposals...');

    // Application 1: Technical Guruji -> boAt Airdopes (Approved)
    await Application.create({
      projectId: project1._id,
      creatorId: tgUser._id,
      pitch: 'Namaste boAt team! I would love to feature the Airdopes 500 ANC in a dedicated 15-minute 4K review video on my channel (23.5M subs). We will perform a live noise isolation test inside the Delhi Metro.',
      proposedRate: 450000,
      status: 'approved'
    });

    // Application 2: Tech Burner -> boAt Airdopes (Shortlisted)
    await Application.create({
      projectId: project1._id,
      creatorId: shlokUser._id,
      pitch: 'Hey Aman & boAt team! We can execute an epic tech teardown and sound-isolation experiment Reel for 11.4M tech fans.',
      proposedRate: 400000,
      status: 'shortlisted'
    });

    // Application 3: CarryMinati -> CRED Pay (Approved)
    await Application.create({
      projectId: project3._id,
      creatorId: carryUser._id,
      pitch: 'Hey CRED team! I will create a hilarious 5-minute comedic sketch demonstrating how CRED Pay cashback gives you instant dopamine boosts during online shopping.',
      proposedRate: 600000,
      status: 'approved'
    });

    // Application 4: Prajakta -> Mamaearth (Pending)
    await Application.create({
      projectId: project2._id,
      creatorId: prajaktaUser._id,
      pitch: 'Hi Mamaearth! I can integrate the Vitamin C serum seamlessly into a relatable "Summer Morning Routine" vlog.',
      proposedRate: 250000,
      status: 'pending'
    });

    // Application 5: Bhuvan Bam -> CRED Pay (Pending)
    await Application.create({
      projectId: project3._id,
      creatorId: bhuvanUser._id,
      pitch: 'Hey Kunal & CRED team! Titu Mama and Sameer Fuddi sketch video incorporating CRED Coins rewards.',
      proposedRate: 650000,
      status: 'pending'
    });

    // Application 6: Technical Guruji -> boAt Wave Call (Completed)
    await Application.create({
      projectId: project4._id,
      creatorId: tgUser._id,
      pitch: 'Dedicated smartwatch review testing HD bluetooth calling in traffic.',
      proposedRate: 350000,
      status: 'approved'
    });


    // ────────────────────────────────────────────────────────
    // 5. COLLABORATION WORKSPACES
    // ────────────────────────────────────────────────────────
    console.log('Creating Collaboration Workspaces...');

    // Workspace 1: Active Collaboration (boAt & Technical Guruji on Project 1)
    const workspace1 = await Workspace.create({
      projectId: project1._id,
      brandId: boatUser._id,
      creatorId: tgUser._id,
      agreedRate: 450000,
      status: 'active',
      paymentStatus: 'escrowed',
      milestones: [
        {
          title: 'Review Video Script & Angle Approval',
          description: 'Submit video outline and Delhi Metro noise test plan.',
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'approved',
          submissionUrl: 'https://docs.google.com/document/d/demo_tg_boat_script',
          submissionNotes: 'Approved script covering 35dB Hybrid ANC, Beast Mode, and 38h battery test.'
        },
        {
          title: '4K Draft Video Upload',
          description: 'Upload 4K video draft proof for boAt team verification.',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'submitted',
          submissionUrl: 'https://youtube.com/watch?v=demo_tg_boat_draft',
          submissionNotes: 'Full 4K edit ready. Noise test sequence at 02:15.'
        },
        {
          title: 'Live Publication & 2 Instagram Reels',
          description: 'Publish video live on YouTube and post 2 Reels with buy link.',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: 'pending'
        }
      ]
    });

    // Workspace 2: Active Collaboration (CRED & CarryMinati on Project 3)
    const workspace2 = await Workspace.create({
      projectId: project3._id,
      brandId: credUser._id,
      creatorId: carryUser._id,
      agreedRate: 600000,
      status: 'active',
      paymentStatus: 'escrowed',
      milestones: [
        {
          title: 'Comedy Sketch Script Approval',
          description: 'Submit comedy sketch story board for CRED creative team review.',
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'approved',
          submissionNotes: 'Approved storyboard.'
        },
        {
          title: 'Cinematic Reel Draft Submission',
          description: 'Upload 60-second video draft.',
          dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          status: 'pending'
        }
      ]
    });

    // Workspace 3: Completed Collaboration (boAt & Technical Guruji on Project 4)
    await Workspace.create({
      projectId: project4._id,
      brandId: boatUser._id,
      creatorId: tgUser._id,
      agreedRate: 350000,
      status: 'completed',
      paymentStatus: 'paid',
      milestones: [
        {
          title: 'BT Calling Review & Fitness Demo',
          description: 'Full video publication and Instagram post.',
          dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          status: 'approved',
          submissionUrl: 'https://youtube.com/watch?v=demo_wavecall_tg',
          submissionNotes: 'Published live! Received over 850,000 views.'
        }
      ]
    });


    // ────────────────────────────────────────────────────────
    // 6. MESSAGES & CHAT THREADS
    // ────────────────────────────────────────────────────────
    console.log('Creating Direct Chat Messages...');

    // Thread 1: boAt & Technical Guruji
    await Message.create({
      projectId: project1._id,
      senderId: boatUser._id,
      receiverId: tgUser._id,
      text: 'Namaste Gaurav ji! We are super excited to partner with Technical Guruji for our flagship boAt Airdopes 500 ANC launch!',
      read: true
    });

    await Message.create({
      projectId: project1._id,
      senderId: tgUser._id,
      receiverId: boatUser._id,
      text: 'Dhanyawad boAt team! The review unit package has arrived. The Hybrid ANC and battery backup look very impressive.',
      read: true
    });

    await Message.create({
      projectId: project1._id,
      senderId: tgUser._id,
      receiverId: boatUser._id,
      text: 'I have uploaded the 4K draft review video link for Milestone 2 in our workspace. Please review the Delhi Metro noise test section at 02:15!',
      read: false
    });

    // Thread 2: CRED & CarryMinati
    await Message.create({
      projectId: project3._id,
      senderId: credUser._id,
      receiverId: carryUser._id,
      text: 'Hey Carry! We love the comedy roast concept for CRED Pay. The script outline looks hilarious!',
      read: true
    });


    // ────────────────────────────────────────────────────────
    // 7. NOTIFICATIONS
    // ────────────────────────────────────────────────────────
    console.log('Creating Notifications...');

    // Notifications for boAt (Brand)
    await Notification.create({
      recipientId: boatUser._id,
      senderId: tgUser._id,
      projectId: project1._id,
      type: 'new_application',
      title: 'New Pitch Received 📥',
      body: 'Creator "Gaurav Chaudhary (Technical Guruji)" submitted a pitch for campaign "boAt Airdopes 500 ANC Flagship Launch".',
      link: '/dashboard?tab=applications',
      isRead: true
    });

    await Notification.create({
      recipientId: boatUser._id,
      senderId: tgUser._id,
      projectId: project1._id,
      type: 'submission_uploaded',
      title: 'Draft Proof Uploaded 📤',
      body: 'Creator "Technical Guruji" uploaded deliverable draft proof for milestone: "4K Draft Video Upload" in "boAt Airdopes 500 ANC".',
      link: '/dashboard?tab=collaborations',
      isRead: false
    });

    // Notifications for Technical Guruji (Creator)
    await Notification.create({
      recipientId: tgUser._id,
      senderId: boatUser._id,
      projectId: project1._id,
      type: 'application_status',
      title: 'Pitch Accepted! 🎉',
      body: 'boAt Lifestyle accepted your campaign pitch for "boAt Airdopes 500 ANC Flagship Launch".',
      link: '/dashboard?tab=applications',
      isRead: true
    });

    await Notification.create({
      recipientId: tgUser._id,
      senderId: boatUser._id,
      projectId: project4._id,
      type: 'payment_completed',
      title: 'Payout Released! 💰',
      body: 'boAt Lifestyle marked payment of ₹3,50,000 as RELEASED for campaign "boAt Wave Call Smartwatch Launch".',
      link: '/dashboard?tab=completed-collaborations',
      isRead: true
    });


    // ────────────────────────────────────────────────────────
    // 8. RATINGS, REVIEWS & PAYMENTS
    // ────────────────────────────────────────────────────────
    console.log('Creating Reviews & Payments...');

    // Review: boAt -> Technical Guruji
    await Review.create({
      projectId: project4._id,
      reviewerId: boatUser._id,
      revieweeId: tgUser._id,
      rating: 5,
      comment: 'Technical Guruji delivered world-class 4K Hindi review content. The audience response drove massive product pre-orders!'
    });

    // Review: Technical Guruji -> boAt
    await Review.create({
      projectId: project4._id,
      reviewerId: tgUser._id,
      revieweeId: boatUser._id,
      rating: 5,
      comment: 'Pleasure collaborating with boAt Lifestyle. Prompt milestone approvals and instant escrow payout release.'
    });

    // Payments
    await Payment.create({
      projectId: project4._id,
      creatorId: tgUser._id,
      brandId: boatUser._id,
      amount: 350000,
      status: 'released',
      transactionReference: `PAY-BOAT-INR-${Date.now()}`
    });

    await Payment.create({
      projectId: project1._id,
      creatorId: tgUser._id,
      brandId: boatUser._id,
      amount: 450000,
      status: 'escrowed',
      transactionReference: `ESCROW-BOAT-INR-${Date.now()}`
    });

    console.log('\n======================================================');
    console.log('SUCCESS! Rich Demo Data Seeded for ALL Brands & Creators');
    console.log('======================================================');
    console.log('Demo Login Credentials:');
    console.log('\n🏢 BRAND ACCOUNTS:');
    console.log('   boAt Lifestyle:   brand@creatorsync.com   / Password123!');
    console.log('   Mamaearth:        mamaearth@creatorsync.com / Password123!');
    console.log('   CRED:             cred@creatorsync.com      / Password123!');
    console.log('   Zomato:           zomato@creatorsync.com    / Password123!');
    console.log('\n👤 CREATOR ACCOUNTS:');
    console.log('   Technical Guruji: creator@creatorsync.com   / Password123!');
    console.log('   CarryMinati:      carry@creatorsync.com     / Password123!');
    console.log('   BB Ki Vines:      bhuvan@creatorsync.com    / Password123!');
    console.log('   Tech Burner:      shlok@creatorsync.com     / Password123!');
    console.log('   MostlySane:       prajakta@creatorsync.com  / Password123!');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error with Seeder Data Import:', error);
    process.exit(1);
  }
};

importData();
