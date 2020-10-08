import {Container} from 'typescript-ioc';
import {OpenShiftWorker} from '../../src/workers';
import {OpenShiftWorkerConfig} from '../../src/config/environment-worker.config';
import { v4 as uuidv4 } from 'uuid';
import Mock = jest.Mock;
import {LoggerApi, NoopLoggerService} from '../../src/logger';
import { Deployment } from '../../src/models/deployment';

const deploymentData = {
  invalidField: 'testValue',
  apiVersion: "2.0.0",
  transactionId: uuidv4(),
  status: "Running",
  data: {
    request: {
      firstName: "Steele",
      lastName: "Desmond",
      email: "steele.desmond@ibm.com",
      slack: "Steele Desmond"
    },
    vSphere: {
      username: "test-user-c",
      password: "*****",
      folderName: "sdesmond20",
      resourcePool: "sdesmond20",
      resourcePoolId: "resgroup-81133",
      datastore: "CCP-vsanDatastore"
    },
    cluster: {
      name: "sdesmond",
      version: "4.3.5",
      size: "s",
      nodes: [
        {
          vmName: "sd-ocp-4_3_5-sdesmond-bootstrap",
          role: "bootstrap",
          templatePath: "Templates/CSPLAB-Supported/rhcos-4.3.8-x86_64-vmware.x86_64",
          moRefId: "vm-4483",
          macAddress: "00:50:56:bf:fd:21",
          cpu: 4,
          memory: 16,
          disk: 128,
          ipAddress: "172.18.21.5",
          dnsName: [
            "bootstrap.vhtest33.ocp.csplab.local"
          ],
          lb: {
            pool: "test-icontrol-controlPool",
            server: "test-icontrol-controlLb"
          }
        },
        {
          vmName: "sd-ocp-4_3_5-sdesmond-control-plane-0",
          role: "controlPlane",
          templatePath: "Templates/CSPLAB-Supported/rhcos-4.3.8-x86_64-vmware.x86_64",
          moRefId: "vm-4483",
          macAddress: "00:50:56:bf:96:35",
          cpu: 4,
          memory: 64,
          disk: 128,
          ipAddress: "172.18.21.4",
          dnsName: [
            "etcd-0.vhtest33.ocp.csplab.local",
            "control-plane-0.vhtest33.ocp.csplab.local"
          ],
          lb: {
            pool: "test-icontrol-controlPool",
            server: "test-icontrol-controlLb"
          }
        },
        {
          vmName: "sd-ocp-4_3_5-sdesmond-control-plane-1",
          role: "controlPlane",
          templatePath: "Templates/CSPLAB-Supported/rhcos-4.3.8-x86_64-vmware.x86_64",
          moRefId: "vm-4483",
          macAddress: "00:50:56:bf:54:af",
          cpu: 4,
          memory: 64,
          disk: 128,
          ipAddress: "172.18.21.3",
          dnsName: [
            "etcd-1.vhtest33.ocp.csplab.local",
            "control-plane-1.vhtest33.ocp.csplab.local"
          ],
          lb: {
            pool: "test-icontrol-controlPool",
            server: "test-icontrol-controlLb"
          }
        },
        {
          vmName: "sd-ocp-4_3_5-sdesmond-control-plane-2",
          role: "controlPlane",
          templatePath: "Templates/CSPLAB-Supported/rhcos-4.3.8-x86_64-vmware.x86_64",
          moRefId: "vm-4483",
          macAddress: "00:50:56:bf:41:b3",
          cpu: 4,
          memory: 64,
          disk: 128,
          ipAddress: "172.18.21.2",
          dnsName: [
            "etcd-2.vhtest33.ocp.csplab.local",
            "control-plane-2.vhtest33.ocp.csplab.local"
          ],
          lb: {
            pool: "test-icontrol-controlPool",
            server: "test-icontrol-controlLb"
          }
        },
        {
          vmName: "sd-ocp-4_3_5-sdesmond-compute-0",
          role: "compute",
          templatePath: "Templates/CSPLAB-Supported/rhcos-4.3.8-x86_64-vmware.x86_64",
          moRefId: "vm-4483",
          macAddress: "00:50:56:bf:af:cb",
          cpu: 4,
          memory: 16,
          disk: 128,
          ipAddress: "172.18.21.7",
          dnsName: [
            "compute-0.vhtest33.ocp.csplab.local"
          ],
          lb: {
            pool: "test-icontrol-computePool",
            server: "test-icontrol-computeLb"
          }
        },
        {
          vmName: "sd-ocp-4_3_5-sdesmond-compute-1",
          role: "compute",
          templatePath: "Templates/CSPLAB-Supported/rhcos-4.3.8-x86_64-vmware.x86_64",
          macAddress: "00:50:56:bf:ab:7e",
          cpu: 4,
          memory: 16,
          disk: 128,
          ipAddress: "172.18.21.6",
          dnsName: [
            "compute-1.vhtest33.ocp.csplab.local"
          ],
          lb: {
            pool: "test-icontrol-computePool",
            server: "test-icontrol-computeLb"
          }
        },
        {
          vmName: "sd-ocp-4_3_5-sdesmond-compute-2",
          role: "compute",
          templatePath: "Templates/CSPLAB-Supported/rhcos-4.3.8-x86_64-vmware.x86_64",
          moRefId: "vm-4483",
          macAddress: "00:50:56:bf:15:59",
          cpu: 4,
          memory: 16,
          disk: 128,
          ipAddress: "172.18.21.10",
          dnsName: [
            "compute-2.vhtest33.ocp.csplab.local"
          ],
          lb: {
            pool: "test-icontrol-computePool",
            server: "test-icontrol-computeLb"
          }
        },
        {
          vmName: "sd-ocp-4_3_5-sdesmond-storage-0",
          role: "storage",
          templatePath: "Templates/CSPLAB-Supported/rhcos-4.3.8-x86_64-vmware.x86_64",
          moRefId: "vm-4483",
          macAddress: "00:50:56:bf:20:8d",
          cpu: 4,
          memory: 16,
          disk: 200,
          ipAddress: "172.18.21.8",
          dnsName: [
            "storage-0.vhtest33.ocp.csplab.local"
          ],
          lb: {
            pool: "test-icontrol-computePool",
            server: "test-icontrol-computeLb"
          }
        },
        {
          vmName: "sd-ocp-4_3_5-sdesmond-storage-1",
          role: "storage",
          templatePath: "Templates/CSPLAB-Supported/rhcos-4.3.8-x86_64-vmware.x86_64",
          moRefId: "vm-4483",
          macAddress: "00:50:56:bf:ac:4d",
          cpu: 4,
          memory: 16,
          disk: 200,
          ipAddress: "172.18.21.9",
          dnsName: [
            "storage-1.vhtest33.ocp.csplab.local"
          ],
          lb: {
            pool: "test-icontrol-computePool",
            server: "test-icontrol-computeLb"
          }
        },
        {
          vmName: "sd-ocp-4_3_5-sdesmond-storage-2",
          role: "storage",
          templatePath: "Templates/CSPLAB-Supported/rhcos-4.3.8-x86_64-vmware.x86_64",
          moRefId: "vm-4483",
          macAddress: "00:50:56:bf:29:c8",
          cpu: 4,
          memory: 16,
          disk: 200,
          ipAddress: "172.18.21.11",
          dnsName: [
            "storage-2.vhtest33.ocp.csplab.local"
          ],
          lb: {
            pool: "test-icontrol-computePool",
            server: "test-icontrol-computeLb"
          }
        }
      ],
      subdomain: "vhtest33.ocp.csplab.local",
      subnetCidr: "172.18.21.0/27",
      gatewayCidr: "172.18.21.1/27",
      consoleURI: "dummy-uri",
      interface: "eth1",
      ignition: {
        bootstrap: "dummy-bootstrap-ignition-base64-string",
        controlPlane: "dummy-master-ignition-base64-string",
        compute: "dummy-bootstrap-ignition-base64-string"
      }
    }
  },
};
var buildData = {
  password: 'password',
  task: 'deployCluster'
};

