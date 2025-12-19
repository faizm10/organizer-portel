import type { TeamResource, ResourceType } from "@/components/team-resources";
import type { TaskTeam } from "./tasks";

// Team-specific resources (documents, links, guides, etc.)
// This is a placeholder - in the future this could be stored in the database
export const TEAM_RESOURCES: Record<TaskTeam, TeamResource[]> = {
  tech: [
    {
      id: "tech-wifi-setup",
      title: "Wi-Fi Setup Guide",
      url: "https://docs.example.com/tech/wifi-setup",
      description: "Complete guide for configuring event Wi-Fi infrastructure",
      type: "guide",
    },
    {
      id: "tech-checkin-system",
      title: "Check-in System Documentation",
      url: "https://docs.example.com/tech/checkin",
      description: "How to configure and use the check-in system",
      type: "document",
    },
    {
      id: "tech-judging-platform",
      title: "Judging Platform Access",
      url: "https://judging.example.com",
      description: "Judging platform for mentors and judges",
      type: "link",
    },
    {
      id: "tech-runbooks",
      title: "Tech Runbooks",
      url: "https://runbooks.example.com/tech",
      description: "Emergency procedures and troubleshooting guides",
      type: "guide",
    },
  ],
  logistics: [
    {
      id: "logistics-venue-map",
      title: "Venue Map & Layout",
      url: "https://docs.example.com/logistics/venue-map",
      description: "Interactive venue map with room assignments",
      type: "document",
    },
    {
      id: "logistics-catering",
      title: "Catering Schedule",
      url: "https://docs.example.com/logistics/catering",
      description: "Meal times and delivery schedules",
      type: "document",
    },
    {
      id: "logistics-badge-pickup",
      title: "Badge Pickup Process",
      url: "https://docs.example.com/logistics/badge-pickup",
      description: "Check-in and badge distribution procedures",
      type: "guide",
    },
    {
      id: "logistics-supplies",
      title: "Supply Inventory",
      url: "https://inventory.example.com",
      description: "Track swag, hardware, and supplies",
      type: "link",
    },
  ],
  sponsorship: [
    {
      id: "sponsor-pipeline",
      title: "Sponsor Pipeline",
      url: "https://crm.example.com/sponsors",
      description: "Track sponsor prospects and deals",
      type: "link",
    },
    {
      id: "sponsor-deliverables",
      title: "Deliverables Tracker",
      url: "https://docs.example.com/sponsorship/deliverables",
      description: "Monitor sponsor commitments and deliverables",
      type: "document",
    },
    {
      id: "sponsor-contracts",
      title: "Contract Templates",
      url: "https://docs.example.com/sponsorship/contracts",
      description: "Standard sponsorship agreement templates",
      type: "document",
    },
    {
      id: "sponsor-booth-assignments",
      title: "Booth Assignments",
      url: "https://docs.example.com/sponsorship/booths",
      description: "Sponsor expo layout and booth assignments",
      type: "document",
    },
  ],
  outreach: [
    {
      id: "outreach-email-templates",
      title: "Email Templates",
      url: "https://docs.example.com/outreach/email-templates",
      description: "Templates for marketing and partnership emails",
      type: "document",
    },
    {
      id: "outreach-partner-schools",
      title: "Partner Schools Directory",
      url: "https://docs.example.com/outreach/partners",
      description: "Directory of partner schools and clubs",
      type: "document",
    },
    {
      id: "outreach-referral-links",
      title: "Referral Links",
      url: "https://referrals.example.com",
      description: "Track referral links for mentors, judges, and ambassadors",
      type: "link",
    },
    {
      id: "outreach-social-media",
      title: "Social Media Assets",
      url: "https://assets.example.com/outreach",
      description: "Graphics, posts, and social media content",
      type: "link",
    },
  ],
};
