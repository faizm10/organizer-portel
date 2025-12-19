/**
 * Script to populate tasks for all teams
 * 
 * Usage:
 *   1. Add to .env.local:
 *      NEXT_PUBLIC_SUPABASE_URL=your-url
 *      SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 *   
 *   2. Run: node scripts/populate-tasks.mjs
 * 
 * Or run with environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL=your-url SUPABASE_SERVICE_ROLE_KEY=your-key node scripts/populate-tasks.mjs
 * 
 * Note: You need the SERVICE_ROLE_KEY (not anon key) to bypass RLS for this script.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env.local
try {
  const envPath = resolve(__dirname, "../.env.local");
  const envFile = readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value;
      }
    }
  });
} catch (error) {
  // .env.local doesn't exist, that's okay
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error("Error: SUPABASE_URL must be set");
  console.error("Set NEXT_PUBLIC_SUPABASE_URL in .env.local or as environment variable");
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY must be set");
  console.error("Set SUPABASE_SERVICE_ROLE_KEY in .env.local or as environment variable");
  console.error("Note: This should be the service_role key from Supabase, not the anon key");
  process.exit(1);
}

const ORG_ID = "b1af9a78-87e0-4cc0-b65e-df66ff87f2c9";

// Create a service role client to bypass RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Sample tasks for each team
const SAMPLE_TASKS = {
  tech: [
    {
      title: "Set up Wi-Fi infrastructure",
      description: "Configure routers, access points, and network security for the event venue",
      status: "todo",
      priority: "high",
      due_date: null,
      team: "tech",
      assigned_to: null,
    },
    {
      title: "Configure check-in system",
      description: "Test and deploy the check-in platform for hacker registration",
      status: "doing",
      priority: "high",
      due_date: null,
      team: "tech",
      assigned_to: null,
    },
    {
      title: "Set up judging platform",
      description: "Deploy and configure the judging platform for mentors and judges",
      status: "todo",
      priority: "medium",
      due_date: null,
      team: "tech",
      assigned_to: null,
    },
    {
      title: "Create tech runbooks",
      description: "Document emergency procedures and troubleshooting guides",
      status: "todo",
      priority: "medium",
      due_date: null,
      team: "tech",
      assigned_to: null,
    },
  ],
  logistics: [
    {
      title: "Finalize venue layout",
      description: "Confirm room assignments and create final venue map",
      status: "doing",
      priority: "high",
      due_date: null,
      team: "logistics",
      assigned_to: null,
    },
    {
      title: "Coordinate catering schedule",
      description: "Confirm meal times and delivery windows with catering vendor",
      status: "todo",
      priority: "high",
      due_date: null,
      team: "logistics",
      assigned_to: null,
    },
    {
      title: "Set up badge pickup station",
      description: "Prepare badge distribution area and check-in process",
      status: "todo",
      priority: "medium",
      due_date: null,
      team: "logistics",
      assigned_to: null,
    },
    {
      title: "Track supply inventory",
      description: "Monitor swag, hardware, and supplies inventory levels",
      status: "todo",
      priority: "low",
      due_date: null,
      team: "logistics",
      assigned_to: null,
    },
  ],
  sponsorship: [
    {
      title: "Update sponsor pipeline",
      description: "Track sponsor prospects, offers, and signed deals",
      status: "doing",
      priority: "high",
      due_date: null,
      team: "sponsorship",
      assigned_to: null,
    },
    {
      title: "Track sponsor deliverables",
      description: "Monitor sponsor commitments for talks, booths, and judging slots",
      status: "todo",
      priority: "high",
      due_date: null,
      team: "sponsorship",
      assigned_to: null,
    },
    {
      title: "Prepare contract templates",
      description: "Update and finalize sponsorship agreement templates",
      status: "todo",
      priority: "medium",
      due_date: null,
      team: "sponsorship",
      assigned_to: null,
    },
    {
      title: "Assign sponsor booths",
      description: "Finalize sponsor expo layout and booth assignments",
      status: "todo",
      priority: "medium",
      due_date: null,
      team: "sponsorship",
      assigned_to: null,
    },
  ],
  outreach: [
    {
      title: "Send marketing email campaign",
      description: "Launch email campaign to promote event registration",
      status: "doing",
      priority: "high",
      due_date: null,
      team: "outreach",
      assigned_to: null,
    },
    {
      title: "Update partner schools directory",
      description: "Maintain directory of partner schools and clubs with contact information",
      status: "todo",
      priority: "medium",
      due_date: null,
      team: "outreach",
      assigned_to: null,
    },
    {
      title: "Distribute referral links",
      description: "Share referral links for mentors, judges, and ambassadors",
      status: "todo",
      priority: "medium",
      due_date: null,
      team: "outreach",
      assigned_to: null,
    },
    {
      title: "Prepare social media assets",
      description: "Create and organize graphics and posts for social media promotion",
      status: "todo",
      priority: "low",
      due_date: null,
      team: "outreach",
      assigned_to: null,
    },
  ],
};

async function populateTasks() {
  console.log(`Populating tasks for org: ${ORG_ID}`);
  console.log("=".repeat(50));

  // First, get a user from the org to use as created_by
  const { data: orgMembers, error: membersError } = await supabase
    .from("org_members")
    .select("user_id")
    .eq("org_id", ORG_ID)
    .limit(1);

  let createdByUserId;

  if (membersError || !orgMembers || orgMembers.length === 0) {
    console.warn("Warning: No org members found. Using placeholder UUID for created_by.");
    // Use a placeholder UUID - in real scenario you'd want to handle this better
    createdByUserId = "00000000-0000-0000-0000-000000000000";
  } else {
    createdByUserId = orgMembers[0].user_id;
    console.log(`Using user ${createdByUserId} as task creator`);
  }

  let totalCreated = 0;
  let totalErrors = 0;

  // Populate tasks for each team
  for (const [team, tasks] of Object.entries(SAMPLE_TASKS)) {
    console.log(`\nCreating tasks for ${team} team...`);

    for (const task of tasks) {
      const taskData = {
        ...task,
        org_id: ORG_ID,
        created_by: createdByUserId,
      };

      const { data, error } = await supabase
        .from("tasks")
        .insert(taskData)
        .select()
        .single();

      if (error) {
        console.error(`  ❌ Failed to create "${task.title}": ${error.message}`);
        totalErrors++;
      } else {
        console.log(`  ✓ Created: "${task.title}" (${task.status})`);
        totalCreated++;
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`Summary: ${totalCreated} tasks created, ${totalErrors} errors`);

  if (totalErrors === 0) {
    console.log("✅ All tasks populated successfully!");
  } else {
    console.log(`⚠️  ${totalErrors} tasks failed to create`);
    process.exit(1);
  }
}

// Run the script
populateTasks().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
