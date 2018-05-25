# Kinesis LND Engine

<img src="https://kines.is/logo.png" alt="Kinesis Exchange" width="550">

[![CircleCI](https://circleci.com/gh/kinesis-exchange/lnd-engine.svg?style=svg&circle-token=47c81b3a717f062885f159dfded078e134413db1)](https://circleci.com/gh/kinesis-exchange/lnd-engine)

The following repo contains 2 modules that make up a `Kinesis Engine`:

1. NPM module w/ LND abstraction layer (located in `src`)
2. Dockerfiles for all containers needed for the LND Engine to work correctly

Our current docker setup consists of the following containers:

- roasbeef/BTCD - Headless daemon to interact with blockchain (no wallet in this package)
- LND - Lightning Network Daemon + Wallet
- repl - an interactive shell for using the lnd-engine stack

#### Getting Started

```
npm i
npm run build
npm test
```

You can access the repl through `docker-compose run repl npm run c` and view all available commands with `commands`

#### Development Installation

In order to use the lnd-engine in your project, follow the steps below:

Copy the docker files from this repo and put them into a `docker` folder at the root of your project (this assumes that your `docker-compose` file is also at the root of your project directory. Then, add the following references to your `docker-compose` file.

NOTE: This code is ONLY supported in docker versions 2.x. Docker 3 does not support `extends` and is incompatible with the lnd-engine

```
# These services are imported from the lnd-engine
lnd_btc:
  build:
    context: ./docker
  depends_on:
    - btcd
  extends:
    file: ./docker/lnd-docker-compose.yml
    service: lnd_btc

btcd:
  build:
    context: ./docker
  extends:
    file: ./docker/lnd-docker-compose.yml
    service: btcd
```

Then add the following to your gitignore file:

```
# lnd-engine docker files
docker/lnd
docker/btcd
docker/lnd-repl
docker/lnd-docker-compose.yml
docker/*.md
```


### IMPORTANT ABOUT SSL:

- Node GRPC does not support the same certs that are generated by LND, so we have to modify the lnd_btc.sh script to accomadate this
- lnd_btc needs to listen on port `0.0.0.0` for RPC or is will never reach out of the docker container
- There are GRPC_SSL_CIPHER lists that need to be updated for grpc to recongnize the certs used by LND#

```
Beware that lnd autogenerated certificates are not compatible with current NodeJS gRPC module implementation.

Lnd uses the P-521 curve for its certificates but NodeJS gRPC module is only compatible with certificates using the P-256 curve (link).

You need to generate your own lnd certificates using the following commands (thanks to Alex Akselrod for helping me on this):

# Enter the Lnd home directory, located by default at ~/.lnd on Linux or
# /Users/[username]/Library/Application Support/Lnd/ on Mac OSX
# $APPDATA/Local/Lnd on Windows. Also change '/CN=localhost/O=lnd' to '//CN=localhost\O=lnd' if you are using Git Bash.
cd ~/.lnd
openssl ecparam -genkey -name prime256v1 -out tls.key
openssl req -new -sha256 -key tls.key -out csr.csr -subj '/CN=localhost/O=lnd'
openssl req -x509 -sha256 -days 36500 -key tls.key -in csr.csr -out tls.cert
rm csr.csr
```

More Info: [lncli issue](https://github.com/mably/lncli-web/issues/121) && [cipher](https://github.com/lightningnetwork/lnd/issues/861#issuecomment-373811976)

### Troubleshooting SSL

Using `GRPC_VERBOSITY=DEBUG` and `GRPC_TRACE=all` on the relayer is our best friend

You can dive into the connections inside of a container w/ the following commands:

```
openssl s_client -connect lnd_btc:10009 -prexit

apt-get update && apt-get install tcpdump
tcpdump port 10009 and '(tcp-syn|tcp-ack)!=0'

curl --cacert /secure/tls.cert https://lnd_btc:10009 -v
```

# API

```
getBalances
getTotalBalance
getUnconfirmedBalance
getConfirmedBalanace
getUncommittedBalance
getCommittedBalance

createNewAddress()
createInvoice()
createChannel(host, publicKey)

getPublicKey()
getInvoice(rHash)
getInvoices({ pendingOnly: true })
getInvoices()

isAvailable
```


