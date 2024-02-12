import CustomInput from '@/components/CustomInput';
import { MenuItem, Select } from '@mui/material'

interface DomainFieldsProps {
    domain: string;
    setDomain: (domain: string) => void;
    backHalf: string;
    setBackHalf: (backHalf: string) => void;
    duplicateError: string | null;
}

const DomainFields = ({
    domain,
    setDomain,
    backHalf,
    setBackHalf,
    duplicateError
}: DomainFieldsProps) => {
    return (
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

            {/* <div className="flex flex-col w-full gap-2">
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
            </div> */}

            <CustomInput
                label="Custom back-half"
                value={backHalf}
                onChange={setBackHalf}
                placeholder="example: favorite link"
                optional
                className="max-md:w-full"
                sx={{
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: duplicateError ? "red" : "",
                    },
                }}
            />
        </div>
    )
}

export default DomainFields