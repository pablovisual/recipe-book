"use client"
import React from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { UserAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase_config';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

interface loginFormData {
  email: string;
  password: string;
}

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

const page = () => {
  const {loginGithubAccount, githubAccount, loginGoogleAccount, googleAccount } = UserAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },

    mode: "onChange",
  });

  const returningUser = async (data: loginFormData) => {
    const { email, password } = data;

    console.log(email, password);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsSubmitting(true);
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const returningGithubUser = async () => {
    try {
      await loginGithubAccount();
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/');
    }

    catch (error) {
      console.error(error);
    };
  }

  const returningGoogleUser = async () => {
    try {
      await loginGoogleAccount();
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/');
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-primay-50 to-primary-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-sm mx-auto'>
        <CardHeader className='text-center'>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(returningUser)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className='rounded-full'
                id="email"
                type="email"
                placeholder="email"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                className='rounded-full'
                id="password"
                type="password"
                placeholder="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='remember' />
                <Label htmlFor='remember'>Remember me</Label>
              </div>

              <a href='#' className='text-sm text-black hover:text-blue-500 hover:underline'>
                Forgot Password?
              </a>
            </div>
            {/*serverError && <p className="text-red-500 text-sm">{serverError}</p>*/}
            <Button type="submit" className="w-full rounded-full">
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col -mt-4">
          <div className="relative max-[767.90px]:w-[44%] my-4 md:w-[30%] flex items-center justify-center">
            <Separator />
            <div className="py-1 px-1.5 border uppercase text-black  rounded-full text-nowrap text-center bg-muted text-xs mx-1 ">
              <span className='max-[767.90px]:hidden'>or continue with</span>
              <span className='md:hidden'>or</span>
            </div>
            <Separator />
          </div>
          <div className='max-[767.90px]:space-y-4 max-[767.90px]:w-full md:flex md:items-center md:space-x-4'>
            <Button type="button" onClick={returningGithubUser} className="w-full max-[767.90px]:flex max-[767.90px]:items-center max-[767.90px]:space-x-1 rounded-full py-3 px-8">
              <span className='md:hidden'>Continue with</span>
              <FaGithub />
            </Button>
            <Button type="button" onClick={returningGoogleUser} className="w-full max-[767.90px]:flex max-[767.90px]:items-center max-[767.90px]:space-x-1 rounded-full py-3 px-8">
              <span className='md:hidden'>Continue with</span>
              <FcGoogle />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default page