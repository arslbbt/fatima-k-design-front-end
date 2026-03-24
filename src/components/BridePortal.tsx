import React from "react";
import { 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Camera, 
  Upload, 
  Image as ImageIcon,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BridePortalLayout } from "@/components/BridePortalLayout";

export function BridePortal() {
  return (
    <BridePortalLayout>
      <main className="flex-1 overflow-auto bp-page-main">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">Welcome back, Sophie</h1>
            
            <div className="bg-[#E8D8CE]/40 border border-[#D4A373]/20 rounded-xl p-4 flex items-center justify-center gap-3 shadow-sm">
              <Heart className="text-[#D4A373]" fill="#D4A373" size={20} />
              <span className="text-[#555555] text-lg font-['Cormorant_Garamond'] italic">Your wedding is in <span className="font-semibold text-[#333333]">47 days</span> &middot; 4th May 2026</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Next Appointment */}
            <Card className="bg-white border-[#E8E0D5] shadow-sm rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="text-sm text-[#888888] font-medium uppercase tracking-wider mb-3">Next Appointment</div>
                <div className="space-y-4">
                  <div className="font-['Cormorant_Garamond'] text-2xl font-medium text-[#2C2C2C]">Final Fitting</div>
                  <div className="space-y-2 text-[#555555] text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-[#D4A373]" />
                      <span>Tuesday 24 Mar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-[#D4A373]" />
                      <span>2:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-[#D4A373]" />
                      <span>Paddington Studio</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Journey Stage */}
            <Card className="bg-white border-[#E8E0D5] shadow-sm rounded-xl overflow-hidden md:col-span-1">
              <CardContent className="p-6">
                <div className="text-sm text-[#888888] font-medium uppercase tracking-wider mb-3 flex justify-between items-center">
                  <span>Dress Journey Stage</span>
                  <a href="#" className="text-[#D4A373] text-xs lowercase flex items-center hover:underline">View all <ChevronRight size={12}/></a>
                </div>
                
                <div className="relative mt-4 space-y-4">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#F5EFE9]"></div>
                  
                  <div className="flex items-center gap-3 relative">
                    <CheckCircle2 size={16} className="text-[#D4A373] bg-white rounded-full z-10" />
                    <span className="text-sm text-[#888888] line-through">Consultation</span>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <CheckCircle2 size={16} className="text-[#D4A373] bg-white rounded-full z-10" />
                    <span className="text-sm text-[#888888] line-through">1st Fitting</span>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <CheckCircle2 size={16} className="text-[#D4A373] bg-white rounded-full z-10" />
                    <span className="text-sm text-[#888888] line-through">2nd Fitting</span>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <div className="w-4 h-4 rounded-full border-2 border-[#D4A373] bg-white flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]"></div>
                    </div>
                    <span className="text-sm font-medium text-[#333333]">Final Fitting</span>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <Circle size={16} className="text-[#E8E0D5] bg-white rounded-full z-10" />
                    <span className="text-sm text-[#AAAAAA]">Pickup</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outstanding Balance */}
            <Card className="bg-white border-[#E8E0D5] shadow-sm rounded-xl overflow-hidden">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="text-sm text-[#888888] font-medium uppercase tracking-wider mb-3">Outstanding Balance</div>
                  <div className="font-['Cormorant_Garamond'] text-4xl font-medium text-[#B87A4F] mb-1">
                    $1,200 <span className="text-lg font-sans text-[#888888] font-normal">remaining</span>
                  </div>
                  <div className="text-sm text-[#888888]">
                    $2,800 paid of $4,000 total
                  </div>
                </div>
                <button className="w-full py-2.5 mt-4 rounded-md bg-[#333333] text-white text-sm font-medium hover:bg-[#222222] transition-colors">
                  Make a Payment
                </button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            {/* Upcoming Appointments */}
            <div className="space-y-4">
              <h2 className="text-2xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C] border-b border-[#E8E0D5] pb-2">Upcoming Appointments</h2>
              
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-[#E8E0D5] flex gap-4 items-start shadow-sm">
                  <div className="bg-[#F5EFE9] text-[#A67C52] p-3 rounded-lg flex flex-col items-center justify-center min-w-[60px]">
                    <span className="text-xs uppercase font-medium">Mar</span>
                    <span className="text-xl font-['Cormorant_Garamond'] font-semibold">24</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-[#333333]">Final Fitting</h4>
                      <Badge variant="outline" className="bg-[#E8D8CE]/30 text-[#A67C52] border-none font-normal">2:00 PM</Badge>
                    </div>
                    <p className="text-sm text-[#666666] mt-1">Paddington Studio</p>
                    <div className="mt-3 bg-[#FAF8F5] p-2 rounded-md border border-[#E8E0D5]/50 flex gap-2 items-start">
                      <span className="text-xs font-medium text-[#888888] uppercase mt-0.5">Note:</span>
                      <span className="text-sm text-[#555555]">Please bring your wedding shoes and veil to ensure the perfect hem length.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E8E0D5] flex gap-4 items-start shadow-sm">
                  <div className="bg-[#F5EFE9] text-[#A67C52] p-3 rounded-lg flex flex-col items-center justify-center min-w-[60px]">
                    <span className="text-xs uppercase font-medium">Apr</span>
                    <span className="text-xl font-['Cormorant_Garamond'] font-semibold">15</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-[#333333]">Dress Collection</h4>
                      <Badge variant="outline" className="bg-[#E8D8CE]/30 text-[#A67C52] border-none font-normal">10:30 AM</Badge>
                    </div>
                    <p className="text-sm text-[#666666] mt-1">Paddington Studio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Photos */}
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-[#E8E0D5] pb-2">
                <h2 className="text-2xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">Recent Fitting Photos</h2>
                <a href="#" className="text-sm text-[#A67C52] hover:underline mb-1">View all</a>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-[#E8D8CE]/40 to-[#E8E0D5]/60 flex items-center justify-center border border-[#E8E0D5]">
                    <Camera className="text-[#D4A373]/50 w-8 h-8" />
                  </div>
                  <p className="text-xs text-[#888888] flex items-center gap-1.5 px-1">
                    <Avatar className="w-4 h-4"><AvatarFallback className="bg-[#333333] text-[8px] text-white">FK</AvatarFallback></Avatar>
                    Added by Fatima &middot; 12 Mar
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="aspect-[3/4] rounded-xl bg-gradient-to-bl from-[#E8E0D5]/60 to-[#F5EFE9] flex items-center justify-center border border-[#E8E0D5]">
                    <Camera className="text-[#D4A373]/50 w-8 h-8" />
                  </div>
                  <p className="text-xs text-[#888888] flex items-center gap-1.5 px-1">
                    <Avatar className="w-4 h-4"><AvatarFallback className="bg-[#333333] text-[8px] text-white">FK</AvatarFallback></Avatar>
                    Added by Fatima &middot; 12 Mar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inspiration Board */}
          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-end border-b border-[#E8E0D5] pb-2">
              <h2 className="text-2xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">My Inspiration Board</h2>
              <button className="flex items-center gap-1.5 text-sm text-[#A67C52] hover:underline mb-1">
                <Upload size={14} /> Upload New
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-r from-[#F5EFE9] to-[#E8D8CE]/30 border border-[#E8E0D5] flex items-center justify-center">
                 <ImageIcon className="text-[#D4A373]/40 w-6 h-6" />
              </div>
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-r from-[#E8D8CE]/30 to-[#E8E0D5]/50 border border-[#E8E0D5] flex items-center justify-center">
                 <ImageIcon className="text-[#D4A373]/40 w-6 h-6" />
              </div>
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-b from-[#F5EFE9] to-[#E8E0D5]/40 border border-[#E8E0D5] flex items-center justify-center">
                 <ImageIcon className="text-[#D4A373]/40 w-6 h-6" />
              </div>
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-tl from-[#E8D8CE]/20 to-[#F5EFE9] border border-[#E8E0D5] flex items-center justify-center">
                 <ImageIcon className="text-[#D4A373]/40 w-6 h-6" />
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </BridePortalLayout>
  );
}
