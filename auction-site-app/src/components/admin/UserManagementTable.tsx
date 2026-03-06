import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, UserMinus, UserCheck, ShieldAlert } from 'lucide-react';
import type { UserResponse } from '@/types/user';

interface UserManagementTableProps {
    users: UserResponse[];
    onToggleStatus: (user: UserResponse) => void;
    onToggleAdmin: (user: UserResponse) => void;
}

export function UserManagementTable({ users, onToggleStatus, onToggleAdmin }: UserManagementTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">User</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Role</TableHead>
                    <TableHead className="text-right text-slate-400">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-slate-500 italic">
                            No users in this category.
                        </TableCell>
                    </TableRow>
                ) : (
                    users.map(user => (
                        <TableRow key={user.id} className={`border-slate-800 hover:bg-slate-900/40 ${!user.isActive ? 'opacity-60' : ''}`}>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-200">{user.username}</span>
                                    <span className="text-xs text-slate-500">{user.email}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                    {user.isActive ? 'Active' : 'Suspended'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {user.isAdmin ? (
                                    <Badge className="bg-indigo-600 text-white gap-1">
                                        <ShieldAlert size={12} /> Admin
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-slate-500 border-slate-800">User</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={user.isActive ? "text-red-400 hover:text-red-300 hover:bg-red-950/20" : "text-green-400 hover:text-green-300 hover:bg-green-950/20"}
                                    onClick={() => onToggleStatus(user)}
                                >
                                    {user.isActive ? <UserMinus size={18}/> : <UserCheck size={18} />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/20"
                                    onClick={() => onToggleAdmin(user)}
                                >
                                    <Shield size={18} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}