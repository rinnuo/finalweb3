import { useEffect, useState } from "react";
import { AccessService } from "../../../services/AccessService";
import { Station } from "../../../models/access/Station";
import { Routes } from "../../../routes/CONSTANTS";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardHeader } from "@material-tailwind/react";

const StationList = () => {
  const [stationList, setStationList] = useState<Station[]>([]);

  useEffect(() => {
    fetchStationList();
  }, []);

  const fetchStationList = () => {
    AccessService.listStations()
      .then((response) => {
        setStationList(response);
      })
      .catch((error) => {
        console.error("Error fetching stations:", error);
      });
  };

  const deleteStation = (id?: number) => {
    if (!id) return;

    AccessService.deleteStation(id)
      .then(() => {
        fetchStationList();
      })
      .catch((error) => {
        console.error("Error deleting station:", error);
      });
  };

  return (
    <>
      <div className="flex justify-center w-screen">
        <Card className="h-full w-[90%] overflow-scroll mt-5">
          <CardBody>
            <CardHeader shadow={false}>
              <h1 className="text-3xl font-bold">Station List</h1>
            </CardHeader>
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stationList.map((station) => (
                  <tr
                    className="even:bg-blue-gray-50/50"
                    key={"station-" + station.id}
                  >
                    <td>{station.id}</td>
                    <td>{station.name}</td>
                    <td>{station.latitude}</td>
                    <td>{station.longitude}</td>
                    <td>
                      <Link to={Routes.ACCESS.USERS.EDIT_PARAM(station.id)}>
                        <Button size="sm" color="blue">
                          Edit
                        </Button>
                      </Link>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        color="red"
                        onClick={() => deleteStation(station.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default StationList;
