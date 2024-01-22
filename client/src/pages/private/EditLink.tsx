import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/PrimaryButton.tsx";
import { Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateUrl } from "@/services/updateUrl.service";
import { UrlRetrievalById } from "@/services/retrieveUrl.service";


const NewUrl = () => {
    const [domain, setDomain] = useState("default");
    const [backHalf, setBackHalf] = useState("");
    const [title, setTitle] = useState("");
    const [duplicateError, setDuplicateError] = useState<string | null>(null);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        UrlRetrievalById(token ?? '', id ?? '')
            .then((res) => {
                setBackHalf(res.shortUrl);
                setTitle(res.meta.title);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleButtonClick = async () => {
        const data = { title, shortUrl: backHalf };

        if (token === null || id === undefined) { return }

        await UpdateUrl(token, id, data)
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
            <h3 className="text-4xl">Update Link</h3>

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

            <hr className="w-full" />

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
                        Enter a back-half
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

            <div onClick={handleButtonClick} className="self-start max-md:self-center">
                <PrimaryButton text="Update Link" />
            </div>

            {duplicateError && (
                <Alert severity="error" className="w-full" style={{ fontSize: '16px', padding: '16px' }}>
                    {duplicateError}
                </Alert>
            )}
        </div>
    )
}

export default NewUrl