import { 
  Waves, Palmtree, Compass, Tv, Utensils, Wine, Coffee, Gamepad2, 
  Dumbbell, Music, Smile, Sun, Moon, Star, Heart, Map, Ticket,
  Tent, Droplet, Flame, Wind, Mountain, Anchor, Ship, Car, Plane,
  Castle, Sparkles, Trees, Umbrella, Sailboat, Fish, Activity,
  Camera, Gift, GlassWater, IceCream, Info, MapPin, Navigation,
  PartyPopper, Popcorn, Puzzle, Speaker, Trophy, Image as ImageIcon
} from "lucide-react";

export const CURATED_ICONS: Record<string, any> = {
  Waves, Palmtree, Compass, Tv, Utensils, Wine, Coffee, Gamepad2, 
  Dumbbell, Music, Smile, Sun, Moon, Star, Heart, Map, Ticket,
  Tent, Droplet, Flame, Wind, Mountain, Anchor, Ship, Car, Plane,
  Castle, Sparkles, Trees, Umbrella, Sailboat, Fish, Activity,
  Camera, Gift, GlassWater, IceCream, Info, MapPin, Navigation,
  PartyPopper, Popcorn, Puzzle, Speaker, Trophy, ImageIcon
};

export type IconName = keyof typeof CURATED_ICONS;
