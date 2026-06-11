import {
  LayoutDashboard,
  BookOpen,
  PenLine,
  GitBranch,
  FolderLock,
  Users,
  FileText,
  Accessibility,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Pahami Kekerasan", url: "/pahami-kekerasan", icon: BookOpen },
  { title: "Jurnal Aman", url: "/jurnal", icon: PenLine },
  { title: "Kronologi", url: "/kronologi", icon: GitBranch },
  { title: "Brankas Bukti", url: "/brankas-bukti", icon: FolderLock },
  { title: "Pendamping", url: "/pendamping-tepercaya", icon: Users },
  { title: "Laporan Awal", url: "/laporan-awal", icon: FileText },
  { title: "Aksesibilitas", url: "/aksesibilitas", icon: Accessibility },
  { title: "Pusat Bantuan", url: "/pusat-bantuan", icon: HelpCircle },
];
