import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/PrimaryButton.tsx";
import { Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateUrl } from "@/services/updateUrl.service";
import { UrlRetrievalById } from "@/services/retrieveUrl.service";
import ChipsInput from "@/components/ChipsInput";
import { authToken } from "@/config/authToken";
import CustomInput from "@/components/CustomInput";


const NewUrl = () => {
    const [domain, setDomain] = useState("default");
    const [backHalf, setBackHalf] = useState("");
    const [title, setTitle] = useState("");
    const [duplicateError, setDuplicateError] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);

    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        getData();
    }, []);

    const handleTagChange = (newTags: string[]) => {
        setTags(newTags);
    };

    const getData = async () => {
        UrlRetrievalById(authToken ?? '', id ?? '')
            .then((res) => {
                setBackHalf(res.url.shortUrl);
                setTitle(res.url.meta.title);
                setTags(res.tags);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleButtonClick = async () => {
        const data = { title, shortUrl: backHalf, tags };

        if (authToken === null || id === undefined) { return }

        await UpdateUrl(authToken, id, data)
            .then(() => {
                navigate('/dashboard/links');
            }).catch((error) => {
                if (error.response.status === 409) {
                    setDuplicateError(error.response.data);
                }
            });
    };

    return (
        <div className="container flex flex-col max-w-4xl gap-6 px-4 py-8 mx-auto text-xl">
            <h3 className="text-4xl">Update Link</h3>

            <CustomInput
                label="Title"
                value={title}
                onChange={setTitle}
                placeholder="My favorite link"
                optional
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
                    optional
                    sx={{
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: duplicateError ? "red" : "",
                        },
                    }}
                />
            </div>

            <div className="flex flex-col w-full gap-2">
                <p className="flex flex-row items-end justify-between">
                    Tags
                    <span className="text-base text-gray-500">
                        (optional)
                    </span>
                </p>

                <ChipsInput tags={tags} onTagChange={handleTagChange} />
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