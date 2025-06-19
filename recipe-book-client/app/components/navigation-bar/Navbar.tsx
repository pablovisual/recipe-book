import React from 'react'
import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";

const Navbar = () => {
  return (
    <div className="mb-24">
      <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
        <div className="h-full flex items-center justify-between mx-auto px-4">

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden sm:inline-flex rounded-full"
            >
              Sign In
            </Button>
            <Button className="rounded-full">Get Started</Button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;