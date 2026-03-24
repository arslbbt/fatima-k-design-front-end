import React, { useState } from "react";
import { Link } from "wouter";
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Upload, 
  Plus, 
  DollarSign, 
  Camera, 
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AdminLayout } from "@/components/AdminLayout";

const coutureBrides = [
  { name: "Sophie Anderson", date: "4 May 2026", stage: "Final Fitting", balance: "$1,200", due: true },
  { name: "Chloe Mitchell", date: "18 Jun 2026", stage: "2nd Fitting", balance: "$2,000", due: true },
  { name: "Isabella Davis", date: "2 Sep 2026", stage: "1st Fitting", balance: "$0", due: false },
  { name: "Mia Chen", date: "14 Oct 2026", stage: "Consultation", balance: "$3,500", due: true },
  { name: "Emma Clarke", date: "12 Nov 2026", stage: "Complete", balance: "$0", due: false },
];

const rtwBrides = [
  { name: "Lily Thompson", date: "2 Apr 2026", stage: "Alterations", balance: "$350", due: true },
  { name: "Grace Kim", date: "17 May 2026", stage: "Ready for Pickup", balance: "$0", due: false },
  { name: "Hannah Davis", date: "6 Jul 2026", stage: "Consultation", balance: "$1,200", due: true },
  { name: "Olivia Park", date: "19 Oct 2026", stage: "Alterations", balance: "$600", due: true },
];

