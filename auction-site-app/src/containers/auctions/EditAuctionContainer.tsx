import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Info, ChevronLeft, Loader2 } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import auctionService from '@/services/auctionService';
import type { AuctionDetailResponse, AuctionUpdateRequest } from '@/types/auction';

const editAuctionSchema = z.object({
    title: z.string().min(3, 'Title is too short'),
    description: z.string().min(10, 'Description is too short'),
    startPrice: z.number().optional(),
    endTime: z.string().min(1, 'End time is required'),
    isActive: z.boolean(),
});

type EditAuctionFormValues = z.infer<typeof editAuctionSchema>;

export default function EditAuctionContainer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [auction, setAuction] = useState<AuctionDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<EditAuctionFormValues>({
        resolver: zodResolver(editAuctionSchema),
        defaultValues: {
            title: '',
            description: '',
            startPrice: 0,
            endTime: '',
            isActive: true,
        },
    });

    // Fetch the auction data when the component mounts
    useEffect(() => {
        if (!id) return;

        auctionService.getById(id)
            .then((data) => {
                setAuction(data);
                // Populate the form with the fetched data
                form.reset({
                    title: data.title,
                    description: data.description,
                    startPrice: data.startPrice,
                    endTime: new Date(data.endTime).toISOString().slice(0, 16),
                    isActive: data.isActive,
                });
            })
            .catch((err) => {
                console.error("Failed to fetch auction:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id, form]);

    async function onSubmit(data: EditAuctionFormValues) {
        if (!id || !auction) return;

        try {
            const payload: AuctionUpdateRequest = {
                title: data.title,
                description: data.description,
                endTime: new Date(data.endTime),
                isActive: data.isActive
            };

            // VG logic: Block price update if bids exist [cite: 30]
            const hasBids = 'bids' in auction && auction.bids.length > 0;
            if (!hasBids && data.startPrice !== undefined) {
                payload.startPrice = data.startPrice;
            }

            await auctionService.update(id, payload);
            navigate(`/auctions/${id}`);
        } catch (err) {
            console.error("Submission failed:", err);
        }
    }

    // Handle loading and error states securely before rendering the form
    if (isLoading) {
        return <div className="flex items-center justify-center p-12 text-slate-400"><Loader2 className="animate-spin h-8 w-8" /></div>;
    }

    if (!auction) {
        return <div className="text-red-400 p-8 text-center border border-red-900 bg-red-950/20 rounded-lg max-w-2xl mx-auto">Could not load the auction data.</div>;
    }

    // Safe to evaluate bids now that auction is guaranteed to exist
    const hasBids = 'bids' in auction && auction.bids.length > 0;

    return (
        <div className="max-w-2xl mx-auto py-4">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 text-slate-500 hover:text-slate-300 p-0 hover:bg-transparent"
            >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-slate-900/40 border border-slate-800 p-8 rounded-2xl shadow-xl">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-400">Title</FormLabel>
                                <FormControl>
                                    <Input className="bg-slate-950 border-slate-800 text-slate-100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-400">Description</FormLabel>
                                <FormControl>
                                    <Textarea className="bg-slate-950 border-slate-800 text-slate-100 min-h-30" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="startPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-400">Starting Price (SEK)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            disabled={hasBids}
                                            className="bg-slate-950 border-slate-800 text-slate-100 disabled:opacity-50 disabled:bg-slate-900/50"
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-400">End Date & Time</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            className="bg-slate-950 border-slate-800 text-slate-100 scheme-dark"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {hasBids && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-950/20 border border-amber-900/30">
                            <Info className="h-5 w-5 text-amber-500 shrink-0" />
                            <p className="text-sm text-amber-200/80 leading-snug">
                                Starting price is locked because bids have already been placed.
                            </p>
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-slate-200">Active Status</FormLabel>
                                    <p className="text-xs text-slate-500 italic tracking-tight">Deactivate to hide from public searches.</p>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-bold shadow-lg shadow-indigo-500/20">
                        {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}