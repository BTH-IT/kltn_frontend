'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { IGroup } from '@/types/group';
import { Separator } from '@/components/ui/separator';
import { CreateGroupModal } from '@/components/modals/CreateGroupModal';
import { useGroupContext } from '@/contexts/GroupContext';

import { columns } from './columns';

const GroupClient = () => {
  const { groups, setGroups } = useGroupContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupCreated, setGroupCreated] = useState<IGroup | null>(null);

  useEffect(() => {
    if (groupCreated) {
      setGroups((prev) => [...prev, groupCreated]);
    }
  }, [groupCreated]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Groups (${groups.length})`} description="Manage groups" />
        <Button className="text-xs md:text-sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Thêm mới
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={groups} />
      <CreateGroupModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} setGroupCreated={setGroupCreated} />
    </>
  );
};
export default GroupClient;
