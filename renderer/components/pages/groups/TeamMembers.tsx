'use client';
import { Crown, Plus, X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isCaptain: boolean;
}

const TeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'Frontend Developer',
      avatar: '/placeholder.svg?height=40&width=40',
      isCaptain: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Backend Developer',
      avatar: '/placeholder.svg?height=40&width=40',
      isCaptain: false,
    },
    {
      id: '3',
      name: 'Alex Johnson',
      role: 'UI/UX Designer',
      avatar: '/placeholder.svg?height=40&width=40',
      isCaptain: false,
    },
    {
      id: '4',
      name: 'Emily Brown',
      role: 'Project Manager',
      avatar: '/placeholder.svg?height=40&width=40',
      isCaptain: false,
    },
    {
      id: '5',
      name: 'Chris Lee',
      role: 'QA Engineer',
      avatar: '/placeholder.svg?height=40&width=40',
      isCaptain: false,
    },
  ]);
  const [newMember, setNewMember] = useState({ name: '', role: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addMember = () => {
    if (newMember.name.trim() && newMember.role.trim()) {
      setMembers([
        ...members,
        {
          id: (members.length + 1).toString(),
          name: newMember.name,
          role: newMember.role,
          avatar: '/placeholder.svg?height=40&width=40',
          isCaptain: false,
        },
      ]);
      setNewMember({ name: '', role: '' });
      setIsDialogOpen(false);
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const toggleCaptain = (id: string) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, isCaptain: !member.isCaptain } : { ...member, isCaptain: false },
      ),
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
                <DialogDescription>Enter the details of the new team member here.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addMember}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 space-x-4 rounded-lg shadow-sm bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </div>
                  {member.isCaptain && (
                    <Badge variant="secondary">
                      <Crown className="w-3 h-3 mr-1" />
                      Captain
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => toggleCaptain(member.id)}>
                    {member.isCaptain ? 'Remove Captain' : 'Make Captain'}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)}>
                    <X className="w-4 h-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TeamMembers;
