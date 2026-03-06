// Libraries
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// Custom hooks and services
import auctionService from '@/services/auctionService';
// Custom types
import type { AuctionCreateRequest } from '@/types/auction';
// Reusable UI components
import {Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters.'),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    startPrice: z.number().min(1, 'Starting price must be at least 1 kr.'),
    startTime: z.string().min(1, 'Start time is required.'),
    endTime: z.string().min(1, 'End time is required.'),
}).refine((data) => {
    // Ensure start time isn't in the past (allowing a 1-minute buffer for form filling)
    const now = new Date();
    now.setMinutes(now.getMinutes() - 1);
    return new Date(data.startTime) >= now;
}, {
    message: 'Start time cannot be in the past.',
    path: ['startTime'],
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'End time must be strictly after the start time.',
    path: ['endTime'],
});

export function CreateAuctionContainer() {
    const navigate = useNavigate();
    const [globalError, setGlobalError] = useState<string | null>(null);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            startPrice: 0,
            startTime: '',
            endTime: '',
        },
    });
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setGlobalError(null);
        
        try {
            const payload: AuctionCreateRequest = {
                title: values.title,
                description: values.description,
                startPrice: values.startPrice,
                startTime: new Date(values.startTime),
                endTime: new Date(values.endTime),
            };
            
            const createdAuction = await auctionService.create(payload);
            navigate(`/auctions/${createdAuction.id}`);
        } catch (error) {
            const errorMessage = 'Failed to create auction';
            console.error(errorMessage, error);
            setGlobalError(errorMessage);
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <Card className="bg-slate-900 border-slate-900">
                <CardHeader>
                    <CardTitle className="text-2xl text-indigo-400">Create New Auction</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <CardContent>
                            {globalError && (
                                <div className="mb-6 flex items-center gap-2 p-4 text-red-500 bg-red-950/50 border border-red-900 rounded-md">
                                    <AlertCircle className="h-5 w5" />
                                    <p className="text-sm">{globalError}</p>
                                </div>
                            )}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Vintage Rolex Submariner..." className="bg-slate-950 border-slate-800 text-indigo-100" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Provide detailed information about the item's condition..."
                                                className="bg-slate-950 border-slate-800 min-h-30 text-indigo-100"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="startPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Starting Price (kr)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="1"
                                                step="1"
                                                className="bg-slate-950 border-slate-800 text-indigo-100"
                                                {...field}
                                                // Add this line so RHF gets a number, not a string
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="startTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Start Time</FormLabel>
                                            <FormControl>
                                                {/* Notice how clean this is now. No value slicing needed! */}
                                                <Input type="datetime-local" className="bg-slate-950 border-slate-800 text-indigo-100" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">End Time</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" className="bg-slate-950 border-slate-800 text-indigo-100" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? 'Creating...' : 'Create Auction'}
                                </Button>
                            </CardFooter>
                        </CardContent>
                    </form>
                </Form>
            </Card>
        </div>
    );
}