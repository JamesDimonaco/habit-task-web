"use client";

import * as React from "react";
import { Plus } from "lucide-react";

// import { NavMain } from "@/components/nav-main";
import { NavHabits } from "@/components/nav-habits";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { HabitType, UserType } from "@/lib/types";
import Link from "next/link";

// This is sample data.
// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   // teams: [
//   //   {
//   //     name: "Acme Inc",
//   //     logo: GalleryVerticalEnd,
//   //     plan: "Enterprise",
//   //   },
//   //   {
//   //     name: "Acme Corp.",
//   //     logo: AudioWaveform,
//   //     plan: "Startup",
//   //   },
//   //   {
//   //     name: "Evil Corp.",
//   //     logo: Command,
//   //     plan: "Free",
//   //   },
//   // ],
//   // navMain: [
//   //   {
//   //     title: "Playground",
//   //     url: "#",
//   //     icon: SquareTerminal,
//   //     isActive: true,
//   //     items: [
//   //       {
//   //         title: "History",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Starred",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Settings",
//   //         url: "#",
//   //       },
//   //     ],
//   //   },
//   //   {
//   //     title: "Models",
//   //     url: "#",
//   //     icon: Bot,
//   //     items: [
//   //       {
//   //         title: "Genesis",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Explorer",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Quantum",
//   //         url: "#",
//   //       },
//   //     ],
//   //   },
//   //   {
//   //     title: "Documentation",
//   //     url: "#",
//   //     icon: BookOpen,
//   //     items: [
//   //       {
//   //         title: "Introduction",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Get Started",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Tutorials",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Changelog",
//   //         url: "#",
//   //       },
//   //     ],
//   //   },
//   //   {
//   //     title: "Settings",
//   //     url: "#",
//   //     icon: Settings2,
//   //     items: [
//   //       {
//   //         title: "General",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Team",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Billing",
//   //         url: "#",
//   //       },
//   //       {
//   //         title: "Limits",
//   //         url: "#",
//   //       },
//   //     ],
//   //   },
//   // ],
//   habits: [
//     {
//       name: "Design Engineering",
//       url: "#",
//       icon: Frame,
//     },
//     {
//       name: "Sales & Marketing",
//       url: "#",
//       icon: PieChart,
//     },
//     {
//       name: "Travel",
//       url: "#",
//       icon: Map,
//     },
//   ],
// };

export function AppSidebar({
  habits,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  habits: HabitType[];
  user: UserType;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Button className="gap-2 rounded-xl ">
          <Plus />
          <Link href="/dashboard">
            <span className="group-data-[collapsible=icon]:hidden">
              New Habit
            </span>
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavHabits habits={habits} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
