import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton.tsx";
import UrlShortener from "@/services/shortenUrl.service";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChipsInput from "@/components/ChipsInput";


const NewLink = () => {
    const [domain, setDomain] = useState("default");
    const [longUrl, setLongUrl] = useState("");
    const [backHalf, setBackHalf] = useState("");
    const [title, setTitle] = useState("");
    const [duplicateError, setDuplicateError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleButtonClick = async () => {
        const formattedUrl = /^https?:\/\//i.test(longUrl)
            ? longUrl
            : `https://${longUrl}`;

        await UrlShortener(formattedUrl, backHalf, title)
            .then(() => {
                navigate('/dashboard/links');
            }).catch((error) => {
                if (error.response.status === 409) {
                    setDuplicateError(error.response.data);
                }
            });
    };

    return (
        <div className="flex flex-col gap-6 text-xl container mx-auto px-4 py-8 max-w-4xl">
            <h3 className="text-4xl font-medium">Create New Link</h3>

            <div className="flex flex-col gap-2 w-full">
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

            <div className="flex flex-col gap-2 w-full">
                <p className="flex flex-row justify-between items-end">
                    Title
                    <span className="text-gray-500 text-base">
                        (optional)
                    </span>
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

            <h3 className="text-2xl font-medium">
                Customize Link
            </h3>

            <div className="flex flex-row max-md:flex-wrap gap-4 w-full">
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

                <div className="flex flex-col gap-2 w-full">
                    <p className="flex flex-row justify-between items-end">
                        Custom back-half
                        <span className="text-gray-500 text-base">
                            (optional)
                        </span>
                    </p>
                    <TextField
                        id="outlined-basic"
                        placeholder="example: favorite link"
                        variant="outlined"
                        className="w-full"
                        value={backHalf}
                        onChange={(e) => setBackHalf(e.target.value)}
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

            <hr className="w-full border-gray-300" />

            <div className="flex flex-col gap-2 w-full">
                <p className="flex flex-row justify-between items-end">
                    Tags
                    <span className="text-gray-500 text-base">
                        (optional)
                    </span>
                </p>
                <ChipsInput />
            </div>

            <div onClick={handleButtonClick} className="self-start max-md:self-center">
                <PrimaryButton text="Create Link" disabled={!longUrl.trim()} />
            </div>

            {duplicateError && (
                <Alert severity="error" className="w-full" style={{ fontSize: '16px', padding: '16px' }}>
                    {duplicateError}
                </Alert>
            )}
        </div>
    )
}

export default NewLink