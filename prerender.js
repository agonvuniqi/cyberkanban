require('zone.js/dist/zone-node');
require('reflect-metadata');

const { join } = require('path');

const { enableProdMode } = require('@angular/core');

//Import module map for lazy loading
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

const { renderModuleFactory } = require('@angular/platform-server');

const {
    AppServerModuleNgFactory,
    LAZY_MODULE_MAP
} = require(`./dist/cyberkanban/server/main`);

const fs = require('fs-extra');

// Must manually define routes to prerender
const ROUTES = [
    '/',
    '/customers',
    '/customers',
    '/kanban',
    '/login',
];

(async function() {
    enableProdMode();
    // Get the app index
    const views = 'dist/cyberkanban/browser';
    const index = await fs.readFile(join(views, 'index.html'), 'utf8');

    // Loop over each route that is being prerendered
    for (const route of ROUTES) {
        const pageDir = join(views, route);
        await fs.ensureDir(pageDir);

        // Render with Universal
        const html = await renderModuleFactory(AppServerModuleNgFactory, {
            document: index,
            url: route,
            extraProviders: [provideModuleMap(LAZY_MODULE_MAP)]
        });

        await fs.writeFile(join(pageDir, 'index.html'), html);
    }

    process.exit();
    console.log('prerendering complete');
})();