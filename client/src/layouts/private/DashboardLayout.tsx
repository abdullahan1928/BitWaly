import {
  Box,
} from "@mui/material";
import { useState } from "react";
import Appbar from "./components/Appbar";
import Sidebar from "./components/Sidebar";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>

      <Appbar open={open} setOpen={setOpen} />

      <Sidebar open={open} />

    </Box>
  );
};

export default DashboardLayout;
