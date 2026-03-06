// Libraries
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
// Custom hooks and services
import { useAuth } from '@/context/AuthContext';
import userService from '@/services/userService.ts';
// Reusable UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(32),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterContainer() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });
    
    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null);
        
        try {
            await userService.register(data);
            const loginResult = await userService.login({
                usernameOrEmail: data.email,
                password: data.password,
            });
            login(loginResult);
            navigate('/auctions', { replace: true });
        } catch (error: unknown) {
            setServerError('Registration failed. Username or email may already be registered.');
        }
    };
    
    return (
        <div className="grow flex items-center justify-center bg-linear-to-br from-slate-950 to-slate-900 p-4 sm:p-8">
            <Card className="w-full max-w-md bg-slate-950 border-slate-800 shadow-2xl">
                <CardHeader className="space-y-2 pb-6 border-b border-slate-800/50 mb-6">
                    {/* User instruction: text-indigo-400 applied here */}
                    <CardTitle className="text-3xl font-bold text-center text-indigo-400 tracking-tight">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-center text-slate-400 text-base">
                        Join the Auction Site.<br />
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-medium">
                            Sign in
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500 h-11"
                                                placeholder="your-username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                className="bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500 h-11"
                                                placeholder="user@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500 h-11"
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            {serverError && (
                                <div className="p-3 border rounded-lg bg-red-950/30 border-red-900/50 text-red-400 text-sm text-center">
                                    {serverError}
                                </div>
                            )}

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}