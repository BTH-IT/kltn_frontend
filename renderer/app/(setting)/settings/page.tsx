'use client';

import { useSearchParams } from 'next/navigation';

import SettingProfile from '@/components/pages/settings/SettingProfile';
import SettingSecurity from '@/components/pages/settings/SettingSecurity';

export default function UserSettingPage() {
  const param = useSearchParams();

  const renderingTabs = {
    profile: <SettingProfile />,
    security: <SettingSecurity />,
  };

  return (
    <section className="my-[30px] mx-[50px] border-solid border-[1px] border-gray-300 rounded-lg py-6 px-10">
      {renderingTabs[param.get('tab') as keyof typeof renderingTabs] ?? <SettingProfile />}
    </section>
  );
}
