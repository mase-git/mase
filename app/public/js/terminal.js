let content = {
  help: 'Welcome to the Mario Sessa (MaSe) portal. You can explore everything about me here.\n\nThe current list of command are currently available in this version:\n\n- help\n- ipconfig \n- whoami \n- curriculum \n- project\n\nFor more information about the command usage, digit: "[command] --help"\n\nIf you want to let me a feedback, please digit "feedback" and write some comments there. Thank you.\n',
  project: {
    help: '\tinfo: this command is used to list, check and go to my personal and professional projects.\n\n\tusage: project [options] [-p] <projectname> [--verbose] [parameters]\n\n\toptions:\n\t\tlist\n\t\tcheck\n\t\tgoto\n\n\texamples:\n\t\tproject list \n\t\tproject check -p <projectname>\n\t\tproject check -p <projectname> --verbose\n\t\tproject goto -p <projectname>\n\nYou can\'t understand how to use commands? Please check the guidelines with "man" digits.\n',
    list: "",
    check: "",
    goto: "",
  },
  ipconfig: "",
  hackme: "",
};

function parseArgs(args) {
  return args.split(/\s+/);
}

async function getContent() {
  if (!content) {
    await fetch(
      "https://mase-static-content.s3.eu-central-1.amazonaws.com/content.json",
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        content = data;
        return true;
      })
      .catch((err) => {
        console.error(
          "Error during processing content download: " + err.message || err
        );
        return false;
      });
  }
  return true;
}

async function checkCommandInput(args) {
  if (args && args.length > 0) {
    return (await getContent()) ? args[0] in content : false;
  } else return false;
}

// Terminal content
const term = $("#terminal").terminal(
  async function (cmd) {
    try {
      let args = parseArgs(cmd);
      if (args && args.length > 0) {
        if (await checkCommandInput(args)) {
          switch (args[0]) {
            case "help":
              {
                try {
                  this.echo(content.help);
                } catch (e) {
                  this.echo(
                    'Terminal currently is not available for the command "help"'
                  );
                }
              }
              break;
            case "quit":
              {
                this.exec("close", true);
              }
              break;
            case "project":
              {
                if (args.length > 1) {
                  let command = args[1];
                  switch (command) {
                    case "--help":
                      this.echo("PROJECT(8)\n").echo(
                        content["project"]["help"]
                      );
                      break;
                    case "list":
                      this.echo(content["project"]["list"]);
                      break;
                    case "check":
                      {
                        if (args.length > 2) {
                          try {
                            // TODO
                            // fetching data from the AWS backend
                            // if args[2] is a project, display the project info else return ann error message
                          } catch (e) {
                            this.echo(
                              'Terminal currently is not available for the command "project check"'
                            );
                          }
                        } else {
                          this.echo(
                            'Wrong usage of the command "project check". Read the help documentation.'
                          ).echo(content["project"]["help"]);
                        }
                      }
                      break;
                    case "goto":
                      {
                        // TODO
                        // not implemented yet
                      }
                      break;
                    default:
                      this.echo(
                        'Command options is not available for the "project" command.'
                      ).echo(content["project"]["help"]);
                  }
                } else {
                  this.echo('Wrong usage for the command "project".');
                  this.echo(content["project"]["help"]);
                }
              }
              break;
            case "ipconfig":
              {
                await fetch("https://api.ipify.org?format=json")
                  .then((response) => response.json())
                  .then((data) => this.echo("IP: " + data.ip))
                  .catch((err) =>
                    this.echo("Error during the ipconfig command processing.")
                  );
              }
              break;
            default: {
              this.echo(
                "Command: " +
                  args[0] +
                  ' not found. Try with "help" and check the current format.'
              );
            }
          }
        } else {
          this.echo(
            args[0] +
              ' not found. Try with "help" to check the available commands.'
          );
        }
      } else {
        this.echo(
          'Void command detected, digit "help" to check the correct format.'
        );
      }
    } catch (e) {
      this.echo(
        'Error during command processing, digit "help" to check the correct format.'
      );
    }
  },
  {
    prompt: "[[;green;]guest@mase$ ]",
    greetings:
      "Welcome to: \n" +
      "____    ____       _       ______   ________       \n" +
      "|_   \\  /   _|     / \\    .' ____ \\ |_   __  |   \n" +
      "  |   \\/   |      / _ \\   | (___ \\_|  | |_ \\_|  \n" +
      "  | |\\  /| |     / ___ \\   _.____`.   |  _| _    \n" +
      " _| |_\\/_| |_  _/ /   \\ \\_| \\____) | _| |__/ |  \n" +
      "|_____||_____||____| |____|\\______.'|________|\n" +
      "\nThis is a personal portal where you can see everything about me, Mario. \n" +
      'Digit "help" to see more information about how to use my portal.\n',
  }
);

// github('jcubic/jquery.terminal');
