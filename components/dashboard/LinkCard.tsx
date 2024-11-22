'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from './DashboardLayout';
import { Edit, MoreVertical, Trash2, ExternalLink, GripVertical } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';

interface LinkCardProps {
  link: Link;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: { title: string; url: string; description: string }) => void;
  index: number;
}

export default function LinkCard({ link, onDelete, onEdit, index }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: link.title,
    url: link.url,
    description: link.description
  });
  const [favicon, setFavicon] = useState<string>('');

  useEffect(() => {
    try {
      const url = new URL(link.url);
      setFavicon(`https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`);
    } catch (error) {
      console.error('Invalid URL:', error);
    }
  }, [link.url]);

  const handleEdit = () => {
    onEdit(link.id, formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(link.id);
    setShowDeleteDialog(false);
  };

  if (isEditing) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded font-tajawal"
            placeholder="Title"
          />
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            className="w-full p-2 border rounded font-tajawal"
            placeholder="URL"
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded font-tajawal"
            placeholder="Description"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white font-semibold">
        {index + 1}
      </div>
      <Card className="w-full max-w-2xl p-6 relative group hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start space-x-4">
          <div className="text-gray-400 mt-1 opacity-50 group-hover:opacity-100">
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {favicon && (
                      <img
                        src={favicon}
                        alt=""
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    <h3 className="text-lg font-semibold font-tajawal">{link.title}</h3>
                  </div>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-500 hover:text-blue-700 break-all mb-2 flex items-center font-tajawal"
                  >
                    {link.url}
                    <ExternalLink className="h-4 w-4 ml-1 inline" />
                  </a>
                  {link.description && (
                    <p className="text-gray-600 text-sm mt-1 font-tajawal">{link.description}</p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500 font-tajawal">
                  Added {new Date(link.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this link. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
