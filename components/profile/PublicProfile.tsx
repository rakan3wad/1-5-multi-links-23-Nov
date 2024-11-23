"use client";

import { ExternalLink } from "lucide-react";
import { Link } from "../dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PublicProfileProps {
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  links: Link[];
}

export default function PublicProfile({ username, displayName, avatarUrl, links }: PublicProfileProps) {
  return (
    <div className="min-h-screen bg-[#79afd9]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl || undefined} alt={username} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-3xl">
              {displayName && <div className="mb-1">{displayName}</div>}
              <div className="text-muted-foreground">@{username}</div>
            </CardTitle>
            <CardDescription>My Collection of Links</CardDescription>
          </CardHeader>
        </Card>

        {/* Links Grid */}
        <div className="pl-12 relative space-y-4">
          {links.map((link, index) => (
            <div key={link.id} className="relative">
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white font-semibold">
                {index + 1}
              </div>
              <Card className="group hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <h3 className="text-xl font-semibold">{link.title}</h3>
                        <Badge variant="secondary" className="w-fit text-xs">
                          {new URL(link.url).hostname.replace('www.', '')}
                        </Badge>
                      </div>
                      {link.description && (
                        <p className="text-muted-foreground">{link.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      asChild
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {links.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <CardTitle className="text-lg mb-2">No links added yet</CardTitle>
                <CardDescription>
                  This user hasn't added any links to their profile
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
