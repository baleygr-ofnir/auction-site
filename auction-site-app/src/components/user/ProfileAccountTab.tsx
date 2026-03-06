import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import userService from '@/services/userService';
import type { UserUpdateRequest } from '@/types/user';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Info, Loader2 } from 'lucide-react';

const profileSchema = z.object({
    email: z.email('Invalid email address.').optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters long.').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileAccountTabProps {
    userId: string;
    currentUsername: string;
}

export function ProfileAccountTab({ userId, currentUsername }: ProfileAccountTabProps) {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: ProfileFormValues) => {
        try {
            const updatePayload: UserUpdateRequest = {
                email: values.email || undefined,
                password: values.password || undefined,
            };
            
            await userService.update(userId, updatePayload);
            form.reset({ email: values.email, password: '' });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card className="bg-slate-950 border-slate-800 text-slate-100">
            <CardHeader>
                <CardTitle className="text-indigo-400">Update Profile</CardTitle>
                <CardDescription className="text-slate-400">
                    Update your email or password here, leave fields blank to keep unchanged.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>

                        {/* VG Requirement: Visual proof that the username cannot be changed */}
                        <div className="space-y-2">
                            <FormLabel className="text-slate-400">Username</FormLabel>
                            <Input
                                type="text"
                                value={currentUsername}
                                disabled
                                className="bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed opacity-70"
                            />
                            <div className="flex items-center gap-2 text-xs text-amber-500/80 mt-1">
                                <Info className="h-3 w-3" />
                                <span>Your username cannot be changed.</span>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">New Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            className="bg-slate-900 border-slate-700 text-indigo-100 focus:border-indigo-500"
                                            placeholder="new@example.com"
                                            {...field}
                                        />
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
                                    <FormLabel className="text-slate-300">New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            className="bg-slate-900 border-slate-700 text-indigo-100 focus:border-indigo-500"
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Restored the loader and disabled state */}
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}