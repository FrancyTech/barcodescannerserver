const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 80; // Porta HTTP

// Middleware per il parsing dei body in formato JSON
app.use(express.json());

// Endpoint per aggiungere un codice al file JSON
app.get('/add-code', (req, res) => {
  const { code } = req.query;

  // Se il parametro ?code è presente nella richiesta
  if (code) {
    // Leggi il file JSON
    fs.readFile('codes.json', (err, data) => {
      if (err) {
        console.error('Errore nella lettura del file JSON:', err);
        return res.status(500).send('Errore del server');
      }

      let codes = JSON.parse(data);

      // Aggiungi il codice all'array dei codici
      codes.push(code);

      // Scrivi i codici aggiornati nel file JSON
      fs.writeFile('codes.json', JSON.stringify(codes), (err) => {
        if (err) {
          console.error('Errore nella scrittura del file JSON:', err);
          return res.status(500).send('Errore del server');
        }

        res.status(200).send('Codice aggiunto con successo');
      });
    });
  } else {
    res.status(400).send('Parametro ?code mancante nella richiesta');
  }
});

// Endpoint per visualizzare tutti i codici
app.get('/codes', (req, res) => {
  // Leggi il file JSON
  fs.readFile('codes.json', (err, data) => {
    if (err) {
      console.error('Errore nella lettura del file JSON:', err);
      return res.status(500).send('Errore del server');
    }

    const codes = JSON.parse(data);

    // Costruisci una lista HTML dei codici
    const codesList = codes.map((code) => `<li>${code}</li>`).join('');

    // Costruisci una pagina HTML per visualizzare i codici
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Codici</title>
      </head>
      <body>
        <h1>Elenco Codici</h1>
        <ul>${codesList}</ul>
        <p><strong>Totale:</strong> ${codes.length}</p>
      </body>
      </html>
    `;

    res.status(200).send(htmlResponse);
  });
});

// Avvio del server HTTP
app.listen(PORT, () => {
  console.log(`Server avviato su porta ${PORT}`);
});
