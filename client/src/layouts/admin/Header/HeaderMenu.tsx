import { useAuth } from "@/hooks/useAuth";
import { Divider, Menu, MenuItem, Typography } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";

interface HeaderMenuProps {
    name: string;
    email: string;
    loading?: boolean;
}

const HeaderMenu = ({ name, email, loading }: HeaderMenuProps) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const { logout } = useAuth();

    const handleMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <div
                className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-200"
                onClick={handleMenuOpen}
            >
                <div className={`flex items-center justify-center w-10 h-10 mr-2 text-xl ${!loading && 'bg-gray-800'} 
                rounded-full`}>
                    {loading ?
                        <Skeleton variant="circular" width={40} height={40} /> :
                        <>
                            {name[0]}
                        </>
                    }
                </div>

                <Typography
                    variant="subtitle1"
                    noWrap
                    component="div"
                    sx={{
                        color: "black",
                    }}
                >
                    {loading ?
                        <Skeleton variant="text" width={100} height={50} /> :
                        <>
                            {name}
                        </>
                    }
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

                <Divider />

                <MenuItem
                    onClick={() => { logout() }}
                    sx={{
                        "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.1)",
                        },
                    }}
                >
                    Logout
                </MenuItem>

            </Menu>
        </>
    )
}

export default HeaderMenu