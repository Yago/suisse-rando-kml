# Swiss Rando KML generator for Google map

Will generate a KML file from Suisse Rando paths propositions.

## Get the input.kml

1. Go to https://www.randonner.ch/fr/randonnee/nos-propositions/toutes-les-propositions
2. Click on “See the map on map.geo.admin.ch”
3. In your URL bar, copy the ID at the end, just before .kml
4. Open the following URL on your browser : `https://www.randonner.ch/tmp/kml/[ID_HERE].kml`
5. Save a `input.kml` in your project directory

## Generate output.kml

1. `$ npm install`
2. `$ npm run start`
3. Use the output.kml on Google Map for example