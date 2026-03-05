import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { userService } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-from-br from-slate-950 to-slate-900 p-8">
            <Card className="w-full max-w-md border-slate-800 shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">
                        Auction Login
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the auction platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="usernameOrEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username or Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="username@example.com" {...field} />
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
                                Sign in
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}