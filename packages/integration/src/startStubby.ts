import { Stubby, StubbyData } from "stubby";
import { TargetPort } from "./TargetPort";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import { Endpoint } from "./Endpoint";

/**
 * @param {./TargetPort} targetPort the port to run the server on
 * @return {Promise} resolves with the endpoint the server is running on
 */

export async function startStubby({
  targetPort,
}: {
  targetPort: TargetPort;
}): Promise<Endpoint> {
  const name = `Stubby`;

  console.log(`${name}: Starting...`);

  const stubby = new Stubby();

  promisify(stubby.start).bind(stubby);

  const hostname = "127.0.0.1";

  await new Promise((resolve, reject) =>
    stubby.start(
      {
        location: hostname,
        stubs: targetPort,
        // Always start admin and TLS on ephemeral ports to avoid issues
        // when running stub API servers concurrently
        admin: 0,
        tls: 0,
        data: yaml.safeLoad(
          fs.readFileSync(path.join(__dirname, "stubbyData.yml"), "utf8")
        ) as StubbyData,
      },
      (err) => (err ? reject(`${err}`) : resolve("nay error"))
    )
  );

  process.on("SIGINT", async () => {
    await promisify(stubby.stop).bind(stubby)();

    console.log(`${name}: Stopped`);
  });

  console.log(`${name}: Ready at ${hostname}:${targetPort}`);

  return { hostname, port: targetPort };
}
