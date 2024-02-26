import {
    Toolbar,
    Typography,
    styled,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/urls";
import drawerWidth from "./data/drawerWidth";
import ToggleSidebarButton from "./Header/ToggleSidebarButton";
import HeaderMenu from "./Header/HeaderMenu";

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
    [theme.breakpoints.down("md")]: {
        display: "none",
    },
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
    setOpen?: any;
}

const Header = ({ open, setOpen }: AppBarProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
        const authToken = localStorage.getItem("token");
        axios.get(`${API_URL}/auth/getUser`, {
            headers: {
                authToken: `${authToken}`,
            },
        }).then((res) => {
            if (res.data.name) {
                setName(res.data.name);
            } else {
                setName(res.data._id);
            }
            setEmail(res.data.email);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <AppBar position="fixed" open={open}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

                <div className="flex items-center gap-12 max-lg:hidden">
                    <ToggleSidebarButton
                        open={open}
                        toggleDrawer={toggleDrawer}
                    />
                </div>

                <Typography color="secondary" variant="h6" noWrap component="div">
                </Typography>

                <div className="flex items-center gap-12 max-lg:gap-6">

                    <HeaderMenu name={name} email={email} loading={loading} />
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Header;
