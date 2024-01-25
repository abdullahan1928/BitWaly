import { Tab } from '@mui/material';

const CustomTab = (props: any) => {
    return (
        <Tab
            sx={{
                textTransform: "none",
                fontSize: "1em",
                minHeight: "unset",
                height: "2.2rem",
                "&.Mui-selected": {
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "2rem",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                },
            }}
            disableRipple
            {...props}
        />
    );
}

export default CustomTab