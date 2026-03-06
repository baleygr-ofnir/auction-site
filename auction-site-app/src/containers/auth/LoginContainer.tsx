// Libraries
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
// Custom hooks and services
import { useAuth } from '@/context/AuthContext';
import userService from '@/services/userService';
// Reusable UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const loginSchema = z.object({
    usernameOrEmail: z.string().min(1, 'Username or email is required'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginContainer() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            usernameOrEmail: '',
            password: '',
        },
    });
    
    const onSubmit = async (data: LoginFormData) => {
        setServerError(null);
        
        try {
            const result = await userService.login(data);
            login(result);
            navigate('/auctions', {replace: true});
        } catch (error: unknown) {
            setServerError('Invalid credentials or account deactivated.');
        }
    };
    
    return (
        <div className="grow flex items-center justify-center bg-linear-to-br from-slate-950 to-slate-900 p-4 sm:p-8">
            <Card className="w-full max-w-md bg-slate-950 border-slate-800 shadow-2xl">
                <CardHeader className="space-y-2 pb-6 border-b border-slate-800/50 mb-6">
                    <CardTitle className="text-3xl font-bold text-center text-indigo-400 tracking-tight">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-center text-slate-400 text-base">
                        Sign in to your account to place bids and manage your auctions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="usernameOrEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Username or Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500 h-11"
                                                placeholder="username@example.com"
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
                                    {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}