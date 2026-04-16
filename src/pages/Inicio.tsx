//pages/Inicio.tsx
import { useNavigate } from "react-router-dom";
import {  ChevronRight, Star, TrendingUp, Shield, Headphones, ArrowRight } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { PropertyCard } from "../components/ui/PropertyCard";
import { FiltrosBusqueda } from "../components/ui/filtrosBusqueda";
import { listadoMock } from "../mocks/propiedades.mock";

import { mapToPropiedad } from "../components/adapters/property.adapter";


export function HomePage() {
    const navigate = useNavigate();
  
    // Mostrar 3 propiedades destacadas de tus mocks
    const featuredProperties = listadoMock.data.slice(0, 3);

    const handleFiltrar = (filtros: Record<string, string>) => {
        // Handle filter logic here
        console.log("Filtros aplicados:", filtros);
    };


    return (
        <div style={{ backgroundColor: "#F8F4EE", minHeight: "100vh" }}>
      
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[88vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    {/* Imagen de fondo */}
                    <img 
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80" 
                        alt="Hero" 
                        className="w-full h-full object-cover" 
                    />
                    <div style={{ background: "linear-gradient(135deg, rgba(17,24,41,0.82) 0%, rgba(27,43,94,0.65) 50%, rgba(17,24,41,0.4) 100%)" }} className="absolute inset-0" />
                    {/* Decorative circles */}
                    <div style={{ background: "rgba(201,169,110,0.15)", width: "600px", height: "600px", borderRadius: "50%", position: "absolute", top: "-100px", right: "-100px", filter: "blur(80px)" }} />
                    <div style={{ background: "rgba(74,95,168,0.15)", width: "400px", height: "400px", borderRadius: "50%", position: "absolute", bottom: "-50px", left: "20%", filter: "blur(60px)" }} />
                </div>

                <div className="relative max-w-[1400px] mx-auto px-6 w-full py-20">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span style={{ background: "rgba(201,169,110,0.25)", border: "1px solid rgba(201,169,110,0.4)", color: "#C9A96E", fontSize: "13px", backdropFilter: "blur(10px)" }} className="px-4 py-1.5 rounded-full font-semibold">
                                ✦ France's Premium Property Platform
                            </span>
                        </div>

                        <h1 style={{ color: "white", fontSize: "clamp(36px, 5vw, 68px)", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-1px" }} className="mb-5">
                            Find Your <span style={{ color: "#C9A96E" }}> Dream </span> Property
                        </h1>
                        
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "18px", lineHeight: "1.7", maxWidth: "500px" }} className="mb-10">
                           Discover {listadoMock.data.length}+ premium properties
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-8 mb-10">
                            {[
                                { value: `${listadoMock.data.length * 10}+`, label: "Properties" },
                                { value: "8,500+", label: "Happy Clients" },
                                { value: "98%", label: "Satisfaction" },
                            ].map((stat, i) => (
                                <div key={i}>
                                <p style={{ color: "#C9A96E", fontSize: "24px", fontWeight: "700" }}>{stat.value}</p>
                                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filtros */}
                    <div 
                        style={{ 
                            background: "rgba(255,255,255,0.97)", 
                            backdropFilter: "blur(20px)", 
                            borderRadius: "24px", 
                            boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.6)", 
                            maxWidth: "900px" 
                        }} 
                        className="p-6"
                    >
                       <FiltrosBusqueda onFiltrar={handleFiltrar} />
                    </div>
                </div>
            </section>

            {/* Property Type Pills */}
            <section style={{ backgroundColor: "#F8F4EE" }} className="py-12">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        {[
                            { label: "🏠 Houses", count: "3,240" },
                            { label: "🏢 Apartments", count: "5,120" },
                            { label: "🏰 Villas", count: "890" },
                            { label: "🏙 Studios", count: "2,100" },
                            { label: "🌆 Penthouses", count: "340" },
                            { label: "🏡 Townhouses", count: "1,450" },
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={() => navigate("/search")}
                                style={{
                                    background: "white",
                                    border: "1.5px solid rgba(27,43,94,0.09)",
                                    borderRadius: "100px",
                                    color: "#3A4570",
                                    boxShadow: "0 2px 8px rgba(27,43,94,0.05)",
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all hover:shadow-md hover:border-[rgba(27,43,94,0.2)] hover:-translate-y-0.5"
                            >
                                {item.label}
                                <span style={{ color: "#8A92B2", fontSize: "12px" }}>({item.count})</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Properties */}
            <section style={{ backgroundColor: "#F8F4EE" }} className="pb-16">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <p style={{ color: "#C9A96E", fontSize: "13px", letterSpacing: "0.1em" }} className="uppercase font-semibold mb-2">✦ Curated Selection</p>
                            <h2 style={{ color: "#1B2B5E", fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>Featured Properties</h2>
                        </div>
                        <button
                            onClick={() => navigate("/catalogo")}
                            style={{ color: "#4A5FA8", border: "1.5px solid rgba(74,95,168,0.2)", borderRadius: "14px" }}
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-[rgba(74,95,168,0.06)]"
                        >
                            View All
                            <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProperties.map((p) => (
                       <PropertyCard key={p.id} property={mapToPropiedad(p)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Habitta */}
            <section style={{ background: "linear-gradient(135deg, #F0EDE6, #E8E4DA)" }} className="py-20">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-14">
                        <p style={{ color: "#C9A96E", fontSize: "13px", letterSpacing: "0.1em" }} className="uppercase font-semibold mb-3">✦ Why Choose Us</p>
                        <h2 style={{ color: "#1B2B5E", fontSize: "36px", fontWeight: "700", letterSpacing: "-0.5px" }} className="mb-4">The Habitta Difference</h2>
                        <p style={{ color: "#6A7280", fontSize: "16px", maxWidth: "500px", margin: "0 auto", lineHeight: "1.7" }}>
                            We combine cutting-edge technology with deep local expertise to deliver an exceptional property experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            {
                                icon: <Star size={22} />,
                                title: "Premium Quality",
                                desc: "Every listing is verified and curated to meet our high standards of quality.",
                                color: "#C9A96E",
                            },
                            {
                                icon: <TrendingUp size={22} />,
                                title: "Market Insights",
                                desc: "Real-time data and AI-powered analytics to help you make informed decisions.",
                                color: "#4A5FA8",
                            },
                            {
                                icon: <Shield size={22} />,
                                title: "Secure Transactions",
                                desc: "Bank-level security and verified agents ensure safe, transparent deals.",
                                color: "#2A7A4E",
                            },
                            {
                                icon: <Headphones size={22} />,
                                title: "Expert Support",
                                desc: "Dedicated property experts available 7 days a week for personalized guidance.",
                                color: "#9B5FA8",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "white",
                                    borderRadius: "22px",
                                    border: "1px solid rgba(27,43,94,0.06)",
                                    boxShadow: "0 4px 20px rgba(27,43,94,0.05)",
                                }}
                                className="p-6 group hover:shadow-lg transition-all hover:-translate-y-1"
                            >
                                <div
                                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}25`, width: "52px", height: "52px", borderRadius: "16px" }}
                                    className="flex items-center justify-center mb-5"
                                >
                                    <span style={{ color: item.color }}>{item.icon}</span>
                                </div>
                                <h3 style={{ color: "#1B2B5E", fontSize: "17px", fontWeight: "600" }} className="mb-2">{item.title}</h3>
                                <p style={{ color: "#8A92B2", fontSize: "14px", lineHeight: "1.6" }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cities Section */}
            <section style={{ backgroundColor: "#F8F4EE" }} className="py-20">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p style={{ color: "#C9A96E", fontSize: "13px", letterSpacing: "0.1em" }} className="uppercase font-semibold mb-2">✦ Explore By City</p>
                            <h2 style={{ color: "#1B2B5E", fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>Popular Destinations</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { city: "Paris", count: "4,200", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
                            { city: "Lyon", count: "1,800", image: "https://images.unsplash.com/photo-1528697203043-733dafdaa316?auto=format&fit=crop&w=800&q=80" },
                            { city: "Bordeaux", count: "980", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
                            { city: "Nice", count: "1,200", image: "https://images.unsplash.com/photo-1528697203043-733dafdaa316?auto=format&fit=crop&w=800&q=80" },
                            { city: "Marseille", count: "1,500", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
                            { city: "Toulouse", count: "760", image: "https://images.unsplash.com/photo-1528697203043-733dafdaa316?auto=format&fit=crop&w=800&q=80" },
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(`/search?city=${item.city}`)}
                                className="relative overflow-hidden group"
                                style={{ borderRadius: "20px", height: "160px" }}
                            >
                                <img src={item.image} alt={item.city} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div style={{ background: "linear-gradient(to top, rgba(17,24,41,0.8) 0%, rgba(17,24,41,0.1) 100%)" }} className="absolute inset-0" />
                                <div className="absolute bottom-3 left-3 text-left">
                                    <p style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>{item.city}</p>
                                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px" }}>{item.count} listings</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div
                        style={{
                            background: "linear-gradient(135deg, #111829, #1B2B5E)",
                            borderRadius: "28px",
                            overflow: "hidden",
                            position: "relative",
                        }}
                        className="p-12 md:p-16"
                    >
                        <div style={{ background: "rgba(201,169,110,0.15)", width: "500px", height: "500px", borderRadius: "50%", position: "absolute", top: "-150px", right: "-100px", filter: "blur(80px)" }} />
                        <div style={{ background: "rgba(74,95,168,0.2)", width: "300px", height: "300px", borderRadius: "50%", position: "absolute", bottom: "-80px", left: "10%", filter: "blur(60px)" }} />
                        <div className="relative text-center">
                            <p style={{ color: "#C9A96E", fontSize: "13px", letterSpacing: "0.1em" }} className="uppercase font-semibold mb-4">✦ List Your Property</p>
                            <h2 style={{ color: "white", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700", letterSpacing: "-0.5px" }} className="mb-4">
                                Ready to Sell or Rent?
                            </h2>
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", maxWidth: "480px", margin: "0 auto 8px" }}>
                                List your property on Habitta and connect with thousands of qualified buyers and renters.
                            </p>
                            <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
                                <button
                                    onClick={() => navigate("/dashboard/properties/create")}
                                    style={{ background: "linear-gradient(135deg, #C9A96E, #B8924A)", color: "white" }}
                                    className="flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:opacity-90 hover:shadow-xl"
                                >
                                    List Your Property
                                    <ArrowRight size={18} />
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
                                    style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
                                    className="px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:bg-[rgba(255,255,255,0.15)]"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}