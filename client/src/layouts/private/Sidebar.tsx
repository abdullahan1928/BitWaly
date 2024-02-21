import {
    Box,
    CSSObject,
    Divider,
    List,
    Theme,
    styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import drawerWidth from "./data/drawerWidth";
import SidebarItems from "./Sidebar/SidebarItems";

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
    // hidden when screen size is medium
    [theme.breakpoints.down("md")]: {
        display: "none",
    },
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
    const navigate = useNavigate();

    return (
        <>
            <Drawer variant="permanent" open={open}>

                <img
                    src={`${open ? "/logo1.png" : "/logo2.png"}`}
                    alt="logo"
                    className="w-[80%] flex self-center my-2 cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                />

                <List>
                    <Link to={"/dashboard/link/new"}>
                        {open ? (
                            <button className="bg-secondary-500 hover:bg-secondary-700 text-white font-bold py-2 px-4 rounded-lg mt-4 mx-4 w-[85%]">
                                Create New Link
                            </button>
                        ) : (
                            <p className="flex items-center justify-center px-4 py-2 mx-2 mt-4 font-bold text-white rounded-md cursor-pointer bg-secondary-500">
                                <AddIcon />
                            </p>
                        )}
                    </Link>
                </List>

                <Divider className="w-[85%] flex self-center" />

                <SidebarItems open={open} />

            </Drawer >

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </>
    )
}

export default Sidebar