import { defineConfig } from '@playwright/test';
import config from '../../playwright.config';
export default defineConfig({
 ...config,
 testDir: `${process.cwd()}/tests/e2e`,
 use: {...config.use, baseURL:'http://127.0.0.1:4327', channel:'msedge'},
 projects: config.projects?.filter(p=>['desktop','mobile'].includes(p.name!)),
 webServer:undefined,
 reporter:[['list']],
});
