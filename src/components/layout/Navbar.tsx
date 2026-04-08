import { Link, useLocation, useNavigate } from "react-router";
import { MessageSquare, Search, Home, ChevronDown, Menu, X, Settings, LogOut, Building2, Bell} from "lucide-react";
import { useState } from "react";
import { conversacionesMock } from "../../mocks/chat.mock";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated = true }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;
    const usuario = conversacionesMock.length > 0 ? conversacionesMock[0].usuario_propietario : { nombre: "Usuario" }; // Ejemplo para mostrar el nombre del usuario

    const mensajesNoLeidos = conversacionesMock.reduce((acc, c) => acc + c.mensajes_no_leidos, 0);

    const notificacionesNoLeidas = 3; // Ejemplo de notificaciones no leídas

    return (
        <header
            style={{ backgroundColor: "rgba(255, 255, 255, 0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(27,43,94,0.08)" }}
            className="sticky top-0 z-50 w-full"
        >
            <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    <div
                        style={{ background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)" }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                    >
                        <Home size={16} color="white" />
                    </div>
                    <span style={{ color: "#1B2B5E", letterSpacing: "-0.5px" }} className="text-xl font-semibold">
                        Habitta
                    </span>
                </Link>


                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {[
                        { label: "Buy", path: "/search?type=sale" },
                        { label: "Rent", path: "/search?type=rent" },
                        { label: "Sell", path: "/dashboard/properties/create" },
                        { label: "Explore", path: "/search" },
                    ].map((item) => (
                            <Link
                            key={item.label}
                            to={item.path}
                            style={{
                                color: isActive(item.path) ? "#1B2B5E" : "#5A6280",
                                backgroundColor: isActive(item.path) ? "rgba(27,43,94,0.07)" : "transparent",
                            }}
                            className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[rgba(27,43,94,0.06)] hover:text-[#1B2B5E]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Side */}
                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <>
                            {/* Search Icon */}
                            <Link
                                to="/search"
                                className="hidden md:flex w-9 h-9 items-center justify-center rounded-xl transition-all hover:bg-[rgba(27,43,94,0.06)]"
                                style={{ color: "#5A6280" }}
                            >
                                <Search size={18} />
                            </Link>
                            
                            {/* Notifications */}
                            <button
                                className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:bg-[rgba(27,43,94,0.06)]"
                                style={{ color: "#5A6280" }}
                            >
                                <Bell size={19} />
                                {notificacionesNoLeidas > 0 && (
                                    <span 
                                        style={{ background: "#E06B6B", color: "white", fontSize: "10px" }}
                                        className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center font-semibold"
                                    >
                                        {notificacionesNoLeidas}
                                    </span>
                                )}
                            </button>

                            {/* Messages */}
                            <Link
                                to="/dashboard/chat"
                                className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:bg-[rgba(27,43,94,0.06)]"
                                style={{ color: "#5A6280" }}
                            >
                                <MessageSquare size={19} />
                                {mensajesNoLeidos > 0 && (
                                    <span
                                        style={{ background: "#C9A96E", color: "white", fontSize: "10px" }}
                                        className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center font-semibold"
                                    >                                  
                                        {mensajesNoLeidos}
                                    </span>
                                )}
                            </Link>
                            
                            {/* User menu */}
                            <div className="relative ml-1">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl transition-all hover:bg-[rgba(27,43,94,0.06)]"
                                >
                                    <div
                                        style={{ background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)", color: "white", fontSize: "12px" }}
                                        className="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
                                    >
                                        {usuario.nombre.charAt(0)}
                                    </div>
                                    <ChevronDown size={14} style={{ color: "#5A6280" }} />
                                </button>

                                {userMenuOpen && (
                                    <div
                                        style={{ backgroundColor: "white", border: "1px solid rgba(27,43,94,0.1)", boxShadow: "0 8px 32px rgba(27,43,94,0.12)" }}
                                        className="absolute right-0 top-12 w-52 rounded-2xl overflow-hidden z-50"
                                    >
                                        <div style={{ borderBottom: "1px solid rgba(27,43,94,0.08)" }} className="px-4 py-3">
                                            <p style={{ color: "#1B2B5E" }} className="text-sm font-semibold">{usuario.nombre}</p>
                                            <p style={{ color: "#8A92B2", fontSize: "12px" }}>alexandre@email.com</p>
                                        </div>
                                        {[
                                            { label: "Dashboard", icon: <Building2 size={15} />, path: "/dashboard" },
                                            { label: "My Properties", icon: <Home size={15} />, path: "/dashboard/properties" },
                                            { label: "Messages", icon: <MessageSquare size={15} />, path: "/dashboard/chat" },
                                            { label: "Profile Settings", icon: <Settings size={15} />, path: "/dashboard/profile" },
                                        ].map((item) => (
                                            <Link
                                                key={item.label}
                                                to={item.path}
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 transition-all hover:bg-[rgba(27,43,94,0.04)]"
                                                style={{ color: "#3A4570" }}
                                            >
                                                <span style={{ color: "#8A92B2" }}>{item.icon}</span>
                                                <span style={{ fontSize: "14px" }}>{item.label}</span>
                                            </Link>
                                        ))}
                                        <div style={{ borderTop: "1px solid rgba(27,43,94,0.08)" }}>
                                            <button
                                                onClick={() => { setUserMenuOpen(false); navigate("/login"); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 transition-all hover:bg-[rgba(220,80,80,0.06)]"
                                                style={{ color: "#E06B6B" }}
                                            >
                                                <LogOut size={15} />
                                                <span style={{ fontSize: "14px" }}>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                style={{ color: "#1B2B5E" }}
                                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[rgba(27,43,94,0.06)]"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                style={{ background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)", color: "white" }}
                                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 shadow-sm"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl"
                        style={{ color: "#5A6280" }}
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div
                    style={{ borderTop: "1px solid rgba(27,43,94,0.08)", backgroundColor: "rgba(255,255,255,0.98)" }}
                    className="md:hidden px-6 pb-4 space-y-1"
                >
                    {[
                        { label: "Buy", path: "/search?type=sale" },
                        { label: "Rent", path: "/search?type=rent" },
                        { label: "Explore", path: "/search" },
                        { label: "Dashboard", path: "/dashboard" },
                        { label: "Messages", path: "/dashboard/chat" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-[rgba(27,43,94,0.06)]"
                            style={{ color: "#3A4570" }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}

