'use client';

import { useEffect, useState, useRef } from "react";
import { Plus, LogOut, ExternalLink, Edit2, Trash2, Eye, Pencil, Check, Palette } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AddLinkCard from "./AddLinkCard";
import LinkCard from "./LinkCard";
import ProfileImage from "./ProfileImage";
import { Database } from "@/lib/supabase/types";
import { useRouter } from "next/navigation";
import { User } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export type Link = Database["public"]["Tables"]["links"]["Row"];

export default function DashboardLayout() {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const colorInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          router.replace("/auth");
          return;
        }

        setUser(session.user);

        // Fetch profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username, display_name, bio")
          .eq("id", session.user.id)
          .single();

        if (profileData) {
          setUsername(profileData.username);
          setDisplayName(profileData.display_name);
          setBio(profileData.bio);
        } else {
          // If username is not set, update it with email prefix
          const defaultUsername = session.user.email?.split('@')[0];
          if (defaultUsername) {
            const { data: updatedProfile, error: updateError } = await supabase
              .from("profiles")
              .update({ 
                username: defaultUsername,
                updated_at: new Date().toISOString()
              })
              .eq("id", session.user.id)
              .select("username")
              .single();

            if (!updateError && updatedProfile) {
              setUsername(updatedProfile.username);
            }
          }
        }

        // Fetch active links
        const { data: activeLinks, error: linksError } = await supabase
          .from("links")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        if (linksError) throw linksError;
        setLinks(activeLinks || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.replace("/auth");
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  useEffect(() => {
    const savedColor = localStorage.getItem('dashboardBgColor');
    if (savedColor) {
      setBgColor(savedColor);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAddLink = async (data: { title: string; url: string; description?: string }) => {
    if (!user) return;

    try {
      const { data: newLink, error } = await supabase
        .from("links")
        .insert([
          {
            title: data.title,
            url: data.url,
            description: data.description || null,
            user_id: user.id,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (newLink) {
        setLinks([newLink, ...links]);
        setIsAddingCard(false);
      }
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from("links")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleEditLink = async (
    id: string,
    updatedLink: Omit<Link, "id" | "created_at" | "user_id">
  ) => {
    try {
      const { data, error } = await supabase
        .from("links")
        .update(updatedLink)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setLinks((prev) =>
          prev.map((link) => (link.id === id ? data : link))
        );
      }
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const handleBioUpdate = async (newBio: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          bio: newBio,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (error) throw error;
      setBio(newBio);
      setIsEditingBio(false);
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBgColor(newColor);
    localStorage.setItem('dashboardBgColor', newColor);
  };

  const handlePaletteClick = () => {
    colorInputRef.current?.click();
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order_index for the moved item and affected items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index
    }));

    setLinks(updatedItems);

    // Update the order in the database
    try {
      const { error } = await supabase
        .from('links')
        .upsert(
          updatedItems.map(item => ({
            id: item.id,
            order_index: item.order_index
          }))
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error updating order:', error);
      // Revert the state if there's an error
      setLinks(links);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex flex-col items-center justify-center mb-6">
            <ProfileImage user={user} onImageUpdate={() => {}} />
            <h2 className="text-xl font-semibold mt-4 font-tajawal">{displayName}</h2>
            <p className="text-gray-900 font-tajawal">@{username}</p>
            <div className="relative mt-2 group">
              {isEditingBio ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bio || ""}
                    onChange={(e) => setBio(e.target.value)}
                    onBlur={() => handleBioUpdate(bio || "")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBioUpdate(bio || "");
                      }
                    }}
                    className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 font-tajawal"
                    placeholder="Add a bio..."
                    autoFocus
                  />
                  <button 
                    onClick={() => handleBioUpdate(bio || "")}
                    className="justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center space-x-2 text-gray-700"
                  >
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">Confirm</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEditingBio(true)}>
                  <p className="text-gray-900 text-sm font-tajawal">{bio || "Add a bio..."}</p>
                  <button>
                    <Pencil className="h-4 w-4 text-gray-900" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => window.open(`/${username}`, '_blank')}
              className="flex items-center space-x-2 text-gray-700"
            >
              <Eye className="h-4 w-4" />
              <span className="font-tajawal">View Profile</span>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  ref={colorInputRef}
                  type="color"
                  value={bgColor}
                  onChange={handleColorChange}
                  className="w-8 h-8 opacity-0 absolute inset-0 cursor-pointer"
                  title="Change background color"
                />
                <div 
                  onClick={handlePaletteClick}
                  className="w-8 h-8 rounded-md border border-gray-300 bg-white cursor-pointer flex items-center justify-center"
                  style={{ backgroundColor: bgColor }}
                >
                  <div className="flex items-center justify-center bg-black/50 rounded-md w-full h-full">
                    <Palette className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Link Button */}
        {!isAddingCard && (
          <div className="mb-8">
            <Button
              onClick={() => setIsAddingCard(true)}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border-dashed border-2 border-gray-300 font-tajawal"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Link
            </Button>
          </div>
        )}

        {/* Add Link Card */}
        {isAddingCard && (
          <div className="mb-8">
            <AddLinkCard
              onSave={handleAddLink}
              onCancel={() => setIsAddingCard(false)}
            />
          </div>
        )}

        {/* Links Section */}
        <div className="pl-12 relative">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="links">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {links.map((link, index) => (
                    <Draggable
                      key={link.id}
                      draggableId={link.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <LinkCard
                            link={link}
                            onEdit={handleEditLink}
                            onDelete={handleDeleteLink}
                            index={index}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Empty State */}
        {links.length === 0 && !isAddingCard && (
          <Card className="mt-8 text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">No links yet</h3>
                <p className="text-muted-foreground">
                  Add your first link to get started!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
