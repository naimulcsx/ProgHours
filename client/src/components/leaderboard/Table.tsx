import { useEffect, useMemo } from "react"
import { useTable, useSortBy, Cell, Column } from "react-table"
import { RanklistItem } from "@/types/RanklistItem"
import { Link } from "react-router-dom"

/**
 * Import Icons
 */
import {
  ArrowSmDownIcon,
  ArrowSmUpIcon,
  PlusIcon,
  FilterIcon,
  XIcon,
} from "@heroicons/react/solid"

import {
  Box,
  Table,
  Avatar,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Flex,
  useColorModeValue as mode,
  Text,
  Badge,
  Button,
  IconButton,
} from "@chakra-ui/react"
import { getAvatarColors } from "@/utils/getAvatarColors"
import { CELL_STYLES } from "./cellStyles"
import { LeaderboardFilters } from "./Filters"

const UserCell = (cell: Cell<RanklistItem>) => {
  return (
    <Link to={`/users/${cell.row.original.user.username}`}>
      <Flex alignItems="center" gap={4}>
        <Avatar
          name={cell.row.original.user.name}
          size="sm"
          {...getAvatarColors(cell.row.original.user.name)}
        />
        <Box>
          <Text color={mode("gray.900", "white")}>{cell.value}</Text>
          <Text color={mode("gray.500", "gray.400")} fontSize="sm">
            {cell.row.original.user.username.toUpperCase()}
          </Text>
        </Box>
      </Flex>
    </Link>
  )
}

const LeaderboardTable = ({
  ranklist,
  setFilters,
  filters,
}: {
  ranklist: RanklistItem[]
  setFilters: any
  filters: any
}) => {
  /**
   * Define table columns
   */
  const tableColumns = useMemo(
    () =>
      [
        {
          Header: "#",
          accessor: (row: RanklistItem, i: number) => i + 1,
        },
        {
          Header: "Name",
          accessor: "user.name",
          Cell: UserCell,
        },
        {
          Header: "Solve Count",
          accessor: "totalSolved",
        },
        {
          Header: "Solve Time",
          accessor: "totalSolveTime",
        },
        {
          Header: "Average Difficulty",
          accessor: (row: RanklistItem) => row.averageDifficulty.toFixed(2),
        },
        {
          Header: "Points",
          accessor: (row: RanklistItem) => row.points.toFixed(2),
        },
      ] as Column<RanklistItem>[],
    []
  )

  const { getTableProps, rows, prepareRow, headerGroups } = useTable(
    {
      data: ranklist,
      columns: tableColumns,
    },
    useSortBy
  )

  return (
    <Box mx={-4} overflowX="auto">
      <Box mx={4} mb={4}>
        <LeaderboardFilters setFilters={setFilters} filters={filters} />
        {Object.keys(filters).map((key: any) => {
          const obj: any = {
            eq: "==",
            gte: ">=",
            lte: "<=",
          }
          return (
            <Badge
              key={key}
              bg={mode("blue.50", "gray.700")}
              rounded="full"
              py={1.5}
              px={3}
              ml={3}
              color={mode("blue.600", "blue.200")}
              border="1px solid"
              borderColor={mode("blue.100", "gray.600")}
              display="inline-flex"
              gap={2}
            >
              <Text>
                {key} {obj[filters[key].type]} {filters[key].value}
              </Text>
              <Box
                as="button"
                onClick={() => {
                  setFilters((prev: any) => {
                    const newState = { ...prev }
                    delete newState[key]
                    return newState
                  })
                }}
              >
                <XIcon height={16} />
              </Box>
            </Badge>
          )
        })}
      </Box>
      <Table w="full" {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => {
            return (
              <Tr
                textColor="gray.500"
                textTransform="uppercase"
                bg={mode("gray.100", "gray.900")}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      {...header.getHeaderProps(header.getSortByToggleProps())}
                      py={3}
                      borderBottom="1px solid"
                      borderColor={mode("gray.200", "gray.700")}
                      letterSpacing="-0.5px"
                    >
                      <Flex align="center" minH="5">
                        <Box as="span" fontSize={["11px", "xs"]}>
                          {header.render("Header")}
                        </Box>
                        <Box as="span" ml={1}>
                          {header.isSorted ? (
                            header.isSortedDesc ? (
                              <ArrowSmDownIcon height={16} />
                            ) : (
                              <ArrowSmUpIcon height={16} />
                            )
                          ) : (
                            ""
                          )}
                        </Box>
                      </Flex>
                    </Th>
                  )
                })}
              </Tr>
            )
          })}
        </Thead>
        <Tbody>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <Tr
                {...row.getRowProps()}
                _hover={{ bg: mode("gray.50", "gray.700") }}
                bg={mode("white", "gray.800")}
              >
                {row.cells.map((cell) => {
                  const cellType: any = cell.column.Header
                  return (
                    <Td
                      {...cell.getCellProps()}
                      className="py-3 border-b"
                      borderColor={mode("gray.200", "gray.700")}
                      {...CELL_STYLES[cellType]}
                    >
                      {cell.render("Cell")}
                    </Td>
                  )
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Box>
  )
}

export default LeaderboardTable
