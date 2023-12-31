import Box from "@mui/material/Box";
import ShortLink from "@/features/Home/components/ShortLink";




const ServicesPreview = () => {

  return (
    <Box
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: { xs: 1, sm: 2, md: 3 },
      maxWidth: { xs: "80%", sm: "90%", md: "90%", lg: "80vw" }, 
      margin: "0 auto 3rem auto",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
      backgroundColor: "white", 
      borderRadius: "16px",
    }}
  >
        <ShortLink />
    </Box>
  );
};

export default ServicesPreview;
