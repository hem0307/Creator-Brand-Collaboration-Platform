import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'approved', 'changes_requested'],
    default: 'pending'
  },
  submissionUrl: {
    type: String,
    default: ''
  },
  submissionNotes: {
    type: String,
    default: ''
  },
  feedbackNotes: {
    type: String,
    default: ''
  }
});

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const workspaceSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  milestones: {
    type: [milestoneSchema],
    default: []
  },
  messages: {
    type: [messageSchema],
    default: []
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'escrowed', 'paid', 'released'],
    default: 'escrowed'
  },
  agreedRate: {
    type: Number,
    default: 0
  },
  proposedRate: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'disputed'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
export default Workspace;
