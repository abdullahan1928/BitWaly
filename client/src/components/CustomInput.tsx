import { TextField } from "@mui/material";
import { twMerge } from "tailwind-merge";

interface CustomInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    optional?: boolean;
    className?: string;
    labelClassName?: string;
    sx?: any;
}

const CustomInput = ({
    label,
    value,
    onChange,
    placeholder,
    optional,
    className,
    labelClassName,
    sx
}: CustomInputProps) => {
    return (
        <div className={twMerge(
            "flex flex-col w-full gap-2",
            className
        )}>
            <p className={twMerge(
                "flex flex-row items-end justify-between",
                labelClassName
            )}>
                {label}

                {optional &&
                    <span className="text-base text-gray-500">(optional)</span>
                }
            </p>
            <TextField
                id="outlined-basic"
                placeholder={placeholder || ""}
                variant="outlined"
                className="w-full"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                sx={sx}
            />
        </div>
    )
}

export default CustomInput