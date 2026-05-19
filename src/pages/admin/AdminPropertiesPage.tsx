import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import {
  obtenerPropiedadesAdmin,
  eliminarPropiedadesAdmin,
  type AdminProperty,
} from "../../services/admin";
import { api } from "../../services/api";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(price);
}

export function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<Record<number, string>>({});
  const [showCloseForm, setShowCloseForm] = useState<Record<number, boolean>>({});
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set());
  const [eliminandoBulk, setEliminandoBulk] = useState(false);

  function showMsg(msg: string) {
    setMensaje(msg);
    setTimeout(() => setMensaje(null), 3500);
  }

  useEffect(() => {
    obtenerPropiedadesAdmin()
      .then(setProperties)
      .finally(() => setCargando(false));
  }, []);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`¿Eliminar permanentemente "${title}"?`)) return;
    await api.delete(`/properties/${id}`);
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSeleccionados((prev) => { const s = new Set(prev); s.delete(id); return s; });
    showMsg(`"${title}" eliminada.`);
  }

  async function handleClose(p: AdminProperty) {
    const reason = (closeReason[p.id] ?? "").trim();
    if (!reason) return;
    await api.post(`/properties/${p.id}/close`, { reason });
    setProperties((prev) =>
      prev.map((x) =>
        x.id === p.id ? { ...x, status: "closed" as const, close_reason: reason } : x
      )
    );
    setShowCloseForm((prev) => ({ ...prev, [p.id]: false }));
    showMsg(`"${p.title}" cerrada.`);
  }

  async function handleBulkDelete() {
    const ids = Array.from(seleccionados);
    const n = ids.length;
    if (!confirm(`¿Eliminar permanentemente ${n} propiedad${n !== 1 ? "es" : ""}? Esta acción no se puede deshacer.`)) return;
    setEliminandoBulk(true);
    try {
      await eliminarPropiedadesAdmin(ids);
      setProperties((prev) => prev.filter((p) => !seleccionados.has(p.id)));
      setSeleccionados(new Set());
      showMsg(`${n} propiedad${n !== 1 ? "es" : ""} eliminada${n !== 1 ? "s" : ""} permanentemente.`);
    } finally {
      setEliminandoBulk(false);
    }
  }

  function toggleCheck(id: number) {
    setSeleccionados((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  function toggleAll(checked: boolean) {
    setSeleccionados(checked ? new Set(properties.map((p) => p.id)) : new Set());
  }

  const todosSeleccionados = properties.length > 0 && seleccionados.size === properties.length;
  const algunoSeleccionado = seleccionados.size > 0 && seleccionados.size < properties.length;

  return (
    <DashboardLayout title="Propiedades" subtitle="Activas y cerradas de todos los propietarios">
      {mensaje && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm">
          {mensaje}
        </div>
      )}

      {/* Barra de acciones masivas */}
      {seleccionados.size > 0 && (
        <div
          className="mb-4 flex items-center justify-between px-5 py-3 rounded-2xl"
          style={{ background: "rgba(220,64,64,0.07)", border: "1.5px solid rgba(220,64,64,0.2)" }}
        >
          <span className="text-sm font-semibold" style={{ color: "#DC4040" }}>
            {seleccionados.size} propiedad{seleccionados.size !== 1 ? "es" : ""} seleccionada{seleccionados.size !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSeleccionados(new Set())}
              className="text-sm px-3 py-1.5 rounded-xl transition"
              style={{ color: "#8A92B2", background: "rgba(27,43,94,0.06)" }}
            >
              Cancelar
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={eliminandoBulk}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#DC4040,#B82020)" }}
            >
              {eliminandoBulk ? "Eliminando…" : "Eliminar seleccionadas"}
            </button>
          </div>
        </div>
      )}

      {cargando ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-[rgba(27,43,94,0.2)] border-t-[#1B2B5E] rounded-full animate-spin" />
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            border: "1px solid rgba(27,43,94,0.08)",
            boxShadow: "0 2px 12px rgba(27,43,94,0.06)",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(27,43,94,0.04)", borderBottom: "1px solid rgba(27,43,94,0.08)" }}>
                <th className="px-6 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={todosSeleccionados}
                    ref={(el) => { if (el) el.indeterminate = algunoSeleccionado; }}
                    onChange={(e) => toggleAll(e.target.checked)}
                    style={{ accentColor: "#DC4040", width: 16, height: 16, cursor: "pointer" }}
                  />
                </th>
                {["Propiedad", "Propietario", "Precio", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#8A92B2" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <>
                  <tr
                    key={p.id}
                    className="border-b transition-colors"
                    style={{
                      borderColor: "rgba(27,43,94,0.06)",
                      background: seleccionados.has(p.id) ? "rgba(220,64,64,0.04)" : undefined,
                    }}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={seleccionados.has(p.id)}
                        onChange={() => toggleCheck(p.id)}
                        style={{ accentColor: "#DC4040", width: 16, height: 16, cursor: "pointer" }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium" style={{ color: "#1B2B5E" }}>{p.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#8A92B2" }}>{p.city} · {p.type}</p>
                    </td>
                    <td className="px-6 py-4" style={{ color: "#5A6280" }}>
                      {p.owner ? p.owner.nombre : "—"}
                    </td>
                    <td className="px-6 py-4 font-medium" style={{ color: "#1B2B5E" }}>
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: p.status === "active" ? "rgba(42,122,78,0.1)" : "rgba(138,146,178,0.1)",
                          color: p.status === "active" ? "#2A7A4E" : "#8A92B2",
                        }}
                      >
                        {p.status === "active" ? "Activa" : "Cerrada"}
                      </span>
                      {p.close_reason && (
                        <p className="text-xs mt-1" style={{ color: "#8A92B2" }}>{p.close_reason}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {p.status === "active" && (
                          <button
                            onClick={() => setShowCloseForm((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium transition"
                            style={{ background: "rgba(201,169,110,0.12)", color: "#8A6230" }}
                          >
                            Cerrar
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium transition"
                          style={{ background: "rgba(220,80,80,0.1)", color: "#DC4040" }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>

                  {showCloseForm[p.id] && (
                    <tr key={`close-${p.id}`} className="border-b" style={{ borderColor: "rgba(27,43,94,0.06)", background: "rgba(201,169,110,0.04)" }}>
                      <td colSpan={6} className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Motivo del cierre (requerido)"
                            value={closeReason[p.id] ?? ""}
                            onChange={(e) => setCloseReason((prev) => ({ ...prev, [p.id]: e.target.value }))}
                            className="flex-1 text-sm rounded-xl border px-3 py-2 focus:outline-none"
                            style={{ borderColor: "rgba(27,43,94,0.2)", color: "#1B2B5E" }}
                          />
                          <button
                            onClick={() => handleClose(p)}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-white"
                            style={{ background: "linear-gradient(135deg,#C9A96E,#B8924A)" }}
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setShowCloseForm((prev) => ({ ...prev, [p.id]: false }))}
                            className="px-3 py-2 rounded-xl text-xs font-medium"
                            style={{ color: "#8A92B2", background: "rgba(27,43,94,0.06)" }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && (
            <p className="text-center py-12 text-sm" style={{ color: "#8A92B2" }}>
              No hay propiedades en el sistema.
            </p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
