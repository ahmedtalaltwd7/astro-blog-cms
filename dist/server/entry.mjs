import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_J6z-XWBS.mjs';
import { manifest } from './manifest_C122l67F.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/delete-post.astro.mjs');
const _page3 = () => import('./pages/api/get-post.astro.mjs');
const _page4 = () => import('./pages/api/list-posts.astro.mjs');
const _page5 = () => import('./pages/api/save-post.astro.mjs');
const _page6 = () => import('./pages/blog/new-phhost.astro.mjs');
const _page7 = () => import('./pages/blog/new-poccst.astro.mjs');
const _page8 = () => import('./pages/blog/new-poggggst.astro.mjs');
const _page9 = () => import('./pages/blog/new-posgggt.astro.mjs');
const _page10 = () => import('./pages/blog/new-posjjjt.astro.mjs');
const _page11 = () => import('./pages/blog/new-post.astro.mjs');
const _page12 = () => import('./pages/blog/new-post1.astro.mjs');
const _page13 = () => import('./pages/blog/new-post111.astro.mjs');
const _page14 = () => import('./pages/blog/newbbb-post.astro.mjs');
const _page15 = () => import('./pages/blog/_slug_.astro.mjs');
const _page16 = () => import('./pages/blog.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/api/delete-post.js", _page2],
    ["src/pages/api/get-post.js", _page3],
    ["src/pages/api/list-posts.js", _page4],
    ["src/pages/api/save-post.js", _page5],
    ["src/pages/blog/new-phhost.md", _page6],
    ["src/pages/blog/new-poccst.md", _page7],
    ["src/pages/blog/new-poggggst.md", _page8],
    ["src/pages/blog/new-posgggt.md", _page9],
    ["src/pages/blog/new-posjjjt.md", _page10],
    ["src/pages/blog/new-post.md", _page11],
    ["src/pages/blog/new-post1.md", _page12],
    ["src/pages/blog/new-post111.md", _page13],
    ["src/pages/blog/newbbb-post.md", _page14],
    ["src/pages/blog/[slug].astro", _page15],
    ["src/pages/blog/index.astro", _page16],
    ["src/pages/index.astro", _page17]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/Ahmed%20Talal/Desktop/astro-blog/dist/client/",
    "server": "file:///C:/Users/Ahmed%20Talal/Desktop/astro-blog/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
