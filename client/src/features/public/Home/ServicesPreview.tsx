import Box from "@mui/material/Box";
import ShortLink from "@/features/public/Home/components/ShortLink";
import { Typography } from "@mui/material";

const ServicesPreview = () => {

  return (
    <Box
      className="flex flex-col items-center justify-center"
    >
      <div className="bg-white mb-12 w-[1200px] border-3 border-[#e8e9eb] rounded-2xl p-6
      max-md:w-[90%] max-md:p-4 max-md:rounded-xl max-md:border-2 max-md:border-[#e8e9eb] max-md:shadow-md max-md:mt-8 max-md:mb-8
      max-sm:w-[90%] max-sm:p-4 max-sm:rounded-xl max-sm:border-2 max-sm:border-[#e8e9eb] max-sm:shadow-md max-sm:mt-8 max-sm:mb-8"
      >
        <Typography component={'span'} >
          <ShortLink />
        </Typography >
      </div >
    </Box>
  );
};

export default ServicesPreview;
