import Message from '../models/Message.js';
import Workspace from '../models/Workspace.js';
import User from '../models/User.js';
import { sendMockEmail } from '../utils/sendMockEmail.js';

// @desc    Get inbox conversation summary threads
// @route   GET /api/messages/inbox
// @access  Private
export const getInboxSummary = async (req, res, next) => {
  try {
    const query = req.user.role === 'creator' 
      ? { creatorId: req.user._id } 
      : { brandId: req.user._id };

    const workspaces = await Workspace.find(query)
      .populate('projectId', 'title')
      .populate('brandId', 'name email profileImage')
      .populate('creatorId', 'name email profileImage');

    const threads = [];

    for (const ws of workspaces) {
      if (!ws.projectId) continue;

      // Find last message in this workspace thread
      const lastMessage = await Message.findOne({ projectId: ws.projectId._id })
        .sort({ createdAt: -1 });

      // Count unread messages received by current user
      const unreadCount = await Message.countDocuments({
        projectId: ws.projectId._id,
        receiverId: req.user._id,
        read: false
      });

      threads.push({
        workspaceId: ws._id,
        projectId: ws.projectId._id,
        projectTitle: ws.projectId.title,
        partnerName: req.user.role === 'creator' ? ws.brandId?.name : ws.creatorId?.name,
        partnerAvatar: req.user.role === 'creator' ? ws.brandId?.profileImage : ws.creatorId?.profileImage,
        partnerId: req.user.role === 'creator' ? ws.brandId?._id : ws.creatorId?._id,
        lastMessageText: lastMessage ? lastMessage.text : 'No messages yet.',
        lastMessageDate: lastMessage ? lastMessage.createdAt : ws.createdAt,
        unreadCount
      });
    }

    // Sort inbox by most recent message date
    threads.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

    res.json(threads);
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat message history for a thread
// @route   GET /api/messages/thread/:projectId
// @access  Private
export const getChatMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ projectId: req.params.projectId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages/thread/:projectId
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { text, receiverId, attachments } = req.body;
    const { projectId } = req.params;

    if (!text && (!attachments || attachments.length === 0)) {
      res.status(400);
      throw new Error('Message cannot be empty');
    }

    if (!receiverId) {
      res.status(400);
      throw new Error('Receiver ID is required');
    }

    // Auto-create workspace if it doesn't exist
    const brandId = req.user.role === 'brand' ? req.user._id : receiverId;
    const creatorId = req.user.role === 'creator' ? req.user._id : receiverId;

    const existingWorkspace = await Workspace.findOne({ projectId, brandId, creatorId });
    if (!existingWorkspace) {
      await Workspace.create({
        projectId,
        brandId,
        creatorId,
        milestones: [],
        status: 'active'
      });
    }

    const message = await Message.create({
      projectId,
      senderId: req.user._id,
      receiverId,
      text,
      attachments: attachments || []
    });

    // Trigger mock email alert to Receiver
    try {
      const receiverUser = await User.findById(receiverId);
      if (receiverUser) {
        sendMockEmail({
          to: receiverUser.email,
          subject: `New Message from ${req.user.name}`,
          body: `Hi ${receiverUser.name},\n\nYou have received a new message from ${req.user.name}:\n\n"${text}"\n\nLog in to CreatorSync Inbox to reply.\n\nBest,\nCreatorSync Team`
        });
      }
    } catch (mailErr) {
      console.warn('Simulated message email notification dispatch failed:', mailErr.message);
    }

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark chat thread messages as read
// @route   PUT /api/messages/thread/:projectId/read
// @access  Private
export const markThreadAsRead = async (req, res, next) => {
  try {
    await Message.updateMany(
      { projectId: req.params.projectId, receiverId: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'Thread marked as read' });
  } catch (error) {
    next(error);
  }
};
