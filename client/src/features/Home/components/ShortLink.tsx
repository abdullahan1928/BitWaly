import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton.tsx";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { REDIRECT_URL } from '@/config/config.ts';
import CopyToClipboardButton from "@/components/Clipboard.tsx";
import UrlShortener from "@/services/shortenUrl.ts";

const ShortLink = () => {
  const [domain, setDomain] = useState("default");
  const [longUrl, setLongUrl] = useState("");
  const [backHalf, setBackHalf] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [timeTaken, setTimeTaken] = useState<number | null>(null);

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
      const startTime = performance.now();

      // Check if the URL starts with "http://" or "https://"
      const formattedUrl = /^https?:\/\//i.test(longUrl) ? longUrl : `https://${longUrl}`;

      await UrlShortener(formattedUrl).then((shortUrl) => {
        const endTime = performance.now();
        const timeTaken = (endTime - startTime) / 1000; // Convert to seconds
        setTimeTaken(timeTaken);
        setShortLink(`${REDIRECT_URL}/${shortUrl}`);
      });
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
        <PrimaryButton text="Get your link" />
      </div>
      {!shortLink && (
        <p className="text-xl font-bold text-green-600">
          Generating link...
        </p>
      )}
      {shortLink && (
        <div className="w-full text-2xl font-bold py-4 flex gap-2">
          <p className="p-4">
            Generated Short Link:
          </p>
          <div className="bg-[#ecfdff] text-[#007c8c] text-xl rounded-md p-4 gap-4 flex justify-evenly">
            <a href={shortLink} target="_blank" rel="noopener noreferrer" className="text-blue">
              {shortLink}
            </a>
            <CopyToClipboardButton text={shortLink} />
          </div>
        </div>
      )}
      {timeTaken !== null && (
        <p className="text-xl font-bold text-green-600">
          Link generated in {timeTaken} seconds
        </p>
      )}
      <p className="text-2xl font-bold flex self-center">No credit card required.</p>
    </div>
  );
};

export default ShortLink;
