import './services-preview.scss'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as React from 'react';
import LinkIcon from '@mui/icons-material/Link';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className='tab-content'
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const tabIndicatorProps = {
    background: 'transparent',
    boxShadow: 'none',
    borderColor: '#e8e9eb',
    borderTop: '3px transparent solid',
    borderLeft: '3px transparent solid',
    borderRight: '3px transparent solid',
    borderRadius: '12px',
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
    zIndex: 2,
}

const ServicesPreview = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    className='tabs'
                    TabIndicatorProps={{
                        sx: tabIndicatorProps
                    }}>
                    <Tab className='tab' icon={<LinkIcon />} label="Short Link" {...a11yProps(0)} />
                    <Tab className='tab' icon={<QrCodeIcon />} label="QR Code" {...a11yProps(1)} />
                    <Tab className='tab' icon={<DatasetLinkedIcon />} label="Link-in-Bio" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <h3>Shorten a long link</h3>
                <p>Paste a long URL</p>
                <input type="text" placeholder="https://long-link.com/shorten-it" />
                <div>
                    <div>
                        <p>Domain</p>
                        <select>
                            <option value="default">default</option>
                            <option value="custom">custom</option>
                        </select>
                    </div>
                    <div>
                        <p>Enter a back-half (optional)</p>
                        <input type="text" placeholder="example: favorite link" />
                    </div>
                </div>
                <p>End your link with words that will make it unique</p>
                <button>Sign Up and get your link</button>
                <p>No credit card required. Your free plan includes:</p>
                <ul>
                    <li><CheckCircleOutlineIcon />
                        <p>Short links</p>
                    </li>
                    <li><CheckCircleOutlineIcon />
                        <p>QR Codes</p>
                    </li>
                    <li><CheckCircleOutlineIcon />
                        <p>Link-in-bio page</p>
                    </li>
                </ul>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <h3>Create a QR Code</h3>
                <p>Enter your QR Code destination</p>
                <input type="text" placeholder="https://long-link.com/qr-code-it" />
                <button>Sign Up and get your QR Code</button>
                <p>No credit card required. Your free plan includes:</p>
                <ul>
                    <li><CheckCircleOutlineIcon />
                        <p>Short links</p>
                    </li>
                    <li><CheckCircleOutlineIcon />
                        <p>QR Codes</p>
                    </li>
                    <li><CheckCircleOutlineIcon />
                        <p>Link-in-bio page</p>
                    </li>
                </ul>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <h3>Build a Link-in-bio page and showcase your links</h3>
                <p>Claim your Link-in-bio URL</p>
                <select>
                    <option value="default">default</option>
                    <option value="custom">custom</option>
                </select>
                <input type="text" placeholder="example: very important links" />
                <button>Sign Up and create your page</button>
                <p>No credit card required. Your free plan includes:</p>
                <ul>
                    <li><CheckCircleOutlineIcon />
                        <p>Short links</p>
                    </li>
                    <li><CheckCircleOutlineIcon />
                        <p>QR Codes</p>
                    </li>
                    <li><CheckCircleOutlineIcon />
                        <p>Link-in-bio page</p>
                    </li>
                </ul>
            </CustomTabPanel>
        </Box >
    )
}

export default ServicesPreview