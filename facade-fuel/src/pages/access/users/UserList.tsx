import { useEffect, useState } from "react";
import { AccessService } from "../../../services/AccessService";
import { User } from "../../../models/access/User";
import { Routes } from "../../../routes/CONSTANTS";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardHeader } from "@material-tailwind/react";

const UserList = () => {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = () => {
    AccessService.listUsers()
      .then((response) => {
        setUserList(response);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const deleteUser = (id?: number) => {
    if (!id) return;

    AccessService.deleteUser(id)
      .then(() => {
        fetchUserList();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <>
      <div className="flex justify-center w-screen">
        <Card className="h-full w-[90%] overflow-scroll mt-5">
          <CardBody>
            <CardHeader shadow={false}>
              <h1 className="text-3xl font-bold">User List</h1>
            </CardHeader>
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Station</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user) => (
                  <tr
                    className="even:bg-blue-gray-50/50"
                    key={"user-" + user.id}
                  >
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>
                      {user.first_name} {user.last_name}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.station}</td>
                    <td>
                      <Link to={Routes.ACCESS.USERS.EDIT_PARAM(user.id)}>
                        <Button size="sm" color="blue">
                          Edit
                        </Button>
                      </Link>
                    </td>
                    <td>
                      <Button size="sm" color="red" onClick={() => deleteUser(user.id)}>
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

export default UserList;
