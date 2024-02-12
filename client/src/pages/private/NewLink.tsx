import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton.tsx";
import UrlShortener from "@/services/shortenUrl.service";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChipsInput from "@/components/ChipsInput";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface ShortenUrlRequest {
  origUrl: string;
  customUrl: string;
  title: string;
  tags: string[];
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
}

const NewLink = () => {
  const [domain, setDomain] = useState("default");
  const [longUrl, setLongUrl] = useState("");
  const [backHalf, setBackHalf] = useState("");
  const [title, setTitle] = useState("");
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const [showUtmFields, setShowUtmFields] = useState(false);
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [utmError, setUtmError] = useState("");

  const navigate = useNavigate();

  const handleTagChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const handleButtonClick = async () => {
    if (
      showUtmFields &&
      !(utmSource && utmMedium && utmCampaign && utmTerm && utmContent)
    ) {
      setUtmError(
        "Either UTM fields should be empty or all UTM fields are required when one is filled."
      );
      return;
    }
    const origUrl = /^https?:\/\//i.test(longUrl)
      ? longUrl
      : `https://${longUrl}`;

    const data: ShortenUrlRequest = {
      origUrl,
      customUrl: backHalf,
      title,
      tags,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
    };

    await UrlShortener(data)
      .then(() => {
        navigate("/dashboard/links");
      })
      .catch((error) => {
        if (error.response.status === 409) {
          setDuplicateError(error.response.data);
        }
      });
  };

  return (
    <div className="container flex flex-col max-w-4xl gap-6 px-4 py-8 mx-auto text-xl">
      <h3 className="text-4xl font-medium">Create New Link</h3>

      <div className="flex flex-col w-full gap-2">
        <p>Destination</p>
        <TextField
          id="outlined-basic"
          placeholder="https://long-link.com/shorten-it"
          variant="outlined"
          className="w-full"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full gap-2">
        <p className="flex flex-row items-end justify-between">
          Title
          <span className="text-base text-gray-500">(optional)</span>
        </p>
        <TextField
          id="outlined-basic"
          placeholder="My favorite link"
          variant="outlined"
          className="w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <hr className="w-full border-gray-300" />

      <h3 className="text-2xl font-medium">Customize Link</h3>

      <div className="flex flex-row w-full gap-4 max-md:flex-wrap">
        <div className="flex flex-col gap-2 max-md:w-full">
          <p>Domain</p>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled
          >
            <MenuItem disableGutters={true} value={"default"}>
              Walee.com
            </MenuItem>
          </Select>
        </div>

        <div className="flex flex-col w-full gap-2">
          <p className="flex flex-row items-end justify-between">
            Custom back-half
            <span className="text-base text-gray-500">(optional)</span>
          </p>
          <TextField
            id="outlined-basic"
            placeholder="example: favorite link"
            variant="outlined"
            className="w-full"
            value={backHalf}
            onChange={(e) => setBackHalf(e.target.value)}
            sx={
              duplicateError
                ? {
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "red",
                      },
                  }
                : {}
            }
          />
        </div>
      </div>

      <hr className="w-full border-gray-300" />

      <div className="flex flex-col w-full gap-2">
        <p className="flex flex-row items-end justify-between">
          Tags
          <span className="text-base text-gray-500">(optional)</span>
        </p>
        <ChipsInput tags={tags} onTagChange={handleTagChange} />
      </div>

      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-row w-full max-md:flex-wrap">
          <FormControlLabel
            control={
              <Checkbox
                checked={showUtmFields}
                onChange={() => setShowUtmFields(!showUtmFields)}
              />
            }
            label=""
          />
          <h3 className="text-2xl font-medium">UTM Parameters (optional)</h3>
        </div>

        {showUtmFields && (
          <div>
            <div className="flex flex-row w-full gap-4 max-md:flex-wrap">
              <div className="flex flex-col gap-2 w-full max-md:w-1/3">
                <p>UTM Source</p>
                <TextField
                  id="outlined-basic"
                  placeholder="Enter UTM Source"
                  variant="outlined"
                  className="w-full"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2 w-full max-md:w-1/3">
                <p>UTM Medium</p>
                <TextField
                  id="outlined-basic"
                  placeholder="Enter UTM Medium"
                  variant="outlined"
                  className="w-full"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2 w-full max-md:w-1/3">
                <p>UTM Campaign</p>
                <TextField
                  id="outlined-basic"
                  placeholder="Enter UTM Campaign"
                  variant="outlined"
                  className="w-full"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-row w-full gap-4 max-md:flex-wrap">
              <div className="flex flex-col gap-2 w-full max-md:w-1/2">
                <p>UTM Term</p>
                <TextField
                  id="outlined-basic"
                  placeholder="Enter UTM Term"
                  variant="outlined"
                  className="w-full"
                  value={utmTerm}
                  onChange={(e) => setUtmTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2 w-full max-md:w-1/2">
                <p>UTM Content</p>
                <TextField
                  id="outlined-basic"
                  placeholder="Enter UTM Content"
                  variant="outlined"
                  className="w-full"
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
        {utmError && (
          <Alert
            severity="error"
            className="w-full"
            style={{ fontSize: "16px", padding: "16px" }}
          >
            {utmError}
          </Alert>
        )}
      </div>

      <div
        onClick={handleButtonClick}
        className="self-start max-md:self-center"
      >
        <PrimaryButton text="Create Link" disabled={!longUrl.trim()} />
      </div>

      {duplicateError && (
        <Alert
          severity="error"
          className="w-full"
          style={{ fontSize: "16px", padding: "16px" }}
        >
          {duplicateError}
        </Alert>
      )}
    </div>
  );
};

export default NewLink;
