import {
    Box,
    CSSObject,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Theme,
    styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { Link, Outlet, useLocation } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/hooks/useAuth";
import HomeIcon from "@mui/icons-material/Home";
import LinkIcon from "@mui/icons-material/Link";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AddIcon from "@mui/icons-material/Add";

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

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    position: "relative",
}));

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

interface SidebarItemProps {
    open: boolean;
    icon: React.ReactNode;
    text: string;
    to?: string;
    onClick?: () => void;
}

interface PrivateLayoutProps {
    open: boolean;
}

const Sidebar = ({ open }: PrivateLayoutProps) => {

    const { logout } = useAuth();

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
        </>
    )
}

export default Sidebar