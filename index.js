const fs = require('fs');
const xmlParser = require('fast-xml-parser');
const wgs84_ch1903 = require('./wgs84_ch1903');


fs.readFile('./input.kml', 'utf8', async (err,data) => {
  const dataParsed = await xmlParser.parse(data);
  const points = dataParsed.kml.Document.Placemark.slice(1).map((item) => {
    const id = item.description.match(/\&\id\=\d*/g)[0].replace('&id=', '');
    const name = item.description.match(/ewalks>.*<\/strong><p id=ewalkp/g)[0].replace('ewalks>', '').replace('</strong><p id=ewalkp', '');
    const coordinates = item.Point.coordinates.split(',').slice(0,2);

    const swissCoordinates = wgs84_ch1903(coordinates[1], coordinates[0], 0);
    const swissMapURL = `https://map.geo.admin.ch/?topic=ech&X=${swissCoordinates.north}&Y=${swissCoordinates.east}&zoom=5&lang=fr&bgLayer=ch.swisstopo.pixelkarte-farbe&layers=ch.bafu.alpweiden-herdenschutzhunde,ch.astra.wanderland,ch.swisstopo.swisstlm3d-wanderwege,ch.bav.haltestellen-oev,KML%7C%7Chttps:%2F%2Fwww.wandern.ch%2Fewalc%2Fimages%2Fewalk2%2F${id}%2Fgeodata%2Fgeodata_fr.xml&layers_visibility=false,false,false,false,true&layers_opacity=0.5,1,1,1,1`;

    const description = item.description
      .replace('<img src=https://www.wandern.ch/img/ewalc/popico_wtyp.png>', '')
      .replace('<img src=https://www.wandern.ch/img/ewalc/popico_dauer.png>', '<br>')
      .replace('<img src=https://www.wandern.ch/img/ewalc/popico_distanz.png>', '<br>')
      .replace('<img src=https://www.wandern.ch/img/ewalc/popico_level.png>', '<br><br>')
      .replace('<img src=http://www.wandern.ch/img/ewalc/popico_wtyp.png>', '')
      .replace('<img src=http://www.wandern.ch/img/ewalc/popico_dauer.png>', '<br>')
      .replace('<img src=http://www.wandern.ch/img/ewalc/popico_distanz.png>', '<br>')
      .replace('<img src=http://www.wandern.ch/img/ewalc/popico_level.png>', '<br><br>')
      .replace(
        'http://www.randonner.ch/index.php?pid=2311&l=fr&id=',
        `https://www.randonner.ch/fr/randonnee/nos-propositions/toutes-les-propositions?&id=${id} data-id=`
      )
      .replace('</style>', `</style><a href="${swissMapURL}">Carte</a><br><br>`);

    return {
      id,
      name,
      coordinates: item.Point.coordinates,
      description,
    }
  });

  const template = `
    <?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd">
      <Document xmlns:kml="http://earth.google.com/kml/2.1">					
        <Placemark>
          <name>Randonner.ch</name>					
        </Placemark>
        ${points.map((point) => {
          return `
            <Placemark id="id-1424">
              <name>${point.name}</name>
              <description><![CDATA[${point.description}]]></description>
              <Point>
                <coordinates>${point.coordinates}</coordinates>
              </Point>
            </Placemark>
          `;
        })}
      </Document>
    </kml>
  `;

  fs.writeFile('output.kml', template, (err) => {
    if (err) throw err;

    console.log("The file was succesfully saved!");
  }); 
});

 