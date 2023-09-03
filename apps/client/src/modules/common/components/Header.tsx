import {
  Anchor,
  AppShellHeader,
  Burger,
  Button,
  Container,
  Flex,
  Group,
  Menu,
  Switch,
  useMantineColorScheme
} from "@mantine/core";
import { AppLogo } from "~/assets/AppLogo";
import { Link } from "react-router-dom";
import { IconChevronDown, IconMoonStars, IconSun } from "@tabler/icons-react";
import { useUser } from "~/modules/auth/hooks/useUser";
import { useLogout } from "~/modules/auth/hooks/useLogout";

export function Header({
  fullWidth = false,
  isDashboard = false,
  sidebar
}: {
  fullWidth?: boolean;
  isDashboard?: boolean;
  sidebar?: {
    opened: boolean;
    toggle: () => void;
  };
}) {
  const { user } = useUser();
  const { handleLogout } = useLogout();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const containerProps = {
    size: fullWidth ? undefined : "xl"
  };
  return (
    <AppShellHeader style={{ display: "flex", alignItems: "center" }}>
      <Container w="100%" {...containerProps}>
        <Flex justify="space-between" align="center">
          <Group>
            {sidebar && (
              <Burger
                hiddenFrom="sm"
                opened={sidebar.opened}
                onClick={sidebar.toggle}
              />
            )}
            <Anchor component={Link} to="/dashboard" underline="never">
              <AppLogo size="sm" />
            </Anchor>
            {!isDashboard && (
              <Flex ml="lg" gap="md">
                <Anchor component={Link} to="/" size="sm" underline="never">
                  Home
                </Anchor>
                <Anchor
                  component={Link}
                  to="/leaderboard"
                  size="sm"
                  underline="never"
                >
                  Leaderboard
                </Anchor>
                <Anchor
                  href="https://github.com/naimulcsx/progHours"
                  target="_blank"
                  size="sm"
                  underline="never"
                >
                  Github
                </Anchor>
              </Flex>
            )}
          </Group>
          <Group>
            <Switch
              checked={colorScheme === "dark"}
              color="yellow"
              onChange={() => toggleColorScheme()}
              size="lg"
              onLabel={<IconSun size={16} stroke={1.5} />}
              offLabel={<IconMoonStars size={16} stroke={1.5} />}
            />
            {!user ? (
              <>
                <Button
                  component={Link}
                  to="/auth/sign-in"
                  variant="msu-secondary"
                >
                  Sign In
                </Button>
                <Button component={Link} to="/auth/sign-up">
                  Sign Up
                </Button>
              </>
            ) : (
              <Menu width={200}>
                <Menu.Target>
                  <Button
                    variant="msu-secondary"
                    rightSection={<IconChevronDown size={16} />}
                  >
                    {user.fullName}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>Dashboard</Menu.Item>
                  <Menu.Item>Settings</Menu.Item>
                  <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Flex>
      </Container>
    </AppShellHeader>
  );
}