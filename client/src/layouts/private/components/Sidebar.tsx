import {
    Box,
    CSSObject,
    Divider,
    List,
    Theme,
    styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { Link, Outlet } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/hooks/useAuth";
import HomeIcon from "@mui/icons-material/Home";
import LinkIcon from "@mui/icons-material/Link";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AddIcon from "@mui/icons-material/Add";
import drawerWidth from "../data/drawerWidth";
import SidebarItem from "./SidebarItem";
import { Fragment } from "react";

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

const Drawer = styled(
    MuiDrawer, {
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

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    position: "relative",
}));

interface PrivateLayoutProps {
    open: boolean;
}

const Sidebar = ({ open }: PrivateLayoutProps) => {

    const { logout } = useAuth();

    const sidebarItems = [
        [
            {
                icon: <HomeIcon />,
                text: "Home",
                to: "/dashboard"
            },
            {
                icon: <LinkIcon className="transform rotate-45" />,
                text: "Links",
                to: "/dashboard/links"
            },
            {
                icon: <LeaderboardIcon />,
                text: "Analytics",
                to: "/dashboard/analytics"
            },
        ],
        <Divider className="w-[85%] flex self-center" />,
        [
            {
                icon: <SettingsIcon />,
                text: "Settings",
                to: "/dashboard/settings"
            },
            {
                icon: <LogoutIcon />,
                text: "Log out",
                onClick: logout
            },
        ],
    ];

    return (
        <>
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

                {sidebarItems.map((group, index) => (
                    <Fragment key={index}>
                        {Array.isArray(group) ? (
                            <List>
                                {group.map((item, itemIndex) => (
                                    <SidebarItem
                                        key={itemIndex}
                                        open={open}
                                        icon={item.icon}
                                        text={item.text}
                                        to={item.to}
                                        onClick={item.onClick}
                                    />
                                ))}
                            </List>
                        ) : (
                            group
                        )}
                    </Fragment>
                ))}

            </Drawer >

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </>
    )
}

export default Sidebar