import {
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    styled,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/config";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import drawerWidth from "../data/drawerWidth";

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

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
    setOpen?: any;
}

const Header = ({ open, setOpen }: AppBarProps) => {
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
                            className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-200"
                            onClick={handleMenuOpen}
                        >
                            <div className="flex items-center justify-center w-10 h-10 mr-2 text-xl bg-gray-800 rounded-full">
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
                            <div className="flex items-center px-4 py-2 cursor-auto">
                                <div className="flex items-center justify-center w-10 h-10 mr-2 text-white bg-gray-800 rounded-full cursor-auto">
                                    {name[0]}
                                </div>
                                <div className="flex flex-col cursor-auto">
                                    <Typography variant="subtitle1" noWrap component="div" sx={{ color: "black" }}>
                                        {name}
                                    </Typography>
                                    <Typography variant="caption" noWrap component="div" sx={{ color: "gray" }}>
                                        {email}
                                    </Typography>
                                </div>
                            </div>

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
    )
}

export default Header