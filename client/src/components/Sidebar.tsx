import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CSSObject, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Theme, Toolbar, Typography, styled, useTheme } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Link, Outlet, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/hooks/useAuth';
import HomeIcon from '@mui/icons-material/Home';
import LinkIcon from '@mui/icons-material/Link';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AddIcon from '@mui/icons-material/Add';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    ...(!open && {
        width: `calc(100% - ${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${theme.spacing(8)} + 1px)`,
        },
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

interface SidebarItemProps {
    open: boolean;
    icon: React.ReactNode;
    text: string;
    to?: string;
    onClick?: () => void;
}

const SidebarItem = ({ open, icon, text, to, onClick }: SidebarItemProps) => {
    const location = useLocation();
    const isActive = to && location.pathname === to;

    return (
        <ListItem disablePadding sx={{ display: 'block' }}>
            <Link to={to || '#'} style={{ textDecoration: 'none' }}>
                <ListItemButton
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        margin: 1,
                        ...(isActive && {
                            color: 'primary.main',
                            backgroundColor: (theme) => theme.palette.action.selected,
                            '& svg': {
                                color: 'primary.main',
                            },
                            borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
                        }),
                    }}
                    onClick={onClick}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                        }}
                    >
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </Link>
        </ListItem>
    );
};

export default function MiniDrawer() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const { logout } = useAuth();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Welcome to the Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    {
                        open ?
                            <>
                                <img src="logo2.png" alt="logo" className='w-16' />
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                                </IconButton>
                            </>
                            : <img src="logo2.png" alt="logo" className='w-16' />
                    }
                </DrawerHeader>

                <List>
                    {
                        open ?
                            <button
                                className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg mt-4 mx-4 w-[85%]"
                            >
                                Create New Link
                            </button>
                            :
                            <Link to={'/dashboard/link/new'} className='flex items-center justify-center mt-4 mx-4 bg-primary-500 hover:bg-primary-700 py-2 px-5 rounded-md'>
                                <AddIcon />
                            </Link>
                    }
                </List>

                <Divider className='w-[85%] flex self-center' />

                <List>
                    <SidebarItem open={open} icon={<HomeIcon />} text="Home" to="/dashboard" />
                    <SidebarItem open={open} icon={<LinkIcon />} text="Links" to="/dashboard/links" />
                    <SidebarItem open={open} icon={<LeaderboardIcon />} text="Analytics" to="/dashboard/analytics" />
                </List>
                <Divider />
                <List>
                    <SidebarItem open={open} icon={<SettingsIcon />} text="Settings" to="/dashboard/settings" />
                    <SidebarItem open={open} icon={<LogoutIcon />} text="Log Out" onClick={logout} />
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
}