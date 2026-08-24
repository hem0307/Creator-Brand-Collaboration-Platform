import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import {
  Users,
  FileText,
  DollarSign,
  PlusCircle,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Clock,
  Sparkles,
  Youtube,
  Instagram,
  MessageSquare,
  Bell,
  Trash2,
  Save,
  Check,
  Mail,
  Compass,
  Bookmark,
  Calendar,
  Layers,
  CreditCard,
  Building,
  CheckSquare,
  AlertTriangle,
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertOctagon,
  Smile,
  Image,
  Paperclip,
  Send,
  BarChart2,
  Settings as SettingsIcon,
  Lock,
  Globe,
  User as UserCircle,
  Palette,
  Edit as EditIcon,
  Play,
  Pause,
  XCircle,
  Plus,
  Link as LinkIcon,
  ExternalLink,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

// Chart.js Integrations
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line as LineChart, Bar as BarChart, Doughnut as DoughnutChart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ activeProjects: 0, totalApplications: 0, financialMetric: 0 });
  const [applications, setApplications] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [appSubTab, setAppSubTab] = useState('all');
  const [collabSubTab, setCollabSubTab] = useState('all');
  const [notifFilter, setNotifFilter] = useState('all');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('30d');
  const [changeRequestModal, setChangeRequestModal] = useState(null);
  const [threadSearch, setThreadSearch] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [error, setError] = useState(null);

  // Messaging States
  const [inboxThreads, setInboxThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [attachUrl, setAttachUrl] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [chatSearch, setChatSearch] = useState('');
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [mediaDrawer, setMediaDrawer] = useState(null);
  const [mediaUrlInput, setMediaUrlInput] = useState('');

  // Admin Specific States
  const [adminStats, setAdminStats] = useState({ totalUsers: 0, creatorUsers: 0, brandUsers: 0, totalProjects: 0, activeReports: 0, platformFeeRevenue: 0 });
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminReports, setAdminReports] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [newRole, setNewRole] = useState('creator');

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [password, setPassword] = useState('');
  
  // Creator Details Form States
  const [creatorBio, setCreatorBio] = useState(user?.creatorDetails?.bio || '');
  const [creatorPortfolio, setCreatorPortfolio] = useState(user?.creatorDetails?.portfolioUrl || '');
  const [nicheInput, setNicheInput] = useState(user?.creatorDetails?.niche?.join(', ') || '');
  
  // Brand Details Form States
  const [companyName, setCompanyName] = useState(user?.brandDetails?.companyName || '');
  const [brandIndustry, setBrandIndustry] = useState(user?.brandDetails?.industry || '');
  const [brandWebsite, setBrandWebsite] = useState(user?.brandDetails?.website || '');
  const [brandDescription, setBrandDescription] = useState(user?.brandDetails?.description || '');
  const [brandInsta, setBrandInsta] = useState('');
  const [brandTwitter, setBrandTwitter] = useState('');
  const [brandLinkedin, setBrandLinkedin] = useState('');
  const [brandFacebook, setBrandFacebook] = useState('');
  const [brandImages, setBrandImages] = useState('');

  // Social Channels States
  const [youtubeHandle, setYoutubeHandle] = useState('');
  const [youtubeFollowers, setYoutubeFollowers] = useState('');
  const [instaHandle, setInstaHandle] = useState('');
  const [instaFollowers, setInstaFollowers] = useState('');
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [tiktokFollowers, setTiktokFollowers] = useState('');

  // Project Brief Form states (Brand)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [platformsInput, setPlatformsInput] = useState('');
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [creating, setCreating] = useState(false);
  const [creatorsRequiredInput, setCreatorsRequiredInput] = useState(1);
  const [deadlineInput, setDeadlineInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [isRemoteInput, setIsRemoteInput] = useState(true);

  // Extended campaign management states
  const [productName, setProductName] = useState('');
  const [paymentPerCreator, setPaymentPerCreator] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [minEngagementRate, setMinEngagementRate] = useState('');
  const [preferredCreatorCategory, setPreferredCreatorCategory] = useState('');
  const [campaignLanguage, setCampaignLanguage] = useState('');
  const [appDeadline, setAppDeadline] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submissionDeadline, setSubmissionDeadline] = useState('');
  const [productImages, setProductImages] = useState('');
  const [brandGuidelines, setBrandGuidelines] = useState('');
  const [campaignStatus, setCampaignStatus] = useState('active');
  const [editingCampaignId, setEditingCampaignId] = useState(null);

  // Active Campaign Inspection (For Applications review)
  const [inspectedCampaign, setInspectedCampaign] = useState(null);
  const [campaignApplicants, setCampaignApplicants] = useState([]);

  // Success Feedback triggers
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings State Hooks
  const [lang, setLang] = useState(user?.language || 'en');
  const [profPublic, setProfPublic] = useState(user?.privacySettings?.profilePublic ?? true);
  const [emailAlert, setEmailAlert] = useState(user?.notificationSettings?.emailAlerts ?? true);
  const [inAppAlert, setInAppAlert] = useState(user?.notificationSettings?.inAppAlerts ?? true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Hydrate notifications & messages
      try {
        const notifRes = await api.get('/notifications');
        setNotifications(notifRes.data || []);
        
        const inboxRes = await api.get('/messages/inbox');
        setInboxThreads(inboxRes.data || []);
      } catch (notifErr) {
        console.warn('Notifications/inbox fetch warning:', notifErr.message);
      }
      
      if (user.role === 'admin') {
        const statsRes = await api.get('/admin/stats');
        setAdminStats(statsRes.data);
        fetchAdminUsers();
        const reportsRes = await api.get('/admin/reports');
        setAdminReports(reportsRes.data || []);
        const projRes = await api.get('/campaigns');
        setCampaigns(projRes.data || []);
      } else {
        const wsRes = await api.get('/workspaces');
        const wsList = wsRes.data || [];
        setWorkspaces(wsList);

        if (user.role === 'creator') {
          const appRes = await api.get('/applications/me');
          const appList = appRes.data || [];
          setApplications(appList);

          const campRes = await api.get('/campaigns');
          const campList = campRes.data || [];
          setCampaigns(campList);

          const activeWorkspaces = wsList.filter(w => w.status === 'active');
          const totalEarnings = wsList
            .filter(w => w.status === 'completed')
            .reduce((acc, curr) => acc + (curr.proposedRate || 1500), 0);

          setStats({
            activeProjects: activeWorkspaces.length,
            totalApplications: appList.length,
            financialMetric: totalEarnings || 2450
          });

          if (user.creatorDetails) {
            setCreatorBio(user.creatorDetails.bio || '');
            setCreatorPortfolio(user.creatorDetails.portfolioUrl || '');
            setNicheInput(user.creatorDetails.niche?.join(', ') || '');
            
            const yt = user.creatorDetails.socialChannels?.find(c => c.platform === 'youtube');
            if (yt) {
              setYoutubeHandle(yt.handle || '');
              setYoutubeFollowers(yt.followers || '');
            }
            const inst = user.creatorDetails.socialChannels?.find(c => c.platform === 'instagram');
            if (inst) {
              setInstaHandle(inst.handle || '');
              setInstaFollowers(inst.followers || '');
            }
            const tk = user.creatorDetails.socialChannels?.find(c => c.platform === 'tiktok');
            if (tk) {
              setTiktokHandle(tk.handle || '');
              setTiktokFollowers(tk.followers || '');
            }
          }
        } else {
          const campRes = await api.get('/campaigns/me');
          const campList = campRes.data || [];
          setCampaigns(campList);

          const appRes = await api.get('/applications/brand');
          const appList = appRes.data || [];
          setApplications(appList);

          const activeWorkspaces = wsList.filter(w => w.status === 'active');
          const totalBudget = campList.reduce((acc, curr) => acc + (curr.budget?.max || 0), 0);

          setStats({
            activeProjects: activeWorkspaces.length,
            totalApplications: appList.length,
            financialMetric: totalBudget
          });

          if (user.brandDetails) {
            setCompanyName(user.brandDetails.companyName || '');
            setBrandIndustry(user.brandDetails.industry || '');
            setBrandWebsite(user.brandDetails.website || '');
            setBrandDescription(user.brandDetails.description || '');
            
            const inst = user.brandDetails.socialLinks?.find(s => s.platform === 'instagram');
            setBrandInsta(inst ? inst.handle : '');
            const twit = user.brandDetails.socialLinks?.find(s => s.platform === 'twitter');
            setBrandTwitter(twit ? twit.handle : '');
            const lnkd = user.brandDetails.socialLinks?.find(s => s.platform === 'linkedin');
            setBrandLinkedin(lnkd ? lnkd.handle : '');
            const face = user.brandDetails.socialLinks?.find(s => s.platform === 'facebook');
            setBrandFacebook(face ? face.handle : '');
            setBrandImages(user.brandDetails.images?.join(', ') || '');
          }
        }
      }
    } catch (err) {
      console.warn('Dashboard hydrate warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const usersRes = await api.get(`/admin/users?search=${userSearch}&role=${userRoleFilter}&page=${userPage}`);
      setAdminUsers(usersRes.data.users || []);
      setUserTotalPages(usersRes.data.pages || 1);
    } catch (err) {
      console.warn('Error fetching admin users:', err.message);
    }
  };

  const fetchChatMessages = async (projectId) => {
    try {
      const res = await api.get(`/messages/thread/${projectId}`);
      setChatMessages(res.data || []);
      
      // Mark read seen state
      await api.put(`/messages/thread/${projectId}/read`);
      
      // Reload inbox to update counters
      const inboxRes = await api.get('/messages/inbox');
      setInboxThreads(inboxRes.data || []);
    } catch (err) {
      console.warn('Error fetching chats:', err.message);
    }
  };

  const handleWithdrawApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      await api.delete(`/applications/${appId}`);
      
      // Refresh applications lists
      const appRes = await api.get('/applications/me');
      setApplications(appRes.data || []);
      
      // Also refresh dashboard workspaces/stats
      const wsRes = await api.get('/workspaces');
      const wsList = wsRes.data || [];
      setWorkspaces(wsList);
      
      const activeWorkspaces = wsList.filter(w => w.status === 'active');
      const totalEarnings = wsList
        .filter(w => w.status === 'completed')
        .reduce((acc, curr) => acc + (curr.proposedRate || 1500), 0);
      
      setStats({
        activeProjects: activeWorkspaces.length,
        totalApplications: appRes.data.length,
        financialMetric: totalEarnings || 2450
      });
    } catch (err) {
      console.warn('Withdraw application error:', err.message);
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setLoading(false);
    }
  };
  // Active collaborations states
  const [submittingMilestoneId, setSubmittingMilestoneId] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [activeChatWsId, setActiveChatWsId] = useState(null);
  const [typedWsMessage, setTypedWsMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSubmitMilestoneProof = async (wsId, mId) => {
    if (!submissionUrl) return;
    setSubmissionLoading(true);
    try {
      await api.post(`/workspaces/${wsId}/milestones`, {
        milestoneId: mId,
        submissionUrl: submissionUrl,
        submissionNotes: submissionNotes
      });
      // Reload workspaces
      const wsRes = await api.get('/workspaces');
      setWorkspaces(wsRes.data || []);
      setSubmissionUrl('');
      setSubmissionNotes('');
      setSubmittingMilestoneId(null);
      alert('Proof of Work submitted successfully!');
    } catch (err) {
      console.warn('Milestone submission failed:', err.message);
      alert(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmissionLoading(false);
    }
  };

  const handleSendWsMessage = async (wsId) => {
    if (!typedWsMessage.trim()) return;
    setChatLoading(true);
    try {
      await api.post(`/workspaces/${wsId}/messages`, { text: typedWsMessage });
      // Reload workspaces
      const wsRes = await api.get('/workspaces');
      setWorkspaces(wsRes.data || []);
      setTypedWsMessage('');
    } catch (err) {
      console.warn('WS message send failed:', err.message);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Refetch admin users when filters change
  useEffect(() => {
    if (user.role === 'admin') {
      fetchAdminUsers();
    }
  }, [userSearch, userRoleFilter, userPage]);



  const handleCreateOrUpdate = async (e, forcedStatus) => {
    if (e) e.preventDefault();
    setCreating(true);
    setError(null);
    setSaveSuccess(false);
    
    const statusToSave = forcedStatus || campaignStatus;
    
    try {
      const campaignData = {
        title,
        description,
        niche: nicheInput.split(',').map(s => s.trim()).filter(Boolean),
        targetPlatforms: platformsInput.split(',').map(s => s.trim()).filter(Boolean),
        deliverables: deliverablesInput.split(',').map(s => s.trim()).filter(Boolean),
        budget: {
          min: Number(budgetMin),
          max: Number(budgetMax)
        },
        creatorsRequired: Number(creatorsRequiredInput) || 1,
        deadline: deadlineInput || undefined,
        location: locationInput || undefined,
        requirements: requirementsInput ? requirementsInput.split(',').map(s => s.trim()).filter(Boolean) : [],
        isRemote: isRemoteInput,
        status: statusToSave,
        productName,
        paymentPerCreator: Number(paymentPerCreator) || 0,
        minFollowers: Number(minFollowers) || 0,
        minEngagementRate: Number(minEngagementRate) || 0,
        preferredCreatorCategory,
        language: campaignLanguage,
        appDeadline: appDeadline || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        submissionDeadline: submissionDeadline || undefined,
        productImages: productImages ? productImages.split(',').map(s => s.trim()).filter(Boolean) : [],
        brandGuidelines
      };

      if (editingCampaignId) {
        await api.put(`/campaigns/${editingCampaignId}`, campaignData);
      } else {
        await api.post('/campaigns', campaignData);
      }

      // Reset fields
      setTitle('');
      setDescription('');
      setBudgetMin('');
      setBudgetMax('');
      setNicheInput('');
      setPlatformsInput('');
      setDeliverablesInput('');
      setCreatorsRequiredInput(1);
      setDeadlineInput('');
      setLocationInput('');
      setRequirementsInput('');
      setIsRemoteInput(true);
      setProductName('');
      setPaymentPerCreator('');
      setMinFollowers('');
      setMinEngagementRate('');
      setPreferredCreatorCategory('');
      setCampaignLanguage('');
      setAppDeadline('');
      setStartDate('');
      setEndDate('');
      setSubmissionDeadline('');
      setProductImages('');
      setBrandGuidelines('');
      setCampaignStatus('active');
      setEditingCampaignId(null);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process campaign brief.');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    await handleCreateOrUpdate(e);
  };

  const handleUpdateStatusOnly = async (campaignId, newStatus) => {
    try {
      await api.put(`/campaigns/${campaignId}`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to update campaign status:', err.message);
      setError('Failed to update status.');
    }
  };

  const handleDeleteCampaignOnly = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await api.delete(`/campaigns/${campaignId}`);
      // If the deleted campaign was currently being inspected, clear it
      if (inspectedCampaign?._id === campaignId) {
        setInspectedCampaign(null);
        setCampaignApplicants([]);
      }
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to delete campaign:', err.message);
      setError('Failed to delete campaign.');
    }
  };

  const handleStartEditCampaign = (camp) => {
    setEditingCampaignId(camp._id);
    setTitle(camp.title || '');
    setDescription(camp.description || '');
    setBudgetMin(camp.budget?.min || '');
    setBudgetMax(camp.budget?.max || '');
    setNicheInput(camp.niche ? camp.niche.join(', ') : '');
    setPlatformsInput(camp.targetPlatforms ? camp.targetPlatforms.join(', ') : '');
    setDeliverablesInput(camp.deliverables ? camp.deliverables.join(', ') : '');
    setCreatorsRequiredInput(camp.creatorsRequired || 1);
    setDeadlineInput(camp.deadline ? camp.deadline.substring(0, 10) : '');
    setLocationInput(camp.location || '');
    setRequirementsInput(camp.requirements ? camp.requirements.join(', ') : '');
    setIsRemoteInput(camp.isRemote ?? true);
    setProductName(camp.productName || '');
    setPaymentPerCreator(camp.paymentPerCreator || '');
    setMinFollowers(camp.minFollowers || '');
    setMinEngagementRate(camp.minEngagementRate || '');
    setPreferredCreatorCategory(camp.preferredCreatorCategory || '');
    setCampaignLanguage(camp.language || '');
    setAppDeadline(camp.appDeadline ? camp.appDeadline.substring(0, 10) : '');
    setStartDate(camp.startDate ? camp.startDate.substring(0, 10) : '');
    setEndDate(camp.endDate ? camp.endDate.substring(0, 10) : '');
    setSubmissionDeadline(camp.submissionDeadline ? camp.submissionDeadline.substring(0, 10) : '');
    setProductImages(camp.productImages ? camp.productImages.join(', ') : '');
    setBrandGuidelines(camp.brandGuidelines || '');
    setCampaignStatus(camp.status || 'active');

    // Switch view parameter to 'create' brief page
    setSearchParams({ tab: 'create' });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    setError(null);
    try {
      let profileData = {
        name: profileName,
        profileImage
      };

      if (user.role === 'creator') {
        const socialChannels = [];
        if (youtubeHandle) {
          socialChannels.push({ platform: 'youtube', handle: youtubeHandle, followers: Number(youtubeFollowers) || 0 });
        }
        if (instaHandle) {
          socialChannels.push({ platform: 'instagram', handle: instaHandle, followers: Number(instaFollowers) || 0 });
        }
        if (tiktokHandle) {
          socialChannels.push({ platform: 'tiktok', handle: tiktokHandle, followers: Number(tiktokFollowers) || 0 });
        }
        profileData.creatorDetails = {
          bio: creatorBio,
          portfolioUrl: creatorPortfolio,
          niche: nicheInput.split(',').map(s => s.trim()).filter(Boolean),
          socialChannels
        };
      } else if (user.role === 'brand') {
        const socialLinks = [];
        if (brandInsta) socialLinks.push({ platform: 'instagram', handle: brandInsta });
        if (brandTwitter) socialLinks.push({ platform: 'twitter', handle: brandTwitter });
        if (brandLinkedin) socialLinks.push({ platform: 'linkedin', handle: brandLinkedin });
        if (brandFacebook) socialLinks.push({ platform: 'facebook', handle: brandFacebook });

        profileData.brandDetails = {
          companyName,
          industry: brandIndustry,
          website: brandWebsite,
          description: brandDescription,
          socialLinks,
          images: brandImages.split(',').map(s => s.trim()).filter(Boolean)
        };
      }

      if (password) {
        profileData.password = password;
      }

      await updateProfile(profileData);
      setSaveSuccess(true);
      setPassword('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    setError(null);
    try {
      const payload = {
        name: profileName,
        profileImage,
        language: lang,
        themePreference: theme,
        privacySettings: { profilePublic: profPublic },
        notificationSettings: { emailAlerts: emailAlert, inAppAlerts: inAppAlert }
      };

      if (user.role === 'creator') {
        const socialChannels = [];
        if (youtubeHandle) {
          socialChannels.push({ platform: 'youtube', handle: youtubeHandle, followers: Number(youtubeFollowers) || 0 });
        }
        if (instaHandle) {
          socialChannels.push({ platform: 'instagram', handle: instaHandle, followers: Number(instaFollowers) || 0 });
        }
        if (tiktokHandle) {
          socialChannels.push({ platform: 'tiktok', handle: tiktokHandle, followers: Number(tiktokFollowers) || 0 });
        }
        payload.creatorDetails = {
          bio: creatorBio,
          portfolioUrl: creatorPortfolio,
          niche: nicheInput ? nicheInput.split(',').map(s => s.trim()).filter(Boolean) : [],
          socialChannels
        };
      }

      if (password) {
        payload.password = password;
      }

      await updateProfile(payload);
      setSaveSuccess(true);
      setPassword('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    }
  };

  const handleDeleteAccount = async () => {
    const doubleCheck = window.confirm('WARNING: Deleting your account will suspend your campaigns, erase your settings profiles, and delete all workspaces records. Proceed?');
    if (!doubleCheck) return;

    try {
      await api.delete('/users/profile');
      logout();
    } catch (err) {
      console.warn('Failed to delete account:', err.message);
    }
  };

  const inspectCampaignApplicants = async (camp) => {
    try {
      setInspectedCampaign(camp);
      const res = await api.get(`/campaigns/${camp._id}/applications`);
      setCampaignApplicants(res.data || []);
    } catch (err) {
      console.warn('Error fetching applicants:', err.message);
    }
  };

  const handleApplicationStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}`, { status });
      if (inspectedCampaign) {
        inspectCampaignApplicants(inspectedCampaign);
      }
      fetchDashboardData();
    } catch (err) {
      console.warn('Error updating application status:', err.message);
    }
  };

  const handleStartMessagingCreator = async (creatorId, projectId, creatorName) => {
    try {
      await api.post(`/messages/thread/${projectId}`, {
        text: `Hi ${creatorName}! Let's chat about your pitch proposal for this campaign.`,
        receiverId: creatorId
      });
      const inboxRes = await api.get('/messages/inbox');
      const updatedThreads = inboxRes.data || [];
      setInboxThreads(updatedThreads);
      const matchingThread = updatedThreads.find(t => t.projectId === projectId && t.partnerId === creatorId);
      if (matchingThread) {
        selectThread(matchingThread);
      }
      setSearchParams({ tab: 'messages' });
    } catch (err) {
      console.warn('Failed to start chat thread:', err.message);
      setError('Failed to open message thread.');
    }
  };

  const handleInviteToAnotherCampaign = async (creatorId, targetCampaignId, campaignTitle) => {
    try {
      await api.post(`/campaigns/${targetCampaignId}/invite`, { creatorId });
      alert(`Invitation sent successfully to creator for: "${campaignTitle}"`);
    } catch (err) {
      console.warn('Failed to invite creator to campaign:', err.message);
      setError('Failed to send campaign invitation.');
    }
  };

  const handleApproveSubmission = async (wsId, mId) => {
    try {
      await api.patch(`/workspaces/${wsId}/milestones/${mId}/approve`);
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to approve deliverable submission:', err.message);
    }
  };

  const handleRequestChanges = async (wsId, mId, feedbackNotes) => {
    try {
      await api.patch(`/workspaces/${wsId}/milestones/${mId}/request-changes`, { feedbackNotes });
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to request changes:', err.message);
    }
  };

  const handleMarkWorkspaceCompleted = async (wsId) => {
    try {
      await api.patch(`/workspaces/${wsId}/complete`);
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to mark workspace completed:', err.message);
    }
  };

  const handleMarkPaymentPaid = async (wsId) => {
    try {
      await api.patch(`/workspaces/${wsId}/pay`);
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to mark payment paid:', err.message);
    }
  };

  const calculateMatchScore = (campaign, profile) => {
    if (!campaign || !profile) return 75;
    let score = 50;
    if (campaign.niche && profile.niche) {
      const commonNiches = campaign.niche.filter(n => 
        profile.niche.some(pn => pn.toLowerCase().trim() === n.toLowerCase().trim())
      );
      if (commonNiches.length > 0) score += 20;
    }
    if (campaign.targetPlatforms && (profile.primaryPlatform || profile.socialChannels)) {
      const platforms = campaign.targetPlatforms.map(p => p.toLowerCase().trim());
      const primary = profile.primaryPlatform?.toLowerCase().trim();
      const hasPlatform = platforms.includes(primary) || 
        profile.socialChannels?.some(sc => platforms.includes(sc.platform.toLowerCase().trim()));
      if (hasPlatform) score += 20;
    }
    if (campaign.minFollowers && profile.followersCount) {
      if (profile.followersCount >= campaign.minFollowers) {
        score += 10;
      } else {
        score += Math.round((profile.followersCount / campaign.minFollowers) * 10);
      }
    }
    return Math.min(score, 100);
  };

  // NOTIFICATION UTILS
  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      const notifRes = await api.get('/notifications');
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.warn('Failed to mark read:', err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      const notifRes = await api.get('/notifications');
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.warn('Failed to mark all read:', err.message);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      const notifRes = await api.get('/notifications');
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.warn('Failed to delete notification:', err.message);
    }
  };

  // CHAT ACTIONS
  const selectThread = (thread) => {
    setActiveThread(thread);
    fetchChatMessages(thread.projectId);
    setMobileShowChat(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeThread) return;
    if (!typedMessage && !attachUrl) return;

    try {
      const msgBody = {
        text: typedMessage,
        receiverId: activeThread.partnerId,
        attachments: attachUrl ? [attachUrl] : []
      };

      await api.post(`/messages/thread/${activeThread.projectId}`, msgBody);
      setTypedMessage('');
      setAttachUrl('');
      fetchChatMessages(activeThread.projectId);
    } catch (err) {
      console.warn('Message send failed:', err.message);
    }
  };

  const handleAppendEmoji = (emoji) => {
    setTypedMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleUserInputChange = (e) => {
    setTypedMessage(e.target.value);
    // Simulate typing indicator trigger
    if (!partnerTyping) {
      setPartnerTyping(true);
      setTimeout(() => setPartnerTyping(false), 2000);
    }
  };

  // ADMIN OPERATIONS
  const handleUpdateUserRole = async (e) => {
    e.preventDefault();
    if (!selectedUserForRole) return;
    try {
      await api.put(`/admin/users/${selectedUserForRole._id}/role`, { role: newRole });
      setSelectedUserForRole(null);
      fetchAdminUsers();
      fetchDashboardData();
    } catch (err) {
      console.warn('Error updating user role:', err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend and delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchAdminUsers();
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleDeleteProject = async (projId) => {
    if (!window.confirm('Are you sure you want to delete this campaign brief for moderation?')) return;
    try {
      await api.delete(`/admin/projects/${projId}`);
      const projRes = await api.get('/campaigns');
      setCampaigns(projRes.data || []);
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to moderate project:', err.message);
    }
  };

  const handleUpdateReportStatus = async (repId, status) => {
    try {
      await api.put(`/admin/reports/${repId}`, { status });
      const reportsRes = await api.get('/admin/reports');
      setAdminReports(reportsRes.data || []);
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to resolve report:', err.message);
    }
  };

  // SETTINGS PANEL UI RENDERER
  // ACCOUNT & PROFILE SETTINGS LAYOUT
  const renderSettingsLayout = () => {
    return (
      <form onSubmit={handleSaveSettings} className="animate-fade-in-up" style={{ maxWidth: '920px', margin: '0 auto' }}>
        {/* Header Title Card */}
        <div style={{
          padding: '28px', borderRadius: '20px', background: '#ffffff',
          border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
          marginBottom: '24px'
        }}>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                  Account Settings &amp; Profile Preferences
                </h3>
                <span style={{
                  padding: '4px 12px', background: '#ecfdf5', color: '#047857',
                  border: '1.5px solid #a7f3d0', borderRadius: '9999px',
                  fontSize: '0.78rem', fontWeight: 900
                }}>
                  ● Verified Account
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '6px 0 0 0', fontWeight: 500 }}>
                Configure your public profile credentials, system language, theme mode, security settings, and connected channels.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.88rem', fontWeight: 800, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div style={{
            color: '#047857', background: '#ecfdf5', border: '1.5px solid #a7f3d0',
            padding: '14px 20px', borderRadius: '14px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700
          }}>
            <CheckCircle2 size={20} />
            <span>Settings and preferences successfully updated!</span>
          </div>
        )}

        {/* Error Alert Banner */}
        {error && (
          <div style={{
            color: '#b91c1c', background: '#fef2f2', border: '1.5px solid #fecaca',
            padding: '14px 20px', borderRadius: '14px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Profile & Theme Cards */}
        <div className="row g-4 mb-4">
          {/* Card 1: Edit Profile */}
          <div className="col-12 col-md-6">
            <div style={{
              padding: '24px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
              height: '100%'
            }}>
              <h4 style={{ fontWeight: 900, marginBottom: '20px', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCircle size={18} style={{ color: 'var(--primary)' }} /> Personal Profile Info
              </h4>
              
              <div className="form-group mb-3">
                <label className="form-label" style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  style={{ marginBottom: 0, border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem' }}
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label" style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>Email Address (Account ID)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    value={user?.email || ''}
                    disabled
                    style={{ marginBottom: 0, background: '#f1f5f9', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                  />
                  <Lock size={14} style={{ position: 'absolute', right: '14px', top: '14px', color: '#94a3b8' }} />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label" style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>Profile Avatar Image Link</label>
                <div className="d-flex gap-2 align-items-center">
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--border-color)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, border: '2px solid var(--primary)' }}>
                    {profileImage ? <img src={profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : profileName?.substring(0, 2).toUpperCase()}
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    style={{ marginBottom: 0, border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.88rem', flex: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Theme & Preferences */}
          <div className="col-12 col-md-6">
            <div style={{
              padding: '24px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
              height: '100%'
            }}>
              <h4 style={{ fontWeight: 900, marginBottom: '20px', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} style={{ color: 'var(--secondary-hover)' }} /> Regional &amp; Localization
              </h4>

              <div className="form-group mb-0">
                <label className="form-label" style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>System Language</label>
                <select
                  className="form-select form-input"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  style={{ marginBottom: 0, border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem' }}
                >
                  <option value="en">English (US)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Security & Notifications Cards */}
        <div className="row g-4 mb-4">
          {/* Card 3: Change Password */}
          <div className="col-12 col-md-6">
            <div style={{
              padding: '24px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
              height: '100%'
            }}>
              <h4 style={{ fontWeight: 900, marginBottom: '20px', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} style={{ color: '#b45309' }} /> Security &amp; Credentials
              </h4>

              <div className="form-group mb-0">
                <label className="form-label" style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  style={{ marginBottom: 0, border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem' }}
                />
                <small style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                  Leave blank to keep your current password unchanged.
                </small>
              </div>
            </div>
          </div>

          {/* Card 4: Privacy & Notifications */}
          <div className="col-12 col-md-6">
            <div style={{
              padding: '24px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
              height: '100%'
            }}>
              <h4 style={{ fontWeight: 900, marginBottom: '20px', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} style={{ color: '#047857' }} /> Privacy &amp; Notification Preferences
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: '10px', border: '1.5px solid var(--border-color)', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>Public Profile Visibility</span>
                  <input type="checkbox" checked={profPublic} onChange={(e) => setProfPublic(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: '10px', border: '1.5px solid var(--border-color)', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>Email Notification Alerts</span>
                  <input type="checkbox" checked={emailAlert} onChange={(e) => setEmailAlert(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: '10px', border: '1.5px solid var(--border-color)', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>In-App Activity System Alerts</span>
                  <input type="checkbox" checked={inAppAlert} onChange={(e) => setInAppAlert(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Creator Social Channels Card (Creators Only) */}
        {user.role === 'creator' && (
          <div style={{
            padding: '28px', borderRadius: '20px', background: '#ffffff',
            border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontWeight: 900, marginBottom: '20px', fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} style={{ color: 'var(--primary)' }} /> Connected Social Media Channels
            </h4>

            <div className="row g-3">
              {/* YouTube */}
              <div className="col-12 col-md-4">
                <div style={{ padding: '18px', background: '#fef2f2', borderRadius: '14px', border: '1.5px solid #fecaca' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Youtube size={16} /> YOUTUBE CHANNEL
                  </span>
                  <div className="form-group mt-3 mb-2">
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>Handle</label>
                    <input type="text" className="form-input" value={youtubeHandle} onChange={(e) => setYoutubeHandle(e.target.value)} placeholder="@channelhandle" style={{ fontSize: '0.82rem', padding: '8px 12px', marginBottom: 0, border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>Subscribers</label>
                    <input type="number" className="form-input" value={youtubeFollowers} onChange={(e) => setYoutubeFollowers(e.target.value)} placeholder="e.g. 450000" style={{ fontSize: '0.82rem', padding: '8px 12px', marginBottom: 0, border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="col-12 col-md-4">
                <div style={{ padding: '18px', background: '#fdf2f8', borderRadius: '14px', border: '1.5px solid #fbcfe8' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#db2777', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Instagram size={16} /> INSTAGRAM HANDLE
                  </span>
                  <div className="form-group mt-3 mb-2">
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>Username</label>
                    <input type="text" className="form-input" value={instaHandle} onChange={(e) => setInstaHandle(e.target.value)} placeholder="username" style={{ fontSize: '0.82rem', padding: '8px 12px', marginBottom: 0, border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>Followers</label>
                    <input type="number" className="form-input" value={instaFollowers} onChange={(e) => setInstaFollowers(e.target.value)} placeholder="e.g. 280000" style={{ fontSize: '0.82rem', padding: '8px 12px', marginBottom: 0, border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                  </div>
                </div>
              </div>

              {/* TikTok / Twitter */}
              <div className="col-12 col-md-4">
                <div style={{ padding: '18px', background: 'var(--bg-tertiary)', borderRadius: '14px', border: '1.5px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={16} /> TIKTOK / X HANDLE
                  </span>
                  <div className="form-group mt-3 mb-2">
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>Username</label>
                    <input type="text" className="form-input" value={tiktokHandle} onChange={(e) => setTiktokHandle(e.target.value)} placeholder="username" style={{ fontSize: '0.82rem', padding: '8px 12px', marginBottom: 0, border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>Followers</label>
                    <input type="number" className="form-input" value={tiktokFollowers} onChange={(e) => setTiktokFollowers(e.target.value)} placeholder="e.g. 150000" style={{ fontSize: '0.82rem', padding: '8px 12px', marginBottom: 0, border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Settings & Delete Account Action Footer */}
        <div style={{
          padding: '24px 28px', borderRadius: '20px', background: '#ffffff',
          border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
        }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.92rem', fontWeight: 800, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={18} /> Save Profile &amp; Preferences
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            style={{
              padding: '12px 20px', fontSize: '0.88rem', fontWeight: 800, borderRadius: '10px',
              background: '#fef2f2', color: '#b91c1c', border: '1.5px solid #fecaca', cursor: 'pointer'
            }}
          >
            Delete Account Profile
          </button>
        </div>
      </form>
    );
  };

  // ANALYTICS CHART BUILDERS
  // COMPANY & CREATOR ANALYTICS LAYOUT
  const renderAnalyticsLayout = () => {
    // ────────────────────────────────────────────────────────
    // BRAND / COMPANY ROLE ANALYTICS
    // ────────────────────────────────────────────────────────
    if (user.role === 'brand') {
      const totalCampaigns = campaigns.length;
      const activeCampaigns = campaigns.filter(c => c.status === 'published' || c.status === 'active').length;
      const completedCampaigns = campaigns.filter(c => c.status === 'completed').length || workspaces.filter(w => w.status === 'completed').length;
      const totalApps = applications.length;
      const acceptedApps = applications.filter(a => a.status === 'accepted' || a.status === 'approved' || a.status === 'shortlisted').length;
      const acceptanceRate = totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 38;

      const totalBudgetAllocated = campaigns.reduce((acc, c) => {
        const val = typeof c.budget === 'object' ? (c.budget?.max || c.budget?.min || 250000) : (Number(c.budget) || 250000);
        return acc + val;
      }, 0) || 1500000;

      const totalSpent = workspaces
        .filter(w => w.status === 'completed' || w.paymentStatus === 'paid' || w.status === 'active')
        .reduce((acc, w) => acc + (w.proposedRate || w.agreedRate || 350000), 0) || 975000;

      const budgetUtilRate = Math.min(100, Math.round((totalSpent / totalBudgetAllocated) * 100));
      const avgRating = 4.9;

      // Chart 1: Monthly Campaign Statistics
      const monthlyStatsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Applications Received',
            data: [12, 19, 24, 32, 28, 45, totalApps > 0 ? totalApps : 52],
            borderColor: 'var(--secondary-hover)',
            backgroundColor: 'rgba(var(--secondary-rgb), 0.12)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Campaigns Created',
            data: [2, 4, 3, 6, 5, 8, totalCampaigns > 0 ? totalCampaigns : 10],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
          }
        ]
      };

      // Chart 2: Budget Utilization & Payouts per Campaign
      const campLabels = campaigns.slice(0, 5).map(c => c.title?.substring(0, 14) || 'Campaign');
      const campBudgets = campaigns.slice(0, 5).map(c => typeof c.budget === 'object' ? (c.budget?.max || 350000) : (Number(c.budget) || 350000));
      
      const budgetPerfData = {
        labels: campLabels.length > 0 ? campLabels : ['boAt ANC', 'CRED Summer', 'Mamaearth Glow', 'Zomato Gold'],
        datasets: [
          {
            label: 'Allocated Budget ($)',
            data: campBudgets.length > 0 ? campBudgets : [600000, 1000000, 450000, 300000],
            backgroundColor: 'var(--primary)',
            borderRadius: 8
          },
          {
            label: 'Committed Payouts ($)',
            data: campBudgets.length > 0 ? campBudgets.map(b => Math.round(b * 0.75)) : [450000, 700000, 275000, 200000],
            backgroundColor: '#10b981',
            borderRadius: 8
          }
        ]
      };

      return (
        <div className="animate-fade-in-up">
          {/* Header Title Banner */}
          <div style={{
            padding: '24px 28px', borderRadius: '20px', background: '#ffffff',
            border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
            marginBottom: '24px'
          }}>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                  Company Analytics &amp; Campaign ROI Performance
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '6px 0 0 0', fontWeight: 500 }}>
                  Real-time reporting on campaign expenditure, pitch conversion metrics, creator engagement, and budget utilization.
                </p>
              </div>
              <span style={{
                padding: '6px 16px', background: '#ecfdf5', color: '#047857',
                border: '1.5px solid #a7f3d0', borderRadius: '9999px',
                fontSize: '0.8rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px'
              }}>
                🟢 Live Real-Time Data
              </span>
            </div>
          </div>

          {/* 6 Key Performance Stat Cards */}
          <div className="row g-3 mb-4">
            {/* Card 1: Total Campaigns */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div style={{
                padding: '20px', borderRadius: '16px', background: '#ffffff',
                border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
                height: '100%', transition: 'all 0.2s ease'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  CAMPAIGNS
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                  {totalCampaigns}
                </h3>
                <small style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>{activeCampaigns} Active Briefs</small>
              </div>
            </div>

            {/* Card 2: Applications Received */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div style={{
                padding: '20px', borderRadius: '16px', background: '#ffffff',
                border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
                height: '100%', transition: 'all 0.2s ease'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--secondary-hover)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  PITCHES
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                  {totalApps}
                </h3>
                <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Pitches received</small>
              </div>
            </div>

            {/* Card 3: Acceptance Rate */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div style={{
                padding: '20px', borderRadius: '16px', background: '#ffffff',
                border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
                height: '100%', transition: 'all 0.2s ease'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#047857', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  ACCEPTANCE
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#047857', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                  {acceptanceRate}%
                </h3>
                <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{acceptedApps} Approved</small>
              </div>
            </div>

            {/* Card 4: Budget Utilization */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div style={{
                padding: '20px', borderRadius: '16px', background: '#ffffff',
                border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
                height: '100%', transition: 'all 0.2s ease'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#b45309', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  BUDGET USED
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#b45309', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                  {budgetUtilRate}%
                </h3>
                <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>${totalSpent.toLocaleString()}</small>
              </div>
            </div>

            {/* Card 5: Completed Projects */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div style={{
                padding: '20px', borderRadius: '16px', background: '#ffffff',
                border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
                height: '100%', transition: 'all 0.2s ease'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#0369a1', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  COMPLETED
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0369a1', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                  {completedCampaigns}
                </h3>
                <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Finalized projects</small>
              </div>
            </div>

            {/* Card 6: Average Brand Rating */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div style={{
                padding: '20px', borderRadius: '16px', background: '#ffffff',
                border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
                height: '100%', transition: 'all 0.2s ease'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  BRAND RATING
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                  {avgRating} ⭐
                </h3>
                <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Overall score</small>
              </div>
            </div>
          </div>

          {/* Creator Performance Metrics Grid */}
          <div style={{
            padding: '24px 28px', borderRadius: '20px', background: '#ffffff',
            border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: 'var(--primary)' }} /> Creator Network Engagement Benchmarks
            </h4>
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '14px', border: '1.5px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>AVERAGE REACH</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>1.45M</span>
                  <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 800, display: 'block', marginTop: '4px' }}>↑ +14.2% vs last quarter</span>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '14px', border: '1.5px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>AVG ENGAGEMENT RATE</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)' }}>6.82%</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, display: 'block', marginTop: '4px' }}>High industry benchmark</span>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '14px', border: '1.5px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>ON-TIME DELIVERY</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#047857' }}>98.8%</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginTop: '4px' }}>Milestone deadlines met</span>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '14px', border: '1.5px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>REPEAT COLLABORATORS</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0369a1' }}>5 Creators</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginTop: '4px' }}>High partner retention</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-lg-6">
              <div style={{
                padding: '24px', borderRadius: '20px', background: '#ffffff',
                border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
                height: '100%'
              }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Monthly Applications &amp; Campaign Growth
                </h4>
                <div style={{ height: '270px', position: 'relative' }}>
                  <LineChart data={monthlyStatsData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div style={{
                padding: '24px', borderRadius: '20px', background: '#ffffff',
                border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
                height: '100%'
              }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Allocated Budget vs Committed Payouts ($)
                </h4>
                <div style={{ height: '270px', position: 'relative' }}>
                  <BarChart data={budgetPerfData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ────────────────────────────────────────────────────────
    // CREATOR ROLE ANALYTICS
    // ────────────────────────────────────────────────────────
    const creatorWorkspaces = workspaces;
    const completedWs = creatorWorkspaces.filter(w => w.status === 'completed');
    const activeWs = creatorWorkspaces.filter(w => w.status === 'active');
    
    const totalEarnings = completedWs.reduce((acc, w) => acc + (w.proposedRate || w.agreedRate || 0), 0);
    const activeCommittedValue = activeWs.reduce((acc, w) => acc + (w.proposedRate || w.agreedRate || 0), 0);
    const totalPitches = applications.length;
    const approvedPitches = applications.filter(a => a.status === 'approved' || a.status === 'shortlisted' || a.status === 'accepted').length;
    const pitchAcceptanceRate = totalPitches > 0 ? Math.round((approvedPitches / totalPitches) * 100) : 85;
    const avgDealSize = (completedWs.length + activeWs.length) > 0 
      ? Math.round((totalEarnings + activeCommittedValue) / (completedWs.length + activeWs.length))
      : 350000;

    // Creator Charts Data
    const revenueTrendData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Sponsorship Income (₹)',
          data: [150000, 280000, 350000, 420000, 550000, 700000, totalEarnings > 0 ? totalEarnings : 850000],
          borderColor: '#047857',
          backgroundColor: 'rgba(4, 120, 87, 0.12)',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }
      ]
    };

    const pitchPerfData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Pitches Sent',
          data: [2, 3, 5, 4, 6, 5, totalPitches > 0 ? totalPitches : 7],
          backgroundColor: 'var(--primary)',
          borderRadius: 8
        },
        {
          label: 'Pitches Approved',
          data: [2, 2, 4, 3, 5, 4, approvedPitches > 0 ? approvedPitches : 6],
          backgroundColor: '#10b981',
          borderRadius: 8
        }
      ]
    };

    const platformDistributionData = {
      labels: ['YouTube Vlogs & Shorts', 'Instagram Reels & Stories', 'Twitter / X Threads'],
      datasets: [
        {
          data: [55, 35, 10],
          backgroundColor: ['var(--danger)', 'var(--secondary)', '#1d9bf0'],
          borderColor: '#ffffff',
          borderWidth: 2
        }
      ]
    };

    const audienceReachData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Total Monthly Channel Views / Reach',
          data: [1200000, 1800000, 2400000, 3100000, 4200000, 5500000, 6800000],
          borderColor: 'var(--primary)',
          backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
          borderWidth: 3,
          tension: 0.3,
          fill: true
        }
      ]
    };

    return (
      <div className="animate-fade-in-up">
        {/* Header Title Banner */}
        <div style={{
          padding: '24px 28px', borderRadius: '20px', background: '#ffffff',
          border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
          marginBottom: '24px'
        }}>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                Creator Performance &amp; Revenue Analytics
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '6px 0 0 0', fontWeight: 500 }}>
                Real-time earnings reporting, sponsorship pitch conversion metrics, audience reach index, and campaign history.
              </p>
            </div>
            <span style={{
              padding: '6px 16px', background: '#ecfdf5', color: '#047857',
              border: '1.5px solid #a7f3d0', borderRadius: '9999px',
              fontSize: '0.8rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px'
            }}>
              ⭐ Top Verified Creator
            </span>
          </div>
        </div>

        {/* 6 Key Performance Stat Cards */}
        <div className="row g-3 mb-4">
          {/* Card 1: Total Completed Earnings */}
          <div className="col-12 col-sm-6 col-lg-2">
            <div style={{
              padding: '20px', borderRadius: '16px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
              height: '100%', transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#047857', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                TOTAL EARNED
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#047857', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                ₹{totalEarnings.toLocaleString()}
              </h3>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{completedWs.length} Paid Projects</small>
            </div>
          </div>

          {/* Card 2: Active Workspace Value */}
          <div className="col-12 col-sm-6 col-lg-2">
            <div style={{
              padding: '20px', borderRadius: '16px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
              height: '100%', transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                ACTIVE ESCROW
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                ₹{activeCommittedValue.toLocaleString()}
              </h3>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{activeWs.length} Active Deals</small>
            </div>
          </div>

          {/* Card 3: Pitches Submitted */}
          <div className="col-12 col-sm-6 col-lg-2">
            <div style={{
              padding: '20px', borderRadius: '16px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
              height: '100%', transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--secondary-hover)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                PITCHES SENT
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                {totalPitches}
              </h3>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Applications sent</small>
            </div>
          </div>

          {/* Card 4: Pitch Acceptance Rate */}
          <div className="col-12 col-sm-6 col-lg-2">
            <div style={{
              padding: '20px', borderRadius: '16px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
              height: '100%', transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#047857', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                ACCEPTANCE
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#047857', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                {pitchAcceptanceRate}%
              </h3>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{approvedPitches} Approved</small>
            </div>
          </div>

          {/* Card 5: Average Deal Size */}
          <div className="col-12 col-sm-6 col-lg-2">
            <div style={{
              padding: '20px', borderRadius: '16px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
              height: '100%', transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#b45309', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                AVG DEAL SIZE
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b45309', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                ₹{avgDealSize.toLocaleString()}
              </h3>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Per deal average</small>
            </div>
          </div>

          {/* Card 6: Creator Star Rating */}
          <div className="col-12 col-sm-6 col-lg-2">
            <div style={{
              padding: '20px', borderRadius: '16px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)',
              height: '100%', transition: 'all 0.2s ease'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                RATING SCORE
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                4.9 ⭐
              </h3>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Partner reviews</small>
            </div>
          </div>
        </div>

        {/* Creator Channel Benchmarks Section */}
        <div style={{
          padding: '24px 28px', borderRadius: '20px', background: '#ffffff',
          border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} /> Audience Engagement &amp; Channel Delivery Index
          </h4>
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-md-3">
              <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '14px', border: '1.5px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>MONTHLY REACH</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>6.8M Views</span>
                <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 800, display: 'block', marginTop: '4px' }}>↑ +18.4% growth</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '14px', border: '1.5px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>AVG ENGAGEMENT RATE</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)' }}>7.4%</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, display: 'block', marginTop: '4px' }}>Top 5% creator benchmark</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '14px', border: '1.5px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>ON-TIME MILESTONES</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#047857' }}>100%</span>
                <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 800, display: 'block', marginTop: '4px' }}>Zero delayed deadlines</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '14px', border: '1.5px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>REPEAT BRAND SPONSORS</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0369a1' }}>4 Brands</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginTop: '4px' }}>High sponsor satisfaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive Charts Grid */}
        <div className="row g-4 mb-4">
          {/* Chart 1: Revenue Growth */}
          <div className="col-12 col-lg-6">
            <div style={{
              padding: '24px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
              height: '100%'
            }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Sponsorship Revenue Growth (₹)
              </h4>
              <div style={{ height: '250px', position: 'relative' }}>
                <LineChart data={revenueTrendData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Chart 2: Pitches Submitted vs Approved */}
          <div className="col-12 col-lg-6">
            <div style={{
              padding: '24px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
              height: '100%'
            }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Pitches Sent vs Proposals Approved
              </h4>
              <div style={{ height: '250px', position: 'relative' }}>
                <BarChart data={pitchPerfData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Chart 3: Platform Income Share */}
          <div className="col-12 col-lg-6">
            <div style={{
              padding: '24px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
              height: '100%'
            }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Platform Revenue Distribution Share
              </h4>
              <div style={{ height: '250px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <DoughnutChart data={platformDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Chart 4: Audience Reach Growth */}
          <div className="col-12 col-lg-6">
            <div style={{
              padding: '24px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
              height: '100%'
            }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Audience Channel Reach Growth Index
              </h4>
              <div style={{ height: '250px', position: 'relative' }}>
                <LineChart data={audienceReachData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>

        {/* Creator Sponsorships History Table */}
        <div style={{
          padding: '24px 28px', borderRadius: '20px', background: '#ffffff',
          border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} style={{ color: 'var(--primary)' }} /> Sponsorship Workspace Performance Summary
            </h4>
            <Link to="/dashboard?tab=collaborations" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem', fontWeight: 800 }}>
              View All Collaborations
            </Link>
          </div>

          {creatorWorkspaces.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '30px' }}>
              No active or completed sponsorship workspaces found.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0" style={{ background: 'transparent' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '12px 16px' }}>BRAND PARTNER</th>
                    <th style={{ padding: '12px 16px' }}>CAMPAIGN TITLE</th>
                    <th style={{ padding: '12px 16px' }}>AGREED RATE</th>
                    <th style={{ padding: '12px 16px' }}>MILESTONES</th>
                    <th style={{ padding: '12px 16px' }}>STATUS</th>
                    <th style={{ padding: '12px 16px' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {creatorWorkspaces.slice(0, 5).map((ws) => {
                    const brand = ws.brandId || {};
                    const proj = ws.projectId || {};
                    const isCompleted = ws.status === 'completed';

                    return (
                      <tr key={ws._id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '8px',
                              background: 'var(--primary)', color: '#ffffff', fontWeight: 900,
                              fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              {brand.profileImage
                                ? <img src={brand.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} alt="" />
                                : (brand.name ? brand.name.substring(0, 2).toUpperCase() : 'CS')
                              }
                            </div>
                            <span>{brand.name || 'Brand Partner'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--text-primary)' }}>{proj.title || 'Sponsorship'}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 900, color: '#047857' }}>
                          ₹{(ws.proposedRate || ws.agreedRate || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#475569' }}>
                          {ws.milestones?.length || 0} Milestones
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 900,
                            background: isCompleted ? '#ecfdf5' : '#f5e9e6',
                            color: isCompleted ? '#047857' : 'var(--primary)',
                            border: isCompleted ? '1px solid #a7f3d0' : '1px solid #bfdbfe'
                          }}>
                            {isCompleted ? '🏆 Completed' : '🟢 Active'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <Link
                            to={`/workspaces/${ws._id}`}
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 800, borderRadius: '8px' }}
                          >
                            Open Workspace
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // RENDER DYNAMIC CREATOR CONTENT TABS
  const renderCreatorTab = () => {
    switch (currentTab) {
      case 'dashboard': {
        const activeCampaignsCount = workspaces.filter(w => w.status === 'active').length;
        const pendingAppsCount = applications.filter(a => a.status === 'pending').length;
        const acceptedAppsCount = applications.filter(a => a.status === 'approved' || a.status === 'shortlisted').length;
        const completedCampaignsCount = workspaces.filter(w => w.status === 'completed').length;
        const totalEarningsVal = workspaces
          .filter(w => w.status === 'completed')
          .reduce((acc, curr) => acc + (curr.proposedRate || 1500), 0) || 2450;
        const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
        const totalUnreadMessages = inboxThreads.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

        // Compute upcoming deadlines
        const upcomingDeadlinesList = workspaces
          .filter(w => w.status === 'active')
          .reduce((acc, w) => {
            const ms = w.milestones
              .filter(m => m.status !== 'approved' && m.dueDate)
              .map(m => ({
                ...m,
                workspaceId: w._id,
                projectTitle: w.projectId?.title || 'Collaboration'
              }));
            return [...acc, ...ms];
          }, [])
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        const upcomingDeadlinesCount = upcomingDeadlinesList.length;

        // Recommendations (invitations) matching creator niche
        const creatorNiches = user.creatorDetails?.niche || [];
        const invitations = campaigns
          .filter(c => c.niche?.some(n => creatorNiches.some(cn => cn.toLowerCase() === n.toLowerCase())))
          .slice(0, 5);
        const displayInvitations = invitations.length > 0 ? invitations : campaigns.slice(0, 5);

        const recentApplications = [...applications]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        const recentMessages = inboxThreads.slice(0, 5);
        const displayDeadlines = upcomingDeadlinesList.slice(0, 5);
        const displayNotifications = notifications.slice(0, 5);

        // Profile Completion Progress Index
        let completionScore = 0;
        let completionBreakdown = [];
        if (user.name) { completionScore += 15; completionBreakdown.push("Name"); }
        if (user.profileImage) { completionScore += 15; completionBreakdown.push("Avatar"); }
        if (user.creatorDetails?.bio) { completionScore += 20; completionBreakdown.push("Biography"); }
        if (user.creatorDetails?.niche?.length > 0) { completionScore += 15; completionBreakdown.push("Niche Categories"); }
        if (user.creatorDetails?.skills?.length > 0) { completionScore += 10; completionBreakdown.push("Skills tags"); }
        if (user.creatorDetails?.socialChannels?.length > 0) { completionScore += 15; completionBreakdown.push("Social Channels"); }
        if (user.creatorDetails?.experience?.length > 0) { completionScore += 10; completionBreakdown.push("Work History"); }
        const profileCompletionPct = Math.min(completionScore, 100);

        // Chronological timeline
        const timelineEvents = [
          ...notifications.map(n => ({
            title: n.title,
            description: n.body,
            date: n.createdAt,
            type: 'notification'
          })),
          ...applications.map(a => ({
            title: `Applied to: ${a.campaignId?.title || a.projectId?.title || 'Campaign Brief'}`,
            description: `Pitch: "${a.pitch?.substring(0, 60)}..." | Proposed Rate: $${a.proposedRate}`,
            date: a.createdAt,
            type: 'application'
          }))
        ]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);

        return (
          <div className="animate-fade-in-up container-fluid px-0">
            {/* 8 Overview cards */}
            <div className="row g-4 gy-4" style={{ rowGap: '28px', marginBottom: '44px' }}>
              
              {/* Card 1: Active Campaigns */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '24px 26px', background: '#ffffff', border: '1.5px solid var(--border-color)', borderRadius: '16px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center" style={{ gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>ACTIVE CAMPAIGNS</span>
                      <h3 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>{activeCampaignsCount}</h3>
                      <small style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '4px', display: 'block' }}>Ongoing projects</small>
                    </div>
                    <div style={{ background: '#f5e9e6', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe', flexShrink: 0 }}>
                      <Briefcase size={22} style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Pending Applications */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '24px 26px', background: '#ffffff', border: '1.5px solid var(--border-color)', borderRadius: '16px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center" style={{ gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--warning)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>PENDING PITCHES</span>
                      <h3 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--warning)', fontFamily: "'Playfair Display', var(--font-sans)" }}>{pendingAppsCount}</h3>
                      <small style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '4px', display: 'block' }}>Awaiting review</small>
                    </div>
                    <div style={{ background: '#fffbe8', padding: '12px', borderRadius: '12px', border: '1px solid #fef3c7', flexShrink: 0 }}>
                      <Clock size={22} style={{ color: 'var(--warning)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Accepted Applications */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '24px 26px', background: '#ffffff', border: '1.5px solid var(--border-color)', borderRadius: '16px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center" style={{ gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>ACCEPTED PITCHES</span>
                      <h3 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--secondary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>{acceptedAppsCount}</h3>
                      <small style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '4px', display: 'block' }}>Hired / approved</small>
                    </div>
                    <div style={{ background: '#f5e9e6', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe', flexShrink: 0 }}>
                      <CheckCircle2 size={22} style={{ color: 'var(--secondary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Completed Campaigns */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '24px 26px', background: '#ffffff', border: '1.5px solid var(--border-color)', borderRadius: '16px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center" style={{ gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>COMPLETED</span>
                      <h3 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>{completedCampaignsCount}</h3>
                      <small style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '4px', display: 'block' }}>Successfully closed</small>
                    </div>
                    <div style={{ background: '#f5e9e6', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe', flexShrink: 0 }}>
                      <CheckSquare size={22} style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Total Earnings */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '24px 26px', background: '#ffffff', border: '1.5px solid var(--border-color)', borderRadius: '16px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center" style={{ gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>TOTAL EARNINGS</span>
                      <h3 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>₹{totalEarningsVal.toLocaleString()}</h3>
                      <small style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '4px', display: 'block' }}>Platform payouts</small>
                    </div>
                    <div style={{ background: '#f5e9e6', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe', flexShrink: 0 }}>
                      <DollarSign size={22} style={{ color: 'var(--secondary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 6: Notifications Alert */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '24px 26px', background: '#ffffff', border: '1.5px solid var(--border-color)', borderRadius: '16px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center" style={{ gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>NOTIFICATIONS</span>
                      <h3 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: unreadNotificationsCount > 0 ? 'var(--warning)' : 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>{unreadNotificationsCount}</h3>
                      <small style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '4px', display: 'block' }}>Unread alerts</small>
                    </div>
                    <div style={{ background: '#f5e9e6', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe', flexShrink: 0 }}>
                      <Bell size={22} style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 7: Direct Messages */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '24px 26px', background: '#ffffff', border: '1.5px solid var(--border-color)', borderRadius: '16px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center" style={{ gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>MESSAGES</span>
                      <h3 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--secondary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>{totalUnreadMessages}</h3>
                      <small style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '4px', display: 'block' }}>Unread texts</small>
                    </div>
                    <div style={{ background: '#f5e9e6', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe', flexShrink: 0 }}>
                      <MessageSquare size={22} style={{ color: 'var(--secondary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 8: Milestones Pending */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '24px 26px', background: '#ffffff', border: '1.5px solid var(--border-color)', borderRadius: '16px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center" style={{ gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>DEADLINES</span>
                      <h3 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>{upcomingDeadlinesCount}</h3>
                      <small style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '4px', display: 'block' }}>Pending milestones</small>
                    </div>
                    <div style={{ background: '#f5e9e6', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe', flexShrink: 0 }}>
                      <Calendar size={22} style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 1. Full-Width Parallel Quick Actions Bar */}
            <div style={{
              padding: '24px 28px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
              marginBottom: '28px'
            }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                Quick Actions Workspace Navigation
              </h4>
              <div className="row g-3">
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to="/discover" style={{
                    padding: '14px 18px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary-hover) 100%)',
                    color: '#ffffff', fontWeight: 800, fontSize: '0.88rem', borderRadius: '12px',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    boxShadow: '0 4px 14px rgba(var(--secondary-rgb), 0.25)', transition: 'all 0.2s ease', width: '100%'
                  }}>
                    <Compass size={18} /> Discover Briefs
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to="/dashboard/profile" style={{
                    padding: '14px 18px', background: 'var(--bg-tertiary)', color: 'var(--primary)',
                    border: '1.5px solid var(--border-color)', fontWeight: 800, fontSize: '0.88rem',
                    borderRadius: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'all 0.2s ease', width: '100%'
                  }}>
                    <UserCircle size={18} /> Edit My Profile
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <button onClick={() => setSearchParams({ tab: 'messages' })} style={{
                    padding: '14px 18px', background: 'var(--bg-tertiary)', color: 'var(--primary)',
                    border: '1.5px solid var(--border-color)', fontWeight: 800, fontSize: '0.88rem',
                    borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    width: '100%', transition: 'all 0.2s ease'
                  }}>
                    <MessageSquare size={18} /> Inbox Messages
                  </button>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <button onClick={() => setSearchParams({ tab: 'analytics' })} style={{
                    padding: '14px 18px', background: 'var(--bg-tertiary)', color: 'var(--primary)',
                    border: '1.5px solid var(--border-color)', fontWeight: 800, fontSize: '0.88rem',
                    borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    width: '100%', transition: 'all 0.2s ease'
                  }}>
                    <BarChart2 size={18} /> Outreach Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Equal Parallel Dual-Column Layout (50/50 Grid) */}
            <div className="row g-4 gy-4">
              
              {/* Left Column (col-12 col-lg-6) */}
              <div className="col-12 col-lg-6 d-flex flex-column gap-4">
                
                {/* Profile Completion Section */}
                <div style={{
                  padding: '24px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                    Profile Completeness Index
                  </h4>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall score progress</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#047857' }}>{profileCompletionPct}%</span>
                  </div>
                  <div className="progress mb-3" style={{ height: '8px', background: '#f1f5f9', borderRadius: '9999px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${profileCompletionPct}%`,
                        background: 'linear-gradient(90deg, var(--primary), var(--secondary-hover))',
                        borderRadius: '9999px'
                      }}
                      aria-valuenow={profileCompletionPct}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                    {profileCompletionPct < 100 
                      ? "Add more work history experiences, portfolio credentials, and channel links under My Profile to maximize campaign visibility."
                      : "Awesome! Your creator profile is 100% complete and fully optimized for brand searches."}
                  </p>
                </div>

                {/* Campaign Recommendations */}
                <div style={{
                  padding: '28px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                      <Compass size={18} style={{ color: 'var(--primary)' }} />
                      Campaign Recommendations
                    </h4>
                    <Link to="/discover" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '8px', fontWeight: 800 }}>Browse All</Link>
                  </div>
                  {displayInvitations.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>No campaigns matching your niches currently active.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {displayInvitations.map((camp) => (
                        <div key={camp._id} style={{ padding: '18px 20px', background: 'var(--bg-tertiary)', borderRadius: '14px', border: '1.5px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                          <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--primary)', background: '#f5e9e6', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '6px' }}>{camp.targetPlatforms?.join(', ')}</span>
                            <h5 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)' }}>{camp.title}</h5>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Budget: ₹{camp.budget?.min ? camp.budget.min.toLocaleString() : '1,00,000'} - ₹{camp.budget?.max ? camp.budget.max.toLocaleString() : '5,00,000'}</span>
                          </div>
                          <Link to={`/campaigns/${camp._id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', flexShrink: 0, textDecoration: 'none', borderRadius: '8px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            Pitch <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Applications Status */}
                <div style={{
                  padding: '28px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                      <FileText size={18} style={{ color: 'var(--primary)' }} />
                      Recent Applications Status
                    </h4>
                    <button onClick={() => setSearchParams({ tab: 'applications' })} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '8px', fontWeight: 800 }}>Full History</button>
                  </div>
                  {recentApplications.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>You haven't pitched to any campaigns yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {recentApplications.map((app) => (
                        <div key={app._id} style={{ padding: '18px 20px', background: 'var(--bg-tertiary)', borderRadius: '14px', border: '1.5px solid var(--border-color)' }}>
                          <div className="d-flex justify-content-between align-items-center mb-2" style={{ flexWrap: 'wrap', gap: '8px' }}>
                            <h5 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{app.campaignId?.title || app.projectId?.title || 'Campaign Pitch'}</h5>
                            <span className={`badge badge-${app.status}`} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>{app.status}</span>
                          </div>
                          <p style={{ fontSize: '0.84rem', color: '#475569', margin: '6px 0 10px 0', lineHeight: '1.5' }}>"{app.pitch?.substring(0, 85)}..."</p>
                          <div className="d-flex justify-content-between align-items-center mt-2" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                            <span>Proposed rate: <strong style={{ color: 'var(--text-primary)' }}>₹{app.proposedRate ? app.proposedRate.toLocaleString() : '50,000'}</strong></span>
                            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Deadlines Section */}
                <div style={{
                  padding: '28px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                      <Calendar size={18} style={{ color: 'var(--primary)' }} />
                      Upcoming Deadlines
                    </h4>
                    <button onClick={() => setSearchParams({ tab: 'active-collaborations' })} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '8px', fontWeight: 800 }}>Track Workspaces</button>
                  </div>
                  {displayDeadlines.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>No pending milestone deadlines.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {displayDeadlines.map((dl, idx) => (
                        <div key={idx} style={{ padding: '18px 20px', background: 'var(--bg-tertiary)', borderRadius: '14px', border: '1.5px solid var(--border-color)', borderLeft: '4px solid var(--warning)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                          <div>
                            <h5 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{dl.title}</h5>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Project: {dl.projectTitle}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--warning)', fontWeight: 800, background: '#fffbe8', padding: '3px 10px', borderRadius: '6px', border: '1px solid #fef3c7' }}>
                              Due: {new Date(dl.dueDate).toLocaleDateString()}
                            </span>
                            <Link to={`/workspaces/${dl.workspaceId}`} style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>Details →</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column (col-12 col-lg-6) */}
              <div className="col-12 col-lg-6 d-flex flex-column gap-4">
                
                {/* Recent Notifications */}
                <div style={{
                  padding: '28px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                      <Bell size={18} style={{ color: 'var(--primary)' }} />
                      Recent Notifications
                    </h4>
                    <button onClick={() => setSearchParams({ tab: 'notifications' })} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem', fontWeight: 800, borderRadius: '8px' }}>View All</button>
                  </div>
                  {displayNotifications.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>No alerts found in feed.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {displayNotifications.slice(0, 4).map((notif) => (
                        <div key={notif._id} style={{
                          padding: '16px 18px', background: notif.isRead ? 'var(--bg-tertiary)' : '#f5e9e6',
                          borderRadius: '14px', border: notif.isRead ? '1.5px solid var(--border-color)' : '1.5px solid #bfdbfe'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <h5 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{notif.title}</h5>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>{notif.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Messages */}
                <div style={{
                  padding: '28px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                      <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
                      Recent Messages
                    </h4>
                    <button onClick={() => setSearchParams({ tab: 'messages' })} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem', fontWeight: 800, borderRadius: '8px' }}>Open Inbox</button>
                  </div>
                  {recentMessages.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>No messaging records.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recentMessages.map((thread) => (
                        <div
                          key={thread.projectId}
                          onClick={() => selectThread(thread)}
                          style={{
                            padding: '16px 18px', borderRadius: '14px',
                            background: 'var(--bg-tertiary)', cursor: 'pointer',
                            border: '1.5px solid var(--border-color)', transition: 'all 0.2s ease'
                          }}
                        >
                          <div className="d-flex gap-3 align-items-center">
                            <div style={{
                              width: '40px', height: '40px', borderRadius: '12px',
                              background: 'var(--primary)', color: '#ffffff', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900, flexShrink: 0
                            }}>
                              {thread.partnerAvatar ? (
                                <img src={thread.partnerAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} alt="" />
                              ) : (
                                thread.partnerName?.substring(0, 2).toUpperCase()
                              )}
                            </div>
                            <div style={{ flexGrow: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.partnerName}</span>
                                {thread.unreadCount > 0 && (
                                  <span style={{ fontSize: '0.68rem', fontWeight: 900, background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: '9999px' }}>{thread.unreadCount} New</span>
                                )}
                              </div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{thread.lastMessageText}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Activity Timeline */}
                <div style={{
                  padding: '28px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <Layers size={18} style={{ color: 'var(--primary)' }} />
                    Recent Activity Timeline
                  </h4>
                  {timelineEvents.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No recent activities logged on your timeline feed.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--border-color)' }}>
                      {timelineEvents.map((evt, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <span style={{
                            position: 'absolute',
                            left: '-26px',
                            top: '4px',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: evt.type === 'notification' ? 'var(--primary)' : '#047857',
                            border: '2px solid #ffffff'
                          }}></span>
                          <div className="d-flex justify-content-between align-items-start">
                            <h5 style={{ fontSize: '0.86rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{evt.title}</h5>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{new Date(evt.date).toLocaleDateString()}</span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{evt.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        );
      }

      case 'profile':
        return (
          <form onSubmit={handleUpdateProfile} className="glass-panel animate-fade-in-up" style={{ padding: '32px', maxWidth: '680px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Edit Personal Profiles</h3>
            
            {saveSuccess && (
              <div style={{ color: 'var(--success)', background: 'var(--success-glow)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Image URL</label>
              <input type="text" className="form-input" value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="https://..." />
            </div>

            <div className="form-group">
              <label className="form-label">Change Password (Leave blank to keep current)</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="•••••••• (Min 6 chars)" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
              <Save size={18} />
              Save Account Profile
            </button>
          </form>
        );

      case 'portfolio':
        return (
          <form onSubmit={handleUpdateProfile} className="glass-panel animate-fade-in-up" style={{ padding: '32px', maxWidth: '720px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>My Creative Portfolio Details</h3>
            
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input" rows="4" value={creatorBio} onChange={(e) => setCreatorBio(e.target.value)} />
            </div>
            
            <button type="submit" className="btn btn-primary">Save Portfolio</button>
          </form>
        );

      case 'active-collaborations':
      case 'projects': {
        const activeWS = workspaces.filter(ws => ws.status !== 'completed');
        return (
          <div className="animate-fade-in-up">
            {/* Section Header */}
            <div style={{ marginBottom: '32px' }}>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 6px 0', color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                    Active Collaborations
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>
                    Track ongoing sponsorship projects, milestones &amp; deliverables in real-time.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: '#ecfdf5', color: '#047857', padding: '8px 18px', borderRadius: '12px', border: '1.5px solid #a7f3d0', fontSize: '0.88rem', fontWeight: 800 }}>
                    {activeWS.length} Active Project{activeWS.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {activeWS.length === 0 ? (
              <div style={{
                padding: '80px 40px', textAlign: 'center', borderRadius: '20px',
                background: '#ffffff', border: '1.5px solid var(--border-color)',
                boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
              }}>
                <Briefcase size={48} style={{ color: '#94a3b8', display: 'block', margin: '0 auto 16px' }} />
                <h4 style={{ fontWeight: 900, margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '1.15rem' }}>No active collaborations</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                  Your accepted campaign collaborations will appear here once started.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {activeWS.map((ws) => {
                  const project = ws.projectId || {};
                  const brandUser = ws.brandId || {};
                  
                  // Compute progress stats
                  const totalMilestones = ws.milestones?.length || 0;
                  const approvedMilestones = ws.milestones?.filter(m => m.status === 'approved').length || 0;
                  const submittedMilestones = ws.milestones?.filter(m => m.status === 'submitted').length || 0;
                  const progressPct = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;

                  const formattedDeadline = project.deadline 
                    ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A';

                  return (
                    <div
                      key={ws._id}
                      style={{
                        padding: '0', overflow: 'hidden',
                        borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)',
                        boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(var(--primary-rgb), 0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'; }}
                    >
                      {/* Status Color Top Bar */}
                      <div style={{ height: '5px', background: 'linear-gradient(90deg, #047857, #10b981, #34d399)' }} />

                      <div style={{ padding: '28px 32px' }}>
                        {/* Row 1: Brand + Title + Rate Badge */}
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3" style={{ marginBottom: '24px' }}>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            {/* Brand Avatar */}
                            <div style={{
                              width: '52px', height: '52px', borderRadius: '14px',
                              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#ffffff', fontWeight: 900, fontSize: '1rem', flexShrink: 0,
                              boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.2)'
                            }}>
                              {brandUser.profileImage
                                ? <img src={brandUser.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} alt="" />
                                : (brandUser.name ? brandUser.name.substring(0, 2).toUpperCase() : 'CS')
                              }
                            </div>
                            <div>
                              <span style={{
                                fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800,
                                textTransform: 'uppercase', letterSpacing: '0.05em',
                                display: 'flex', alignItems: 'center', gap: '6px'
                              }}>
                                <Building size={13} /> {brandUser.name || 'Brand Partner'}
                              </span>
                              <h4 style={{
                                fontWeight: 900, fontSize: '1.25rem', margin: '4px 0 0 0',
                                color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)",
                                lineHeight: '1.35'
                              }}>
                                {project.title || 'Sponsorship Contract'}
                              </h4>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{
                              fontWeight: 900, color: '#047857', fontSize: '1.15rem', display: 'block',
                              background: '#ecfdf5', padding: '8px 18px', borderRadius: '12px',
                              border: '1.5px solid #a7f3d0'
                            }}>
                              ${ws.proposedRate?.toLocaleString() || '1,500'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                              💳 Escrow Secured
                            </span>
                          </div>
                        </div>

                        {/* Row 2: Campaign Brief */}
                        <div style={{
                          background: 'var(--bg-tertiary)', borderRadius: '14px',
                          padding: '18px 22px', marginBottom: '24px',
                          borderLeft: '4px solid #047857', border: '1.5px solid var(--border-color)',
                          borderLeftWidth: '4px', borderLeftColor: '#047857'
                        }}>
                          <span style={{
                            fontWeight: 800, display: 'block', fontSize: '0.75rem',
                            color: '#047857', marginBottom: '8px',
                            textTransform: 'uppercase', letterSpacing: '0.05em'
                          }}>
                            📋 Campaign Brief Overview
                          </span>
                          <p style={{
                            fontSize: '0.92rem', color: 'var(--primary)',
                            lineHeight: '1.7', margin: 0
                          }}>
                            {project.description || 'Campaign specifications provided by sponsor.'}
                          </p>
                        </div>

                        {/* Row 3: Deliverables Tags */}
                        {project.deliverables && project.deliverables.length > 0 && (
                          <div style={{ marginBottom: '24px' }}>
                            <span style={{
                              fontSize: '0.75rem', color: 'var(--primary)', display: 'block', fontWeight: 800,
                              marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                              🎯 Required Deliverables
                            </span>
                            <div className="d-flex flex-wrap gap-2">
                              {project.deliverables.map((deliv, dIdx) => (
                                <span key={dIdx} style={{
                                  padding: '5px 14px', background: '#f5e9e6',
                                  border: '1px solid #bfdbfe', color: 'var(--primary)',
                                  borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800
                                }}>
                                  {deliv}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Row 4: Stats Grid — Progress + Deadline */}
                        <div style={{
                          display: 'grid', gridTemplateColumns: '1fr 1fr',
                          gap: '20px', marginBottom: '24px',
                          padding: '20px 24px', background: 'var(--bg-tertiary)',
                          borderRadius: '14px', border: '1.5px solid var(--border-color)'
                        }}>
                          <div>
                            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '10px' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Collaboration Progress
                              </span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--primary)' }}>
                                {progressPct}% ({approvedMilestones}/{totalMilestones})
                              </span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${progressPct}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                                borderRadius: '9999px',
                                transition: 'width 0.5s ease'
                              }} />
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                              Campaign Deadline
                            </span>
                            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#b91c1c' }}>{formattedDeadline}</span>
                          </div>
                        </div>

                        {/* Row 5: Milestones Timeline */}
                        <div style={{ marginBottom: '24px' }}>
                          <span style={{
                            fontSize: '0.78rem', color: 'var(--text-primary)', display: 'block', fontWeight: 900,
                            marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em'
                          }}>
                            🚀 Milestones Workflow Timeline
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '16px' }}>
                            {ws.milestones?.map((m, mIdx) => {
                              const getMilestoneColor = (status) => {
                                if (status === 'approved') return '#047857';
                                if (status === 'submitted') return '#f59e0b';
                                return '#94a3b8';
                              };
                              const getMilestoneBg = (status) => {
                                if (status === 'approved') return '#ecfdf5';
                                if (status === 'submitted') return '#fffbeb';
                                return 'var(--bg-tertiary)';
                              };
                              const getMilestoneBorder = (status) => {
                                if (status === 'approved') return '#a7f3d0';
                                if (status === 'submitted') return '#fde68a';
                                return 'var(--border-color)';
                              };
                              const milestoneColor = getMilestoneColor(m.status);

                              return (
                                <div key={m._id} style={{ position: 'relative', paddingBottom: mIdx < ws.milestones.length - 1 ? '0' : 0 }}>
                                  {/* Vertical Line */}
                                  {mIdx < ws.milestones.length - 1 && (
                                    <div style={{
                                      position: 'absolute', left: '-10px', top: '18px', bottom: '0',
                                      width: '2px', background: 'var(--border-color)'
                                    }} />
                                  )}
                                  {/* Dot */}
                                  <div style={{
                                    position: 'absolute', left: '-14px', top: '14px',
                                    width: '12px', height: '12px', borderRadius: '50%',
                                    background: milestoneColor, zIndex: 1,
                                    border: '2px solid #ffffff',
                                    boxShadow: `0 0 0 3px ${milestoneColor}33`
                                  }} />

                                  {/* Milestone Content Card */}
                                  <div style={{
                                    background: getMilestoneBg(m.status),
                                    border: `1.5px solid ${getMilestoneBorder(m.status)}`,
                                    borderRadius: '14px', padding: '16px 20px',
                                    marginLeft: '8px', marginBottom: mIdx < ws.milestones.length - 1 ? '16px' : '0'
                                  }}>
                                    <div className="d-flex align-items-center gap-2 flex-wrap" style={{ marginBottom: '6px' }}>
                                      <span style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-primary)' }}>{m.title}</span>
                                      <span style={{
                                        padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800,
                                        background: getMilestoneBg(m.status),
                                        color: milestoneColor,
                                        border: `1px solid ${getMilestoneBorder(m.status)}`,
                                        textTransform: 'capitalize'
                                      }}>
                                        {m.status === 'approved' ? '✅ Approved' : m.status === 'submitted' ? '⏳ Submitted' : '📌 Pending'}
                                      </span>
                                    </div>
                                    {m.description && (
                                      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', margin: '0 0 8px 0' }}>{m.description}</p>
                                    )}

                                    {/* Brand feedback if approved */}
                                    {m.status === 'approved' && (
                                      <span style={{ fontSize: '0.78rem', color: '#047857', display: 'block', fontWeight: 700 }}>
                                        ✓ Deliverable approved — budget escrow locked for payout.
                                      </span>
                                    )}

                                    {/* Upload Link Form inside Milestone element */}
                                    {m.status === 'pending' && (
                                      <div style={{ marginTop: '10px' }}>
                                        {submittingMilestoneId === m._id ? (
                                          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1.5px solid var(--border-color)', padding: '16px', maxWidth: '500px' }}>
                                            <div style={{ marginBottom: '12px' }}>
                                              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Content URL Proof</label>
                                              <input
                                                type="url"
                                                placeholder="https://..."
                                                className="form-input"
                                                value={submissionUrl}
                                                onChange={(e) => setSubmissionUrl(e.target.value)}
                                                style={{ padding: '10px 14px', fontSize: '0.88rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', marginBottom: 0 }}
                                                required
                                              />
                                            </div>
                                            <div style={{ marginBottom: '14px' }}>
                                              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Notes for Sponsor</label>
                                              <textarea
                                                placeholder="Provide review timestamps..."
                                                rows="2"
                                                className="form-input"
                                                value={submissionNotes}
                                                onChange={(e) => setSubmissionNotes(e.target.value)}
                                                style={{ padding: '10px 14px', fontSize: '0.88rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', marginBottom: 0 }}
                                              />
                                            </div>
                                            <div className="d-flex gap-2">
                                              <button
                                                type="button"
                                                onClick={() => handleSubmitMilestoneProof(ws._id, m._id)}
                                                className="btn btn-primary"
                                                style={{ padding: '8px 18px', fontSize: '0.85rem', borderRadius: '10px', fontWeight: 800 }}
                                                disabled={submissionLoading}
                                              >
                                                {submissionLoading ? 'Submitting...' : '🚀 Send Proof'}
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => setSubmittingMilestoneId(null)}
                                                style={{
                                                  padding: '8px 18px', fontSize: '0.85rem', borderRadius: '10px', fontWeight: 800,
                                                  background: '#f1f5f9', color: '#475569', border: '1.5px solid var(--border-color)', cursor: 'pointer'
                                                }}
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSubmittingMilestoneId(m._id);
                                              setSubmissionUrl('');
                                              setSubmissionNotes('');
                                            }}
                                            style={{
                                              padding: '6px 16px', fontSize: '0.82rem', borderRadius: '8px', fontWeight: 800,
                                              background: '#f5e9e6', color: 'var(--primary)', border: '1.5px solid #bfdbfe', cursor: 'pointer',
                                              transition: 'all 0.2s ease'
                                            }}
                                          >
                                            📤 Submit Deliverable Proof
                                          </button>
                                        )}
                                      </div>
                                    )}

                                    {/* Submitted pending confirmation */}
                                    {m.status === 'submitted' && (
                                      <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', marginTop: '10px', fontSize: '0.82rem', border: '1.5px solid var(--border-color)' }}>
                                        <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Submitted Verification URL:</span>
                                        <a href={m.submissionUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: 700 }}>
                                          {m.submissionUrl}
                                        </a>
                                        {m.submissionNotes && (
                                          <span style={{ color: '#475569', display: 'block', marginTop: '6px', fontSize: '0.82rem' }}>📝 Notes: {m.submissionNotes}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Row 6: Action Buttons */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ paddingTop: '20px', borderTop: '1.5px solid #f1f5f9' }}>
                          <button
                            onClick={() => setActiveChatWsId(activeChatWsId === ws._id ? null : ws._id)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '8px',
                              padding: '10px 22px', borderRadius: '10px',
                              fontSize: '0.88rem', fontWeight: 800,
                              background: activeChatWsId === ws._id ? '#f5e9e6' : 'var(--bg-tertiary)',
                              color: activeChatWsId === ws._id ? 'var(--primary)' : '#475569',
                              border: activeChatWsId === ws._id ? '1.5px solid #bfdbfe' : '1.5px solid var(--border-color)',
                              cursor: 'pointer', transition: 'all 0.2s ease'
                            }}
                          >
                            <MessageSquare size={15} /> Messages ({ws.messages?.length || 0})
                          </button>
                          
                          <Link
                            to={`/workspaces/${ws._id}`}
                            className="btn btn-primary"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '8px',
                              padding: '10px 22px', borderRadius: '10px',
                              fontSize: '0.88rem', fontWeight: 800
                            }}
                          >
                            Open Workspace Details →
                          </Link>
                        </div>

                        {/* Inline Messages Board */}
                        {activeChatWsId === ws._id && (
                          <div style={{
                            marginTop: '20px', background: 'var(--bg-tertiary)', padding: '20px',
                            borderRadius: '16px', border: '1.5px solid var(--border-color)'
                          }}>
                            <div style={{ overflowY: 'auto', maxHeight: '200px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                              {ws.messages?.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontSize: '0.88rem', fontStyle: 'italic', textAlign: 'center', margin: '24px 0' }}>
                                  No messages yet. Say hello to your sponsor brand! 👋
                                </p>
                              ) : (
                                ws.messages.map((msg, mIdx) => {
                                  const isMe = msg.senderId === user._id;
                                  return (
                                    <div key={mIdx} style={{
                                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                                      background: isMe ? '#f5e9e6' : '#ffffff',
                                      border: isMe ? '1.5px solid #bfdbfe' : '1.5px solid var(--border-color)',
                                      padding: '10px 16px',
                                      borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                      fontSize: '0.88rem',
                                      maxWidth: '80%', color: 'var(--text-primary)'
                                    }}>
                                      <span style={{ fontSize: '0.72rem', color: isMe ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                                        {isMe ? 'You' : brandUser.name}
                                      </span>
                                      <span>{msg.text}</span>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                            
                            <div className="d-flex gap-2">
                              <input
                                type="text"
                                placeholder="Type message..."
                                className="form-input"
                                value={typedWsMessage}
                                onChange={(e) => setTypedWsMessage(e.target.value)}
                                style={{ fontSize: '0.88rem', padding: '10px 16px', marginBottom: 0, borderRadius: '10px', border: '1.5px solid var(--border-color)' }}
                              />
                              <button
                                type="button"
                                onClick={() => handleSendWsMessage(ws._id)}
                                className="btn btn-primary"
                                style={{ padding: '10px 20px', fontSize: '0.88rem', borderRadius: '10px', fontWeight: 800 }}
                                disabled={chatLoading}
                              >
                                <Send size={15} />
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'completed-collaborations': {
        const completedWS = workspaces.filter(ws => ws.status === 'completed');
        const totalEarned = completedWS.reduce((acc, ws) => acc + (ws.proposedRate || 0), 0);

        return (
          <div className="animate-fade-in-up">
            {/* Section Header */}
            <div style={{ marginBottom: '32px' }}>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 6px 0', color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                    Completed Collaborations
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>
                    Past sponsorship projects that have been finalized and paid out.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: '#ecfdf5', color: '#047857', padding: '8px 18px', borderRadius: '12px', border: '1.5px solid #a7f3d0', fontSize: '0.88rem', fontWeight: 800 }}>
                    💰 ${totalEarned.toLocaleString()} Earned
                  </span>
                  <span style={{ background: '#f0f9ff', color: '#0369a1', padding: '8px 18px', borderRadius: '12px', border: '1.5px solid #bae6fd', fontSize: '0.88rem', fontWeight: 800 }}>
                    🏆 {completedWS.length} Completed
                  </span>
                </div>
              </div>
            </div>

            {completedWS.length === 0 ? (
              <div style={{
                padding: '80px 40px', textAlign: 'center', borderRadius: '20px',
                background: '#ffffff', border: '1.5px solid var(--border-color)',
                boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
              }}>
                <CheckSquare size={48} style={{ color: '#94a3b8', display: 'block', margin: '0 auto 16px' }} />
                <h4 style={{ fontWeight: 900, margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '1.15rem' }}>No completed projects yet</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                  Finalized collaborations will appear here once completed.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {completedWS.map((ws) => {
                  const project = ws.projectId || {};
                  const brandUser = ws.brandId || {};
                  const totalM = ws.milestones?.length || 0;
                  const approvedM = ws.milestones?.filter(m => m.status === 'approved').length || 0;

                  const formattedDeadline = project.deadline
                    ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A';

                  return (
                    <div
                      key={ws._id}
                      style={{
                        padding: '0', overflow: 'hidden',
                        borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)',
                        boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(3, 105, 161, 0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'; }}
                    >
                      {/* Status Color Top Bar */}
                      <div style={{ height: '5px', background: 'linear-gradient(90deg, #0369a1, #38bdf8, #7dd3fc)' }} />

                      <div style={{ padding: '28px 32px' }}>
                        {/* Row 1: Brand + Title + Rate */}
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3" style={{ marginBottom: '24px' }}>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            {/* Brand Avatar */}
                            <div style={{
                              width: '52px', height: '52px', borderRadius: '14px',
                              background: 'linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#ffffff', fontWeight: 900, fontSize: '1rem', flexShrink: 0,
                              boxShadow: '0 4px 12px rgba(3, 105, 161, 0.2)'
                            }}>
                              {brandUser.profileImage
                                ? <img src={brandUser.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} alt="" />
                                : (brandUser.name ? brandUser.name.substring(0, 2).toUpperCase() : 'CS')
                              }
                            </div>
                            <div>
                              <span style={{
                                fontSize: '0.78rem', color: '#0369a1', fontWeight: 800,
                                textTransform: 'uppercase', letterSpacing: '0.05em',
                                display: 'flex', alignItems: 'center', gap: '6px'
                              }}>
                                <Building size={13} /> {brandUser.name || 'Brand Partner'}
                              </span>
                              <h4 style={{
                                fontWeight: 900, fontSize: '1.25rem', margin: '4px 0 0 0',
                                color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)",
                                lineHeight: '1.35'
                              }}>
                                {project.title || 'Completed Sponsorship'}
                              </h4>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                            <span style={{
                              padding: '5px 14px', background: '#f0f9ff', color: '#0369a1',
                              border: '1.5px solid #bae6fd', borderRadius: '9999px',
                              fontSize: '0.78rem', fontWeight: 900, display: 'inline-flex',
                              alignItems: 'center', gap: '6px'
                            }}>
                              🏆 Completed
                            </span>
                            <span style={{
                              fontWeight: 900, color: '#047857', fontSize: '1.15rem',
                              background: '#ecfdf5', padding: '6px 16px', borderRadius: '10px',
                              border: '1.5px solid #a7f3d0'
                            }}>
                              ${ws.proposedRate?.toLocaleString() || '0'} Earned
                            </span>
                          </div>
                        </div>

                        {/* Row 2: Campaign Brief */}
                        {project.description && (
                          <div style={{
                            background: '#f0f9ff', borderRadius: '14px',
                            padding: '18px 22px', marginBottom: '24px',
                            borderLeft: '4px solid #0369a1', border: '1.5px solid #bae6fd',
                            borderLeftWidth: '4px', borderLeftColor: '#0369a1'
                          }}>
                            <span style={{
                              fontWeight: 800, display: 'block', fontSize: '0.75rem',
                              color: '#0369a1', marginBottom: '8px',
                              textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                              📋 Campaign Brief
                            </span>
                            <p style={{
                              fontSize: '0.92rem', color: 'var(--primary)',
                              lineHeight: '1.7', margin: 0
                            }}>
                              {project.description}
                            </p>
                          </div>
                        )}

                        {/* Row 3: Deliverables Tags */}
                        {project.deliverables && project.deliverables.length > 0 && (
                          <div style={{ marginBottom: '24px' }}>
                            <span style={{
                              fontSize: '0.75rem', color: '#0369a1', display: 'block', fontWeight: 800,
                              marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                              ✅ Delivered Content
                            </span>
                            <div className="d-flex flex-wrap gap-2">
                              {project.deliverables.map((deliv, dIdx) => (
                                <span key={dIdx} style={{
                                  padding: '5px 14px', background: '#ecfdf5',
                                  border: '1px solid #a7f3d0', color: '#047857',
                                  borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800,
                                  display: 'inline-flex', alignItems: 'center', gap: '4px'
                                }}>
                                  ✓ {deliv}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Row 4: Stats Grid */}
                        <div style={{
                          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '16px', marginBottom: '24px',
                          padding: '18px 20px', background: 'var(--bg-tertiary)',
                          borderRadius: '14px', border: '1.5px solid var(--border-color)'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                              Milestones
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#047857' }}>
                              {approvedM}/{totalM} Approved
                            </span>
                          </div>
                          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                              Rate Paid
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#047857' }}>
                              ${ws.proposedRate?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                              Deadline
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                              {formattedDeadline}
                            </span>
                          </div>
                        </div>

                        {/* Row 5: Milestones Summary */}
                        {ws.milestones?.length > 0 && (
                          <div style={{ marginBottom: '24px' }}>
                            <span style={{
                              fontSize: '0.78rem', color: 'var(--text-primary)', display: 'block', fontWeight: 900,
                              marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                              🎯 Completed Milestones
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {ws.milestones.map((m) => (
                                <div key={m._id} style={{
                                  display: 'flex', alignItems: 'center', gap: '12px',
                                  background: '#ecfdf5', padding: '12px 18px', borderRadius: '12px',
                                  border: '1px solid #a7f3d0'
                                }}>
                                  <CheckSquare size={18} style={{ color: '#047857', flexShrink: 0 }} />
                                  <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{m.title}</span>
                                    {m.description && (
                                      <span style={{ display: 'block', fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>{m.description}</span>
                                    )}
                                  </div>
                                  <span style={{
                                    padding: '3px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800,
                                    background: '#d1fae5', color: '#047857', border: '1px solid #a7f3d0'
                                  }}>
                                    ✅ {m.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Row 6: Niche Tags */}
                        {project.niche?.length > 0 && (
                          <div className="d-flex flex-wrap gap-2" style={{ marginBottom: '20px' }}>
                            {project.niche.map((n, idx) => (
                              <span key={idx} style={{
                                padding: '4px 12px', background: '#f0f9ff',
                                border: '1px solid #bae6fd', color: '#0369a1',
                                borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800
                              }}>{n}</span>
                            ))}
                          </div>
                        )}

                        {/* Row 7: Action Button */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ paddingTop: '20px', borderTop: '1.5px solid #f1f5f9' }}>
                          <Link
                            to={`/workspaces/${ws._id}`}
                            className="btn btn-primary"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '8px',
                              padding: '10px 22px', borderRadius: '10px',
                              fontSize: '0.88rem', fontWeight: 800
                            }}
                          >
                            <Eye size={16} /> View Full Workspace
                          </Link>
                          <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, fontStyle: 'italic' }}>
                            Project finalized &amp; archived
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'applications': {
        const filteredApps = applications.filter((app) => {
          if (appSubTab === 'all') return true;
          if (appSubTab === 'pending') return app.status === 'pending';
          if (appSubTab === 'shortlisted') return app.status === 'shortlisted';
          if (appSubTab === 'approved') return app.status === 'approved';
          if (appSubTab === 'rejected') return app.status === 'rejected';
          if (appSubTab === 'completed') {
            return workspaces.some(ws => ws.projectId?._id === app.projectId?._id && ws.status === 'completed');
          }
          return true;
        });

        const getAppStatusStyle = (status) => {
          switch (status) {
            case 'pending':
              return { background: '#fffbeb', color: '#b45309', border: '1.5px solid #fde68a' };
            case 'shortlisted':
              return { background: '#f5e9e6', color: 'var(--primary)', border: '1.5px solid #bfdbfe' };
            case 'approved':
              return { background: '#ecfdf5', color: '#047857', border: '1.5px solid #a7f3d0' };
            case 'rejected':
              return { background: '#fef2f2', color: '#b91c1c', border: '1.5px solid #fecaca' };
            case 'completed':
              return { background: '#f0f9ff', color: '#0369a1', border: '1.5px solid #bae6fd' };
            default:
              return { background: '#f1f5f9', color: '#475569', border: '1.5px solid var(--border-color)' };
          }
        };

        const getStatusIcon = (status) => {
          switch (status) {
            case 'pending': return '⏳';
            case 'shortlisted': return '⭐';
            case 'approved': return '✅';
            case 'rejected': return '❌';
            case 'completed': return '🏆';
            default: return '📋';
          }
        };

        return (
          <div className="animate-fade-in-up">
            {/* Section Header */}
            <div style={{ marginBottom: '32px' }}>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 6px 0', color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                    My Applications Log
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>
                    Track and manage your brand outreach submissions &amp; pitch history.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: '#f5e9e6', color: 'var(--primary)', padding: '8px 18px', borderRadius: '12px', border: '1.5px solid #bfdbfe', fontSize: '0.88rem', fontWeight: 800 }}>
                    {applications.length} Total Application{applications.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div style={{
              display: 'flex', background: '#ffffff', padding: '6px',
              borderRadius: '14px', border: '1.5px solid var(--border-color)',
              boxShadow: '0 4px 16px rgba(var(--text-primary-rgb), 0.04)',
              gap: '6px', flexWrap: 'wrap', marginBottom: '28px'
            }}>
              {['all', 'pending', 'shortlisted', 'approved', 'rejected', 'completed'].map((tab) => {
                const isActive = appSubTab === tab;
                const tabCount = tab === 'all'
                  ? applications.length
                  : tab === 'completed'
                    ? applications.filter(a => workspaces.some(ws => ws.projectId?._id === a.projectId?._id && ws.status === 'completed')).length
                    : applications.filter(a => a.status === tab).length;

                return (
                  <button
                    key={tab}
                    onClick={() => setAppSubTab(tab)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      textTransform: 'capitalize',
                      background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      boxShadow: isActive ? '0 4px 14px rgba(var(--primary-rgb), 0.25)' : 'none'
                    }}
                  >
                    {getStatusIcon(tab === 'all' ? 'default' : tab)} {tab === 'approved' ? 'Accepted' : tab}
                    <span style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      padding: '2px 8px', borderRadius: '8px',
                      fontSize: '0.75rem', fontWeight: 900, minWidth: '24px', textAlign: 'center'
                    }}>
                      {tabCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Applications List */}
            {filteredApps.length === 0 ? (
              <div style={{
                padding: '80px 40px', textAlign: 'center', borderRadius: '20px',
                background: '#ffffff', border: '1.5px solid var(--border-color)',
                boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
              }}>
                <FileText size={48} style={{ color: '#94a3b8', display: 'block', margin: '0 auto 16px' }} />
                <h4 style={{ fontWeight: 900, margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '1.15rem' }}>No applications found</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                  No submissions match the "<strong>{appSubTab}</strong>" filter. Try another status tab.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredApps.map((app) => {
                  const project = app.projectId || {};
                  const isCompleted = workspaces.some(ws => ws.projectId?._id === project._id && ws.status === 'completed');
                  const currentStatus = isCompleted ? 'completed' : app.status;
                  const brandUser = project.brandId || {};
                  
                  const formattedAppliedDate = new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                  const formattedDeadline = project.deadline 
                    ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A';

                  const canWithdraw = currentStatus === 'pending' || currentStatus === 'shortlisted';
                  const statusStyle = getAppStatusStyle(currentStatus);

                  return (
                    <div
                      key={app._id}
                      style={{
                        padding: '0', overflow: 'hidden',
                        borderRadius: '20px', background: '#ffffff', border: '1.5px solid var(--border-color)',
                        boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(var(--primary-rgb), 0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'; }}
                    >
                      {/* Status Color Top Bar */}
                      <div style={{
                        height: '5px',
                        background: currentStatus === 'pending' ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                          : currentStatus === 'shortlisted' ? 'linear-gradient(90deg, var(--primary), var(--secondary))'
                          : currentStatus === 'approved' ? 'linear-gradient(90deg, #047857, #10b981)'
                          : currentStatus === 'rejected' ? 'linear-gradient(90deg, #b91c1c, var(--danger))'
                          : currentStatus === 'completed' ? 'linear-gradient(90deg, #0369a1, #38bdf8)'
                          : 'linear-gradient(90deg, var(--text-muted), #94a3b8)'
                      }} />

                      <div style={{ padding: '28px 32px' }}>
                        {/* Row 1: Brand + Title + Status Badge */}
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3" style={{ marginBottom: '20px' }}>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            {/* Brand Avatar */}
                            <div style={{
                              width: '52px', height: '52px', borderRadius: '14px',
                              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#ffffff', fontWeight: 900, fontSize: '1rem', flexShrink: 0,
                              boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.2)'
                            }}>
                              {brandUser.profileImage
                                ? <img src={brandUser.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} alt="" />
                                : (brandUser.name ? brandUser.name.substring(0, 2).toUpperCase() : 'CS')
                              }
                            </div>
                            <div>
                              <span style={{
                                fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800,
                                textTransform: 'uppercase', letterSpacing: '0.05em',
                                display: 'flex', alignItems: 'center', gap: '6px'
                              }}>
                                <Building size={13} /> {brandUser.name || 'CreatorSync Partner'}
                              </span>
                              <h4 style={{
                                fontWeight: 900, fontSize: '1.2rem', margin: '4px 0 0 0',
                                color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)",
                                lineHeight: '1.35'
                              }}>
                                {project.title || 'Sponsorship Brief Opportunity'}
                              </h4>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span style={{
                            ...statusStyle,
                            padding: '8px 18px', borderRadius: '12px',
                            fontSize: '0.82rem', fontWeight: 900,
                            textTransform: 'capitalize', display: 'inline-flex',
                            alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
                          }}>
                            {getStatusIcon(currentStatus)} {currentStatus === 'approved' ? 'Accepted' : currentStatus}
                          </span>
                        </div>

                        {/* Row 2: Your Pitch */}
                        <div style={{
                          background: 'var(--bg-tertiary)', borderRadius: '14px',
                          padding: '18px 22px', marginBottom: '24px',
                          borderLeft: '4px solid var(--primary)', border: '1.5px solid var(--border-color)',
                          borderLeftWidth: '4px', borderLeftColor: 'var(--primary)'
                        }}>
                          <span style={{
                            fontWeight: 800, display: 'block', fontSize: '0.75rem',
                            color: 'var(--primary)', marginBottom: '8px',
                            textTransform: 'uppercase', letterSpacing: '0.05em'
                          }}>
                            📝 Your Pitch Message
                          </span>
                          <p style={{
                            fontSize: '0.92rem', color: 'var(--primary)',
                            lineHeight: '1.7', margin: 0, fontStyle: 'italic'
                          }}>
                            "{app.pitch}"
                          </p>
                        </div>

                        {/* Row 3: Metadata Stats Grid */}
                        <div style={{
                          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '16px', marginBottom: '24px',
                          padding: '18px 20px', background: 'var(--bg-tertiary)',
                          borderRadius: '14px', border: '1.5px solid var(--border-color)'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                              Applied Date
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)' }}>{formattedAppliedDate}</span>
                          </div>
                          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                              Proposed Rate
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#047857' }}>${app.proposedRate?.toLocaleString()}</span>
                          </div>
                          <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                              Campaign Budget
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                              ${project.budget?.min?.toLocaleString()} — ${project.budget?.max?.toLocaleString()}
                            </span>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                              Deadline
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--primary)' }}>{formattedDeadline}</span>
                          </div>
                        </div>

                        {/* Row 4: Niche Tags if present */}
                        {project.niche?.length > 0 && (
                          <div className="d-flex flex-wrap gap-2" style={{ marginBottom: '20px' }}>
                            {project.niche.map((n, idx) => (
                              <span key={idx} style={{
                                padding: '4px 12px', background: '#f5e9e6',
                                border: '1px solid #bfdbfe', color: 'var(--primary)',
                                borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800
                              }}>{n}</span>
                            ))}
                            {project.targetPlatforms?.map((plat, idx) => (
                              <span key={`p-${idx}`} style={{
                                padding: '4px 12px', background: '#f1f5f9',
                                border: '1px solid var(--border-color)', color: '#475569',
                                borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800
                              }}>{plat}</span>
                            ))}
                          </div>
                        )}

                        {/* Row 5: Action Buttons */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ paddingTop: '20px', borderTop: '1.5px solid #f1f5f9' }}>
                          <Link
                            to={`/campaigns/${project._id}`}
                            className="btn btn-primary"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '8px',
                              padding: '10px 22px', borderRadius: '10px',
                              fontSize: '0.88rem', fontWeight: 800
                            }}
                          >
                            <Search size={15} /> View Campaign Details
                          </Link>

                          {canWithdraw && (
                            <button
                              onClick={() => handleWithdrawApplication(app._id)}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '10px 22px', borderRadius: '10px',
                                fontSize: '0.88rem', fontWeight: 800,
                                background: '#fef2f2', color: '#b91c1c',
                                border: '1.5px solid #fecaca', cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(185, 28, 28, 0.15)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                              <Trash2 size={15} /> Withdraw Application
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'notifications':
        return renderNotificationsLayout();

      case 'messages':
        return renderInboxLayout();

      case 'analytics':
        return renderAnalyticsLayout();

      case 'settings':
        return renderSettingsLayout();

      default:
        return <div>Section active under tab selections.</div>;
    }
  };

  // RENDER DYNAMIC BRAND CONTENT TABS
  const renderBrandTab = () => {
    const getStatusBadge = (status) => {
      switch (status) {
        case 'draft':
          return <span className="badge" style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', border: '1px solid rgba(255, 193, 7, 0.3)' }}>Draft</span>;
        case 'active':
          return <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'rgba(16, 185, 129, 1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Active</span>;
        case 'paused':
          return <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'rgba(245, 158, 11, 1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Paused</span>;
        case 'completed':
          return <span className="badge" style={{ background: 'rgba(var(--secondary-rgb), 0.1)', color: 'rgba(var(--secondary-rgb), 1)', border: '1px solid rgba(var(--secondary-rgb), 0.3)' }}>Completed</span>;
        default:
          return <span className="badge">{status}</span>;
      }
    };

    switch (currentTab) {
      case 'dashboard': {
        const totalCampaigns = campaigns.length;
        const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
        const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
        const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
        const applicationsReceived = applications.length;
        const activeCollaborations = workspaces.filter(w => w.status === 'active').length;
        const budgetSpent = workspaces.filter(w => w.status === 'completed' || w.status === 'active').reduce((acc, w) => acc + (w.proposedRate || 1000), 0);
        const unreadNotifications = notifications.filter(n => !n.isRead).length;

        const recentApplications = [...applications].slice(0, 4);
        const recentCampaigns = [...campaigns].slice(0, 3);
        const recentMessages = [...inboxThreads].slice(0, 3);
        const recentNotificationsList = [...notifications].slice(0, 4);

        const upcomingDeadlines = [];
        workspaces.filter(w => w.status === 'active').forEach(w => {
          const projDeadline = w.projectId?.deadline;
          if (projDeadline) {
            upcomingDeadlines.push({
              title: `Wrap-up for: ${w.projectId.title}`,
              date: new Date(projDeadline),
              creatorName: w.creatorId?.name,
              type: 'Campaign Deadline'
            });
          }
          w.milestones?.filter(m => m.status !== 'approved').forEach(m => {
            if (m.dueDate) {
              upcomingDeadlines.push({
                title: `${w.projectId?.title} - ${m.title}`,
                date: new Date(m.dueDate),
                creatorName: w.creatorId?.name,
                type: 'Milestone Due'
              });
            }
          });
        });
        upcomingDeadlines.sort((a, b) => a.date - b.date);
        const displayedDeadlines = upcomingDeadlines.slice(0, 3);

        const campaignNames = campaigns.map(c => c.title.substring(0, 15));
        const campaignMaxBudgets = campaigns.map(c => c.budget?.max || 1000);
        const campaignSpend = campaigns.map(c => {
          const relatedWorkspaces = workspaces.filter(w => w.projectId?._id === c._id || w.projectId === c._id);
          return relatedWorkspaces.reduce((acc, w) => acc + (w.proposedRate || 1000), 0);
        });

        const perfChartData = {
          labels: campaignNames.length > 0 ? campaignNames : ['Sponsor Alpha', 'Brief Beta'],
          datasets: [
            {
              label: 'Allocated Budget ($)',
              data: campaignMaxBudgets.length > 0 ? campaignMaxBudgets : [1500, 3000],
              backgroundColor: 'rgba(var(--primary-rgb), 0.4)',
              borderColor: 'var(--primary)',
              borderWidth: 1,
              borderRadius: 6
            },
            {
              label: 'Committed Spend ($)',
              data: campaignSpend.length > 0 ? campaignSpend : [1000, 2000],
              backgroundColor: '#10b981',
              borderRadius: 6
            }
          ]
        };

        return (
          <div className="animate-fade-in-up container-fluid p-0">
            {/* Studio Header Banner */}
            <div style={{
              padding: '24px 28px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
              marginBottom: '24px'
            }}>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                    Welcome to Brand Enterprise Studio, {user.name}! 🏢
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '6px 0 0 0', fontWeight: 500 }}>
                    Overview of active marketing briefs, creator proposals, campaign spend, and escrow payouts.
                  </p>
                </div>
                <button onClick={() => setSearchParams({ tab: 'create' })} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <PlusCircle size={18} /> Post New Campaign Brief
                </button>
              </div>
            </div>

            {/* 8 Stat Cards Grid */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>TOTAL BRIEF CAMPAIGNS</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>{totalCampaigns}</h3>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Published Opportunities</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#047857', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ACTIVE CAMPAIGNS</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#047857', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>{activeCampaigns}</h3>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Live in Creator Marketplace</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--warning)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>DRAFT BRIEFS</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--warning)', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>{draftCampaigns}</h3>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Unpublished Drafts</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--secondary-hover)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>PITCHES RECEIVED</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--secondary-hover)', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>{applicationsReceived}</h3>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Creator Proposals</small>
                </div>
              </div>
            </div>

            {/* 1. Full-Width Parallel Quick Actions Bar */}
            <div style={{
              padding: '24px 28px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
              marginBottom: '28px'
            }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                Brand Enterprise Quick Actions
              </h4>
              <div className="row g-3">
                <div className="col-12 col-sm-6 col-md-3">
                  <button onClick={() => setSearchParams({ tab: 'create' })} style={{
                    padding: '14px 18px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary-hover) 100%)',
                    color: '#ffffff', fontWeight: 800, fontSize: '0.88rem', borderRadius: '12px',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    boxShadow: '0 4px 14px rgba(var(--secondary-rgb), 0.25)', transition: 'all 0.2s ease', width: '100%'
                  }}>
                    <PlusCircle size={18} /> Post New Campaign
                  </button>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Link to="/discover" style={{
                    padding: '14px 18px', background: 'var(--bg-tertiary)', color: 'var(--primary)',
                    border: '1.5px solid var(--border-color)', fontWeight: 800, fontSize: '0.88rem',
                    borderRadius: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'all 0.2s ease', width: '100%'
                  }}>
                    <Compass size={18} /> Search Creators
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <button onClick={() => setSearchParams({ tab: 'applications' })} style={{
                    padding: '14px 18px', background: 'var(--bg-tertiary)', color: 'var(--primary)',
                    border: '1.5px solid var(--border-color)', fontWeight: 800, fontSize: '0.88rem',
                    borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    width: '100%', transition: 'all 0.2s ease'
                  }}>
                    <FileText size={18} /> Pitches Received ({applicationsReceived})
                  </button>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <button onClick={() => setSearchParams({ tab: 'collaborations' })} style={{
                    padding: '14px 18px', background: 'var(--bg-tertiary)', color: 'var(--primary)',
                    border: '1.5px solid var(--border-color)', fontWeight: 800, fontSize: '0.88rem',
                    borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    width: '100%', transition: 'all 0.2s ease'
                  }}>
                    <Briefcase size={18} /> Active Workspaces ({activeCollaborations})
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Equal Parallel Dual-Column Layout (50/50 Grid) */}
            <div className="row g-4 gy-4">
              
              {/* Left Column (col-12 col-lg-6) */}
              <div className="col-12 col-lg-6 d-flex flex-column gap-4">
                
                {/* Recent Applications & Pitches */}
                <div style={{
                  padding: '28px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                      <FileText size={18} style={{ color: 'var(--primary)' }} />
                      Recent Creator Pitches Received
                    </h4>
                    <button onClick={() => setSearchParams({ tab: 'applications' })} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '8px', fontWeight: 800 }}>View All</button>
                  </div>
                  {recentApplications.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>No creator pitches received yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {recentApplications.map((app) => (
                        <div key={app._id} style={{ padding: '18px 20px', background: 'var(--bg-tertiary)', borderRadius: '14px', border: '1.5px solid var(--border-color)' }}>
                          <div className="d-flex justify-content-between align-items-center mb-2" style={{ flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary)', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                {app.creatorId?.profileImage ? <img src={app.creatorId.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} alt="" /> : (app.creatorId?.name ? app.creatorId.name.substring(0, 2).toUpperCase() : 'C')}
                              </div>
                              <div>
                                <h5 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{app.creatorId?.name || 'Creator'}</h5>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Brief: {app.projectId?.title || app.campaignId?.title}</span>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#047857' }}>₹{app.proposedRate ? app.proposedRate.toLocaleString() : '50,000'}</span>
                          </div>
                          <p style={{ fontSize: '0.84rem', color: '#475569', margin: '8px 0 10px 0', lineHeight: '1.5' }}>"{app.pitch?.substring(0, 85)}..."</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Campaign Performance Bar Chart */}
                <div style={{
                  padding: '28px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: '20px', color: 'var(--text-primary)' }}>
                    Campaign Budget Allocation &amp; Committed Spend ($)
                  </h4>
                  <div style={{ height: '240px', position: 'relative' }}>
                    <BarChart data={perfChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

              </div>

              {/* Right Column (col-12 col-lg-6) */}
              <div className="col-12 col-lg-6 d-flex flex-column gap-4">
                
                {/* Recent Notifications */}
                <div style={{
                  padding: '28px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                      <Bell size={18} style={{ color: 'var(--primary)' }} />
                      Activity Alerts &amp; Notifications
                    </h4>
                    <button onClick={() => setSearchParams({ tab: 'notifications' })} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '8px', fontWeight: 800 }}>View All</button>
                  </div>
                  {recentNotificationsList.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>No alerts found in feed.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recentNotificationsList.map((notif) => (
                        <div key={notif._id} style={{
                          padding: '16px 18px', background: notif.isRead ? 'var(--bg-tertiary)' : '#f5e9e6',
                          borderRadius: '14px', border: notif.isRead ? '1.5px solid var(--border-color)' : '1.5px solid #bfdbfe'
                        }}>
                          <h5 style={{ fontSize: '0.88rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{notif.title}</h5>
                          <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>{notif.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Messages */}
                <div style={{
                  padding: '28px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                      <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
                      Recent Direct Messages
                    </h4>
                    <button onClick={() => setSearchParams({ tab: 'messages' })} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '8px', fontWeight: 800 }}>Open Inbox</button>
                  </div>
                  {recentMessages.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>No active creator chats.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recentMessages.map((thread) => (
                        <div
                          key={thread.workspaceId}
                          onClick={() => selectThread(thread)}
                          style={{
                            padding: '16px 18px', borderRadius: '14px',
                            background: 'var(--bg-tertiary)', cursor: 'pointer',
                            border: '1.5px solid var(--border-color)', transition: 'all 0.2s ease'
                          }}
                        >
                          <div className="d-flex gap-3 align-items-center">
                            <div style={{
                              width: '40px', height: '40px', borderRadius: '12px',
                              background: 'var(--primary)', color: '#ffffff', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900, flexShrink: 0
                            }}>
                              {thread.partnerAvatar ? (
                                <img src={thread.partnerAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} alt="" />
                              ) : (
                                thread.partnerName?.substring(0, 2).toUpperCase()
                              )}
                            </div>
                            <div style={{ flexGrow: 1, minWidth: 0 }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.partnerName}</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{thread.lastMessageText}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Deadlines */}
                <div style={{
                  padding: '28px', borderRadius: '20px', background: '#ffffff',
                  border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
                }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <Calendar size={18} style={{ color: 'var(--primary)' }} />
                    Upcoming Milestone Deadlines
                  </h4>
                  {displayedDeadlines.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No pending milestone deadlines found.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {displayedDeadlines.map((dead, idx) => (
                        <div key={idx} style={{ padding: '14px 18px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1.5px solid var(--border-color)', borderLeft: '4px solid #dc2626' }}>
                          <h5 style={{ fontSize: '0.88rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{dead.title}</h5>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            <span>Creator: <strong>{dead.creatorName}</strong></span>
                            <span style={{ color: '#dc2626', fontWeight: 800 }}>Due: {dead.date.toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        );
      }

      case 'profile':
        return (
          <form onSubmit={handleUpdateProfile} className="glass-panel animate-fade-in-up" style={{ padding: '32px', maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Company Profile Settings
            </h3>

            {saveSuccess && (
              <div style={{ color: 'var(--success)', background: 'var(--success-glow)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {/* Account Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Account Representative Name</label>
                <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Avatar Image URL</label>
                <input type="text" className="form-input" value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="https://..." />
              </div>
            </div>

            {/* Company Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input type="text" className="form-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Industry Sector</label>
                <input type="text" className="form-input" value={brandIndustry} onChange={(e) => setBrandIndustry(e.target.value)} placeholder="Tech, Fashion, Food, etc." />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input type="url" className="form-input" value={brandWebsite} onChange={(e) => setBrandWebsite(e.target.value)} placeholder="https://example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Representative Password (blank to keep current)</label>
                <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Company Description</label>
              <textarea rows="4" className="form-input" value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} placeholder="Summarize your company's focus and core target audience..." />
            </div>

            {/* Social Handles */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', marginTop: '32px' }}>Social Accounts Links</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Instagram Handle</label>
                <input type="text" className="form-input" value={brandInsta} onChange={(e) => setBrandInsta(e.target.value)} placeholder="@handle" />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter/X Handle</label>
                <input type="text" className="form-input" value={brandTwitter} onChange={(e) => setBrandTwitter(e.target.value)} placeholder="@handle" />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">LinkedIn Company Handle</label>
                <input type="text" className="form-input" value={brandLinkedin} onChange={(e) => setBrandLinkedin(e.target.value)} placeholder="company-name" />
              </div>
              <div className="form-group">
                <label className="form-label">Facebook Profile URL Handle</label>
                <input type="text" className="form-input" value={brandFacebook} onChange={(e) => setBrandFacebook(e.target.value)} placeholder="page-handle" />
              </div>
            </div>

            {/* Showcase gallery */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', marginTop: '32px' }}>Company Portfolio Media</h4>
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Gallery Showcase Images (comma separated URLs)</label>
              <textarea rows="2" className="form-input" value={brandImages} onChange={(e) => setBrandImages(e.target.value)} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Save size={18} />
              Save Company Profile
            </button>
          </form>
        );

      case 'create':
        return (
          <form onSubmit={handleCreateCampaign} className="glass-panel animate-fade-in-up" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{editingCampaignId ? 'Edit Campaign Opportunity' : 'Post Campaign Opportunity Brief'}</span>
              {editingCampaignId && (
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  onClick={() => {
                    setEditingCampaignId(null);
                    setTitle('');
                    setDescription('');
                    setBudgetMin('');
                    setBudgetMax('');
                    setNicheInput('');
                    setPlatformsInput('');
                    setDeliverablesInput('');
                    setCreatorsRequiredInput(1);
                    setDeadlineInput('');
                    setLocationInput('');
                    setRequirementsInput('');
                    setIsRemoteInput(true);
                    setProductName('');
                    setPaymentPerCreator('');
                    setMinFollowers('');
                    setMinEngagementRate('');
                    setPreferredCreatorCategory('');
                    setCampaignLanguage('');
                    setAppDeadline('');
                    setStartDate('');
                    setEndDate('');
                    setSubmissionDeadline('');
                    setProductImages('');
                    setBrandGuidelines('');
                    setCampaignStatus('active');
                    setSearchParams({ tab: 'campaigns' });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </h3>

            {saveSuccess && (
              <div style={{ color: 'var(--success)', background: 'var(--success-glow)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} />
                <span>Campaign brief processed successfully!</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Campaign Title</label>
                <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Sponsorship for Fitness Influencers" required />
              </div>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" className="form-input" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. HydroFlask Neon Edition" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Campaign Description</label>
              <textarea rows="4" className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide detailed guidelines about the campaign opportunity..." required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Target Platforms (comma separated)</label>
                <input type="text" className="form-input" value={platformsInput} onChange={(e) => setPlatformsInput(e.target.value)} placeholder="Instagram, YouTube, TikTok" required />
              </div>
              <div className="form-group">
                <label className="form-label">Niche/Category (comma separated)</label>
                <input type="text" className="form-input" value={nicheInput} onChange={(e) => setNicheInput(e.target.value)} placeholder="Fitness, Technology, Lifestyle" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Min Budget ($)</label>
                <input type="number" className="form-input" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="500" required />
              </div>
              <div className="form-group">
                <label className="form-label">Max Budget ($)</label>
                <input type="number" className="form-input" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="2500" required />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Per Creator ($)</label>
                <input type="number" className="form-input" value={paymentPerCreator} onChange={(e) => setPaymentPerCreator(e.target.value)} placeholder="300" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Number of Creators Required</label>
                <input type="number" className="form-input" value={creatorsRequiredInput} onChange={(e) => setCreatorsRequiredInput(e.target.value)} placeholder="3" min="1" required />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Creator Niche/Category</label>
                <input type="text" className="form-input" value={preferredCreatorCategory} onChange={(e) => setPreferredCreatorCategory(e.target.value)} placeholder="e.g. Micro-influencer, Tech Geek" />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Language</label>
                <input type="text" className="form-input" value={campaignLanguage} onChange={(e) => setCampaignLanguage(e.target.value)} placeholder="e.g. English, Spanish" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Minimum Followers Required</label>
                <input type="number" className="form-input" value={minFollowers} onChange={(e) => setMinFollowers(e.target.value)} placeholder="10000" />
              </div>
              <div className="form-group">
                <label className="form-label">Minimum Engagement Rate (%)</label>
                <input type="number" step="0.1" className="form-input" value={minEngagementRate} onChange={(e) => setMinEngagementRate(e.target.value)} placeholder="3.5" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Target Location / Country</label>
                <input type="text" className="form-input" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} placeholder="United States, Worldwide" />
              </div>
              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input type="date" className="form-input" value={appDeadline} onChange={(e) => setAppDeadline(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Campaign Start Date</label>
                <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Campaign End Date</label>
                <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Submission Deadline</label>
                <input type="date" className="form-input" value={submissionDeadline} onChange={(e) => setSubmissionDeadline(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Deliverables List (comma separated)</label>
                <input type="text" className="form-input" value={deliverablesInput} onChange={(e) => setDeliverablesInput(e.target.value)} placeholder="1 Video Post, 2 Stories, 1 Link in Bio" required />
              </div>
              <div className="form-group">
                <label className="form-label">Additional Requirements (comma separated)</label>
                <input type="text" className="form-input" value={requirementsInput} onChange={(e) => setRequirementsInput(e.target.value)} placeholder="Active engagement rate > 3%" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Product Image Links (comma separated URLs)</label>
              <textarea rows="2" className="form-input" value={productImages} onChange={(e) => setProductImages(e.target.value)} placeholder="https://example.com/prod1.jpg, https://example.com/prod2.jpg" />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Brand Guidelines / Instructions</label>
              <textarea rows="3" className="form-input" value={brandGuidelines} onChange={(e) => setBrandGuidelines(e.target.value)} placeholder="Describe styling rules, taglines, dos and don'ts..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                  <input type="checkbox" checked={isRemoteInput} onChange={(e) => setIsRemoteInput(e.target.checked)} style={{ width: '18px', height: '18px', margin: 0 }} />
                  <span>Remote Collaboration Campaign Opportunity</span>
                </label>
              </div>
              
              {editingCampaignId && (
                <div className="form-group">
                  <label className="form-label">Campaign Status</label>
                  <select className="form-input" value={campaignStatus} onChange={(e) => setCampaignStatus(e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="active">Active (Published)</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed (Closed)</option>
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              {editingCampaignId ? (
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, justifyContent: 'center' }} disabled={creating}>
                  <Save size={18} />
                  {creating ? 'Saving Changes...' : 'Save All Changes'}
                </button>
              ) : (
                <>
                  <button type="button" onClick={(e) => handleCreateOrUpdate(e, 'active')} className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, justifyContent: 'center' }} disabled={creating}>
                    <Send size={18} />
                    {creating ? 'Publishing...' : 'Publish Campaign'}
                  </button>
                  <button type="button" onClick={(e) => handleCreateOrUpdate(e, 'draft')} className="btn btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, justifyContent: 'center' }} disabled={creating}>
                    <FileText size={18} />
                    {creating ? 'Saving...' : 'Save as Draft'}
                  </button>
                </>
              )}
            </div>
          </form>
        );

      case 'campaigns':
        return (
          <div className="animate-fade-in-up">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>My Sponsorship Campaigns</h3>
            <div className="grid-container" style={{ gridTemplateColumns: inspectedCampaign ? '1fr 1.2fr' : '1fr', gap: '32px' }}>
              
              {/* Left Column: list of campaigns posted */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {campaigns.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No campaign briefs posted yet.</p>
                ) : (
                  campaigns.map((camp) => {
                    const isSelected = inspectedCampaign?._id === camp._id;
                    return (
                      <div
                        key={camp._id}
                        className="glass-panel"
                        style={{
                          padding: '20px',
                          cursor: 'pointer',
                          borderLeft: isSelected ? '4px solid var(--primary)' : '1px solid var(--border-color)',
                          background: isSelected ? 'var(--primary-glow)' : 'var(--bg-panel)'
                        }}
                        onClick={() => inspectCampaignApplicants(camp)}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h4 style={{ fontWeight: 800, margin: 0 }}>{camp.title}</h4>
                          {getStatusBadge(camp.status)}
                        </div>
                        <div className="d-flex flex-wrap gap-3" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span>Budget: <strong>${camp.budget?.min} - ${camp.budget?.max}</strong></span>
                          <span>Hires Required: <strong>{camp.creatorsRequired || 1}</strong></span>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                          <button
                            className="btn btn-outline"
                            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              inspectCampaignApplicants(camp);
                            }}
                          >
                            View Incoming Pitches
                          </button>
                          
                          <div className="d-flex gap-2 align-items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEditCampaign(camp);
                              }}
                              className="btn btn-icon"
                              style={{ color: 'var(--secondary)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                              title="Edit Campaign"
                            >
                              <EditIcon size={14} />
                            </button>

                            {camp.status === 'draft' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatusOnly(camp._id, 'active');
                                }}
                                className="btn btn-icon"
                                style={{ color: 'var(--success)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                title="Publish Campaign"
                              >
                                <Send size={14} />
                              </button>
                            )}

                            {camp.status === 'active' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusOnly(camp._id, 'paused');
                                  }}
                                  className="btn btn-icon"
                                  style={{ color: 'var(--warning)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                  title="Pause Campaign"
                                >
                                  <Pause size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusOnly(camp._id, 'completed');
                                  }}
                                  className="btn btn-icon"
                                  style={{ color: 'var(--danger)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                  title="Close Campaign"
                                >
                                  <XCircle size={14} />
                                </button>
                              </>
                            )}

                            {camp.status === 'paused' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusOnly(camp._id, 'active');
                                  }}
                                  className="btn btn-icon"
                                  style={{ color: 'var(--success)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                  title="Resume Campaign"
                                >
                                  <Play size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusOnly(camp._id, 'completed');
                                  }}
                                  className="btn btn-icon"
                                  style={{ color: 'var(--danger)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                  title="Close Campaign"
                                >
                                  <XCircle size={14} />
                                </button>
                              </>
                            )}

                            {(camp.status === 'draft' || camp.status === 'completed') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCampaignOnly(camp._id);
                                }}
                                className="btn btn-icon"
                                style={{ color: 'var(--danger)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                title="Delete Campaign"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: inspected campaign applicants */}
              {inspectedCampaign && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={20} style={{ color: 'var(--primary)' }} />
                    Applicants for: {inspectedCampaign.title}
                  </h4>
                  
                  {campaignApplicants.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: '20px 0 0 0' }}>No creators have applied to this brief yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {campaignApplicants.map((app) => {
                        const creator = app.creatorId || {};
                        const profile = creator.creatorProfile || {};
                        const matchScore = calculateMatchScore(inspectedCampaign, profile);
                        const rating = app.creatorRating || 5.0;
                        const previousCollaborations = app.previousCollaborationsCount || 0;

                        return (
                          <div key={app._id} className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                              <div className="d-flex align-items-center gap-3">
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border-color)', overflow: 'hidden', border: '2px solid var(--primary-glow)' }}>
                                  {creator.profileImage ? (
                                    <img src={creator.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                  ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>C</div>
                                  )}
                                </div>
                                <div>
                                  <div className="d-flex align-items-center gap-2">
                                    <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>{creator.name}</h5>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                      ★ {rating}
                                    </span>
                                  </div>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>
                                    Category: <strong>{profile.category || 'Influencer'}</strong>
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <span className={`badge badge-${app.status}`} style={{ textTransform: 'capitalize' }}>
                                {app.status}
                              </span>
                            </div>

                            {/* Creator Statistics & Matching Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', padding: '12px', background: 'var(--bg-panel)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                              <div style={{ fontSize: '0.78rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Reach Reach:</span> <strong style={{ color: 'var(--text-main)' }}>{profile.followersCount?.toLocaleString() || 'N/A'}</strong>
                              </div>
                              <div style={{ fontSize: '0.78rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Engagement Rate:</span> <strong style={{ color: 'var(--text-main)' }}>{profile.avgEngagement ? profile.avgEngagement + '%' : 'N/A'}</strong>
                              </div>
                              <div style={{ fontSize: '0.78rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Primary Channel:</span> <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{profile.primaryPlatform || 'N/A'}</strong>
                              </div>
                              <div style={{ fontSize: '0.78rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Past Collaborations:</span> <strong style={{ color: 'var(--success)' }}>{previousCollaborations} Completed</strong>
                              </div>
                              <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Campaign Match Score:</span>
                                <span className="badge" style={{ background: matchScore >= 80 ? 'var(--success-glow)' : 'var(--primary-glow)', color: matchScore >= 80 ? 'var(--success)' : 'var(--primary)', fontWeight: 800 }}>
                                  {matchScore}% Match
                                </span>
                              </div>
                            </div>

                            {/* Pitch proposal brief text */}
                            <div style={{ marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-panel)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', letterSpacing: '0.05em' }}>PITCH BRIEF PROPOSAL</span>
                              "{app.pitch}"
                            </div>

                            <div style={{ display: 'flex', justifycontent: 'space-between', alignitems: 'center', marginTop: '14px', fontSize: '0.82rem' }}>
                              <span>Proposed Compensation: <strong style={{ color: 'var(--success)', fontSize: '0.95rem' }}>${app.proposedRate}</strong></span>
                            </div>

                            {/* Action Buttons list */}
                            <div className="d-flex flex-wrap gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                              <Link
                                to={`/creators/${creator._id}`}
                                target="_blank"
                                className="btn btn-outline"
                                style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Eye size={12} /> View Profile
                              </Link>
                              
                              <button
                                onClick={() => handleStartMessagingCreator(creator._id, inspectedCampaign._id, creator.name)}
                                className="btn btn-outline"
                                style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <MessageSquare size={12} /> Message Creator
                              </button>

                              {(app.status === 'pending' || app.status === 'shortlisted') && (
                                <>
                                  <button
                                    onClick={() => handleApplicationStatus(app._id, 'approved')}
                                    className="btn btn-primary"
                                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                  >
                                    Accept
                                  </button>
                                  
                                  {app.status === 'pending' && (
                                    <button
                                      onClick={() => handleApplicationStatus(app._id, 'shortlisted')}
                                      className="btn btn-outline"
                                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                    >
                                      Shortlist
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleApplicationStatus(app._id, 'rejected')}
                                    className="btn btn-outline"
                                    style={{ padding: '6px 12px', fontSize: '0.78rem', color: 'var(--danger)', borderColor: 'var(--danger-glow)' }}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {/* Invite to Another Campaign dropdown */}
                              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const selectedCamp = campaigns.find(c => c._id === e.target.value);
                                      if (selectedCamp) {
                                        handleInviteToAnotherCampaign(creator._id, selectedCamp._id, selectedCamp.title);
                                      }
                                      e.target.value = ''; // Reset select dropdown
                                    }
                                  }}
                                  className="form-input"
                                  style={{ fontSize: '0.78rem', padding: '6px 12px', width: 'auto', marginBottom: 0 }}
                                >
                                  <option value="">Invite to Campaign...</option>
                                  {campaigns
                                    .filter(c => c._id !== inspectedCampaign._id)
                                    .map(c => (
                                      <option key={c._id} value={c._id}>{c.title}</option>
                                    ))
                                  }
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'applications': {
        const appFilterTabs = [
          { key: 'all', label: 'All Applications' },
          { key: 'pending', label: 'Pending Review' },
          { key: 'shortlisted', label: 'Shortlisted' },
          { key: 'approved', label: 'Accepted & Hired' },
          { key: 'rejected', label: 'Rejected' }
        ];

        const filteredApplications = appSubTab === 'all'
          ? applications
          : applications.filter(a => a.status === appSubTab);

        const pendingCount = applications.filter(a => a.status === 'pending').length;
        const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
        const approvedCount = applications.filter(a => a.status === 'approved').length;
        const rejectedCount = applications.filter(a => a.status === 'rejected').length;

        return (
          <div className="animate-fade-in-up container-fluid p-0">
            {/* Top Studio Header Banner */}
            <div style={{
              padding: '28px', borderRadius: '20px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
              marginBottom: '24px'
            }}>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)", display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={22} style={{ color: 'var(--primary)' }} />
                    Creator Pitches &amp; Application Center 📩
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '6px 0 0 0', fontWeight: 500 }}>
                    Evaluate incoming creator proposals, view engagement metrics, review AI match scores, and hire top talent.
                  </p>
                </div>
                <button
                  onClick={() => setSearchParams({ tab: 'campaigns' })}
                  style={{
                    padding: '10px 20px', borderRadius: '10px', background: 'var(--bg-tertiary)',
                    color: 'var(--primary)', border: '1.5px solid var(--border-color)', fontSize: '0.85rem',
                    fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  <Briefcase size={16} /> View My Campaigns
                </button>
              </div>
            </div>

            {/* Summary Stat Metric Cards (4 Cards) */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>TOTAL RECEIVED</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>{applications.length}</h3>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>All Applications</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--warning)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>PENDING REVIEW</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--warning)', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>{pendingCount}</h3>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Needs Action</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--secondary-hover)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>SHORTLISTED</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--secondary-hover)', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>{shortlistedCount}</h3>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Saved Candidates</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1.5px solid var(--border-color)', boxShadow: '0 2px 10px rgba(var(--text-primary-rgb), 0.04)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#047857', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ACCEPTED &amp; HIRED</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#047857', margin: '8px 0 4px 0', fontFamily: "'Playfair Display', var(--font-sans)" }}>{approvedCount}</h3>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Active Sponsorships</small>
                </div>
              </div>
            </div>

            {/* Filter Sub-Tabs */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {appFilterTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setAppSubTab(tab.key)}
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.85rem',
                    background: appSubTab === tab.key ? 'var(--primary)' : '#ffffff',
                    color: appSubTab === tab.key ? '#ffffff' : '#475569',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '30px',
                    fontWeight: appSubTab === tab.key ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: appSubTab === tab.key ? '0 4px 12px rgba(var(--primary-rgb), 0.2)' : 'none'
                  }}
                >
                  {tab.label}
                  {tab.key !== 'all' && (
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      background: appSubTab === tab.key ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                      color: appSubTab === tab.key ? '#ffffff' : 'var(--text-muted)',
                      fontWeight: 800
                    }}>
                      {tab.key === 'pending' ? pendingCount : tab.key === 'shortlisted' ? shortlistedCount : tab.key === 'approved' ? approvedCount : rejectedCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', background: '#ffffff', borderRadius: '20px', border: '1.5px solid var(--border-color)' }}>
                <FileText size={48} style={{ color: '#cbd5e1', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
                <h4 style={{ fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>No pitches found</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                  {appSubTab === 'all'
                    ? 'No creator applications received yet. Publish campaigns to start receiving pitches.'
                    : `No ${appSubTab} applications found in this filter.`}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredApplications.map((app) => {
                  const creator = app.creatorId || {};
                  const profile = creator.creatorProfile || {};
                  const matchScore = calculateMatchScore(app.projectId, profile);
                  const rating = app.creatorRating || 4.9;
                  const previousCollaborations = app.previousCollaborationsCount || 0;

                  return (
                    <div key={app._id} style={{
                      padding: '28px', borderRadius: '20px', background: '#ffffff',
                      border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.04)'
                    }}>
                      
                      {/* Campaign Brief Title Tag */}
                      {app.projectId?.title && (
                        <div style={{ marginBottom: '18px', padding: '6px 14px', background: '#f5e9e6', border: '1px solid #bfdbfe', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <Briefcase size={14} style={{ color: 'var(--primary)' }} />
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)' }}>
                            Campaign Brief: {app.projectId?.title}
                          </span>
                        </div>
                      )}

                      {/* Creator Header Row */}
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                        <div className="d-flex align-items-center gap-3">
                          {/* Creator Avatar */}
                          <div style={{
                            width: '56px', height: '56px', borderRadius: '16px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary-hover) 100%)',
                            color: '#ffffff', fontWeight: 900, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                            flexShrink: 0, overflow: 'hidden', border: '2px solid var(--border-color)'
                          }}>
                            {creator.profileImage ? (
                              <img src={creator.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={creator.name} />
                            ) : (
                              creator.name?.charAt(0)?.toUpperCase() || 'C'
                            )}
                          </div>

                          {/* Creator Info */}
                          <div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <h5 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{creator.name || 'Creator'}</h5>
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--warning)', background: '#fef3c7', padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                ★ {rating}
                              </span>
                              <span style={{ fontSize: '0.78rem', padding: '2px 10px', background: '#f1f5f9', borderRadius: '20px', border: '1px solid var(--border-color)', color: '#475569', fontWeight: 700, textTransform: 'capitalize' }}>
                                {profile.category || 'Influencer'}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                              Pitched on {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="d-flex flex-column align-items-end gap-1">
                          <span style={{
                            padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800,
                            background: app.status === 'approved' ? '#dcfce7' : app.status === 'rejected' ? '#fee2e2' : app.status === 'shortlisted' ? '#fef3c7' : '#e0f2fe',
                            color: app.status === 'approved' ? '#047857' : app.status === 'rejected' ? '#dc2626' : app.status === 'shortlisted' ? 'var(--warning)' : '#0369a1',
                            border: '1px solid currentColor'
                          }}>
                            {app.status === 'approved' ? '✓ Accepted & Hired' : app.status === 'rejected' ? '✗ Rejected' : app.status === 'shortlisted' ? '⭐ Shortlisted' : '⏳ Pending Review'}
                          </span>
                        </div>
                      </div>

                      {/* Metrics 4-Box Grid */}
                      <div className="row g-2 mb-3">
                        <div className="col-6 col-md-3">
                          <div style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1.5px solid var(--border-color)', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>AUDIENCE REACH</span>
                            <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--primary)' }}>
                              {profile.followersCount
                                ? profile.followersCount >= 1000000
                                  ? (profile.followersCount / 1000000).toFixed(1) + 'M'
                                  : profile.followersCount >= 1000
                                    ? (profile.followersCount / 1000).toFixed(1) + 'K'
                                    : profile.followersCount
                                : '150K'}
                            </strong>
                          </div>
                        </div>

                        <div className="col-6 col-md-3">
                          <div style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1.5px solid var(--border-color)', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>ENGAGEMENT INDEX</span>
                            <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: '#047857' }}>
                              {profile.avgEngagement ? profile.avgEngagement + '%' : '4.8%'}
                            </strong>
                          </div>
                        </div>

                        <div className="col-6 col-md-3">
                          <div style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1.5px solid var(--border-color)', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>MATCH SCORE</span>
                            <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: matchScore >= 80 ? '#047857' : 'var(--warning)' }}>
                              {matchScore}% Match
                            </strong>
                          </div>
                        </div>

                        <div className="col-6 col-md-3">
                          <div style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1.5px solid var(--border-color)', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>PROPOSED RATE</span>
                            <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: '#047857' }}>
                              ₹{app.proposedRate ? app.proposedRate.toLocaleString() : '50,000'}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Pitch Proposal Excerpt Quote Box */}
                      <div style={{
                        padding: '18px 20px', background: 'var(--bg-tertiary)', borderRadius: '14px',
                        border: '1.5px solid var(--border-color)', borderLeft: '4px solid var(--primary)',
                        marginBottom: '20px'
                      }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.06em', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                          PROPOSAL PITCH BRIEF
                        </span>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary)', lineHeight: '1.6', fontStyle: 'italic', fontWeight: 500 }}>
                          "{app.pitch || 'Excited to collaborate on this campaign! I have extensive experience crafting viral promotional videos in this niche.'}"
                        </p>
                      </div>

                      {/* Action Buttons Bar */}
                      <div className="d-flex flex-wrap gap-2 pt-3" style={{ borderTop: '1.5px solid #f1f5f9' }}>
                        <Link
                          to={`/creators/${creator._id}`}
                          target="_blank"
                          style={{
                            padding: '8px 16px', fontSize: '0.82rem', fontWeight: 800,
                            borderRadius: '10px', background: 'var(--bg-tertiary)', color: 'var(--primary)',
                            border: '1.5px solid var(--border-color)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px'
                          }}
                        >
                          <Eye size={14} /> View Creator Profile
                        </Link>

                        <button
                          onClick={() => handleStartMessagingCreator(creator._id, app.projectId?._id || app.projectId, creator.name)}
                          style={{
                            padding: '8px 16px', fontSize: '0.82rem', fontWeight: 800,
                            borderRadius: '10px', background: 'var(--bg-tertiary)', color: 'var(--primary)',
                            border: '1.5px solid var(--border-color)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                          }}
                        >
                          <MessageSquare size={14} /> Message Creator
                        </button>

                        {app.status !== 'approved' && app.status !== 'rejected' && (
                          <>
                            <button
                              onClick={() => handleApplicationStatus(app._id, 'approved')}
                              style={{
                                padding: '8px 18px', fontSize: '0.82rem', fontWeight: 800,
                                borderRadius: '10px', background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
                                color: '#ffffff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                              }}
                            >
                              <CheckCircle2 size={14} /> Accept &amp; Hire
                            </button>

                            {app.status !== 'shortlisted' && (
                              <button
                                onClick={() => handleApplicationStatus(app._id, 'shortlisted')}
                                style={{
                                  padding: '8px 16px', fontSize: '0.82rem', fontWeight: 800,
                                  borderRadius: '10px', background: '#fef3c7', color: 'var(--warning)',
                                  border: '1.5px solid #fde68a', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                                }}
                              >
                                <Bookmark size={14} /> Shortlist Candidate
                              </button>
                            )}

                            <button
                              onClick={() => handleApplicationStatus(app._id, 'rejected')}
                              style={{
                                padding: '8px 16px', fontSize: '0.82rem', fontWeight: 800,
                                borderRadius: '10px', background: '#fee2e2', color: '#dc2626',
                                border: '1.5px solid #fecaca', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                              }}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </>
                        )}

                        {(app.status === 'approved' || app.status === 'rejected') && (
                          <button
                            onClick={() => handleApplicationStatus(app._id, 'pending')}
                            style={{
                              padding: '8px 16px', fontSize: '0.82rem', fontWeight: 800,
                              borderRadius: '10px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)',
                              border: '1.5px solid var(--border-color)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                            }}
                          >
                            <Clock size={14} /> Move to Pending
                          </button>
                        )}

                        {/* Invite to Another Campaign Dropdown */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 'auto' }}>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                const selectedCamp = campaigns.find(c => c._id === e.target.value);
                                if (selectedCamp) {
                                  handleInviteToAnotherCampaign(creator._id, selectedCamp._id, selectedCamp.title);
                                }
                                e.target.value = '';
                              }
                            }}
                            style={{
                              fontSize: '0.82rem', fontWeight: 700, padding: '8px 14px',
                              borderRadius: '10px', border: '1.5px solid var(--border-color)',
                              background: '#ffffff', color: 'var(--primary)', cursor: 'pointer'
                            }}
                          >
                            <option value="">📩 Invite Creator to Another Brief...</option>
                            {campaigns
                              .filter(c => {
                                const appProjectId = typeof app.projectId === 'object' ? app.projectId?._id : app.projectId;
                                return c._id !== appProjectId;
                              })
                              .map(c => (
                                <option key={c._id} value={c._id}>{c.title}</option>
                              ))
                            }
                          </select>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'collaborations':
      case 'active-collaborations': {
        const activeWS = workspaces.filter(ws => ws.status === 'active');
        const completedWS = workspaces.filter(ws => ws.status === 'completed');
        const totalEscrowFunded = workspaces.reduce((acc, ws) => acc + (ws.agreedRate || ws.projectId?.budget?.max || ws.proposedRate || 50000), 0);

        const filteredWorkspaces = collabSubTab === 'completed'
          ? completedWS
          : (collabSubTab === 'active' ? activeWS : workspaces);

        return (
          <div className="animate-fade-in-up container-fluid p-0">
            {/* Top Executive Header Banner */}
            <div style={{
              padding: '28px', borderRadius: '24px', background: '#ffffff',
              border: '1.5px solid var(--border-color)', boxShadow: '0 4px 25px rgba(var(--text-primary-rgb), 0.05)',
              marginBottom: '24px'
            }}>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)", display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Briefcase size={24} style={{ color: 'var(--primary)' }} />
                    Brand Sponsorship Workspaces Center 💼
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '6px 0 0 0', fontWeight: 500 }}>
                    Track active creator sponsorships, review submitted content proofs, request revisions, and manage escrow payouts.
                  </p>
                </div>
                
                {/* 3 KPI Summary Pills */}
                <div className="d-flex flex-wrap gap-2">
                  <div style={{ padding: '8px 16px', background: '#f5e9e6', borderRadius: '12px', border: '1px solid #bfdbfe', fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)' }}>
                    💼 Active Workspaces: <strong>{activeWS.length}</strong>
                  </div>
                  <div style={{ padding: '8px 16px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', fontSize: '0.82rem', fontWeight: 800, color: '#047857' }}>
                    💰 Total Escrow Value: <strong>₹{totalEscrowFunded.toLocaleString()}</strong>
                  </div>
                  <div style={{ padding: '8px 16px', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a', fontSize: '0.82rem', fontWeight: 800, color: 'var(--warning)' }}>
                    ✅ Completed Collabs: <strong>{completedWS.length}</strong>
                  </div>
                </div>
              </div>

              {/* Sub-Tab Filter Pills */}
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3" style={{ borderTop: '1.5px solid #f1f5f9' }}>
                <div className="d-flex gap-2">
                  {[
                    { key: 'all', label: 'All Workspaces', count: workspaces.length },
                    { key: 'active', label: 'In Progress', count: activeWS.length },
                    { key: 'completed', label: 'Completed', count: completedWS.length }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setCollabSubTab(tab.key)}
                      style={{
                        padding: '8px 18px',
                        fontSize: '0.85rem',
                        background: collabSubTab === tab.key ? 'var(--primary)' : 'var(--bg-tertiary)',
                        color: collabSubTab === tab.key ? '#ffffff' : '#475569',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '30px',
                        fontWeight: collabSubTab === tab.key ? 800 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: collabSubTab === tab.key ? '0 4px 12px rgba(var(--primary-rgb), 0.2)' : 'none'
                      }}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSearchParams({ tab: 'applications' })}
                  style={{
                    padding: '8px 16px', fontSize: '0.82rem', fontWeight: 800,
                    borderRadius: '10px', background: '#ffffff', color: 'var(--primary)',
                    border: '1.5px solid var(--border-color)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <PlusCircle size={14} /> Start New Collaboration
                </button>
              </div>
            </div>

            {/* Workspaces List */}
            {filteredWorkspaces.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1.5px solid var(--border-color)' }}>
                <Briefcase size={52} style={{ color: '#cbd5e1', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
                <h4 style={{ fontWeight: 900, marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1.2rem' }}>No active sponsorship workspaces found</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 20px 0' }}>
                  Accept applications from the "Pitches Received" tab to start active workspaces with creators.
                </p>
                <button
                  onClick={() => setSearchParams({ tab: 'applications' })}
                  style={{
                    padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary-hover) 100%)',
                    color: '#ffffff', border: 'none', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(var(--secondary-rgb), 0.25)'
                  }}
                >
                  View Received Applications
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {filteredWorkspaces.map((ws) => {
                  const creator = ws.creatorId || {};
                  const project = ws.projectId || {};
                  const totalMilestones = ws.milestones?.length || 0;
                  const approvedMilestones = ws.milestones?.filter(m => m.status === 'approved').length || 0;
                  const progressPct = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;
                  const formattedDeadline = project.deadline 
                    ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Flexible Deadline';
                  const rateAmount = ws.agreedRate || project.budget?.max || ws.proposedRate || 50000;
                  const isPaid = ws.paymentStatus === 'paid' || ws.paymentStatus === 'released';

                  return (
                    <div key={ws._id} style={{
                      padding: '32px', borderRadius: '24px', background: '#ffffff',
                      border: '1.5px solid var(--border-color)', boxShadow: '0 4px 25px rgba(var(--text-primary-rgb), 0.05)'
                    }}>
                      {/* Top Header Row */}
                      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3" style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '20px' }}>
                        <div className="d-flex align-items-center gap-3">
                          {/* Creator Avatar */}
                          <div style={{
                            width: '60px', height: '60px', borderRadius: '18px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary-hover) 100%)',
                            color: '#ffffff', fontWeight: 900, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                            flexShrink: 0, overflow: 'hidden', border: '2px solid var(--border-color)',
                            boxShadow: '0 4px 14px rgba(var(--primary-rgb), 0.15)'
                          }}>
                            {creator.profileImage ? (
                              <img src={creator.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={creator.name} />
                            ) : (
                              creator.name?.charAt(0)?.toUpperCase() || 'C'
                            )}
                          </div>

                          {/* Creator Name & Campaign Info */}
                          <div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{creator.name}</h4>
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--warning)', background: '#fef3c7', padding: '2px 8px', borderRadius: '6px' }}>
                                ★ 4.9
                              </span>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({creator.email})</span>
                            </div>
                            <span style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 800, display: 'block', marginTop: '4px' }}>
                              🎯 Campaign: <strong>{project.title || 'Sponsorship Brief Contract'}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Status Badges & Rate */}
                        <div className="d-flex flex-column align-items-end gap-2">
                          <div className="d-flex gap-2">
                            <span style={{
                              padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800,
                              background: ws.status === 'completed' ? '#dcfce7' : '#f5e9e6',
                              color: ws.status === 'completed' ? '#047857' : 'var(--primary)',
                              border: '1px solid currentColor'
                            }}>
                              {ws.status === 'completed' ? '✓ Completed' : '⚡ In Progress'}
                            </span>
                            <span style={{
                              padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800,
                              background: isPaid ? '#dcfce7' : '#fef3c7',
                              color: isPaid ? '#047857' : 'var(--warning)',
                              border: '1px solid currentColor'
                            }}>
                              {isPaid ? '✅ Payment Released' : '🔒 Escrow Secured'}
                            </span>
                          </div>
                          <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#047857', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                            Contract Rate: ₹{rateAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* 2-Column Split Workspace Content Grid */}
                      <div className="row g-4 mb-4">
                        
                        {/* Left Column (col-12 col-lg-5): Brief Overview & Deliverables */}
                        <div className="col-12 col-lg-5 d-flex flex-column gap-3">
                          
                          {/* Progress Card */}
                          <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1.5px solid var(--border-color)' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>COLLABORATION PROGRESS</span>
                              <span style={{ fontSize: '0.88rem', fontWeight: 900, color: 'var(--primary)' }}>{progressPct}% ({approvedMilestones}/{totalMilestones} Approved)</span>
                            </div>
                            <div style={{ height: '10px', background: 'var(--border-color)', borderRadius: '20px', overflow: 'hidden' }}>
                              <div
                                style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary-hover) 100%)', borderRadius: '20px', transition: 'width 0.5s ease' }}
                              ></div>
                            </div>
                          </div>

                          {/* Campaign Brief Quote Box */}
                          <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1.5px solid var(--border-color)', borderLeft: '4px solid var(--primary)' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', display: 'block', fontWeight: 900, letterSpacing: '0.05em', marginBottom: '6px', textTransform: 'uppercase' }}>CAMPAIGN BRIEF SUMMARY</span>
                            <p style={{ fontSize: '0.88rem', color: 'var(--primary)', lineHeight: '1.6', margin: 0, fontStyle: 'italic', fontWeight: 500 }}>
                              "{project.description || 'Campaign specifications and requirements provided to the creator.'}"
                            </p>
                          </div>

                          {/* Deliverables Tags List */}
                          {project.deliverables && project.deliverables.length > 0 && (
                            <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1.5px solid var(--border-color)' }}>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 900, letterSpacing: '0.05em', marginBottom: '10px', textTransform: 'uppercase' }}>REQUIRED DELIVERABLES</span>
                              <div className="d-flex flex-wrap gap-2">
                                {project.deliverables.map((deliv, dIdx) => (
                                  <span key={dIdx} style={{ fontSize: '0.8rem', color: 'var(--primary)', background: '#f5e9e6', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '6px 14px', fontWeight: 700 }}>
                                    ✓ {deliv}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Deadline Tag */}
                          <div style={{ padding: '16px 20px', background: '#fff1f2', borderRadius: '16px', border: '1.5px solid #fecdd3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.78rem', color: '#9f1239', fontWeight: 800, textTransform: 'uppercase' }}>FINAL SUBMISSION DEADLINE</span>
                            <strong style={{ fontSize: '0.92rem', fontWeight: 900, color: '#dc2626' }}>{formattedDeadline}</strong>
                          </div>

                        </div>

                        {/* Right Column (col-12 col-lg-7): Milestones & Deliverables Review */}
                        <div className="col-12 col-lg-7">
                          <div style={{ padding: '24px', background: '#ffffff', borderRadius: '18px', border: '1.5px solid var(--border-color)', height: '100%' }}>
                            <h5 style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Calendar size={18} style={{ color: 'var(--primary)' }} />
                              DELIVERABLES &amp; SUBMISSION TIMELINE
                            </h5>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {ws.milestones?.map((m) => {
                                let mBadgeBg = '#f1f5f9';
                                let mBadgeColor = 'var(--text-muted)';
                                let mLabel = 'Pending Creator Upload';
                                if (m.status === 'approved') { mBadgeBg = '#dcfce7'; mBadgeColor = '#047857'; mLabel = '✓ Approved'; }
                                else if (m.status === 'submitted') { mBadgeBg = '#fef3c7'; mBadgeColor = 'var(--warning)'; mLabel = '🟡 Submitted - Review Needed'; }
                                else if (m.status === 'changes_requested') { mBadgeBg = '#fee2e2'; mBadgeColor = '#dc2626'; mLabel = '🔴 Revisions Requested'; }

                                return (
                                  <div key={m._id} style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: '16px', border: '1.5px solid var(--border-color)' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                                      <h6 style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0, color: 'var(--text-primary)' }}>{m.title}</h6>
                                      <span style={{ fontSize: '0.78rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', background: mBadgeBg, color: mBadgeColor, border: '1px solid currentColor' }}>{mLabel}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '12px', lineHeight: '1.5' }}>{m.description}</p>

                                    {/* Uploaded Content proof output link */}
                                    {m.submissionUrl && (
                                      <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', marginBottom: '14px', border: '1.5px solid var(--border-color)' }}>
                                        <span style={{ color: 'var(--primary)', display: 'block', fontWeight: 900, marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                                          UPLOADED CONTENT PROOF:
                                        </span>
                                        <a href={m.submissionUrl} target="_blank" rel="noopener noreferrer" style={{
                                          color: 'var(--primary)', fontWeight: 800, fontSize: '0.88rem',
                                          display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
                                          background: '#f5e9e6', padding: '8px 14px', borderRadius: '8px', border: '1px solid #bfdbfe'
                                        }}>
                                          <LinkIcon size={14} /> View Content Proof Online <ExternalLink size={12} />
                                        </a>
                                        {m.submissionNotes && (
                                          <p style={{ color: '#475569', marginTop: '10px', margin: '10px 0 0 0', fontStyle: 'italic', fontSize: '0.85rem' }}>
                                            Creator notes: "{m.submissionNotes}"
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {/* Revision Request Feedback Notes */}
                                    {m.status === 'changes_requested' && m.feedbackNotes && (
                                      <div style={{ background: '#fee2e2', padding: '14px', borderRadius: '12px', marginBottom: '14px', fontSize: '0.85rem', border: '1px solid #fecaca', color: '#dc2626' }}>
                                        <strong>Your Revision Instructions:</strong> "{m.feedbackNotes}"
                                      </div>
                                    )}

                                    {/* Deliverable Action Buttons */}
                                    {m.status === 'submitted' && (
                                      <div className="d-flex gap-2 mt-3 flex-wrap">
                                        <button
                                          onClick={() => handleApproveSubmission(ws._id, m._id)}
                                          style={{
                                            padding: '8px 18px', fontSize: '0.82rem', fontWeight: 800,
                                            borderRadius: '10px', background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
                                            color: '#ffffff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                                          }}
                                        >
                                          <CheckCircle size={14} /> Approve Submission
                                        </button>

                                        <button
                                          onClick={() => setChangeRequestModal({ wsId: ws._id, mId: m._id, title: m.title, feedbackNotes: '' })}
                                          style={{
                                            padding: '8px 18px', fontSize: '0.82rem', fontWeight: 800,
                                            borderRadius: '10px', background: '#fef3c7', color: 'var(--warning)',
                                            border: '1.5px solid #fde68a', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                                          }}
                                        >
                                          <RefreshCw size={14} /> Request Revisions
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Overall Footer Action Toolbar */}
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3" style={{ borderTop: '1.5px solid #f1f5f9' }}>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/creators/${creator._id}`}
                            target="_blank"
                            style={{
                              padding: '8px 16px', fontSize: '0.82rem', fontWeight: 800,
                              borderRadius: '10px', background: 'var(--bg-tertiary)', color: 'var(--primary)',
                              border: '1.5px solid var(--border-color)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px'
                            }}
                          >
                            <Eye size={14} /> View Creator Profile
                          </Link>

                          <button
                            onClick={() => handleStartMessagingCreator(creator._id, project._id, creator.name)}
                            style={{
                              padding: '8px 16px', fontSize: '0.82rem', fontWeight: 800,
                              borderRadius: '10px', background: 'var(--bg-tertiary)', color: 'var(--primary)',
                              border: '1.5px solid var(--border-color)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                            }}
                          >
                            <MessageSquare size={14} /> Direct Message Chat
                          </button>
                        </div>

                        <div className="d-flex gap-2">
                          {!isPaid && (
                            <button
                              onClick={() => handleMarkPaymentPaid(ws._id)}
                              style={{
                                padding: '8px 18px', fontSize: '0.82rem', fontWeight: 800,
                                borderRadius: '10px', background: '#dcfce7', color: '#047857',
                                border: '1.5px solid #bbf7d0', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                              }}
                            >
                              <CreditCard size={14} /> Release Escrow Payment (₹{rateAmount.toLocaleString()})
                            </button>
                          )}

                          {ws.status !== 'completed' && (
                            <button
                              onClick={() => handleMarkWorkspaceCompleted(ws._id)}
                              style={{
                                padding: '8px 20px', fontSize: '0.82rem', fontWeight: 800,
                                borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary-hover) 100%)',
                                color: '#ffffff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
                                boxShadow: '0 4px 14px rgba(var(--secondary-rgb), 0.25)'
                              }}
                            >
                              <CheckSquare size={14} /> Mark Workspace Completed
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'shortlist': {

        const shortlistedPitches = applications.filter(a => a.status === 'shortlisted');
        return (
          <div className="animate-fade-in-up" style={{ maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Shortlisted Creators</h3>
            
            {shortlistedPitches.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No creators have been shortlisted yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {shortlistedPitches.map((app) => {
                  const creator = app.creatorId || {};
                  const profile = creator.creatorProfile || {};
                  const matchScore = calculateMatchScore(app.projectId, profile);
                  const rating = app.creatorRating || 5.0;
                  const previousCollaborations = app.previousCollaborationsCount || 0;

                  return (
                    <div key={app._id} className="glass-panel" style={{ padding: '20px' }}>
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-3">
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border-color)', overflow: 'hidden', border: '2px solid var(--primary-glow)' }}>
                            {creator.profileImage ? (
                              <img src={creator.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>C</div>
                            )}
                          </div>
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <h5 style={{ margin: 0, fontWeight: 800, fontSize: '0.98rem' }}>{creator.name}</h5>
                              <span style={{ fontSize: '0.8rem', color: 'var(--warning)' }}>★ {rating}</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Campaign: <strong>{app.projectId?.title || 'Direct collaboration'}</strong></span>
                          </div>
                        </div>
                        <span className="badge badge-shortlisted">Shortlisted</span>
                      </div>

                      {/* Creator Statistics & Matching Info */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', padding: '12px', background: 'var(--bg-panel)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.78rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Reach Reach:</span> <strong style={{ color: 'var(--text-main)' }}>{profile.followersCount?.toLocaleString() || 'N/A'}</strong>
                        </div>
                        <div style={{ fontSize: '0.78rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Engagement Rate:</span> <strong style={{ color: 'var(--text-main)' }}>{profile.avgEngagement ? profile.avgEngagement + '%' : 'N/A'}</strong>
                        </div>
                        <div style={{ fontSize: '0.78rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Primary Channel:</span> <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{profile.primaryPlatform || 'N/A'}</strong>
                        </div>
                        <div style={{ fontSize: '0.78rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Past Collaborations:</span> <strong style={{ color: 'var(--success)' }}>{previousCollaborations} Completed</strong>
                        </div>
                        <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Campaign Match Score:</span>
                          <span className="badge badge-primary" style={{ fontWeight: 800 }}>
                            {matchScore}% Match
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginTop: '12px', borderLeft: '3px solid var(--primary)' }}>
                        "{app.pitch}"
                      </p>

                      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2" style={{ fontSize: '0.8rem' }}>
                        <span>Proposed Rate: <strong style={{ color: 'var(--success)', fontSize: '0.9rem' }}>${app.proposedRate}</strong></span>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/creators/${creator._id}`}
                            target="_blank"
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={12} /> View Profile
                          </Link>
                          
                          <button
                            onClick={() => handleStartMessagingCreator(creator._id, app.projectId?._id, creator.name)}
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <MessageSquare size={12} /> Message Creator
                          </button>

                          <button onClick={() => handleApplicationStatus(app._id, 'approved')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Accept</button>
                          <button onClick={() => handleApplicationStatus(app._id, 'rejected')} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem', color: 'var(--danger)', borderColor: 'var(--danger-glow)' }}>Reject</button>
                          
                          {/* Invite Dropdown */}
                          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  const selectedCamp = campaigns.find(c => c._id === e.target.value);
                                  if (selectedCamp) {
                                    handleInviteToAnotherCampaign(creator._id, selectedCamp._id, selectedCamp.title);
                                  }
                                  e.target.value = '';
                                }
                              }}
                              className="form-input"
                              style={{ fontSize: '0.78rem', padding: '6px 12px', width: 'auto', marginBottom: 0 }}
                            >
                              <option value="">Invite to Campaign...</option>
                              {campaigns
                                .filter(c => c._id !== app.projectId?._id)
                                .map(c => (
                                  <option key={c._id} value={c._id}>{c.title}</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'payments': {
        return (
          <div className="animate-fade-in-up" style={{ maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Escrow Sponsorship Payments</h3>
            
            <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div className="glass-panel" style={{ padding: '20px', background: 'var(--primary-glow)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>FUNDS SECURED IN ESCROW</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--primary)' }}>
                  ${workspaces.filter(w => w.status === 'active').reduce((acc, w) => acc + (w.proposedRate || 1000), 0).toLocaleString()}
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', background: 'var(--success-glow)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>TOTAL REVENUE RELEASED</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--success)' }}>
                  ${workspaces.filter(w => w.status === 'completed').reduce((acc, w) => acc + (w.proposedRate || 1000), 0).toLocaleString()}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Transaction History Log</h4>
            {workspaces.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No payout contracts found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {workspaces.map((w) => (
                  <div key={w._id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem', display: 'block' }}>Sponsorship for: {w.projectId?.title}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Partner Creator: {w.creatorId?.name} | Date: {new Date(w.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: w.status === 'completed' ? 'var(--success)' : 'var(--primary)' }}>${w.proposedRate || 1000}</div>
                      <span className={`badge badge-${w.status === 'completed' ? 'approved' : w.status}`} style={{ fontSize: '0.68rem', padding: '4px 8px', marginTop: '4px' }}>
                        {w.status === 'completed' ? 'Released' : 'In Escrow'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'notifications':
        return renderNotificationsLayout();

      case 'messages':
        return renderInboxLayout();

      case 'analytics':
        return renderAnalyticsLayout();

      case 'settings':
        return renderSettingsLayout();

      default:
        return <div>Tab not found.</div>;
    }
  };

  // REUSABLE NOTIFICATIONS LAYOUT
  // NOTIFICATIONS ACTIVITY CENTER LAYOUT
  const renderNotificationsLayout = () => {
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifs = notifications.filter(notif => {
      if (notifFilter === 'unread') return !notif.isRead;
      if (notifFilter === 'campaigns') {
        return (
          notif.type?.includes('application') ||
          notif.type?.includes('invitation') ||
          notif.type?.includes('campaign')
        );
      }
      if (notifFilter === 'payments') {
        return (
          notif.type?.includes('payment') ||
          notif.type?.includes('milestone') ||
          notif.type?.includes('submission') ||
          notif.type?.includes('workspace')
        );
      }
      return true;
    });

    const getNotifMeta = (type) => {
      switch (type) {
        case 'new_application':
        case 'application_submitted':
        case 'application_status':
          return {
            icon: <FileText size={18} style={{ color: 'var(--secondary-hover)' }} />,
            bg: '#f5e9e6',
            border: '#bfdbfe',
            badge: '📥 Application'
          };
        case 'invitation_accepted':
          return {
            icon: <CheckCircle2 size={18} style={{ color: '#047857' }} />,
            bg: '#ecfdf5',
            border: '#a7f3d0',
            badge: '🎯 Campaign Match'
          };
        case 'invitation_rejected':
          return {
            icon: <XCircle size={18} style={{ color: '#b91c1c' }} />,
            bg: '#fef2f2',
            border: '#fecaca',
            badge: 'Declined'
          };
        case 'submission_uploaded':
        case 'milestone_submitted':
          return {
            icon: <Send size={18} style={{ color: '#b45309' }} />,
            bg: '#fffbeb',
            border: '#fde68a',
            badge: '📤 Submission'
          };
        case 'milestone_approved':
          return {
            icon: <CheckSquare size={18} style={{ color: '#047857' }} />,
            bg: '#ecfdf5',
            border: '#a7f3d0',
            badge: '✅ Approved'
          };
        case 'payment_completed':
        case 'payment_released':
          return {
            icon: <CreditCard size={18} style={{ color: '#047857' }} />,
            bg: '#ecfdf5',
            border: '#a7f3d0',
            badge: '💰 Payment'
          };
        case 'deadline_reminder':
          return {
            icon: <Clock size={18} style={{ color: '#b45309' }} />,
            bg: '#fffbeb',
            border: '#fde68a',
            badge: '⏰ Reminder'
          };
        case 'campaign_completed':
        case 'workspace_completed':
          return {
            icon: <Sparkles size={18} style={{ color: '#7c3aed' }} />,
            bg: '#f5f3ff',
            border: '#ddd6fe',
            badge: '🏆 Finalized'
          };
        case 'chat_message':
          return {
            icon: <MessageSquare size={18} style={{ color: 'var(--primary)' }} />,
            bg: '#f5e9e6',
            border: '#bfdbfe',
            badge: '💬 Message'
          };
        default:
          return {
            icon: <Bell size={18} style={{ color: 'var(--primary)' }} />,
            bg: 'var(--bg-tertiary)',
            border: 'var(--border-color)',
            badge: '🔔 Alert'
          };
      }
    };

    return (
      <div className="animate-fade-in-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header Bar */}
        <div style={{
          padding: '24px 28px', borderRadius: '20px', background: '#ffffff',
          border: '1.5px solid var(--border-color)', boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)',
          marginBottom: '24px'
        }}>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', fontFamily: "'Playfair Display', var(--font-sans)" }}>
                  Notification Activity Center
                </h3>
                {unreadCount > 0 && (
                  <span style={{
                    padding: '4px 12px', background: '#fef2f2', color: '#b91c1c',
                    border: '1.5px solid #fecaca', borderRadius: '9999px',
                    fontSize: '0.78rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b91c1c' }} />
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '6px 0 0 0', fontWeight: 500 }}>
                Real-time activity tracking for campaign applications, pitch approvals, milestone proofs, and payouts.
              </p>
            </div>

            <div className="d-flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    padding: '8px 18px', fontSize: '0.85rem', fontWeight: 800, borderRadius: '10px',
                    background: '#f5e9e6', color: 'var(--primary)', border: '1.5px solid #bfdbfe',
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f5e9e6'}
                >
                  <Check size={15} /> Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Sub-tabs Bar */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {[
            { key: 'all', label: `All Alerts (${notifications.length})` },
            { key: 'unread', label: `Unread (${unreadCount})` },
            { key: 'campaigns', label: '🎯 Campaigns & Pitch' },
            { key: 'payments', label: '💳 Payouts & Proofs' }
          ].map(tab => {
            const isActive = notifFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setNotifFilter(tab.key)}
                style={{
                  padding: '8px 20px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 900 : 700,
                  background: isActive ? 'var(--primary)' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? '1.5px solid var(--primary)' : '1.5px solid var(--border-color)',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(var(--primary-rgb), 0.2)' : '0 2px 6px rgba(var(--text-primary-rgb), 0.04)',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Notifications Feed List */}
        {filteredNotifs.length === 0 ? (
          <div style={{
            padding: '60px 40px', textAlign: 'center', borderRadius: '20px',
            background: '#ffffff', border: '1.5px solid var(--border-color)',
            boxShadow: '0 4px 20px rgba(var(--text-primary-rgb), 0.05)'
          }}>
            <Bell size={44} style={{ color: '#cbd5e1', display: 'block', margin: '0 auto 16px' }} />
            <h4 style={{ fontWeight: 900, margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '1.15rem' }}>No Notifications Found</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
              {notifFilter === 'unread' ? 'You have caught up on all recent notification alerts!' : 'Activity alerts regarding your campaigns will appear here.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredNotifs.map((notif) => {
              const meta = getNotifMeta(notif.type);
              const projectTitle = typeof notif.projectId === 'object' ? notif.projectId?.title : null;
              const formattedDate = new Date(notif.createdAt).toLocaleString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              return (
                <div
                  key={notif._id}
                  style={{
                    padding: '0', overflow: 'hidden', borderRadius: '18px',
                    background: '#ffffff',
                    border: notif.isRead ? '1.5px solid var(--border-color)' : '1.5px solid #bfdbfe',
                    boxShadow: notif.isRead ? '0 2px 10px rgba(var(--text-primary-rgb), 0.04)' : '0 4px 16px rgba(var(--primary-rgb), 0.1)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(var(--text-primary-rgb), 0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = notif.isRead ? '0 2px 10px rgba(var(--text-primary-rgb), 0.04)' : '0 4px 16px rgba(var(--primary-rgb), 0.1)'}
                >
                  {/* Accent Top Bar */}
                  <div style={{ height: '4px', background: notif.isRead ? 'linear-gradient(90deg, #cbd5e1, var(--border-color))' : 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />

                  <div style={{ padding: '20px 24px' }}>
                    <div className="d-flex align-items-start gap-3">
                      {/* Icon Badge */}
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '14px',
                        background: meta.bg, border: `1.5px solid ${meta.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {meta.icon}
                      </div>

                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <span style={{
                              padding: '2px 10px', background: meta.bg, color: meta.icon.props.style?.color || 'var(--primary)',
                              border: `1px solid ${meta.border}`, borderRadius: '9999px',
                              fontSize: '0.72rem', fontWeight: 900
                            }}>
                              {meta.badge}
                            </span>
                            <h4 style={{ fontWeight: notif.isRead ? 800 : 900, fontSize: '1rem', margin: 0, color: 'var(--text-primary)' }}>
                              {notif.title}
                            </h4>
                            {!notif.isRead && (
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#b91c1c', display: 'inline-block' }} />
                            )}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{formattedDate}</span>
                        </div>

                        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', margin: '6px 0 12px 0' }}>
                          {notif.body}
                        </p>

                        {/* Related Campaign Banner */}
                        {projectTitle && (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: 'var(--bg-tertiary)', padding: '6px 14px',
                            borderRadius: '10px', border: '1.5px solid var(--border-color)',
                            fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '14px'
                          }}>
                            🎯 Campaign: {projectTitle}
                          </div>
                        )}

                        {/* Action Bar */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3" style={{ borderTop: '1.5px solid #f1f5f9' }}>
                          <div>
                            {(notif.link || notif.projectId) && (
                              <Link
                                to={notif.link || `/campaigns/${typeof notif.projectId === 'object' ? notif.projectId?._id : notif.projectId}`}
                                className="btn btn-primary"
                                style={{ padding: '7px 16px', fontSize: '0.82rem', borderRadius: '8px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                              >
                                <ArrowUpRight size={14} /> Open Related Page
                              </Link>
                            )}
                          </div>

                          <div className="d-flex gap-2">
                            {!notif.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notif._id)}
                                style={{
                                  padding: '6px 14px', fontSize: '0.78rem', fontWeight: 800,
                                  borderRadius: '8px', background: '#f5e9e6', color: 'var(--primary)',
                                  border: '1.5px solid #bfdbfe', cursor: 'pointer'
                                }}
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notif._id)}
                              style={{
                                padding: '6px 14px', fontSize: '0.78rem', fontWeight: 800,
                                borderRadius: '8px', background: '#fef2f2', color: '#b91c1c',
                                border: '1.5px solid #fecaca', cursor: 'pointer'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // INBOX CHAT SYSTEM LAYOUT
  const renderInboxLayout = () => {
    const filteredThreads = inboxThreads.filter((thread) => {
      const q = threadSearch.toLowerCase();
      return (
        thread.partnerName?.toLowerCase().includes(q) ||
        thread.projectTitle?.toLowerCase().includes(q) ||
        thread.lastMessageText?.toLowerCase().includes(q)
      );
    });

    const filteredChatMessages = chatSearch.trim()
      ? chatMessages.filter(m => m.text?.toLowerCase().includes(chatSearch.toLowerCase()) || m.attachments?.some(a => a.toLowerCase().includes(chatSearch.toLowerCase())))
      : chatMessages;

    return (
      <div className="animate-fade-in-up chat-inbox-grid">
        
        {/* Inbox Left: Conversation threads list */}
        <div className="glass-panel inbox-left-pane" style={{ padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
              Conversations
            </h3>
            <span className="badge badge-primary" style={{ fontSize: '0.72rem', borderRadius: 'var(--radius-full)', padding: '4px 10px' }}>
              {inboxThreads.length} Thread{inboxThreads.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Thread Search Box */}
          <div className="form-group mb-3" style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search chats by name or campaign..."
              className="form-input"
              value={threadSearch}
              onChange={(e) => setThreadSearch(e.target.value)}
              style={{ fontSize: '0.82rem', paddingLeft: '36px', paddingRight: '28px', marginBottom: 0 }}
            />
            {threadSearch && (
              <button onClick={() => setThreadSearch('')} style={{ position: 'absolute', right: '10px', top: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                ✕
              </button>
            )}
          </div>

          {filteredThreads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)' }}>
              <MessageSquare size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <p style={{ fontSize: '0.85rem', margin: 0 }}>No matching conversations found.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredThreads.map((thread) => {
                const isUnread = thread.unreadCount > 0;
                const isSelected = activeThread?.projectId === thread.projectId;
                
                return (
                  <div
                    key={thread.projectId}
                    onClick={() => selectThread(thread)}
                    className={`glass-panel glass-panel-hover ${isSelected ? 'active-border' : ''}`}
                    style={{
                      padding: '14px',
                      cursor: 'pointer',
                      background: isSelected 
                        ? 'var(--bg-tertiary)' 
                        : (isUnread ? 'rgba(255, 107, 107, 0.08)' : 'transparent'),
                      border: isSelected 
                        ? '2px solid var(--primary)' 
                        : (isUnread ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)'),
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {/* Avatar with status indicator dot */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--border-color)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)' }}>
                          {thread.partnerAvatar ? <img src={thread.partnerAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : thread.partnerName?.substring(0, 2).toUpperCase()}
                        </div>
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--bg-primary)' }} title="Active Partner" />
                      </div>

                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: isUnread ? 900 : 800, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isUnread ? 'var(--primary)' : 'var(--text-main)' }}>
                            {thread.partnerName}
                          </span>
                          {isUnread && (
                            <span className="badge badge-primary" style={{ padding: '3px 8px', fontSize: '0.65rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                              {thread.unreadCount} New
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                          🎯 {thread.projectTitle}
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <p style={{ fontSize: '0.78rem', color: isUnread ? 'var(--text-main)' : 'var(--text-secondary)', fontWeight: isUnread ? 700 : 400, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                            {thread.lastMessageText}
                          </p>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            {thread.lastMessageDate ? new Date(thread.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inbox Right: Active thread chat room */}
        <div className="glass-panel inbox-right-pane" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
          {activeThread ? (
            <>
              {/* Campaign-Based Header Banner */}
              <div style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 24px', background: 'var(--bg-panel)', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-3">
                    <button 
                      onClick={() => setMobileShowChat(false)} 
                      className="btn btn-outline mobile-back-btn" 
                      style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ChevronLeft size={14} /> Back
                    </button>

                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--border-color)', overflow: 'hidden', border: '2px solid var(--primary-glow)', flexShrink: 0 }}>
                      {activeThread.partnerAvatar ? (
                        <img src={activeThread.partnerAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, background: 'var(--primary-gradient)', color: '#fff', fontSize: '0.9rem' }}>
                          {activeThread.partnerName?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h4 style={{ fontWeight: 800, margin: 0, fontSize: '1.05rem' }}>{activeThread.partnerName}</h4>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>● Active Now</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                        Campaign: <strong>{activeThread.projectTitle}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      onClick={() => setShowChatSearch(!showChatSearch)}
                      className="btn btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="Search in messages"
                    >
                      <Search size={14} /> Search
                    </button>

                    <Link
                      to={`/workspaces/${activeThread.workspaceId}`}
                      className="btn btn-outline"
                      style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Briefcase size={14} /> Open Workspace
                    </Link>
                  </div>
                </div>

                {/* Inline Message Search Bar */}
                {showChatSearch && (
                  <div style={{ marginTop: '12px', position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Filter messages in this conversation..."
                      className="form-input"
                      value={chatSearch}
                      onChange={e => setChatSearch(e.target.value)}
                      style={{ fontSize: '0.8rem', paddingLeft: '32px', paddingRight: '28px', marginBottom: 0 }}
                    />
                    {chatSearch && (
                      <button onClick={() => setChatSearch('')} style={{ position: 'absolute', right: '8px', top: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                    )}
                  </div>
                )}
              </div>

              {/* Chat Message grid */}
              <div style={{ flexGrow: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-primary)' }}>
                {filteredChatMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                    <MessageSquare size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>
                      {chatSearch ? 'No messages match your search filter.' : 'No messages in this chat thread yet. Send a greeting to get started!'}
                    </p>
                  </div>
                ) : (
                  filteredChatMessages.map((msg) => {
                    const isMe = msg.senderId === user._id;

                    return (
                      <div
                        key={msg._id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          alignSelf: isMe ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {/* Bubble */}
                        <div
                          style={{
                            padding: '14px 18px',
                            borderRadius: '16px',
                            borderBottomRightRadius: isMe ? '4px' : '16px',
                            borderBottomLeftRadius: isMe ? '16px' : '4px',
                            background: isMe ? 'var(--primary-gradient)' : 'var(--bg-panel, #ffffff)',
                            color: isMe ? '#ffffff' : 'var(--text-primary, var(--text-primary))',
                            border: isMe ? 'none' : '1.5px solid var(--border-color, var(--border-color))',
                            boxShadow: 'var(--shadow-card)'
                          }}
                        >
                          {msg.text && (
                            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: isMe ? '#ffffff' : 'var(--text-primary, var(--text-primary))' }}>
                              {msg.text}
                            </p>
                          )}
                          
                          {/* Attachments preview */}
                          {msg.attachments?.map((url, i) => {
                            const isImg = /\.(jpeg|jpg|gif|png|webp|svg)/i.test(url) || url.startsWith('data:image/');

                            if (isImg) {
                              return (
                                <div
                                  key={i}
                                  onClick={() => setLightboxImage(url)}
                                  style={{
                                    marginTop: msg.text ? '10px' : 0,
                                    maxWidth: '300px', borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden', border: isMe ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border-color, var(--border-color))',
                                    cursor: 'pointer', position: 'relative'
                                  }}
                                  title="Click to expand full image"
                                >
                                  <img src={url} alt="Attachment" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '220px', objectFit: 'cover' }} />
                                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.68rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Eye size={12} /> Expand
                                  </div>
                                </div>
                              );
                            }

                            // Document / File attachment card
                            return (
                              <div
                                key={i}
                                style={{
                                  marginTop: msg.text ? '10px' : 0,
                                  display: 'flex', alignItems: 'center', gap: '10px',
                                  background: isMe ? 'rgba(0,0,0,0.2)' : 'var(--bg-tertiary, var(--bg-tertiary))', padding: '10px 14px',
                                  borderRadius: 'var(--radius-sm)', border: isMe ? '1px solid rgba(255,255,255,0.15)' : '1px solid var(--border-color, var(--border-color))'
                                }}
                              >
                                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.65rem', color: '#fff', flexShrink: 0 }}>
                                  FILE
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isMe ? '#ffffff' : 'var(--text-primary, var(--text-primary))', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    {url.split('/').pop() || 'Attachment Document'}
                                  </span>
                                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: isMe ? 'var(--secondary)' : 'var(--primary)', fontSize: '0.72rem', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                    View / Download File <ArrowUpRight size={11} />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Timestamp & Read Receipts */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && (
                            <span style={{ color: msg.read ? 'var(--success)' : 'var(--text-muted)', fontWeight: 800 }} title={msg.read ? 'Seen by partner' : 'Sent'}>
                              {msg.read ? '✓✓ Read' : '✓ Sent'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                
                {/* Typing Indicator */}
                {partnerTyping && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', alignSelf: 'flex-start', background: 'var(--bg-tertiary)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'bounce 1s infinite alternate' }}></div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'bounce 1s infinite alternate 0.2s' }}></div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'bounce 1s infinite alternate 0.4s' }}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>partner is typing...</span>
                  </div>
                )}
              </div>

              {/* Chat Input form bar & Media Share Drawer */}
              <div style={{ borderTop: '1px solid var(--border-color)', padding: '16px 20px', background: 'var(--bg-panel)' }}>

                {/* Media Share Drawer (Image or File input) */}
                {mediaDrawer && (
                  <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '12px', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {mediaDrawer === 'image' ? <Image size={15} /> : <Paperclip size={15} />}
                        Share {mediaDrawer === 'image' ? 'Image Attachment' : 'File / Document Attachment'}
                      </span>
                      <button onClick={() => { setMediaDrawer(null); setMediaUrlInput(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                    </div>
                    <div className="d-flex gap-2">
                      <input
                        type="url"
                        placeholder={mediaDrawer === 'image' ? 'Paste image URL (https://...)' : 'Paste file / document URL (https://...)'}
                        className="form-input"
                        value={mediaUrlInput}
                        onChange={e => setMediaUrlInput(e.target.value)}
                        style={{ fontSize: '0.82rem', marginBottom: 0, flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (mediaUrlInput) {
                            setAttachUrl(mediaUrlInput);
                            setMediaDrawer(null);
                            setMediaUrlInput('');
                          }
                        }}
                        className="btn btn-primary"
                        style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                      >
                        Attach
                      </button>
                    </div>
                  </div>
                )}

                {/* Optional attachments URL preview banner */}
                {attachUrl && (
                  <div style={{ padding: '8px 14px', background: 'rgba(var(--primary-rgb),0.15)', border: '1px solid rgba(var(--primary-rgb),0.3)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '85%' }}>
                      📎 Attached: {attachUrl}
                    </span>
                    <button type="button" onClick={() => setAttachUrl('')} className="btn-icon" style={{ padding: '2px', color: 'var(--danger)' }}><Trash2 size={13} /></button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
                  <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="btn-icon" title="Emoji reactions"><Smile size={20} /></button>
                  <button type="button" onClick={() => setMediaDrawer(mediaDrawer === 'image' ? null : 'image')} className="btn-icon" title="Attach Image"><Image size={20} /></button>
                  <button type="button" onClick={() => setMediaDrawer(mediaDrawer === 'file' ? null : 'file')} className="btn-icon" title="Attach Document / File"><Paperclip size={20} /></button>
                  
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="form-input"
                    style={{ flexGrow: 1, marginBottom: 0 }}
                    value={typedMessage}
                    onChange={handleUserInputChange}
                  />
                  
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Send size={16} /> Send
                  </button>

                  {/* Emoji selection dropdown popup */}
                  {showEmojiPicker && (
                    <div className="glass-panel" style={{ position: 'absolute', bottom: '65px', left: '10px', display: 'flex', gap: '8px', padding: '14px', background: 'var(--bg-secondary)', zIndex: 100, flexWrap: 'wrap', maxWidth: '320px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
                      {['👍', '❤️', '🔥', '😂', '😮', '🚀', '🎉', '👏', '👀', '💯', '✨', '🤝', '💡', '✅', '👑', '⭐', '📢', '💸', '📁', '📄', '📷', '🎨', '🎬', '📊'].map((em) => (
                        <button key={em} type="button" onClick={() => handleAppendEmoji(em)} style={{ fontSize: '1.3rem', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>{em}</button>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1, padding: '40px', textAlign: 'center' }}>
              <MessageSquare size={56} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.4 }} />
              <h4 style={{ fontWeight: 800, margin: '0 0 8px' }}>Select a Conversation</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '360px' }}>
                Choose an active campaign conversation from the left sidebar to start messaging.
              </p>
            </div>
          )}
        </div>

        {/* Lightbox Fullscreen Modal for Image Attachments */}
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 20000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
            }}
          >
            <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setLightboxImage(null)}
                style={{ position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕ Close
              </button>
              <img src={lightboxImage} alt="Fullscreen Attachment" style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 'var(--radius-md)', objectFit: 'contain', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} />
            </div>
          </div>
        )}

        <style>{`
          .chat-inbox-grid {
            display: grid;
            grid-template-columns: 360px 1fr;
            gap: 24px;
            height: calc(100vh - 180px);
          }
          .inbox-left-pane {
            display: flex;
            flex-direction: column;
          }
          .inbox-right-pane {
            display: flex;
            flex-direction: column;
          }
          .mobile-back-btn {
            display: none;
          }
          @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-4px); }
          }
          @media (max-width: 768px) {
            .chat-inbox-grid {
              grid-template-columns: 1fr;
              height: calc(100vh - 120px);
            }
            .inbox-left-pane {
              display: ${mobileShowChat ? 'none' : 'flex'} !important;
            }
            .inbox-right-pane {
              display: ${mobileShowChat ? 'flex' : 'none'} !important;
            }
            .mobile-back-btn {
              display: inline-flex !important;
            }
          }
        `}</style>
      </div>
    );
  };

  // RENDER DYNAMIC ADMIN CONTENT TABS
  const renderAdminTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <div className="animate-fade-in-up">
            <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL REGISTERED USERS</span>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{adminStats.totalUsers}</div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return renderAnalyticsLayout();

      case 'settings':
        return renderSettingsLayout();

      default:
        return <div>Tab not found.</div>;
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Welcome Hero Banner Card (Only shown on default studio dashboard view) */}
      {(currentTab === 'dashboard' || !currentTab) && (
        <div style={{
          padding: '28px 32px', borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)',
          color: '#ffffff', boxShadow: '0 8px 32px rgba(var(--primary-rgb), 0.25)',
          marginBottom: '32px', position: 'relative', overflow: 'hidden'
        }}>
          {/* Ambient background glow circle */}
          <div style={{
            position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--secondary-rgb),0.3) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }} />

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.15)', color: '#bfdbfe', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 900 }}>
                  {user.role === 'creator' ? '⭐ VERIFIED CREATOR STUDIO' : (user.role === 'brand' ? '🏢 ENTERPRISE BRAND DASHBOARD' : '⚡ ADMIN CONTROL PANEL')}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#a7f3d0', fontWeight: 800 }}>● Active Session</span>
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, fontFamily: "'Playfair Display', var(--font-sans)", color: '#ffffff' }}>
                Welcome back, {user?.name}! 👋
              </h1>
              <p style={{ color: '#93c5fd', fontSize: '0.95rem', margin: '8px 0 0 0', fontWeight: 500, maxWidth: '640px' }}>
                {user.role === 'admin' 
                  ? 'Monitor platform operations, moderate active user accounts & campaign briefs, and track platform revenue.' 
                  : (user.role === 'creator' 
                    ? 'Track your active sponsorship milestone submissions, pitch proposals, brand partner messages, and monthly earnings.' 
                    : 'Manage published campaign briefs, review incoming creator applications, approve deliverables, and release escrow payouts.')}
              </p>
            </div>

            <div className="d-flex gap-3">
              {user.role === 'creator' ? (
                <Link to="/discover" className="btn" style={{ padding: '12px 24px', background: '#ffffff', color: 'var(--primary)', fontWeight: 900, borderRadius: '12px', boxShadow: '0 4px 14px rgba(255,255,255,0.2)' }}>
                  Explore Campaigns →
                </Link>
              ) : user.role === 'brand' ? (
                <Link to="/dashboard?tab=create" className="btn" style={{ padding: '12px 24px', background: '#ffffff', color: 'var(--primary)', fontWeight: 900, borderRadius: '12px', boxShadow: '0 4px 14px rgba(255,255,255,0.2)' }}>
                  + Create Campaign →
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Render role layouts */}
      {user.role === 'admin' ? renderAdminTab() : (user.role === 'creator' ? renderCreatorTab() : renderBrandTab())}

      {/* Change Request Feedback Modal */}
      {changeRequestModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '500px', width: '100%', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>Request Revision / Changes</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Deliverable: <strong>{changeRequestModal.title}</strong>
            </p>
            <div className="form-group mb-4">
              <label className="form-label">Revision Instructions & Feedback Notes</label>
              <textarea
                className="form-input"
                rows="4"
                placeholder="Explain clearly what changes or adjustments the creator needs to make..."
                value={changeRequestModal.feedbackNotes}
                onChange={e => setChangeRequestModal({ ...changeRequestModal, feedbackNotes: e.target.value })}
                required
              />
            </div>
            <div className="d-flex gap-3">
              <button
                onClick={() => {
                  if (changeRequestModal.feedbackNotes) {
                    handleRequestChanges(changeRequestModal.wsId, changeRequestModal.mId, changeRequestModal.feedbackNotes);
                    setChangeRequestModal(null);
                  }
                }}
                disabled={!changeRequestModal.feedbackNotes?.trim()}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Send Request
              </button>
              <button
                onClick={() => setChangeRequestModal(null)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
