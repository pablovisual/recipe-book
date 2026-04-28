"use client"
import React, { useEffect, useState } from 'react'
import { NavMenu }  from "./nav-menu";
import { UserAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, logOut} = UserAuth();
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const handleSignUp = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/login');
  }

  const handleLogout = async () => {
    try {
      await logOut();
    }
    catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);



  return (
    <div className="h-24">
      <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
        <div className="h-full flex items-center justify-between mx-auto px-4">

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setMobileOpen(v => !v)} className="p-2">
              {mobileOpen ? <HiOutlineX size={20} /> : <HiOutlineMenu size={20} />}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {loading ? null : !user ? (
              <ul className='flex'>
                <li onClick={handleSignUp} className='p-2 cursor-pointer text-black'>
                  Signup
                </li>
                <li onClick={handleLogin} className='p-2 cursor-pointer text-black'>
                  Login
                </li>
              </ul>
            ) : (
              // Show welcome and sign out inline on all screen sizes so user can sign out without opening the menu
              <div className="flex items-center gap-3">
                <p className="text-sm md:text-base">Welcome, { user.displayName }</p>
                <button onClick={ handleLogout } className='text-sm md:text-base hover:text-blue-700'>Sign Out</button>
              </div>
            ) }
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {mobileOpen && (
          <div className="md:hidden absolute left-4 right-4 top-full mt-2 bg-background border rounded-lg shadow-lg z-50 p-4">
            <div className="flex flex-col gap-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="block text-lg">Home</Link>
              <Link href="/recipes" onClick={() => setMobileOpen(false)} className="block text-lg">My Recipes</Link>
              {loading ? null : !user ? (
                <>
                  <button onClick={() => { setMobileOpen(false); handleSignUp(); }} className="text-left">Signup</button>
                  <button onClick={() => { setMobileOpen(false); handleLogin(); }} className="text-left">Login</button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Navbar;