import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/PrimaryButton.tsx";
import { Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateUrl } from "@/services/updateUrl.service";
import { UrlRetrievalById } from "@/services/retrieveUrl.service";
import ChipsInput from "@/components/ChipsInput";
import CustomInput from "@/components/CustomInput";


const NewUrl = () => {
    const [longUrl, setLongUrl] = useState("");
    const [domain, setDomain] = useState("default");
    const [backHalf, setBackHalf] = useState("");
    const [title, setTitle] = useState("");
    const [backHalfError, setBackHalfError] = useState<string | null>(null);
    const [longUrlError, setLongUrlError] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        getData();
    }, []);

    const handleTagChange = (newTags: string[]) => {
        setTags(newTags);
    };

    const getData = async () => {
        const authToken = localStorage.getItem("token");

        UrlRetrievalById(authToken ?? '', id ?? '')
            .then((res) => {
                setLongUrl(res.url.originalUrl);
                setBackHalf(res.url.shortUrl);
                setTitle(res.url.meta.title);
                setTags(res.tags);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleButtonClick = async () => {
        setLoading(true);

        const origUrl = /^https?:\/\//i.test(longUrl)
            ? longUrl
            : `https://${longUrl}`;

        const data = { origUrl, title, shortUrl: backHalf, tags };

        const authToken = localStorage.getItem("token");

        if (authToken === null || id === undefined) { return }

        await UpdateUrl(authToken, id, data)
            .then(() => {
                navigate('/dashboard/links');
            }).catch((error) => {
                if (error.response.status === 409 && error.response.data === "Short URL already exists") {
                    setBackHalfError(error.response.data);
                    setLoading(false)

                } else {
                    setLongUrlError(error.response.data);
                    setLoading(false)
                }
            });
    };

    return (
        <div className="container flex flex-col max-w-4xl gap-6 px-4 py-8 mx-auto text-xl">
            <h3 className="text-4xl">Update Link</h3>

            <CustomInput
                label="New Destination"
                value={longUrl}
                onChange={setLongUrl}
                placeholder="https://example.com"
                sx={{
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: longUrlError ? "red" : "",
                    },
                }}
            />

            <CustomInput
                label="Title"
                value={title}
                onChange={setTitle}
                placeholder="My favorite link"
            />

            <hr className="w-full" />

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
                        <MenuItem disableGutters={true} value={"default"}>Walee.com</MenuItem>
                    </Select>
                </div>

                <CustomInput
                    label="Enter a back-half"
                    value={backHalf}
                    onChange={setBackHalf}
                    placeholder="example: favorite link"
                    sx={{
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: backHalfError ? "red" : "",
                        },
                    }}
                />
            </div>

            <div className="flex flex-col w-full gap-2">
                <p className="flex flex-row items-end justify-between">
                    Tags
                </p>

                <ChipsInput tags={tags} onTagChange={handleTagChange} />
            </div>

            <div onClick={handleButtonClick} className="self-start max-md:self-center">
                <PrimaryButton text={loading ? "Updating Link..." : "Update Link"} />
            </div>

            {backHalfError && (
                <Alert severity="error" className="w-full" style={{ fontSize: '16px', padding: '16px' }}>
                    {backHalfError}
                </Alert>
            )}

            {longUrlError && (
                <Alert severity="error" className="w-full" style={{ fontSize: '16px', padding: '16px' }}>
                    {longUrlError}
                </Alert>
            )}
        </div>
    )
}

export default NewUrl