import { Link, useNavigate } from "react-router-dom";
import { Home,MessageSquare, TrendingUp,Clock,ArrowUpRight, CheckCircle2, Plus
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, } from "recharts";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { BarChart2} from "lucide-react";
// IMPORTACIÓN DE TUS MOCKS ACTUALIZADOS
import { listadoMock } from "../mocks/propiedades.mock";
import { conversacionesMock } from "../mocks/chat.mock";
import { useMemo } from "react";

const viewsData = [
  { day: "Mon", views: 124 },
  { day: "Tue", views: 189 },
  { day: "Wed", views: 145 },
  { day: "Thu", views: 278 },
  { day: "Fri", views: 312 },
  { day: "Sat", views: 256 },
  { day: "Sun", views: 198 },
];

const usuario = conversacionesMock.length > 0 ? conversacionesMock[0].usuario_propietario : { nombre: "Usuario" };

export function DashboardOverviewPage() {
    const navigate = useNavigate();

    const misPropiedades = useMemo(() => {
        return listadoMock.filter(p => p.usuario_id === 1);
    }, []);

    const activas = misPropiedades.filter(p => p.estado_publicacion === "activa").length;   
    
    const propertyPerformance = useMemo(() => {
        return misPropiedades.map(p => ({
        name: p.titulo.length > 20 ? p.titulo.slice(0, 17) + "..." : p.titulo,
        views: Math.floor((p.id * 137) % 1000) + 100
        }));
    }, [misPropiedades]);

    const topProperty = useMemo(() => {
        if (propertyPerformance.length === 0) return null;
        return [...propertyPerformance].sort((a, b) => b.views - a.views)[0];
    }, [propertyPerformance]);

    const totalNoLeidos = conversacionesMock.reduce((acc: number, c) => acc + c.mensajes_no_leidos, 0);

    const stats = [
        { label: "Propiedades Activas", value: activas, icon: <Home size={20} />, color: "#1B2B5E", bg: "rgba(27,43,94,0.08)", trend: "+5% esta semana" },
        { label: "Propiedades Totales", value: misPropiedades.length, icon: <CheckCircle2 size={20} />, color: "#2A7A4E", bg: "rgba(42,122,78,0.08)", trend: "Sin cambios" },
        { label: "Chats Abiertos", value: conversacionesMock.length, icon: <MessageSquare size={20} />, color: "#C9A96E", bg: "rgba(201,169,110,0.1)", trend: "Ver chats" },
        { label: "Mensajes Nuevos", value: totalNoLeidos, icon: <TrendingUp size={20} />, color: "#4A5FA8", bg: "rgba(74,95,168,0.08)", trend: `${totalNoLeidos} pendientes` },
    ];


    return (
        <DashboardLayout title="Dashboard" subtitle="Resumen de tu actividad inmobiliaria">
            {/* Banner principal */}
            <div
                style={{ background: "linear-gradient(135deg, #111829, #1B2B5E)", borderRadius: "24px", position: "relative", overflow: "hidden" }}
                className="p-7 mb-6"
            >
                <div style={{ background: "rgba(201,169,110,0.12)", width: "280px", height: "280px", borderRadius: "50%", position: "absolute", top: "-80px", right: "-60px", filter: "blur(60px)" }} />
                <div style={{ background: "rgba(74,95,168,0.2)", width: "200px", height: "200px", borderRadius: "50%", position: "absolute", bottom: "-60px", left: "30%", filter: "blur(50px)" }} />
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div style={{ background: "linear-gradient(135deg, #C9A96E, #B8924A)", color: "white", fontSize: "16px" }} className="w-12 h-12 rounded-full flex items-center justify-center font-semibold">
                                {usuario.nombre.charAt(0)}
                            </div>
                            <div>
                                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>Good morning,</p>
                                <h2 style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>{usuario.nombre}</h2>
                            </div>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", marginTop: "8px" }}>
                            Tienes <span style={{ color: "#C9A96E", fontWeight: "600" }}>{totalNoLeidos} mensajes nuevos</span> y <span style={{ color: "#C9A96E", fontWeight: "600" }}>{activas} anuncions activos </span>.
                        </p>
                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={() => navigate("/dashboard/properties/create")}
                            style={{ background: "linear-gradient(135deg, #C9A96E, #B8924A)", color: "white", borderRadius: "14px" }}
                            className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all hover:opacity-90"
                        >
                            <Plus size={16} />
                            New Listing
                        </button>
                        
                        <Link
                            to="/dashboard/chat"
                            style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "14px" }}
                            className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all hover:bg-[rgba(255,255,255,0.18)]"
                            >
                            <MessageSquare size={16} />
                            Mensajes
                            {totalNoLeidos > 0 && (
                                <span style={{ background: "#C9A96E", color: "white", fontSize: "10px" }} className="w-5 h-5 rounded-full flex items-center justify-center">
                                    {totalNoLeidos}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Estadisticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        style={{ background: "white", borderRadius: "20px", border: "1px solid rgba(27,43,94,0.07)", boxShadow: "0 2px 12px rgba(27,43,94,0.05)" }}
                        className="p-5 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div style={{ background: stat.bg, width: "44px", height: "44px", borderRadius: "14px" }} className="flex items-center justify-center">
                                <span style={{ color: stat.color }}>{stat.icon}</span>
                            </div>
                            <span style={{ background: "rgba(42,122,78,0.08)", color: "#2A7A4E", fontSize: "11px", borderRadius: "8px" }} className="px-2 py-1 font-medium">
                                ↑ Up
                            </span>
                        </div>
                        <p style={{ color: "#1B2B5E", fontSize: "28px", fontWeight: "700", letterSpacing: "-1px" }}>{stat.value}</p>
                        <p style={{ color: "#8A92B2", fontSize: "13px" }} className="mt-0.5">{stat.label}</p>
                        <p style={{ color: "#C9A96E", fontSize: "12px" }} className="mt-2 font-medium">{stat.trend}</p>
                    </div>
                ))}
            </div>
        
            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Visitas Semanales */}
                <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
                    <h3 className="text-[#1B2B5E] font-bold mb-6">Visitas Semanales</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={viewsData}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4A5FA8" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#4A5FA8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#8A92B2', fontSize: 11}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#8A92B2', fontSize: 11}} />
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                            <Area type="monotone" dataKey="views" stroke="#4A5FA8" strokeWidth={3} fill="url(#colorViews)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Vistas de las Propiedades */}
                <div
                    style={{ background: "white", borderRadius: "20px", border: "1px solid rgba(27,43,94,0.07)", boxShadow: "0 2px 12px rgba(27,43,94,0.05)" }}
                    className="p-6"
                >
                    <div className="flex items-center gap-2 mb-5">
                        <BarChart2 size={18} style={{ color: "#C9A96E" }} />
                        <h3 style={{ color: "#1B2B5E", fontSize: "16px", fontWeight: "600" }}> Vistas de las propiedades.</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={propertyPerformance} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,43,94,0.05)" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 11, fill: "#8A92B2" }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#8A92B2" }} axisLine={false} tickLine={false} width={90} />
                            <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px", border: "1px solid rgba(27,43,94,0.1)" }} />
                            <Bar dataKey="views" fill="#4A5FA8" radius={[0, 6, 6, 0]} name="Views" />
                        </BarChart>
                    </ResponsiveContainer>
                    <div style={{ borderTop: "1px solid rgba(27,43,94,0.06)" }} className="mt-4 pt-4">
                        <p style={{ color: "#8A92B2", fontSize: "12px" }}>Top Views</p>
                        <p style={{ color: "#1B2B5E", fontSize: "14px", fontWeight: "600" }}>{topProperty ? `${topProperty.name} — ${topProperty.views.toLocaleString()} views` : "No data available"}</p>
                    </div>
                </div>
            </div>

            {/* Listas Dinámicas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Inmuebles Recientes */}
                <div className="bg-white p-6 rounded-[28px] border border-gray-100">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-[#1B2B5E] font-bold">Mis Propiedades</h3>
                        <Link 
                            to="/dashboard/properties" 
                            className="text-[#4A5FA8] text-xs font-bold uppercase"
                        >
                            Ver todas
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {misPropiedades.slice(0, 3).map((p) => (
                            <div key={p.id} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                <div className="w-14 h-14 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                                    <img src={`https://picsum.photos/seed/${p.id}/100/100`} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[#1B2B5E] text-sm font-bold truncate">{p.titulo}</h4>
                                    <p className="text-[#8A92B2] text-[11px] uppercase font-medium">{p.tipo} • ${p.precio.toLocaleString()}</p>
                                </div>
                                <button 
                                    onClick={() => navigate(`/dashboard/properties/edit/${p.id}`)} 
                                    className="p-2 text-[#C9A96E]"
                                >
                                    <ArrowUpRight size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mensajes Recientes (Usando chat.mock.ts) */}
                <div className="bg-white p-6 rounded-[28px] border border-gray-100">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-[#1B2B5E] font-bold">Chats Recientes</h3>
                        <Link 
                            to="/dashboard/chat" 
                            className="text-[#4A5FA8] text-xs font-bold uppercase"
                        >
                            Ver chat
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {conversacionesMock.slice(0, 3).map((conv) => (
                            <div key={conv.id} className="flex items-center gap-4 p-3 rounded-2xl bg-[#F8F9FB] border border-gray-50">
                                <div className="w-10 h-10 rounded-full bg-[#1B2B5E] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                    {conv.usuario_interesado.nombre.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="text-[#1B2B5E] text-sm font-bold">{conv.usuario_interesado.nombre}</h4>
                                        <span className="text-[9px] font-bold text-[#8A92B2] uppercase">
                                            <Clock size={10} className="inline mr-1" />
                                            {new Date(conv.ultimo_mensaje.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <p className="text-[#5A6280] text-xs truncate italic">"{conv.ultimo_mensaje.contenido}"</p>
                                </div>

                                {conv.mensajes_no_leidos > 0 && (
                                    <div className="w-5 h-5 bg-[#C9A96E] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                                        {conv.mensajes_no_leidos}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[
                    { label: "List Property", icon: <Plus size={18} />, path: "/dashboard/properties/create", color: "#1B2B5E" },
                    { label: "View Listings", icon: <Home size={18} />, path: "/dashboard/properties", color: "#4A5FA8" },
                    { label: "Messages", icon: <MessageSquare size={18} />, path: "/dashboard/chat", color: "#C9A96E" },
                    { label: "Profile", icon: <ArrowUpRight size={18} />, path: "/dashboard/profile", color: "#2A7A4E" },
                ].map((action, i) => (
                    <Link
                        key={i}
                        to={action.path}
                        style={{ background: "white", borderRadius: "18px", border: "1px solid rgba(27,43,94,0.07)", boxShadow: "0 2px 12px rgba(27,43,94,0.05)" }}
                        className="flex items-center gap-3 p-4 hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                        <div style={{ background: `${action.color}12`, width: "40px", height: "40px", borderRadius: "12px" }} className="flex items-center justify-center shrink-0">
                            <span style={{ color: action.color }}>{action.icon}</span>
                        </div>
                        <span style={{ color: "#1B2B5E", fontSize: "14px", fontWeight: "500" }}>{action.label}</span>
                    </Link>
                ))}
            </div>
        </DashboardLayout>
    );
}