import { useState } from "react";
import {
	TextField as AriaTextField,
	Input,
	Label,
	FieldError,
	Form,
	Button,
} from "react-aria-components";
import { ToggleButton } from "react-aria-components";
import "./LoginPage.css";

interface LoginPageProps {
	onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [toast, setToast] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = Object.fromEntries(new FormData(e.currentTarget));
		setIsPending(true);
		setTimeout(() => {
			setIsPending(false);
			setToast({ type: "success", message: "Welcome back" });
			sessionStorage.setItem("auth_token", "mock-token");
			setTimeout(onLogin, 800);
		}, 1000);
	}

	return (
		<div className="login-page">
			<div className="login-page__card">
				<h1 className="login-page__title">Sign In</h1>
				<Form className="login-page__form" onSubmit={handleSubmit}>
					<AriaTextField
						name="email"
						isRequired
						type="email"
						className="login-page__field"
					>
						<Label>Email</Label>
						<Input
							className="login-page__input"
							placeholder="you@example.com"
						/>
						<FieldError />
					</AriaTextField>

					<AriaTextField
						name="password"
						isRequired
						type={showPassword ? "text" : "password"}
						className="login-page__field"
					>
						<Label>Password</Label>
						<div className="login-page__password-wrap">
							<Input
								className="login-page__input"
								placeholder="Enter password"
							/>
							<ToggleButton
								className="login-page__toggle"
								isSelected={showPassword}
								onChange={setShowPassword}
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? "Hide" : "Show"}
							</ToggleButton>
						</div>
						<FieldError />
					</AriaTextField>

					<Button
						type="submit"
						className="login-page__submit"
						isPending={isPending}
					>
						{isPending ? "Signing in…" : "Sign In"}
					</Button>
				</Form>

				{toast && (
					<div
						className={`login-page__toast login-page__toast--${toast.type}`}
						role="status"
					>
						{toast.message}
					</div>
				)}
			</div>
		</div>
	);
}
