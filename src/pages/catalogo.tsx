import { useState, useMemo} from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, Grid3X3, List, Search,Home} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { PropertyCard } from "../components/ui/PropertyCard";
import { Paginacion } from "../components/ui/paginacion";
import { listadoMock } from "../mocks/propiedades.mock";
import { ubicacionesMock } from "../mocks/busqueda.mock";

const ITEMS_PER_PAGE = 6;

export function Catalogo() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filtered = useMemo(() => {
        let results = [...listadoMock];

        const query = searchParams.get("ubicacion")?.toLowerCase() || ""; 
        const op = searchParams.get("operacion") || "all";
        const tipo = searchParams.get("tipo") || "all";
        const precio_min = searchParams.get("precio_min") || "";
        const precio_max = searchParams.get("precio_max") || "";
        const recamaras = searchParams.get("recamaras") || "any";
        const metros_min = searchParams.get("metros_min") || "";
        const orden = searchParams.get("sort") || "newest";

        const ciudadSelected = searchParams.get("ciudad");

        if (ciudadSelected && ciudadSelected !== "all") {
            results = results.filter(p => {
                const infoUbicacion = ubicacionesMock.find(u => u.id === p.ubicacion_id);
                
                return infoUbicacion?.ciudad.toLowerCase() === ciudadSelected.toLowerCase();
            });
        }

        if (query !== "" && query !== "all") {
            results = results.filter(p => {
                const infoUbicacion = ubicacionesMock.find(u => u.id === p.ubicacion_id);
                
                return (
                    p.titulo?.toLowerCase().includes(query) || 
                    p.tipo?.toLowerCase().includes(query) || 
                    infoUbicacion?.ciudad.toLowerCase().includes(query) ||
                    infoUbicacion?.estado.toLowerCase().includes(query) 
                );
            });
        }

        if (op !== "all") {
            results = results.filter(p => p.operacion === op);
        }

        if (tipo !== "all") {
            results = results.filter(p => p.tipo === tipo);
        }

        if (precio_min !== "") {
            results = results.filter(p => p.precio >= Number(precio_min));
        }

        if (precio_max !== "") {
            results = results.filter(p => p.precio <= Number(precio_max));
        }

        if (recamaras !== "any") {
            const numRecamaras = parseInt(recamaras);
            results = results.filter(p => p.recamaras >= numRecamaras);
        }

        if (metros_min !== "") {
            results = results.filter(p => p.metros_cuadrados >= Number(metros_min));
        }

        results = results.sort((a, b) => {
            if (orden == "price-asc") return a.precio - b.precio;
            if (orden == "price-desc") return b.precio - a.precio;
            if (orden == "newest") return b.id - a.id;
            return 0;
        });

        // Amenidades

        const filtroJardin = searchParams.get("jardin") === "true";
        const filtroCochera = searchParams.get("cochera") === "true";
        const filtroAgua = searchParams.get("agua") === "true";
        const filtroLuz = searchParams.get("luz") === "true";
        const filtroDrenaje = searchParams.get("drenaje") === "true";

        if (filtroJardin) {
            results = results.filter(p => p.jardin === true);
        }
        if (filtroCochera) {
            results = results.filter(p => p.cochera >= 1);
        }
        if (filtroAgua) {
            results = results.filter(p => p.agua === true);
        }
        if (filtroLuz) {
            results = results.filter(p => p.luz === true);
        }
        if (filtroDrenaje) {
            results = results.filter(p => p.drenaje === true);
        }
        return results;
    }, [searchParams]);

    const page = Number(searchParams.get("page") || "1");
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filtered.slice(start, end);
        }, [filtered, page]); 

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all" && value !== "any") {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        params.set("page", "1");
        setSearchParams(params);
    };

    const ciudadesDisp = useMemo(() => {
        const idCiudades = [...new Set(listadoMock.map(p => p.ubicacion_id))];
        return ubicacionesMock.filter(u => idCiudades.includes(u.id));
     }, []);

    return (
        <div className="min-h-screen bg-[#F8F4EE]">
            <Navbar />

            {/* Header*/}
            <div className="bg-white border-b border-gray-100 top-16 z-30 py-4 px-6">
                <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
                
                    {/* Buscador y Filtros */}
                    <div className="flex items-center gap-3">
                        {/* Input de Búsqueda */}
                        <div className="bg-[#F0F2F8] rounded-xl flex items-center gap-2 px-4 py-1.5 border border-transparent focus-within:border-[#1B2B5E]/20 transition-all">
                            <Search size={18} className="text-[#8A92B2]" />
                            <input
                                type="text"
                                placeholder="Buscar por título, ciudad o tipo..."
                                className="bg-transparent border-none outline-none text-sm text-[#1B2B5E] w-[280px] placeholder:text-[#B0B8D0]"
                                value={searchParams.get("ubicacion") || ""}
                                onChange={(e) => handleFilterChange("ubicacion", e.target.value)}
                            />
                        </div>

                        {/* Botones de Operación */}
                        <div className="flex bg-[#F0F2F8] p-1 rounded-xl">
                            {[
                                { id: "all", label: "Todo" },
                                { id: "venta", label: "Para Venta" },
                                { id: "renta", label: "Para Renta" },
                            ].map((op) => {
                                const isSelected = (searchParams.get("operacion") || "all") === op.id;
                                return (
                                    <button
                                        key={op.id}
                                        onClick={() => handleFilterChange("operacion", op.id)}
                                        className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${
                                            isSelected 
                                            ? "bg-[#1B2B5E] text-white shadow-md" 
                                            : "text-[#5A6280] hover:text-[#1B2B5E]"
                                        }`}
                                    >
                                        {op.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contador, Sort y View Mode */}
                    <div className="flex items-center gap-4">
                        {/* Contador de propiedades */}
                        <span className="text-sm text-[#8A92B2]">
                            <strong className="text-[#1B2B5E]">{filtered.length}</strong> properties found
                        </span>

                        {/* Selector de Orden (Sort) */}
                        <select
                            value={searchParams.get("sort") || "newest"}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-[#1B2B5E] outline-none hover:border-gray-300 transition-all"
                            onChange={(e) => handleFilterChange("sort", e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>

                        {/* Botones de Vista (Grid/List) */}
                        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden p-0.5">
                            <button 
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#1B2B5E] text-white" : "text-[#8A92B2] hover:bg-gray-50"}`}
                            >
                                <Grid3X3 size={18} />
                            </button>
                            <button 
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-[#1B2B5E] text-white" : "text-[#8A92B2] hover:bg-gray-50"}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
                {/* SIDEBAR DE FILTROS */}
                <aside className="w-full lg:w-80 shrink-0">
                    <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-xl shadow-blue-900/5 sticky top-44">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="flex items-center gap-2 font-bold text-[#1B2B5E]">
                                <SlidersHorizontal size={18} className="text-[#C9A96E]" /> Filtros
                            </h2>
                            <button 
                                onClick={() => setSearchParams({ operacion: "venta" })}
                                className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                            >
                                Limpiar
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Tipo de Propiedad */}
                            <div>
                                <label className="text-[11px] font-bold text-[#1B2B5E] uppercase mb-4 block tracking-wider">
                                    Property Type
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: "all", label: "Todo" },
                                        { id: "casa", label: "Casa" },
                                        { id: "depto", label: "Departamento" },
                                        { id: "local", label: "Local" },
                                        { id: "terreno", label: "Terreno" },
                                        { id: "oficina", label: "Oficina" },
                                    ].map((t) => {
                                        const isSelected = (searchParams.get("tipo") || "all") === t.id;
                                    
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => handleFilterChange("tipo", t.id)}
                                                className={`
                                                    py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 border
                                                    ${isSelected 
                                                    ? "bg-[#F0F2F8] border-[#1B2B5E] text-[#1B2B5E] shadow-sm" 
                                                    : "bg-white border-gray-100 text-[#8A92B2] hover:border-gray-300"
                                                    }
                                                `}
                                            >
                                                {t.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                {/* Ubicación (Ciudad) */}
                                <label className="text-[11px] font-bold text-[#8A92B2] uppercase mb-2 block">City</label>
                                <select 
                                    value={searchParams.get("ciudad") || "all"}
                                    onChange={(e) => handleFilterChange("ciudad", e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-[#1B2B5E] outline-none"
                                >
                                    <option value="all">All Cities</option>
                                    {ciudadesDisp.map(c => (
                                        <option key={c.id} value={c.ciudad.toLowerCase()}>{c.ciudad}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Recámaras */}
                            <div>
                                <label className="text-[11px] font-bold text-[#1B2B5E] uppercase mb-4 block tracking-wider">
                                    Bedrooms
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {["any", "1", "2", "3", "4","5+"].map((val) => {
                                            
                                        const currentRecamaras = searchParams.get("recamaras") || "any";
                                        const isSelected = currentRecamaras === val.replace("+", "");
                                        
                                        return (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => handleFilterChange("recamaras", val === "any" ? "any" : val.replace("+", ""))}
                                                className={`
                                                    w-11 h-11 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center justify-center
                                                    ${isSelected 
                                                    ? "bg-[#F0F2F8] border-[#1B2B5E] text-[#1B2B5E] shadow-sm ring-1 ring-[#1B2B5E]" 
                                                    : "bg-white border-gray-100 text-[#8A92B2] hover:border-gray-300"
                                                    }
                                                `}
                                            >
                                                {val}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Rango de Precio */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold text-[#8A92B2] uppercase mb-2 block">Min $</label>
                                    <input 
                                        type="number" 
                                        placeholder="0"
                                        value={searchParams.get("precio_min") || ""}
                                        onChange={(e) => handleFilterChange("precio_min", e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-[#1B2B5E] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-[#8A92B2] uppercase mb-2 block">Max $</label>
                                    <input 
                                        type="number" 
                                        placeholder="Max"
                                        value={searchParams.get("precio_max") || ""}
                                        onChange={(e) => handleFilterChange("precio_max", e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-[#1B2B5E] outline-none"
                                    />
                                </div>
                            </div>

                            {/* Min Area (Metros Cuadrados) */}
                            <div>
                                <label className="text-[11px] font-bold text-[#8A92B2] uppercase mb-2 block">Min Area (m²)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        placeholder="Ej: 100"
                                        value={searchParams.get("metros_min") || ""}
                                        onChange={(e) => handleFilterChange("metros_min", e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-[#1B2B5E] outline-none"
                                    />
                                    <span className="absolute right-4 top-3 text-[10px] text-[#8A92B2] font-bold">M²</span>
                                </div>
                            </div>
                            {/* Amenidades (Checkboxes) */}
                            <div>
                                <label className="text-[11px] font-bold text-[#8A92B2] uppercase mb-3 block">Amenities</label>
                                <div className="space-y-2">
                                    {[
                                        { id: "jardin", label: "Garden" },
                                        { id: "cochera", label: "Parking" },
                                        { id: "agua", label: "Water" },
                                        { id: "luz", label: "Electricity" },
                                        { id: "drenaje", label: "Drainage" },
                                    ].map((item) => (
                                        <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                type="checkbox"
                                                checked={searchParams.get(item.id) === "true"}
                                                onChange={(e) => {
                                                    const params = new URLSearchParams(searchParams);
                                                    if (e.target.checked) {
                                                        params.set(item.id, "true");
                                                    } else {
                                                        params.delete(item.id);
                                                    }
                                                    params.set("page", "1"); 
                                                    setSearchParams(params);
                                                }}
                                                className="w-5 h-5 rounded-lg border-gray-200 text-[#1B2B5E] focus:ring-[#1B2B5E]/20"
                                            />
                                            {searchParams.get(item.id) === "true" && (
                                                <svg className="absolute w-3 h-3 text-white left-1 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                    <path d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            <span className="text-sm font-medium text-[#5A6280] group-hover:text-[#1B2B5E] transition-colors">
                                                {item.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* CONTENIDO PRINCIPAL */}
                <div className="flex-1">
                {paginated.length > 0 ? (
                    <>
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                        {paginated.map((propiedad) => (
                        <PropertyCard key={propiedad.id} property={propiedad} variant={viewMode} />
                        ))}
                    </div>

                    {/* PAGINACIÓN (ISSUE #19) */}
                    <Paginacion 
                        paginaActual={page} 
                        totalPaginas={totalPages} 
                        onCambiar={handlePageChange} 
                    />
                    </>
                ) : (
                        <div className="bg-white rounded-[32px] p-20 text-center border border-dashed border-gray-200">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Home size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1B2B5E] mb-2">No se encontraron propiedades</h3>
                            <p className="text-gray-400 max-w-xs mx-auto mb-8">Intenta ajustar los filtros para obtener más resultados.</p>
                            <button 
                                onClick={() => setSearchParams({ operacion: "venta" })}
                                className="bg-[#1B2B5E] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                Restablecer Filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}