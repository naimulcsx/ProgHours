import { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Handles Settings',
    },
  ];
};

export default function SettingsHandles() {
  return <div>SettingsHandles</div>;
}
