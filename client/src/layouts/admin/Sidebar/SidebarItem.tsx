import { Link, useLocation } from 'react-router-dom';
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

interface SidebarItemProps {
    open: boolean;
    icon: React.ReactNode;
    text: string;
    to?: string;
    onClick?: () => void;
}

const SidebarItem = ({ open, icon, text, to, onClick }: SidebarItemProps) => {
    const location = useLocation();

    const isActive =
        to && to !== '/dashboard'
            ? location.pathname.startsWith(to)
            : location.pathname === to


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


export default SidebarItem