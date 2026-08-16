import { Link } from "@tanstack/react-router"
import { LayoutTemplate } from "lucide-react"

import * as m from "@/paraglide/messages.js"

const navItems = [
  { to: "/landings", label: () => m.shellLandingsNav(), icon: LayoutTemplate },
  // "/settings" isn't built yet — Phase 1+ fills this in (studio/CRM land first).
]

export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-1 border-r p-3">
      <div className="px-2 py-2 font-heading text-sm font-medium">
        {m.appName()}
      </div>
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground [&.active]:bg-muted [&.active]:text-foreground"
          >
            <item.icon className="size-4" />
            {item.label()}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
