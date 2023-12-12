
# Agent CLI for Lagoon

![lagoon-agent](https://repository-images.githubusercontent.com/730726082/b810de2b-0596-418c-83c2-4b94c665e680)

> lagoon-agent is a tool that allows automatic interaction with [Lagoon](https://fatfi.sh/lagoon) to push and update hardware metadata.

Lagoon is developed by [Fatfish Lab](https://fatfi.sh)

```shell
./lagoon-agent hardware push --conf lagoon-agent.conf
```

## Installation
This agent is compatible with Windows, Linux and Macos. There are no installation process, lagoon-agent is a standalone CLI.

Check out the [releases section](https://github.com/fatfish-lab/lagoon-agent/releases) to download the latest version.

## Documentation

You can display the lagoon-agent document from the CLI, using the flag `-h`.

```shell
./lagoon-agent -h
```

> [!TIP]
> More information regarding the configuration file are available in your Lagoon interface. You can execute the command `lagoon-agent login` to gain access to those informations.

```shell
Usage:   lagoon-agent
Version: 1.0.0

Description:

  Lagoon's agent - Push automatically your hardware on Lagoon

Options:

  -h, --help              - Show this help.
  -V, --version           - Show the version number for this program.
  -d, --debug    [debug]  - enable debug                               (Values: "INFO", "WARNING", "ERROR", "DEBUG", 0, 1, 2, 3)
  -c, --conf     <file>   - load configuration from file

Commands:

  login     - Login the agent on your Lagoon.
  hardware  - Manage your hardware on Lagoon.

Environment variables:

  LAGOON_DEBUG         <debug>        - Enable debug
  LAGOON_URL           <url>          - Define Lagoon instance url
  LAGOON_DOMAIN        <domain>       - Specify the domain used for unauthenticated requests. Mainly for Lagoon Fatfish
                                        Lab dev or local Lagoon server without DNS redirection
  LAGOON_TOKEN         <token>        - Use an existing token to authenticate Lagoon agent
  LAGOON_BOTKEY        <botkey>       - Define the bot key used to authenticate Lagoon agent
  LAGOON_BOTSECRET     <botsecret>    - Define the bot secret used to authenticate Lagoon agent
  LAGOON_HARDWARE_KEY  <hardwareKey>  - Define the location of hardware on Lagoon
```

## Maintainer

The repository is maintained by [Fatfish Lab](https://fatfi.sh)

## Support

You can contact our team at [support@fatfi.sh](mailto:support@fatfi.sh).

## Development

lagoon-agent is using [Deno](https://deno.com/), a secured, efficient and typescript JavaScript runtime.

1. [Install Deno](https://deno.com/manual/getting_started/installation)
2. Clone this repository
3. Happy coding !
   1. If you are looking for assistance, contact us [support@fatfi.sh](mailto:support@fatfi.sh) or [join our community](https://fatfi.sh/community)

### How to test my code ?

We added a [Deno task](https://docs.deno.com/runtime/manual/tools/task_runner) `deno task dev` in this repository. So you need to replace `lagoon-agent` by `deno task dev`.

Here are some examples :

> Show lagoon-agent help: `deno task dev -h`
>
> Show hardware metadata: `deno task dev hardware show`


### Debug with VSCode

If you develop under [VSCode](https://code.visualstudio.com/), we provide a `launch.example.json`.

1. Duplicate `.vscode/launch.example.json` and rename to `.vscode/launch.json`
2. If `deno` is not in your path, replace `"runtimeExecutable" : "deno"` by `"runtimeExecutable" : "path/to/bin/deno"`
3. Replace `lagoon-agent.conf` by the full path of your Lagoon configuration file.
4. From VSCode debug tab, launch the task `Hardware push`

## How to build from my code ?

We added a [Deno task](https://docs.deno.com/runtime/manual/tools/task_runner) `deno task build` in this repository. Just run `deno task build` to build for all plateforms. If you are looking to build only for a specific platform you wan use `deno task build:windows` to only build for windows.

Feel free to adapt the build commands to your needs. They are located into the [deno.json file](https://github.com/fatfish-lab/lagoon-agent/blob/main/deno.json).

## Licence

This project uses the following license: GPL-3.0-only.
See the license file to read it.

