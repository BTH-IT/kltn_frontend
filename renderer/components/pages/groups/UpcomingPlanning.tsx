'use client';
import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Deadline = {
  id: number;
  title: string;
  dueDate: string;
};

export default function UpcomingPlanning() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([
    { id: 1, title: 'Project Proposal', dueDate: 'Due in 2 days' },
    { id: 2, title: 'Midterm Presentation', dueDate: 'Due in 2 weeks' },
    { id: 3, title: 'Final Report', dueDate: 'Due in 6 weeks' },
  ]);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const dueDate = formData.get('dueDate') as string;

    if (editingDeadline) {
      setDeadlines(deadlines.map((d) => (d.id === editingDeadline.id ? { ...d, title, dueDate } : d)));
    } else {
      const newDeadline = { id: Date.now(), title, dueDate };
      setDeadlines([...deadlines, newDeadline]);
    }

    setEditingDeadline(null);
  };

  const handleEdit = (deadline: Deadline) => {
    setEditingDeadline(deadline);
  };

  const handleDelete = (id: number) => {
    setDeadlines(deadlines.filter((d) => d.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Upcoming Deadlines
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="w-4 h-4" />
                <span className="sr-only">Add new deadline</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingDeadline ? 'Edit Deadline' : 'Add New Deadline'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={editingDeadline?.title} required />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" name="dueDate" defaultValue={editingDeadline?.dueDate} required />
                </div>
                <Button type="submit">{editingDeadline ? 'Update' : 'Add'} Deadline</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {deadlines.map((deadline) => (
            <li key={deadline.id} className="flex items-center justify-between">
              <span>{deadline.title}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{deadline.dueDate}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(deadline)}>
                      <Edit2 className="w-4 h-4" />
                      <span className="sr-only">Edit deadline</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Deadline</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={deadline.title} required />
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input id="dueDate" name="dueDate" defaultValue={deadline.dueDate} required />
                      </div>
                      <Button type="submit">Update Deadline</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(deadline.id)}>
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Delete deadline</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
