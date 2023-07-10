let content = {
  help: 'Welcome to the Mario Sessa (MaSe) portal. You can explore everything about me here.\n\nThe current list of command are currently available in this version:\n\n- help\n- ipconfig \n- whoami \n- cd \n- ls \n- cat\n\nFor more information about the command usage, digit: "[command] --help"\n\nIf you want to let me a feedback, please digit "feedback" and write some comments there. Thank you.\n',
  cat: "",
  cd: "",
  ls: {
    help: "LS(1)                       General Commands Manual                      LS(1)\n\nNAME\n\t\tls – list directory contents\n\nSYNOPSIS\n\t\tls [-@ABCFGHILOPRSTUWabcdefghiklmnopqrstuvwxy1%,] [--color=when]\n\t\t[-D format] [file ...]\n\nDESCRIPTION\n\t\tFor each operand that names a file of a type other than directory, ls\n\t\tdisplays its name as well as any requested, associated information.  For\n\t\teach operand that names a file of type directory, ls displays the names\n\t\tof files contained within that directory, as well as any requested,\n\t\tassociated information.\n\n",
    filenames: ["about.md", "project.txt", "curriculum.txt", "hackme.txt"],
  },
  ipconfig: "",
};

function parseArgs(args) {
  return args.trimStart().split(/\s+/);
}

function parseHelp(self) {
  try {
    self.echo(content.help);
  } catch (e) {
    self.echo('Terminal currently is not available for the command "help"');
  }
}

function displayDirectory(self) {
  let string = "";
  let i = 0;
  content["ls"]["filenames"].forEach((el) =>{
    if(i % 5 == 0 && i != 0){
      string += "\n";
    }
    string += el + "\t\t";
    i++;
    if(i == content["ls"]["filenames"].length){
      string = string.substring(0, string.length - 2)
    }
  })
  self.echo(string);
}

function parseLs(self, args) {
  if (args && args.length == 2) {
    switch (args[1]) {
      case "--help":
        self.echo(content["ls"]["help"]);
        break;
      default:
        const characters = "-@ABCFGHILOPRSTUWabcdefghiklmnopqrstuvwxy1%";
        const string = args[1];

        if (
          string.startsWith("-") &&
          string.match(new RegExp(`[${characters}]`))
        ) {
          displayDirectory(self); // bored to support every display modes.
        }
    }
  } else if (args && args.length == 1) {
    displayDirectory(self); // default command 
  } else {
    throw new Error("Invalid command");
  }
}

function displayIpInfo(self, data) {
  try {
    self.echo(data["ip"]);
  } catch (e) {
    self.echo("ipconfig is not available, please try another command.");
  }
}

async function parseIpConfig(self) {
  await fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => displayIpInfo(self, data))
    .catch((err) => self.echo("Error during the ipconfig command processing."));
}

function checkVoidCommand(self, args){
  {
    console.log('It is: ' + args[0])
    if(/^[\t\n\s]*$/.test(args[0])){
      // void command 
    } else {
      self.echo(
        "Command: " +
          args[0] +
          ' not found. Try with "help" and check the current format.'
      );
    }
  }
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
              parseHelp(this);
              break;
            case "ls":
              parseLs(this, args);
              break;
            case "ipconfig":
              await parseIpConfig(this);
              break;
            default: 
            checkVoidCommand(this, args);
          }
        } else {
          checkVoidCommand(this, args);
        }
      } else {
        this.echo(
          ''
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
