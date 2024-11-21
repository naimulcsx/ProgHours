import { Text } from '@mantine/core';

import { SVGProps } from 'react';

import {
  AtCoderIcon,
  BeeCrowdIcon,
  CSESIcon,
  CodeChefIcon,
  CodeToWinIcon,
  CodeforcesIcon,
  EolympIcon,
  HackerRankIcon,
  HackerearthIcon,
  KattisIcon,
  LeetCodeIcon,
  LightOJIcon,
  SPOJIcon,
  TimusIcon,
  TophIcon,
  UVAIcon,
} from '~/assets/oj-icons';

interface OJIconProps extends SVGProps<SVGSVGElement> {
  pid: string;
}

const iconMap = [
  { prefix: 'Gym-', icon: CodeforcesIcon, name: 'Codeforces Gym' },
  { prefix: 'CF-', icon: CodeforcesIcon, name: 'Codeforces' },
  { prefix: 'SPOJ-', icon: SPOJIcon, name: 'Sphere Online Judge' },
  { prefix: 'CC-', icon: CodeChefIcon, name: 'CodeChef' },
  { prefix: 'LOJ-', icon: LightOJIcon, name: 'LightOJ' },
  { prefix: 'UVA-', icon: UVAIcon, name: 'UVA Online Judge' },
  { prefix: 'ICPCLive-', icon: UVAIcon, name: 'ICPC Live Archive' },
  { prefix: 'CSES-', icon: CSESIcon, name: 'CSES Problem Set' },
  { prefix: 'Toph-', icon: TophIcon, name: 'Toph' },
  { prefix: 'AC-', icon: AtCoderIcon, name: 'AtCoder' },
  { prefix: 'Eolymp-', icon: EolympIcon, name: 'E-Olymp' },
  { prefix: 'BC-', icon: BeeCrowdIcon, name: 'BeeCrowd' },
  { prefix: 'HR-', icon: HackerRankIcon, name: 'HackerRank' },
  { prefix: 'LC-', icon: LeetCodeIcon, name: 'LeetCode' },
  { prefix: 'Tim-', icon: TimusIcon, name: 'Timus Online Judge' },
  { prefix: 'CW-', icon: CodeToWinIcon, name: 'Code to Win' },
  { prefix: 'HE-', icon: HackerearthIcon, name: 'HackerEarth' },
  { prefix: 'KT-', icon: KattisIcon, name: 'Kattis' },
];

export function OJIcon({ pid, ...props }: OJIconProps) {
  const matchedIcon = iconMap.find(({ prefix }) => pid.startsWith(prefix));

  if (!matchedIcon) {
    return null;
  }

  const Icon = matchedIcon.icon;
  return (
    <>
      <Icon {...props} />
      <Text size="sm" fw={500}>
        {matchedIcon.name}
      </Text>
    </>
  );
}
