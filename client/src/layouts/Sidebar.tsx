import {
  Box,
  CSSObject,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/hooks/useAuth";
import HomeIcon from "@mui/icons-material/Home";
import LinkIcon from "@mui/icons-material/Link";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/config";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  position: "relative",
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  position: "fixed",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    width: `calc(100% - ${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${theme.spacing(8)} + 1px)`,
    },
  }),
  boxShadow: "none",
  backgroundColor: "white",
  border: "1px solid #dbe0eb",
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface SidebarItemProps {
  open: boolean;
  icon: React.ReactNode;
  text: string;
  to?: string;
  onClick?: () => void;
}

const SidebarItem = ({ open, icon, text, to, onClick }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = to && location.pathname === to;

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <Link to={to || "#"} style={{ textDecoration: "none" }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            margin: 1,
            borderRadius: 2,
            ...(isActive && {
              color: "primary.main",
              backgroundColor: "primary.100",
              "& svg": {
                color: "primary.main",
              },
              borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
            }),
          }}
          onClick={onClick}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      logout();
    }

    axios.get(`${API_URL}/auth/getUser`, {
      headers: {
        authToken: `${token}`,
      },
    })
      .then((res) => {
        if (res.data.name) {
          setName(res.data.name);
        } else {
          setName(res.data._id);
        }
        setEmail(res.data.email);
      })
      .catch((err) => {
        console.log(err);
      });

    setOpen(true);
  }, []);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: 'Links', action: () => navigate('/dashboard/links') },
    { label: 'Analytics', action: () => navigate('/dashboard/analytics') },
    { label: 'Settings', action: () => navigate('/dashboard/settings') },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{
              position: "absolute",
              left: "-0.2%",
              top: `calc(100% - 1rem)`,
              backgroundColor: "white",
              color: "slateblue",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              border: ".1rem solid #dbe0eb",
              width: "2rem",
              height: "2rem",
              ":hover": {
                backgroundColor: "white",
              },
            }}
          >
            {(open && <ChevronLeftIcon />) || (!open && <ChevronRightIcon />)}
          </IconButton>
          <Typography color="secondary" variant="h6" noWrap component="div">

          </Typography>
          {name && (
            <div className="flex items-center">
              <div
                className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-200 rounded-xl"
                onClick={handleMenuOpen}
              >
                <div className="flex items-center justify-center w-10 h-10 mr-2 bg-gray-800 rounded-full">
                  {name[0]}
                </div>
                <Typography
                  variant="subtitle1"
                  noWrap
                  component="div"
                  sx={{
                    color: "black",
                  }}
                >
                  {name}
                </Typography>
                <ArrowDropDownIcon sx={{ color: "black" }} />
              </div>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiMenu-paper": {
                    width: "20rem",
                    border: ".1rem solid #dbe0eb",
                    marginTop: "0.5rem",
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                  }}
                >
                  <div className="flex items-center justify-center w-10 h-10 mr-2 text-white bg-gray-800 rounded-full">
                    {name[0]}
                  </div>
                  <div className="flex flex-col">
                    <Typography variant="subtitle1" noWrap component="div" sx={{ color: "black" }}>
                      {name}
                    </Typography>
                    <Typography variant="caption" noWrap component="div" sx={{ color: "gray" }}>
                      {email}
                    </Typography>
                  </div>
                </MenuItem>

                <Divider />

                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      handleMenuClose();
                      item.action();
                    }}
                    sx={{
                      padding: "1rem",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}

                <Divider />

                <MenuItem
                  onClick={() => {
                    logout()
                    handleMenuClose();
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  Logout
                </MenuItem>

              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <img
          src={`${open ? "/logo1.png" : "/logo2.png"}`}
          alt="logo"
          className="w-[80%] flex self-center my-2"
        />

        <List>
          <Link to={"/dashboard/link/new"}>
            {open ? (
              <button className="bg-secondary-500 hover:bg-secondary-700 text-white font-bold py-2 px-4 rounded-lg mt-4 mx-4 w-[85%]">
                Create New Link
              </button>
            ) : (
              <p className="flex items-center justify-center px-4 py-2 mx-2 mt-4 rounded-md bg-primary-500 hover:bg-primary-700">
                <AddIcon />
              </p>
            )}
          </Link>
        </List>

        <Divider className="w-[85%] flex self-center" />

        <List>
          <SidebarItem
            open={open}
            icon={<HomeIcon />}
            text="Home"
            to="/dashboard"
          />
          <SidebarItem
            open={open}
            icon={<LinkIcon className="transform rotate-45" />}
            text="Links"
            to="/dashboard/links"
          />
          <SidebarItem
            open={open}
            icon={<LeaderboardIcon />}
            text="Analytics"
            to="/dashboard/analytics"
          />
        </List>

        <Divider className="w-[85%] flex self-center" />

        <List>
          <SidebarItem
            open={open}
            icon={<SettingsIcon />}
            text="Settings"
            to="/dashboard/settings"
          />
          <SidebarItem
            open={open}
            icon={<LogoutIcon />}
            text="Log Out"
            onClick={logout}
          />
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>

    </Box>
  );
};

export default Sidebar;
