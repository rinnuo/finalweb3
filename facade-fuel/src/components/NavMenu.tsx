import { useEffect, useState } from "react";
import { Button, Menu, MenuHandler, MenuItem, MenuList, Navbar, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { Routes } from "../routes/CONSTANTS";
import { AuthService } from "../services/AuthService";

const NavMenu = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {

    if(access_token) {
      AuthService.getUserInfo()
        .then((userInfo) => {
          setName(userInfo.first_name + ' ' + userInfo.last_name);
          setRole(userInfo.role);
        })
        .catch(() => {
          doLogout();
        });
    }
    
  });
  
  const doLogout = () => {
    AuthService.logout().then(() => {
      navigate(Routes.LOGIN);
    });
    setName("");
    setRole("");
  };
  
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {role === "Admin" && (
        <>
          <Typography as="li" variant="small" className="p-1 font-normal">
            <Menu>
              <MenuHandler>
                <Typography className="cursor-pointer">Users</Typography>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <Link to={Routes.ACCESS.USERS.LIST}>User List</Link>
                </MenuItem>
                <MenuItem>
                  <Link to={Routes.ACCESS.USERS.CREATE}>Create User</Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </Typography>
          <Typography as="li" variant="small" className="p-1 font-normal">
            <Menu>
              <MenuHandler>
                <Typography className="cursor-pointer">Stations</Typography>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <Link to={Routes.ACCESS.STATIONS.LIST}>Station List</Link>
                </MenuItem>
                <MenuItem>
                  <Link to={Routes.ACCESS.STATIONS.CREATE}>Create Station</Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </Typography>
        </>
      )}
      {role === "Station Manager" && (
        <>
          <Typography as="li" variant="small" className="p-1 font-normal">
            <Menu>
              <MenuHandler>
                <Typography className="cursor-pointer">Pumps</Typography>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <Link to={Routes.ACCESS.USERS.LIST}>Pump List</Link>
                </MenuItem>
                <MenuItem>
                  <Link to={Routes.ACCESS.USERS.CREATE}>Create Pump</Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </Typography>
          <Typography as="li" variant="small" className="p-1 font-normal">
            <Menu>
              <MenuHandler>
                <Typography className="cursor-pointer">Sales</Typography>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <Link to={Routes.ACCESS.STATIONS.LIST}>Sale List</Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </Typography>
        </>
      )}
      {role === "Seller" && (
        <>
          <Typography as="li" variant="small" className="p-1 font-normal">
            <Menu>
              <MenuHandler>
                <Typography className="cursor-pointer">Sales</Typography>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <Link to={Routes.ACCESS.STATIONS.LIST}>Make a Sale</Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </Typography>
        </>
      )}
      {role === "Refinery Manager" && (
        <>
          <Typography as="li" variant="small" className="p-1 font-normal">
            <Menu>
              <MenuHandler>
                <Typography className="cursor-pointer">Trucks</Typography>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <Link to={Routes.ACCESS.USERS.LIST}>Truck List</Link>
                </MenuItem>
                <MenuItem>
                  <Link to={Routes.ACCESS.USERS.CREATE}>Create a Truck</Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </Typography>
          <Typography as="li" variant="small" className="p-1 font-normal">
            <Menu>
              <MenuHandler>
                <Typography className="cursor-pointer">Fuel</Typography>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <Link to={Routes.ACCESS.STATIONS.LIST}>Fuel List</Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </Typography>
        </>
      )}
      {role === "Chofer" && (
        <>
          <Typography as="li" variant="small" className="p-1 font-normal">
            <Menu>
              <MenuHandler>
                <Typography className="cursor-pointer">Routes</Typography>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  <Link to={Routes.ACCESS.STATIONS.LIST}>Route List</Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </Typography>
        </>
      )}
      {access_token && (
        <Typography as="li" variant="small" className="p-1 font-normal">
          {role}: {name}
        </Typography>
      )}
    </ul>
  );
  return (
    <Navbar
      variant="gradient"
      color="blue-gray"
      className="from-blue-gray-900 to-blue-gray-800  sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4"
    >
      <div className="flex items-center justify-between text-white ">
        <Typography className="mr-4 cursor-pointer py-1.5 font-medium">
          <Link to={Routes.HOME}>Fuel</Link>
        </Typography>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          {access_token && (
            <div className="flex items-center gap-x-1">
              <Button
                variant="gradient"
                size="sm"
                onClick={doLogout}
                className="hidden lg:inline-block"
              >
                <span>Logout</span>
              </Button>
            </div>
          )}
          {!access_token && (
            <div className="flex items-center gap-x-1">
              <Button
                variant="gradient"
                size="sm"
                onClick={doLogout}
                className="hidden lg:inline-block"
              >
                <span>Login</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default NavMenu;
