import {
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useAppStore } from "../store";

export function LoginPage() {
  const login = useAppStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (v) =>
        /^\S+@\S+\.\S+$/.test(v) ? null : "Please enter a valid email",
      password: (v) =>
        v.length >= 6 ? null : "Password must be at least 6 characters",
    },
    validateInputOnBlur: true,
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    // Simulate network request
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    if (
      values.email === "admin@example.com" &&
      values.password === "password"
    ) {
      notifications.show({
        title: "Welcome back",
        message: "You have been logged in successfully",
        color: "green",
      });
      login();
    } else {
      notifications.show({
        title: "Invalid credentials",
        message: "Please check your email and password",
        color: "red",
      });
    }
  });

  return (
    <Center h="100vh">
      <Paper shadow="md" p="xl" w={400} withBorder>
        <Title order={2} mb="lg" ta="center">
          Schema Architect
        </Title>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="admin@example.com"
              required
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps("password")}
            />
            <Button type="submit" loading={loading} fullWidth>
              Sign in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
