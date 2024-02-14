import { IconButton } from '@mui/material'
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ToggleSidebarButtonProps {
    open?: boolean;
    toggleDrawer: () => void;
}

const ToggleSidebarButton = ({ open, toggleDrawer }: ToggleSidebarButtonProps) => {
    return (
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
    )
}

export default ToggleSidebarButton