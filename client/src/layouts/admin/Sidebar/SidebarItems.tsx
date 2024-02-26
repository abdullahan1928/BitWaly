import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider, List } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { Fragment } from "react";
import SidebarItem from "./SidebarItem";

const SidebarItems = ({ open }: { open: boolean }) => {
    const { logout } = useAuth();

    const sidebarItems = [
        [
            {
                icon: <HomeIcon />,
                text: "Home",
                to: "/admin"
            },
        ],
        <Divider className="w-[85%] flex self-center" />,
        [
            {
                icon: <LogoutIcon />,
                text: "Log out",
                onClick: logout
            },
        ],
    ];

    return (
        <>
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
                                />
                            ))}
                        </List>
                    ) : (
                        group
                    )}
                </Fragment>
            ))}
        </>
    )
}

export default SidebarItems