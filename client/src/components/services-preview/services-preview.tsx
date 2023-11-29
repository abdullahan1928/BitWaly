import "./services-preview.scss";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import * as React from "react";
// import LinkIcon from "@mui/icons-material/Link";
// import QrCodeIcon from "@mui/icons-material/QrCode";
// import DatasetLinkedIcon from "@mui/icons-material/DatasetLinked";
import ShortLink from "./ShortLink";
// import QRCode from "./QRCode";
// import LinkInBio from "./LinkInBio";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className="tab-content"
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const tabIndicatorProps = {
  background: "transparent",
  boxShadow: "none",
  borderColor: "#e8e9eb",
  borderTop: "3px transparent solid",
  borderLeft: "3px transparent solid",
  borderRight: "3px transparent solid",
  borderRadius: "12px",
  borderBottomLeftRadius: "0",
  borderBottomRightRadius: "0",
  zIndex: 2,
};

const ServicesPreview = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          className="tabs"
          TabIndicatorProps={{
            sx: tabIndicatorProps,
          }}
        >
          <Tab
            className="tab"
            icon={<LinkIcon />}
            label="Short Link"
            {...a11yProps(0)}
          />
          <Tab
            className="tab"
            icon={<QrCodeIcon />}
            label="QR Code"
            {...a11yProps(1)}
          />
          <Tab
            className="tab"
            icon={<DatasetLinkedIcon />}
            label="Link-in-Bio"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box> */}
      <CustomTabPanel value={value} index={0}>
        <ShortLink />
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={1}>
        <QRCode />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <LinkInBio />
      </CustomTabPanel> */}
    </Box>
  );
};

export default ServicesPreview;
