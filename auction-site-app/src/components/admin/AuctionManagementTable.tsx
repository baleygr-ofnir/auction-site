import { Link } from 'react-router-dom';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import type { AuctionListItemResponse } from '@/types/auction';

interface AuctionOversightTableProps {
    auctions: AuctionListItemResponse[];
    onDelete: (id: string, title: string) => void;
    // New handler for inactivation requirement 
    onToggleActive: (id: string, currentStatus: boolean) => void;
}

export function AuctionManagementTable({ auctions, onDelete, onToggleActive }: AuctionOversightTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Title</TableHead>
                    <TableHead className="text-slate-400">Current Price</TableHead>
                    <TableHead className="text-slate-400">Ends</TableHead>
                    <TableHead className="text-right text-slate-400">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {auctions.map(auction => (
                    <TableRow
                        key={auction.id}
                        className={`border-slate-800 hover:bg-slate-900/40 ${!auction.isActive ? 'opacity-60' : ''}`}
                    >
                        <TableCell>
                            {auction.isActive ? (
                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/10">
                                    Visible
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-slate-500 border-slate-700">
                                    Hidden
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell className="font-medium text-slate-200">{auction.title}</TableCell>
                        <TableCell className="text-green-400 font-semibold">{auction.currentPrice} kr</TableCell>
                        <TableCell className="text-slate-400 text-sm">
                            {new Date(auction.endTime).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                            {/* Toggle visibility button to satisfy VG req  */}
                            <Button
                                variant="ghost"
                                size="sm"
                                title={auction.isActive ? "Inactivate (Hide from search)" : "Activate (Show in search)"}
                                className={auction.isActive ? "text-amber-500 hover:text-amber-400 hover:bg-amber-950/20" : "text-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/20"}
                                onClick={() => onToggleActive(auction.id, auction.isActive)}
                            >
                                {auction.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>

                            <Link to={`/auctions/${auction.id}`}>
                                <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/20">
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </Link>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-400 hover:bg-red-950/20"
                                onClick={() => onDelete(auction.id, auction.title)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}