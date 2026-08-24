import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Workspace from './models/Workspace.js';

dotenv.config();

const seedCompletedCollaborations = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/creatorsync');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Get all creators
    const creators = await User.find({ role: 'creator' });
    console.log(`Found ${creators.length} creators`);

    // Get all brands
    const brands = await User.find({ role: 'brand' });
    console.log(`Found ${brands.length} brands`);

    // Get all existing projects
    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects`);

    // Delete only completed workspaces
    const deleted = await Workspace.deleteMany({ status: 'completed' });
    console.log(`Deleted ${deleted.deletedCount} existing completed workspaces`);

    // Create new completed projects for each brand-creator pair
    const completedProjects = [];

    // Project A: Mamaearth x Prajakta Koli — Vitamin C Glow
    const projA = await Project.create({
      brandId: brands.find(b => b.name.includes('Mamaearth'))?._id || brands[0]._id,
      title: 'Mamaearth Vitamin C Glow-Up Series',
      productName: 'Mamaearth Vitamin C Face Serum',
      description: 'A 4-week skincare journey documenting the results of using Mamaearth Vitamin C serum. The creator showcased before-and-after results, morning routine integration, and honest reviews on skin texture improvement.',
      deliverables: ['2 Instagram Reels (Before & After)', '1 YouTube Integration Vlog', '3 Story Updates'],
      niche: ['Lifestyle', 'Beauty & Fashion', 'Skincare'],
      targetPlatforms: ['Instagram', 'YouTube'],
      budget: { min: 200000, max: 350000, currency: 'INR' },
      paymentPerCreator: 275000,
      creatorsRequired: 1,
      status: 'completed',
      location: 'India',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-05-15'),
      submissionDeadline: new Date('2026-05-10')
    });
    completedProjects.push(projA);

    // Project B: CRED x Bhuvan Bam — BB Ki Vines CRED Integration
    const projB = await Project.create({
      brandId: brands.find(b => b.name.includes('CRED'))?._id || brands[0]._id,
      title: 'CRED Coins Titu Mama Special Integration',
      productName: 'CRED Coins Reward System',
      description: 'BB Ki Vines style comedy sketch featuring Titu Mama discovering CRED coins rewards system. Integrated seamlessly into a classic BB Ki Vines episode format with product placement.',
      deliverables: ['1 BB Ki Vines Episode (5-7 min)', '1 Instagram Reel Teaser', '2 Stories with Swipe-Up'],
      niche: ['Comedy & Entertainment', 'Fintech', 'Lifestyle'],
      targetPlatforms: ['YouTube', 'Instagram'],
      budget: { min: 500000, max: 800000, currency: 'INR' },
      paymentPerCreator: 700000,
      creatorsRequired: 1,
      status: 'completed',
      location: 'India',
      startDate: new Date('2026-03-15'),
      endDate: new Date('2026-04-30'),
      submissionDeadline: new Date('2026-04-25')
    });
    completedProjects.push(projB);

    // Project C: Zomato x Tech Burner — Zomato Gold Review
    const projC = await Project.create({
      brandId: brands.find(b => b.name.includes('Zomato'))?._id || brands[0]._id,
      title: 'Zomato Gold Premium Dining Experience',
      productName: 'Zomato Gold Membership',
      description: 'Tech Burner explored the premium dining experience with Zomato Gold membership across 5 top restaurants in Delhi NCR, creating an engaging food-tech crossover content series.',
      deliverables: ['2 Restaurant Review Vlogs', '3 Instagram Stories', '1 YouTube Short'],
      niche: ['Lifestyle', 'Food & Dining', 'Tech'],
      targetPlatforms: ['YouTube', 'Instagram'],
      budget: { min: 250000, max: 400000, currency: 'INR' },
      paymentPerCreator: 325000,
      creatorsRequired: 1,
      status: 'completed',
      location: 'India',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-03-15'),
      submissionDeadline: new Date('2026-03-10')
    });
    completedProjects.push(projC);

    // Project D: boAt x CarryMinati — Gaming Headphone Launch
    const projD = await Project.create({
      brandId: brands.find(b => b.name.includes('boAt'))?._id || brands[0]._id,
      title: 'boAt Immortal 1000D Gaming Headphones',
      productName: 'boAt Immortal 1000D',
      description: 'CarryMinati used the boAt Immortal 1000D gaming headphones during a BGMI live stream tournament, showcasing the 7.1 surround sound, RGB LED lighting, and ENx technology for clear team communication.',
      deliverables: ['1 Live Stream Integration (2+ hours)', '1 Dedicated Review Reel', '2 Instagram Story Highlights'],
      niche: ['Gaming', 'Tech & Electronics', 'Live Streaming'],
      targetPlatforms: ['YouTube', 'Instagram'],
      budget: { min: 400000, max: 700000, currency: 'INR' },
      paymentPerCreator: 550000,
      creatorsRequired: 1,
      status: 'completed',
      location: 'India',
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-02-28'),
      submissionDeadline: new Date('2026-02-20')
    });
    completedProjects.push(projD);

    // Project E: Mamaearth x CarryMinati — Men's Grooming Line
    const projE = await Project.create({
      brandId: brands.find(b => b.name.includes('Mamaearth'))?._id || brands[0]._id,
      title: 'Mamaearth Men Charcoal Face Wash Launch',
      productName: 'Mamaearth Charcoal Face Wash for Men',
      description: 'CarryMinati did a humorous take on his daily grooming routine, featuring Mamaearth Charcoal Face Wash in a relatable comedy skit about "gamer skin care".',
      deliverables: ['1 YouTube Comedy Integration', '2 Instagram Reels'],
      niche: ['Comedy & Entertainment', 'Grooming', 'Lifestyle'],
      targetPlatforms: ['YouTube', 'Instagram'],
      budget: { min: 300000, max: 500000, currency: 'INR' },
      paymentPerCreator: 400000,
      creatorsRequired: 1,
      status: 'completed',
      location: 'India',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-06-15'),
      submissionDeadline: new Date('2026-06-10')
    });
    completedProjects.push(projE);

    console.log('Creating completed workspaces...');

    // Find specific creators
    const tgUser = creators.find(c => c.name.includes('Technical Guruji'));
    const carryUser = creators.find(c => c.name.includes('CarryMinati'));
    const bhuvanUser = creators.find(c => c.name.includes('Bhuvan Bam'));
    const shlokUser = creators.find(c => c.name.includes('Tech Burner'));
    const prajaktaUser = creators.find(c => c.name.includes('Prajakta'));

    const boatUser = brands.find(b => b.name.includes('boAt'));
    const mamaearthUser = brands.find(b => b.name.includes('Mamaearth'));
    const credUser = brands.find(b => b.name.includes('CRED'));
    const zomatoUser = brands.find(b => b.name.includes('Zomato'));

    // Workspace 1: Mamaearth x Prajakta (Completed)
    if (prajaktaUser && mamaearthUser) {
      await Workspace.create({
        projectId: projA._id,
        brandId: mamaearthUser._id,
        creatorId: prajaktaUser._id,
        agreedRate: 275000,
        proposedRate: 275000,
        status: 'completed',
        paymentStatus: 'paid',
        milestones: [
          {
            title: 'Before/After Photo Shoot & Script',
            description: 'Submit initial skin analysis photos and Instagram Reel script for Mamaearth review.',
            dueDate: new Date('2026-04-10'),
            status: 'approved',
            submissionUrl: 'https://drive.google.com/prajakta_skincare_script',
            submissionNotes: 'Script approved! Beautiful before photos captured in natural lighting.'
          },
          {
            title: 'YouTube Integration Vlog Upload',
            description: 'Morning routine vlog seamlessly integrating Vitamin C serum application.',
            dueDate: new Date('2026-04-25'),
            status: 'approved',
            submissionUrl: 'https://youtube.com/watch?v=prajakta_vitamin_c',
            submissionNotes: 'Video published! 1.2M views in first 48 hours. Engagement rate: 8.2%.'
          },
          {
            title: 'Instagram Reels & Story Updates',
            description: 'Post 2 Instagram Reels showing before/after results and 3 story updates.',
            dueDate: new Date('2026-05-10'),
            status: 'approved',
            submissionUrl: 'https://instagram.com/p/prajakta_glow',
            submissionNotes: 'All reels published! Combined reach: 4.5M. Stories completed with swipe-up links.'
          }
        ],
        messages: [
          { senderId: mamaearthUser._id, text: 'Hi Prajakta! Welcome aboard the Vitamin C Glow campaign! 🌟', createdAt: new Date('2026-04-01') },
          { senderId: prajaktaUser._id, text: 'So excited to work on this! The serum arrived and I love the packaging.', createdAt: new Date('2026-04-02') },
          { senderId: prajaktaUser._id, text: 'Script submitted for milestone 1. Let me know your thoughts!', createdAt: new Date('2026-04-10') },
          { senderId: mamaearthUser._id, text: 'Script looks amazing! Approved. Love the morning routine angle. 💛', createdAt: new Date('2026-04-11') },
          { senderId: prajaktaUser._id, text: 'All deliverables done! Thank you for the wonderful collaboration. 🎉', createdAt: new Date('2026-05-10') }
        ]
      });
      console.log('✅ Created: Mamaearth x Prajakta Koli');
    }

    // Workspace 2: CRED x Bhuvan Bam (Completed)
    if (bhuvanUser && credUser) {
      await Workspace.create({
        projectId: projB._id,
        brandId: credUser._id,
        creatorId: bhuvanUser._id,
        agreedRate: 700000,
        proposedRate: 700000,
        status: 'completed',
        paymentStatus: 'paid',
        milestones: [
          {
            title: 'Comedy Sketch Script & Storyboard',
            description: 'Submit Titu Mama comedy sketch storyboard for CRED creative review.',
            dueDate: new Date('2026-03-25'),
            status: 'approved',
            submissionUrl: 'https://docs.google.com/bhuvan_cred_script',
            submissionNotes: 'Hilarious Titu Mama concept approved! CRED team loved the credit card bill joke.'
          },
          {
            title: 'Full Episode Production & Edit',
            description: 'Produce full BB Ki Vines episode with CRED Coins integration.',
            dueDate: new Date('2026-04-15'),
            status: 'approved',
            submissionUrl: 'https://youtube.com/watch?v=bhuvan_cred_titu',
            submissionNotes: 'Episode live! 5.8M views in 72 hours. CRED app downloads spiked 340%.'
          },
          {
            title: 'Instagram Reel Teaser & Stories',
            description: 'Post teaser reel and 2 stories with CRED app link.',
            dueDate: new Date('2026-04-25'),
            status: 'approved',
            submissionUrl: 'https://instagram.com/reel/bhuvan_cred_teaser',
            submissionNotes: 'All assets published. Reel got 3.2M views. Stories reached 6.1M accounts.'
          }
        ],
        messages: [
          { senderId: credUser._id, text: 'Hey Bhuvan! Super excited for this Titu Mama x CRED collab! 🚀', createdAt: new Date('2026-03-15') },
          { senderId: bhuvanUser._id, text: 'Kunal bhai! Titu Mama is ready to discover CRED coins 😂', createdAt: new Date('2026-03-16') },
          { senderId: bhuvanUser._id, text: 'Episode is LIVE! Check out the final edit. Titu Mama nailed it! 🎬', createdAt: new Date('2026-04-15') },
          { senderId: credUser._id, text: 'INCREDIBLE work! App downloads spiked 340%. Best collab this quarter! 🏆', createdAt: new Date('2026-04-16') }
        ]
      });
      console.log('✅ Created: CRED x Bhuvan Bam');
    }

    // Workspace 3: Zomato x Tech Burner (Completed)
    if (shlokUser && zomatoUser) {
      await Workspace.create({
        projectId: projC._id,
        brandId: zomatoUser._id,
        creatorId: shlokUser._id,
        agreedRate: 325000,
        proposedRate: 325000,
        status: 'completed',
        paymentStatus: 'paid',
        milestones: [
          {
            title: 'Restaurant Selection & Shot Planning',
            description: 'Select 5 premium Delhi NCR restaurants and submit filming plan.',
            dueDate: new Date('2026-02-10'),
            status: 'approved',
            submissionUrl: 'https://docs.google.com/shlok_zomato_plan',
            submissionNotes: 'Selected Bukhara, Indian Accent, Pa Pa Ya, Wasabi, and Dum Pukht. Plan approved!'
          },
          {
            title: 'Restaurant Review Vlogs (2x)',
            description: 'Upload 2 detailed restaurant review vlogs showcasing Zomato Gold benefits.',
            dueDate: new Date('2026-03-01'),
            status: 'approved',
            submissionUrl: 'https://youtube.com/watch?v=shlok_zomato_review',
            submissionNotes: 'Both vlogs live! Combined 2.4M views. Gold membership signups increased 180%.'
          },
          {
            title: 'Instagram Stories & YouTube Short',
            description: 'Post 3 Instagram stories and 1 YouTube Short highlighting dining experience.',
            dueDate: new Date('2026-03-10'),
            status: 'approved',
            submissionUrl: 'https://youtube.com/shorts/shlok_zomato_short',
            submissionNotes: 'All content delivered. YouTube Short hit 1.8M views. Stories reached 3.2M users.'
          }
        ],
        messages: [
          { senderId: zomatoUser._id, text: 'Welcome to Zomato Gold, Shlok! Ready for an epic dining journey? 🍕', createdAt: new Date('2026-02-01') },
          { senderId: shlokUser._id, text: 'So hyped! Already researching the best restaurants in Delhi. Let\'s go! 🔥', createdAt: new Date('2026-02-02') },
          { senderId: shlokUser._id, text: 'Both review vlogs are live! The food was INSANE. Check them out!', createdAt: new Date('2026-03-01') },
          { senderId: zomatoUser._id, text: 'Amazing content! Gold memberships spiked 180%. Team Zomato is thrilled! 🎉', createdAt: new Date('2026-03-02') }
        ]
      });
      console.log('✅ Created: Zomato x Tech Burner');
    }

    // Workspace 4: boAt x CarryMinati Gaming Headphones (Completed)
    if (carryUser && boatUser) {
      await Workspace.create({
        projectId: projD._id,
        brandId: boatUser._id,
        creatorId: carryUser._id,
        agreedRate: 550000,
        proposedRate: 550000,
        status: 'completed',
        paymentStatus: 'paid',
        milestones: [
          {
            title: 'Gaming Stream Setup & Headphone Test',
            description: 'Set up boAt Immortal 1000D for BGMI tournament stream and test features.',
            dueDate: new Date('2026-01-20'),
            status: 'approved',
            submissionUrl: 'https://youtube.com/live/carry_boat_stream',
            submissionNotes: 'Live stream completed! 2.1M concurrent viewers. Headphone received amazing feedback in chat.'
          },
          {
            title: 'Dedicated Review Reel & Stories',
            description: 'Post Instagram Reel with product review and 2 Story Highlights.',
            dueDate: new Date('2026-02-10'),
            status: 'approved',
            submissionUrl: 'https://instagram.com/reel/carry_boat_immortal',
            submissionNotes: 'Reel published with 8.5M views. Stories with buy-link generated 45K clicks.'
          }
        ],
        messages: [
          { senderId: boatUser._id, text: 'Carry bhai! boAt Immortal 1000D is ready for your gaming stream! 🎮', createdAt: new Date('2026-01-10') },
          { senderId: carryUser._id, text: 'Aman bhai! The headphones are FIRE. 7.1 surround sound is insane for BGMI! 🔥', createdAt: new Date('2026-01-11') },
          { senderId: carryUser._id, text: 'Stream done! 2.1M concurrent viewers watched me wreck squads with these headphones 😎', createdAt: new Date('2026-01-20') },
          { senderId: boatUser._id, text: 'Legendary stream! Sales spiked 250% overnight. Thank you Carry! 🚀', createdAt: new Date('2026-01-21') }
        ]
      });
      console.log('✅ Created: boAt x CarryMinati');
    }

    // Workspace 5: Mamaearth x CarryMinati Men's Grooming (Completed)
    if (carryUser && mamaearthUser) {
      await Workspace.create({
        projectId: projE._id,
        brandId: mamaearthUser._id,
        creatorId: carryUser._id,
        agreedRate: 400000,
        proposedRate: 400000,
        status: 'completed',
        paymentStatus: 'paid',
        milestones: [
          {
            title: 'Comedy Sketch Script Approval',
            description: 'Submit "Gamer Skincare" comedy skit concept for Mamaearth team.',
            dueDate: new Date('2026-05-10'),
            status: 'approved',
            submissionUrl: 'https://docs.google.com/carry_mamaearth_script',
            submissionNotes: 'Hilarious concept approved! Love the "gamer skin vs normal skin" angle.'
          },
          {
            title: 'YouTube Video & Instagram Reels',
            description: 'Publish YouTube comedy integration and 2 Instagram Reels.',
            dueDate: new Date('2026-06-01'),
            status: 'approved',
            submissionUrl: 'https://youtube.com/watch?v=carry_mamaearth_grooming',
            submissionNotes: 'Video live with 4.2M views! Reels combined 6.8M views. Product link CTR: 12.3%.'
          }
        ],
        messages: [
          { senderId: mamaearthUser._id, text: 'Hey Carry! Excited to have you for our Men\'s Charcoal Face Wash campaign! 💪', createdAt: new Date('2026-05-01') },
          { senderId: carryUser._id, text: 'Bro this face wash actually works! My skin feels so clean after gaming sessions 😂', createdAt: new Date('2026-05-05') },
          { senderId: carryUser._id, text: 'All content is LIVE! The gamer skincare angle was perfect. Thanks team! 🎬', createdAt: new Date('2026-06-01') },
          { senderId: mamaearthUser._id, text: 'Incredible results! CTR at 12.3%. Best men\'s grooming campaign we\'ve run! 🏆', createdAt: new Date('2026-06-02') }
        ]
      });
      console.log('✅ Created: Mamaearth x CarryMinati');
    }

    // Also update the existing completed workspace (boAt x TG) to have proposedRate
    if (tgUser && boatUser) {
      const existingCompleted = await Workspace.findOne({ 
        creatorId: tgUser._id, 
        brandId: boatUser._id, 
        status: 'completed' 
      });
      if (existingCompleted) {
        existingCompleted.proposedRate = existingCompleted.agreedRate || 350000;
        await existingCompleted.save();
        console.log('✅ Updated: boAt x Technical Guruji (existing)');
      }
    }

    console.log('\n🎉 All completed collaborations seeded successfully!\n');
    
    // Summary
    const allCompleted = await Workspace.find({ status: 'completed' });
    console.log(`Total completed workspaces in DB: ${allCompleted.length}`);
    for (const ws of allCompleted) {
      const creator = await User.findById(ws.creatorId);
      const brand = await User.findById(ws.brandId);
      const project = await Project.findById(ws.projectId);
      console.log(`  → ${brand?.name} x ${creator?.name}: "${project?.title}" | Rate: ₹${ws.agreedRate?.toLocaleString()}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedCompletedCollaborations();
