import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { userService } from '@/services/userService.ts';
import { useAuth } from '@/context/AuthContext';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
            <Card className="w-full max-w-md border-slate-800 shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Join the Auction Site. <br /><br />Already have an account?<br />{' '}
                        <Link to="/login" className="text-blue-400 hover:underline">
                            Sign in
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="your-username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email"  placeholder="user@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {serverError && (
                                <div className="p-4 border rounded-md bg-destructive/10 border-destructive/30 text-destructive text-sm">
                                    {serverError}
                                </div>
                            )}
                            <Button type="submit" className="w-full">
                                Create Account
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}