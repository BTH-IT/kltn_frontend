'use client';

import withPermission from '@/libs/hoc/withPermission';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TodoPage = withPermission(() => {
  return (
    <Tabs defaultValue='assigned'>
      <TabsList>
        <TabsTrigger value='assigned'>Đã giao</TabsTrigger>
        <TabsTrigger value='lost'>Thiếu</TabsTrigger>
        <TabsTrigger value='done'>Xong</TabsTrigger>
      </TabsList>
      <div className='max-w-[500px] mx-auto w-full p-10'>
        <TabsContent value='assigned'>
          Make changes to your account here.
        </TabsContent>
        <TabsContent value='lost'>Change your password here.</TabsContent>
        <TabsContent value='done'>Change your password here.</TabsContent>
      </div>
    </Tabs>
  );
});

export default TodoPage;
