import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as fs from 'fs';
import * as os from 'os';

// AMI
const ami = aws.ec2.getAmi({
  mostRecent: true,
  filters: [
    {
      name: 'name',
      values: ['amzn2-ami-kernel-5.10-hvm-2.0.20220606.1-x86_64-gp2'],
    },
    {
      name: 'virtualization-type',
      values: ['hvm'],
    },
  ],
});

// SSH key
// Open and read ~/.ssh/id_rsa.pub
const homedir = os.homedir();
const sshPubKey = fs.readFileSync(`${homedir}/.ssh/id_rsa.pub`, 'utf8');
const deployer = new aws.ec2.KeyPair('deployer', {
  publicKey: sshPubKey,
});

// Init script
// Open and read ../.env
const envFile = fs.readFileSync('../.env', 'utf8');

const deployScript = `
#!/bin/bash

mkdir -p /opt/app
cd /opt/app

# deps
amazon-linux-extras install docker -y
systemctl enable docker
systemctl start docker

yum install git vim -y

# clone
git clone https://github.com/jordanbertasso/discord-verify-v3.git
cd discord-verify-v3

# .env
cat << EOF > .env
${envFile}
EOF

# docker-compose
curl -SL https://github.com/docker/compose/releases/download/v2.7.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose


docker-compose up -d
`;

// EC2 instance
const web = new aws.ec2.Instance('web', {
  ami: ami.then((ubuntu) => ubuntu.id),
  instanceType: 't3.medium',
  keyName: deployer.keyName,
  userData: deployScript,
  userDataReplaceOnChange: true,
  tags: {
    service: 'discord-verify',
  },
});

// Export the ip of the instance
export const instanceIP = web.publicIp;
