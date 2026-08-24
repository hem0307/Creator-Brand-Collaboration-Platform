import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  type: {
    type: String,
    required: true,
    enum: [
      'new_application',
      'application_submitted',
      'application_status',
      'invitation_accepted',
      'invitation_rejected',
      'submission_uploaded',
      'milestone_submitted',
      'milestone_approved',
      'milestone_changes_requested',
      'payment_completed',
      'payment_released',
      'deadline_reminder',
      'campaign_completed',
      'workspace_completed',
      'chat_message',
      'system_alert'
    ]
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
