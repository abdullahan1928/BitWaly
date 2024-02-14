import { Alert, Switch, SwitchProps, Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material"
import CustomInput from "@/components/CustomInput";
import HelpIcon from '@mui/icons-material/Help';

interface UtmFieldsProps {
    showUtmFields: boolean;
    setShowUtmFields: (showUtmFields: boolean) => void;
    utmSource: string;
    setUtmSource: (utmSource: string) => void;
    utmMedium: string;
    setUtmMedium: (utmMedium: string) => void;
    utmCampaign: string;
    setUtmCampaign: (utmCampaign: string) => void;
    utmTerm: string;
    setUtmTerm: (utmTerm: string) => void;
    utmContent: string;
    setUtmContent: (utmContent: string) => void;
    utmError: string;
    setUtmError: (utmError: string) => void;
}

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? 'primary-200' : 'primary-500',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: 'primary',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

const UtmFields = ({
    showUtmFields,
    setShowUtmFields,
    utmSource,
    setUtmSource,
    utmMedium,
    setUtmMedium,
    utmCampaign,
    setUtmCampaign,
    utmTerm,
    setUtmTerm,
    utmContent,
    setUtmContent,
    utmError,
}: UtmFieldsProps) => {
    return (
        <div className="flex flex-col w-full gap-2">
            <div className="flex flex-row items-center gap-4 mb-4">
                <IOSSwitch
                    checked={showUtmFields}
                    onChange={() => setShowUtmFields(!showUtmFields)}
                />
                <h3 className="text-2xl font-medium">Add UTM Parameters</h3>
            </div>

            {showUtmFields && (
                <div className="flex flex-col w-full gap-4 p-8 bg-white rounded-md">

                    <div className="flex flex-row flex-wrap w-full gap-4 max-md:flex-wrap">
                        <CustomInput
                            label="Source"
                            value={utmSource}
                            onChange={setUtmSource}
                            placeholder="e.g. google, newsletter"
                            className="max-md:w-1/3"
                            labelClassName="text-base font-medium"
                        />

                        <CustomInput
                            label="Medium"
                            value={utmMedium}
                            onChange={setUtmMedium}
                            placeholder="e.g. cpc, social, email"
                            className="max-md:w-1/3"
                            labelClassName="text-base font-medium"
                        />

                        <CustomInput
                            label="Campaign"
                            value={utmCampaign}
                            onChange={setUtmCampaign}
                            placeholder="e.g. summer_sale"
                            className="max-md:w-1/3"
                            labelClassName="text-base font-medium"
                        />
                    </div>

                    <div className="flex flex-row w-full gap-4 max-md:flex-wrap">
                        <CustomInput
                            label="Term"
                            value={utmTerm}
                            onChange={setUtmTerm}
                            placeholder="e.g. running+shoes"
                            className="max-md:w-1/2"
                            labelClassName="text-base font-medium"
                            optional
                        />

                        <CustomInput
                            label="Content"
                            value={utmContent}
                            onChange={setUtmContent}
                            placeholder="e.g. logolink or textlink"
                            className="max-md:w-1/2"
                            labelClassName="text-base font-medium"
                            optional
                        />
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <h3 className="text-xl font-medium">UTM Tag Preview</h3>
                            <HtmlTooltip
                                title={
                                    <>
                                        This is how your UTM parameters will appear at the end of your destination URL
                                    </>
                                }
                            >
                                <HelpIcon color="primary" fontSize="small" />
                            </HtmlTooltip>
                        </div>

                        {showUtmFields && (
                            <>
                                {((utmSource || utmMedium || utmCampaign || utmTerm || utmContent) && (
                                    <p className="text-base font-normal">
                                        {`${utmSource && `?utm_source=${utmSource}`}
                                ${utmMedium && `&utm_medium=${utmMedium}`}
                                ${utmCampaign && `&utm_campaign=${utmCampaign}`}
                                ${utmTerm && `&utm_term=${utmTerm}`}
                                ${utmContent && `&utm_content=${utmContent}`}`}
                                    </p>
                                )) || (
                                        <p className="text-base font-normal">-</p>
                                    )}
                            </>
                        )}
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
    )
}

export default UtmFields