import { FormEvent, useState } from "react";
import { AuthService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { Routes } from "../routes/CONSTANTS";
import { Button, Card, CardBody, CardHeader, Input, Typography } from "@material-tailwind/react";

const LoginPage = () => {
	const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
	const [error, setError] = useState("");
  const navigate = useNavigate();

  const onLoginFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    AuthService.login({ username, password })
      .then((response) => {
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);
        navigate(Routes.HOME);
      })
      .catch(() => {
        setError("Invalid credentials");
      });
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card className="w-2/4">
        <CardBody>
          <CardHeader color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
              Login
            </Typography>
          </CardHeader>
          <form noValidate onSubmit={onLoginFormSubmit}>
            <div className="mt-3">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="mt-3 text-red-500">{error}</div>}
            <div className="mt-3">
              <Button type="submit">Login</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
