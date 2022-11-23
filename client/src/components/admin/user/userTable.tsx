import "regenerator-runtime/runtime"
import { useState } from "react"
import type { User } from "~/contexts/UserContext"
import { DataGrid } from "~/components/datagrid"
import { Group, Box, Text, Button, Anchor } from "@mantine/core"
import Avatar from "~/components/Avatar"
import Action from "./Actions"

export default function UserManagementTable({ users }: { users: User[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Box sx={{ marginLeft: -16, marginRight: -16 }}>
        <DataGrid
          tableTitle="Users"
          withGlobalFilter
          sx={(theme) => ({
            background: "white",
            boxShadow: theme.shadows.xs,
          })}
          data={users || []}
          withPagination
          horizontalSpacing="md"
          pageSizes={["25", "50", "100"]}
          initialState={{ pagination: { pageSize: 25 } }}
          columns={[
            {
              accessorKey: "id",
              header: "Id",
              size: 30,
            },
            {
              accessorKey: "name",
              header: "Name",
              size: 300,
              cell: (cell) => {
                const name = cell.getValue() as string
                return (
                  <Group>
                    <Avatar name={name} />
                    <Text>{name}</Text>
                  </Group>
                )
              },
            },
            {
              accessorKey: "username",
              header: "University Id",
              cell: (cell) => (cell.getValue() as string).toUpperCase(),
            },
            {
              accessorKey: "email",
              header: "Email",
            },
            {
              accessorKey: "batch",
              header: "Batch",
              cell: (cell) => (cell.getValue() ? (cell.getValue() as string) : "—"),
            },
            {
              accessorKey: "mobile",
              header: "Mobile",
              cell: (cell) => (cell.getValue() ? (cell.getValue() as string) : "—"),
            },
            {
              accessorKey: "cgpa",
              header: "CGPA",
              cell: (cell) => (cell.getValue() ? (cell.getValue() as string) : "—"),
            },
            {
              accessorKey: "role",
              header: "Role",
            },
            {
              header: "Action",
              cell: Action,
            },
          ]}
        />
      </Box>
    </>
  )
}
