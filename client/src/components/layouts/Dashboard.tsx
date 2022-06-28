import { FC, ReactNode } from "react"

/**
 * Import Components
 */
import Navbar from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
// import MobileNav from "@/components/MobileNav"
import { Box, Heading } from "@chakra-ui/react"

interface DashboardLayoutProps {
  children?: ReactNode
  title?: string
  description?: string
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <Box>
      {/* topbar */}
      <Navbar />
      {/* sidebar */}
      <Box h="100vh" className="flex" overflow="hidden">
        {/* <Sidebar /> */}
        <Sidebar />
        {/* main content */}
        <Box w="full" p={4} mt={14} overflowY="auto">
          {title && (
            <Box className="mb-4">
              <Heading fontSize="2xl" fontWeight={700}>
                {title}
              </Heading>
            </Box>
          )}
          {children}
        </Box>
      </Box>
      {/* <MobileNav></MobileNav> */}
    </Box>
  )
}
