import { createServer, request as forward } from "node:http";
import { readFile } from "node:fs/promises";
import type { AddressInfo } from "node:net";

// Test-only proxy: Astro's static preview does not apply the hosting platform's
// _redirects file. Exercise those built rules over HTTP without claiming a live deployment.
export async function startRedirectHost(upstream: string, directory: string) {
  const rules = (await readFile(`${directory}/_redirects`, "utf8"))
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/));
  const server = createServer((incoming, outgoing) => {
    const url = new URL(incoming.url!, "http://127.0.0.1");
    const rule = rules.find(([from]) => from === url.pathname);
    if (rule) {
      outgoing.writeHead(Number(rule[2]), { Location: rule[1] + url.search });
      outgoing.end();
      return;
    }
    const target = new URL(url.pathname + url.search, upstream);
    const proxy = forward(
      target,
      {
        method: incoming.method,
        headers: { ...incoming.headers, host: target.host },
      },
      (response) => {
        outgoing.writeHead(response.statusCode!, response.headers);
        response.pipe(outgoing);
      },
    );
    proxy.on("error", () => {
      outgoing.writeHead(502);
      outgoing.end();
    });
    incoming.pipe(proxy);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    url: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.closeAllConnections();
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}
