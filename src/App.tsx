import { useEffect } from "react";
import { api } from "./services/api";

function App() {

useEffect(() => {
api.get("/ping").then(res => console.log(res.data));
}, []);

return <h1>Habitta</h1>;
}

export default App;