import { useState } from 'react';
import { Instagram, Linkedin, Edit2, Check, Youtube, Facebook } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/icons/XIcon";

interface SocialLinksProps {
  twitterUsername: string | null;
  instagramUsername: string | null;
  tiktokUsername: string | null;
  youtubeUsername: string | null;
  snapchatUsername: string | null;
  whatsappNumber: string | null;
  facebookUsername: string | null;
  linkedinUsername: string | null;
  userId: string;
  onUpdate: () => void;
}

export default function SocialLinks({ 
  twitterUsername, 
  instagramUsername,
  tiktokUsername,
  youtubeUsername,
  snapchatUsername,
  whatsappNumber,
  facebookUsername,
  linkedinUsername,
  userId,
  onUpdate 
}: SocialLinksProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [socials, setSocials] = useState({
    twitter: twitterUsername || '',
    instagram: instagramUsername || '',
    tiktok: tiktokUsername || '',
    youtube: youtubeUsername || '',
    snapchat: snapchatUsername || '',
    whatsapp: whatsappNumber || '',
    facebook: facebookUsername || '',
    linkedin: linkedinUsername || ''
  });
  const supabase = createClient();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          twitter_username: socials.twitter || null,
          instagram_username: socials.instagram || null,
          tiktok_username: socials.tiktok || null,
          youtube_username: socials.youtube || null,
          snapchat_username: socials.snapchat || null,
          whatsapp_number: socials.whatsapp || null,
          facebook_username: socials.facebook || null,
          linkedin_username: socials.linkedin || null
        })
        .eq('id', userId);

      if (error) throw error;
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating social links:', error);
    }
  };

  const handleChange = (social: keyof typeof socials, value: string) => {
    setSocials(prev => ({
      ...prev,
      [social]: value
    }));
  };

  const TiktokIcon = ({ className = "h-5 w-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  const SnapchatIcon = ({ className = "h-5 w-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.206 3c.332 0 1.417.107 1.939.366.411.203.74.479 1.029.812.358.414.53.819.681 1.507.099.45.122.898.122 1.377 0 .303-.022.615-.044.927.088.051.204.077.321.077.226 0 .482-.088.747-.198.176-.073.37-.155.573-.155.132 0 .264.033.374.088.338.176.528.506.528.925 0 .433-.31.828-.889 1.028-.073.022-.166.055-.272.088-.395.132-.994.329-.994.636 0 .116.066.231.198.347.292.264.765.581 1.466.986 1.377.791 2.05 1.587 2.05 2.423 0 .112-.022.231-.066.358-.154.429-.505.708-1.004.807-.116.022-.176.099-.187.187-.011.088-.022.187-.033.264-.033.198-.176.275-.409.275-.099 0-.231-.022-.386-.055-.265-.066-.576-.132-.981-.132-.231 0-.462.022-.693.066a3.44 3.44 0 0 0-1.268.528c-.638.374-1.376.884-2.446.884-.055 0-.11 0-.166-.011h-.088c-1.059 0-1.797-.51-2.435-.884-.506-.303-.972-.473-1.268-.528a4.178 4.178 0 0 0-.693-.066c-.429 0-.751.077-.981.132a1.59 1.59 0 0 1-.375.055c-.242 0-.375-.099-.408-.286-.011-.077-.022-.165-.033-.253-.011-.099-.077-.176-.187-.198-.499-.099-.85-.378-1.004-.807-.044-.127-.066-.246-.066-.358 0-.836.673-1.632 2.05-2.423.701-.405 1.174-.722 1.466-.986.132-.116.198-.231.198-.347 0-.307-.599-.504-.994-.636-.106-.033-.199-.066-.272-.088-.578-.2-.889-.595-.889-1.028 0-.419.19-.749.528-.925.11-.055.242-.088.374-.088.198 0 .386.077.573.155.259.11.515.198.747.198.117 0 .233-.026.321-.077-.022-.312-.044-.624-.044-.927 0-.479.022-.927.121-1.377.152-.688.324-1.093.682-1.507.284-.328.617-.609 1.028-.812.522-.259 1.607-.366 1.939-.366h.154z"/>
    </svg>
  );

  const WhatsappIcon = ({ className = "h-5 w-5" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

  const SocialInput = ({ 
    platform, 
    icon: Icon, 
    baseUrl,
    placeholder = "username" 
  }: { 
    platform: keyof typeof socials, 
    icon: any,
    baseUrl: string,
    placeholder?: string 
  }) => (
    <div className="flex items-center space-x-2 mb-2">
      <Icon className="h-5 w-5 text-gray-600" />
      <div className="flex items-center">
        <span className="text-gray-500 font-tajawal">{baseUrl}</span>
        {isEditing ? (
          <input
            type="text"
            value={socials[platform]}
            onChange={(e) => handleChange(platform, e.target.value)}
            className="border-b border-gray-300 focus:border-gray-600 outline-none px-1 font-tajawal"
            placeholder={placeholder}
          />
        ) : (
          <span className="font-tajawal">
            {socials[platform] || `Add ${placeholder}`}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold font-tajawal">Social Media</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={isEditing ? handleSave : handleEdit}
          className="font-tajawal"
        >
          {isEditing ? (
            <Check className="h-4 w-4" />
          ) : (
            <Edit2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="space-y-2">
        <SocialInput 
          platform="twitter" 
          icon={XIcon} 
          baseUrl="x.com/"
        />
        <SocialInput 
          platform="instagram" 
          icon={Instagram} 
          baseUrl="instagram.com/"
        />
        <SocialInput 
          platform="tiktok" 
          icon={TiktokIcon} 
          baseUrl="tiktok.com/@"
        />
        <SocialInput 
          platform="youtube" 
          icon={Youtube} 
          baseUrl="youtube.com/@"
        />
        <SocialInput 
          platform="snapchat" 
          icon={SnapchatIcon} 
          baseUrl="snapchat.com/add/"
        />
        <SocialInput 
          platform="whatsapp" 
          icon={WhatsappIcon} 
          baseUrl="wa.me/"
          placeholder="phone number"
        />
        <SocialInput 
          platform="facebook" 
          icon={Facebook} 
          baseUrl="facebook.com/"
        />
        <SocialInput 
          platform="linkedin" 
          icon={Linkedin} 
          baseUrl="linkedin.com/in/"
        />
      </div>
    </div>
  );
}
