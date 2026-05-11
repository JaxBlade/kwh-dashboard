"use client";

import Link from "next/link";
import { Zap, ShieldAlert, Users } from "lucide-react";

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
        <div className="bg-blue-600 p-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Smart kWh Meter</h1>
          <p className="text-blue-100 text-sm">Sistem Monitoring Pemakaian Listrik Telkom Landmark Tower</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-6 text-center">
            Pilih Role
          </h2>
          
          <div className="space-y-4">
            <Link
              href="/admin"
              className="w-full flex items-center p-4 rounded-xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <ShieldAlert className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Admin</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Kelola 52 lantai & tagihan</p>
              </div>
            </Link>

            <Link
              href="/tenant"
              className="w-full flex items-center p-4 rounded-xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
            >
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Users className="h-6 w-6 text-emerald-600 group-hover:text-white" />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Tenant</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Pantau pemakaian unit</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-neutral-400 text-sm text-center">
        &copy; {new Date().getFullYear()} Building Management System
      </p>
    </div>
  );
}
