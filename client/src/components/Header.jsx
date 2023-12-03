import * as React from "react";
import {
	AppBar,
	Container,
	Toolbar,
	Typography,
	IconButton,
	Box,
	Menu,
	MenuItem,
	Button,
	Tooltip,
	Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Dashboard", "Logout"];

const Header = () => {
	const [anchorElNav, setAnchorElNav] = React.useState(null | HTMLElement);
	const [anchorElUser, setAnchorElUser] = React.useState(null | HTMLElement);

	// might need to change this latter
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);

	const handleCloseNavMenu = (page) => {
		if (page) {
			console.log(page);
		}
		setAnchorElNav(null);
	};
	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseUserMenu = (setting) => {
		if (setting) {
			console.log(setting);
			if (setting.localeCompare("Logout") === 0) {
				setIsAuthenticated(false);
			}
		}
		setAnchorElUser(null);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	// might need to change this latter
	const handleLogin = () => {
		setIsAuthenticated(true);
		console.log("Login");
	};
	const handleSignup = () => {
		console.log("Signup");
	};

	return (
		<AppBar position="fixed">
			<Container maxWidth="lg">
				<Toolbar disableGutters>
					<Typography
						variant="h6"
						noWrap
						component="a"
						href="/"
						sx={{
							mr: 2,
							display: { xs: "none", md: "flex" },
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						TRANSCRIBLY
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={() => handleCloseNavMenu()}
							sx={{
								display: { xs: "block", md: "none" },
							}}
						>
							{pages.map((page) => (
								<MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
									<Typography textAlign="center">{page}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>

					<Typography
						variant="h5"
						noWrap
						component="a"
						href="#/"
						sx={{
							mr: 2,
							display: { xs: "flex", md: "none" },
							flexGrow: 1,
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						TRANSCRIBLY
					</Typography>
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: "none", md: "flex" },
							justifyContent: "flex-end",
						}}
					>
						{pages.map((page) => (
							<Button
								key={page}
								onClick={() => handleCloseNavMenu(page)}
								sx={{ my: 2, color: "white", display: "block" }}
							>
								{page}
							</Button>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						{isAuthenticated ? (
							<>
								<Tooltip title="Open settings">
									<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
										<Avatar
											alt="Admin User"
											src="/static/images/avatar/2.jpg"
										/>
									</IconButton>
								</Tooltip>
								<Menu
									sx={{ mt: "45px" }}
									id="menu-appbar"
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
									keepMounted
									transformOrigin={{
										vertical: "top",
										horizontal: "right",
									}}
									open={Boolean(anchorElUser)}
									onClose={() => handleCloseUserMenu()}
								>
									{settings.map((setting) => (
										<MenuItem
											key={setting}
											onClick={() => handleCloseUserMenu(setting)}
										>
											<Typography textAlign="center">{setting}</Typography>
										</MenuItem>
									))}
								</Menu>
							</>
						) : (
							<Box sx={{ display: "flex" }}>
								<Button
									sx={{ my: 2, color: "white", display: "block" }}
									onClick={handleLogin}
								>
									Login
								</Button>
								<Button
									sx={{ my: 2, color: "white", display: "block" }}
									onClick={handleSignup}
								>
									Sign Up
								</Button>
							</Box>
						)}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Header;
