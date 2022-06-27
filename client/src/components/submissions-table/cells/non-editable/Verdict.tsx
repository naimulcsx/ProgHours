import { Cell } from "react-table"
import { Submission } from "@/types/Submission"
import { Badge } from "@chakra-ui/react"

const NonEditableVerdict = (cell: Cell<Submission>) => {
  const styles: any = {
    AC: {
      colorScheme: "green",
    },
    WA: {
      colorScheme: "red",
    },
    // RTE: "bg-pink-200 text-pink-900 rounded w-full font-medium text-sm text-center p-2",
    // TLE: "bg-amber-200 text-amber-900 rounded w-full font-medium text-sm text-center p-2",
    // MLE: "bg-cyan-200 text-cyan-900 rounded w-full font-medium text-sm text-center p-2",
  }
  let value = cell.value
  return (
    <Badge
      variant="subtle"
      fontSize="sm"
      py={1}
      px={2}
      minW="12"
      textAlign="center"
      {...styles[value]}
    >
      <p>{value}</p>
    </Badge>
  )
}

export default NonEditableVerdict
