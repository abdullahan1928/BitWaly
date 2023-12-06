import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import * as React from "react";
import ShortLink from "./ShortLink";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  // value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className="bg-white mb-12 w-[1200px] border-3 border-[#e8e9eb] rounded-2xl"
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Typography component={'span'}>{children}</Typography>
      </Box>
    </div>
  );
}

const ServicesPreview = () => {

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CustomTabPanel index={0}>
        <ShortLink />
      </CustomTabPanel>
    </Box>
  );
};

export default ServicesPreview;
