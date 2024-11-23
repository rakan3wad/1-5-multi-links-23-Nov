"use client";

import { useState, useEffect } from "react";
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

interface LinkWithFavicon extends Link {
  favicon?: string;
}

export default function PublicProfile({ username, displayName, avatarUrl, links }: PublicProfileProps) {
  const [linksWithFavicons, setLinksWithFavicons] = useState<LinkWithFavicon[]>([]);

  useEffect(() => {
    const linksWithFavicons = links.map(link => {
      try {
        const url = new URL(link.url);
        return {
          ...link,
          favicon: `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`
        };
      } catch (error) {
        console.error('Invalid URL:', error);
        return link;
      }
    });
    setLinksWithFavicons(linksWithFavicons);
  }, [links]);

  return (
    <div className="min-h-screen bg-[#79afd9]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={avatarUrl || undefined} 
                    alt={username} 
                    className="object-cover rounded-full"
                  />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="text-center">
              {displayName && (
                <h1 className="text-4xl font-bold text-gray-900 mb-2 font-tajawal">
                  {displayName}
                </h1>
              )}
              <div className="text-lg text-gray-800 mb-3 font-tajawal">@{username}</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="pl-12 relative space-y-4">
          {linksWithFavicons.map((link, index) => (
            <div key={link.id} className="relative">
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white font-semibold">
                {index + 1}
              </div>
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="group hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <div className="flex items-center gap-2">
                            {link.favicon && (
                              <img
                                src={link.favicon}
                                alt=""
                                className="w-4 h-4 object-contain"
                              />
                            )}
                            <h3 className="text-xl font-semibold">{link.title}</h3>
                          </div>
                          <Badge variant="secondary" className="w-fit text-xs">
                            {new URL(link.url).hostname.replace('www.', '')}
                          </Badge>
                        </div>
                        {link.description && (
                          <p className="text-muted-foreground">{link.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
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
