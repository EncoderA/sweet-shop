"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

const ProfilePopup = () => {
    const {data: session} = useSession();
    const avatarCharacter = session?.user?.name?.[0]?.toUpperCase() || "U";
    const data = session?.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="border-2">
          <AvatarFallback>{avatarCharacter}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            // side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{avatarCharacter}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data.name}</span>
                  <span className="truncate text-xs">{data.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
           
            <DropdownMenuSeparator />
             <DropdownMenuItem>
                Orders
              </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>signOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfilePopup;
