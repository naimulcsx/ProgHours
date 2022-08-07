import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  useColorModeValue as mode,
} from "@chakra-ui/react"
import { Link as ReactRouterLink } from "react-router-dom"
import Logo from "../Logo"

export const PublicNavbar = () => {
  return (
    <Flex
      as="header"
      position="fixed"
      left={0}
      right={0}
      top={0}
      bg={mode("white", "gray.800")}
      h={14}
      borderBottom="1px solid"
      borderColor={mode("gray.200", "gray.700")}
      alignItems="center"
      zIndex={200}
    >
      <Container>
        <Flex alignItems="center" justifyContent="space-between">
          <ReactRouterLink to="/">
            <Logo />
          </ReactRouterLink>
          <Box>
            <HStack spacing={8}>
              <Link fontWeight="500" as={ReactRouterLink} to="/login">
                Login
              </Link>
              <Link fontWeight="500" as={ReactRouterLink} to="/register">
                Register
              </Link>
            </HStack>
          </Box>
        </Flex>
      </Container>
    </Flex>
  )
}
