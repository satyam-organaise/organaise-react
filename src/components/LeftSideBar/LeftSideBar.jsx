import React, { useEffect } from 'react'
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
    Box, Toolbar, List, ListItem, ListItemButton, ListItemIcon, InputBase,
    ListItemText, Grid, CssBaseline, Typography, Divider, IconButton, Tooltip, Avatar, Menu, MenuItem
} from '@mui/material/';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from "@mui/material/Drawer"
import SearchIcon from '@mui/icons-material/Search';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom';




const drawerWidth = 220;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',

});

const closedMixin = (theme) => ({
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
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
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

const styleCss = {
    appBarCss: {
        backgroundColor: "transparent",
        boxShadow: "none",
    }
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 1),
    color: "#333333",
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 1),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        fontSize: "14px",
        color: "#333333",
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));


const LeftSideBar = (props) => {
    const theme = useTheme();
    const navegate = useNavigate();
    const [open, setOpen] = React.useState(true);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    useEffect(() => {
        if (props?.data?.pageName === "Folder") {
            setOpen(!open);
        }
    }, [props.data])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (data = "") => {
        if (data === "Logout") {
            localStorage.clear();
            window.location = "/login";
        }
        setAnchorElUser(null);
    };

    const changePage = (indexVal) => {
        let pagesArray = ['dashboard', 'message', 'folder', 'data', 'privacy-policy', 'settings'];
        if (indexVal === 0) {
            navegate(`/`);
        } else {
            if (indexVal === 2) {
                setOpen(!open);
            }
            navegate(`/${pagesArray[indexVal]}`);
        }

    }




    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar sx={styleCss.appBarCss} position="fixed" open={open}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    {!open &&
                        <IconButton
                            color="#333333"
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
                    }
                    <Typography width={"45%"} variant="h6" color="#333333" noWrap component="div">
                        {props.data.pageName}
                    </Typography>
                    <Box sx={{ flexGrow: 0, width: "60%" }} display="inline-flex"
                        justifyContent={props.data.pageName === "Data" ? 'space-between' : "end"}
                    >
                        {props.data.pageName === "Data" &&
                            <Box id="file_upload_icon">
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#03CF80",
                                        color: "#ffffff",
                                        textTransform: "none"
                                    }}
                                    onClick={() => props.setOpen(true)}
                                >
                                    Upload Data
                                </Button>
                            </Box>
                        }

                        <Box id="show_for_all_pages_menu_opt" display={"inline-flex"}>
                            <Box id="search_field_in_App_bar">
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon sx={{ fontSize: "18px" }} />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                    />
                                </Search>
                            </Box>
                            <Box mr={1} id="notification_icon">
                                <CircleNotificationsOutlinedIcon
                                    sx={{ width: "30px", height: "30px", fontSize: '30px', color: "#333", opacity: 0.5 }} />
                            </Box>
                            <Box id="profile_icon">
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" sx={{ width: "30px", height: "30px" }} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={() => handleCloseUserMenu()}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                open={open}

            >
                <DrawerHeader >
                    <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        sx={{ transform: "translateX(-18px)" }}
                    >
                        {open &&
                            <IconButton onClick={handleDrawerClose} sx={{ padding: "12px" }}>
                                {theme.direction === 'rtl' ?
                                    <ChevronRightIcon /> :
                                    // <ChevronLeftIcon />
                                    <MenuIcon />
                                }
                            </IconButton>
                        }

                        {open && <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", fontSize: "18px", lineHeight: 2.75 }}
                            color="primary">Organaise</Typography>
                        }
                    </Grid>
                </DrawerHeader>
                <Divider />
                <List sx={{
                    paddingLeft: open ? "25px" : "5px",
                    paddingRight: open ? "25px" : "5px"
                }}>
                    {/* ['Dashboard', 'Messaging', 'Folders', 'Data', 'Privacy Policy', 'Settings'] */}
                    {['Dashboard', 'Messaging', 'Folders', 'Data'].map(
                        (text, index) => (
                            <ListItem key={text} disablePadding px="auto" sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 40,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                        paddingTop: "0px",
                                        paddingBottom: "0px",
                                        border: open && index === props.data.index ? "1px solid #5454D3" : "none",
                                        borderRadius: open ? "25px" : "10px",
                                        marginTop: "15px",
                                        backgroundColor: (open && index === props.data.index) ? "#5454D4" : index === props.data.index ? "#5454D4" : "#fff",
                                        color: (open && index === props.data.index) ? "#ffffff" : index === props.data.index ? "#ffffff" : "#333333",
                                        opacity: open && index !== props.data.index ? 0.7 : 1,
                                        "&:hover": {
                                            backgroundColor: (open && index === props.data.index) ? "#5454D4" : index === props.data.index ? "#5454D3" : "#fff",

                                        },
                                        boxShadow: open && index === props.data.index ? "0px 0px 10px 10px rgba(0, 0, 0, 0.15)" : "none",
                                    }}
                                    onClick={() => changePage(index)}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 1 : 'auto',
                                            justifyContent: 'center',
                                            color: (open && index === props.data.index) ? "#ffffff" : index === props.data.index ? "#ffffff" : "#333333",

                                        }}
                                    >
                                        {index === 0 && <HomeOutlinedIcon sx={{ fontSize: "20px" }} />}
                                        {index === 1 && <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: "18px" }} />}
                                        {index === 2 && <FolderOutlinedIcon sx={{ fontSize: "18px" }} />}
                                        {index === 3 && <DescriptionOutlinedIcon sx={{ fontSize: "18px" }} />}
                                        {index === 4 && <HelpOutlineOutlinedIcon sx={{ fontSize: "18px" }} />}
                                        {index === 5 && <SettingsOutlinedIcon sx={{ fontSize: "18px" }} />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* <DrawerHeader /> */}
                <Box mt={5.5}>

                    {
                        props.children
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default LeftSideBar