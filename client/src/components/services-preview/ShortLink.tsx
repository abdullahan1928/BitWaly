import TextField from "@mui/material/TextField"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { useState } from "react"
import PrimaryButton from "../primaryButton/primaryButton"
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ShortLink = () => {
  const [domain, setDomain] = useState("default");
  const [longUrl, setLongUrl] = useState("");
  const [backHalf, setBackHalf] = useState("");

  const handleDomainChange = (newValue: string) => {
    setDomain(newValue);
  };

  const handleLongUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLongUrl(event.target.value);
  };

  const handleBackHalfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackHalf(event.target.value);
  };

  const handleButtonClick = async () => {
    try {
      console.log(longUrl)
      const response = await fetch('http://localhost:3000/url/urlshortner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: longUrl,
          // domain: domain,
          // backHalf: backHalf,
        }),
      });

      // Handle the response from the server, e.g., display a success message
      const data = await response.json();
      console.log(data); // You can update this part based on your backend response handling
    } catch (error) {
      console.error('Error sending request to the backend:', error);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 text-left text-lg font-bold">
      <h3 className="text-4xl text-gray-500">Shorten a long link</h3>
      <p>Paste a long URL</p>
      <TextField
        id="outlined-basic"
        placeholder="https://long-link.com/shorten-it"
        variant="outlined"
        className="w-full"
        value={longUrl}
        onChange={handleLongUrlChange}
      />
      <div className="flex flex-row gap-4 w-full text-lg font-bold">
        <div className="flex flex-col gap-4">
          <p>Domain</p>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={domain}
            onChange={void handleDomainChange}
            disabled
          >
            <MenuItem disableGutters={true} value={"default"}>Walee.com</MenuItem>
          </Select>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <p>Enter a back-half (optional)</p>
          <TextField
            id="outlined-basic"
            placeholder="example: favorite link"
            variant="outlined"
            className="w-full"
            value={backHalf}
            onChange={handleBackHalfChange}
          />
        </div>
      </div>
      <div className="flex flex-row items-center w-full bg-[#ecfdff] text-[#007c8c] text-xl p-3 rounded-md pl-5 gap-2">
        <AutoAwesomeIcon />
        <p>End your link with words that will make it unique</p>
      </div>
      <div onClick={handleButtonClick}>
        <PrimaryButton text="Sign Up and get your link" />
      </div>
      <p className="text-2xl font-bold flex self-center">No credit card required.</p>
      {/* <ul>
        <li>
          <CheckCircleOutlineIcon />
          <p>Short links</p>
        </li>
        <li>
          <CheckCircleOutlineIcon />
          <p>QR Codes</p>
        </li>
        <li>
          <CheckCircleOutlineIcon />
          <p>Link-in-bio page</p>
        </li>
      </ul> */}
    </div>
  )
}

export default ShortLink
