import React from 'react';
import { 
  Terminal, 
  Search, 
  Heart, 
  Clock, 
  Settings, 
  LogOut, 
  Box, 
  ExternalLink,
  Copy,
  Plus,
  X,
  Palette,
  Fingerprint,
  Braces,
  Regex,
  Wrench,
  LayoutGrid,
  Zap,
  ChevronRight
} from 'lucide-react';

export const IconMap: Record<string, React.ElementType> = {
  Terminal, Search, Heart, Clock, Settings, LogOut, Box, ExternalLink,
  Copy, Plus, X, Palette, Fingerprint, Braces, Regex, Wrench, LayoutGrid, Zap, ChevronRight
};

export const GetIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = IconMap[name] || Box;
  return <Icon className={className} />;
};