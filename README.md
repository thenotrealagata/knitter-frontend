# Knitter

This repo contains the frontend for my stitch dictionary application. In both machine and hand knitting, the knitted fabric is created by forming loops. The way these loops are worked influences the resulting fabric, providing the opportunity to work cable, lace or colorwork designs. A knitting chart visualizes this: it is read from the bottom right corner, (mostly) right to left.

Each square on the chart symbolizes 1 stitch and how it is worked. There are many different approaches to these symbols, I mostly adhered to the Craft Yarn Council's recommendations. This application allows for the creation of:
- Cable designs
- Lace designs
- Colorwork designs (with up to 4 contrast colors)
- Knit/purl designs

Smaller units of these designs (charts) can be composed into larger designs (panels) using the panel editor function.

The backend repo is available [here](https://github.com/thenotrealagata/knitter-backend). A demo of this frontend (with limited functionality) can be found [here](https://thenotrealagata.github.io/knitter-frontend/).

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.