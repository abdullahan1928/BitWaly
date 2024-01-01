import Box from "@mui/material/Box";
import ShortLink from "@/features/Home/components/ShortLink";
import { Typography } from "@mui/material";

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
      <div className="bg-white mb-12 w-[1200px] border-3 border-[#e8e9eb] rounded-2xl p-6">
        <Typography component={'span'}>
          <ShortLink />
        </Typography>
      </div>
    </Box >
  );
};

export default ServicesPreview;
