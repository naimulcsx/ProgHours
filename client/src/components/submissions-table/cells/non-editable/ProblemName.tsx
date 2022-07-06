import {
  CFIcon,
  SPOJIcon,
  CCIcon,
  LightOJIcon,
  UVAIcon,
  CSESIcon,
  TophIcon,
  AtCoder,
  UnknownIcon,
  EOlympIcon,
  BeeCrowd,
  HackerRankIcon,
  LeetCodeIcon,
  TimusIcon,
  CodeToWinIcon,
  HackerEarthIcon,
  KattisOJIcon,
} from "@/components/Icons"

import { Cell } from "react-table"
import { Submission } from "@/types/Submission"
import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@heroicons/react/outline"

const iconMap = [
  { prefix: "Gym-", icon: CFIcon },
  { prefix: "CF-", icon: CFIcon },
  { prefix: "SPOJ-", icon: SPOJIcon },
  { prefix: "CC-", icon: CCIcon },
  { prefix: "LOJ-", icon: LightOJIcon },
  { prefix: "UVA-", icon: UVAIcon },
  { prefix: "ICPCLive-", icon: UVAIcon },
  { prefix: "CSES-", icon: CSESIcon },
  { prefix: "TH-", icon: TophIcon },
  { prefix: "AC-", icon: AtCoder },
  { prefix: "Eolymp-", icon: EOlympIcon },
  { prefix: "BC-", icon: BeeCrowd },
  { prefix: "HR-", icon: HackerRankIcon },
  { prefix: "LC-", icon: LeetCodeIcon },
  { prefix: "Tim-", icon: TimusIcon },
  { prefix: "CW-", icon: CodeToWinIcon },
  { prefix: "HE-", icon: HackerEarthIcon },
  { prefix: "KT-", icon: KattisOJIcon },
]

const ProblemName = (cell: Cell<Submission>) => {
  const { pid, name, link } = cell.row.original.problem
  /** Select Icon based on the online judge */
  let OnlineJudgeIcon: any = iconMap
    .filter((item, i) => (pid.includes(item.prefix) ? true : false))
    .at(0)?.icon
  /** If there is no match, use the Unknown icon */
  if (!OnlineJudgeIcon) OnlineJudgeIcon = UnknownIcon
  return (
    <HStack spacing={4}>
      <Flex
        h={10}
        w={10}
        rounded="full"
        align="center"
        justify="center"
        border="1px solid"
        borderColor="gray.200"
      >
        <Box h={10} w={10} p={1.5}>
          <OnlineJudgeIcon />
        </Box>
      </Flex>
      <Box w="full" overflow="hidden">
        <HStack display="flex" alignItems="center">
          <Heading size="sm" fontWeight={600}>
            {pid}
          </Heading>
          <a href={link} target="_blank">
            <ExternalLinkIcon height={16} width={16}></ExternalLinkIcon>
          </a>
        </HStack>
        <Text textOverflow="ellipsis">{name}</Text>
      </Box>
    </HStack>
  )
}

export default ProblemName
