import { useState } from "react";
import { AccessService } from "../../../services/AccessService";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../../routes/CONSTANTS";
import { Button, Card, CardBody, CardHeader, Input, Select, Option, Typography } from "@material-tailwind/react";
import { Station } from "../../../models/access/Station";

const UserCreate = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [stationId, setStationId] = useState<number | null>(null);
  const [stations, setStations] = useState<Station[]>([]);

  const fetchStations = () => {
    AccessService.listStations()
      .then((stations) => {
        setStations(stations);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      member: {
        role,
        station: stationId,
      },
    };
    createNewUser(userData);
  };

  const createNewUser = (userData) => {
    AccessService.createUser(userData)
      .then(() => {
        navigate(Routes.ACCESS.USERS.LIST);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="flex justify-center w-screen">
        <Card className="w-[80%] mt-5">
          <CardBody>
            <CardHeader color="transparent" shadow={false}>
              <Typography variant="h4" color="blue-gray">
                Create New User
              </Typography>
            </CardHeader>

            <form onSubmit={onUserFormSubmit}>
              <div className="mt-3">
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <Input
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
              <div className="mt-3">
                <Select
                  label="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <Option value="Station Manager">Station Manager</Option>
                  <Option value="Seller">Seller</Option>
                  <Option value="Refinery Manager">Refinery Manager</Option>
                  <Option value="Chofer">Chofer</Option>
                  <Option value="Admin">Admin</Option>
                </Select>
              </div>
              <div className="mt-3">
                <Select
                  label="Station"
                  value={stationId || ""}
                  onChange={(e) => setStationId(parseInt(e.target.value))}
                >
                  {stations.map((station) => (
                    <Option key={station.id} value={station.id}>
                      {station.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="mt-3">
                <Button type="submit">Create User</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default UserCreate;
