'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { dropdownVariants, staggerFast, staggerItem } from '@/lib/motion'

const mockNotifications = [
  { id: '1', title: 'New course available', message: 'Leadership Fundamentals has been updated with new content', time: '5 min ago', read: false, avatar: 'Dr. Sarah Chen' },
  { id: '2', title: 'Assignment graded', message: 'You scored 95% on Python Basics Quiz', time: '1 hour ago', read: false, avatar: 'Prof. James Wright' },
  { id: '3', title: 'Course reminder', message: 'Continue where you left off in Cybersecurity Essentials', time: '3 hours ago', read: false, avatar: 'Dr. Michael Park' },
  { id: '4', title: 'Certificate ready', message: 'Your PMP certificate is ready to download', time: 'Yesterday', read: true, avatar: 'Maria Rodriguez' },
]

interface TopbarProps {
  onMenuClick: () => void
  userName: string
  userRole: string
  onLogout: () => void
}

export function Topbar({ onMenuClick, userName, userRole, onLogout }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200/80 bg-white px-4 lg:px-6">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 lg:hidden cursor-pointer transition-all duration-200"
          aria-label="Toggle navigation"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            placeholder="Search courses, lessons..."
            className="h-10 w-72 rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-all duration-200 cursor-pointer"
            aria-label="Notifications"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white ring-2 ring-white badge-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white border border-neutral-200/80 shadow-xl shadow-neutral-900/10 z-50 overflow-hidden"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
                  <button className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors cursor-pointer">
                    Mark all read
                  </button>
                </div>
                <motion.div className="max-h-80 overflow-y-auto divide-y divide-neutral-50" variants={staggerFast} initial="hidden" animate="visible">
                  {mockNotifications.map((n) => (
                    <motion.div key={n.id} variants={staggerItem} className={`flex gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer ${!n.read ? 'bg-primary-50/30' : ''}`}>
                      <Avatar name={n.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.read ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-700'}`}>{n.title}</p>
                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{n.message}</p>
                        <p className="text-xs text-neutral-400 mt-1">{n.time}</p>
                      </div>
                      {!n.read && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-500" />}
                    </motion.div>
                  ))}
                </motion.div>
                <div className="border-t border-neutral-100 p-2">
                  <button className="w-full rounded-xl py-2 text-center text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-neutral-200 mx-1" />

        {/* Profile */}
        <div className="flex items-center gap-2.5 rounded-xl p-1.5">
          <Avatar name={userName} size="sm" />
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-neutral-900">{userName}</p>
            <p className="text-xs text-neutral-500 capitalize">{userRole}</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="hidden md:flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-neutral-500 hover:bg-danger-50 hover:text-danger-600 transition-all duration-200 cursor-pointer"
          aria-label="Sign out"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </button>
      </div>
    </header>
  )
}
