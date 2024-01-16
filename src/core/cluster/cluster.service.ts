import { Injectable } from '@nestjs/common';
import * as baseCluster from 'cluster';
const cluster = baseCluster as unknown as baseCluster.Cluster; // typings fix
import * as os from 'os';

const cpuCores = os.cpus().length;

@Injectable()
export class ClusterService {
  static clusterize(callback): void {
    if (cluster.isPrimary) {
      console.info(`Master server started on ${process.pid}`);
      for (let i = 0; i < cpuCores; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.info(`Worker ${worker.process.pid} died. Restarting!`);
        cluster.fork;
      });
    } else {
      console.info(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
