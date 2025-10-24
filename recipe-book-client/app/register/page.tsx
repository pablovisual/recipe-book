'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {UserAuth} from '../context/AuthContext';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Separator} from '@/components/ui/separator';
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";

interface FormData {
  email: string;
  password: string;
}

const signUpSchema = z.object({
  email: z.string().toLowerCase().email({message: 'Invalid email address'}),
  password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
});


const page: React.FC = () => {
  const {emailAndPasswordRegister, githubAccount, googleAccount} = UserAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: "onChange"
  });

  const signUp = async (data: FormData) => {
    const {email, password} = data;
    try {
      await emailAndPasswordRegister(email, password);
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/login');

    } catch (error) {
      console.error(error);
    }
  };

  const githubSignUp = async () => {
    try {
      await githubAccount();
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  }

  const googleSignUp = async () => {
    try {
      await googleAccount();
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/');
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-primay-50 to-primary-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader className='text-center'>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Enter your credentials to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(signUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className='rounded-full'
                id="emaile"
                type="email"
                placeholder="Email"
                {...register("email", {required: true})}
              />
              {errors?.email && <span className="text-red-500">{errors?.email.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                className='rounded-full'
                id="password"
                type="password"
                placeholder="Password"
                {...register("password", {required: true})}
              />
              {errors?.password && <span className="text-red-500">{errors?.password.message}</span>}
            </div>
            <Button type="submit" className="w-full rounded-full">
              {isSubmitting ? "Logging in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col -mt-4">
          <div className="relative max-[767.90px]:w-[44%] my-4 md:w-[34%] flex items-center justify-center">
            <Separator className=''/>
            <div
              className="py-1 px-1.5 border uppercase text-black  rounded-full text-nowrap text-center bg-muted text-xs mx-1 ">
              <span className='max-[767.90px]:hidden'>or sign-up with</span>
              <span className='md:hidden'>or</span>
            </div>
            <Separator className=''/>
          </div>
          <div
            className='max-[767.90px]:space-y-4 max-[767.90px]:w-full md:flex md:items-center md:space-x-4'>
            <Button type="button" onClick={githubSignUp}
                    className="w-full max-[767.90px]:flex max-[767.90px]:items-center max-[767.90px]:space-x-1 rounded-full py-3 px-8">
              <span className='md:hidden uppercase'>sign-up with</span>
              <FaGithub/>
            </Button>
            <Button type="button" onClick={googleSignUp}
                    className="w-full max-[767.90px]:flex max-[767.90px]:items-center max-[767.90px]:space-x-1 rounded-full py-3 px-8">
              <span className='md:hidden uppercase'>sign-up with</span>
              <FcGoogle/>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
export default page;