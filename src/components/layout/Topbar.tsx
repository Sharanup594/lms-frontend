'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { dropdownVariants, staggerFast, staggerItem } from '@/lib/motion'
import { useTheme } from '@/hooks/useTheme'
import { useQuery, useMutation } from '@apollo/client/react'
import { MY_NOTIFICATIONS_QUERY, UNREAD_COUNT_QUERY } from '@/lib/graphql/queries'
import { MARK_ALL_NOTIFICATIONS_READ_MUTATION } from '@/lib/graphql/mutations'

interface TopbarProps {
  onMenuClick: () => void
  userName: string
  userRole: string
  onLogout: () => void
}

export function Topbar({ onMenuClick, userName, userRole, onLogout }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { isDark, toggle: toggleTheme, mounted: themeMounted } = useTheme()
  const { data: notifData, refetch: refetchNotifs } = useQuery<any>(MY_NOTIFICATIONS_QUERY, { pollInterval: 30000 })
  const { data: countData } = useQuery<any>(UNREAD_COUNT_QUERY, { pollInterval: 30000 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [markAllRead] = useMutation<any>(MARK_ALL_NOTIFICATIONS_READ_MUTATION)
  const notifications = notifData?.myNotifications ?? []
  const unreadCount = countData?.unreadNotificationCount ?? 0

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

  // unreadCount comes from GraphQL query above

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

      {/* Right: theme + notifications + profile */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        {themeMounted && (
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-all duration-200 cursor-pointer"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
        )}

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
                  <button onClick={async () => { await markAllRead(); refetchNotifs() }} className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors cursor-pointer">
                    Mark all read
                  </button>
                </div>
                <motion.div className="max-h-80 overflow-y-auto divide-y divide-neutral-50" variants={staggerFast} initial="hidden" animate="visible">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-neutral-500">No notifications yet</div>
                  ) : notifications.map((n: { id: string; title: string; message: string; type: string; read: boolean; createdAt: string }) => (
                    <motion.div key={n.id} variants={staggerItem} className={`flex gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer ${!n.read ? 'bg-primary-50/30' : ''}`}>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${n.type === 'success' ? 'bg-success-50 text-success-600' : n.type === 'warning' ? 'bg-warning-50 text-warning-600' : 'bg-primary-50 text-primary-600'}`}>
                        {n.type === 'success' ? '✓' : n.type === 'warning' ? '!' : 'i'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.read ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-700'}`}>{n.title}</p>
                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{n.message}</p>
                        <p className="text-xs text-neutral-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
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
