"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeopleList } from "@/components/people-list";
import { OrganizersList } from "@/components/organizers-list";
import { CreatePersonForm } from "@/components/create-person-form";
import type { EventPerson } from "@/lib/people";
import type { OrgMember } from "@/lib/org";
import { Users, UserCheck, Gavel, Building2, Handshake, Briefcase } from "lucide-react";

interface PeoplePageContentProps {
  organizers: OrgMember[];
  volunteers: EventPerson[];
  mentors: EventPerson[];
  judges: EventPerson[];
  sponsors: EventPerson[];
  partners: EventPerson[];
  orgId: string;
}

export function PeoplePageContent({
  organizers,
  volunteers,
  mentors,
  judges,
  sponsors,
  partners,
  orgId,
}: PeoplePageContentProps) {
  const [activeTab, setActiveTab] = useState("organizers");

  const tabs = [
    {
      value: "organizers",
      label: "Organizers",
      icon: Users,
      count: organizers.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Organizers</h3>
              <p className="text-sm text-muted-foreground">
                Team members with access to this organization
              </p>
            </div>
          </div>
          <OrganizersList organizers={organizers} />
        </div>
      ),
    },
    {
      value: "volunteers",
      label: "Volunteers",
      icon: UserCheck,
      count: volunteers.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Volunteers</h3>
              <p className="text-sm text-muted-foreground">
                People helping with event operations and logistics
              </p>
            </div>
            <CreatePersonForm personType="volunteer" orgId={orgId} />
          </div>
          <PeopleList people={volunteers} type="volunteer" />
        </div>
      ),
    },
    {
      value: "mentors",
      label: "Mentors",
      icon: Briefcase,
      count: mentors.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Mentors</h3>
              <p className="text-sm text-muted-foreground">
                Technical mentors helping participants with their projects
              </p>
            </div>
            <CreatePersonForm personType="mentor" orgId={orgId} />
          </div>
          <PeopleList people={mentors} type="mentor" />
        </div>
      ),
    },
    {
      value: "judges",
      label: "Judges",
      icon: Gavel,
      count: judges.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Judges</h3>
              <p className="text-sm text-muted-foreground">
                Judges evaluating projects and selecting winners
              </p>
            </div>
            <CreatePersonForm personType="judge" orgId={orgId} />
          </div>
          <PeopleList people={judges} type="judge" />
        </div>
      ),
    },
    {
      value: "sponsors",
      label: "Sponsors",
      icon: Building2,
      count: sponsors.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Sponsors</h3>
              <p className="text-sm text-muted-foreground">
                Company sponsors and their representatives
              </p>
            </div>
            <CreatePersonForm personType="sponsor" orgId={orgId} />
          </div>
          <PeopleList people={sponsors} type="sponsor" />
        </div>
      ),
    },
    {
      value: "partners",
      label: "Partners",
      icon: Handshake,
      count: partners.length,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Partners</h3>
              <p className="text-sm text-muted-foreground">
                Community partners, schools, and organizations
              </p>
            </div>
            <CreatePersonForm personType="partner" orgId={orgId} />
          </div>
          <PeopleList people={partners} type="partner" />
        </div>
      ),
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
