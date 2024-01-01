import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton.tsx";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { REDIRECT_URL } from '@/config/config.ts';
import CopyToClipboardButton from "@/components/Clipboard.tsx";
import UrlShortener from "@/services/shortenUrl.ts";
import { useAuth } from "@/context/auth.context";
import { Alert } from "@mui/material";

const ShortLink = () => {
  const [domain, setDomain] = useState("default");
  const [longUrl, setLongUrl] = useState("");
  const [backHalf, setBackHalf] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverTime, setServerTime] = useState<number | null>(null);
  const [collisions, setCollisions] = useState<number | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  const handleDomainChange = (newValue: string) => {
    setDomain(newValue);
  };

  const handleLongUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLongUrl(event.target.value);
  };

  const handleBackHalfChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBackHalf(event.target.value);
  };

  const handleButtonClick = async () => {
    try {
      setIsLoading(true);
      setTimeTaken(null);
      setServerTime(null);
      setCollisions(null);
      setDuplicateError(null);

      const startTime = Date.now();

      const formattedUrl = /^https?:\/\//i.test(longUrl)
        ? longUrl
        : `https://${longUrl}`;

      await UrlShortener(formattedUrl, backHalf)
        .then(({ shortUrl, totalTime, collisions }) => {
          const endTime = Date.now();
          const timeTaken = (endTime - startTime) / 1000;
          setTimeTaken(timeTaken);
          setShortLink(`${REDIRECT_URL}/${shortUrl}`);
          setServerTime(totalTime);
          setCollisions(collisions);
          setIsLoading(false);
        });
    } catch (error: any) {
      console.error("Error sending request to the backend:", error);
      setIsLoading(false);

      if (error.response.status === 409) {
        setDuplicateError(error.response.data);
        console.log(duplicateError);
      }
    }
  };


  return (
    <div className="flex flex-col items-start gap-4 text-left text-lg font-bold">
      <h3 className="text-4xl text-primary">Shorten a long link</h3>
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
            sx={
              duplicateError ?
                {
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "red",
                  },
                }
                : {}
            }
          />
        </div>
      </div>
      <div className="flex flex-row items-center w-full bg-secondary-200 text-secondary text-xl p-3 rounded-md pl-5 gap-2">
        <AutoAwesomeIcon />
        <p>End your link with words that will make it unique</p>
      </div>
      <div onClick={handleButtonClick}>
        {isAuthenticated ? (
          <PrimaryButton text="Get your link" disabled={!longUrl.trim()} />
        ) : (
          <a href="/signup">
            <PrimaryButton text="Sign Up and Get your link" />
          </a>
        )}
      </div>
      {isLoading && isAuthenticated && (
        <p className="text-xl font-bold text-green-600">
          Generating link...
        </p>
      )}
      {duplicateError && (
        <Alert severity="error" className="w-full" style={{ fontSize: '16px', padding: '16px' }}>
          {duplicateError}
        </Alert>
      )}
      {shortLink && !isLoading && isAuthenticated && !duplicateError && (
        <div className="w-full text-2xl font-bold py-4 flex gap-2">
          <p className="py-4 pr-4">
            Generated Short Link:
          </p>
          <div className="bg-secondary-200 text-secondary text-xl rounded-md p-4 gap-4 flex justify-evenly">
            <a href={shortLink} target="_blank" rel="noopener noreferrer" className="text-secondary">
              {shortLink}
            </a>
            <CopyToClipboardButton text={shortLink} />
          </div>
        </div>
      )}
      {collisions !== null && isAuthenticated && (
        <p className="text-xl font-bold text-green-600">
          Number of collisions: {collisions}
        </p>
      )}
      {serverTime !== null && isAuthenticated && (
        <p className="text-xl font-bold text-green-600">
          Server time: {serverTime} s
        </p>
      )}
      {timeTaken !== null && isAuthenticated && (
        <p className="text-xl font-bold text-green-600">
          Client time: {timeTaken} s
        </p>
      )}
      <p className="text-2xl font-bold flex self-center">No credit card required.</p>
    </div>
  );
};

export default ShortLink;
