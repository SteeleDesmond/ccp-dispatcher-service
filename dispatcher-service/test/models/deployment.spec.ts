import { DeploymentModel } from '../../src/models/deployment';
import { v4 as uuidv4 } from 'uuid';
const mongoose = require('mongoose');


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

describe('Deployment Model Test', () => {

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  it('should create & save a deployment successfully', async () => {
    deploymentData.transactionId = uuidv4();
    const validDeployment = new DeploymentModel(deploymentData);
    const savedDeployment = await validDeployment.save();

    expect(savedDeployment._id).toBeDefined();
    expect(savedDeployment.transactionId).toBeDefined();
    savedDeployment.data.cluster.nodes.forEach(node => { expect(node).toBeDefined() });
    // expect(savedDeployment.data.cluster.nodes).toContain('name');
  });

  // You shouldn't be able to add in any field that isn't defined in the schema
  it('should insert deployment successfully, but a field not defined in the schema should be undefined', async () => {
    // const deploymentDataCopy = JSON.parse(JSON.stringify(deploymentData));
    // deploymentData.invalidField = 'testValue';
    deploymentData.transactionId = uuidv4();
    const deploymentWithInvalidField = new DeploymentModel(deploymentData);

    const savedDeploymentWithInvalidField = await deploymentWithInvalidField.save();

    expect(savedDeploymentWithInvalidField._id).toBeDefined();
    expect(savedDeploymentWithInvalidField.invalidField).toBeUndefined();
  });

  it('should create deployment without required field and fail', async () => {
    const deploymentWithoutRequiredField = new DeploymentModel({ apiVersion: '1.0.0' });

    let err;
    try {
      const savedDeploymentWithoutRequiredField = await deploymentWithoutRequiredField.save();
      err = savedDeploymentWithoutRequiredField;
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(err.errors.transactionId).toBeDefined();
  });
});