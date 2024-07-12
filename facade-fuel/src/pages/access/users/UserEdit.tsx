import { useEffect, useState } from "react";
import { AccessService } from "../../../services/AccessService";
import { useNavigate, useParams } from "react-router-dom";
import { Routes } from "../../../routes/CONSTANTS";
import { Button, Card, CardBody, CardHeader, Select, Option, Typography } from "@material-tailwind/react";
import { Station } from "../../../models/access/Station";

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState('');
  const [stationId, setStationId] = useState<number | null>(null);
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    if (id) {
      fetchUserById();
    }
    fetchStations(); // Fetch all stations for dropdown
  }, [id])

  const fetchUserById = () => {
    AccessService.getUser(parseInt(id))
      .then((user) => {
        setUsername(user.username);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setRole(user.role);
        setStationId(user.station);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      member: {
        role,
        station: stationId,
      },
    };
    updateUserData(userData);
  };

  const updateUserData = (userData) => {
    AccessService.updateUser(id, userData)
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
                User: {username} ({firstName} {lastName})
              </Typography>
            </CardHeader>

            <form onSubmit={onUserFormSubmit}>
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
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default UserEdit;