export function AdminDashboard() {
  const [brideTab, setBrideTab] = useState<"couture" | "rtw">("couture");
  const brideList = brideTab === "couture" ? coutureBrides : rtwBrides;

  return (
    <AdminLayout>
      <main className="flex-1 overflow-auto bp-page-main">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex justify-between items-end">
            <h1 className="text-3xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">Dashboard</h1>
            <Button className="bg-[#333333] text-white hover:bg-[#222222] font-normal shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              New Bride
            </Button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-white border-[#E8E0D5] shadow-sm">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#888888] font-medium uppercase tracking-wider">Total Brides</span>
                  <Users className="w-4 h-4 text-[#D4A373]" />
                </div>
                <div className="text-3xl font-['Cormorant_Garamond'] font-medium">12</div>
                <span className="text-xs text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded w-fit">+2 this month</span>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#E8E0D5] shadow-sm">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#888888] font-medium uppercase tracking-wider">Appts This Week</span>
                  <Calendar className="w-4 h-4 text-[#D4A373]" />
                </div>
                <div className="text-3xl font-['Cormorant_Garamond'] font-medium">4</div>
                <span className="text-xs text-[#888888]">Next: Tomorrow, 2 PM</span>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#E8E0D5] shadow-sm">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#888888] font-medium uppercase tracking-wider">Payments Rec'd</span>
                  <DollarSign className="w-4 h-4 text-[#D4A373]" />
                </div>
                <div className="text-3xl font-['Cormorant_Garamond'] font-medium">$18,450</div>
                <span className="text-xs text-[#888888]">This month</span>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#E8E0D5] shadow-sm">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#888888] font-medium uppercase tracking-wider">Outstanding</span>
                  <CreditCard className="w-4 h-4 text-[#B87A4F]" />
                </div>
                <div className="text-3xl font-['Cormorant_Garamond'] font-medium text-[#B87A4F]">$6,200</div>
                <span className="text-xs text-[#888888]">Across 4 brides</span>
              </CardContent>
            </Card>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* All Brides Table */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex justify-between items-center border-b border-[#E8E0D5] pb-2">
                <h2 className="text-xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">All Brides</h2>
                <Link href="/admin/brides" className="text-sm text-[#A67C52] hover:underline">View all</Link>
              </div>

              <div className="flex border border-[#E8E0D5] rounded-lg overflow-hidden bg-[#F5EFE9] p-1 gap-1">
                <button
                  onClick={() => setBrideTab("couture")}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all"
                  style={{
                    background: brideTab === "couture" ? "#fff" : "transparent",
                    color: brideTab === "couture" ? "#2C2C2C" : "#888888",
                    boxShadow: brideTab === "couture" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  <span>✦</span>
                  Couture Brides
                  <span style={{ background: brideTab === "couture" ? "#D4A373" : "#E0D8D0", color: brideTab === "couture" ? "#fff" : "#888", fontSize: 11, borderRadius: 10, padding: "1px 7px", fontWeight: 600 }}>
                    {coutureBrides.length}
                  </span>
                </button>
                <button
                  onClick={() => setBrideTab("rtw")}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all"
                  style={{
                    background: brideTab === "rtw" ? "#fff" : "transparent",
                    color: brideTab === "rtw" ? "#2C2C2C" : "#888888",
                    boxShadow: brideTab === "rtw" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  <span>◆</span>
                  Ready to Wear
                  <span style={{ background: brideTab === "rtw" ? "#555" : "#E0D8D0", color: brideTab === "rtw" ? "#fff" : "#888", fontSize: 11, borderRadius: 10, padding: "1px 7px", fontWeight: 600 }}>
                    {rtwBrides.length}
                  </span>
                </button>
              </div>

              <div
                className="text-xs px-3 py-2 rounded-md"
                style={{
                  background: brideTab === "couture" ? "linear-gradient(135deg, #F0E4D8, #EAD9CC)" : "#F5F5F5",
                  color: brideTab === "couture" ? "#A67C52" : "#666",
                  border: `1px solid ${brideTab === "couture" ? "#E8D0C0" : "#E0E0E0"}`,
                }}
              >
                {brideTab === "couture"
                  ? "Bespoke gowns — designed and made to measure for each bride"
                  : "Selected styles with a personal alterations and fitting service"}
              </div>

              <Card className="bg-white border-[#E8E0D5] shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#FAF8F5]">
                    <TableRow className="border-[#E8E0D5]">
                      <TableHead className="text-[#888888] font-medium">Name</TableHead>
                      <TableHead className="text-[#888888] font-medium">Wedding Date</TableHead>
                      <TableHead className="text-[#888888] font-medium">Stage</TableHead>
                      <TableHead className="text-[#888888] font-medium">Balance</TableHead>
                      <TableHead className="text-right text-[#888888] font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brideList.map((bride, i) => (
                      <TableRow key={i} className="border-[#E8E0D5]">
                        <TableCell className="font-medium text-[#333333]">{bride.name}</TableCell>
                        <TableCell className="text-[#666666] text-sm">{bride.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-[#FAF8F5] text-[#555555] border-[#E8E0D5] font-normal">
                            {bride.stage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={!bride.due ? "text-[#888888]" : "text-[#B87A4F] font-medium"}>
                            {bride.balance}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#A67C52] hover:bg-[#FAF8F5] hover:text-[#A67C52]">
                              <Upload className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 border-[#E8E0D5] text-[#555555] font-normal">
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* This Week's Appointments */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#E8E0D5] pb-2">
                <h2 className="text-xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">This Week's Appts</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: "Sophie Anderson", type: "Final Fitting", day: "Tue 24", time: "2:00 PM", color: "bg-[#D4A373]" },
                  { name: "Chloe Mitchell", type: "2nd Fitting", day: "Wed 25", time: "10:00 AM", color: "bg-[#A67C52]" },
                  { name: "Isabella Davis", type: "Fabric Selection", day: "Thu 26", time: "1:30 PM", color: "bg-[#333333]" },
                  { name: "Mia Chen", type: "Consultation", day: "Fri 27", time: "3:00 PM", color: "bg-[#E8D8CE]" }
                ].map((appt, i) => (
                  <Card key={i} className="bg-white border-[#E8E0D5] shadow-sm">
                    <CardContent className="p-4 flex gap-3">
                      <div className="flex flex-col items-center justify-center w-12 shrink-0 border-r border-[#E8E0D5] pr-3">
                        <span className="text-[10px] uppercase font-semibold text-[#888888]">{appt.day.split(' ')[0]}</span>
                        <span className="text-lg font-['Cormorant_Garamond'] font-medium text-[#333333]">{appt.day.split(' ')[1]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium text-[#333333]">{appt.name}</h4>
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${appt.color}`}></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-[#666666]">{appt.type}</span>
                          <span className="text-xs font-medium text-[#A67C52]">{appt.time}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Activity */}
            <div className="space-y-4">
              <h2 className="text-xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C] border-b border-[#E8E0D5] pb-2">Recent Activity</h2>
              <Card className="bg-white border-[#E8E0D5] shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y divide-[#E8E0D5]">
                    <div className="p-4 flex gap-4">
                      <div className="mt-1 bg-[#F5EFE9] p-2 rounded-full text-[#A67C52]">
                        <Camera size={14} />
                      </div>
                      <div>
                        <p className="text-sm text-[#333333]">Uploaded 4 fitting photos for <span className="font-medium">Sophie Anderson</span></p>
                        <span className="text-xs text-[#888888] flex items-center gap-1 mt-1"><Clock size={10} /> 2 hours ago</span>
                      </div>
                    </div>
                    <div className="p-4 flex gap-4">
                      <div className="mt-1 bg-[#F5EFE9] p-2 rounded-full text-[#22C55E]">
                        <DollarSign size={14} />
                      </div>
                      <div>
                        <p className="text-sm text-[#333333]">Payment recorded: <span className="font-medium">Emma Clarke</span> - $800</p>
                        <span className="text-xs text-[#888888] flex items-center gap-1 mt-1"><Clock size={10} /> 1 day ago</span>
                      </div>
                    </div>
                    <div className="p-4 flex gap-4">
                      <div className="mt-1 bg-[#F5EFE9] p-2 rounded-full text-[#333333]">
                        <Calendar size={14} />
                      </div>
                      <div>
                        <p className="text-sm text-[#333333]">New appointment scheduled: <span className="font-medium">Mia Chen</span> (Final Fitting)</p>
                        <span className="text-xs text-[#888888] flex items-center gap-1 mt-1"><Clock size={10} /> 2 days ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C] border-b border-[#E8E0D5] pb-2">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-[#E8E0D5] bg-white hover:bg-[#FAF8F5] transition-colors shadow-sm text-[#333333]">
                  <div className="bg-[#E8D8CE]/50 p-3 rounded-full text-[#A67C52]">
                    <Users size={20} />
                  </div>
                  <span className="text-sm font-medium">Add New Bride</span>
                </button>
                
                <button className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-[#E8E0D5] bg-white hover:bg-[#FAF8F5] transition-colors shadow-sm text-[#333333]">
                  <div className="bg-[#E8D8CE]/50 p-3 rounded-full text-[#A67C52]">
                    <Calendar size={20} />
                  </div>
                  <span className="text-sm font-medium">Schedule Appt</span>
                </button>
                
                <button className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-[#E8E0D5] bg-white hover:bg-[#FAF8F5] transition-colors shadow-sm text-[#333333]">
                  <div className="bg-[#E8D8CE]/50 p-3 rounded-full text-[#A67C52]">
                    <DollarSign size={20} />
                  </div>
                  <span className="text-sm font-medium">Record Payment</span>
                </button>
                
                <button className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-[#E8E0D5] bg-white hover:bg-[#FAF8F5] transition-colors shadow-sm text-[#333333]">
                  <div className="bg-[#E8D8CE]/50 p-3 rounded-full text-[#A67C52]">
                    <Upload size={20} />
                  </div>
                  <span className="text-sm font-medium">Upload Photos</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
