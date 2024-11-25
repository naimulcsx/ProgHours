import { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Security Settings',
    },
  ];
};

export default function SettingsSecurity() {
  return <div>SettingsSecurity</div>;
}
