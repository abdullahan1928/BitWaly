import { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton.tsx";
import UrlShortener from "@/services/shortenUrl.service";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MainFields from "@/features/private/NewLink/MainFields";
import OptionalFields from "@/features/private/NewLink/OptionalFields";
import UtmFields from "@/features/private/NewLink/UtmFields";

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
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    if (
      showUtmFields &&
      !(utmSource && utmMedium && utmCampaign)
    ) {
      setUtmError(
        "Please fill in all the required fields for UTM parameters."
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
          setLoading(false)
        }
      });
  };

  return (
    <div className="container flex flex-col max-w-4xl gap-6 px-4 py-8 mx-auto text-xl">
      <h3 className="text-4xl font-medium">Create New Link</h3>

      <MainFields
        longUrl={longUrl}
        setLongUrl={setLongUrl}
        title={title}
        setTitle={setTitle}
      />

      <UtmFields
        showUtmFields={showUtmFields}
        setShowUtmFields={setShowUtmFields}
        utmSource={utmSource}
        setUtmSource={setUtmSource}
        utmMedium={utmMedium}
        setUtmMedium={setUtmMedium}
        utmCampaign={utmCampaign}
        setUtmCampaign={setUtmCampaign}
        utmTerm={utmTerm}
        setUtmTerm={setUtmTerm}
        utmContent={utmContent}
        setUtmContent={setUtmContent}
        utmError={utmError}
        setUtmError={setUtmError}
      />

      <hr className="w-full border-gray-300" />

      <OptionalFields
        tags={tags}
        handleTagChange={handleTagChange}
        domain={domain}
        setDomain={setDomain}
        backHalf={backHalf}
        setBackHalf={setBackHalf}
        duplicateError={duplicateError}
      />

      <div
        onClick={handleButtonClick}
        className="self-start max-md:self-center"
      >
        <PrimaryButton text={loading ? "Creating Link..." : "Create Link"} disabled={!longUrl.trim()} />
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
