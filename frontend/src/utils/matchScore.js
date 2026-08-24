// Computes how well a Creator's profile fits a Brand's Project/Campaign.
// Pure client-side, no extra backend calls beyond the creator's own profile
// (already fetched once and reused for every card).
//
// Returns: { score: 0-100, tier: 'great'|'good'|'fair'|'low', reasons: [{label, met}] }

const norm = (v) => (typeof v === 'string' ? v.trim().toLowerCase() : v);

export function computeMatchScore(creator, project) {
  if (!creator || !project) return null;

  const reasons = [];
  let earned = 0;
  let possible = 0;

  // 1) Niche overlap — 35 pts
  possible += 35;
  const projectNiches = (project.niche || []).map(norm);
  const creatorNiches = (creator.niche || []).map(norm);
  const nicheHit = projectNiches.length === 0 || projectNiches.some(n => creatorNiches.includes(n));
  if (nicheHit) earned += 35;
  reasons.push({ label: 'Niche fit', met: nicheHit });

  // 2) Platform match — 20 pts
  possible += 20;
  const targetPlatforms = (project.targetPlatforms || []).map(norm);
  const creatorPlatforms = [
    norm(creator.primaryPlatform),
    ...(creator.socialChannels || []).map(c => norm(c.platform))
  ].filter(Boolean);
  const platformHit = targetPlatforms.length === 0 || targetPlatforms.some(p => creatorPlatforms.includes(p));
  if (platformHit) earned += 20;
  reasons.push({ label: 'Platform match', met: platformHit });

  // 3) Follower threshold — 20 pts
  possible += 20;
  const minFollowers = project.minFollowers || 0;
  const followerHit = (creator.followersCount || 0) >= minFollowers;
  if (followerHit) earned += 20;
  reasons.push({ label: 'Follower count', met: followerHit });

  // 4) Engagement threshold — 15 pts
  possible += 15;
  const minEngagement = project.minEngagementRate || 0;
  const engagementHit = (creator.avgEngagement || 0) >= minEngagement;
  if (engagementHit) earned += 15;
  reasons.push({ label: 'Engagement rate', met: engagementHit });

  // 5) Preferred category — 10 pts
  possible += 10;
  const preferredCategory = norm(project.preferredCreatorCategory);
  const categoryHit = !preferredCategory || preferredCategory === norm(creator.category);
  if (categoryHit) earned += 10;
  reasons.push({ label: 'Category fit', met: categoryHit });

  const score = possible > 0 ? Math.round((earned / possible) * 100) : 0;
  let tier = 'low';
  if (score >= 85) tier = 'great';
  else if (score >= 65) tier = 'good';
  else if (score >= 40) tier = 'fair';

  return { score, tier, reasons };
}

export const matchTierColor = {
  great: { bg: 'var(--success-glow)', text: 'var(--success)', border: 'rgba(var(--success-rgb), 0.3)' },
  good: { bg: 'var(--secondary-glow)', text: 'var(--secondary)', border: 'rgba(var(--secondary-rgb), 0.3)' },
  fair: { bg: 'var(--warning-glow)', text: 'var(--warning)', border: 'rgba(var(--warning-rgb), 0.3)' },
  low: { bg: 'var(--bg-tertiary)', text: 'var(--text-muted)', border: 'var(--border-color)' }
};
