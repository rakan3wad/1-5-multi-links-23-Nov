'use client';

import { useEffect, useState } from "react";
import { Plus, LogOut, ExternalLink, Edit2, Trash2, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AddLinkCard from "./AddLinkCard";
import LinkCard from "./LinkCard";
import ProfileImage from "./ProfileImage";
import { Database } from "@/lib/supabase/types";
import { useRouter } from "next/navigation";
import { User } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export type Link = Database["public"]["Tables"]["links"]["Row"];

export default function DashboardLayout() {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
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
          .select("username")
          .eq("id", session.user.id)
          .single();

        if (profileData?.username) {
          setUsername(profileData.username);
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
    <div className="min-h-screen bg-[#79afd9] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <ProfileImage user={user} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {username ? `@${username}` : ''}
              </h1>
            </div>
          </div>
          <Button
            variant="outline"
            className="text-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {isAddingCard && (
          <AddLinkCard
            onSave={handleAddLink}
            onCancel={() => setIsAddingCard(false)}
          />
        )}

        {!isAddingCard && (
          <Button
            onClick={() => setIsAddingCard(true)}
            className="w-full mb-4 bg-white hover:bg-gray-50 text-gray-700 border-dashed border-2 border-gray-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Link
          </Button>
        )}

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
    </div>
  );
}
