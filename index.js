const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

// Configuración
app.use(cors());
app.use(express.json());

const DATA_FILE = "./data/data.json"; // Ruta al archivo JSON

// Leer datos del archivo
function readData() {
  return new Promise((resolve, reject) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
}

// Guardar datos en el archivo
function writeData(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// Rutas


// ==========================================================================
//                                 GET
// ==========================================================================

// Obtener todas las fechas
app.get("/dates", async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error reading data" });
  }
});


// ==========================================================================
//                                 PUT
// ==========================================================================

// Actualizar availableDates
app.put("/dates/available", async (req, res) => {
  const { availableDates } = req.body;
  if (!availableDates || !Array.isArray(availableDates)) {
    return res.status(400).json({ error: "Invalid availableDates data" });
  }

  try {
    const data = await readData();
    data.availableDates = availableDates;
    await writeData(data);
    res.json({ message: "Available dates updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating availableDates" });
  }
});

// Actualizar occupiedDates
app.put("/dates/occupied", async (req, res) => {
  const { occupiedDates } = req.body;
  if (!occupiedDates || !Array.isArray(occupiedDates)) {
    return res.status(400).json({ error: "Invalid occupiedDates data" });
  }

  try {
    const data = await readData();
    data.occupiedDates = occupiedDates;
    await writeData(data);
    res.json({ message: "Occupied dates updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating occupiedDates" });
  }
});


// ==========================================================================
//                                 PATCH
// ==========================================================================

// Actualizar availableDates (sumar nuevas fechas) con PATCH
app.patch("/dates/available", async (req, res) => {
  const { availableDates } = req.body;
  if (!availableDates || !Array.isArray(availableDates)) {
    return res.status(400).json({ error: "Invalid availableDates data" });
  }

  try {
    const data = await readData();

    // Combinar y eliminar duplicados
    data.availableDates = Array.from(new Set([...data.availableDates, ...availableDates]));

    await writeData(data);
    res.json({ message: "Available dates updated successfully", availableDates: data.availableDates });
  } catch (err) {
    res.status(500).json({ error: "Error updating availableDates" });
  }
});

// Actualizar occupiedDates (sumar nuevas fechas) con PATCH
app.patch("/dates/occupied", async (req, res) => {
  const { occupiedDates } = req.body;
  if (!occupiedDates || !Array.isArray(occupiedDates)) {
    return res.status(400).json({ error: "Invalid occupiedDates data" });
  }

  try {
    const data = await readData();

    // Combinar y eliminar duplicados
    data.occupiedDates = Array.from(new Set([...data.occupiedDates, ...occupiedDates]));

    await writeData(data);
    res.json({ message: "Occupied dates updated successfully", occupiedDates: data.occupiedDates });
  } catch (err) {
    res.status(500).json({ error: "Error updating occupiedDates" });
  }
});


// ==========================================================================
//                                 DELETE
// ==========================================================================

// Eliminar availableDates
app.delete("/dates/available", async (req, res) => {
  try {
    const data = await readData();
    data.availableDates = [];
    await writeData(data);
    res.json({ message: "Available dates deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting availableDates" });
  }
});

// Eliminar occupiedDates
app.delete("/dates/occupied", async (req, res) => {
  try {
    const data = await readData();
    data.occupiedDates = [];
    await writeData(data);
    res.json({ message: "Occupied dates deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting occupiedDates" });
  }
});


// ==========================================================================
//                                 POST
// ==========================================================================
app.post("/dates/available", async (req, res) => {
  const { fromDate, toDate } = req.body;
  if (!fromDate || !toDate) {
    return res.status(400).json({ error: "Invalid fromDate or toDate data" });
  }

  try {
    const data = await readData();

    // Parsear las fechas en formato "YYYY-MM-DD"
    const [fromYear, fromMonth, fromDay] = fromDate.split("-");
    const from = new Date(+fromYear, fromMonth - 1, +fromDay);

    const [toYear, toMonth, toDay] = toDate.split("-");
    const to = new Date(+toYear, toMonth - 1, +toDay);

    // Generar todas las fechas en el rango
    const dates = [];
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const fecha = d.toISOString().split("T")[0]; // Obtener solo la parte YYYY-MM-DD
      dates.push(fecha);
    }

    // Combinar y eliminar duplicados
    data.availableDates = Array.from(new Set([...data.availableDates, ...dates]));

    await writeData(data);
    res.json({ message: "Available dates updated successfully", availableDates: data.availableDates });
  } catch (err) {
    res.status(500).json({ error: "Error updating availableDates" });
  }
});

app.post("/dates/occupied", async (req, res) => {
  const { fromDate, toDate } = req.body;
  if (!fromDate || !toDate) {
    return res.status(400).json({ error: "Invalid fromDate or toDate data" });
  }

  try {
    const data = await readData();

    // Parsear las fechas en formato "YYYY-MM-DD"
    const [fromYear, fromMonth, fromDay] = fromDate.split("-");
    const from = new Date(+fromYear, fromMonth - 1, +fromDay);

    const [toYear, toMonth, toDay] = toDate.split("-");
    const to = new Date(+toYear, toMonth - 1, +toDay);

    // Generar todas las fechas en el rango
    const dates = [];
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const fecha = d.toISOString().split("T")[0]; // Obtener solo la parte YYYY-MM-DD
      dates.push(fecha);
    }

    // Combinar y eliminar duplicados
    data.occupiedDates = Array.from(new Set([...data.occupiedDates, ...dates]));

    await writeData(data);
    res.json({ message: "OccupiedDates dates updated successfully", occupiedDates: data.occupiedDates });
  } catch (err) {
    res.status(500).json({ error: "Error updating occupiedDates" });
  }
});


// ==========================================================================
//                                 SERVER
// ==========================================================================

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
