"use client"
import React, { useEffect, useState } from 'react'
import { NavMenu }  from "./nav-menu";
import { UserAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, logOut} = UserAuth();
  const [loading, setLoading] = useState(true);
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

          <div className="flex items-center gap-3">
            {loading ? null : !user ? (<ul className='flex'>
              <li onClick={handleSignUp} className='p-2 cursor-pointer text-black'>
                Signup
              </li>
              <li onClick={handleLogin} className='p-2 cursor-pointer text-black'>
                Login
              </li>
            </ul>) : (
              <div>
                <p>Welcome, { user.displayName }</p>
                <p onClick={ handleLogout } className='cursor-pointer text-black'>Sign Out</p>
              </div>
            ) }
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;