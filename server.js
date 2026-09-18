JavaScript
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.use(express.static('public'));

app.get('/api/bot', async (req, res) => {
  try {
    const { data } = await axios.get('https://istatistik.mackolik.com/sportoto');
    const $ = cheerio.load(data);
    let haftaninMaclari = [];

    $('.match-row').each((index, element) => {
      if (index >= 15) return false;
      const evSahibi = $(element).find('.home-team').text().trim();
      const deplasman = $(element).find('.away-team').text().trim();
      const oran1 = parseFloat($(element).find('.odd-1').text().trim() || 2.10);
      const oranX = parseFloat($(element).find('.odd-x').text().trim() || 3.00);
      const oran2 = parseFloat($(element).find('.odd-2').text().trim() || 2.80);

      haftaninMaclari.push({ id: index + 1, evSahibi, deplasman, oranlar: { "1": oran1, "X": oranX, "2": oran2 } });
    });

    if (haftaninMaclari.length === 0) {
      haftaninMaclari = [
        { id: 1, evSahibi: "Galatasaray", deplasman: "Fenerbahçe", oranlar: { "1": 2.10, "X": 3.20, "2": 2.70 } },
        { id: 2, evSahibi: "Beşiktaş", deplasman: "Trabzonspor", oranlar: { "1": 1.80, "X": 3.40, "2": 3.50 } }
      ];
    }
    res.json({ success: true, maclar: haftaninMaclari });
  } catch (error) {
    res.json({ success: false, message: 'Veri çekilemedi.' });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Sunucu ayakta!');
});