var deployment = new Deployment(deploymentData, buildData);

describe('openshift.worker', () => {
  test('canary verifies test infrastructure', () => {
      expect(true).toEqual(true);
  });

  describe('given OpenShiftWorker', () => {
    let worker: OpenShiftWorker;
    let writeLogMock: Mock;
    beforeEach(() => {
      // Container
        // .bind(OpenShiftWorkerConfig)
        // .factory(() => ({runInterval: 500}));

      Container
        .bind(LoggerApi)
        .to(NoopLoggerService);

      worker = Container.get(OpenShiftWorker);
      // writeLogMock = worker.writeLog = jest.fn();
    });

    afterEach(() => {
      return worker.stop();
    });

    context('when started', () => {
      test('then run until stopped', async () => {
        //TODO Properly write new test for worker start
        // const observable = worker.start(); 

        await promiseTimeout(() => {return}, 600);

        await worker.stop().toPromise();

        // await observable.toPromise();
        expect(writeLogMock).toHaveBeenCalledTimes(2);
      });

      context('and when start() called again', () => {
        test('then should return same observable', async () => {
          // const observable = worker.start();

          // expect(worker.start()).toBe(observable);

          await worker.stop().toPromise();
        });
      });
    });
  });
});

async function promiseTimeout<T>(fn: () => T, timeout: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, timeout);
  });
}
