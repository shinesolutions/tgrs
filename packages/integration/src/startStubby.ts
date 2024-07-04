import { Stubby, StubbyData } from "stubby";
import { TargetPort } from "./TargetPort";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import { RunningServer } from "./RunningServer";
import { getEndpoint } from "./getEndpoint";

/**
 * @param {./TargetPort} targetPort the port to run the server on
 * @return {Promise} resolves with the endpoint the server is running on
 */

export async function startStubby({
  targetPort, // 0
}: {
  targetPort: TargetPort;
}): Promise<RunningServer> {
  const name = `Stubby`;

  console.log(`${name}: Starting...`);

  const stubby = new Stubby();

  promisify(stubby.start).bind(stubby);

  await new Promise((resolve, reject) =>
    stubby.start(
      {
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

  const stop = promisify(stubby.stop).bind(stubby);  
  process.on("SIGINT", async () => {
    await stop();

    console.log(`${name}: Stopped`);
  });

  const endpoint = getEndpoint(stubby.stubsPortal);

  console.log(`${name}: Ready at ${endpoint.hostname}:${endpoint.port}`);

  return { stop, endpoint };
}
