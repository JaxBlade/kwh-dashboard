"use client";

import Link from "next/link";
import { Zap, ShieldAlert, Users, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-screen animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 dark:bg-violet-600/20 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="max-w-md w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden border border-slate-200/60 dark:border-slate-800/60 transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
        <div className="p-10 text-center relative overflow-hidden">
          {/* Header Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 opacity-10 dark:opacity-20 z-0"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/30 transform transition hover:scale-105 duration-300">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Smart Power</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">BMS 52 Floors • Real-time Monitoring</p>
          </div>
        </div>
        
        <div className="p-8 pt-4">
          <div className="space-y-4">
            <Link
              href="/admin"
              className="w-full flex items-center p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 transition-all duration-300 group"
            >
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <ShieldAlert className="h-6 w-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
              </div>
              <div className="ml-5 text-left flex-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Portal Admin</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Akses kendali penuh</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/tenant"
              className="w-full flex items-center p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 hover:bg-violet-50/50 dark:hover:border-violet-500/30 dark:hover:bg-violet-500/10 transition-all duration-300 group"
            >
              <div className="p-3 bg-violet-100 dark:bg-violet-950 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                <Users className="h-6 w-6 text-violet-600 dark:text-violet-400 group-hover:text-white" />
              </div>
              <div className="ml-5 text-left flex-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Portal Tenant</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Akses personal unit</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-700 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
      
      <p className="mt-12 text-slate-400 dark:text-slate-600 text-sm font-medium tracking-wide">
        &copy; {new Date().getFullYear()} BMS Intelligence. All rights reserved.
      </p>
    </div>
  );
}
