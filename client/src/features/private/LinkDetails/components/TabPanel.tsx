import { Box } from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
    return (
        <Box hidden={value !== index} mt={2}>
            {children}
        </Box>
    )
}

export default TabPanel